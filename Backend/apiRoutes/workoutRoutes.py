from flask import Blueprint, request, jsonify
from services.WorkoutDriver import WorkoutDriver

workoutRouteBlueprint = Blueprint("workouts", __name__, url_prefix="/AHFULworkout")


# ── GET all workouts (supports ?user_id=abc for filtering by user) ────────────
@workoutRouteBlueprint.route("/", methods=["GET"])
def get_all_workouts():
    workouts, error = WorkoutDriver.get_all_workouts()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET all workouts for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/<email>", methods=["GET"])
def get_workouts_by_user(email):
    print(email)
    workouts, error = WorkoutDriver.get_workouts_by_email(email=email)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET single workout ────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/id/<id>", methods=["GET"])
def get_workout(id):
    workout, error = WorkoutDriver.get_workout_by_id(id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workout), 200

# ── CREATE workout ────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/create", methods=["POST"])
def create_workout():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    workout_id, error = WorkoutDriver.create_workout(
        email=data.get("email"),
        title=data.get("title"),
        gymId=data.get("gymId"),
        startTime=data.get("startTime"),
        endTime=data.get("endTime"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Workout created"}), 201


# # ── ADD exercise to an existing workout ───────────────────────────────────────
# @workout_bp.route("/<workout_id>/exercises", methods=["POST"])
# def add_exercise_to_workout(workout_id):
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     updated, error = WorkoutService.add_exercise_to_workout(
#         workout_id=workout_id,
#         exercise_id=data.get("exercise_id"),
#         sets=data.get("sets"),
#         reps=data.get("reps"),
#         weight=data.get("weight"),
#     )
#     if error:
#         return jsonify({"error": error}), 400
#     return jsonify({"message": "Exercise added to workout"}), 200


# # ── UPDATE workout ────────────────────────────────────────────────────────────
# @workout_bp.route("/<workout_id>", methods=["PUT"])
# def update_workout(workout_id):
#     data = request.get_json()
#     if not data:
#         return jsonify({"error": "No data provided"}), 400

#     updated, error = WorkoutService.update_workout(workout_id, data)
#     if error:
#         return jsonify({"error": error}), 400
#     return jsonify({"message": "Workout updated successfully"}), 200


# # ── DELETE workout ────────────────────────────────────────────────────────────
# @workout_bp.route("/<workout_id>", methods=["DELETE"])
# def delete_workout(workout_id):
#     deleted, error = WorkoutService.delete_workout(workout_id)
#     if error:
#         return jsonify({"error": error}), 400
#     return jsonify({"message": "Workout deleted successfully"}), 200