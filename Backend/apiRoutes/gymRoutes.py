from flask import Blueprint, request, jsonify
<<<<<<< HEAD:Backend/apiRoutes/gymRoutes.py
from services.GymDriver import GymDriver

gymRouteBlueprint = Blueprint("gym", __name__, url_prefix="/AHFULgym")


# ── GET all gyms ────────────────────────────
@gymRouteBlueprint.route("/", methods=["GET"])
=======
from Services.GymDriver import GymDriver

GymRouteBlueprint = Blueprint("gyms", __name__)


# ── GET all gyms (supports ?city=Austin filtering) ────────────────────────────
@GymRouteBlueprint.route("/", methods=["GET"])
>>>>>>> 0816c89af6a9515964e8ad4bf86b126037e035db:Backend/APIRoutes/GymRoutes.py
def get_all_gyms():
    gyms, error = GymDriver.get_all_gyms()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(gyms), 200


# ── GET single gym ────────────────────────────────────────────────────────────
<<<<<<< HEAD:Backend/apiRoutes/gymRoutes.py
@gymRouteBlueprint.route("/<gym_id>", methods=["GET"])
=======
@GymRouteBlueprint.route("/<gym_id>", methods=["GET"])
>>>>>>> 0816c89af6a9515964e8ad4bf86b126037e035db:Backend/APIRoutes/GymRoutes.py
def get_gym(gym_id):
    gym, error = GymDriver.get_gym_by_id(gym_id)
    gym, error = GymDriver.get_gym_by_id(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(gym), 200


# ── CREATE gym ────────────────────────────────────────────────────────────────
<<<<<<< HEAD:Backend/apiRoutes/gymRoutes.py
@gymRouteBlueprint.route("create/", methods=["POST"])
=======
@GymRouteBlueprint.route("/", methods=["POST"])
>>>>>>> 0816c89af6a9515964e8ad4bf86b126037e035db:Backend/APIRoutes/GymRoutes.py
def create_gym():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    gym_id, error = GymDriver.create_gym(
        title=data.get("title"),
        address=data.get("address"),
        cost=data.get("cost"),
        link=data.get("link"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"gym_id": gym_id, "message": "Gym created"}), 201
<<<<<<< HEAD:Backend/apiRoutes/gymRoutes.py
=======


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
>>>>>>> 0816c89af6a9515964e8ad4bf86b126037e035db:Backend/APIRoutes/GymRoutes.py
