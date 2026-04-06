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
    
    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(personalEx_data):
        result = personalExCollection.insert_one(personalEx_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    @staticmethod
    def find_all():
        personalEx = personalExCollection.find()
        return [PersonalExObject._serialize(w) for w in personalEx]

    @staticmethod
    def find_by_id(id):
        personalEx = personalExCollection.find_one({"_id": ObjectId(id)})
        return PersonalExObject._serialize(personalEx)
    
    @staticmethod
    def find_by_user(user_id):
        personalEx = personalExCollection.find({"userId": ObjectId(user_id)})
        return [PersonalExObject._serialize(w) for w in personalEx]
    
    @staticmethod
    def find_by_workout(workout_id):
        personalEx = personalExCollection.find({"workoutId": ObjectId(workout_id)})
        return [PersonalExObject._serialize(w) for w in personalEx]
    
    # ── Update ──────────────────────────────────────────────────────────────────
    @staticmethod
    def update(id, updates):
        if not updates:
            return None

        filter_doc = {"_id": ObjectId(id)}
        update_doc = {"$set": updates}

        result = personalExCollection.update_one(filter_doc, update_doc)

        # If no document matched the id, return None
        if result.matched_count == 0:
            return None

        # Fetch and return the current state after update (serialized)
        updated = personalExCollection.find_one(filter_doc)
        return PersonalExObject._serialize(updated)

    # ── Delete ──────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = personalExCollection.delete_one({"_id": ObjectId(id)})
        return id if result.deleted_count == 1 else None