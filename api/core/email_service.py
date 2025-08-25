# core/email_service.py
import smtplib
from email.mime.text import MIMEText
from fastapi import HTTPException, status
from .config import settings

async def send_email_async(
    recipient: str,
    subject: str,
    body: str
) -> None:
    """Send email using SMTP configuration from settings"""
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_USER
    msg["To"] = recipient
    
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD.get_secret_value())
            server.sendmail(settings.SMTP_USER, recipient, msg.as_string())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error sending email: {str(e)}"
        ) from e