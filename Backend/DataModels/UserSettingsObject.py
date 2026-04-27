from bson import ObjectId
from datetime import datetime
from Services.MongoDriver import get_collection

DEFAULT_USER_SETTINGS = {
    "theme": "light",
    "goals": "maintain",
    "shameLevel": "medium",
    "units": "imperial",
    "timezone": "UTC",
    "gender": "",
    "pronouns": "",
    "dateOfBirth": "",
    "availableEquipment": "basic",
    "notifications": "false",
    "tutorialComplete": False,
    "homeGymId": ""
}

class UserSettingsObject:
    @staticmethod
    def _serialize(settings):
        if settings:
            settings["_id"] = str(settings["_id"])
            if "user_id" in settings:
                settings["user_id"] = str(settings["user_id"])
        return settings

    @staticmethod
    def find_by_user_id(user_id):
        settings = get_collection('userSettings').find_one({"user_id": ObjectId(user_id)})
        return UserSettingsObject._serialize(settings)

    @staticmethod
    def create(user_id, settings_data=None):
        if settings_data is None:
            settings_data = DEFAULT_USER_SETTINGS.copy()
        settings_data["user_id"] = ObjectId(user_id)
        settings_data["created_at"] = int(datetime.now().timestamp())
        settings_data["updated_at"] = int(datetime.now().timestamp())
        result = get_collection('userSettings').insert_one(settings_data)
        return str(result.inserted_id)

    @staticmethod
    def update(user_id, updates):
        updates["updated_at"] = int(datetime.now().timestamp())
        result = get_collection('userSettings').update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": updates}
        )
        if result.matched_count == 0:
            return None
        updated = get_collection('userSettings').find_one({"user_id": ObjectId(user_id)})
        return UserSettingsObject._serialize(updated)

    @staticmethod
    def delete(user_id):
        result = get_collection('userSettings').delete_one({"user_id": ObjectId(user_id)})
        return result.deleted_count > 0
