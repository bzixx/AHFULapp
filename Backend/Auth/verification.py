from functools import wraps
from flask import request, jsonify, g
from Services.VerificationDriver import VerificationDriver
from functools import wraps
import asyncio

def login_required_user(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        # 1. Extraction
        user_id = request.cookies.get("session_id")
        magic_bits = request.cookies.get("magic_bits")
        if not user_id:
            return jsonify({"authenticated": False, "error": "We require goodies to enter."}), 200  

        if not magic_bits:
            return jsonify({"authenticated": False, "error": "The Dragon roared too Loudly for your Magic."}), 200

        magic_bits = magic_bits[-32:]

        # 2. Database Verification
        res, err = VerificationDriver.confirm_user_login(user_id, magic_bits)
        if err:
            return jsonify({"authenticated": False, "error": f"Invalid session token. Hint: {err}"}), 200

        g.user_id = user_id  # Store user_id in Flask's global context for access in the wrapped-route
        g.token = magic_bits

        if "Admin" in res["roles"]:
            g.role = "Admin"
        elif "Developer" in res["roles"]:
            g.role = "Developer"
        else:
            g.role = "User"

        if asyncio.iscoroutinefunction(f):
            return await f(*args, **kwargs)  # async route
        return f(*args, **kwargs)            # regular sync route
    return decorated_function

def login_required_dev(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        # 1. Extraction
        user_id = request.cookies.get("session_id")
        magic_bits = request.cookies.get("magic_bits")
        if not user_id:
            return jsonify({"authenticated": False, "error": "We require goodies to enter."}), 200

        if not magic_bits:
            return jsonify({"authenticated": False, "error": "The Dragon roared too Loudly for your Magic."}), 200

        magic_bits = magic_bits[-32:]

        # 2. Database Verification
        res, err = VerificationDriver.confirm_user_developer(user_id, magic_bits)
        if err:
            return jsonify({"authenticated": False, "error": f"Invalid session token. Hint: {err}"}), 200

        g.user_id = user_id  # Store user_id in Flask's global context for access in the wrapped-route
        g.token = magic_bits
        g.role = "Developer"

        if asyncio.iscoroutinefunction(f):
            return await f(*args, **kwargs)  # async route
        return f(*args, **kwargs)            # regular sync route
    return decorated_function

def login_required_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 1. Extraction
        user_id = request.cookies.get("session_id")
        magic_bits = request.cookies.get("magic_bits")
        if not user_id:
            return jsonify({"authenticated": False, "error": "We require goodies to enter."}), 200

        if not magic_bits:
            return jsonify({"authenticated": False, "error": "The Dragon roared too Loudly for your Magic."}), 200

        magic_bits = magic_bits[-32:]

        # 2. Database Verification
        res, err = VerificationDriver.confirm_user_admin(user_id, magic_bits)
        if err:
            return jsonify({"authenticated": False, "error": f"Invalid session token. Hint: {err}"}), 200

        g.user_id = user_id  # Store user_id in Flask's global context for access in the wrapped-route
        g.token = magic_bits
        g.role = "Admin"

        # if asyncio.iscoroutinefunction(f):
        #     return await f(*args, **kwargs)  # async route
        return f(*args, **kwargs)            # regular sync route
    return decorated_function

def login_required_gym_owner(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 1. Extraction
        user_id = request.cookies.get("session_id")
        magic_bits = request.cookies.get("magic_bits")
        if not user_id:
            return jsonify({"authenticated": False, "error": "We require goodies to enter."}), 200

        if not magic_bits:
            return jsonify({"authenticated": False, "error": "The Dragon roared too Loudly for your Magic."}), 200

        magic_bits = magic_bits[-32:]

        # 2. Database Verification
        res, err = VerificationDriver.confirm_user_gym_owner(user_id, magic_bits)
        if err:
            return jsonify({"authenticated": False, "error": f"Invalid session token. Hint: {err}"}), 200

        g.user_id = user_id  # Store user_id in Flask's global context for access in the wrapped-route
        g.token = magic_bits
        g.role = "Developer"

        # if asyncio.iscoroutinefunction(f):
        #     return await f(*args, **kwargs)  # async route
        return f(*args, **kwargs)            # regular sync route
    return decorated_function
