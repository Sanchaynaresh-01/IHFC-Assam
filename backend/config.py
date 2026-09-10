import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "afip_default_secret_key_2026")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "afip_jwt_default_key_2026")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/afip_database")
    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_HEADER_TYPE = "Bearer"
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")

class TestConfig(Config):
    TESTING = True
    DEBUG = False
    MONGO_URI = "mongomock://localhost/afip_test_database"
