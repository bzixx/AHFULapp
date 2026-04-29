from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import get_collection

class VerificationObject:
    @staticmethod
    def _serialize(verify):
        if verify:
            verify["_id"] = str(verify["_id"])
            #verify["user_id"] = str(verify["user_id"])
        return verify

    @staticmethod
    def find_all():
        verifies = get_collection('verificationTokens').find()
        return [VerificationObject._serialize(t) for t in verifies]

    @staticmethod   
    def find_by_id(id):
        verification = get_collection('verificationTokens').find_one({
            "_id": ObjectId(id)
        })
        return VerificationObject._serialize(verification)

    @staticmethod
    def find_type_by_user(user_id, type):
        verify = get_collection('verificationTokens').find(
            {"user_id": ObjectId(user_id),
            "type": type})
        return [VerificationObject._serialize(t) for t in verify]
    
    @staticmethod
    def find_all_by_user(user_id, type):
        verify = get_collection('verificationTokens').find(
            {"user_id": ObjectId(user_id)})
        return [VerificationObject._serialize(t) for t in verify]

    @staticmethod
    def create(type, token, user_id):
        try:
            verify_data = {
                "type": type,
                "token": token,
                "user_id": ObjectId(user_id),
                "created_at": int(datetime.now().timestamp())
            }
            result = get_collection('verificationTokens').insert_one(verify_data)
            return str(result.inserted_id), None
        except Exception as e:
                return None, str(e)

    @staticmethod
    def delete(verify_id):
        result = get_collection('verificationTokens').delete_one({"_id": ObjectId(verify_id)})
        return id if result.deleted_count == 1 else None
