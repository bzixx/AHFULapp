import atexit
import pytest
from flask import Flask
import os
import sys

# Make sure the Backend directory (parent of tests/) is on sys.path so imports like
# `from Services.MongoDriver import ...` work regardless of where pytest is run from.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
# Try to load a .env file automatically (useful when pytest is run from a venv).
# This is optional — if python-dotenv isn't installed we'll fall back to the
# environment as-is and print a hint.
try:
    from dotenv import load_dotenv
    # Prefer a .env file in Backend/, then fall back to repository root.
    backend_env = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
    if os.path.exists(backend_env):
        load_dotenv(backend_env)
except ImportError:
    # Not critical — advise the developer to install python-dotenv if they want
    # automatic .env loading when running pytest.
    pass

from Services.MongoDriver import connect_mongo_testing

@pytest.fixture(scope="session", autouse=True)
def flask_app_with_db():
    """Create a Flask app, attach a testing MongoDB connection, and push app context.

    This fixture is session-scoped and autouse so tests that use current_app will
    have access to `current_app.MongoDBConn` and `current_app.MongoClient`.
    """
    # Create a minimal Flask app for tests
    app = Flask(__name__)

    # Connect to the test DB using the helper — honor MONGODB_URI and MONGODB_NAME
    db = connect_mongo_testing()

    # Attach client and db to the app so existing code that uses current_app works
    # connect_mongo_testing returns a Database; get its client as attribute
    app.MongoDBConn = db
    app.MongoClient = getattr(db, 'client', None)

    # Push the app context so current_app is available in tests
    ctx = app.app_context()
    ctx.push()

    # Register cleanup to pop context and close client
    def teardown():
        try:
            ctx.pop()
        except Exception:
            pass
        if app.MongoClient:
            try:
                app.MongoClient.close()
            except Exception:
                pass

    atexit.register(teardown)

    yield app

    # Run teardown after the session
    teardown()
