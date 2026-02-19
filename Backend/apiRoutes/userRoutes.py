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

##NOT TESTED YET — MAYBE NOT NEEDED DEPENDING ON FRONTEND DESIGN, BUT HERE FROM AI
# ── UPDATE user ───────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = UserDriver.update_user(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "User updated successfully"}), 200

##NOT TESTED YET — MAYBE NOT NEEDED DEPENDING ON FRONTEND DESIGN, BUT HERE FROM AI
##TODO DETERMINE HOW TO HANDLE USER ID AT DB LEVEL?
# ── DELETE user ───────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["DELETE"])
def delete_user(user_id):
    deleted, error = UserDriver.delete_user(user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "User deleted successfully"}), 200