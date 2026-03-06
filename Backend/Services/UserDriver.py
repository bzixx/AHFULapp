#Services & Drivers know how to implement business Logic related to the Route operations.  
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before 
#   Calling Objects to interact with DB
from DataModels.UserObject import UserObject
from datetime import datetime
from bson import ObjectId, errors as bson_errors

# The UserDriver is responsible for implementing the business logic related to user operations.
#   It acts as an intermediary between the API routes and the data models, 
#   ensuring that all necessary validations and rules are applied before interacting with 
#   the database.
class UserDriver:
    # ── Helper ─────────────────────────────────────────────────────────────────
    valid_roles = ["User", "Gym Owner", "Personal trainer", "Event Coordinator", "Admin", "Developer"]
    @staticmethod
    def _validate_role(role):
        role = (role or "").strip()
        if not role:
            return None, "role is required"
        if role not in UserDriver.valid_roles:
            return None, "Provided role is unidentified"
        return role, None
    
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    # ── Create ─────────────────────────────────────────────────────────────────

    # ── Read ─────────────────────────────────────────────────────────────────
    @staticmethod
    def get_all_users():
        try:
            users = UserObject.find_all()
            return users, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_user_by_id(id):
        try:
            user = UserObject.find_by_id(id)
            if not user:
                return None, "User not found"
            return user, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_user_by_email(email):
        try:
            user = UserObject.find_by_email(email)
            if not user:
                return None, "User not found"
            return user, None
        except Exception as e:
            return None, str(e)
    
    # ── Update ─────────────────────────────────────────────────────────────────
    @staticmethod
    def add_role_by_id(user_id, adder_id, role):
        if not user_id:
            return None, "user_id is required"
        if not role:
            return None, "role is required"
        role, err = UserDriver._validate_role(role)
        if not role:
            return None, err

        # Check ids
        oid, err = UserDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        oid, err = UserDriver._validate_obj_id(adder_id, "adder_id")
        if err:
            return None, err
        
        try:
            adder = UserObject.find_by_id(adder_id)
            if not adder:
                return None, "Adder not found"
            if ("Admin" not in adder["roles"]) and ("Developer" not in adder["roles"]):
                return None, "Adder does not have permission"
            # TODO Need further verification that adder is logged in
        except Exception as e:
            return None, str(e)

        try:
            updated_user = UserObject.add_role_by_id(user_id, role)
            if not updated_user:
                return None, "User not found"
            return updated_user, None
        except Exception as e:
            return None, f"Failed to add role: {e}"

    @staticmethod
    def add_role_by_email(user_email, adder_id, role):
        if not user_email:
            return None, "user_email is required"
        role, err = UserDriver._validate_role(role)
        if not role:
            return None, err

        # Check id
        oid, err = UserDriver._validate_obj_id(adder_id, "adder_id")
        if err:
            return None, err

        try:
            adder = UserObject.find_by_id(adder_id)
            if not adder:
                return None, "Adder not found"
            if ("Admin" not in adder["roles"]) and ("Developer" not in adder["roles"]):
                return None, "Adder does not have permission"
            # TODO Need further verification that adder is logged in
        except Exception as e:
            return None, str(e)
        
        user = UserObject.find_by_email(user_email)
        if not user:
            return None, "User not found"

        try:
            updated_user = UserObject.add_role_by_id(user["_id"], role)
            if not updated_user:
                return None, "User not found"
            return updated_user, None
        except Exception as e:
            return None, f"Failed to add role: {e}"

    @staticmethod
    def remove_role_by_id(user_id, remover_id, role):
        if not user_id:
            return None, "user_id is required"
        if not role:
            return None, "Role is required"
        role, err = UserDriver._validate_role(role)
        if not role:
            return None, err

        # Check ids
        oid, err = UserDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        oid, err = UserDriver._validate_obj_id(remover_id, "remover_id")
        if err:
            return None, err
        
        try:
            remover = UserObject.find_by_id(remover_id)
            if not remover:
                return None, "Remover not found"
            if ("Admin" not in remover["roles"]) and ("Developer" not in remover["roles"]):
                return None, "Remover does not have permission"
            # TODO Need further verification that adder is logged in
        except Exception as e:
            return None, str(e)

        try:
            updated_user = UserObject.remove_role_by_id(user_id, role)
            if not updated_user:
                return None, "User not found"
            return updated_user, None
        except ValueError as ve:
            return None, str(ve)
        except Exception as e:
            return None, f"Failed to remove role: {e}"
        
    @staticmethod
    def remove_role_by_email(user_email, remover_id, role):
        if not user_email:
            return None, "user_email is required"
        if not role:
            return None, "Role is required"
        role, err = UserDriver._validate_role(role)
        if not role:
            return None, err

        # Check id
        oid, err = UserDriver._validate_obj_id(remover_id, "remover_id")
        if err:
            return None, err
        
        try:
            remover = UserObject.find_by_id(remover_id)
            if not remover:
                return None, "Remover not found"
            if ("Admin" not in remover["roles"]) and ("Developer" not in remover["roles"]):
                return None, "Remover does not have permission"
            # TODO Need further verification that adder is logged in
        except Exception as e:
            return None, str(e)
        
        user = UserObject.find_by_email(user_email)
        if not user:
            return None, "User not found"

        try:
            updated_user = UserObject.remove_role_by_id(user["_id"], role)
            if not updated_user:
                return None, "User not found"
            return updated_user, None
        except ValueError as ve:
            return None, str(ve)
        except Exception as e:
            return None, f"Failed to remove role: {e}"
        
    @staticmethod
    def deactivate_user_by_id(user_id, deactivator_id):
        # Validate inputs
        if not user_id:
            return None, "user_id is required"
        if not deactivator_id:
            return None, "deactivator_id is required"

        # Validate ObjectIds
        oid, err = UserDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        oid, err = UserDriver._validate_obj_id(deactivator_id, "deactivator_id")
        if err:
            return None, err
        
        try:
            deactivator = UserObject.find_by_id(deactivator_id)
            if not deactivator:
                return None, "Deactivator not found"
            if ("Admin" not in deactivator["roles"]) and ("Developer" not in deactivator["roles"]):
                return None, "Deactivator does not have permission"
            # TODO Need further verification that deactivator is logged in
        except Exception as e:
            return None, str(e)
        
        user = UserObject.find_by_id(user_id)
        if not user:
            return None, "User not found"
        
        try:
            updated_user = UserObject.deactivate_by_id(user["_id"])
            if not updated_user:
                return None, "User not found"
            return updated_user, None
        except ValueError as ve:
            return None, str(ve)
        except Exception as e:
            return None, f"Failed to deactivate user: {e}"

    # ── Untested ─────────────────────────────────────────────────────────────────
    @staticmethod
    def create_user(userJSONObject):
        UserObject.create(userJSONObject)
    
    def update_user_info(dataToBeUpdated: dict):
        
        user_id = dataToBeUpdated.get("_id")
        try:
            # Remove _id from update_data if present as we already collected it
            dataToBeUpdated.pop('_id', None)

            # Add updated timestamp
            dataToBeUpdated['updated_at'] = datetime.now()

            #Passing in user_id here tracks who is being updated
            UserObject.update(user_id,dataToBeUpdated)
        except Exception as e:
            print(f"Database error from Driver: {e}")
            return 0        

    @staticmethod
    def update_user(email, updates):
        # Prevent password from being updated through this route
        # Password changes should go through a dedicated change-password flow
        updates.pop("password", None)
        updates.pop("_id", None)

        if not updates:
            return None, "No valid fields to update"

        try:
            UserObject.update(email, updates)
            return True, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_user(email):
        user = UserObject.find_by_email(email)
        if not user:
            return None, "User not found"

        try:
            UserObject.delete(email)
            return True, None
        except Exception as e:
            return None, str(e)