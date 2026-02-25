from flask import Blueprint, request, jsonify
from Services.GymDriver import GymDriver

gymRouteBlueprint = Blueprint("gym", __name__, url_prefix="/AHFULgym")


# ── GET all gyms ────────────────────────────
@gymRouteBlueprint.route("/", methods=["GET"])
def get_all_gyms():
    gyms, error = GymDriver.get_all_gyms()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(gyms), 200


# ── GET single gym ────────────────────────────────────────────────────────────
@gymRouteBlueprint.route("/<gym_id>", methods=["GET"])
def get_gym(gym_id):
    gym, error = GymDriver.get_gym_by_id(gym_id)
    gym, error = GymDriver.get_gym_by_id(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(gym), 200


# ── CREATE gym ────────────────────────────────────────────────────────────────
@gymRouteBlueprint.route("create/", methods=["POST"])
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
