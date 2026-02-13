from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from dotenv import load_dotenv
import os


def MongoDriver():
    load_dotenv()

    uri = os.getenv("MONGODB_URI")

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    appDataDB = client["appData"]

    print(appDataDB.list_collection_names())

    userCollection = appDataDB['user']
    #user = appDataDB.get_collection('user')

    print(userCollection.find_one({"name": "John Doe"}))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    return "MongoDB connection successful"
    