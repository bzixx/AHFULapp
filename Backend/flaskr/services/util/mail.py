import sib_api_v3_sdk
from sib_api_v3_sdk import Configuration, ApiClient
import os
import logging

logger = logging.getLogger(__name__)

class BrevoMailer:
    """Email service using Brevo API for transactional emails"""
    
    def __init__(self):
        self.api_instance = None

    def init_app(self, app):
        """Initialize with Flask app configuration"""
        try:
            configuration = Configuration()
            configuration.api_key['api-key'] = app.config['BREVO_API_KEY']
            self.api_instance = sib_api_v3_sdk.TransactionalEmailsApi(ApiClient(configuration))
            logger.info("Brevo mailer initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Brevo mailer: {e}")
            raise

    def send_email(self, subject, recipients, html_content, attachment=None):
        """
        Send transactional email with optional attachment
        
        Args:
            subject: Email subject line
            recipients: List of recipient email addresses
            html_content: HTML email body
            attachment: Optional dict with 'name' and 'content' (base64 encoded)
        
        Returns:
            API response object
        """
        try:
            sender = os.getenv('BREVO_EMAIL')
            
            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                to=[{"email": r} for r in recipients],
                sender={"email": sender},
                subject=subject,
                html_content=html_content
            )

            # Add attachment if provided
            if attachment:
                send_smtp_email.attachment = [
                    sib_api_v3_sdk.SendSmtpEmailAttachment(
                        name=attachment["name"],
                        content=attachment["content"]
                    )
                ]

            response = self.api_instance.send_transac_email(send_smtp_email)
            logger.info(f"Email sent to {recipients}")
            return response
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            raise
