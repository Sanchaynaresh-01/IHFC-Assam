import os
from app import create_app
from seed.seed_data import seed_database

app = create_app()

if __name__ == "__main__":
    # Auto-seed demo data if database is fresh
    try:
        seed_database(app)
    except Exception as e:
        print(f"[SEED NOTE] {e}")

    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print(f"=== ASSAM FUTURE INNOVATION PROGRAM BACKEND RUNNING ON PORT {port} ===")
    app.run(host="0.0.0.0", port=port, debug=debug)
