from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import get_collection

class TokenObject:
    @staticmethod
    def _serialize(token):
        if token:
            token["_id"] = str(token["_id"])
            if "user_id" in token:
                token["user_id"] = str(token["user_id"])
        return token

    @staticmethod
    def find_by_user_id(user_id):
        token = get_collection('firebaseTokens').find_one({"user_id": ObjectId(user_id)})
        return TokenObject._serialize(token)

    @staticmethod
    def find_all_by_user_id(user_id):
        tokens = get_collection('firebaseTokens').find({"user_id": ObjectId(user_id)})
        return [TokenObject._serialize(t) for t in tokens]

    @staticmethod
    def find_by_token(token_str):
        token = get_collection('firebaseTokens').find_one({"token": token_str})
        return TokenObject._serialize(token)

    @staticmethod
    def create(token_str, user_id):
        token_data = {
            "token": token_str,
            "user_id": ObjectId(user_id),
            "created_at": int(datetime.now().timestamp())
        }
        result = get_collection('firebaseTokens').insert_one(token_data)
        return str(result.inserted_id)

    @staticmethod
    def delete(user_id):
        result = get_collection('firebaseTokens').delete_one({"user_id": ObjectId(user_id)})
        return result.deleted_count > 0

    @staticmethod
    def delete_by_token(token_str):
        result = get_collection('firebaseTokens').delete_one({"token": token_str})
        return result.deleted_count > 0

    @staticmethod
    def delete_by_id(token_id):
        result = get_collection('firebaseTokens').delete_one({"_id": ObjectId(token_id)})
        return result.deleted_count > 0

    @staticmethod
    def find_all():
        tokens = get_collection('firebaseTokens').find()
        return [TokenObject._serialize(t) for t in tokens]
