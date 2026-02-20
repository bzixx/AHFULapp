from flask import Blueprint, request, jsonify
from Services.GymDriver import GymDriver

GymRouteBlueprint = Blueprint("gyms", __name__)


# ── GET all gyms (supports ?city=Austin filtering) ────────────────────────────
@GymRouteBlueprint.route("/", methods=["GET"])
def get_all_gyms():
    city = request.args.get("city")
    gyms, error = GymDriver.get_gyms(city=city)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(gyms), 200


# ── GET single gym ────────────────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>", methods=["GET"])
def get_gym(gym_id):
    gym, error = GymDriver.get_gym_by_id(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(gym), 200


# ── CREATE gym ────────────────────────────────────────────────────────────────
@GymRouteBlueprint.route("/", methods=["POST"])
def create_gym():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    gym_id, error = GymDriver.create_gym(
        name=data.get("name"),
        address=data.get("address"),
        city=data.get("city"),
        phone=data.get("phone"),
        amenities=data.get("amenities", []),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"gym_id": gym_id, "message": "Gym created"}), 201


# ── ADD member to gym ─────────────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>/members", methods=["POST"])
def add_member(gym_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = GymDriver.add_member(
        gym_id=gym_id,
        user_id=data.get("user_id"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Member added to gym"}), 200


# ── REMOVE member from gym ────────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>/members/<user_id>", methods=["DELETE"])
def remove_member(gym_id, user_id):
    updated, error = GymDriver.remove_member(gym_id=gym_id, user_id=user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Member removed from gym"}), 200


# ── GET all members of a gym ──────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>/members", methods=["GET"])
def get_members(gym_id):
    members, error = GymDriver.get_members(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(members), 200


# ── UPDATE gym ────────────────────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>", methods=["PUT"])
def update_gym(gym_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = GymDriver.update_gym(gym_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Gym updated successfully"}), 200


# ── DELETE gym ────────────────────────────────────────────────────────────────
@GymRouteBlueprint.route("/<gym_id>", methods=["DELETE"])
def delete_gym(gym_id):
    deleted, error = GymDriver.delete_gym(gym_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Gym deleted successfully"}), 200