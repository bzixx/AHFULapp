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
            if not food:
                return None, "Food not found"
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

    @staticmethod
    def create_food(userId, name, calsPerServing, servings, type, time):
        # Validate required fields
        if (not userId) or (not name) or (calsPerServing is None) or (not servings) or (not type) or (time is None):
            return None, "You are missing a value. Please fix, then attempt to create food again"

        # Convert IDs safely
        try:
            user_oid = ObjectId(str(userId))
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, "Invalid userId format; must be a 24-hex string"
        
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