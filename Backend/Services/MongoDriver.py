from pymongo import MongoClient
import certifi
import os
from flask import current_app
import atexit

def connect_mongo(app):
    """Create one MongoClient at startup, store both client and db on app."""
    print("Setting up MongoDB connection.")

    uri = os.getenv("MONGODB_URI")
    if not uri:
        raise RuntimeError("MONGODB_URI environment variable not set.")

    # Store the CLIENT separately from the DATABASE
    client = MongoClient(uri, tlsCAFile=certifi.where())

    # Store BOTH on the app — client for teardown, db for queries
    app.MongoClient = client
    app.MongoDBConn = client["appData"]

    # Smoke test the connection immediately
    try:
        client.admin.command("ping")
        print("MongoDB ping successful.")
    except Exception as e:
        raise RuntimeError(f"Could not connect to MongoDB: {e}")
    
    if app.MongoDBConn is None:
        raise RuntimeError("MongoDBConn failed to initialize — client['appData'] returned None.")

    # Register teardown ONCE here
    atexit.register(lambda: client.close())


def get_collection(collection_name: str):
    """Convenience helper to return a collection handle."""
    return current_app.MongoDBConn[collection_name]


def close_mongo_client(e=None):
    """Close the MongoClient (not the Database) during Flask teardown."""
    client = getattr(current_app._get_current_object(), "MongoClient", None)
    if client:
        client.close()
        print("MongoDB client closed.")
    else:
        print("No MongoDB client found to close.")