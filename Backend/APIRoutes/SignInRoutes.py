from flask import Blueprint, request, jsonify, current_app
from Services.SignInDriver import SignInDriver
from Services.UserDriver import UserDriver
from datetime import datetime
from time import time
from math import trunc

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

    # verify JWT
    decodedUserInfo: dict = routeSignInDriver.verify_google_token(token)
    print(decodedUserInfo)
    if not decodedUserInfo:
        return jsonify({"error": "Invalid token provided to Backend.  Dont come in here with Sloppily Copied Keys."}), 401

    tokenBits = token[-32:] 

    # Check if user already exists, else create new user_info document
    routeUserObject, error = UserDriver.get_user_by_email(decodedUserInfo.get("email"))
    if not routeUserObject:
        routeUserObject = UserDriver.create_user({
            "name": decodedUserInfo.get("name"),
            "email": decodedUserInfo.get("email"),
            "picture": decodedUserInfo.get("picture"),
            "last_login_time": trunc(time()),
            "last_login_expire" : decodedUserInfo.get("exp"),
            "magic_bits" : tokenBits
        })
    else: 
        
        # Update last login time
        routeUserObject['last_login_time'] = trunc(time())
        routeUserObject["last_login_expire"] = decodedUserInfo.get("exp")
        routeUserObject['magic_bits'] = tokenBits

        UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    # USE TOKEN IN POSTMAN TO SEE IF COOKIE GETS SET
    print(f'START OF TOKEN: \n{token}')
    print('END OF TOKEN\n')

    # Create session with routeUserObject
    #UserDriver.create_session(routeUserObject)
    return jsonify({"message": "Login successful", "user_info": routeUserObject}), 200

#TODO:
# ── POST Log Out ────────────────────────────────────────────────────────────
# @signInRouteBlueprint.route('/logout', methods=['POST'])
# def logout():
#     session_service: SessionService = current_app.session_service
#     session_service.remove_session()
#     return jsonify({"message": "Logout successful"}), 200

#To convert time back. 
#datetime.fromtimestamp(1771630398)

#── GET whoami (Logged in or not) ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/whoami', methods=['POST'])
def whoami():
    #Get POST Data
    postAuthData = request.get_json()

    #Assign Variables for email, expiryTime, currTime, and magicBits
    email = postAuthData.get("email")
    reportedExpiryTime = postAuthData.get("last_login_expire")
    currTime = trunc(time())
    reportedMagicBits = postAuthData.get("magic_bits")

    #
    routeUserObject, error = UserDriver.get_user_by_email(email)

    foundMagicBits = routeUserObject.get("magic_bits")
    foundExpiryTime = routeUserObject.get("last_login_expire")

    if not (email or reportedMagicBits):
        return jsonify({"error": "API Requesst Error.  Fry the Bits again."}), 200
    
    if (currTime > reportedExpiryTime) or (currTime > foundExpiryTime):
        return jsonify({"error": "Token Expired, User will need to Auth Again"}), 200

    if not (routeUserObject):
        return jsonify({"error": "Email NOT found, User will need to Auth"}), 200
    
    if (reportedMagicBits != foundMagicBits):
        return jsonify({"error": "Your Bits are overcooked, User will need to Auth Again"}), 200
        #TODO; Alerting??
    
    return jsonify({"message": "Authorized and Found User.","user_info": routeUserObject}), 200