# test_email.py — run once to confirm everything works end to end
from Services.EmailDriver import send_email

send_email(
    to_address="youremail@gmail.com",
    subject="AHFUL Test Email",
    body_text="If you're reading this, the Gmail API is working! 🎉"
)

print("✅ Email sent successfully")