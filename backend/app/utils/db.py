import logging
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import mongomock

logger = logging.getLogger(__name__)

_mongo_client = None
_database = None

def init_db(app):
    global _mongo_client, _database
    mongo_uri = app.config.get("MONGO_URI", "mongodb://localhost:27017/afip_database")
    is_testing = app.config.get("TESTING", False)

    if is_testing or mongo_uri.startswith("mongomock://"):
        logger.info("[DB] Using mongomock for testing environment.")
        _mongo_client = mongomock.MongoClient()
        _database = _mongo_client.afip_database
        _setup_indexes(_database)
        return _database

    try:
        # Fast 2-second timeout to check live MongoDB connectivity
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.admin.command("ping")
        _mongo_client = client
        # Extract db name from URI or fallback to afip_database
        db_name = mongo_uri.rstrip("/").split("/")[-1].split("?")[0] or "afip_database"
        _database = _mongo_client[db_name]
        logger.info(f"[DB] Successfully connected to live MongoDB database: {db_name}")
    except (ServerSelectionTimeoutError, ConnectionFailure, Exception) as e:
        logger.warning(f"[DB] Live MongoDB server unavailable ({e}). Fallback to mongomock for zero-config demo operation.")
        _mongo_client = mongomock.MongoClient()
        _database = _mongo_client.afip_database

    _setup_indexes(_database)
    return _database

def get_db():
    global _database
    if _database is None:
        _mongo_client = mongomock.MongoClient()
        _database = _mongo_client.afip_database
        _setup_indexes(_database)
    return _database

def _setup_indexes(db):
    try:
        db.users.create_index([("email", ASCENDING)], unique=True)
        db.schools.create_index([("school_code", ASCENDING)], unique=True, sparse=True)
        db.schools.create_index([("user_id", ASCENDING)])
        db.teams.create_index([("team_code", ASCENDING)], unique=True, sparse=True)
        db.teams.create_index([("school_id", ASCENDING)])
        db.evaluation_assignments.create_index(
            [("project_id", ASCENDING), ("evaluator_id", ASCENDING)], unique=True
        )
    except Exception as e:
        logger.debug(f"[DB] Index creation note: {e}")

def serialize_doc(doc):
    """Recursively convert ObjectId and datetime to serializable primitives."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = [serialize_doc(v) for v in value]
            else:
                result[key] = value
        if "_id" in result and "id" not in result:
            result["id"] = result["_id"]
        return result
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc

def parse_object_id(oid_str):
    if not oid_str:
        return None
    try:
        return ObjectId(oid_str)
    except Exception:
        return None
