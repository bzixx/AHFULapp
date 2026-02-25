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
        return gym

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        gyms = gymCollection.find()
        return [GymObject._serialize(g) for g in gyms]

    def find_by_id(id):
        gym = gymCollection.find_one({"_id": ObjectId(id)})
        return GymObject._serialize(gym)

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(gym_data):
        result = gymCollection.insert_one(gym_data)
        return str(result.inserted_id)