
import os
import requests
from bson import ObjectId
from Backend.Services.MongoDriver import getMongoDatabase

ahfulAppDataDB = getMongoDatabase()
gymCollection = ahfulAppDataDB['gym']

def test_get_gym_by_id():
    doc_id = "699cff88400d9d43a32e924d"
    gym = gymCollection.find_one({"_id": ObjectId(doc_id)})
    print(gym)
    assert gym is not None
