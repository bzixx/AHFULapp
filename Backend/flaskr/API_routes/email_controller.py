#backend/flaskr/API_routes/email_controller.py
#AUTHORS: Andrew, Ethan
#Controller for email sending endpoints

import base64
from flask import Blueprint, jsonify, request, current_app

# Blueprint for email routes
email_bp = Blueprint('email', __name__, url_prefix='/email')


@email_bp.route('/send', methods=['POST'])
def send_email():
    """Send email with optional attachment"""
    try:
        subject = request.form.get("subject")
        recipient = request.form.get("recipient")
        body = request.form.get("body")
        file = request.files.get("attachment")

        # Check required fields
        if not subject or not recipient or not body:
            return jsonify({"error": "Missing required fields"}), 400

        # Build attachment if file provided
        attachment_data = None
        if file and file.filename:
            file_bytes = file.read()
            encoded_file = base64.b64encode(file_bytes).decode('utf-8')
            attachment_data = {
                "name": file.filename,
                "content": encoded_file
            }

        # Send the email
        mail_service = current_app.brevo_mailer
        mail_service.send_email(
            subject=subject,
            recipients=[recipient],
            html_content=body,
            attachment=attachment_data
        )
        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Email error: {str(e)}")
        return jsonify({"error": "Failed to send email"}), 500


