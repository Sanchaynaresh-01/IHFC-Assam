from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error, generate_school_code
from app.middleware.auth_middleware import role_required
from app.utils.audit import log_audit_event

admin_bp = Blueprint("admin", __name__, url_prefix="/api/v1/admin")

@admin_bp.route("/stats", methods=["GET"])
@role_required("admin")
def get_admin_stats():
    db = get_db()
    total_schools = db.schools.count_documents({})
    pending_schools = db.schools.count_documents({"status": "pending"})
    approved_schools = db.schools.count_documents({"status": "approved"})

    total_teams = db.teams.count_documents({})
    total_students = db.students.count_documents({})

    total_evaluators = db.evaluators.count_documents({})
    approved_evaluators = db.evaluators.count_documents({"status": "approved"})
    pending_evaluators = db.evaluators.count_documents({"status": "pending"})

    projects_submitted = db.projects.count_documents({"status": {"$in": ["submitted", "evaluated"]}})
    total_assignments = db.evaluation_assignments.count_documents({})
    completed_evals = db.evaluations.count_documents({"status": "submitted"})
    pending_evaluations = total_assignments - completed_evals

    quiz_attempts = db.quiz_attempts.count_documents({})

    # Aggregations for charts
    teams_by_cat = {
        "VI-VIII": db.teams.count_documents({"category": "VI-VIII"}),
        "IX-X": db.teams.count_documents({"category": "IX-X"}),
        "XI-XII": db.teams.count_documents({"category": "XI-XII"})
    }

    # District distribution
    district_counts = {}
    for s in db.schools.find({}, {"district": 1}):
        d = s.get("district", "Kamrup")
        district_counts[d] = district_counts.get(d, 0) + 1

    settings = db.settings.find_one({"key": "competition"}) or {}

    stats = {
        "total_schools": total_schools,
        "pending_schools": pending_schools,
        "approved_schools": approved_schools,
        "total_teams": total_teams,
        "total_students": total_students,
        "approved_evaluators": approved_evaluators,
        "pending_evaluators": pending_evaluators,
        "projects_submitted": projects_submitted,
        "pending_evaluations": max(0, pending_evaluations),
        "completed_evaluations": completed_evals,
        "quiz_attempts": quiz_attempts,
        "current_stage": settings.get("current_stage", "online_bootcamp"),
        "leaderboard_public": settings.get("leaderboard_public", True),
        "charts": {
            "teams_by_category": teams_by_cat,
            "schools_by_district": district_counts
        }
    }
    return api_response(data=stats)

@admin_bp.route("/schools", methods=["GET"])
@role_required("admin")
def list_schools():
    db = get_db()
    status = request.args.get("status")
    district = request.args.get("district")
    search = request.args.get("search", "").strip()

    query = {}
    if status and status != "all":
        query["status"] = status
    if district and district != "all":
        query["district"] = district
    if search:
        query["$or"] = [
            {"school_name": {"$regex": search, "$options": "i"}},
            {"school_code": {"$regex": search, "$options": "i"}},
            {"official_email": {"$regex": search, "$options": "i"}}
        ]

    schools = list(db.schools.find(query).sort("created_at", -1))
    enriched = []
    for s in schools:
        s_doc = serialize_doc(s)
        s_doc["teams_count"] = db.teams.count_documents({"school_id": s["_id"]})
        enriched.append(s_doc)

    return api_response(data=enriched)

