import os, certifi
from flask import Flask
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv
from pymongo import MongoClient
# AI Note: ProxyFix is used to ensure Flask correctly identifies the original request scheme (HTTP/HTTPS) when behind a proxy like CloudFront. This is crucial for CORS and secure cookie handling.
from werkzeug.middleware.proxy_fix import ProxyFix

# Load environment variables Before Creating the Flask App
load_dotenv()

# Dependency Injection Functions for mail.
def inject_util_services(app: Flask):
    from flaskr.services.util.mail import BrevoMailer
    app.brevo_mailer = BrevoMailer()

# Dependency Injection Functions for security and authentication.
def inject_security_services(app: Flask):
    from flaskr.services.security.google_auth_service import GoogleAuthService
    from flaskr.services.security.session_service import SessionService

    GOOGLE_CLIENT_ID = app.config["GOOGLE_CLIENT_ID"]
    app.google_auth_service = GoogleAuthService(GOOGLE_CLIENT_ID)
    app.session_service = SessionService()

# Dependency Injection Functions for database services.
def inject_db_services(app: Flask):
    from flaskr.services.util.db import get_db
    from flaskr.services.mongodb.report_DBsrv import ReportDBService
    from flaskr.services.mongodb.user_service import UserService

    app.report_service = ReportDBService(lambda: get_db())
    app.user_service = UserService(lambda: get_db())

# Register Blueprints for modular route organization.
def register_blueprints(app):
    from flaskr.API_routes.reports_controller import reports_bp
    from flaskr.API_routes.email_controller import email_bp
    from flaskr.API_routes.auth_controller import auth_bp

    app.register_blueprint(reports_bp)
    app.register_blueprint(email_bp)
    app.register_blueprint(auth_bp)

# Application factory, creates and configures the Flask app instance.
def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    # Makes Flask aware it's behind a proxy (for HTTPS handling)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    app.secret_key = app.config['SECRET_KEY']

    # Ensure instance folder exists
    os.makedirs(app.instance_path, exist_ok=True)

    #  Initialize database
    from flaskr.services.util import db
    db.init_app(app)

    # Configure session management
    with app.app_context():
        app.config["SESSION_MONGODB"] = MongoClient(app.config['MONGODB_URI'], tlsCAFile=certifi.where())
    Session(app)

    # Enable CORS - includes CloudFront production URL and custom domain
    allowed_origins = [
        'https://localhost:8000',
        'https://localhost:5000',
        'http://localhost:5000',
    ]
    CORS(app, supports_credentials=True, origins=allowed_origins, 
         allow_headers=['Content-Type', 'Authorization'],
         expose_headers=['Set-Cookie'],
         max_age=3600)

    # Inject service dependencies
    with app.app_context():
        inject_util_services(app)
        inject_security_services(app)
        inject_db_services(app)
    print("✅ Injected services")

    # Initialize mail service
    app.brevo_mailer.init_app(app)
    print("✅ Email service initialized")

    # Register routes
    register_blueprints(app)
    print("✅ Registered blueprints")

    @app.after_request
    def disable_coop(response):
        # COOP/COEP must be disabled if using OAuth popups or postMessage
        response.headers["Cross-Origin-Opener-Policy"] = "unsafe-none"
        response.headers["Cross-Origin-Embedder-Policy"] = "unsafe-none"
        return response
    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    @app.route("/")
    def root():
        return {"message": "AHFUL CORS Updated Successfully"}, 200
    return app
