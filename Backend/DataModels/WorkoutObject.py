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
            workout["userId"] = str(workout["userId"])
            workout["gymId"] = str(workout["gymId"])
        return workout
    
    @staticmethod
    def _serialize_template(workout):
        """Convert MongoDB document to JSON-safe dict."""
        if workout:
            workout["_id"] = str(workout["_id"])
            workout["userId"] = str(workout["userId"])
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
    def find_all():
        workout = workoutCollection.find({
            "template": {"$exists": False},
            "startTime": {"$ne": 0}
        })
        return [WorkoutObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = workoutCollection.find_one({
            "_id": ObjectId(id),
            "template": {"$exists": False},
            "startTime": {"$ne": 0}
        })
        return WorkoutObject._serialize(workout)
    
    def find_by_user(userId):
        workout = workoutCollection.find({
            "userId": ObjectId(userId),
            "template": {"$exists": False},
            "startTime": {"$ne": 0}
        })
        return [WorkoutObject._serialize(w) for w in workout]

    def find_templates(userId):
        template = workoutCollection.find({
            "userId": ObjectId(userId),
            "template": {"$exists": True},
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
        return str((result.deleted_count == 1) * id)