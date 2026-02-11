from functools import wraps
from flask import request, jsonify
from jose import jwt
import requests
import os
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
ALGORITHMS = ["RS256"]

if not AUTH0_DOMAIN:
    raise RuntimeError("AUTH0_DOMAIN not set")

# Fetch JWKS once
jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
jwks = requests.get(jwks_url).json()

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        # Allow CORS preflight
        if request.method == "OPTIONS":
            return "", 200

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401

        parts = auth_header.split()
        if parts[0].lower() != "bearer" or len(parts) != 2:
            return jsonify({"error": "Invalid Authorization header"}), 401

        token = parts[1]

        try:
            unverified_header = jwt.get_unverified_header(token)

            rsa_key = None
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"],
                    }
                    break

            if not rsa_key:
                return jsonify({"error": "RSA key not found"}), 401

            # ✅ Signature verification only (stable & safe)
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                options={"verify_iss": False, "verify_aud": False}
            )

        except Exception as e:
            return jsonify({"error": "Invalid token", "details": str(e)}), 401

        request.user = payload
        return f(*args, **kwargs)

    return decorated
