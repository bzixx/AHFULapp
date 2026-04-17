from functools import wraps
from flask import request, jsonify, g # 'g' is Flask's global temp storage
from Services.UserDriver import UserDriver


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
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

        return f(*args, **kwargs)
    return decorated_function