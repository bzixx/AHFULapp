from flask import Flask #Import Main Flask application class
from services.MongoDriver import MongoDriver #[Local] Import MongoDB driver function

# Create Flask application instance we will use to run the Backend server and handle requests
app = Flask(__name__)


# Define a route for the root URL ("/") that returns a simple "Hello, World!" message when accessed
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

#Test route to check if we can connect to MongoDB, will return the result of the returns a success message if successful
@app.route("/testdb")
def do_DB_test():
    return MongoDriver()




    