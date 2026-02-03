from bson import ObjectId
from datetime import datetime, timezone
from mongomock import Database
from flaskr.services.mongodb.base_mongodb_service import BaseMongoDBService

"""
OwnedMongoDBService extends BaseMongoDBService to include ownership checks
for CRUD operations. It ensures that documents are associated with a specific owner.
"""
class OwnedMongoDBService(BaseMongoDBService):
    def __init__(self, db_provider: lambda: Database, collection_name: str):
        super().__init__(db_provider, collection_name)
        self.owner_field: str = 'owner_name'

    def create_document(self, owner_name: str, data: dict):
        """
        Create a new document with ownership information.
        Adds the owner_id and created_at timestamp automatically.
        """
        data[self.owner_field] = owner_name
        return super().create_document(data)

    def get_all_documents(self, owner_name: str, filter_query=None):
        """
        Retrieve all documents belonging to a specific owner.
        """
        filter_query = filter_query or {}
        filter_query[self.owner_field] = owner_name
        return super().get_all_documents(filter_query)

    def get_document_by_id(self, owner_name: str, document_id: str):
        """
        Retrieve a single document if it belongs to the specified owner.
        """
        db = self.DB_PROVIDER()
        doc = db[self.COLLECTION_NAME].find_one({
            "_id": ObjectId(document_id),
            self.owner_field: owner_name
        })
        if doc:
            doc['_id'] = str(doc['_id'])
        return doc

    def update_document(self, owner_name: str, document_id: str, update_data: dict):
        """
        Update a document only if the current user owns it.
        """
        update_data.pop('_id', None)
        update_data['updated_at'] = datetime.now(timezone.utc)
        
        db = self.DB_PROVIDER()
        result = db[self.COLLECTION_NAME].update_one(
            {"_id": ObjectId(document_id), self.owner_field: owner_name},
            {"$set": update_data}
        )
        return result.modified_count

    def delete_document(self, owner_name: str, document_id: str):
        """
        Delete a document only if the current user owns it.
        """
        db = self.DB_PROVIDER()
        result = db[self.COLLECTION_NAME].delete_one({
            "_id": ObjectId(document_id),
            self.owner_field: owner_name
        })
        return result.deleted_count
