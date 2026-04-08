from flask import Flask, current_app, send_from_directory #Import Main Flask application class
import os # Import Function from os to get .env variables
from flask_cors import CORS #Import Main Flask application class
from dotenv import load_dotenv # Load environment variables from .env file

#Services/Drivers Imports
from Services.SignInDriver import SignInDriver

#Routes/Blueprints Imports
from APIRoutes.UserRoutes import userRouteBlueprint #[Local] Import User API routes as a Flask Blueprint
from APIRoutes.WorkoutRoutes import workoutRouteBlueprint
from APIRoutes.GymRoutes import gymRouteBlueprint
from APIRoutes.FoodRoutes import foodRouteBlueprint
from APIRoutes.MeasurementRoutes import measurementRouteBlueprint
from APIRoutes.PersonalExRoutes import personalExRouteBlueprint
from APIRoutes.SwaggerRoutes import swaggerUIBlueprint
from APIRoutes.SignInRoutes import signInRouteBlueprint
from APIRoutes.ExerciseRoutes import exerciseRouteBlueprint
from APIRoutes.UserSettingsRoutes import userSettingsBlueprint
from APIRoutes.TokenRoutes import tokenBlueprint
from APIRoutes.TaskRoutes import taskBlueprint
from APIRoutes.ChatRoutes import chatRouteBlueprint

#Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials

#Notification Scheduler
from Services.NotificationScheduler import start_scheduler

#Main AHFUL APP Backend Entry Point.
def create_app():
    # Load environment variables from .env file
    load_dotenv()

    # Create Flask application instance we will use to run the Backend server and handle requests
    #FUN FACT: __name__ is a special variable that is the name of this file.
    app = Flask(__name__)

    #Make an Appwade SignInDriver to reference later
    app.AHFULSignInDriver = SignInDriver(os.getenv("GOOGLE_CLIENT_ID"))

    #Initialize Firebase Admin SDK
    cred = credentials.Certificate("./firebaseSecret.json")
    app.AHFULFirebaseDriver = firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully")

    #Register App Routes and Blueprints
    #Swagger routes add prefix to match server url
    app.register_blueprint(userRouteBlueprint)
    app.register_blueprint(workoutRouteBlueprint)
    app.register_blueprint(gymRouteBlueprint)
    app.register_blueprint(foodRouteBlueprint)
    app.register_blueprint(measurementRouteBlueprint)
    app.register_blueprint(personalExRouteBlueprint)
    app.register_blueprint(swaggerUIBlueprint)
    app.register_blueprint(signInRouteBlueprint)
    app.register_blueprint(exerciseRouteBlueprint)
    app.register_blueprint(userSettingsBlueprint)
    app.register_blueprint(tokenBlueprint)
    app.register_blueprint(taskBlueprint)
    app.register_blueprint(chatRouteBlueprint)

    # Enable CORS - includes CloudFront production URL and custom domain
    allowed_origins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5000'
    ]

    CORS(app, origins=allowed_origins, supports_credentials=True)

    #Start the notification scheduler
    start_scheduler()

    #Print an list of all Route maps on the AHFUL App after startup.
    print(app.url_map)

    #Return AHFUL
    return app


# Create a module-level WSGI application so servers like gunicorn can import
# this module and find the `app` callable (the error reported by gunicorn
# happens when it can't find `app` in the module). Also provide `application`
# alias for servers that expect that name.
app = create_app()
