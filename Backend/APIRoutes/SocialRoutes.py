from flask import Blueprint, request, jsonify, g

from Services.SocialDriver import SocialDriver
from Auth.verification import login_required_user, login_required_dev


socialRouteBlueprint = Blueprint("social", __name__, url_prefix="/AHFULsocial")


@socialRouteBlueprint.route("/", methods=["GET"])
@login_required_dev
def get_all_friendships():
    friendships, error = SocialDriver.get_all_friendships()
    if error:
        return jsonify({"error": error}), 500
    return (friendships), 200


@socialRouteBlueprint.route("/<friendship_id>", methods=["GET"])
@login_required_user
def get_friendship(friendship_id):
    friendship, error = SocialDriver.get_friendship_by_id(friendship_id)
    if error:
        return jsonify({"error": error}), 404

    actor_email = (g.email or "").strip().lower()
    if (
        g.role not in ("Developer", "Admin")
        and actor_email not in (
            (friendship.get("User1Email") or "").strip().lower(),
            (friendship.get("User2Email") or "").strip().lower(),
        )
    ):
        return jsonify({"error": "You may only access your own data"}), 403

    return jsonify(friendship), 200

@socialRouteBlueprint.route("/pending/<user_id>", methods=["GET"])
@login_required_user
def get_pending_friendships_for_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403

    friendships, error = SocialDriver.get_pending_friend_requests_for_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(friendships), 200


@socialRouteBlueprint.route("/user", methods=["GET"])
@login_required_user
def get_friendships_for_current_user():
    friendships, error = SocialDriver.get_friendships_by_email(g.email)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(friendships), 200


@socialRouteBlueprint.route("/pending", methods=["GET"])
@login_required_user
def get_pending_friendships_for_current_user():
    friendships, error = SocialDriver.get_pending_friend_requests_for_email(g.email)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(friendships), 200


@socialRouteBlueprint.route("/request", methods=["POST"])
@login_required_user
def create_friend_request():
    user1_id = g.user_id
    user_1_email = g.email
    data = request.get_json() or {}
    user2_email = data.get("email")
    if not user2_email:
        return jsonify({"error": "user2_email is required"}), 400

    friendship, error = SocialDriver.create_friend_request(user1_id, user2_email, g.email)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(friendship), 201


@socialRouteBlueprint.route("/accept/<friendship_id>", methods=["PUT"])
@login_required_user
def accept_friend_request(friendship_id):
    friendship, error = SocialDriver.accept_friend_request(friendship_id, g.email)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(friendship), 200


@socialRouteBlueprint.route("/delete/<friendship_id>", methods=["DELETE"])
@login_required_user
def delete_friendship(friendship_id):
    result, error = SocialDriver.delete_friendship(friendship_id, g.email, g.role)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
