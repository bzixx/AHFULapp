from functools import wraps
from flask import session, jsonify

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if the user already has an active session
        # print("Checking authentication for session:", session)
        if not 'user_info' in session:
            print("User is NOT authenticated")
            return jsonify({"error": "Unauthorized"}), 401
        print("User is authenticated")
        return f(*args, **kwargs)
    return decorated_function