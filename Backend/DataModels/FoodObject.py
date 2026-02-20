#So the models are essentially the database access layer — they know how to talk to MongoDB but have no idea what business rules exist
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
        return food

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        food = foodCollection.find()
        return [FoodObject._serialize(g) for g in food]

    def find_by_user(id):
        food = foodCollection.find({"userId": id})
        return [FoodObject._serialize(g) for g in food]

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(food_data):
        result = foodCollection.insert_one(food_data)
        return str(result.inserted_id)