from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error, generate_team_code, hash_password
from app.middleware.auth_middleware import role_required
from app.utils.audit import log_audit_event

teams_bp = Blueprint("teams", __name__, url_prefix="/api/v1/teams")

@teams_bp.route("", methods=["POST"])
@role_required("school")
def create_team():
    user_id = get_jwt_identity()
    db = get_db()
    school = db.schools.find_one({"user_id": parse_object_id(user_id)})
    if not school:
        return api_error("NOT_FOUND", "School not found.", status_code=404)

    if school.get("status") != "approved":
        return api_error("FORBIDDEN", "Only approved schools with an active School Code can form competition teams.", status_code=403)

    data = request.get_json() or {}
    team_name = data.get("team_name", "").strip()
    category = data.get("category", "").strip()
    leader_name = data.get("leader_name", "").strip()
    leader_email = data.get("leader_email", "").strip().lower()
    leader_phone = data.get("leader_phone", "").strip()
    leader_grade = data.get("leader_grade", "")
    members = data.get("members", [])  # list of {name, email, grade, gender}

    if not team_name or not category or not leader_name or not leader_email:
        return api_error("VALIDATION_ERROR", "Team name, category, leader name, and leader email are required.", status_code=400)

    allowed_cats = ["VI-VIII", "IX-X", "XI-XII"]
    if category not in allowed_cats:
        return api_error("VALIDATION_ERROR", f"Category must be one of {allowed_cats}", status_code=400)

    # Generate sequential team code
    count = db.teams.count_documents({}) + 1
    team_code = generate_team_code(count)
    while db.teams.find_one({"team_code": team_code}):
        count += 1
        team_code = generate_team_code(count)

    now = datetime.utcnow()

    # Create team document first
    team_doc = {
        "team_code": team_code,
        "team_name": team_name,
        "school_id": school["_id"],
        "category": category,
        "mentor_id": None,
        "mentor_name": data.get("mentor_name", school.get("coordinator", {}).get("name", "")),
        "status": "active",
        "competition_stage": "team_formation",
        "project_id": None,
        "created_at": now,
        "updated_at": now
    }
    team_result = db.teams.insert_one(team_doc)
    team_id = team_result.inserted_id

    # Create or update team leader student account
    leader_user = db.users.find_one({"email": leader_email})
    if not leader_user:
        # Default student password
        default_pwd = data.get("leader_password") or "Student@123"
        user_res = db.users.insert_one({
            "email": leader_email,
            "password_hash": hash_password(default_pwd),
            "role": "student",
            "name": leader_name,
            "status": "active",
            "created_at": now,
            "updated_at": now
        })
        leader_user_id = user_res.inserted_id
    else:
        leader_user_id = leader_user["_id"]

    leader_doc = {
        "user_id": leader_user_id,
        "team_id": team_id,
        "school_id": school["_id"],
        "full_name": leader_name,
        "email": leader_email,
        "phone": leader_phone,
        "grade": leader_grade,
        "is_leader": True,
        "created_at": now
    }
    db.students.insert_one(leader_doc)

    # Insert additional team members
    for m in members:
        if m.get("name"):
            m_email = m.get("email", "").strip().lower()
            m_user_id = None
            if m_email:
                existing = db.users.find_one({"email": m_email})
                if not existing:
                    u_res = db.users.insert_one({
                        "email": m_email,
                        "password_hash": hash_password("Student@123"),
                        "role": "student",
                        "name": m["name"],
                        "status": "active",
                        "created_at": now,
                        "updated_at": now
                    })
                    m_user_id = u_res.inserted_id
                else:
                    m_user_id = existing["_id"]

            db.students.insert_one({
                "user_id": m_user_id,
                "team_id": team_id,
                "school_id": school["_id"],
                "full_name": m["name"],
                "email": m_email,
                "grade": m.get("grade", ""),
                "is_leader": False,
                "created_at": now
            })

    log_audit_event(str(user_id), "school", "TEAM_CREATED", "teams", str(team_id), {"team_code": team_code})

    return api_response(
        data={"team_id": str(team_id), "team_code": team_code, "team_name": team_name},
        message=f"Team '{team_name}' created successfully with code {team_code}.",
        status_code=201
    )

@teams_bp.route("/my-team", methods=["GET"])
@role_required("student")
def get_my_team():
    user_id = get_jwt_identity()
    db = get_db()
    student = db.students.find_one({"user_id": parse_object_id(user_id)})
    if not student:
        return api_error("NOT_FOUND", "Student record not found.", status_code=404)

    team_id = student.get("team_id")
    if not team_id:
        return api_error("NOT_FOUND", "Student is not enrolled in an active team.", status_code=404)

    team = db.teams.find_one({"_id": team_id})
    if not team:
        return api_error("NOT_FOUND", "Team not found.", status_code=404)

    school = db.schools.find_one({"_id": team.get("school_id")})
    members = list(db.students.find({"team_id": team_id}))
    project = db.projects.find_one({"team_id": team_id})
    quiz_attempt = db.quiz_attempts.find_one({"team_id": team_id})

    # Global active stage
    settings = db.settings.find_one({"key": "competition"}) or {}
    active_stage = settings.get("current_stage", team.get("competition_stage", "online_bootcamp"))

    payload = {
        "team": serialize_doc(team),
        "school": serialize_doc(school),
        "student": serialize_doc(student),
        "members": serialize_doc(members),
        "project": serialize_doc(project),
        "quiz_attempt": serialize_doc(quiz_attempt),
        "current_stage": active_stage
    }
    return api_response(data=payload)

@teams_bp.route("/<team_id>/members", methods=["POST"])
@jwt_required()
def add_team_member(team_id):
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    db = get_db()

    oid = parse_object_id(team_id)
    team = db.teams.find_one({"_id": oid})
    if not team:
        return api_error("NOT_FOUND", "Team not found.", status_code=404)

    # Permission check: School owning team or Student leader of this team
    if role == "school":
        school = db.schools.find_one({"user_id": parse_object_id(user_id)})
        if not school or str(school["_id"]) != str(team["school_id"]):
            return api_error("FORBIDDEN", "Not authorized to modify this team.", status_code=403)
    elif role == "student":
        student = db.students.find_one({"user_id": parse_object_id(user_id)})
        if not student or str(student.get("team_id")) != str(team["_id"]) or not student.get("is_leader"):
            return api_error("FORBIDDEN", "Only the designated team leader may add team members.", status_code=403)
    elif role != "admin":
        return api_error("FORBIDDEN", "Insufficient permissions.", status_code=403)

    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    grade = data.get("grade", "")

    if not name:
        return api_error("VALIDATION_ERROR", "Member name is required.", status_code=400)

    now = datetime.utcnow()
    m_user_id = None
    if email:
        existing = db.users.find_one({"email": email})
        if not existing:
            u_res = db.users.insert_one({
                "email": email,
                "password_hash": hash_password("Student@123"),
                "role": "student",
                "name": name,
                "status": "active",
                "created_at": now,
                "updated_at": now
            })
            m_user_id = u_res.inserted_id
        else:
            m_user_id = existing["_id"]

    new_member = {
        "user_id": m_user_id,
        "team_id": team["_id"],
        "school_id": team["school_id"],
        "full_name": name,
        "email": email,
        "grade": grade,
        "is_leader": False,
        "created_at": now
    }
    db.students.insert_one(new_member)

    return api_response(message="Team member added successfully.")
