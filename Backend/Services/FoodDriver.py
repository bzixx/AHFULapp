#Services & Drivers know how to implement business Logic related to the Route operations.
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before
#   Calling Objects to interact with DB
from DataModels.FoodObject import FoodObject
from DataModels.UserObject import UserObject
from bson import ObjectId, errors as bson_errors

# The FoodDriver is responsible for implementing the business logic related to food operations.
#  It acts as an intermediary between the API routes and the data models,
# ensuring that all necessary validations and rules are applied before interacting with
# the database.
class FoodDriver:
    # ── Helper ─────────────────────────────────────────────────────────────────
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create_food(userId, name, calsPerServing, servings, type, time):
        # Validate required fields
        if (not userId) or (not name) or (calsPerServing is None) or (not servings) or (not type) or (time is None):
            return None, "You are missing a value. Please fix, then attempt to create food again"

        # Convert IDs safely
        userId, err = FoodDriver._validate_obj_id(userId, "userid")
        if err:
            return None, err

        # Ensure the user exists
        user = UserObject.find_by_id(userId)
        if not user:
            return None, "User not found"

        food_data = {
            "userId": userId,
            "name": name,
            "calsPerServing": calsPerServing,
            "servings": servings,
            "type": type,
            "time": time
        }

        try:
            response = FoodObject.create(food_data)
            return response, None
        except Exception as e:
            return None, str(e)

    # ── Read ─────────────────────────────────────────────────────────────────
    @staticmethod
    def get_all_food():
        try:
            food = FoodObject.find_all()
            return food, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_food_by_user(id):
        try:
            food = FoodObject.find_by_user(id)
            return food, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_food_by_id(id):
        try:
            food = FoodObject.find_by_id(id)
            if not food:
                return None, "Food not found"
            return food, None
        except Exception as e:
            return None, str(e)

    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def update_food(food_id, name, calsPerServing, servings, type, time):
        oid, err = FoodDriver._validate_obj_id(food_id, "food_id")
        if err:
            return None, err

        update_data = {}
        if name is not None:
            update_data["name"] = name
        if calsPerServing is not None:
            update_data["calsPerServing"] = calsPerServing
        if servings is not None:
            update_data["servings"] = servings
        if type is not None:
            update_data["type"] = type
        if time is not None:
            update_data["time"] = time

        if not update_data:
            return None, "No fields to update"

        try:
            updated = FoodObject.update(food_id, update_data)
            if not updated:
                return None, "Food not found"
            return updated, None
        except Exception as e:
            return None, str(e)

    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete_food(id):
        # Validate input
        if not id:
            return None, "You must provide a food id to delete"

        try:
            response = FoodObject.delete(id)
            if not response:
                # Either not found, or already removed
                return None, "Food not found or already deleted"
            return response, None
        except Exception as e:
            return None, str(e)
