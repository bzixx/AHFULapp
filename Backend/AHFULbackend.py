from flask import Flask, current_app, send_from_directory #Import Main Flask application class
from apiRoutes.userRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from apiRoutes.workoutRoutes import workoutRouteBlueprint
from flask_swagger_ui import get_swaggerui_blueprint
import os
from dotenv import load_dotenv

def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    app = Flask(__name__)

    # Load environment variables from .env file At Main Level
    load_dotenv()

    app.register_blueprint(userRouteBlueprint)
    app.register_blueprint(workoutRouteBlueprint)
    
    @app.route('/swagger.json')
    def swagger_json():
        return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'swagger.json')
    
    SWAGGER_URL = '/swagger'            # URL for exposing Swagger UI
    API_URL = '/swagger.json'

    swaggerui_bp = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "AHFUL Users API"
        }
    )
    app.register_blueprint(swaggerui_bp, url_prefix=SWAGGER_URL)

    return app

# Define a route for the root URL ("/") that returns a simple "Hello, World!" message when accessed
# @current_app.route("/")
# def hello_world():
#     return "<h1>Hello, World!</h1><h3>Welcome to the AHFUL Backend Server.</h3> <p>It's great here.</p>"

#Test route to check if we can connect to MongoDB, will return the result of the returns a success message if successful
# @app.route("/testdb")
# def do_DB_test():
#     # return mongoDriver()





    