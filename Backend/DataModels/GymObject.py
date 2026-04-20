from bson import ObjectId
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
gymCollection = ahfulAppDataDB['gym']

class GymObject:
    @staticmethod
    def _serialize(gym):
        if gym:
            gym["_id"] = str(gym["_id"])
            if "user_id" in gym:
                gym["user_id"] = str(gym["user_id"])
            if gym.get("owner_id"):
                gym["owner_id"] = str(gym["owner_id"])
        return gym

    @staticmethod
    def create(gym_data):
        result = gymCollection.insert_one(gym_data)
        return str(result.inserted_id)

    @staticmethod
    def find_all(user_id):
        filter_doc = {
            "$or": [
                {"isPublic": True},
                {"user_id": ObjectId(user_id)}
            ]
        }
        gyms = gymCollection.find(filter_doc)
        return [GymObject._serialize(g) for g in gyms]

    @staticmethod
    def find_by_id(id, user_id):
        filter_doc = {
            "$and": [
                {"_id": ObjectId(id)},
                {"$or": [
                    {"isPublic": True},
                    {"user_id": ObjectId(user_id)}
                ]}
            ]
        }
        gym = gymCollection.find_one(filter_doc)
        return GymObject._serialize(gym)
    
    @staticmethod
    def update(id, user_id, updates):
        if not updates:
            return None

        filter_doc = {
            "$and": [
                {"_id": ObjectId(id)},
                {"user_id": ObjectId(user_id)}
            ]
        }
        update_doc = {"$set": updates}

        result = gymCollection.update_one(filter_doc, update_doc)

        if result.matched_count == 0:
            return None

        updated = gymCollection.find_one({"_id": ObjectId(id)})
        return GymObject._serialize(updated)

    @staticmethod
    def delete(id, user_id):
        filter_doc = {
            "$and": [
                {"_id": ObjectId(id)},
                {"user_id": ObjectId(user_id)}
            ]
        }
        result = gymCollection.delete_one(filter_doc)
        return str((result.deleted_count == 1) * id)
