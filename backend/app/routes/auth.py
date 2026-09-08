from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error, verify_password
from app.utils.audit import log_audit_event

auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    target_role = data.get("role")  # optional filter

    if not email or not password:
        return api_error("VALIDATION_ERROR", "Email and password are required.", status_code=400)

    db = get_db()
    user = db.users.find_one({"email": email})
    if not user:
        return api_error("INVALID_CREDENTIALS", "Invalid email or password.", status_code=401)

    if not verify_password(password, user.get("password_hash", "")):
        return api_error("INVALID_CREDENTIALS", "Invalid email or password.", status_code=401)

    role = user.get("role")
    if target_role and target_role != role:
        return api_error("ROLE_MISMATCH", f"This account is registered as a {role}, not as {target_role}.", status_code=403)

    if user.get("status") == "pending":
        return api_error("ACCOUNT_PENDING", "Your account registration is currently pending administrative review.", status_code=403)
    elif user.get("status") in ["rejected", "suspended"]:
        return api_error("ACCOUNT_SUSPENDED", f"Your account has been {user.get('status')}. Please contact administration.", status_code=403)

    # Fetch associated role profile
    profile_data = {}
    user_id_str = str(user["_id"])
    if role == "school":
        school = db.schools.find_one({"user_id": user["_id"]})
        if school:
            profile_data["school"] = serialize_doc(school)
    elif role == "student":
        student = db.students.find_one({"user_id": user["_id"]})
        if student:
            profile_data["student"] = serialize_doc(student)
            if student.get("team_id"):
                team = db.teams.find_one({"_id": student["team_id"]})
                if team:
                    profile_data["team"] = serialize_doc(team)
                    if team.get("school_id"):
                        school = db.schools.find_one({"_id": team["school_id"]})
                        if school:
                            profile_data["school"] = serialize_doc(school)
    elif role == "evaluator":
        evaluator = db.evaluators.find_one({"user_id": user["_id"]})
        if evaluator:
            profile_data["evaluator"] = serialize_doc(evaluator)

    # Create JWT
    additional_claims = {
        "role": role,
        "email": email,
        "name": user.get("name", "")
    }
    access_token = create_access_token(identity=user_id_str, additional_claims=additional_claims)

    log_audit_event(user_id_str, role, "USER_LOGIN", "users", user_id_str, {"email": email})

    response_data = {
        "token": access_token,
        "user": {
            "id": user_id_str,
            "email": user["email"],
            "name": user.get("name", ""),
            "role": role,
            "status": user.get("status", "active")
        },
        **profile_data
    }
    return api_response(data=response_data, message="Login successful")

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    db = get_db()
    user = db.users.find_one({"_id": parse_object_id(user_id)})
    if not user:
        return api_error("NOT_FOUND", "User profile not found", status_code=404)

    role = user.get("role")
    profile_data = {}
    if role == "school":
        school = db.schools.find_one({"user_id": user["_id"]})
        if school:
            profile_data["school"] = serialize_doc(school)
    elif role == "student":
        student = db.students.find_one({"user_id": user["_id"]})
        if student:
            profile_data["student"] = serialize_doc(student)
            if student.get("team_id"):
                team = db.teams.find_one({"_id": student["team_id"]})
                if team:
                    profile_data["team"] = serialize_doc(team)
                    if team.get("school_id"):
                        school = db.schools.find_one({"_id": team["school_id"]})
                        if school:
                            profile_data["school"] = serialize_doc(school)
    elif role == "evaluator":
        evaluator = db.evaluators.find_one({"user_id": user["_id"]})
        if evaluator:
            profile_data["evaluator"] = serialize_doc(evaluator)

    user_info = {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": role,
        "status": user.get("status", "active"),
        "created_at": user.get("created_at")
    }

    return api_response(data={"user": user_info, **profile_data})
