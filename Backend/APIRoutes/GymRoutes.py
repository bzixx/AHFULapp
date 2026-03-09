from flask import Blueprint, request, jsonify
from Services.GymDriver import GymDriver

gymRouteBlueprint = Blueprint("gym", __name__, url_prefix="/AHFULgyms")

# ── GET all gyms ────────────────────────────────────────────────────────
@gymRouteBlueprint.route("/", methods=["GET"])
def get_all_gyms():
    gyms, error = GymDriver.get_all_gyms()
    if error:
        return jsonify({"error": error}), 500
    return gyms, 200

# ── GET single gym ────────────────────────────────────────────────────────────
@gymRouteBlueprint.route("/<gym_id>", methods=["GET"])
def get_gym(gym_id):
    gym, error = GymDriver.get_gym_by_id(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(gym), 200

# ── CREATE gym ────────────────────────────────────────────────────────────────
@gymRouteBlueprint.route("/create", methods=["POST"])
def create_gym():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    gym_id, error = GymDriver.create_gym(
        name=data.get("name"),
        address=data.get("address"),
        type=data.get("type"),
        cost=data.get("cost"),
        link=data.get("link"),
        lat=data.get("lat"),
        lng=data.get("lng"),
        notes=data.get("notes"),
    )
    
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"gym_id": gym_id, "message": "Gym created"}), 201

# ── DELETE gym ────────────────────────────────────────────────────────────────
@gymRouteBlueprint.route("/delete/<gym_id>", methods=["DELETE"])
def delete_gym(gym_id):
    if not gym_id:
        return jsonify({"error": "You must provide a gym id to delete"}), 400

    response, error = GymDriver.delete_gym(gym_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Gym deleted", "gym_id": response}), 200