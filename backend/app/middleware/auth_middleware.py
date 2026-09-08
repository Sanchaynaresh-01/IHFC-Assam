from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from app.utils.helpers import api_error
from app.utils.db import get_db, parse_object_id

def role_required(*allowed_roles):
    """
    Decorator to ensure request has valid JWT and identity matches one of allowed_roles.
    Usage: @role_required('admin') or @role_required('admin', 'school')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
            except Exception as e:
                return api_error("UNAUTHORIZED", f"Authentication token invalid or missing: {str(e)}", status_code=401)
            
            claims = get_jwt()
            role = claims.get("role")
            if not role or (allowed_roles and role not in allowed_roles):
                return api_error("FORBIDDEN", f"Access forbidden for role '{role}'. Allowed: {list(allowed_roles)}", status_code=403)
            
            user_id = get_jwt_identity()
            db = get_db()
            user = db.users.find_one({"_id": parse_object_id(user_id)})
            if not user:
                return api_error("UNAUTHORIZED", "User profile not found", status_code=401)
            if user.get("status") in ["suspended", "rejected"]:
                return api_error("ACCOUNT_INACTIVE", f"Account status is '{user.get('status')}'", status_code=403)

            return fn(*args, **kwargs)
        return wrapper
    return decorator

def get_current_user_context():
    """
    Helper function to return (user_id, role, user_doc)
    """
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")
    db = get_db()
    user = db.users.find_one({"_id": parse_object_id(user_id)})
    return user_id, role, user
