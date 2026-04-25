from pymongo import MongoClient
import certifi
import os
from flask import current_app, g

# Services & Drivers should not open a global client at import time. Instead
# provide helpers which create a MongoClient cached on the Flask request/app
# context (stored on `flask.g`) and close it on teardown.


def get_mongo_client() -> MongoClient:
    """Return a MongoClient cached on flask.g for the current request/app
    context. If not present, create it using Flask config or environment
    variables.
    """
    client = getattr(g, "_mongodb_client", None)
    if client is not None:
        return client

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

    client = MongoClient(uri, tlsCAFile=certifi.where())
    g._mongodb_client = client
    return client


def get_db(db_name: str | None = None):
    """Return the database instance. Uses current_app.config['MONGODB_DB'] or
    the environment variable MONGODB_DB. Falls back to 'appData' if none set.
    """
    client = get_mongo_client()
    if db_name is None:
        try:
            db_name = current_app.config.get("MONGODB_DB")
        except RuntimeError:
            db_name = None

    if not db_name:
        db_name = os.getenv("MONGODB_DB", "appData")

    return client[db_name]


def get_collection(collection_name: str, db_name: str | None = None):
    """Convenience helper to return a collection handle."""
    return get_db(db_name)[collection_name]


def close_mongo_client(e=None):
    """Close the cached client (if any) during Flask teardown."""
    client = g.pop("_mongodb_client", None)
    if client is not None:
        try:
            client.close()
        except Exception:
            pass


def connect_mongo(app, label: str | None = None):
    """Register the Mongo teardown on the given Flask `app` and store a
    small marker in `app.extensions['mongo']`. The optional `label` is an
    identifier (for example 'AHFUL') to make the registration more visible in
    debugging and logs.

    This is a clearer name than `init_app` and is the preferred public API.
    """
    app.teardown_appcontext(close_mongo_client)
    # Store minimal extension info on the Flask app for introspection
    if not hasattr(app, 'extensions'):
        app.extensions = {}
    app.extensions.setdefault('mongo', {})['label'] = label


