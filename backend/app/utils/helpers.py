import re
import bcrypt
from flask import jsonify

DISTRICT_CODES = {
    "Baksa": "BAK",
    "Barpeta": "BAR",
    "Biswanath": "BIS",
    "Bongaigaon": "BON",
    "Cachar": "CAC",
    "Charaideo": "CHA",
    "Chirang": "CHI",
    "Darrang": "DAR",
    "Dhemaji": "DHE",
    "Dhubri": "DHU",
    "Dibrugarh": "DIB",
    "Dima Hasao": "DIM",
    "Goalpara": "GOA",
    "Golaghat": "GOL",
    "Hailakandi": "HAI",
    "Hojai": "HOJ",
    "Jorhat": "JOR",
    "Kamrup": "KAM",
    "Kamrup Metropolitan": "KAM",
    "Karbi Anglong": "KAR",
    "Karimganj": "KRG",
    "Kokrajhar": "KOK",
    "Lakhimpur": "LAK",
    "Majuli": "MAJ",
    "Morigaon": "MOR",
    "Nagaon": "NAG",
    "Nalbari": "NAL",
    "Sivasagar": "SIV",
    "Sonitpur": "SON",
    "South Salmara-Mankachar": "SOU",
    "Tinsukia": "TIN",
    "Udalguri": "UDA",
    "West Karbi Anglong": "WKA"
}

def get_district_code(district_name):
    if not district_name:
        return "GEN"
    for dist, code in DISTRICT_CODES.items():
        if dist.lower() == district_name.strip().lower():
            return code
    cleaned = re.sub(r"[^A-Z]", "", district_name.upper())
    return cleaned[:3] if len(cleaned) >= 3 else (cleaned + "XXX")[:3]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def generate_school_code(district: str, sequence_num: int) -> str:
    dist_code = get_district_code(district)
    return f"AFIP-AS-{dist_code}-{sequence_num:05d}"

def generate_team_code(sequence_num: int) -> str:
    return f"AFIP-T-{sequence_num:05d}"

def api_response(data=None, message="Success", status_code=200):
    payload = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(payload), status_code

def api_error(code="ERROR", message="An error occurred", fields=None, status_code=400):
    payload = {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "fields": fields or {}
        }
    }
    return jsonify(payload), status_code
