import os
from dotenv import load_dotenv
import resend

load_dotenv()

def send_escalation_email(shipment_id: str, cargo_type: str, destination: str, risk_reasoning: str, recommended_action: str):
    resend.api_key = os.getenv("RESEND_API_KEY", "re_7XEFNpYr_BANB8kKM3c4Qi64jiq4SXcBA")
    recipient_email = os.getenv("RECIPIENT_EMAIL", "xyaminokiritox@gmail.com")
    # In Resend's free tier, you can only send from a domain you own, or use their test email if verified,
    # but for hackathons, 'onboarding@resend.dev' works to send to the registered email address.
    sender_email = "onboarding@resend.dev"

    print(f"Executing action for {shipment_id}. Sending email to {recipient_email} via Resend API...")

    if not resend.api_key:
        print("WARNING: RESEND_API_KEY not found in environment. Simulating email send only.")
        print("--- MOCK EMAIL CONTENT ---")
        print(f"Subject: URGENT Escalation: RailRisk Alert for Shipment {shipment_id}")
        print(f"Cargo: {cargo_type}")
        print(f"Destination: {destination}")
        print(f"Reasoning:\n{risk_reasoning}")
        print(f"\nAction to Take:\n{recommended_action}")
        print("--------------------------")
        return False

    try:
        text_body = f"""
        Dear Operations Team,

        An urgent RailRisk alert has been escalated and approved for immediate execution.

        Shipment ID: {shipment_id}
        Cargo Type: {cargo_type}
        Destination: {destination}

        Context & Risk Reasoning:
        {risk_reasoning}

        Approved Action to Execute:
        {recommended_action}

        Please initiate the recommended action immediately.

        Best,
        RailRisk AI Automated System
        """

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f5;
                    margin: 0;
                    padding: 20px;
                    color: #3f3f46;
                }}
                .container {{
                    max-width: 600px;
                    background-color: #ffffff;
                    margin: 0 auto;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #ef4444;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }}
                .header h2 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 30px 20px;
                }}
                .details-table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }}
                .details-table th, .details-table td {{
                    text-align: left;
                    padding: 10px;
                    border-bottom: 1px solid #e4e4e7;
                }}
                .details-table th {{
                    color: #71717a;
                    width: 40%;
                }}
                .section-title {{
                    color: #18181b;
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    border-bottom: 2px solid #ef4444;
                    display: inline-block;
                    padding-bottom: 4px;
                }}
                .box {{
                    background-color: #fef2f2;
                    border-left: 4px solid #ef4444;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 0 4px 4px 0;
                }}
                .footer {{
                    background-color: #f4f4f5;
                    color: #71717a;
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>🚨 URGENT: RailRisk Escalation</h2>
                </div>
                <div class="content">
                    <p>Dear Operations Team,</p>
                    <p>An urgent RailRisk alert has been escalated and approved for <strong>immediate execution</strong>.</p>
                    
                    <table class="details-table">
                        <tr>
                            <th>Shipment ID</th>
                            <td><strong>{shipment_id}</strong></td>
                        </tr>
                        <tr>
                            <th>Cargo Type</th>
                            <td>{cargo_type}</td>
                        </tr>
                        <tr>
                            <th>Destination</th>
                            <td>{destination}</td>
                        </tr>
                    </table>

                    <div class="section-title">Context & Risk Reasoning</div>
                    <div class="box">
                        {risk_reasoning}
                    </div>

                    <div class="section-title">Approved Action to Execute</div>
                    <div class="box" style="background-color: #fffbeb; border-left-color: #f59e0b;">
                        <strong>{recommended_action}</strong>
                    </div>

                    <p style="margin-top: 30px; font-weight: bold; color: #ef4444;">
                        Please initiate the recommended action immediately.
                    </p>
                </div>
                <div class="footer">
                    &copy; RailRisk AI Automated System
                </div>
            </div>
        </body>
        </html>
        """
        
        params = {
            "from": sender_email,
            "to": [recipient_email],
            "subject": f"🚨 URGENT Escalation: RailRisk Alert for Shipment {shipment_id}",
            "text": text_body,
            "html": html_body,
        }
        
        email = resend.Emails.send(params)
        print(f"Email successfully sent to {recipient_email} for shipment {shipment_id}. Resend ID: {email['id']}")
        return True
    except Exception as e:
        print(f"Failed to send email via Resend: {e}")
        return False
