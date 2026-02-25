from flask import Flask, current_app, send_from_directory #Import Main Flask application class
import os # Import Function from os to get .env variables
from flask_cors import CORS #Import Main Flask application class

#Services/Drivers Imports
from Services.SignInDriver import SignInDriver

#Routes/Blueprints Imports
from APIRoutes.UserRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from APIRoutes.WorkoutRoutes import workoutRouteBlueprint
from APIRoutes.GymRoutes import gymRouteBlueprint
from APIRoutes.FoodRoutes import foodRouteBlueprint
from APIRoutes.SwaggerRoutes import swaggerUIBlueprint
from APIRoutes.SignInRoutes import signInRouteBlueprint

#Main AHFUL APP Backend Entry Point.
def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    #FUN FACT: __name__ is a special variable that is the name of this file.
    app = Flask(__name__)

    #Make an Appwade SignInDriver to reference later 
    app.AHFULSignInDriver = SignInDriver(os.getenv("GOOGLE_CLIENT_ID"))

    #Register App Routes and Blueprints
    api_prefix = "/Backend"
    #Swagger routes add prefix to match server url
    app.register_blueprint(userRouteBlueprint, url_prefix=api_prefix + userRouteBlueprint.url_prefix)
    app.register_blueprint(workoutRouteBlueprint, url_prefix=api_prefix + workoutRouteBlueprint.url_prefix)
    app.register_blueprint(gymRouteBlueprint, url_prefix=api_prefix + gymRouteBlueprint.url_prefix)
    app.register_blueprint(foodRouteBlueprint, url_prefix=api_prefix + foodRouteBlueprint.url_prefix)
    app.register_blueprint(swaggerUIBlueprint)
    app.register_blueprint(signInRouteBlueprint)


    # Enable CORS - includes CloudFront production URL and custom domain
    allowed_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5000'
    ]

    CORS(app, origins=allowed_origins, supports_credentials=True)
    
    #Print an list of all Route maps on the AHFUL App after startup.
    print(app.url_map)

    #Return AHFUL
    return app






    