#So the models are essentially the database access layer — they know how to talk to MongoDB but have no idea what business rules exist
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
muscleGroupCollection = ahfulAppDataDB['muscleGroup']

class MuscleGroupObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(gym):
        """Convert MongoDB document to JSON-safe dict."""
        if gym:
            gym["_id"] = str(gym["_id"])
        return gym

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        workout = muscleGroupCollection.find()
        return [MuscleGroupObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = muscleGroupCollection.find_one({"_id": ObjectId(id)})
        return MuscleGroupObject._serialize(workout)
    
    def find_by_email(email):
        workout = muscleGroupCollection.find({"userEmail": email})
        return [MuscleGroupObject._serialize(w) for w in workout]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = muscleGroupCollection.insert_one(workout_data)
        return str(result.inserted_id)