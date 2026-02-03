from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flaskr.API_routes.decorators.auth_decorator import auth_required
from flaskr.services.security.session_service import SessionService
from flaskr.services.security.google_auth_service import GoogleAuthService
from flaskr.services.mongodb.user_service import UserService


# Used to group views
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Login with google auth
@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    auth_data = request.get_json()
    if not auth_data:
        return jsonify({"error": "No authentication data provided"}), 400
    print("Logging in with Google Auth")

    google_auth_service: GoogleAuthService = current_app.google_auth_service
    session_service: SessionService = current_app.session_service
    user_service: UserService = current_app.user_service

    token = auth_data.get("token")
    if not token:
        return jsonify({"error": "No token provided"}), 400
    # USE TOKEN IN POSTMAN TO SEE IF COOKIE GETS SET
    print(f'START OF TOKEN: \n{token}')
    print('END OF TOKEN\n')
    # verify JWT
    decoded_user_info: dict = google_auth_service.verify_google_token(token)
    if not decoded_user_info:
        return jsonify({"error": "Invalid token"}), 401

    # Check if user already exists, else create new user_info document
    user_info: dict = user_service.get_user_info_by_email(decoded_user_info.get("email"))
    if not user_info:
        user_info = user_service.create_user({
            "display_name": decoded_user_info.get("given_name"),
            "email": decoded_user_info.get("email"),
            "picture": decoded_user_info.get("picture"),
            "login_time": datetime.now()
        })
    else: 
        # Update last login time
        user_info['login_time'] = datetime.now()
        user_service.update_user_info(user_info)

    # Create session with user_info
    session_service.create_session(user_info)
    return jsonify({"message": "Login successful", "user_info": user_info}), 200

@auth_bp.route('/logout', methods=['POST'])
@auth_required
def logout():
    session_service: SessionService = current_app.session_service
    session_service.remove_session()
    return jsonify({"message": "Logout successful"}), 200

@auth_bp.route('/whoami', methods=['GET'])
@auth_required
def whoami():
    session_service: SessionService = current_app.session_service
    user_info = session_service.get_session_user_info()
    if not user_info:
        return jsonify({"error": "No user info available"}), 404
    return jsonify({"user_info": user_info}), 200