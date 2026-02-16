from flask import Blueprint, request, jsonify
from app.services.workout_service import WorkoutService

workout_bp = Blueprint("workouts", __name__)


# ── GET all workouts (supports ?user_id=abc for filtering by user) ────────────
@workout_bp.route("/", methods=["GET"])
def get_all_workouts():
    user_id = request.args.get("user_id")
    workouts, error = WorkoutService.get_workouts(user_id=user_id)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200


# ── GET single workout ────────────────────────────────────────────────────────
@workout_bp.route("/<workout_id>", methods=["GET"])
def get_workout(workout_id):
    workout, error = WorkoutService.get_workout_by_id(workout_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workout), 200


# ── GET all workouts for a specific user ──────────────────────────────────────
@workout_bp.route("/user/<user_id>", methods=["GET"])
def get_workouts_by_user(user_id):
    workouts, error = WorkoutService.get_workouts(user_id=user_id)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200


# ── CREATE workout ────────────────────────────────────────────────────────────
@workout_bp.route("/", methods=["POST"])
def create_workout():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    workout_id, error = WorkoutService.create_workout(
        user_id=data.get("user_id"),
        name=data.get("name"),
        exercises=data.get("exercises", []),
        notes=data.get("notes"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Workout created"}), 201


# ── ADD exercise to an existing workout ───────────────────────────────────────
@workout_bp.route("/<workout_id>/exercises", methods=["POST"])
def add_exercise_to_workout(workout_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = WorkoutService.add_exercise_to_workout(
        workout_id=workout_id,
        exercise_id=data.get("exercise_id"),
        sets=data.get("sets"),
        reps=data.get("reps"),
        weight=data.get("weight"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Exercise added to workout"}), 200


# ── UPDATE workout ────────────────────────────────────────────────────────────
@workout_bp.route("/<workout_id>", methods=["PUT"])
def update_workout(workout_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = WorkoutService.update_workout(workout_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Workout updated successfully"}), 200


# ── DELETE workout ────────────────────────────────────────────────────────────
@workout_bp.route("/<workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    deleted, error = WorkoutService.delete_workout(workout_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Workout deleted successfully"}), 200