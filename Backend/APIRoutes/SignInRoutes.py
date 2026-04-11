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

#── GET whoami (Logged in or not) ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/whoami', methods=['POST'])
def whoami():
    try:
        # Get POST Data
        postAuthData = request.get_json()

        # Basic validation of incoming payload
        if not postAuthData:
            return jsonify({"error": "You came to eat without food, maybe buy something?"}), 400

        # Assign Variables for email, expiryTime, currTime, and magicBits
        email = postAuthData.get("email")
        reportedExpiryTime = postAuthData.get("last_login_expire")
        reportedMagicBits = postAuthData.get("magic_bits")
        currTime = trunc(time())

        # Require all three fields from the client
        if not (email and reportedMagicBits and reportedExpiryTime):
            return jsonify({"error": "API Request Error. Missing required fields."}), 400

        # Normalize reportedExpiryTime to an int where possible
        try:
            reportedExpiryTime = int(reportedExpiryTime)
        except Exception:
            return jsonify({"error": "Wait, when did you say the Tacos expired again?"}), 400

        # Fetch user from DB; ensure we have a user before accessing its keys
        routeUserObject, error = UserDriver.get_user_by_email(email)
        if not routeUserObject:
            return jsonify({"error": "Email NOT found, User will need to Sign Up."}), 401

        foundMagicBits = routeUserObject.get("magic_bits")
        foundExpiryTime = routeUserObject.get("last_login_expire", 0)

        # Normalize foundExpiryTime (treat non-numeric as expired)
        try:
            foundExpiryTime = int(foundExpiryTime)
        except Exception:
            print("Should never Run.  Found expiry time was not an integer, normalizing to 0.")
            foundExpiryTime = 0

        # Check expirations
        if (currTime > reportedExpiryTime) or (currTime > foundExpiryTime):
            return jsonify({"error": "Token Expired, User will need to Sign In Again"}), 401

        # Validate magic bits
        if (reportedMagicBits != foundMagicBits):
            return jsonify({"error": "Your Fry Bits are overcooked, User will need to Sign In Again"}), 401

        #Successful Auth, return user info
        return jsonify({"message": "Authorized and Found User.", "user_info": routeUserObject}), 200
    except Exception as e:
        print(f"Error in whoami route: {e}")
        return jsonify({"error": f"Whatever you sent was not properly handeled yet.  Read more here: {e}."}), 500


# ── POST Login with Snapchat Auth No Active In Prod ────────────────────────────────────────────────────────────
# @signInRouteBlueprint.route('/snapchat-login', methods=['POST'])
# def snapchat_login():
#     postAuthData = request.get_json()
#     if not postAuthData:
#         return jsonify({"error": "No authentication data provided"}), 400
#     print("Logging in with AHFUL Snapchat Auth")

#     routeSignInDriver: SignInDriver = current_app.AHFULSignInDriver

#     token = postAuthData.get("token")
#     if not token:
#         return jsonify({"error": "No snap token provided to the Backend.  You cannot login without something to login with.  What is this? Anarchy?"}), 400

    # # verify JWT
    # decodedUserInfo: dict = routeSignInDriver.verify_google_token(token)
    # print(decodedUserInfo)
    # if not decodedUserInfo:
    #     return jsonify({"error": "Invalid token provided to Backend.  Dont come in here with Sloppily Copied Keys."}), 401

    # tokenBits = token[-32:] 

    # # Check if user already exists, else create new user_info document
    # #TODO: Look at this because i checks based on email. 
    # routeUserObject, error = UserDriver.get_user_by_email(decodedUserInfo.get("email"))
    # if not routeUserObject:
    #     routeUserObject = UserDriver.create_user({
    #         "name": decodedUserInfo.get("name"),
    #         "email": decodedUserInfo.get("email"),
    #         "picture": decodedUserInfo.get("picture"),
    #         "last_login_time": trunc(time()),
    #         "last_login_expire" : decodedUserInfo.get("exp"),
    #         "magic_bits" : tokenBits
    #     })
    # else: 
        
    #     # Update last login time
    #     routeUserObject['last_login_time'] = trunc(time())
    #     routeUserObject["last_login_expire"] = decodedUserInfo.get("exp")
    #     routeUserObject['magic_bits'] = tokenBits

    #     UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    # # USE TOKEN IN POSTMAN TO SEE IF COOKIE GETS SET
    # print(f'START OF TOKEN: \n{token}')
    # print('END OF TOKEN\n')

    # # Create session with routeUserObject
    # #UserDriver.create_session(routeUserObject)
    # return jsonify({"message": "Login successful", "user_info": routeUserObject}), 200

