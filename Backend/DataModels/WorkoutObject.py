#DataModel & Objects are essentially the Database Access Layer -- They know how to talk to Mongo DB Collection and that is it. 
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
        return workout

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        workout = workoutCollection.find()
        return [WorkoutObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = workoutCollection.find_one({"_id": ObjectId(id)})
        return WorkoutObject._serialize(workout)
    
    def find_by_email(email):
        workout = workoutCollection.find({"userEmail": email})
        return [WorkoutObject._serialize(w) for w in workout]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = workoutCollection.insert_one(workout_data)
        return str(result.inserted_id)