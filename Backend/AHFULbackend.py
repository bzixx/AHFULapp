from flask import Flask, current_app, send_from_directory #Import Main Flask application class
import os # Import Function from os to get .env variables
from flask import Flask #Import Main Flask application class

#Services/Drivers Imports
from services.UserDriver import UserDriver #[Local] Import UserDriver for user DB operations
from services.signInDriver import signInDriver

#Routes/Blueprints Imports
from apiRoutes.userRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from apiRoutes.workoutRoutes import workoutRouteBlueprint
from apiRoutes.gymRoutes import gymRouteBlueprint
from apiRoutes.foodRoutes import foodRouteBlueprint
from apiRoutes.SwaggerRoutes import SwaggerUIBlueprint, SWAGGER_URL

#Main AHFUL APP Backend Entry Point.
def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    #FUN FACT: __name__ is a special variable that is the name of this file.
    app = Flask(__name__)

    #Make an Appwade SignInDriver to reference later 
    app.AHFULsignInDriver = signInDriver(os.getenv("GOOGLE_CLIENT_ID"))

    #Register App Routes and Blueprints
    app.register_blueprint(userRouteBlueprint)
    app.register_blueprint(workoutRouteBlueprint)
    
    @app.route('/swagger.json')
    def swagger_json():
        return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'swagger.json')
    
    SWAGGER_URL = '/swagger'            # URL for exposing Swagger UI
    API_URL = '/swagger.json'

    swaggerui_bp = SwaggerUIBlueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "AHFUL Users API"
        }
    )
    app.register_blueprint(swaggerui_bp, url_prefix=SWAGGER_URL)

    return app






    