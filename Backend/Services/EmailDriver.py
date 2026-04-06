#Services & Drivers know how to implement business Logic related to the Route operations.
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before
#   Calling Objects to interact with DB
from DataModels.UserObject import UserObject
from datetime import datetime
from bson import ObjectId, errors as bson_errors
from flask_mail import Message
from flask import current_app

# The EmailDriver is responsible for implementing the business logic related to user operations.
#   It acts as an intermediary between the API routes and the data models,
#   ensuring that all necessary validations and rules are applied before interacting with
#   the database.
class EmailDriver:
    # ── Helper ─────────────────────────────────────────────────────────────────
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"
        
    # Send Email
    def send_not_verified_email(email):
        msg = Message(
            subject="Your email is not verified",
            recipients=[email],
            body=(
                "Hello,\n\n"
                "Our records show that your email has not been verified yet.\n\n"
                "You currently may have limited access to the application.\n\n"
                "Please verify your email to unlock full access.\n\n"
                "— AHFUL Team"
            )
        )
        current_app.mail.send(msg)



