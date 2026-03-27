from flask import Blueprint, request, jsonify
from Services.TokenDriver import TokenDriver

tokenBlueprint = Blueprint("token", __name__, url_prefix="/AHFULtokens")

@tokenBlueprint.route("/user/<user_id>", methods=["GET"])
def get_token_by_user(user_id):
    token, error = TokenDriver.get_token_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(token), 200

@tokenBlueprint.route("/user/<user_id>/all", methods=["GET"])
def get_all_tokens_by_user(user_id):
    tokens, error = TokenDriver.get_all_tokens_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tokens), 200

@tokenBlueprint.route("/value/<token>", methods=["GET"])
def get_token_by_value(token):
    token, error = TokenDriver.get_token_by_value(token)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(token), 200

@tokenBlueprint.route("/create/<user_id>", methods=["POST"])
def create_token(user_id):
    data = request.get_json()
    if not data or not data.get("token"):
        return jsonify({"error": "token is required"}), 400
    token, error = TokenDriver.create_token(data.get("token"), user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(token), 201

@tokenBlueprint.route("/delete/user/<user_id>", methods=["DELETE"])
def delete_token_by_user(user_id):
    result, error = TokenDriver.delete_token(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200

@tokenBlueprint.route("/delete/value/<token>", methods=["DELETE"])
def delete_token_by_value(token):
    result, error = TokenDriver.delete_token_by_value(token)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
