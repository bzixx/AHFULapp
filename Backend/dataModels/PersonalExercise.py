#So the models are essentially the database access layer — they know how to talk to MongoDB but have no idea what business rules exist
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
personalExerciseCollection = ahfulAppDataDB['personalExercise']

class PersonalExerciseObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(gym):
        """Convert MongoDB document to JSON-safe dict."""
        if gym:
            gym["_id"] = str(gym["_id"])
        return gym

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        workout = personalExerciseCollection.find()
        return [PersonalExerciseObject._serialize(w) for w in workout]

    def find_by_id(id):
        workout = personalExerciseCollection.find_one({"_id": ObjectId(id)})
        return PersonalExerciseObject._serialize(workout)
    
    def find_by_email(email):
        workout = personalExerciseCollection.find({"userEmail": email})
        return [PersonalExerciseObject._serialize(w) for w in workout]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = personalExerciseCollection.insert_one(workout_data)
        return str(result.inserted_id)