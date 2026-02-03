from bson import ObjectId
from datetime import datetime, timezone
from flask import jsonify

class BaseMongoDBService():
    def __init__(self, db_provider, collection_name):
        self.DB_PROVIDER = db_provider
        self.COLLECTION_NAME = collection_name

    def create_document(self, data):
        """
        Insert a new document into the specified MongoDB collection.
        Creates a new document with automatic timestamp generation.
        
        Args:
            data (dict): Document data to insert. Must be JSON-serializable.
                        
        Returns:
            str: MongoDB ObjectId of the inserted document converted to string format.
        
        Example:
            user_data = {"name": "John Doe", "email": "john@example.com"}
            doc_id = create_document(user_data)
        """
        try:
            db = self.DB_PROVIDER()
            # Add timestamp
            if 'created_at' not in data:
                data['created_at'] = datetime.now(timezone.utc)
            result = db[self.COLLECTION_NAME].insert_one(data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Database error: {e}")
            raise

    def get_document_by_id(self, document_id):
        """
        Retrieve a single document from a collection using its MongoDB ObjectId.
        
        Args:
            document_id (str): MongoDB ObjectId as a string (24-character hex string)
                            
        Returns:
            dict or None: Document data with ObjectId converted to string, or None if not found
        
        Example:
            doc = get_document_by_id("507f1f77bcf86cd799439011")
            if doc:
                print(f"Found user: {doc['name']}")
        """
        try:
            db = self.DB_PROVIDER()
            doc = db[self.COLLECTION_NAME].find_one({"_id": ObjectId(document_id)})
            if doc:
                doc['_id'] = str(doc['_id'])  # Convert ObjectId to String
            return doc
        except Exception as e:
            print(f"Database error: {e}")
            return None

    def get_all_documents(self, filter_query=None):
        """
        Retrieve all documents from a collection with optional filtering.
        
        Args:
            filter_query (dict, optional): MongoDB query filter. If None, retrieves all documents.
                                        Supports all MongoDB query operators.
                                        
        Returns:
            list[dict]: List of documents with ObjectIds converted to strings.
                    Returns empty list if no documents match.
            
        Example:
            # Get all documents
            all_users = get_all_documents()
            
            # Get filtered documents
            active_users = get_all_documents({"status": "active"})
        """
        try:
            db = self.DB_PROVIDER()
            filter_query = filter_query or {}
            documents = list(db[self.COLLECTION_NAME].find(filter_query))
            # Convert ObjectId to string for JSON serialization
            for doc in documents:
                doc['_id'] = str(doc['_id'])
            return documents
        except Exception as e:
            print(f"Database error: {e}")
            return []

    def update_document(self, document_id, update_data, include_updated_at = True):
        """
        Update an existing document by its ObjectId with automatic timestamp.
        
        Args:
            document_id (str): MongoDB ObjectId as string
            update_data (dict): Dictionary containing the fields to update
                            
        Returns:
            int: Number of documents modified (0 or 1)
        """
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

    def delete_document(self, document_id):
        """
        Delete a single document by its ObjectId.
        
        Args:
            document_id (str): MongoDB ObjectId as string
                            
        Returns:
            int: Number of documents deleted (0 or 1)
        """
        try:
            db = self.DB_PROVIDER()
            result = db[self.COLLECTION_NAME].delete_one({"_id": ObjectId(document_id)})
            return result.deleted_count
        except Exception as e:
            print(f"Database error: {e}")
            return 0

    def delete_all_documents(self):
        """
        Delete all documents from a collection.
                                
        Returns:
            int: Number of documents deleted
        """
        try:
            db = self.DB_PROVIDER()
            result = db[self.COLLECTION_NAME].delete_many({})
            return result.deleted_count
        except Exception as e:
            print(f"Database error: {e}")
            return 0

    def get_collection_stats(self):
        """
        Get comprehensive statistics about a MongoDB collection.
                                
        Returns:
            dict: Dictionary containing collection statistics including total documents
                and breakdown by document type
        """
        try:
            db = self.DB_PROVIDER()
            collection = db[self.COLLECTION_NAME]
            total_count = collection.count_documents({})
            
            # Get document type breakdown if 'type' field exists
            type_breakdown = {}
            try:
                pipeline = [
                    {"$group": {"_id": "$type", "count": {"$sum": 1}}},
                    {"$sort": {"_id": 1}}
                ]
                type_results = list(collection.aggregate(pipeline))
                type_breakdown = {item['_id'] or 'undefined': item['count'] for item in type_results}
            except:
                type_breakdown = {"all": total_count}
            
            return {
                "collection_name": self.COLLECTION_NAME,
                "total_documents": total_count,
                "type_breakdown": type_breakdown
            }
        except Exception as e:
            print(f"Database error: {e}")
            return {"error": str(e)}

    def query_documents(self, query):
        """
        Query documents using a MongoDB-style query dictionary.
        
        Example:
            query_documents({"status": "failed", "timestamp": {"$gt": 1700000000}})
        """
        try:
            db = self.DB_PROVIDER()
            documents = list(db[self.COLLECTION_NAME].find(query))
            # Convert ObjectId to string
            for doc in documents:
                doc['_id'] = str(doc['_id'])
            return documents
        except Exception as e:
            print(f"Database error: {e}")
            return []