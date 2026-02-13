from flask import Flask
from services.MongoDriver import MongoDriver


app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/testdb")
def do_DB_test():
    return MongoDriver()


    