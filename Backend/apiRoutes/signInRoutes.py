from flask import Blueprint, request, jsonify, current_app
from Services.SignInDriver import SignInDriver
from Services.UserDriver import UserDriver
from datetime import datetime

# Used to group views
signInRouteBlueprint = Blueprint('Sign-In', __name__, url_prefix='/sign-in')

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
        return jsonify({"error": "No token provided to the Backend.  You cannot login with something to login with.  What is this? Anarchy?"}), 400
    
    # USE TOKEN IN POSTMAN TO SEE IF COOKIE GETS SET
    print(f'START OF TOKEN: \n{token}')
    print('END OF TOKEN\n')

    # verify JWT
    decodedUserInfo: dict = routeSignInDriver.verify_google_token(token)
    if not decodedUserInfo:
        return jsonify({"error": "Invalid token provided to Backend.  Dont come in here with Sloppily Copied Keys."}), 401

    # Check if user already exists, else create new user_info document
    routeUserObject, error = UserDriver.get_user_by_email(decodedUserInfo.get("email"))
    if not routeUserObject:
        routeUserObject = UserDriver.create_user({
            "name": decodedUserInfo.get("given_name"),
            "email": decodedUserInfo.get("email"),
            "picture": decodedUserInfo.get("picture"),
            "login_time": datetime.now()
        })
    else: 
        # Update last login time
        routeUserObject['login_time'] = datetime.now()
        UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    # Create session with routeUserObject
    #UserDriver.create_session(routeUserObject)
    return jsonify({"message": "Login successful", "user_info": routeUserObject}), 200

# ── POST Log Out ────────────────────────────────────────────────────────────
# @signInRouteBlueprint.route('/logout', methods=['POST'])
# def logout():
#     session_service: SessionService = current_app.session_service
#     session_service.remove_session()
#     return jsonify({"message": "Logout successful"}), 200

# ── GET whoami (Logged in or not) ────────────────────────────────────────────────────────────
# @signInRouteBlueprint.route('/whoami', methods=['GET'])
# def whoami():
#     session_service: SessionService = current_app.session_service
#     user_info = session_service.get_session_user_info()
#     if not user_info:
#         return jsonify({"error": "No user info available"}), 404
#     return jsonify({"user_info": user_info}), 200





#OLD USER ROUTE

# # ── REGISTER ──────────────────────────────────────────────────────────────────
# @userRouteBlueprint.route("/register", methods=["POST"])
# def register():
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     id, error = UserDriver.register_user(
#         name=data.get("name"),
#         email=data.get("email"),
#         password=data.get("password"),
#         role=data.get("role"),
#     )
#     if error:
#         return jsonify({"error": error}), 400
#     return jsonify({"_id": id, "message": "User created successfully"}), 201


# # ── LOGIN ─────────────────────────────────────────────────────────────────────
# @userRouteBlueprint.route("/login", methods=["POST"])
# def login():
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     email, error = UserDriver.authenticate_user(
#         email=data.get("email"),
#         password=data.get("password"),
#     )
#     if error:
#         return jsonify({"error": error}), 401
#     return jsonify({"email": email, "message": "Login successful"}), 200