#So the models are essentially the database access layer — they know how to talk to MongoDB but have no idea what business rules exist
from bson import ObjectId
from services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
gymCollection = ahfulAppDataDB['gym']

class gymObject:
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
        return [gymObject._serialize(g) for g in gyms]

    def find_by_id(id):
        gym = gymCollection.find_one({"_id": ObjectId(id)})
        return gymObject._serialize(gym)

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(gym_data):
        result = gymCollection.insert_one(gym_data)
        return str(result.inserted_id)