from flask import Flask, current_app #Import Main Flask application class
from services.userDriver import UserDriver #[Local] Import UserDriver for user DB operations
from apiRoutes.userRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint

from dotenv import load_dotenv


def create_app():
    app = Flask(__name__)
    # Create Flask application instance we will use to run the Backend server and handle requests

    # Load environment variables from .env file At Main Level
    load_dotenv()

    app.register_blueprint(userRouteBlueprint)


    
    return app

# Define a route for the root URL ("/") that returns a simple "Hello, World!" message when accessed
# @current_app.route("/")
# def hello_world():
#     return "<h1>Hello, World!</h1><h3>Welcome to the AHFUL Backend Server.</h3> <p>It's great here.</p>"

#Test route to check if we can connect to MongoDB, will return the result of the returns a success message if successful
# @app.route("/testdb")
# def do_DB_test():
#     # return mongoDriver()





    