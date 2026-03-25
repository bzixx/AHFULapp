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
        if not id:
            return None, "You must provide a user id to get"
        oid, err = FoodDriver._validate_obj_id(id, "food_id")
        if err:
            return None, err
        try:
            food = FoodObject.find_by_user(id)
            return food, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_food_by_id(id):
        if not id:
            return None, "You must provide a food id to get"
        oid, err = FoodDriver._validate_obj_id(id, "food_id")
        if err:
            return None, err
        try:
            food = FoodObject.find_by_id(id)
            if not food:
                return None, "Food not found"
            return food, None
        except Exception as e:
            return None, str(e)

    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def update_food(id, updates):
        if not id:
            return None, "You must provide a food id to update"
        oid, err = FoodDriver._validate_obj_id(id, "food_id")
        if err:
            return None, err
        
        if not updates or not isinstance(updates, dict):
            return None, "You must provide at least one field to update"

         # Allowed fields to update
        allowed_fields = {
            "name",
            "calsPerServing",
            "servings",
            "type",
            "time"
        }

        # Filter only allowed fields
        sanitized_updates = {k: v for k, v in updates.items() if k in allowed_fields}

        if not sanitized_updates:
            return None, "No valid fields to update"

        try:
            updated = FoodObject.update(id, sanitized_updates)
            if not updated:
                return None, "Food not found"
            return updated, None
        except Exception as e:
            return None, str(e)

    # ── Delete ─────────────────────────────────────────────────────────────────
    @staticmethod
    def delete_food(id):
        if not id:
            return None, "You must provide a food id to delete"
        oid, err = FoodDriver._validate_obj_id(id, "food_id")
        if err:
            return None, err
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

    # ── Streak Calculation ─────────────────────────────────────────────────────
    @staticmethod
    def get_streak(userId):
        try:
            # Validate userId
            if not userId:
                return None, "User ID is required"
            
            oid, err = FoodDriver._validate_obj_id(userId, "userId")
            if err:
                return None, err
            
            # Get all food logs for user
            foods = FoodObject.find_by_user(userId)
            if not foods:
                return {"streak": 0, "lastFoodDate": None}, None
            
            from datetime import datetime, timedelta
            
            # Extract unique dates (calendar days) from food logs
            dates = set()
            for food in foods:
                if food.get("time"):
                    # Convert timestamp to date
                    dt = datetime.fromtimestamp(food["time"])
                    dates.add(dt.date())
            
            if not dates:
                return {"streak": 0, "lastFoodDate": None}, None
            
            # Sort dates in descending order
            sorted_dates = sorted(dates, reverse=True)
            today = datetime.now().date()
            yesterday = today - timedelta(days=1)
            
            # Check if most recent food log was today or yesterday
            most_recent = sorted_dates[0]
            if most_recent not in [today, yesterday]:
                # Streak is broken - no activity today or yesterday
                return {"streak": 0, "lastFoodDate": str(most_recent)}, None
            
            # Count consecutive days
            streak = 1
            for i in range(len(sorted_dates) - 1):
                current_date = sorted_dates[i]
                next_date = sorted_dates[i + 1]
                expected_prev = current_date - timedelta(days=1)
                
                if next_date == expected_prev:
                    streak += 1
                else:
                    break
            
            return {"streak": streak, "lastFoodDate": str(most_recent)}, None
        except Exception as e:
            return None, str(e)
