from flask import Blueprint, request, jsonify
from app.services.exercise_service import ExerciseService

exercise_bp = Blueprint("exercises", __name__)


# ── GET all exercises (supports ?muscle_group=chest&difficulty=beginner) ──────
@exercise_bp.route("/", methods=["GET"])
def get_all_exercises():
    filters = {
        key: request.args.get(key)
        for key in ["muscle_group", "difficulty", "equipment"]
        if request.args.get(key)
    }

    exercises, error = ExerciseService.get_exercises(filters)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(exercises), 200


# ── GET single exercise ───────────────────────────────────────────────────────
@exercise_bp.route("/<exercise_id>", methods=["GET"])
def get_exercise(exercise_id):
    exercise, error = ExerciseService.get_exercise_by_id(exercise_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(exercise), 200


# ── CREATE exercise ───────────────────────────────────────────────────────────
@exercise_bp.route("/", methods=["POST"])
def create_exercise():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    exercise_id, error = ExerciseService.create_exercise(
        name=data.get("name"),
        muscle_group=data.get("muscle_group"),
        difficulty=data.get("difficulty"),
        equipment=data.get("equipment"),
        instructions=data.get("instructions"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"exercise_id": exercise_id, "message": "Exercise created"}), 201


# ── UPDATE exercise ───────────────────────────────────────────────────────────
@exercise_bp.route("/<exercise_id>", methods=["PUT"])
def update_exercise(exercise_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = ExerciseService.update_exercise(exercise_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Exercise updated successfully"}), 200


# ── DELETE exercise ───────────────────────────────────────────────────────────
@exercise_bp.route("/<exercise_id>", methods=["DELETE"])
def delete_exercise(exercise_id):
    deleted, error = ExerciseService.delete_exercise(exercise_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Exercise deleted successfully"}), 200