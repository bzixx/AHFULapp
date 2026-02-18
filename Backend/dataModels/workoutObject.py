#So the models are essentially the database access layer — they know how to talk to MongoDB but have no idea what business rules exist
from bson import ObjectId
from services.mongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
workoutCollection = ahfulAppDataDB['workout']

class workoutObject:
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
        return [workoutObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = workoutCollection.find_one({"_id": ObjectId(id)})
        return workoutObject._serialize(workout)
    
    def find_by_email(email):
        workout = workoutCollection.find({"userEmail": email})
        return [workoutObject._serialize(w) for w in workout]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = workoutCollection.insert_one(workout_data)
        return str(result.inserted_id)