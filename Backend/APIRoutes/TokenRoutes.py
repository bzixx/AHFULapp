from flask import Blueprint, request, jsonify, g
from Services.TokenDriver import TokenDriver
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin

tokenBlueprint = Blueprint("token", __name__, url_prefix="/AHFULtokens")

@tokenBlueprint.route("/user/<user_id>", methods=["GET"])
@verify_user_login
def get_token_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    token, error = TokenDriver.get_token_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(token), 200

@tokenBlueprint.route("/user/<user_id>/all", methods=["GET"])
@verify_user_login
def get_all_tokens_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    tokens, error = TokenDriver.get_all_tokens_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tokens), 200

@tokenBlueprint.route("/value/<token>", methods=["GET"])
@verify_user_admin
def get_token_by_value(token):
    token, error = TokenDriver.get_token_by_value(token)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(token), 200

@tokenBlueprint.route("/create/<user_id>", methods=["POST"])
@verify_user_login
def create_token(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    data = request.get_json()
    if not data or not data.get("token"):
        return jsonify({"error": "token is required"}), 400
    token, error = TokenDriver.create_token(data.get("token"), user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(token), 201

@tokenBlueprint.route("/delete/user/<user_id>", methods=["DELETE"])
@verify_user_login
def delete_token_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    result, error = TokenDriver.delete_token(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200

@tokenBlueprint.route("/delete/value/<token>", methods=["DELETE"])
@verify_user_admin
def delete_token_by_value(token):
    result, error = TokenDriver.delete_token_by_value(token)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
