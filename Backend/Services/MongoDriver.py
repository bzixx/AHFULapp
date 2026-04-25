from pymongo import MongoClient
import certifi
import os
from flask import current_app, g

# Return a MongoClient cached on flask.g for the current request/app
# context. If not present, create it using Flask config or environment
# variables.
def get_mongo_client() -> MongoClient:
    ahfulMongoDBClient = getattr(g, "ahful_mongodb_client", None)
    if ahfulMongoDBClient is not None:
        print("Using Cached MongoDB Client from Flask g")
        return ahfulMongoDBClient

    uri = None
    # Prefer Flask config when available
    try:
        uri = current_app.config.get("MONGODB_URI")
    except RuntimeError:
        # current_app not available
        uri = None

    if not uri:
        uri = os.getenv("MONGODB_URI")

    if not uri:
        raise RuntimeError("MongoDB URI not set in Flask config or environment")

    ahfulMongoDBClient = MongoClient(uri, tlsCAFile=certifi.where())

    # Send a ping to confirm a successful connection
    try:
        ahfulMongoDBClient.admin.command('ping')
        print("Setup MongoDB Connection and Pinged the Deployment! Storing Network Client.")
    except Exception as e:
        print(f"Error setting up MongoDB Connection: {e}")

    g.ahful_mongodb_client = ahfulMongoDBClient
    return ahfulMongoDBClient

#Return the database instance. Uses current_app.config['MONGODB_DB'] or
#the environment variable MONGODB_DB. Falls back to 'appData' if none set.
def get_db():
    client = get_mongo_client()
    return client["appData"]

#Convenience helper to return a collection handle.
def get_collection(collection_name: str):
    return get_db()[collection_name]

#Close the cached client (if any) during Flask teardown.
def close_mongo_client(e=None):
    client = g.pop("ahful_mongodb_client", None)
    if client is not None:
        try:
            client.close()
            print("Closed MongoDB Client Connection.")
        except Exception:
            pass

#Register the Mongo teardown on the given Flask `app`
def connect_mongo(app, label: str | None = None):
    app.teardown_appcontext(close_mongo_client)


