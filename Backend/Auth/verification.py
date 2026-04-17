from functools import wraps
from flask import request, jsonify, g
from Services.VerificationDriver import VerificationDriver
from functools import wraps
from Services.UserDriver import UserDriver
import asyncio

def verify_user_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        if not user_id:
            return jsonify({"error": "Missing X-User-Id header"}), 401

        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return jsonify({"error": "Empty token"}), 401

        res, err = VerificationDriver.confirm_user_login(user_id, token)
        if err:
            return jsonify({"error": err}), 401
        
        # Attach data to request context
        g.token = token
        g.user_id = user_id
        if "Admin" in res["roles"]:
            g.role = "Admin"
        elif "Developer" in res["roles"]:
            g.role = "Developer"
        else:
            g.role = "User"

        return func(*args, **kwargs)
    return wrapper

def verify_user_developer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        if not user_id:
            return jsonify({"error": "Missing X-User-Id header"}), 401

        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return jsonify({"error": "Empty token"}), 401

        res, err = VerificationDriver.confirm_user_developer(user_id, token)
        if err:
            return jsonify({"error": err}), 401

        # Attach data to request context
        g.token = token
        g.user_id = user_id
        g.role = "Developer"

        return func(*args, **kwargs)
    return wrapper

def verify_user_admin(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        if not user_id:
            return jsonify({"error": "Missing X-User-Id header"}), 401

        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return jsonify({"error": "Empty token"}), 401

        res, err = VerificationDriver.confirm_user_admin(user_id, token)
        if err:
            return jsonify({"error": err}), 401

        # Attach data to request context
        g.token = token
        g.user_id = user_id
        g.role = "Admin"

        return func(*args, **kwargs)
    return wrapper

def verify_user_gym_owner(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        if not user_id:
            return jsonify({"error": "Missing X-User-Id header"}), 401

        token = auth_header.replace("Bearer ", "").strip()

        if not token:
            return jsonify({"error": "Empty token"}), 401

        res, err = VerificationDriver.confirm_user_gym_owner(user_id, token)
        if err:
            return jsonify({"error": err}), 401

        # Attach data to request context
        g.token = token
        g.user_id = user_id
        g.role = "Gym Owner"

        return func(*args, **kwargs)
    return wrapper

def login_required(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        # 1. Extraction
        user_id = request.cookies.get("session_id")
        magic_bits = request.cookies.get("magic_bits")
        if not user_id:
            return jsonify({"error": "We require goodies to enter."}), 401  

        if not magic_bits:
            return jsonify({"error": "The Dragon roared too Loudly for your Magic."}), 401

        # 2. Database Verification
        is_valid, error = UserDriver._validate_token(user_id, magic_bits)
        if (not is_valid) or error:
            return jsonify({"error": f"Invalid session token. Hint: {error}"}), 401

        g.user_id = user_id  # Store user_id in Flask's global context for access in the wrapped-route
        g.magic_bits = magic_bits

        if asyncio.iscoroutinefunction(f):
            return await f(*args, **kwargs)  # async route
        return f(*args, **kwargs)            # regular sync route
    return decorated_function