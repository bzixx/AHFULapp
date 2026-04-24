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
            food["user_id"] = str(food["user_id"])
        return food

    # ── Create ──────────────────────────────────────────────────────────────────
    @staticmethod
    def create(food_data):
        result = foodCollection.insert_one(food_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    def find_all():
        food = foodCollection.find()
        return [FoodObject._serialize(g) for g in food]

    def find_by_id(id):
        food = foodCollection.find_one({"_id": ObjectId(id)})
        return FoodObject._serialize(food)

    def find_by_user(id):
        food = foodCollection.find({"user_id": ObjectId(id)})
        return [FoodObject._serialize(g) for g in food]

    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def update(id, update_data):
        result = foodCollection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return None
        return FoodObject.find_by_id(id)

    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = foodCollection.delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)

    # ── Favorite ────────────────────────────────────────────────────────────────
    @staticmethod
    def toggle_favorite(id):
        """Toggle the favorite status of a food."""
        food = foodCollection.find_one({"_id": ObjectId(id)})
        if not food:
            return None
        
        # Toggle favorite field
        current_favorite = food.get("favorite", False)
        new_favorite = not current_favorite
        
        result = foodCollection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"favorite": new_favorite}}
        )
        
        if result.matched_count == 0:
            return None
        
        # Return updated food
        updated = foodCollection.find_one({"_id": ObjectId(id)})
        return FoodObject._serialize(updated)

    @staticmethod
    def find_favorites_by_user(user_id):
        """Get all favorite foods for a user."""
        foods = foodCollection.find({
            "user_id": ObjectId(user_id),
            "favorite": True
        })
        return [FoodObject._serialize(f) for f in foods]
