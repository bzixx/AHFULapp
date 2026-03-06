# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
ExerciseCollection = ahfulAppDataDB['exercise']

class ExerciseObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(gym):
        """Convert MongoDB document to JSON-safe dict."""
        if gym:
            gym["_id"] = str(gym["_id"])
        return gym

    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = ExerciseCollection.insert_one(workout_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    def find_all():
        workout = ExerciseCollection.find()
        return [ExerciseObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = ExerciseCollection.find_one({"_id": ObjectId(id)})
        return ExerciseObject._serialize(workout)
    
    def find_by_email(email):
        workout = ExerciseCollection.find({"userEmail": email})
        return [ExerciseObject._serialize(w) for w in workout]
    
    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = ExerciseCollection.delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)
    