@admin_bp.route("/schools/<school_id>/status", methods=["PATCH"])
@role_required("admin")
def update_school_status(school_id):
    user_id = get_jwt_identity()
    db = get_db()
    oid = parse_object_id(school_id)
    school = db.schools.find_one({"_id": oid})
    if not school:
        return api_error("NOT_FOUND", "School not found.", status_code=404)

    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ["approved", "rejected", "suspended", "pending"]:
        return api_error("VALIDATION_ERROR", "Invalid status.", status_code=400)

    now = datetime.utcnow()
    update_doc = {"status": new_status, "updated_at": now}

    # If approving and school doesn't have a code, generate one
    generated_code = school.get("school_code")
    if new_status == "approved" and not generated_code:
        count = db.schools.count_documents({"status": "approved"}) + 1
        generated_code = generate_school_code(school.get("district", "Kamrup"), count)
        while db.schools.find_one({"school_code": generated_code}):
            count += 1
            generated_code = generate_school_code(school.get("district", "Kamrup"), count)
        update_doc["school_code"] = generated_code

    db.schools.update_one({"_id": oid}, {"$set": update_doc})
    db.users.update_one({"_id": school["user_id"]}, {"$set": {"status": new_status, "updated_at": now}})

    # Notification for the school
    db.notifications.insert_one({
        "recipient_role": "school",
        "recipient_id": school["user_id"],
        "title": f"School Application {new_status.capitalize()}",
        "message": f"Your school application has been {new_status}." + (f" Your unique School Code is {generated_code}." if generated_code else ""),
        "type": "approval",
        "is_read": False,
        "created_at": now
    })

    log_audit_event(str(user_id), "admin", f"SCHOOL_{new_status.upper()}", "schools", str(oid), {"school_code": generated_code})

    return api_response(
        data={"status": new_status, "school_code": generated_code},
        message=f"School status updated to '{new_status}' successfully."
    )

@admin_bp.route("/evaluators", methods=["GET"])
@role_required("admin")
def list_evaluators():
    db = get_db()
    status = request.args.get("status")
    query = {}
    if status and status != "all":
        query["status"] = status

    evaluators = list(db.evaluators.find(query).sort("created_at", -1))
    enriched = []
    for e in evaluators:
        e_doc = serialize_doc(e)
        e_doc["assigned_count"] = db.evaluation_assignments.count_documents({"evaluator_id": e["_id"]})
        e_doc["completed_count"] = db.evaluations.count_documents({"evaluator_id": e["_id"], "status": "submitted"})
        enriched.append(e_doc)

    return api_response(data=enriched)

@admin_bp.route("/evaluators/<evaluator_id>/status", methods=["PATCH"])
@role_required("admin")
def update_evaluator_status(evaluator_id):
    user_id = get_jwt_identity()
    db = get_db()
    oid = parse_object_id(evaluator_id)
    evaluator = db.evaluators.find_one({"_id": oid})
    if not evaluator:
        return api_error("NOT_FOUND", "Evaluator not found.", status_code=404)

    data = request.get_json() or {}
    new_status = data.get("status")
    if new_status not in ["approved", "rejected", "suspended", "pending"]:
        return api_error("VALIDATION_ERROR", "Invalid status.", status_code=400)

    now = datetime.utcnow()
    db.evaluators.update_one({"_id": oid}, {"$set": {"status": new_status, "updated_at": now}})
    db.users.update_one({"_id": evaluator["user_id"]}, {"$set": {"status": new_status, "updated_at": now}})

    log_audit_event(str(user_id), "admin", f"EVALUATOR_{new_status.upper()}", "evaluators", str(oid))

    return api_response(message=f"Evaluator status updated to '{new_status}'.")

