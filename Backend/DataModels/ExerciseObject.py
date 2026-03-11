# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
ExerciseCollection = ahfulAppDataDB['exercise']

class ExerciseObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(exercise):
        """Convert MongoDB document to JSON-safe dict."""
        if exercise:
            exercise["_id"] = str(exercise["_id"])
        return exercise
    
    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(workout_data):
        result = ExerciseCollection.insert_one(workout_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    @staticmethod
    def find_all():
        workout = ExerciseCollection.find()
        return [ExerciseObject._serialize(w) for w in workout]
    
    @staticmethod
    def find_by_id(id):
        workout = ExerciseCollection.find_one({"_id": ObjectId(id)})
        return ExerciseObject._serialize(workout)
    
    @staticmethod
    def find_by_email(email):
        workout = ExerciseCollection.find({"userEmail": email})
        return [ExerciseObject._serialize(w) for w in workout]
        
    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = ExerciseCollection.delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)
    
    
        