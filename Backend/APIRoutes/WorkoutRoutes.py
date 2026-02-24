from flask import Blueprint, request, jsonify
from Services.WorkoutDriver import WorkoutDriver

workoutRouteBlueprint = Blueprint("workouts", __name__, url_prefix="/AHFULworkout")


# ── GET all workouts (supports ?user_id=abc for filtering by user) ────────────
@workoutRouteBlueprint.route("/", methods=["GET"])
def get_all_workouts():
    workouts, error = WorkoutDriver.get_all_workouts()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET all workouts for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/<userId>", methods=["GET"])
def get_workouts_by_user(userId):
    workouts, error = WorkoutDriver.get_workouts_by_user(userId=userId)
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
        userId=data.get("userId"),
        title=data.get("title"),
        gymId=data.get("gymId"),
        startTime=data.get("startTime"),
        endTime=data.get("endTime"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Workout created"}), 201