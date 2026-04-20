# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
gymCollection = ahfulAppDataDB['gym']

class GymObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(gym):
        """Convert MongoDB document to JSON-safe dict."""
        if gym:
            gym["_id"] = str(gym["_id"])
            if gym.get("owner_id"):
                gym["owner_id"] = str(gym["owner_id"])
        return gym

    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(gym_data):
        result = gymCollection.insert_one(gym_data)
        return str(result.inserted_id)

    # ── Read ──────────────────────────────────────────────────────────────────
    def find_all():
        gyms = gymCollection.find()
        return [GymObject._serialize(g) for g in gyms]

    def find_by_id(id):
        gym = gymCollection.find_one({"_id": ObjectId(id)})
        return GymObject._serialize(gym)
    
    # ── Update ──────────────────────────────────────────────────────────────────
    @staticmethod
    def update(id, updates):
        if not updates:
            return None

        filter_doc = {"_id": ObjectId(id)}
        update_doc = {"$set": updates}

        result = gymCollection.update_one(filter_doc, update_doc)

        # If no document matched the id, return None
        if result.matched_count == 0:
            return None

        # Fetch and return the current state after update (serialized)
        updated = gymCollection.find_one(filter_doc)
        return GymObject._serialize(updated)

    # ── Delete ──────────────────────────────────────────────────────────────────
    @staticmethod
    def delete(id):
        result = gymCollection.delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)
