# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
foodCollection = ahfulAppDataDB['food']

class FoodObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(food):
        """Convert MongoDB document to JSON-safe dict."""
        if food:
            food["_id"] = str(food["_id"])
            food["userId"] = str(food["userId"])
        return food

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        food = foodCollection.find()
        return [FoodObject._serialize(g) for g in food]
    
    def find_by_id(id):
        food = foodCollection.find_one({"_id": ObjectId(id)})
        return FoodObject._serialize(food)

    def find_by_user(id):
        food = foodCollection.find({"userId": ObjectId(id)})
        return [FoodObject._serialize(g) for g in food]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(food_data):
        result = foodCollection.insert_one(food_data)
        return str(result.inserted_id)

    @staticmethod
    def delete(id):
        result = foodCollection.delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)