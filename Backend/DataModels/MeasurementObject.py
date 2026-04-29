from bson import ObjectId
from Services.MongoDriver import get_collection


class MeasurementObject:
    @staticmethod
    def _serialize(measurement):
        if measurement:
            measurement["_id"] = str(measurement["_id"])
            measurement["user_id"] = str(measurement["user_id"])
        return measurement

    @staticmethod
    def create(measurement_data):
        result = get_collection('measurement').insert_one(measurement_data)
        return str(result.inserted_id)

    def find_all():
        measurements = get_collection('measurement').find().sort("date", 1)
        return [MeasurementObject._serialize(m) for m in measurements]

    def find_by_id(id):
        measurement = get_collection('measurement').find_one({"_id": ObjectId(id)})
        return MeasurementObject._serialize(measurement)

    def find_by_user(user_id):
        measurements = get_collection('measurement').find({"user_id": ObjectId(user_id)}).sort("date", 1)
        return [MeasurementObject._serialize(m) for m in measurements]

    @staticmethod
    def update(id, update_data):
        result = get_collection('measurement').update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return None
        return MeasurementObject.find_by_id(id)

    @staticmethod
    def delete(id):
        result = get_collection('measurement').delete_one({"_id": ObjectId(id)})
        return str((result.deleted_count == 1) * id)
