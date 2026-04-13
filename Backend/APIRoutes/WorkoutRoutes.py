from flask import Blueprint, request, jsonify, g
from Services.WorkoutDriver import WorkoutDriver
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin

workoutRouteBlueprint = Blueprint("workouts", __name__, url_prefix="/AHFULworkout")

# ── GET all workouts ───────────────────────────────────────
@workoutRouteBlueprint.route("/", methods=["GET"])
@verify_user_admin
def get_all_workouts():
    workouts, error = WorkoutDriver.get_all_workouts()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(workouts), 200

# ── GET all workouts for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/<user_id>", methods=["GET"])
@verify_user_login
def get_workouts_by_user(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    workouts, error = WorkoutDriver.get_workouts_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workouts), 200

# ── GET all templates for a specific user ──────────────────────────────────────
@workoutRouteBlueprint.route("/templates/user/<user_id>", methods=["GET"])
@verify_user_login
def get_templates(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    workouts, error = WorkoutDriver.get_user_templates(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workouts), 200

# ── GET template by id ──────────────────────────────────────
@workoutRouteBlueprint.route("/templates/<id>", methods=["GET"])
@verify_user_login
def get_template(template_id):
    res, err = WorkoutDriver.verify_operation(g.user_id, template_id)
    if err:
        return jsonify({"error": err}), 400 
    workouts, error = WorkoutDriver.get_template(template_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workouts), 200

# ── GET single workout ────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/id/<id>", methods=["GET"])
@verify_user_login
def get_workout(workout_id):
    res, err = WorkoutDriver.verify_operation(g.user_id, workout_id)
    if err:
        return jsonify({"error": err}), 400 
    workout, error = WorkoutDriver.get_workout_by_id(workout_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(workout), 200

# ── CREATE workout ────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/create", methods=["POST"])
@verify_user_login
def create_workout():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    workout_id, error = WorkoutDriver.create_workout(
        user_id=g.user_id,
        gym_id=data.get("gym_id"),
        title=data.get("title"),
        startTime=data.get("startTime"),
        endTime=data.get("endTime"),
    )
    
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Workout created"}), 201

# ── CREATE template ────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/create/template", methods=["POST"])
@verify_user_login
def create_template():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    workout_id, error = WorkoutDriver.create_template(
        user_id=g.user_id,
        title=data.get("title")
    )
    
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"workout_id": workout_id, "message": "Template created"}), 201

# ── UPDATE personalEx ───────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/update/<workout_id>", methods=["PUT"])
@verify_user_login
def update_workout(workout_id):
    if not workout_id:
        return jsonify({"error": "You must provide a workout id to update"}), 400
    
    res, err = WorkoutDriver.verify_operation(g.user_id, workout_id)
    if err:
        return jsonify({"error": err}), 400 

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
    
    return jsonify({"message": "Workout updated", "workout": updated}), 200

# ── DELETE workout ────────────────────────────────────────────────────────────────
@workoutRouteBlueprint.route("/delete/<workout_id>", methods=["DELETE"])
@verify_user_login
def delete_workout(workout_id):
    if not workout_id:
        return jsonify({"error": "You must provide a workout id to delete"}), 400
    
    res, err = WorkoutDriver.verify_operation(g.user_id, workout_id)
    if err:
        return jsonify({"error": err}), 400 

    response, error = WorkoutDriver.delete_workout(workout_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Workout deleted", "workout_id": response}), 200

# ── GET workout streak for user ──────────────────────────────────────
@workoutRouteBlueprint.route("/streak/<user_id>", methods=["GET"])
@verify_user_login
def get_workout_streak(user_id):
    # Own user request, devs or admins only
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    streak_data, error = WorkoutDriver.get_streak(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(streak_data), 200
