from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import getMongoDatabase

#initialize MongoDB connection and collection
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

    # Retrieves a task by its ID
    @staticmethod
    def find_by_id(task_id):
        task = taskCollection.find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(task)

    # Retrieves all tasks associated with a specific user ID
    @staticmethod
    def find_by_user_id(user_id):
        tasks = taskCollection.find({"user_id": ObjectId(user_id)})
        return [TaskObject._serialize(t) for t in tasks]

    # Retrieves all tasks in the collection (for testing purposes)
    @staticmethod
    def find_all():
        tasks = taskCollection.find()
        return [TaskObject._serialize(t) for t in tasks]

    # Creates a new task with the provided data and associates it with the given user ID
    @staticmethod
    def create(user_id, task_data):
        task_data["user_id"] = ObjectId(user_id)
        task_data["created_at"] = datetime.now()
        
        if "note" not in task_data:
            task_data["note"] = ""
        if "dueTime" not in task_data:
            task_data["dueTime"] = None
        if "completed" not in task_data:
            task_data["completed"] = False
            
        result = taskCollection.insert_one(task_data)
        return str(result.inserted_id)

    #updates an existing task with the provided updates. It also updates the "updated_at" timestamp to the current time. If the task is not found, it returns None. Otherwise, it returns the updated task data.
    @staticmethod
    def update(task_id, updates):
        updates["updated_at"] = datetime.now()
        result = taskCollection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": updates}
        )
        if result.matched_count == 0:
            return None
        updated = taskCollection.find_one({"_id": ObjectId(task_id)})
        return TaskObject._serialize(updated)

    #deletes a task by its ID. It returns True if the deletion was successful (i.e., a task was deleted) and False otherwise (i.e., no task was found with the given ID).
    @staticmethod
    def delete(task_id):
        result = taskCollection.delete_one({"_id": ObjectId(task_id)})
        return result.deleted_count > 0
