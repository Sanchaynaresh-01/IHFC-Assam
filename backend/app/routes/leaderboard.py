from flask import Blueprint, request
from app.utils.db import get_db, serialize_doc
from app.utils.helpers import api_response, api_error

leaderboard_bp = Blueprint("leaderboard", __name__, url_prefix="/api/v1")

@leaderboard_bp.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    db = get_db()
    settings = db.settings.find_one({"key": "competition"}) or {}
    is_public = settings.get("leaderboard_public", True)

    if not is_public:
        return api_response(
            data={"is_public": False, "entries": []},
            message="Leaderboard will be published after official evaluation by the jury committee."
        )

    category = request.args.get("category")
    district = request.args.get("district")
    stage = request.args.get("stage")

    query = {"status": "active"}
    if category and category != "all":
        query["category"] = category
    if stage and stage != "all":
        query["competition_stage"] = stage

    # Fetch teams
    teams = list(db.teams.find(query))

    entries = []
    for team in teams:
        school = db.schools.find_one({"_id": team.get("school_id")})
        if district and district != "all" and school and school.get("district") != district:
            continue

        score = team.get("evaluation_score") or team.get("quiz_score") or 0
        entries.append({
            "id": str(team["_id"]),
            "team_code": team.get("team_code"),
            "team_name": team.get("team_name"),
            "category": team.get("category"),
            "competition_stage": team.get("competition_stage", "team_formation"),
            "school_name": school.get("school_name", "Assam Innovation School") if school else "Assam School",
            "district": school.get("district", "Kamrup") if school else "Kamrup",
            "score": round(score, 1)
        })

    # Sort descending by score
    entries.sort(key=lambda x: x["score"], reverse=True)
    # Assign ranks
    for idx, item in enumerate(entries):
        item["rank"] = idx + 1

    return api_response(data={"is_public": True, "entries": entries})

@leaderboard_bp.route("/innovations", methods=["GET"])
def get_public_innovations():
    db = get_db()
    theme = request.args.get("theme")
    category = request.args.get("category")

    query = {"is_showcased": True}
    if theme and theme != "all":
        query["theme"] = theme
    if category and category != "all":
        query["category"] = category

    projects = list(db.projects.find(query).limit(50))
    # If few showcased in db, also show submitted projects for a rich showcase experience
    if len(projects) < 5:
        more = list(db.projects.find({"status": {"$in": ["submitted", "evaluated"]}}).limit(20))
        for m in more:
            if not any(str(p["_id"]) == str(m["_id"]) for p in projects):
                projects.append(m)

    enriched = []
    for p in projects:
        item = serialize_doc(p)
        team = db.teams.find_one({"_id": p.get("team_id")})
        school = db.schools.find_one({"_id": p.get("school_id")})
        item["team_name"] = team.get("team_name") if team else "Innovator Team"
        item["school_name"] = school.get("school_name") if school else "Assam School"
        item["district"] = school.get("district") if school else "Kamrup"
        enriched.append(item)

    return api_response(data=enriched)
