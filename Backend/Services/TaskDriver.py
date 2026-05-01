from DataModels.TaskObject import TaskObject
from DataModels.UserObject import UserObject
from bson import ObjectId, errors as bson_errors

class TaskDriver:
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    @staticmethod
    def verify_operation(user_id, task_id):
        if (not user_id) or (not task_id):
            return None, "Missing user or task_id"

        # Convert IDs safely
        user_id, err = TaskDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        # Convert IDs safely
        task_id, err = TaskDriver._validate_obj_id(task_id, "task_id")
        if err:
            return None, err

        user = UserObject.find_by_id(user_id)
        if not user:
            return None, "User not found"
        task = TaskObject.find_by_id(task_id)
        if not task:
            return None, "Food not found"

        if user["_id"] == task["user_id"]:
            return "Operation valid", None
        elif ("Admin" in user["roles"]) or ("Developer" in user["roles"]):
            return "Operation valid", None
        else:
            return None, "You must operate on your own object or have sufficient privileges"

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
    def get_all_tasks():
        try:
            tasks = TaskObject.find_all()
            return tasks, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def find_overdue_tasks():
        try:
            tasks = TaskObject.find_overdue()
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
        if "dueTime" not in task_data or task_data.get("dueTime") is None:
            task_data["dueTime"] = 0
        if task_data.get("dueTime") is not None:
            if not isinstance(task_data.get("dueTime"), (int, float)):
                return None, "dueTime must be a timestamp (int or float)"
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

            # Handle recurring tasks when completed
            if updates.get("completed") == True and existing.get("recurring"):
                next_task = TaskObject.create_next_occurrence(oid)
                if next_task:
                    return {"task": updated, "nextOccurrence": next_task}, None

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

    # ── Favorite ───────────────────────────────────────────────────────────────
    @staticmethod
    def toggle_favorite(user_id, task_id):
        """Toggle favorite status of a task."""
        # Validate inputs
        if not user_id or not task_id:
            return None, "user_id and task_id are required"

        # Validate task_id format
        task_oid, err = TaskDriver._validate_obj_id(task_id, "task_id")
        if err:
            return None, err

        try:
            # Check that task exists and belongs to user
            task = TaskObject.find_by_id(task_oid)
            if not task:
                return None, "Task not found"
            
            # Verify user owns the task
            if str(task.get("user_id")) != str(user_id):
                return None, "You can only modify your own tasks"
            
            updated = TaskObject.toggle_favorite(task_oid)
            if not updated:
                return None, "Task not found"
            return updated, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_favorite_tasks(user_id):
        """Get all favorite tasks for a user."""
        if not user_id:
            return None, "user_id is required"

        oid, err = TaskDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err

        try:
            tasks = TaskObject.find_favorites_by_user(user_id)
            return tasks, None
        except Exception as e:
            return None, str(e)
