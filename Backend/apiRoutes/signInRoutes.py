from flask import Blueprint, request, jsonify, current_app
from services.SignInDriver import SignInDriver
from services.UserDriver import UserDriver
from datetime import datetime

# Used to group views
signInRouteBlueprint = Blueprint('signIn', __name__, url_prefix='/signIn')

# Login with google auth
@signInRouteBlueprint.route('/google-login', methods=['POST'])
def google_login():
    postAuthData = request.get_json()
    if not postAuthData:
        return jsonify({"error": "No authentication data provided"}), 400
    print("Logging in with AHFUL Google Auth")

    routeSignInDriver: SignInDriver = current_app.AHFULsignInDriver
    #session_service: SessionService = current_app.session_service

    token = postAuthData.get("token")
    if not token:
        return jsonify({"error": "No token provided"}), 400
    
    # USE TOKEN IN POSTMAN TO SEE IF COOKIE GETS SET
    print(f'START OF TOKEN: \n{token}')
    print('END OF TOKEN\n')

    # verify JWT
    decoded_user_info: dict = routeSignInDriver.verify_google_token(token)
    if not decoded_user_info:
        return jsonify({"error": "Invalid token"}), 401

    # Check if user already exists, else create new user_info document
    user_info: dict = UserDriver.get_user_by_email(decoded_user_info.get("email"))
    if not user_info:
        user_info = UserDriver.create_user({
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

@signInRouteBlueprint.route('/logout', methods=['POST'])
def logout():
    session_service: SessionService = current_app.session_service
    session_service.remove_session()
    return jsonify({"message": "Logout successful"}), 200

@signInRouteBlueprint.route('/whoami', methods=['GET'])
def whoami():
    session_service: SessionService = current_app.session_service
    user_info = session_service.get_session_user_info()
    if not user_info:
        return jsonify({"error": "No user info available"}), 404
    return jsonify({"user_info": user_info}), 200