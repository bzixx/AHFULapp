from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import get_collection


class SocialObject:
    @staticmethod
    def _serialize(friendship):
        if friendship:
            friendship["_id"] = str(friendship["_id"])
        return friendship

    @staticmethod
    def find_by_id(friendship_id):
        friendship = get_collection("socialFriends").find_one({"_id": ObjectId(friendship_id)})
        return SocialObject._serialize(friendship)

    @staticmethod
    def find_all():
        friendships = get_collection("socialFriends").find()
        return [SocialObject._serialize(f) for f in friendships]

    @staticmethod
    def find_by_user_email(user_email):
        friendships = get_collection("socialFriends").find(
            {
                "$or": [
                    {"User1Email": user_email},
                    {"User2Email": user_email},
                ]
            }
        )
        return [SocialObject._serialize(f) for f in friendships]

    @staticmethod
    def find_pending_for_user_email(user_email):
        friendships = get_collection("socialFriends").find(
            {
                "User2Email": user_email,
                "User2Accepted": False,
            }
        )
        return [SocialObject._serialize(f) for f in friendships]

    @staticmethod
    def find_pending_all():
        friendships = get_collection("socialFriends").find(
            {
                "User2Accepted": False,
            }
        )
        return [SocialObject._serialize(f) for f in friendships]

    @staticmethod
    def find_between_emails(user1_email, user2_email):
        friendship = get_collection("socialFriends").find_one(
            {
                "$or": [
                    {
                        "User1Email": user1_email,
                        "User2Email": user2_email,
                    },
                    {
                        "User1Email": user2_email,
                        "User2Email": user1_email,
                    },
                ]
            }
        )
        return SocialObject._serialize(friendship)

    @staticmethod
    def create(user1_email, user2_email):
        now_ts = int(datetime.now().timestamp())
        friendship_data = {
            "User1Email": user1_email,
            "User2Email": user2_email,
            "User1Accepted": True,
            "User2Accepted": False,
            "ConfirmedSince": None,
            "created_at": now_ts,
            "updated_at": now_ts,
        }
        result = get_collection("socialFriends").insert_one(friendship_data)
        return str(result.inserted_id)

    @staticmethod
    def update(friendship_id, updates):
        updates["updated_at"] = int(datetime.now().timestamp())
        result = get_collection("socialFriends").update_one(
            {"_id": ObjectId(friendship_id)},
            {"$set": updates},
        )
        if result.matched_count == 0:
            return None
        updated = get_collection("socialFriends").find_one({"_id": ObjectId(friendship_id)})
        return SocialObject._serialize(updated)

    @staticmethod
    def delete(friendship_id):
        result = get_collection("socialFriends").delete_one({"_id": ObjectId(friendship_id)})
        return result.deleted_count > 0
