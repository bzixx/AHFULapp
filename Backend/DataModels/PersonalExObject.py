# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
personalExCollection = ahfulAppDataDB['personalExercise']

class PersonalExObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(personalEx):
        """Convert MongoDB document to JSON-safe dict."""
        if personalEx:
            personalEx["_id"] = str(personalEx["_id"])
            personalEx["userId"] = str(personalEx["userId"])
            personalEx["workoutId"] = str(personalEx["workoutId"])
            personalEx["exerciseId"] = str(personalEx["exerciseId"])
        return personalEx

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        personalEx = personalExCollection.find()
        return [PersonalExObject._serialize(w) for w in personalEx]

    def find_by_id(id):
        personalEx = personalExCollection.find_one({"_id": ObjectId(id)})
        return PersonalExObject._serialize(personalEx)
    
    def find_by_user(userId):
        personalEx = personalExCollection.find({"userId": ObjectId(userId)})
        return [PersonalExObject._serialize(w) for w in personalEx]
    
    def find_by_workout(workoutId):
        personalEx = personalExCollection.find({"workoutId": ObjectId(workoutId)})
        return [PersonalExObject._serialize(w) for w in personalEx]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(personalEx_data):
        result = personalExCollection.insert_one(personalEx_data)
        return str(result.inserted_id)