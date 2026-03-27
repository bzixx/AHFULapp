from flask import Blueprint, request, jsonify
from Services.WorkoutDriver import WorkoutDriver

workoutRouteBlueprint = Blueprint("workouts", __name__, url_prefix="/AHFULworkout")

# ── GET all workouts ──────────────────────────────────────
@workoutRouteBlueprint.route("/", methods=["GET"])
def get_all_workouts():
    workouts, error = WorkoutDriver.get_all_workouts()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET all workouts for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/<userId>", methods=["GET"])
def get_workouts_by_user(userId):
    workouts, error = WorkoutDriver.get_workouts_by_user(userId)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workouts), 200

# ── GET all templates for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/templates/<userId>", methods=["GET"])
def get_templates(userId):
    workouts, error = WorkoutDriver.get_user_templates(userId)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET all templates for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/template/<id>", methods=["GET"])
def get_template(id):
    workouts, error = WorkoutDriver.get_template(id)
    if error:
        return jsonify({"error": error}), 404
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

# ── CREATE template ────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/create/template", methods=["POST"])
def create_template():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    workout_id, error = WorkoutDriver.create_template(
        userId=data.get("userId"),
        title=data.get("title")
    )
    
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Template created"}), 201

# ── UPDATE personalEx ───────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/update/<workout_id>", methods=["PUT"])
def update_workout(workout_id):
    if not workout_id:
        return jsonify({"error": "You must provide a workout id to update"}), 400

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "You must provide a JSON body with at least one field to update"}), 400

    # Call the driver (it already validates allowed fields & id)
    updated, error = WorkoutDriver.update_workout(id=workout_id, updates=data)

    if error:
        err_lower = error.lower()
        if "not found" in err_lower:
            return jsonify({"error": error}), 404
        return jsonify({"error": error}), 400
    
    return jsonify({"message": "Workout updated", "Workout": updated}), 200

# ── DELETE workout ────────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/delete/<workout_id>", methods=["DELETE"])
def delete_workout(workout_id):
    if not workout_id:
        return jsonify({"error": "You must provide a workout id to delete"}), 400

    response, error = WorkoutDriver.delete_workout(workout_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Workout deleted", "workout_id": response}), 200
# ── GET workout streak for user ──────────────────────────────────────
@workoutRouteBlueprint.route("/streak/<userId>", methods=["GET"])
def get_workout_streak(userId):
    streak_data, error = WorkoutDriver.get_streak(userId)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(streak_data), 200
