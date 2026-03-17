from DataModels.TaskObject import TaskObject
from bson import ObjectId, errors as bson_errors

class TaskDriver:
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    @staticmethod
    def get_task_by_id(task_id):
        if not task_id:
            return None, "task_id is required"
        oid, err = TaskDriver._validate_obj_id(task_id, "task_id")
        if err:
            return None, err
        try:
            task = TaskObject.find_by_id(oid)
            if not task:
                return None, "Task not found"
            return task, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_tasks_by_user(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = TaskDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            tasks = TaskObject.find_by_user_id(oid)
            return tasks, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_task(user_id, task_data):
        if not user_id:
            return None, "user_id is required"
        if not task_data:
            return None, "task_data is required"
        if not task_data.get("name"):
            return None, "name is required"
        oid, err = TaskDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            task_id = TaskObject.create(oid, task_data)
            task = TaskObject.find_by_id(task_id)
            return task, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def update_task(task_id, updates):
        if not task_id:
            return None, "task_id is required"
        if not updates:
            return None, "No updates provided"
        oid, err = TaskDriver._validate_obj_id(task_id, "task_id")
        if err:
            return None, err
        try:
            existing = TaskObject.find_by_id(oid)
            if not existing:
                return None, "Task not found"
            updates.pop("_id", None)
            updates.pop("user_id", None)
            updates.pop("created_at", None)
            updated = TaskObject.update(oid, updates)
            return updated, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_task(task_id):
        if not task_id:
            return None, "task_id is required"
        oid, err = TaskDriver._validate_obj_id(task_id, "task_id")
        if err:
            return None, err
        try:
            existing = TaskObject.find_by_id(oid)
            if not existing:
                return None, "Task not found"
            deleted = TaskObject.delete(oid)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)
