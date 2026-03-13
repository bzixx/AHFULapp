from bson import ObjectId, errors as bson_errors

from DataModels.MeasurementObject import MeasurementObject
from DataModels.UserObject import UserObject


class MeasurementDriver:
    MEASUREMENT_FIELDS = {
        "chest",
        "waist",
        "hips",
        "thighs",
        "arms",
        "weight",
    }

    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    @staticmethod
    def _sanitize_payload(data, require_date=False):
        sanitized = {}

        date = data.get("date")
        if require_date and not date:
            return None, "You must provide a measurement date"
        if date is not None:
            sanitized["date"] = date

        has_measurement_value = False
        for field in MeasurementDriver.MEASUREMENT_FIELDS:
            if field not in data:
                continue

            value = data.get(field)
            if value in (None, ""):
                continue

            try:
                sanitized[field] = float(value)
                has_measurement_value = True
            except (TypeError, ValueError):
                return None, f"Invalid {field}; must be a number"

        if not has_measurement_value and require_date:
            return None, "You must provide at least one measurement value"

        if not has_measurement_value and not any(key in sanitized for key in {"date"}):
            return None, "No fields to update"

        return sanitized, None

    @staticmethod
    def create_measurement(userId, data):
        if not userId:
            return None, "You must provide a userId"

        oid, err = MeasurementDriver._validate_obj_id(userId, "userId")
        if err:
            return None, err

        user = UserObject.find_by_id(userId)
        if not user:
            return None, "User not found"

        sanitized, err = MeasurementDriver._sanitize_payload(data, require_date=True)
        if err:
            return None, err

        measurement_data = {
            "userId": oid,
            **sanitized,
        }

        try:
            response = MeasurementObject.create(measurement_data)
            return response, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_all_measurements():
        try:
            measurements = MeasurementObject.find_all()
            return measurements, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_measurement_by_id(id):
        try:
            measurement = MeasurementObject.find_by_id(id)
            if not measurement:
                return None, "Measurement not found"
            return measurement, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_measurements_by_user(userId):
        try:
            measurements = MeasurementObject.find_by_user(userId)
            return measurements, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def update_measurement(measurement_id, data):
        if not measurement_id:
            return None, "You must provide a measurement id to update"

        oid, err = MeasurementDriver._validate_obj_id(measurement_id, "measurement_id")
        if err:
            return None, err

        sanitized, err = MeasurementDriver._sanitize_payload(data, require_date=False)
        if err:
            return None, err

        try:
            updated = MeasurementObject.update(str(oid), sanitized)
            if not updated:
                return None, "Measurement not found"
            return updated, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_measurement(id):
        if not id:
            return None, "You must provide a measurement id to delete"

        try:
            response = MeasurementObject.delete(id)
            if not response:
                return None, "Measurement not found or already deleted"
            return response, None
        except Exception as e:
            return None, str(e)
