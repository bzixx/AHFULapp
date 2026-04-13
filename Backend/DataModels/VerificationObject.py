from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
verificationCollection = ahfulAppDataDB['verificationTokens']

class VerificationObject:
    @staticmethod
    def _serialize(verify):
        if verify:
            verify["_id"] = str(verify["_id"])
            #verify["user_id"] = str(verify["user_id"])
        return verify

    @staticmethod
    def find_all():
        verifies = verificationCollection.find()
        return [VerificationObject._serialize(t) for t in verifies]

    @staticmethod   
    def find_by_id(id):
        verification = verificationCollection.find_one({
            "_id": ObjectId(id)
        })
        return VerificationObject._serialize(verification)

    @staticmethod
    def find_type_by_user(user_id, type):
        verify = verificationCollection.find(
            {"user_id": ObjectId(user_id),
            "type": type})
        return [VerificationObject._serialize(t) for t in verify]
    
    @staticmethod
    def find_all_by_user(user_id, type):
        verify = verificationCollection.find(
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
            result = verificationCollection.insert_one(verify_data)
            return str(result.inserted_id), None
        except Exception as e:
                return None, str(e)

    @staticmethod
    def delete(verify_id):
        result = verificationCollection.delete_one({"_id": ObjectId(verify_id)})
        return id if result.deleted_count == 1 else None
