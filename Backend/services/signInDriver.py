from google.oauth2 import id_token
from google.auth.transport import requests

##THIS IS SKELETON NEED TO VERIFY

class signInDriver:
    def __init__(self, GOOGLE_CLIENT_ID: str):
        self.client_id: str = GOOGLE_CLIENT_ID

    def verify_google_token(self, token: str):
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), self.client_id)
            return idinfo  # Contains 'sub', 'email', 'name', etc.
        except ValueError:
            return None
