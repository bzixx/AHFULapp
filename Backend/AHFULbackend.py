from flask import Flask, send_from_directory #Import Main Flask application class
from services.userDriver import UserDriver #[Local] Import UserDriver for user DB operations
from apiRoutes.userRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from apiRoutes.workoutRoutes import workoutRouteBlueprint

from os import getenv

from services.signInDriver import signInDriver


def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    app = Flask(__name__)

    app.AHFULsignInDriver = signInDriver(getenv("GOOGLE_CLIENT_ID"))

    #Register App Blueprints
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






    