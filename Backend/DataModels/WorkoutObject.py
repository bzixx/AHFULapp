# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
workoutCollection = ahfulAppDataDB['workout']

class WorkoutObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(workout):
        """Convert MongoDB document to JSON-safe dict."""
        if workout:
            workout["_id"] = str(workout["_id"])
            workout["user_id"] = str(workout["user_id"])
            workout["gym_id"] = str(workout["gym_id"])
        return workout
    
    @staticmethod
    def _serialize_template(workout):
        """Convert MongoDB document to JSON-safe dict."""
        if workout:
            workout["_id"] = str(workout["_id"])
            workout["user_id"] = str(workout["user_id"])
        return workout
    
    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = workoutCollection.insert_one(workout_data)
        return str(result.inserted_id)
    
    @staticmethod
    def create_template(template_data):
        result = workoutCollection.insert_one(template_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    @staticmethod
    def find_all():
        workout = workoutCollection.find({
            "template": False,
            "startTime": {"$ne": 0}
        })
        return [WorkoutObject._serialize(w) for w in workout]

    @staticmethod   
    def find_by_id(id):
        workout = workoutCollection.find_one({
            "_id": ObjectId(id),
            "template": False,
            "startTime": {"$ne": 0}
        })
        return WorkoutObject._serialize(workout)
    
    @staticmethod
    def find_by_user(user_id):
        workout = workoutCollection.find({
            "user_id": ObjectId(user_id),
            "template": False,
            "startTime": {"$ne": 0}
        })
        return [WorkoutObject._serialize(w) for w in workout]

    @staticmethod
    def find_template(id):
        template = workoutCollection.find_one({
            "_id": ObjectId(id),
            "template": True,
            "startTime": 0
        })
        return WorkoutObject._serialize_template(template)

    @staticmethod
    def find_user_templates(user_id):
        template = workoutCollection.find({
            "user_id": ObjectId(user_id),
            "template": True,
            "startTime": 0
        })
        return [WorkoutObject._serialize_template(t) for t in template]

    # ── Update ──────────────────────────────────────────────────────────────────
    @staticmethod
    def update(id, updates):
        if not updates:
            return None

        filter_doc = {"_id": ObjectId(id)}
        update_doc = {"$set": updates}

        result = workoutCollection.update_one(filter_doc, update_doc)

        # If no document matched the id, return None
        if result.matched_count == 0:
            return None

        # Fetch and return the current state after update (serialized)
        updated = workoutCollection.find_one(filter_doc)
        return WorkoutObject._serialize(updated)

    # ── Delete ──────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = workoutCollection.delete_one({"_id": ObjectId(id)})
        return id if result.deleted_count == 1 else None