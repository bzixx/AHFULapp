from bson import ObjectId
from datetime import datetime
import time
from Services.MongoDriver import get_collection

class TaskObject:
    @staticmethod
    def _serialize(task):
        if task:
            task["_id"] = str(task["_id"])
            if "user_id" in task:
                task["user_id"] = str(task["user_id"])
        return task

    @staticmethod
    def find_by_id(task_id):
        task = get_collection('task').find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(task)

    @staticmethod
    def find_by_user_id(user_id):
        tasks = get_collection('task').find({"user_id": ObjectId(user_id)})
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def find_all():
        tasks = get_collection('task').find()
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def find_overdue():
        now_timestamp = int(time.time())
        tasks = get_collection('task').find({
            "dueTime": {"$ne": None, "$lte": now_timestamp},
            "completed": False
        })
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def create(user_id, task_data):
        task_data["user_id"] = ObjectId(user_id)
        task_data["created_at"] = int(datetime.now().timestamp())

        if "note" not in task_data:
            task_data["note"] = ""
        if "dueTime" not in task_data:
            task_data["dueTime"] = None
        if "completed" not in task_data:
            task_data["completed"] = False

        # Recurrence fields
        if "recurring" not in task_data:
            task_data["recurring"] = False
        if "recurrenceType" not in task_data:
            task_data["recurrenceType"] = None  # daily, weekly, monthly, yearly
        if "recurrenceEndDate" not in task_data:
            task_data["recurrenceEndDate"] = None

        result = get_collection('task').insert_one(task_data)
        return str(result.inserted_id)

    @staticmethod
    def update(task_id, updates):
        updates["updated_at"] = int(datetime.now().timestamp())
        result = get_collection('task').update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updates}
        )
        if result.matched_count == 0:
            return None
        updated = get_collection('task').find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(updated)

    @staticmethod
    def delete(task_id):
        result = get_collection('task').delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count > 0

    # ── Favorite ────────────────────────────────────────────────────────────────
    @staticmethod
    def toggle_favorite(task_id):
        """Toggle the favorite status of a task."""
        task = get_collection('task').find_one({"_id": ObjectId(task_id)})
        if not task:
            return None

        # Toggle favorite field
        current_favorite = task.get("favorite", False)
        new_favorite = not current_favorite

        result = get_collection('task').update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"favorite": new_favorite, "updated_at": int(datetime.now().timestamp())}}
        )

        if result.matched_count == 0:
            return None

        # Return updated task
        updated = get_collection('task').find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(updated)

    @staticmethod
    def find_favorites_by_user(user_id):
        """Get all favorite tasks for a user."""
        tasks = get_collection('task').find({
            "user_id": ObjectId(user_id),
            "favorite": True
        })
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def create_next_occurrence(task_id):
        """Create the next occurrence of a recurring task."""
        from datetime import timedelta

        task = get_collection('task').find_one({"_id": ObjectId(task_id)})
        if not task or not task.get("recurring"):
            return None

        recurrence_type = task.get("recurrenceType")
        current_due_time = task.get("dueTime")
        end_date = task.get("recurrenceEndDate")

        if not current_due_time or not recurrence_type:
            return None

        # Calculate next due date
        current_due_dt = datetime.fromtimestamp(current_due_time)

        if recurrence_type == "daily":
            next_due_dt = current_due_dt + timedelta(days=1)
        elif recurrence_type == "weekly":
            next_due_dt = current_due_dt + timedelta(weeks=1)
        elif recurrence_type == "monthly":
            # Add one month
            if current_due_dt.month == 12:
                next_due_dt = current_due_dt.replace(year=current_due_dt.year + 1, month=1)
            else:
                next_due_dt = current_due_dt.replace(month=current_due_dt.month + 1)
        elif recurrence_type == "yearly":
            next_due_dt = current_due_dt.replace(year=current_due_dt.year + 1)
        else:
            return None

        next_due_time = int(next_due_dt.timestamp())

        # Check if next occurrence is past end date
        if end_date and next_due_time > end_date:
            return None

        # Create new task for next occurrence
        next_task_data = {
            "user_id": task["user_id"],
            "name": task["name"],
            "note": task.get("note", ""),
            "dueTime": next_due_time,
            "completed": False,
            "favorite": task.get("favorite", False),
            "recurring": True,
            "recurrenceType": recurrence_type,
            "recurrenceEndDate": end_date,
            "created_at": int(datetime.now().timestamp()),
            "updated_at": int(datetime.now().timestamp())
        }

        result = get_collection('task').insert_one(next_task_data)
        new_task = get_collection('task').find_one({"_id": result.inserted_id})
        return TaskObject._serialize(new_task)
