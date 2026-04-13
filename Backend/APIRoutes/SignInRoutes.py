from flask import Blueprint, request, jsonify, current_app
from Services.SignInDriver import SignInDriver
from Services.UserDriver import UserDriver
from datetime import datetime
from time import time
from math import trunc

# Used to group views
signInRouteBlueprint = Blueprint('auth', __name__, url_prefix='/AHFULauth')

# ── POST Login with Google Auth ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/google-login', methods=['POST'])
def google_login():
    postAuthData = request.get_json()
    if not postAuthData:
        return jsonify({"error": "No authentication data provided"}), 400
    print("Logging in with AHFUL Google Auth")

    routeSignInDriver: SignInDriver = current_app.AHFULSignInDriver
    #session_service: SessionService = current_app.session_service

    token = postAuthData.get("token")
    if not token:
        return jsonify({"error": "No google token provided to the Backend.  You cannot login without something to login with.  What is this? Anarchy?"}), 400

    # verify JWT
    decodedUserInfo: dict = routeSignInDriver.verify_google_token(token)
    print(decodedUserInfo)
    if not decodedUserInfo:
        return jsonify({"error": "Invalid google token provided to Backend.  Dont come in here with Sloppily Copied Keys."}), 401

    tokenBits = token[-32:] 

    # Check if user already exists, else create new user_info document
    #TODO: Look at this because i checks based on email. 
    routeUserObject, error = UserDriver.get_user_by_email(decodedUserInfo.get("email"))

    if not routeUserObject:
        routeUserObject = UserDriver.create_user({
            "name": decodedUserInfo.get("name"),
            "email": decodedUserInfo.get("email"),
            "picture": decodedUserInfo.get("picture"),
            "last_login_time": trunc(time()),
            "last_login_expire" : decodedUserInfo.get("exp"),
            "roles": ["user"],
            "updated_at": datetime.now(),
            "magic_bits" : tokenBits
        })
    else: 
        # Disabled user check in sign in, untested
        if routeUserObject.get('deactivated', False):
            return jsonify({"error": "Your account has been disabled"}), 401

        # Update last login time
        routeUserObject['last_login_time'] = trunc(time())
        routeUserObject["last_login_expire"] = decodedUserInfo.get("exp")
        routeUserObject['magic_bits'] = tokenBits
        
        UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    # Create session with routeUserObject
    #UserDriver.create_session(routeUserObject)
    return jsonify({"message": "Login successful", "user_info": routeUserObject}), 200

# ── POST Log Out ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/logout', methods=['POST'])
def logout():
    postAuthData = request.get_json()

    email = postAuthData.get("logout_email")

    if not (postAuthData or email):
        return jsonify({"message": "Logout failed"}), 400

    routeUserObject, error = UserDriver.get_user_by_email(email)
    routeUserObject["last_login_expire"] = 0
    UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    return jsonify({"message": "Logout successful"}), 200