from flask import Blueprint, request, jsonify, current_app
from Services.SignInDriver import SignInDriver
from Services.UserDriver import UserDriver
from Services.VerificationDriver import VerificationDriver
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin
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

    response, err = routeSignInDriver.google_login(postAuthData)
    if err:
        return jsonify({"error": response}), 401

    return jsonify({"message": "Login successful", "user_info": response[0], "email_response": response[1]}), 200

# ── POST Log Out ────────────────────────────────────────────────────────────
@signInRouteBlueprint.route('/logout', methods=['POST'])
@verify_user_login
def logout():
    postAuthData = request.get_json()

    email = postAuthData.get("logout_email")

    if not (postAuthData or email):
        return jsonify({"message": "Logout failed"}), 400

    routeUserObject, error = UserDriver.get_user_by_email(email)
    routeUserObject["last_login_expire"] = 0
    UserDriver.update_user_info(dataToBeUpdated=routeUserObject)

    return jsonify({"message": "Logout successful"}), 200