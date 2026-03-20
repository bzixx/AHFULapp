from flask import Blueprint, request, jsonify
from Services.TaskDriver import TaskDriver

taskBlueprint = Blueprint("task", __name__, url_prefix="/AHFULtasks")

@taskBlueprint.route("/<task_id>", methods=["GET"])
def get_task(task_id):
    task, error = TaskDriver.get_task_by_id(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(task), 200

@taskBlueprint.route("/user/<user_id>", methods=["GET"])
def get_tasks_by_user(user_id):
    tasks, error = TaskDriver.get_tasks_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(tasks), 200

@taskBlueprint.route("/create/<user_id>", methods=["POST"])
def create_task(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    task, error = TaskDriver.create_task(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(task), 201

@taskBlueprint.route("/update/<task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    task, error = TaskDriver.update_task(task_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(task), 200

@taskBlueprint.route("/delete/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    result, error = TaskDriver.delete_task(task_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200
