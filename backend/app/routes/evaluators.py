from datetime import datetime
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error, hash_password
from app.middleware.auth_middleware import role_required
from app.utils.audit import log_audit_event

evaluators_bp = Blueprint("evaluators", __name__, url_prefix="/api/v1/evaluators")

@evaluators_bp.route("/register", methods=["POST"])
def register_evaluator():
    data = request.get_json() or {}
    required = ["full_name", "email", "phone", "organization", "designation", "domain_expertise", "password", "confirm_password"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return api_error("VALIDATION_ERROR", f"Missing fields: {', '.join(missing)}", status_code=400)

    if data.get("password") != data.get("confirm_password"):
        return api_error("VALIDATION_ERROR", "Passwords do not match.", status_code=400)

    email = data.get("email", "").strip().lower()
    db = get_db()
    if db.users.find_one({"email": email}):
        return api_error("DUPLICATE_EMAIL", "An account with this email already exists.", status_code=409)

    now = datetime.utcnow()
    user_res = db.users.insert_one({
        "email": email,
        "password_hash": hash_password(data["password"]),
        "role": "evaluator",
        "name": data["full_name"],
        "status": "pending",
        "created_at": now,
        "updated_at": now
    })
    user_id = user_res.inserted_id

    eval_doc = {
        "user_id": user_id,
        "full_name": data["full_name"],
        "email": email,
        "phone": data.get("phone", ""),
        "organization": data.get("organization", ""),
        "designation": data.get("designation", ""),
        "domain_expertise": data.get("domain_expertise", ""),
        "years_experience": int(data.get("years_experience", 0) or 0),
        "bio": data.get("bio", ""),
        "status": "pending",
        "created_at": now,
        "updated_at": now
    }
    db.evaluators.insert_one(eval_doc)

    db.notifications.insert_one({
        "recipient_role": "admin",
        "recipient_id": None,
        "title": "New Evaluator Registration",
        "message": f"Expert '{data['full_name']}' ({data.get('organization')}) applied for evaluation panel.",
        "type": "registration",
        "is_read": False,
        "created_at": now
    })

    log_audit_event(str(user_id), "evaluator", "EVALUATOR_REGISTERED", "evaluators", str(user_id))

    return api_response(
        message="Your registration has been submitted for administrative approval.",
        data={"status": "pending"},
        status_code=201
    )

@evaluators_bp.route("/assignments", methods=["GET"])
@role_required("evaluator")
def get_evaluator_assignments():
    user_id = get_jwt_identity()
    db = get_db()
    evaluator = db.evaluators.find_one({"user_id": parse_object_id(user_id)})
    if not evaluator:
        return api_error("NOT_FOUND", "Evaluator profile not found.", status_code=404)

    # Strictly find assignments for this evaluator only
    assignments = list(db.evaluation_assignments.find({"evaluator_id": evaluator["_id"]}).sort("assigned_at", -1))
    enriched = []
    for assign in assignments:
        item = serialize_doc(assign)
        project = db.projects.find_one({"_id": assign["project_id"]})
        if project:
            item["project"] = serialize_doc(project)
            team = db.teams.find_one({"_id": project.get("team_id")})
            item["team"] = serialize_doc(team) if team else None
            school = db.schools.find_one({"_id": project.get("school_id")})
            item["school"] = serialize_doc(school) if school else None

        # Check if evaluation already recorded
        evaluation = db.evaluations.find_one({
            "assignment_id": assign["_id"],
            "evaluator_id": evaluator["_id"]
        })
        item["evaluation"] = serialize_doc(evaluation) if evaluation else None
        enriched.append(item)

    return api_response(data=enriched)

@evaluators_bp.route("/projects/<project_id>", methods=["GET"])
@role_required("evaluator")
def get_assigned_project(project_id):
    """
    STRICT AUTHORIZATION: Evaluator CANNOT browse arbitrary projects.
    Must verify an assignment exists for this evaluator and project.
    """
    user_id = get_jwt_identity()
    db = get_db()
    evaluator = db.evaluators.find_one({"user_id": parse_object_id(user_id)})
    if not evaluator:
        return api_error("NOT_FOUND", "Evaluator not found.", status_code=404)

    proj_oid = parse_object_id(project_id)
    assignment = db.evaluation_assignments.find_one({
        "project_id": proj_oid,
        "evaluator_id": evaluator["_id"]
    })
    if not assignment:
        return api_error("FORBIDDEN", "Unauthorized: This project has not been assigned to you for evaluation.", status_code=403)

    project = db.projects.find_one({"_id": proj_oid})
    if not project:
        return api_error("NOT_FOUND", "Project not found.", status_code=404)

    team = db.teams.find_one({"_id": project.get("team_id")})
    school = db.schools.find_one({"_id": project.get("school_id")})
    evaluation = db.evaluations.find_one({"assignment_id": assignment["_id"]})

    data = serialize_doc(project)
    data["team"] = serialize_doc(team)
    data["school"] = serialize_doc(school)
    data["assignment"] = serialize_doc(assignment)
    data["evaluation"] = serialize_doc(evaluation) if evaluation else None

    return api_response(data=data)

@evaluators_bp.route("/evaluate", methods=["POST"])
@role_required("evaluator")
def submit_evaluation():
    user_id = get_jwt_identity()
    db = get_db()
    evaluator = db.evaluators.find_one({"user_id": parse_object_id(user_id)})
    if not evaluator:
        return api_error("NOT_FOUND", "Evaluator not found.", status_code=404)

    data = request.get_json() or {}
    project_id = parse_object_id(data.get("project_id"))
    assignment_id = parse_object_id(data.get("assignment_id"))
    is_draft = data.get("is_draft", False)

    # Verify authorization
    assignment = db.evaluation_assignments.find_one({
        "project_id": project_id,
        "evaluator_id": evaluator["_id"]
    })
    if not assignment:
        return api_error("FORBIDDEN", "Unauthorized: You are not assigned to evaluate this submission.", status_code=403)

    existing_eval = db.evaluations.find_one({"assignment_id": assignment["_id"]})
    if existing_eval and existing_eval.get("status") == "submitted" and not existing_eval.get("is_unlocked"):
        return api_error("LOCKED", "This evaluation has been locked and submitted. Contact Admin to request reopening.", status_code=400)

    # 7-Criteria Rubric (max 100)
    scores = data.get("scores", {})
    innovation = min(20, max(0, float(scores.get("innovation", 0))))
    problem_understanding = min(15, max(0, float(scores.get("problem_understanding", 0))))
    technical_implementation = min(20, max(0, float(scores.get("technical_implementation", 0))))
    feasibility = min(15, max(0, float(scores.get("feasibility", 0))))
    social_impact = min(15, max(0, float(scores.get("social_impact", 0))))
    scalability = min(10, max(0, float(scores.get("scalability", 0))))
    presentation = min(5, max(0, float(scores.get("presentation", 0))))

    total_score = round(innovation + problem_understanding + technical_implementation + feasibility + social_impact + scalability + presentation, 2)

    now = datetime.utcnow()
    eval_doc = {
        "assignment_id": assignment["_id"],
        "project_id": project_id,
        "evaluator_id": evaluator["_id"],
        "evaluator_name": evaluator.get("full_name"),
        "scores": {
            "innovation": innovation,
            "problem_understanding": problem_understanding,
            "technical_implementation": technical_implementation,
            "feasibility": feasibility,
            "social_impact": social_impact,
            "scalability": scalability,
            "presentation": presentation,
            "total": total_score
        },
        "strengths": data.get("strengths", ""),
        "areas_for_improvement": data.get("areas_for_improvement", ""),
        "comments": data.get("comments", ""),
        "recommendation": data.get("recommendation", "Recommended"),
        "status": "draft" if is_draft else "submitted",
        "is_unlocked": False,
        "updated_at": now
    }

    if existing_eval:
        db.evaluations.update_one({"_id": existing_eval["_id"]}, {"$set": eval_doc})
        eval_id = existing_eval["_id"]
    else:
        eval_doc["created_at"] = now
        res = db.evaluations.insert_one(eval_doc)
        eval_id = res.inserted_id

    # Update assignment status
    db.evaluation_assignments.update_one(
        {"_id": assignment["_id"]},
        {"$set": {"status": "in_progress" if is_draft else "completed", "evaluated_at": now}}
    )

    # If submitted, update project and team score
    if not is_draft:
        project = db.projects.find_one({"_id": project_id})
        if project and project.get("team_id"):
            db.teams.update_one({"_id": project["team_id"]}, {"$set": {"evaluation_score": total_score}})

    log_audit_event(
        str(user_id), "evaluator",
        "EVALUATION_DRAFT_SAVED" if is_draft else "EVALUATION_SUBMITTED",
        "evaluations", str(eval_id), {"total_score": total_score}
    )

    return api_response(
        data={"evaluation_id": str(eval_id), "total_score": total_score, "status": "draft" if is_draft else "submitted"},
        message="Evaluation draft saved." if is_draft else "Evaluation submitted and locked successfully."
    )
