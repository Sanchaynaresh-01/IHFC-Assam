from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.utils.db import get_db, parse_object_id, serialize_doc
from app.utils.helpers import api_response, api_error

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/v1/notifications")

@notifications_bp.route("", methods=["GET"])
@jwt_required()
def get_user_notifications():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    db = get_db()

    query = {
        "$or": [
            {"recipient_id": parse_object_id(user_id)},
            {"recipient_role": role, "recipient_id": None},
            {"recipient_role": "all"}
        ]
    }
    notifs = list(db.notifications.find(query).sort("created_at", -1).limit(30))
    return api_response(data=serialize_doc(notifs))

@notifications_bp.route("/<notification_id>/read", methods=["PATCH"])
@jwt_required()
def mark_notification_read(notification_id):
    oid = parse_object_id(notification_id)
    db = get_db()
    db.notifications.update_one({"_id": oid}, {"$set": {"is_read": True}})
    return api_response(message="Notification marked as read.")
