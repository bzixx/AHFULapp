from flask import Blueprint, request, jsonify, g
from Services.UserSettingsDriver import UserSettingsDriver
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin

userSettingsBlueprint = Blueprint("userSettings", __name__, url_prefix="/AHFULuserSettings")

@userSettingsBlueprint.route("/<user_id>", methods=["GET"])
@verify_user_login
def get_user_settings(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    settings, error = UserSettingsDriver.get_user_settings(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(settings), 200

@userSettingsBlueprint.route("/create/<user_id>", methods=["POST"])
@verify_user_login
def create_user_settings(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    data = request.get_json() or {}
    settings, error = UserSettingsDriver.create_user_settings(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(settings), 201

@userSettingsBlueprint.route("/createDefault/<user_id>", methods=["POST"])
@verify_user_login
def create_default_user_settings(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    settings, error = UserSettingsDriver.create_default_user_settings(user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(settings), 201

@userSettingsBlueprint.route("/update/<user_id>", methods=["PUT"])
@verify_user_login
def update_user_settings(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    settings, error = UserSettingsDriver.update_user_settings(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(settings), 200

@userSettingsBlueprint.route("/delete/<user_id>", methods=["DELETE"])
@verify_user_login
def delete_user_settings(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    result, error = UserSettingsDriver.delete_user_settings(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
