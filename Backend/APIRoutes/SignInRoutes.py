from flask import Blueprint, request, jsonify, current_app, make_response, g
from Services.SignInDriver import SignInDriver
from Services.UserDriver import UserDriver
from Services.UserSettingsDriver import UserSettingsDriver
from datetime import datetime
from time import time
from math import trunc
from APIRoutes.SecurityRoutes import login_required

# Used to group views
signInRouteBlueprint = Blueprint('auth', __name__, url_prefix='/AHFULauth')

# ── POST Login with Google Auth ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/google-login', methods=['POST'])
def google_login():
    #Define Drivers
    routeSignInDriver: SignInDriver = current_app.AHFULSignInDriver

    # Get POST Data sent from Google Sign In Button. 
    postAuthData = request.get_json()
    if not postAuthData:
        #Return 400 Error -- No Data. 
        return jsonify({"error": "No authentication data provided"}), 400

    token = postAuthData.get("token")
    if not token:
        #Return 400 Error -- No Token in Post.
        return jsonify({"error": "No google token provided to the Backend.  You cannot login without something to login with.  What is this? Anarchy?"}), 400

    # Use Driver to verify JWT Token
    decodedUserInfo: dict = routeSignInDriver.verify_google_token(token)
    if not decodedUserInfo:
        #Return 401 Error -- Invalid Token.
        return jsonify({"error": "Invalid google token provided to Backend.  Dont come in here with Sloppily Copied Keys."}), 401

    routeUserObject, errorNeedtoCreatAcct = UserDriver.get_user_by_email(decodedUserInfo.get("email"))

    if errorNeedtoCreatAcct:
        #Need to Create User Account. 
        routeUserObject = UserDriver.create_user({
            "name": decodedUserInfo.get("name"),
            "email": decodedUserInfo.get("email"),
            "picture": decodedUserInfo.get("picture"),
            "last_login_time": trunc(time()),
            "last_login_expire" : decodedUserInfo.get("exp"),
            "roles": ["user"],
            "updated_at": datetime.now(),
            "magic_bits" : token
        })
    elif routeUserObject:
        #User Account Exists, Update Object.
        # Disabled user check in sign in
        #TODO: Build Disabled User testing in test file. 
        if routeUserObject.get('deactivated', False):
            return jsonify({"error": "Your account has been disabled"}), 401

        # Update last login time
        routeUserObject['last_login_time'] = trunc(time())
        routeUserObject["last_login_expire"] = decodedUserInfo.get("exp")
        routeUserObject['magic_bits'] = token
        
        UserDriver.update_user_info(dataToBeUpdated=routeUserObject)
    else:
        #Return 500 Error -- User Not Created or Found. This should never happen. 
        return jsonify({"error": "You didn't return a UserObject or an Error.  What in the Heavens. "}), 500

    #Refresh routeUserObject to get current info & id
    routeUserObject, error = UserDriver.get_user_by_email(decodedUserInfo.get("email"))

    if error:
        return jsonify({"error": "An error occurred while retrieving user information right after it was created/Updated. You Must have been a Bull in a china shop."}), 500
    elif routeUserObject:
        #Now that we have updated UserInfor, pull or create user settings. 

        if errorNeedtoCreatAcct:
            UserSettingsDriver.create_default_user_settings(routeUserObject["_id"])
            #Refresh user settings to pull default settings we just created.
            retrievedUserSettings, settings_err = UserSettingsDriver.get_user_settings(routeUserObject["_id"])

        else:
            # If user already existed, we should have settings.  Pull them to set cookie. 
            retrievedUserSettings, settings_err = UserSettingsDriver.get_user_settings(routeUserObject["_id"])
            
        if settings_err:
            try:
                UserSettingsDriver.create_default_user_settings(routeUserObject["_id"])
            except Exception as e:
                return jsonify({"error": f"I'm Fried, we just tried to pull user settings on login and failed. {e} "}), 500
  


        # 1. Create the response object with the user info and flags
        response = make_response(jsonify({
            "message": "Google Login Registered & Logged with Backend.",
            "user_info": {
                "_id": routeUserObject["_id"],
                "name": routeUserObject["name"],
                "email": routeUserObject["email"],
                "picture": routeUserObject["picture"],
                "roles": routeUserObject["roles"],
                "last_login_time": routeUserObject["last_login_time"],
            }
        }))

        # 2. Set the cookie with User ID
        # We store ONLY the session/user ID here
        response.set_cookie(
            'session_id',        # Cookie name
            routeUserObject["_id"],# Cookie value
            httponly=True,       # Prevents JS access (XSS protection)
            secure=False,         # Ensures cookie is sent over HTTPS only
            samesite='Strict',      # CSRF protection (use 'Strict' for high security)
            max_age=3600         # Expiration in seconds (e.g., 1 hour)
        )

        # 3. Set the cookie with User Settings ID
        # We store ONLY the session/user ID here
        response.set_cookie(
            'user_settings',        # Cookie name
            retrievedUserSettings["_id"],# Cookie value
            httponly=True,       # Prevents JS access (XSS protection)
            secure=False,         # Ensures cookie is sent over HTTPS only
            samesite='Strict',      # CSRF protection (use 'Strict' for high security)
            max_age=3600         # Expiration in seconds (e.g., 1 hour)
        )

        # 4. Set MagicBits Cookie with Token.
        response.set_cookie(
            'magic_bits',        # Cookie name
            token,              # Cookie value
            httponly=True,       # Prevents JS access (XSS protection)
            secure=False,         # Ensures cookie is sent over HTTPS only
            samesite='Strict',      # CSRF protection (use 'Strict' for high security)
            max_age=3600         # Expiration in seconds (e.g., 1 hour)
        )

        #Log to Console & Security Logging. 
        print (f"Logged in & set cookie(s!) for user_id: {routeUserObject['_id']}")
        return response
    else:
        #Return 500 Error -- User Not Created or Found. This should never happen. 
        return jsonify({"error": "You didn't return a UserObject or an Error.  What in the Heavens, You literally just... Bro. "}), 500

