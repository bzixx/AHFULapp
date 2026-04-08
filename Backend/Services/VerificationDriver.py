#Services & Drivers know how to implement business Logic related to the Route operations.
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before
#   Calling Objects to interact with DB
from DataModels.UserObject import UserObject
from DataModels.VerificationObject import VerificationObject
from datetime import datetime
from bson import ObjectId, errors as bson_errors
from flask_mail import Message
from flask import current_app
import secrets
import string

# The EmailDriver is responsible for implementing the business logic related to user operations.
#   It acts as an intermediary between the API routes and the data models,
#   ensuring that all necessary validations and rules are applied before interacting with
#   the database.
class VerificationDriver:
    # ── Helper ─────────────────────────────────────────────────────────────────
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"
        
    def generate_code(length=8):
        characters = string.ascii_uppercase + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
    
    @staticmethod
    def verify_user_email(user_id):
        # Validate user_id present
        if not user_id:
            return None, "user_id is required"

        # Validate user_id valid
        oid, err = VerificationDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        
        try:
            #Find user, ensure exists
            user = UserObject.find_by_id(user_id)
            if not user:
                return None, "User not found"
            else:
                # Check if already verified
                if user.get("email_verified"):
                    return "User already verified", None
                # Check if user provided email
                if not user.get("email"):
                    return None, "User lacks email"
                
                # Get current verifications
                verifies = VerificationObject.find_type_by_user(user_id, "email")
                print(verifies)
                # If verification already exists
                if (len(verifies) == 1):
                    # If verification is stale (10 min)
                    if (datetime.now().timestamp() - verifies[0]["created_at"]) > 600:
                        # Delete stale verification
                        response, err = VerificationObject.delete(verifies[0]["_id"])
                        if err is None: 
                            # Send new verification email
                            response, err = VerificationDriver.send_not_verified_email(user_id, user.get("email"), VerificationDriver.generate_code())
                            if err is None:
                                # Call verification func recursively
                                response, err = VerificationDriver.verify_user_email(user_id)
                                # Returns stale email text with recursive response
                                if err is None:
                                    return "current email stale, retrying: " + response, None
                                return None, err
                            # if err when sending new email
                            return None, err
                        # if err on deleting state email
                        return  "error deleting stale email, " + response, None
                    # fresh verification exists
                    return "email already sent", None
                # Should not get here, big error
                elif (len(verifies) > 1):
                    return None, "multiple email verifications exist" 
                
                # No verification exists, send new one
                response, err = VerificationDriver.send_not_verified_email(user_id, user.get("email"), VerificationDriver.generate_code())
                if err is None:
                    return response, None
                else:
                    return None, err
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def verify_user_phone_number(user_id):
        # Validate inputs
        if not user_id:
            return None, "user_id is required"

        # Validate ObjectIds
        oid, err = VerificationDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        
        try:
            user = UserObject.find_by_id(user_id)
            if not user:
                return None, "User not found"
            else:
                if user.get("phone_verified"):
                    return "User already verified", None
                
                if not user.get("phone"):
                    return None, "User lacks phone number"

        except Exception as e:
            return None, str(e)
        
    # Send Email
    @staticmethod
    def send_not_verified_email(user_id, email, token):
        try:
            # Create verification obj with passed in token, user_id
            response, err = VerificationObject.create("email", token, user_id)
            if err is None:
                print(response)
            else:
                return None, err
        except Exception as e:
            return None, str(e)
        
        # Link contains token id and token text
        link = f"http://127.0.0.1:5000/AHFULverify/verify/email/{response}/{token}"

        # Send message with enable link
        msg = Message(
            subject="Your email is not verified",
            recipients=[email],
            body=(
                "Hello,\n\n"
                "Our records show that your email has not been verified yet.\n\n"
                "You currently may have limited access to the application.\n\n"
                "Please verify your email to unlock full access.\n\n"
                "Your verification link is {link}"
                "— AHFUL Team"
            ).format(link=link)
        )
        current_app.mail.send(msg)

        return "Verification email sent", None
    
    def confirm_email_token(token_id, token):
        verify = VerificationObject.find_by_id(token_id)
        if verify:
            if verify["token"] == token:
                res = UserObject.enable_verification(verify["user_id"], "email")
                return "Email sucessfully verified," + str(res), None
            else:
                return None, "Token not found or incorrect token text"
        else:
            return None, "Token not found or incorrect token text"

