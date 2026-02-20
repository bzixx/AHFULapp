from dataModels.gymObject import gymObject
from werkzeug.security import generate_password_hash, check_password_hash



# The UserDriver is responsible for implementing the business logic related to user operations.
#  It acts as an intermediary between the API routes and the data models, 
# ensuring that all necessary validations and rules are applied before interacting with 
# the database.

class GymDriver:

    @staticmethod
    def get_all_gyms():
        try:
            gyms = gymObject.find_all()
            return gyms, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_gym_by_id(id):
        try:
            gym = gymObject.find_by_id(id)
            if not gym:
                return None, "Gym not found"
            return gym, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_gym(title, address, cost, link):
        # Validate required fields
        if (not title) or (not address):
            return None, "You are missing a title or address. Please fix, then attempt to create gym again"

        gym_data = {
            "title": title,
            "address": address,
            "cost": cost,
            "link": link
        }

        try:
            response = gymObject.create(gym_data)
            return response, None
        except Exception as e:
            return None, str(e)