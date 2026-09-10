import re
from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error, hash_password
from app.middleware.auth_middleware import role_required
from app.utils.audit import log_audit_event

schools_bp = Blueprint("schools", __name__, url_prefix="/api/v1/schools")

ASSAM_DISTRICTS = {
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar',
    'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh',
    'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat',
    'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar',
    'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar',
    'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
}

@schools_bp.route("/register", methods=["POST"])
def register_school():
    data = request.get_json() or {}

    # Strict Assam-only validation: Never trust frontend
    state = data.get("state", "Assam")
    if state != "Assam":
        return api_error("ELIGIBILITY_ERROR", "Registration is strictly restricted to schools located in Assam.", status_code=400)

    district = data.get("district", "").strip()
    if not district or district not in ASSAM_DISTRICTS:
        return api_error("VALIDATION_ERROR", "Invalid district. Please select one of the 33 official Assam districts.", status_code=400)

    # Validation
    required_fields = [
        "school_name", "udise_school_id", "school_type", "board", "district", "pin_code",
        "official_email", "official_phone", "principal_name", "principal_email",
        "principal_phone", "coordinator_name", "coordinator_email",
        "coordinator_phone", "password", "confirm_password"
    ]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return api_error("VALIDATION_ERROR", f"Missing required fields: {', '.join(missing)}", status_code=400)

    if data.get("password") != data.get("confirm_password"):
        return api_error("VALIDATION_ERROR", "Passwords do not match.", status_code=400)

    # Password security check
    password = data.get("password", "")
    if len(password) < 8:
        return api_error("WEAK_PASSWORD", "Password must be at least 8 characters in length.", status_code=400)

    # Mandatory UDISE format check: exactly 11 digits starting with Assam state code 18
    udise = str(data.get("udise_school_id", "")).strip()
    if not re.match(r"^18\d{9}$", udise):
        return api_error(
            "INVALID_UDISE",
            "Please enter a valid 11-digit UDISE School ID for Assam (must start with state code '18').",
            status_code=400
        )

    db = get_db()

    # Duplicate UDISE check
    if db.schools.find_one({"udise_school_id": udise}):
        return api_error("DUPLICATE_UDISE", "This UDISE School ID is already registered.", status_code=409)

    email = data.get("official_email", "").strip().lower()
    if db.users.find_one({"email": email}):
        return api_error("DUPLICATE_EMAIL", "A school account with this official email already exists.", status_code=409)

    # Create user with status 'pending'
    now = datetime.utcnow()
    user_doc = {
        "email": email,
        "password_hash": hash_password(password),
        "role": "school",
        "name": data["school_name"].strip(),
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }
    user_result = db.users.insert_one(user_doc)
    user_id = user_result.inserted_id

    # Create school document with UDISE verification status
    school_doc = {
        "user_id": user_id,
        "school_name": data["school_name"].strip(),
        "udise_school_id": udise,
        "udise_verification_status": "format_valid",
        "udise_verified_at": None,
        "udise_verified_by": None,
        "udise_verification_source": "Format Validation & Institutional Manual Review",
        "school_type": data.get("school_type", "Government Model School"),
        "board": data.get("board", "SEBA"),
        "address_line_1": data.get("address_line_1", "").strip(),
        "address_line_2": data.get("address_line_2", "").strip(),
        "district": district,
        "state": "Assam",
        "pin_code": data.get("pin_code", "").strip(),
        "official_email": email,
        "official_phone": data.get("official_phone", "").strip(),
        "website": data.get("website", "").strip(),
        "principal": {
            "name": data.get("principal_name", "").strip(),
            "email": data.get("principal_email", "").strip(),
            "phone": data.get("principal_phone", "").strip()
        },
        "coordinator": {
            "name": data.get("coordinator_name", "").strip(),
            "email": data.get("coordinator_email", "").strip(),
            "phone": data.get("coordinator_phone", "").strip(),
            "designation": data.get("coordinator_designation", "Innovation Mentor")
        },
        "school_code": None,  # Generated only upon admin approval
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }
    school_result = db.schools.insert_one(school_doc)

    # In-app notification for admin
    db.notifications.insert_one({
        "recipient_role": "admin",
        "recipient_id": None,
        "title": "New School Registration",
        "message": f"'{data['school_name']}' (UDISE: {udise}) from {district} has registered and is awaiting approval.",
        "type": "registration",
        "is_read": False,
        "created_at": now
    })

    log_audit_event(str(user_id), "school", "SCHOOL_REGISTERED", "schools", str(school_result.inserted_id), {"udise": udise})

    return api_response(
        data={"school_id": str(school_result.inserted_id), "udise_school_id": udise, "status": "pending"},
        message="Registration submitted successfully. Your application is under review by the administration.",
        status_code=201
    )

@schools_bp.route("/me", methods=["GET"])
@role_required("school")
def get_my_school():
    user_id = get_jwt_identity()
    db = get_db()
    school = db.schools.find_one({"user_id": parse_object_id(user_id)})
    if not school:
        return api_error("NOT_FOUND", "School details not found.", status_code=404)

    # Compute stats
    school_id = school["_id"]
    teams_count = db.teams.count_documents({"school_id": school_id})
    team_ids = [t["_id"] for t in db.teams.find({"school_id": school_id}, {"_id": 1})]
    students_count = db.students.count_documents({"team_id": {"$in": team_ids}})
    projects_count = db.projects.count_documents({"school_id": school_id})
    quiz_attempts_count = db.quiz_attempts.count_documents({"team_id": {"$in": team_ids}})

    data = serialize_doc(school)
    data["stats"] = {
        "total_teams": teams_count,
        "total_students": students_count,
        "projects_submitted": projects_count,
        "quiz_attempts": quiz_attempts_count
    }
    return api_response(data=data)

@schools_bp.route("/my-teams", methods=["GET"])
@role_required("school")
def get_school_teams():
    user_id = get_jwt_identity()
    db = get_db()
    school = db.schools.find_one({"user_id": parse_object_id(user_id)})
    if not school:
        return api_error("NOT_FOUND", "School record not found.", status_code=404)

    teams = list(db.teams.find({"school_id": school["_id"]}).sort("created_at", -1))
    
    # Enrich teams with members, leader and project status
    enriched = []
    for team in teams:
        team_doc = serialize_doc(team)
        members = list(db.students.find({"team_id": team["_id"]}))
        team_doc["members_detail"] = serialize_doc(members)
        project = db.projects.find_one({"team_id": team["_id"]})
        team_doc["project"] = serialize_doc(project) if project else None
        enriched.append(team_doc)

    return api_response(data=enriched)
