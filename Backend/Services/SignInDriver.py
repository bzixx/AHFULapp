from google.oauth2 import id_token
from google.auth.transport import requests
from Services.UserDriver import UserDriver
from Services.VerificationDriver import VerificationDriver
from time import time
from math import trunc
from datetime import datetime

##THIS IS SKELETON NEED TO VERIFY

#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with DB

#Initalizes Google packages. 

class SignInDriver:
    def __init__(self, GOOGLE_CLIENT_ID: str):
        self.client_id: str = GOOGLE_CLIENT_ID

    def google_login(self, postAuthData):
        #session_service: SessionService = current_app.session_service

        token = postAuthData.get("token")
        if not token:
            return None, "No google token provided to the Backend.  You cannot login without something to login with.  What is this? Anarchy?"

        # verify JWT
        decodedUserInfo: dict = SignInDriver.verify_google_token(self, token)
        print(decodedUserInfo)
        if not decodedUserInfo:
            return None, "Invalid google token provided to Backend.  Dont come in here with Sloppily Copied Keys."

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
                "magic_bits" : tokenBits,
                "email_verified": False,
                "phone_verified": False
            })
        else: 
            # Disabled user check in sign in, untested
            if routeUserObject.get('deactivated', False):
                return None, "Your account has been disabled"

            # Update last login time
            routeUserObject['last_login_time'] = trunc(time())
            routeUserObject["last_login_expire"] = decodedUserInfo.get("exp")
            routeUserObject['magic_bits'] = tokenBits
            
            UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

        email_response = "Email already verified"
        if routeUserObject.get('email_verified') is False:
            print("Email not verified!")
            email_response, err = VerificationDriver.verify_user_email(routeUserObject.get("_id"))
            if err is None:
                pass
            else:
                return None, err
        
        print(email_response)
        return [routeUserObject, email_response], None

    def verify_google_token(self, token: str):
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), self.client_id)
            return idinfo  # Contains 'sub', 'email', 'name', etc.
        except ValueError as e:
            # Log the specific reason so you can diagnose
            print(f"Token verification failed: {str(e)}")
            return None
        except Exception as e:
            # Catch unexpected errors too
            print(f"Unexpected error during token verification: {str(e)}")
            return None
