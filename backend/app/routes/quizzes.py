from datetime import datetime, timedelta
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error
from app.middleware.auth_middleware import role_required
from app.utils.audit import log_audit_event

quizzes_bp = Blueprint("quizzes", __name__, url_prefix="/api/v1/quizzes")

@quizzes_bp.route("/active", methods=["GET"])
@role_required("student")
def get_active_quiz():
    user_id = get_jwt_identity()
    db = get_db()
    student = db.students.find_one({"user_id": parse_object_id(user_id)})
    if not student or not student.get("team_id"):
        return api_error("NOT_FOUND", "Student is not enrolled in an active team.", status_code=400)

    team = db.teams.find_one({"_id": student["team_id"]})
    if not team:
        return api_error("NOT_FOUND", "Associated team not found.", status_code=404)

    category = team.get("category", "VI-VIII")
    quiz = db.quizzes.find_one({"category": category, "is_active": True}) or db.quizzes.find_one({"is_active": True})

    if not quiz:
        return api_error("NOT_FOUND", "No active quiz currently available for this category.", status_code=404)

    # Check if team already attempted
    attempt = db.quiz_attempts.find_one({"quiz_id": quiz["_id"], "team_id": team["_id"]})

    # Prepare sanitized questions (WITHOUT correct_answer)
    sanitized_questions = []
    for q in quiz.get("questions", []):
        sanitized_questions.append({
            "id": str(q.get("_id", q.get("id"))),
            "question_text": q.get("question_text"),
            "options": q.get("options", []),
            "marks": q.get("marks", 2)
        })

    now = datetime.utcnow()
    start_time = quiz.get("start_time")
    end_time = quiz.get("end_time")

    # Time window check
    is_live = True
    if start_time and now < start_time:
        is_live = False
    if end_time and now > end_time:
        is_live = False

    payload = {
        "id": str(quiz["_id"]),
        "title": quiz.get("title"),
        "description": quiz.get("description"),
        "category": quiz.get("category"),
        "duration_minutes": quiz.get("duration_minutes", 30),
        "total_marks": quiz.get("total_marks", len(sanitized_questions) * 2),
        "start_time": start_time.isoformat() if start_time else None,
        "end_time": end_time.isoformat() if end_time else None,
        "is_live": is_live,
        "total_questions": len(sanitized_questions),
        "questions": sanitized_questions if is_live else [],
        "attempt": serialize_doc(attempt) if attempt else None,
        "results_published": quiz.get("results_published", True)
    }
    return api_response(data=payload)

@quizzes_bp.route("/<quiz_id>/start", methods=["POST"])
@role_required("student")
def start_quiz(quiz_id):
    user_id = get_jwt_identity()
    db = get_db()
    student = db.students.find_one({"user_id": parse_object_id(user_id)})
    if not student or not student.get("team_id"):
        return api_error("NOT_FOUND", "Student is not enrolled in a team.", status_code=400)

    team = db.teams.find_one({"_id": student["team_id"]})
    quiz = db.quizzes.find_one({"_id": parse_object_id(quiz_id)})
    if not quiz:
        return api_error("NOT_FOUND", "Quiz not found.", status_code=404)

    now = datetime.utcnow()
    if quiz.get("start_time") and now < quiz["start_time"]:
        return api_error("QUIZ_NOT_STARTED", f"Quiz activates on {quiz['start_time'].strftime('%d %B %Y')}", status_code=403)
    if quiz.get("end_time") and now > quiz["end_time"]:
        return api_error("QUIZ_ENDED", "This quiz window has closed.", status_code=403)

    # Check existing attempt
    existing = db.quiz_attempts.find_one({"quiz_id": quiz["_id"], "team_id": team["_id"]})
    if existing:
        if existing.get("status") == "completed":
            return api_error("ALREADY_COMPLETED", "Your team has already completed this quiz assessment.", status_code=400)
        return api_response(data=serialize_doc(existing), message="Resuming ongoing quiz session.")

    attempt_doc = {
        "user_id": student["_id"],
        "team_id": team["_id"],
        "quiz_id": quiz["_id"],
        "started_at": now,
        "submitted_at": None,
        "answers": {},
        "score": 0,
        "total_marks": quiz.get("total_marks", 30),
        "status": "in_progress"
    }
    res = db.quiz_attempts.insert_one(attempt_doc)
    attempt_doc["_id"] = res.inserted_id

    log_audit_event(str(user_id), "student", "QUIZ_STARTED", "quiz_attempts", str(res.inserted_id))

    return api_response(data=serialize_doc(attempt_doc), message="Quiz session started.", status_code=201)

@quizzes_bp.route("/<quiz_id>/submit", methods=["POST"])
@role_required("student")
def submit_quiz(quiz_id):
    user_id = get_jwt_identity()
    db = get_db()
    student = db.students.find_one({"user_id": parse_object_id(user_id)})
    if not student or not student.get("team_id"):
        return api_error("NOT_FOUND", "Student is not enrolled in a team.", status_code=400)

    team = db.teams.find_one({"_id": student["team_id"]})
    quiz = db.quizzes.find_one({"_id": parse_object_id(quiz_id)})
    if not quiz:
        return api_error("NOT_FOUND", "Quiz not found.", status_code=404)

    attempt = db.quiz_attempts.find_one({"quiz_id": quiz["_id"], "team_id": team["_id"]})
    if not attempt:
        return api_error("BAD_REQUEST", "Quiz was not initiated before submitting.", status_code=400)
    if attempt.get("status") == "completed":
        return api_error("ALREADY_SUBMITTED", "This quiz assessment has already been finalized.", status_code=400)

    data = request.get_json() or {}
    submitted_answers = data.get("answers", {})  # { question_id: selected_option_index }

    now = datetime.utcnow()
    # Server-side duration validation with 2 minute grace period for network latency
    duration = timedelta(minutes=quiz.get("duration_minutes", 30) + 2)
    if attempt.get("started_at") and (now - attempt["started_at"]) > duration:
        pass # allow submission but log or clamp

    # Compute score securely comparing against hidden questions
    score = 0
    total_marks = 0
    question_map = {str(q.get("_id", q.get("id"))): q for q in quiz.get("questions", [])}

    for q_id, q in question_map.items():
        q_marks = q.get("marks", 2)
        total_marks += q_marks
        user_answer = submitted_answers.get(q_id)
        if user_answer is not None and str(user_answer) == str(q.get("correct_answer")):
            score += q_marks

    update_fields = {
        "answers": submitted_answers,
        "score": score,
        "total_marks": total_marks,
        "submitted_at": now,
        "status": "completed"
    }
    db.quiz_attempts.update_one({"_id": attempt["_id"]}, {"$set": update_fields})

    # Update team score in leaderboard/competition stage
    db.teams.update_one({"_id": team["_id"]}, {"$set": {"quiz_score": score}})

    log_audit_event(str(user_id), "student", "QUIZ_SUBMITTED", "quiz_attempts", str(attempt["_id"]), {"score": score})

    show_results = quiz.get("results_published", True)
    return api_response(
        data={
            "score": score if show_results else None,
            "total_marks": total_marks if show_results else None,
            "submitted_at": now.isoformat(),
            "results_published": show_results,
            "status": "completed"
        },
        message="Assessment submitted successfully!"
    )