@admin_bp.route("/assignments", methods=["POST"])
@role_required("admin")
def assign_project():
    user_id = get_jwt_identity()
    db = get_db()
    data = request.get_json() or {}
    project_id = parse_object_id(data.get("project_id"))
    evaluator_id = parse_object_id(data.get("evaluator_id"))

    if not project_id or not evaluator_id:
        return api_error("VALIDATION_ERROR", "project_id and evaluator_id are required.", status_code=400)

    project = db.projects.find_one({"_id": project_id})
    if not project:
        return api_error("NOT_FOUND", "Project not found.", status_code=404)

    evaluator = db.evaluators.find_one({"_id": evaluator_id, "status": "approved"})
    if not evaluator:
        return api_error("BAD_REQUEST", "Evaluator not found or not yet approved.", status_code=400)

    # Check for duplicate
    existing = db.evaluation_assignments.find_one({"project_id": project_id, "evaluator_id": evaluator_id})
    if existing:
        return api_error("DUPLICATE", "This project is already assigned to this evaluator.", status_code=409)

    now = datetime.utcnow()
    assign_doc = {
        "project_id": project_id,
        "evaluator_id": evaluator_id,
        "assigned_by": parse_object_id(user_id),
        "assigned_at": now,
        "deadline": data.get("deadline", "2026-12-20T23:59:59Z"),
        "status": "assigned"
    }
    res = db.evaluation_assignments.insert_one(assign_doc)

    # Notification to evaluator
    db.notifications.insert_one({
        "recipient_role": "evaluator",
        "recipient_id": evaluator["user_id"],
        "title": "New Project Assigned for Evaluation",
        "message": f"Project '{project.get('title')}' has been assigned to you.",
        "type": "assignment",
        "is_read": False,
        "created_at": now
    })

    log_audit_event(str(user_id), "admin", "PROJECT_ASSIGNED", "evaluation_assignments", str(res.inserted_id))

    return api_response(message="Project successfully assigned to evaluator.", data={"assignment_id": str(res.inserted_id)})

@admin_bp.route("/stage", methods=["POST", "PATCH"])
@role_required("admin")
def update_competition_stage():
    user_id = get_jwt_identity()
    db = get_db()
    data = request.get_json() or {}
    new_stage = data.get("stage")

    stages = [
        "school_registration", "mentor_onboarding", "team_formation",
        "online_bootcamp", "mcq_assessment", "top_1000", "advanced_bootcamp",
        "coding_challenge", "shortlist_198", "zonal_hackathon",
        "finalist_preparation", "state_final"
    ]
    if new_stage not in stages:
        return api_error("VALIDATION_ERROR", f"Stage must be one of: {stages}", status_code=400)

    db.settings.update_one(
        {"key": "competition"},
        {"$set": {"current_stage": new_stage, "updated_at": datetime.utcnow()}},
        upsert=True
    )

    log_audit_event(str(user_id), "admin", "COMPETITION_STAGE_UPDATED", "settings", None, {"new_stage": new_stage})

    return api_response(message=f"Active competition stage updated to '{new_stage}'.")

@admin_bp.route("/leaderboard-visibility", methods=["PATCH"])
@role_required("admin")
def toggle_leaderboard_visibility():
    user_id = get_jwt_identity()
    db = get_db()
    data = request.get_json() or {}
    is_public = bool(data.get("is_public", True))

    db.settings.update_one(
        {"key": "competition"},
        {"$set": {"leaderboard_public": is_public, "updated_at": datetime.utcnow()}},
        upsert=True
    )

    log_audit_event(str(user_id), "admin", "LEADERBOARD_VISIBILITY_TOGGLED", "settings", None, {"is_public": is_public})

    return api_response(message=f"Leaderboard visibility set to {'PUBLIC' if is_public else 'HIDDEN'}.")

@admin_bp.route("/audit-logs", methods=["GET"])
@role_required("admin")
def get_audit_logs():
    db = get_db()
    logs = list(db.audit_logs.find().sort("timestamp", -1).limit(50))
    return api_response(data=serialize_doc(logs))

@admin_bp.route("/projects", methods=["GET"])
@role_required("admin")
def list_all_projects():
    db = get_db()
    projects = list(db.projects.find().sort("created_at", -1))
    enriched = []
    for p in projects:
        p_doc = serialize_doc(p)
        team = db.teams.find_one({"_id": p.get("team_id")})
        school = db.schools.find_one({"_id": p.get("school_id")})
        p_doc["team"] = serialize_doc(team) if team else None
        p_doc["school"] = serialize_doc(school) if school else None
        eval_count = db.evaluations.count_documents({"project_id": p["_id"], "status": "submitted"})
        p_doc["evaluation_count"] = eval_count
        enriched.append(p_doc)
    return api_response(data=enriched)