# ── POST Log Out ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/logout', methods=['POST'])
def logout():
    session_id = request.cookies.get('session_id')
    userData, err = UserDriver.get_user_by_id(session_id)
    if userData:
        userData["last_login_expire"] = 0
        UserDriver.update_user_info(dataToBeUpdated=userData)

    # Clear cookie on logout (instruct browser to remove)
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('session_id', '', httponly=True, secure=True, samesite='Strict', max_age=0, path='/')
    return response

#── GET whoami (Logged in or not) ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/whoami', methods=['POST'])
@login_required
def whoami():
    try:
        currTime = trunc(time())
        
        # Validate session by user id from cookie
        routeUserObject, error = UserDriver.get_user_by_id(g.user_id)
        if not routeUserObject:
            return jsonify({"error": "No session cookie found. 2. Please Sign in."}), 401

        # Check expiry stored on server
        foundExpiryTime = routeUserObject["last_login_expire"]
        # Normalize any Rouge foundExpiryTime (treat non-numeric as expired)
        try:
            foundExpiryTime = int(foundExpiryTime)
        except Exception:
            foundExpiryTime = 0

        if currTime > foundExpiryTime:
            return jsonify({"error": "Session expired.  Please Sign in again."}), 401

        #Successful Auth, return user info
        retrievedUserSettings, settings_err = UserSettingsDriver.get_user_settings(g.user_id)

        # 1. Create the response object with the user info and flags
        response = make_response(jsonify({
            "message": "Session Cookie Verified & Logged with Backend.",
            "user_info": {
                "_id": routeUserObject["_id"],
                "name": routeUserObject["name"],
                "email": routeUserObject["email"],
                "picture": routeUserObject["picture"],
                "roles": routeUserObject["roles"],
                "last_login_time": routeUserObject["last_login_time"],
            }
        }))

        # 2. Set the cookie with security flags
        # We store ONLY the session/user ID here
        response.set_cookie(
            'user_settings',        # Cookie name
            retrievedUserSettings["_id"],# Cookie value
            httponly=True,       # Prevents JS access (XSS protection)
            secure=False,         # Ensures cookie is sent over HTTPS only
            samesite='Strict',      # CSRF protection (use 'Strict' for high security)
            max_age=3600         # Expiration in seconds (e.g., 1 hour)
        )

        #Log to Console & Security Logging. 
        print (f"Settings Retrieved with Session Cookie: {retrievedUserSettings['_id']} for user: {g.user_id}")
        return response

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

