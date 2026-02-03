import array

from bson import ObjectId
from flaskr.services.mongodb.base_mongodb_service import BaseMongoDBService

class UserService(BaseMongoDBService):

    def __init__(self, db, collection_name="Users"):
        super().__init__(db, collection_name)

    def create_user(self, user_info: dict) -> dict:
        if not self.__validate_user_info(user_info):
            raise ValueError("user_info object invalid.")
        if self.get_user_info_by_email(user_info.get("email")):
            raise ValueError("user with email: {} already exists".format(user_info.get("email")))
        try:
            created_user_info = super().create_document(user_info)
            print(f"New user created: {created_user_info}")
            return created_user_info
        except Exception as e:
            print(f"Error creating new user_info: {e}")
            raise

    def update_user_info(self, updated_user_info: dict):
        document_id: ObjectId = ObjectId(updated_user_info.get("_id"))
        result = super().update_document(document_id, updated_user_info, False)
        return { "updated_count": result }

    def get_user_info_by_email(self, email: str) -> dict | None:
        documents: array[dict] = super().query_documents({"email": email})
        if documents and documents[0]:
            user_info = documents[0]
            return user_info
        return None

    def __validate_user_info(self, user_info: dict) -> bool:
        if not user_info.get("display_name"):
            return False
        if not user_info.get("email"):
            return False
        return True