from DataModels.UserSettingsObject import UserSettingsObject
from bson import ObjectId, errors as bson_errors

class UserSettingsDriver:
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    @staticmethod
    def get_user_settings(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = UserSettingsDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            settings = UserSettingsObject.find_by_user_id(oid)
            if not settings:
                return None, "User settings not found"
            return settings, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_user_settings(user_id, settings_data=None):
        if not user_id:
            return None, "user_id is required"
        oid, err = UserSettingsDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = UserSettingsObject.find_by_user_id(oid)
            if existing:
                return None, "User settings already exist"
            settings_id = UserSettingsObject.create(oid, settings_data)
            settings = UserSettingsObject.find_by_user_id(oid)
            return settings, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_default_user_settings(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = UserSettingsDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = UserSettingsObject.find_by_user_id(oid)
            if existing:
                return existing, None
            UserSettingsObject.create(oid)
            settings = UserSettingsObject.find_by_user_id(oid)
            return settings, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def update_user_settings(user_id, updates):
        if not user_id:
            return None, "user_id is required"
        if not updates:
            return None, "No updates provided"
        oid, err = UserSettingsDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = UserSettingsObject.find_by_user_id(oid)
            if not existing:
                return None, "User settings not found"
            updates.pop("_id", None)
            updates.pop("user_id", None)
            updated = UserSettingsObject.update(oid, updates)
            return updated, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_user_settings(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = UserSettingsDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = UserSettingsObject.find_by_user_id(oid)
            if not existing:
                return None, "User settings not found"
            deleted = UserSettingsObject.delete(oid)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)
