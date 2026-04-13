from functools import wraps
from flask import request, jsonify, g
from Services.VerificationDriver import VerificationDriver

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