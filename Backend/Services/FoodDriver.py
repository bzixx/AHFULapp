from dataModels.foodObject import foodObject
from werkzeug.security import generate_password_hash, check_password_hash



# The UserDriver is responsible for implementing the business logic related to user operations.
#  It acts as an intermediary between the API routes and the data models, 
# ensuring that all necessary validations and rules are applied before interacting with 
# the database.

class FoodDriver:

    @staticmethod
    def get_all_food():
        try:
            food = foodObject.find_all()
            return food, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_food_by_user(id):
        try:
            food = foodObject.find_by_user(id)
            if not food:
                return None, "Food not found"
            return food, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_food(userId, name, calsPerServing, servings, type, time):
        # Validate required fields
        if (not userId) or (not name) or (not calsPerServing) or (not servings) or (not type) or (not time):
            return None, "You are missing a value. Please fix, then attempt to create food again"

        food_data = {
            "userId": userId,
            "name": name,
            "calsPerServing": calsPerServing,
            "servings": servings,
            "type": type,
            "time": time
        }

        try:
            response = foodObject.create(food_data)
            return response, None
        except Exception as e:
            return None, str(e)