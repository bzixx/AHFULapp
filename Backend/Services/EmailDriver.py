import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

def build_gmail_service():
    creds = Credentials.from_authorized_user_file('token.json')
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return build('gmail', 'v1', credentials=creds)

def send_email(to_address, subject, body_text):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = os.getenv("GMAIL_SENDER_ADDRESS")
    msg["To"] = to_address

    msg.attach(MIMEText(body_text, "plain"))

    service = build_gmail_service()
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    service.users().messages().send(
        userId='me', body={'raw': raw}
    ).execute()