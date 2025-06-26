import jwt
import os
from flask import request, jsonify
from functools import wraps

def generate_token(email):
    payload = {"email": email}
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

def verify_token(token):
    try:
        decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return decoded['email']
    except:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Missing token"}), 401
        user_email = verify_token(token)
        if not user_email:
            return jsonify({"error": "Invalid token"}), 401
        return f(user_email, *args, **kwargs)
    return decorated
