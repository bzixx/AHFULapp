#Services & Drivers know how to implement business Logic related to the Route operations.  
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before 
#   Calling Objects to interact with DB
# from DataModels.GymObject import GymObject
from bson import ObjectId, errors as bson_errors
from DataModels.GymObject import GymObject

# The GymDriver is responsible for implementing the business logic related to gym operations.
#   It acts as an intermediary between the API routes and the data models, 
#   ensuring that all necessary validations and rules are applied before interacting with 
#   the database.
class GymDriver:
# ── Helper ─────────────────────────────────────────────────────────────────
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"
        
    # ── Create ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create_gym(user_id, name, address, type, cost, link, lat, lng, notes, is_public=False):
        if (not name) or (not address):
            return None, "You are missing a name or address. Please fix, then attempt to create gym again"

        gym_data = {
            "name": name,
            "address": address,
            "cost": cost,
            "link": link,
            "lat": lat,
            "lng": lng,
            "notes": notes,
            "type": type,
            "user_id": ObjectId(user_id),
            "isPublic": is_public
        }

        try:
            response = GymObject.create(gym_data)
            return response, None
        except Exception as e:
            return None, str(e)

    # ── Read ─────────────────────────────────────────────────────────────────
    @staticmethod
    def get_all_gyms(user_id):
        try:
            gyms = GymObject.find_all(user_id)
            return gyms, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_gym_by_id(id, user_id):
        if not id:
            return None, "You must provide a gym_id to get"
        oid, err = GymDriver._validate_obj_id(id, "gym_id")
        if err:
            return None, err
        try:
            gym = GymObject.find_by_id(id, user_id)
            if not gym:
                return None, "Gym not found"
            return gym, None
        except Exception as e:
            return None, str(e)
    
    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def update_gym(id, user_id, updates):
        # Validate input
        if not id:
            return None, "You must provide a gym_id to update"
        oid, err = GymDriver._validate_obj_id(id, "gym_id")
        if err:
            return None, err

        if not updates or not isinstance(updates, dict):
            return None, "You must provide at least one field to update"

        # Allowed fields to update
        allowed_fields = {
            "name", "address", "cost", "link", "lat", "lng", "notes", "isPublic"
        }

        # Filter only allowed fields
        sanitized_updates = {k: v for k, v in updates.items() if k in allowed_fields}

        if not sanitized_updates:
            return None, "No valid fields to update"

        try:
            updated = GymObject.update(id, user_id, sanitized_updates)
            if not updated:
                # Could be not found or no actual changes applied (same values)
                return None, "Gym not found or no changes applied"
            return updated, None
        except Exception as e:
            return None, str(e)
        
    # ── Delete ─────────────────────────────────────────────────────────────────    
    @staticmethod
    def delete_gym(id, user_id):
        if not id:
            return None, "You must provide a gym_id to delete"
        oid, err = GymDriver._validate_obj_id(id, "gym_id")
        if err:
            return None, err

        try:
            response = GymObject.delete(id, user_id)
            if not response:
                # Either not found, or already removed
               return None, "Gym not found or already deleted"
            return response, None
        except Exception as e:
            return None, str(e)
