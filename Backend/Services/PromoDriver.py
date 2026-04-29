from DataModels.PromoObject import PromoObject
from DataModels.GymObject import GymObject
from DataModels.UserObject import UserObject
from bson import ObjectId, errors as bson_errors

class PromoDriver:

    # ── Helpers ────────────────────────────────────────────────
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"


    # ── GET single promo ───────────────────────────────────────
    @staticmethod
    def get_promo_by_id(promo_id):
        if not promo_id:
            return None, "promo_id is required"

        oid, err = PromoDriver._validate_obj_id(promo_id, "promo_id")
        if err:
            return None, err

        try:
            promo = PromoObject.find_by_id(oid)
            if not promo:
                return None, "Promo not found"
            return promo, None
        except Exception as e:
            return None, str(e)


    # ── GET promos by gym ──────────────────────────────────────
    @staticmethod
    def get_promos_by_gym(gym_id):
        if not gym_id:
            return None, "gym_id is required"

        oid, err = PromoDriver._validate_obj_id(gym_id, "gym_id")
        if err:
            return None, err

        try:
            promos = PromoObject.find_by_gym_id(oid)
            return promos, None
        except Exception as e:
            return None, str(e)


    # ── GET all promos ─────────────────────────────────────────
    @staticmethod
    def get_all_promos():
        try:
            promos = PromoObject.find_all()
            return promos, None
        except Exception as e:
            return None, str(e)


    # ── CREATE promo ───────────────────────────────────────────
    @staticmethod
    def create_promo(gym_id, user_id, data):
        if not gym_id:
            return None, "gym_id is required"
        if not user_id:
            return None, "user_id is required"
        if not data:
            return None, "data is required"

        gym_oid, err = PromoDriver._validate_obj_id(gym_id, "gym_id")
        if err:
            return None, err

        user_oid, err = PromoDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err

        try:
            gym = GymObject.find_by_id(gym_oid, user_id)
            if not gym:
                return None, "Gym not found"

            user = UserObject.find_by_id(user_oid)
            if not user:
                return None, "User not found"
            
            if not gym.get("user_id") == user["_id"]:
                return None, "Can only operate on own gym"

            promo_id = PromoObject.create(gym_oid, data)
            promo = PromoObject.find_by_id(promo_id)
            return promo, None

        except Exception as e:
            return None, str(e)


    # ── UPDATE promo ───────────────────────────────────────────
    @staticmethod
    def update_promo(promo_id, user_id, data):
        if not promo_id:
            return None, "promo_id is required"
        if not user_id:
            return None, "user_id is required"
        if not data:
            return None, "No updates provided"

        promo_oid, err = PromoDriver._validate_obj_id(promo_id, "promo_id")
        if err:
            return None, err

        user_oid, err = PromoDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        
        try:
            promo = PromoObject.find_by_id(promo_oid)
            if not promo:
                return None, "Promo not found"
            
            gym = GymObject.find_by_id(promo["gym_id"])

            user = UserObject.find_by_id(user_id)
            if not user:
                return None, "User not found"

            if not gym.get("user_id") == user["_id"]:
                return None, "Can only operate on own gym"

            # Prevent immutable fields from being updated
            data.pop("_id", None)
            data.pop("gym_id", None)

            updated = PromoObject.update(promo_oid, data)
            return updated, None

        except Exception as e:
            return None, str(e)


    # ── DELETE promo ───────────────────────────────────────────
    @staticmethod
    def delete_promo(promo_id):
        if not promo_id:
            return None, "promo_id is required"

        oid, err = PromoDriver._validate_obj_id(promo_id, "promo_id")
        if err:
            return None, err

        try:
            existing = PromoObject.find_by_id(oid)
            if not existing:
                return None, "Promo not found"

            deleted = PromoObject.delete(oid)
            return {"deleted": deleted}, None

        except Exception as e:
            return None, str(e)