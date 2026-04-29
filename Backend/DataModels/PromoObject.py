from bson import ObjectId
from datetime import datetime
import time
from Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
promoCollection = ahfulAppDataDB['promotions']

class PromoObject:
    @staticmethod
    def _serialize(promo):
        if promo:
            promo["_id"] = str(promo["_id"])
            if "gym_id" in promo:
                promo["gym_id"] = str(promo["gym_id"])
        return promo

    # ── FIND BY ID ─────────────────────────────────────────────
    @staticmethod
    def find_by_id(promo_id):
        promo = promoCollection.find_one({"_id": ObjectId(promo_id)})
        return PromoObject._serialize(promo)

    # ── FIND BY GYM ───────────────────────────────────────────
    @staticmethod
    def find_by_gym_id(gym_id):
        promos = promoCollection.find({"gym_id": ObjectId(gym_id)})
        return [PromoObject._serialize(p) for p in promos]

    # ── FIND ALL ──────────────────────────────────────────────
    @staticmethod
    def find_all():
        promos = promoCollection.find()
        return [PromoObject._serialize(p) for p in promos]

    # ── CREATE ────────────────────────────────────────────────
    @staticmethod
    def create(gym_id, promo_data):
        promo_data["gym_id"] = ObjectId(gym_id)
        promo_data["created_at"] = int(datetime.now().timestamp())

        # Defaults
        if "type" not in promo_data:
            promo_data["type"] = "Coupon"
        if "timeStart" not in promo_data:
            promo_data["timeStart"] = 0
        if "timeEnd" not in promo_data:
            promo_data["timeEnd"] = 0
        if "redeemable" not in promo_data:
            promo_data["redeemable"] = True
        if "_testObject" not in promo_data:
            promo_data["_testObject"] = False

        result = promoCollection.insert_one(promo_data)
        return str(result.inserted_id)

    # ── UPDATE ────────────────────────────────────────────────
    @staticmethod
    def update(promo_id, updates):
        updates["updated_at"] = int(datetime.now().timestamp())

        result = promoCollection.update_one(
            {"_id": ObjectId(promo_id)},
            {"$set": updates}
        )

        if result.matched_count == 0:
            return None

        updated = promoCollection.find_one({"_id": ObjectId(promo_id)})
        return PromoObject._serialize(updated)

    # ── DELETE ────────────────────────────────────────────────
    @staticmethod
    def delete(promo_id):
        result = promoCollection.delete_one({"_id": ObjectId(promo_id)})
        return result.deleted_count > 0