#DataModel & Objects are essentially the Database Access Layer -- They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
workoutCollection = ahfulAppDataDB['gym']

class GymObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(gym):
        """Convert MongoDB document to JSON-safe dict."""
        if gym:
            gym["_id"] = str(gym["_id"])
        return gym

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        workout = workoutCollection.find()
        return [GymObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = workoutCollection.find_one({"_id": ObjectId(id)})
        return GymObject._serialize(workout)
    
    def find_by_email(email):
        workout = workoutCollection.find({"userEmail": email})
        return [GymObject._serialize(w) for w in workout]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = workoutCollection.insert_one(workout_data)
        return str(result.inserted_id)