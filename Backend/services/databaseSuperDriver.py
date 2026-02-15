

class databaseSuperDriver:
    def __init__(self):
        self.mongoDB = getMongoDatabase()
        self.userDriver = UserDriver()