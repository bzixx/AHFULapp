from dataModels.userObject import userObject
from werkzeug.security import generate_password_hash, check_password_hash



# The UserDriver is responsible for implementing the business logic related to user operations.
#  It acts as an intermediary between the API routes and the data models, 
# ensuring that all necessary validations and rules are applied before interacting with 
# the database.

class UserDriver:

    @staticmethod
    def get_all_users():
        try:
            users = userObject.find_all()
            return users, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_user_by_email(email):
        try:
            user = userObject.find_by_email(email)
            if not user:
                return None, "User not found"
            return user, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_user_by_email(email):
        try:
            user = userObject.find_by_email(email)
            if not user:
                return None, "User not found"
            return user, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def register_user(name, email, password, role):
        # Validate required fields
        print(name)
        print(email)
        print(password)
        print(role)
        if (not name) or (not email) or (not password) or (role is None):
            return None, "I'm Sorry, You Don't Have All the Keys for Tea Time. Try Again or Reach out to Management."

        # Business rule: no duplicate emails
        if userObject.find_by_email(email):
            return None, "You are asking for keys you already have. Management declined duplication: email."

        # Hash password before storing — never store plain text
        hashed_pw = generate_password_hash(password)

        user_data = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": int(role),
        }

        try:
            email = userObject.create(user_data)
            return email, None
        except Exception as e:
            return None, str(e)
        
    
    def update_user_info(self, updated_user_info: dict):
        document_id = updated_user_info.get("_id")
        result = super().update_document(document_id, updated_user_info, False)
        return { "updated_count": result }
    
    def update_document(self, document_id, update_data, include_updated_at = True):
        try:
            db = self.DB_PROVIDER()
            # Remove _id from update_data if present
            update_data.pop('_id', None)
            # Add updated timestamp
            update_data['updated_at'] = datetime.now(timezone.utc)
            result = db[self.COLLECTION_NAME].update_one(
                {"_id": ObjectId(document_id)},
                {"$set": update_data}
            )
            return result.modified_count
        except Exception as e:
            print(f"Database error: {e}")
            return 0

    @staticmethod
    def authenticate_user(email, password):
        if not email or not password:
            return None, "Bro, Email and password are required. What R U Doing?"

        user = userObject.find_by_email(email)
        if not user:
            # Intentionally vague — don't reveal whether email exists
            return None, "Something was wrong with your email or password"

        if not check_password_hash(user["password"], password):
            return None, "Something was wrong with your email or password"

        return str(user["_id"]), None

    @staticmethod
    def update_user(email, updates):
        # Prevent password from being updated through this route
        # Password changes should go through a dedicated change-password flow
        updates.pop("password", None)
        updates.pop("_id", None)

        if not updates:
            return None, "No valid fields to update"

        try:
            userObject.update(email, updates)
            return True, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def delete_user(email):
        user = userObject.find_by_email(email)
        if not user:
            return None, "User not found"

        try:
            userObject.delete(email)
            return True, None
        except Exception as e:
            return None, str(e)