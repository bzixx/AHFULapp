from flask import Flask #Import Main Flask application class
from flask_cors import CORS
from os import getenv # Import Function from os to get .env variables
from flask import Flask #Import Main Flask application class

#Services/Drivers Imports
from Services.SignInDriver import SignInDriver

#Routes/Blueprints Imports
from APIRoutes.UserRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from APIRoutes.WorkoutRoutes import workoutRouteBlueprint
from APIRoutes.SwaggerRoutes import swaggerUIBlueprint
from APIRoutes.SignInRoutes import signInRouteBlueprint

#Main AHFUL APP Backend Entry Point.
def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    #FUN FACT: __name__ is a special variable that is the name of this file.
    app = Flask(__name__)

    #Make an Appwade SignInDriver to reference later 
    app.AHFULSignInDriver = SignInDriver(getenv("GOOGLE_CLIENT_ID"))

    #Register App Routes and Blueprints
    app.register_blueprint(userRouteBlueprint)
    app.register_blueprint(workoutRouteBlueprint)
    app.register_blueprint(swaggerUIBlueprint)
    app.register_blueprint(signInRouteBlueprint)

    # Enable CORS - includes CloudFront production URL and custom domain
    allowed_origins = [
        'http://localhost:5173'
    ]

    CORS(app, origins=allowed_origins, supports_credentials=True)
    
    #Print an list of all Route maps on the AHFUL App after startup.
    print(app.url_map)

    #Return AHFUL
    return app






    