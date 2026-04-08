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
    
    # ── Validation ─────────────────────────────────────────────────────────────
    @staticmethod
    def validate(data):
        """Validate exercise data. Returns (is_valid, error_message)."""
        if not data:
            return False, "No data provided"
        
        if "name" not in data or not isinstance(data["name"], str) or not data["name"].strip():
            return False, "Name is required and must be a non-empty string"
        
        array_fields = ["targetMuscles", "bodyParts", "equipments", "secondaryMuscles", "instructions"]
        for field in array_fields:
            if field in data and not isinstance(data[field], list):
                return False, f"{field} must be an array"
        
        return True, None
    
    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(exercise_data):
        is_valid, error = ExerciseObject.validate(exercise_data)
        if not is_valid:
            return None, error
        
        result = ExerciseCollection.insert_one(exercise_data)
        return str(result.inserted_id), None

    # ── Read ──────────────────────────────────────────────────────────────────
    @staticmethod
    def find_all():
        workout = ExerciseCollection.find()
        return [ExerciseObject._serialize(w) for w in workout]
    
    @staticmethod
    def find_by_id(id):
        workout = ExerciseCollection.find_one({"_id": ObjectId(id)})
        return ExerciseObject._serialize(workout)
        
    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = ExerciseCollection.delete_one({"_id": ObjectId(id)})
        return id if result.deleted_count == 1 else None
