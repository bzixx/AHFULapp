from flask import Blueprint, request, jsonify, g
from Services.TaskDriver import TaskDriver
from Auth.verification import login_required_user, login_required_dev, login_required_admin, login_required_gym_owner

#AHFUL Task Routes
taskBlueprint = Blueprint("task", __name__, url_prefix="/AHFULtasks")

# Get all tasks
@taskBlueprint.route("/", methods=["GET"])
@login_required_dev
def get_all_tasks():
    tasks, error = TaskDriver.get_all_tasks()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(tasks), 200

# Ensure only opearte on own objs , dev for now
# Get task by ID
@taskBlueprint.route("/<task_id>", methods=["GET"])
@login_required_dev
def get_task(task_id):
    task, error = TaskDriver.get_task_by_id(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(task), 200

# Get tasks by user ID
@taskBlueprint.route("/user/<user_id>", methods=["GET"])
@login_required_user
def get_tasks_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    tasks, error = TaskDriver.get_tasks_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tasks), 200

# Create a new task for a given user ID
@taskBlueprint.route("/create/<user_id>", methods=["POST"])
@login_required_user
def create_task(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    task, error = TaskDriver.create_task(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(task), 201

#TODO:
# Ensure only op on own objs? dev for now
# Update an existing task by ID
@taskBlueprint.route("/update/<task_id>", methods=["PUT"])
@login_required_user
def update_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    task, error = TaskDriver.update_task(task_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(task), 200

# Ensure only op on own objs? dev for now
# Delete a task by ID
@taskBlueprint.route("/delete/<task_id>", methods=["DELETE"])
@login_required_dev
def delete_task(task_id):
    result, error = TaskDriver.delete_task(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
