from flask import Blueprint, request, jsonify
from Services.UserDriver import UserDriver

userRouteBlueprint = Blueprint("users", __name__, url_prefix="/AHFULusers")

# ── GET all users ─────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/", methods=["GET"])
def get_all_users():
    users, error = UserDriver.get_all_users()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(users), 200

# ── GET single user ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["GET"])
def get_user(email):
    user, error = UserDriver.get_user_by_email(email)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(user), 200