from datetime import datetime
from app.utils.db import get_db, parse_object_id

def log_audit_event(actor_id, actor_role, action, resource_type, resource_id=None, metadata=None):
    """
    Log sensitive actions to the audit_logs collection.
    """
    try:
        db = get_db()
        doc = {
            "actor_id": parse_object_id(actor_id) if actor_id else None,
            "actor_role": actor_role,
            "action": action,
            "resource_type": resource_type,
            "resource_id": str(resource_id) if resource_id else None,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow()
        }
        db.audit_logs.insert_one(doc)
    except Exception as e:
        print(f"[AUDIT LOG ERROR] Failed to record audit log: {e}")
