#Services & Drivers know how to implement business Logic related to the Route operations.  
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before 
#   Calling Objects to interact with DB
from DataModels.FoodObject import FoodObject

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
            response = FoodObject.create(food_data)
            return response, None
        except Exception as e:
            return None, str(e)