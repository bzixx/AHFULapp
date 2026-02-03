#backend/flaskr/services/mongodb/report_DBsrv.py
#AUTHORS: Ethan
#Service layer for Reports mongodb collection operations.

# Imports for base mongodb service
from flaskr.services.mongodb.owned_mongodb_service import OwnedMongoDBService

# Service class for managing Reports in MongoDB
class ReportDBService(OwnedMongoDBService):
    #Hardcoded collection name for reports collection
    def __init__(self, db, collection_name="Reports"):
        super().__init__(db, collection_name)