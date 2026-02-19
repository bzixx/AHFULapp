from flask import Flask, current_app, send_from_directory #Import Main Flask application class
from os import getenv # Import Function from os to get .env variables
from flask import Flask #Import Main Flask application class

#Services/Drivers Imports
from services.UserDriver import UserDriver #[Local] Import UserDriver for user DB operations
from services.signInDriver import signInDriver

#Routes/Blueprints Imports
from apiRoutes.userRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from apiRoutes.workoutRoutes import workoutRouteBlueprint
from apiRoutes.SwaggerRoutes import SwaggerUIBlueprint, SWAGGER_URL

#Main AHFUL APP Backend Entry Point.
def create_app():
    # Create Flask application instance we will use to run the Backend server and handle requests
    #FUN FACT: __name__ is a special variable that is the name of this file.
    app = Flask(__name__)

    #Make an Appwade SignInDriver to reference later 
    app.AHFULsignInDriver = signInDriver(getenv("GOOGLE_CLIENT_ID"))

    #Register App Routes and Blueprints
    app.register_blueprint(userRouteBlueprint)
    app.register_blueprint(workoutRouteBlueprint)
    app.register_blueprint(SwaggerUIBlueprint, url_prefix=SWAGGER_URL)

    #Print an list of all Route maps on the AHFUL App after startup.
    print(app.url_map)

    #Return AHFUL
    return app






    