from flask import Blueprint, request, jsonify, g
from Services.TaskDriver import TaskDriver
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin

#AHFUL Task Routes
taskBlueprint = Blueprint("task", __name__, url_prefix="/AHFULtasks")

# Get all tasks
@taskBlueprint.route("/", methods=["GET"])
@verify_user_developer
def get_all_tasks():
    tasks, error = TaskDriver.get_all_tasks()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(tasks), 200

# Ensure only opearte on own objs 
# Get task by ID
@taskBlueprint.route("/<task_id>", methods=["GET"])
def get_task(task_id):
    task, error = TaskDriver.get_task_by_id(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(task), 200

# Get tasks by user ID
@taskBlueprint.route("/user/<user_id>", methods=["GET"])
@verify_user_login
def get_tasks_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    tasks, error = TaskDriver.get_tasks_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tasks), 200

# Create a new task for a given user ID
@taskBlueprint.route("/create/<user_id>", methods=["POST"])
@verify_user_login
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

# Ensure only op on own objs?
# Update an existing task by ID
@taskBlueprint.route("/update/<task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    task, error = TaskDriver.update_task(task_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(task), 200

# Ensure only op on own objs?
# Delete a task by ID
@taskBlueprint.route("/delete/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    result, error = TaskDriver.delete_task(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
