# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from datetime import datetime
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

    # ── Read ──────────────────────────────────────────────────────────────────
    def find_all():
        users = userCollection.find()
        return [UserObject._serialize(u) for u in users]
    
    def find_by_id(id):
        user = userCollection.find_one({"_id": ObjectId(id)})
        return UserObject._serialize(user)

    def find_by_email(email):
        user = userCollection.find_one({"email": email})
        return UserObject._serialize(user)
    
    def find_email_by_id(id):
        user = userCollection.find_one({"_id": ObjectId(id)})
        return UserObject._serialize(user["email"])

    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def add_role_by_id(user_id, role):
        result = userCollection.update_one(
            {"_id": ObjectId(user_id)},
            {
                # add only if not present; if roles is missing, it becomes [role]
                "$addToSet": {"roles": role},
                "$set": {"updated_at": datetime.now()}
            }
        )
        if result.matched_count == 0:
            return None
        # return updated document
        updated = userCollection.find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    @staticmethod
    def remove_role_by_id(user_id, role):
        result = userCollection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"roles": role},
                "$set": {"updated_at": datetime.now()}
            }
        )
        if result.matched_count == 0:
            return None
        updated = userCollection.find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    # ── Untested ──────────────────────────────────────────────────────────────────
    #Not tested
    @staticmethod
    def create(user_data):
        user_data["roles"] = ["User"]
        result = userCollection.insert_one(user_data)
        return str(result.inserted_id)
    
    # Not tested
    @staticmethod
    def update(user_id, updates):
        updateResults = userCollection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if not updateResults:
            raise "Failed to updated from Object"
        
    # Not tested    
    @staticmethod
    def delete(user_id):
        userCollection.delete_one({"_id": ObjectId(user_id)})