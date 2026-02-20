#DataModel & Objects are essentially the Database Access Layer -- They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
userCollection = ahfulAppDataDB['user']

class UserObject:

    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(user):
        """Convert MongoDB document to JSON-safe dict."""
        if user:
            user["_id"] = str(user["_id"])
        return user

    # ── Reads ──────────────────────────────────────────────────────────────────
    def find_all():
        users = userCollection.find()
        return [UserObject._serialize(u) for u in users]

    def find_by_email(email):
        user = userCollection.find_one({"email": email})
        return UserObject._serialize(user)

    # ── Writes ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create(user_data):
        user_data["role"] = 0
        result = userCollection.insert_one(user_data)
        return str(result.inserted_id)

    # Not correct
    @staticmethod
    def update(user_id, updates):
        updateResults = userCollection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if not updateResults:
            raise "Failed to updated from Object"

    @staticmethod
    def delete(user_id):
        userCollection.delete_one({"_id": ObjectId(user_id)})