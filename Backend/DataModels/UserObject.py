# DataModel & Objects are essentially the Database Access Layer
# They know how to talk to Mongo DB Collection and that is it. 
from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import get_collection

class UserObject:
    # ── Helpers ────────────────────────────────────────────────────────────────
    @staticmethod
    def _serialize(user):
        """Convert MongoDB document to JSON-safe dict."""
        if user:
            user["_id"] = str(user["_id"])
        return user

    # ── Read ──────────────────────────────────────────────────────────────────
    @staticmethod
    def find_all():
        users = get_collection('user').find()
        return [UserObject._serialize(u) for u in users]
    
    @staticmethod
    def find_by_id(id):
        user = get_collection('user').find_one({"_id": ObjectId(id)})
        return UserObject._serialize(user)

    @staticmethod
    def find_by_email(email):
        user = get_collection('user').find_one({"email": email})
        return UserObject._serialize(user)
    
    # def find_email_by_id(id):
    #     user = userCollection.find_one({"_id": ObjectId(id)})
    #     return UserObject._serialize(user["email"])

    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def add_role_by_id(user_id, role):
        result = get_collection('user').update_one(
            {"_id": ObjectId(user_id)},
            {
                # add only if not present; if roles is missing, it becomes [role]
                "$addToSet": {"roles": role},
                "$set": {"updated_at": int(datetime.now().timestamp())}
            }
        )
        if result.matched_count == 0:
            return None
        # return updated document
        updated = get_collection('user').find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    @staticmethod
    def remove_role_by_id(user_id, role):
        result = get_collection('user').update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {"roles": role},
                "$set": {"updated_at": int(datetime.now().timestamp())}
            }
        )
        if result.matched_count == 0:
            return None
        updated = get_collection('user').find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    @staticmethod
    def deactivate_by_id(user_id):
        result = get_collection('user').update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "deactivated": True,
                    "updated_at": int(datetime.now().timestamp())
                }
            }
        )
        if result.matched_count == 0:
            return None
        updated = get_collection('user').find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    @staticmethod
    def enable_verification(user_id, type):
        if type == "email":
            result = get_collection('user').update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"email_verified": True}
                }
            )
        else :
            result = get_collection('user').update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"phone_verified": True}
                }
            )

        if result.matched_count == 0:
            return None
        # return updated document
        updated = get_collection('user').find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    @staticmethod
    def disable_verification(user_id, type):
        if type == "email":
            result = get_collection('user').update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"email_verified": False}
                }
            )
        else :
            result = get_collection('user').update_one(
                {"_id": ObjectId(user_id)},
                {
                    "$set": {"phone_verified": False}
                }
            )

        if result.matched_count == 0:
            return None
        # return updated document
        updated = get_collection('user').find_one({"_id": ObjectId(user_id)})
        return UserObject._serialize(updated)
    
    # ── Untested ──────────────────────────────────────────────────────────────────
    #Not tested
    @staticmethod
    def create(user_data):
        user_data["roles"] = ["User"]
        user_data["email_verified"] = False
        user_data["phone_verified"] = False
        result = get_collection('user').insert_one(user_data)
        return str(result.inserted_id)
    
    # Not tested
    @staticmethod
    def update(user_id, updates):
        updateResults = get_collection('user').update_one(
            {"_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if not updateResults:
            raise "Failed to updated from Object"
        
    # Not tested    
    @staticmethod
    def delete(user_id):
        result = get_collection('user').delete_one({"_id": ObjectId(user_id)})
        return id if result.deleted_count == 1 else None