from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import current_app
import os

#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with DB

#Main function to connect to MongoDB, will return a success message if successful, 
# and print the names of the collections in the database and the documents in the 
# user collection for testing purposes
def getMongoClient():

    uri = os.getenv("MONGODB_URI")

    #Error handling for missing environment variable
    if not uri:
        raise RuntimeError("MongoDB connection failed: MONGODB_URI not found in environment.")

    # Create a new client and connect to the server
    ahfulMongoDBClient = MongoClient(uri, server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        ahfulMongoDBClient.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    return ahfulMongoDBClient

def getMongoDatabase():
    ahfulMongoDBClient = getMongoClient()
    return ahfulMongoDBClient["appData"]


def killMongoClient():
    # This function is a placeholder for any cleanup operations needed for the MongoDB connection
    openMongoDriver = current_app.config.get('ahfulMongoDBClient')
    if openMongoDriver:
        openMongoDriver.close()

