from pymongo import MongoClient
import certifi
from flask import Flask, current_app

def get_mongo_client() -> MongoClient:
    uri = current_app.config['MONGODB_URI']
    if not uri:
        raise RuntimeError("MongoDB URI not set in environment or config")
    mongodb_client = MongoClient(uri, tlsCAFile=certifi.where())
    return mongodb_client

def get_db(db_name=None):
    client = get_mongo_client()
    # Use provided db_name, else default from config or env
    if db_name is None:
        db_name = current_app.config['MONGODB_DB']
    return client[db_name]

def close_mongo_client(e=None):
    client = current_app.config.pop('MONGODB_CLIENT', None)
    if client is not None:
        client.close()

def init_app(app):
    app.teardown_appcontext(close_mongo_client)