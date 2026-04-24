from bson import ObjectId
from datetime import datetime
import time
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
taskCollection = ahfulAppDataDB['task']

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
        task = taskCollection.find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(task)

    @staticmethod
    def find_by_user_id(user_id):
        tasks = taskCollection.find({"user_id": ObjectId(user_id)})
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def find_all():
        tasks = taskCollection.find()
        return [TaskObject._serialize(t) for t in tasks]

    @staticmethod
    def find_overdue():
        now_timestamp = int(time.time())
        tasks = taskCollection.find({
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
            
        result = taskCollection.insert_one(task_data)
        return str(result.inserted_id)

    @staticmethod
    def update(task_id, updates):
        updates["updated_at"] = int(datetime.now().timestamp())
        result = taskCollection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updates}
        )
        if result.matched_count == 0:
            return None
        updated = taskCollection.find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(updated)

    @staticmethod
    def delete(task_id):
        result = taskCollection.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count > 0

    # ── Favorite ────────────────────────────────────────────────────────────────
    @staticmethod
    def toggle_favorite(task_id):
        """Toggle the favorite status of a task."""
        task = taskCollection.find_one({"_id": ObjectId(task_id)})
        if not task:
            return None
        
        # Toggle favorite field
        current_favorite = task.get("favorite", False)
        new_favorite = not current_favorite
        
        result = taskCollection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"favorite": new_favorite, "updated_at": int(datetime.now().timestamp())}}
        )
        
        if result.matched_count == 0:
            return None
        
        # Return updated task
        updated = taskCollection.find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(updated)

    @staticmethod
    def find_favorites_by_user(user_id):
        """Get all favorite tasks for a user."""
        tasks = taskCollection.find({
            "user_id": ObjectId(user_id),
            "favorite": True
        })
        return [TaskObject._serialize(t) for t in tasks]
