from DataModels.TokenObject import TokenObject
from DataModels.UserObject import UserObject
from bson import ObjectId, errors as bson_errors

class TokenDriver:
    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"
        
    @staticmethod
    def verify_operation(user_id, token_id):
        if (not user_id) or (not token_id):
            return None, "Missing user or food_id"
        
        # Convert IDs safely
        user_id, err = TokenDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        # Convert IDs safely
        token_id, err = TokenDriver._validate_obj_id(token_id, "token_id")
        if err:
            return None, err
        
        user = UserObject.find_by_id(user_id)
        if not user:
            return None, "User not found"
        token = TokenObject.find_by_id(token_id)
        if not token:
            return None, "Token not found"
        
        if user["_id"] == token["user_id"]:
            return "Operation valid", None
        elif ("Admin" in user["roles"]) or ("Developer" in user["roles"]):
            return "Operation valid", None
        else:
            return None, "You must operate on your own object or have sufficient privileges"

    @staticmethod
    def get_token_by_user(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = TokenDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            token = TokenObject.find_by_user_id(oid)
            if not token:
                return None, "Token not found"
            return token, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_all_tokens_by_user(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = TokenDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            tokens = TokenObject.find_all_by_user_id(oid)
            return tokens, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_token_by_value(token_str):
        if not token_str:
            return None, "token is required"
        try:
            token = TokenObject.find_by_token(token_str)
            if not token:
                return None, "Token not found"
            return token, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_token(token_str, user_id):
        if not token_str:
            return None, "token is required"
        if not user_id:
            return None, "user_id is required"
        oid, err = TokenDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = TokenObject.find_by_token(token_str)
            if existing:
                return existing, None
            TokenObject.create(token_str, oid)
            token = TokenObject.find_by_token(token_str)
            return token, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_token(user_id):
        if not user_id:
            return None, "user_id is required"
        oid, err = TokenDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        try:
            existing = TokenObject.find_by_user_id(oid)
            if not existing:
                return None, "Token not found"
            deleted = TokenObject.delete(oid)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_token_by_value(token_str):
        if not token_str:
            return None, "token is required"
        try:
            existing = TokenObject.find_by_token(token_str)
            if not existing:
                return None, "Token not found"
            deleted = TokenObject.delete_by_token(token_str)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_token_by_id(token_id):
        if not token_id:
            return None, "token_id is required"
        oid, err = TokenDriver._validate_obj_id(token_id, "token_id")
        if err:
            return None, err
        try:
            deleted = TokenObject.delete_by_id(oid)
            return {"deleted": deleted}, None
        except Exception as e:
            return None, str(e)
