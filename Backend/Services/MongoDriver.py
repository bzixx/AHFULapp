from pymongo import MongoClient
import certifi
import os
from flask import current_app

#Register the Mongo teardown on the given Flask `app`
def connect_mongo(app):
    print("Setting up MongoDB Connection for proper teardown.")
    app.teardown_appcontext(close_mongo_client)
    return get_mongo_client()

# Return a MongoClient cached on flask.g for the current request/app
# context. If not present, create it using Flask config or environment
# variables.
def get_mongo_client() -> MongoClient:

    uri = None
    if not uri:
        uri = os.getenv("MONGODB_URI")

    if not uri:
        raise RuntimeError("MongoDB URI not set in Flask config or environment")

    ahfulMongoDBClient = MongoClient(uri, tlsCAFile=certifi.where())

    # Send a ping to confirm a successful connection
    try:
        ahfulMongoDBClient.admin.command('ping')
    except Exception as e:
        print(f"Error pinging MongoDB Connection: {e}")

    #return the conenction to the DB
    return ahfulMongoDBClient["appData"]

#Convenience helper to return a collection handle.
def get_collection(collection_name: str):
    return current_app.MongoDriver[collection_name]

#Close the cached client (if any) during Flask teardown.
def close_mongo_client(e=None):
    try:
        current_app.MongoDriver.close()
        # print("Closed MongoDB Client Connection.")
    except Exception:
        print("Error closing MongoDB Client Connection during teardown.")
        pass




