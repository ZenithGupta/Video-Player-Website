import brevo_python
from brevo_python.rest import ApiException
import os
import logging

logger = logging.getLogger(__name__)

def send_brevo_otp(to_email, otp_code, subject="Your Verification Code"):
    """
    Sends an OTP email using the Brevo (Sendinblue) API.
    """
    api_key = os.environ.get('BREVO_API_KEY')
    if not api_key:
        logger.error("BREVO_API_KEY not found in environment variables.")
        return False

    configuration = brevo_python.Configuration()
    configuration.api_key['api-key'] = api_key

    api_instance = brevo_python.TransactionalEmailsApi(brevo_python.ApiClient(configuration))
    
    html_content = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px; }}
                .header {{ background-color: #f8f9fa; padding: 10px; text-align: center; border-bottom: 1px solid #eee; }}
                .code {{ font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 20px 0; text-align: center; }}
                .footer {{ margin-top: 20px; font-size: 12px; color: #888; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>{subject}</h2>
                </div>
                <p>Hello,</p>
                <p>You requested a verification code for One Last Move.</p>
                <p>Please use the following OTP to complete your request:</p>
                <div class="code">{otp_code}</div>
                <p>This code is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <div class="footer">
                    &copy; 2024 One Last Move. All rights reserved.
                </div>
            </div>
        </body>
    </html>
    """

    sender = {"name": "One Last Move", "email": "noreply@onelastmove.com"}
    to = [{"email": to_email}]
    
    send_smtp_email = brevo_python.SendSmtpEmail(
        to=to,
        sender=sender,
        html_content=html_content,
        subject=subject
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        logger.info(f"Email sent successfully to {to_email}. Message ID: {api_response.message_id}")
        return True
    except ApiException as e:
        logger.error(f"Exception when calling SmtpApi->send_transac_email: {e}")
        return False
