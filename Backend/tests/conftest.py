import pytest
from AHFULbackend import create_app

@pytest.fixture(scope="session")
def app():
    """
    Create a Flask app configured for testing.
    """
    app = create_app()
    app.config["TESTING"] = True
    return app


@pytest.fixture(scope="session", autouse=True)
def app_context(app):
    """
    Automatically push an application context for all tests.
    This allows use of `g`, `current_app`, MongoDriver, etc.
    """
    ctx = app.app_context()
    ctx.push()
    yield
    ctx.pop()