from flask import Blueprint, request, jsonify
from Services.PersonalExDriver import PersonalExDriver

personalExRouteBlueprint = Blueprint("personalEx", __name__, url_prefix="/AHFULpersonalEx")


# ── GET all personalExs ────────────
@personalExRouteBlueprint.route("/", methods=["GET"])
def get_all_personal_exs():
    personalExs, error = PersonalExDriver.get_all_personal_exs()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(personalExs), 200

# ── GET all personalExs for a specific user ──────────────────────────────────────
@personalExRouteBlueprint.route("/<userId>", methods=["GET"])
def get_personal_exs_by_user(userId):
    personalExs, error = PersonalExDriver.get_personal_exs_by_user(userId=userId)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(personalExs), 200

# ── GET all personalExs for a specific workout ──────────────────────────────────────
@personalExRouteBlueprint.route("/workout/<workoutId>", methods=["GET"])
def get_personal_exs_by_workout(workoutId):
    personalExs, error = PersonalExDriver.get_personal_exs_by_workout(workoutId=workoutId)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(personalExs), 200

# ── GET single personalEx ────────────────────────────────────────────────────────
@personalExRouteBlueprint.route("/id/<id>", methods=["GET"])
def get_personal_ex(id):
    personalEx, error = PersonalExDriver.get_personal_ex_by_id(id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(personalEx), 200

# ── CREATE personalEx ────────────────────────────────────────────────────────────
@personalExRouteBlueprint.route("/create", methods=["POST"])
def create_personal_ex():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    personal_ex_id, error = PersonalExDriver.create_personal_ex(
        userId=data.get("userId"),
        exerciseId=data.get("exerciseId"),
        workoutId=data.get("workoutId"),
        reps=data.get("reps"),
        sets=data.get("sets"),
        weight=data.get("weight"),
        duration=data.get("duration"),
        distance=data.get("distance"),
        complete=data.get("complete"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"personal_ex_id": personal_ex_id, "message": "Personal Ex created"}), 201

# ── DELETE workout ────────────────────────────────────────────────────────────────
@personalExRouteBlueprint.route("/delete/<personal_ex_id>", methods=["DELETE"])
def delete_personal_ex(personal_ex_id):
    if not personal_ex_id:
        return jsonify({"error": "You must provide a personal ex id to delete"}), 400

    response, error = PersonalExDriver.delete_personal_ex(personal_ex_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Personal ex deleted", "personal_ex_id": response}), 200