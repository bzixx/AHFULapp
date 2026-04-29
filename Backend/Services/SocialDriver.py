from datetime import datetime
import re
from bson import ObjectId, errors as bson_errors

from DataModels.SocialObject import SocialObject
from DataModels.UserObject import UserObject
from Services.MongoDriver import get_collection


class SocialDriver:
    @staticmethod
    def _validate_obj_id(id_value, name):
        try:
            return ObjectId(str(id_value)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    @staticmethod
    def _normalize_email(email):
        if not isinstance(email, str):
            return None
        normalized = email.strip().lower()
        return normalized if normalized else None

    @staticmethod
    def _find_user_by_email_case_insensitive(email):
        normalized = SocialDriver._normalize_email(email)
        if not normalized:
            return None

        user = UserObject.find_by_email(normalized)
        if user:
            return user

        regex = f"^{re.escape(normalized)}$"
        user_doc = get_collection("user").find_one({"email": {"$regex": regex, "$options": "i"}})
        if not user_doc:
            return None

        user_doc["_id"] = str(user_doc["_id"])
        return user_doc

    @staticmethod
    def resolve_user_id_by_email(email):
        user = SocialDriver._find_user_by_email_case_insensitive(email)
        if not user:
            return None, "User not found"
        return user.get("_id"), None

    @staticmethod
    def get_all_friendships():
        try:
            friendships = SocialObject.find_all()
            return friendships, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_friendship_by_id(friendship_id):
        if not friendship_id:
            return None, "friendship_id is required"
        oid, err = SocialDriver._validate_obj_id(friendship_id, "friendship_id")
        if err:
            return None, err
        try:
            friendship = SocialObject.find_by_id(oid)
            if not friendship:
                return None, "Friendship not found"
            return friendship, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_friendships_by_user(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = SocialDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            user = UserObject.find_by_id(oid)
            if not user:
                return None, "User not found"
            user_email = SocialDriver._normalize_email(user.get("email"))
            if not user_email:
                return None, "User is missing email"
            friendships = SocialObject.find_by_user_email(user_email)
            return friendships, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_friendships_by_email(user_email):
        normalized = SocialDriver._normalize_email(user_email)
        if not normalized:
            return None, "user_email is required"
        try:
            friendships = SocialObject.find_by_user_email(normalized)
            return friendships, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_pending_friend_requests_for_user(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = SocialDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            user = UserObject.find_by_id(oid)
            if not user:
                return None, "User not found"
            user_email = SocialDriver._normalize_email(user.get("email"))
            if not user_email:
                return None, "User is missing email"
            pending = SocialObject.find_pending_for_user_email(user_email)
            return pending, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_pending_friend_requests_for_email(user_email):
        normalized = SocialDriver._normalize_email(user_email)
        if not normalized:
            return None, "user_email is required"
        try:
            pending = SocialObject.find_pending_for_user_email(normalized)
            return pending, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def find_pending_friend_requests():
        try:
            pending = SocialObject.find_pending_all()
            return pending, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_friend_request(user1_id, user2_email, user1_email=None):
        if not user1_id:
            return None, "user1_id is required"
        if not user2_email:
            return None, "user2_email is required"

        user1_oid, err = SocialDriver._validate_obj_id(user1_id, "user1_id")
        if err:
            return None, err

        try:
            user1 = UserObject.find_by_id(user1_oid)
            if not user1:
                return None, "Requesting user not found"

            normalized_user1_email = SocialDriver._normalize_email(user1_email or user1.get("email"))
            if not normalized_user1_email:
                return None, "Requesting user is missing email"

            user2 = SocialDriver._find_user_by_email_case_insensitive(user2_email)
            if not user2:
                return None, "User with that email was not found"

            normalized_user2_email = SocialDriver._normalize_email(user2.get("email"))
            if not normalized_user2_email:
                return None, "User with that email has no email on file"

            if normalized_user1_email == normalized_user2_email:
                return None, "You cannot send a friend request to yourself"

            existing = SocialObject.find_between_emails(normalized_user1_email, normalized_user2_email)
            if existing:
                if existing.get("User1Accepted") and existing.get("User2Accepted"):
                    return None, "You are already friends"
                return None, "A friend request already exists between these users"

            friendship_id = SocialObject.create(normalized_user1_email, normalized_user2_email)
            friendship = SocialObject.find_by_id(friendship_id)
            return friendship, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def accept_friend_request(friendship_id, acting_user_email):
        if not friendship_id:
            return None, "friendship_id is required"
        normalized_actor_email = SocialDriver._normalize_email(acting_user_email)
        if not normalized_actor_email:
            return None, "acting_user_email is required"

        friendship_oid, err = SocialDriver._validate_obj_id(friendship_id, "friendship_id")
        if err:
            return None, err

        try:
            friendship = SocialObject.find_by_id(friendship_oid)
            if not friendship:
                return None, "Friendship not found"

            user1_email = SocialDriver._normalize_email(friendship.get("User1Email"))
            user2_email = SocialDriver._normalize_email(friendship.get("User2Email"))

            if normalized_actor_email not in (user1_email, user2_email):
                return None, "You may only operate on your own data"

            updates = {}
            user1_accepted = bool(friendship.get("User1Accepted"))
            user2_accepted = bool(friendship.get("User2Accepted"))

            if normalized_actor_email == user1_email and not user1_accepted:
                updates["User1Accepted"] = True
                user1_accepted = True
            if normalized_actor_email == user2_email and not user2_accepted:
                updates["User2Accepted"] = True
                user2_accepted = True

            if user1_accepted and user2_accepted and not friendship.get("ConfirmedSince"):
                updates["ConfirmedSince"] = int(datetime.now().timestamp())

            if not updates:
                return friendship, None

            updated = SocialObject.update(friendship_oid, updates)
            return updated, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_friendship(friendship_id, acting_user_email=None, acting_role=None):
        if not friendship_id:
            return None, "friendship_id is required"

        friendship_oid, err = SocialDriver._validate_obj_id(friendship_id, "friendship_id")
        if err:
            return None, err

        try:
            friendship = SocialObject.find_by_id(friendship_oid)
            if not friendship:
                return None, "Friendship not found"

            if acting_role not in ("Developer", "Admin"):
                normalized_actor_email = SocialDriver._normalize_email(acting_user_email)
                if not normalized_actor_email:
                    return None, "acting_user_email is required"

                user1_email = SocialDriver._normalize_email(friendship.get("User1Email"))
                user2_email = SocialDriver._normalize_email(friendship.get("User2Email"))
                if normalized_actor_email not in (user1_email, user2_email):
                    return None, "You may only operate on your own data"

            deleted = SocialObject.delete(friendship_oid)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)
