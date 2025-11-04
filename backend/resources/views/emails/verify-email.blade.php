<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - ChurchAfrica</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #B8336A;
            margin-bottom: 10px;
        }
        h1 {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #8B1538 0%, #B8336A 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background: linear-gradient(135deg, #A01B42 0%, #C93D74 100%);
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #B8336A;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .security-notice {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            padding: 12px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⛪ ChurchAfrica</div>
        </div>

        <h1>Welcome to ChurchAfrica, {{ $user->first_name }}!</h1>

        <p>Thank you for registering with ChurchAfrica. To complete your registration and start using your account, please verify your email address by clicking the button below:</p>

        <div style="text-align: center;">
            <a href="{{ $verificationUrl }}" class="button">Verify Email Address</a>
        </div>

        <div class="info-box">
            <strong>📧 Verification Link:</strong><br>
            If the button above doesn't work, copy and paste this link into your browser:<br>
            <a href="{{ $verificationUrl }}" style="color: #B8336A; word-break: break-all;">{{ $verificationUrl }}</a>
        </div>

        <div class="security-notice">
            <strong>🔒 Security Notice:</strong><br>
            This verification link will expire in <strong>24 hours</strong>. If you didn't create an account with ChurchAfrica, please ignore this email or contact our support team.
        </div>

        <p>Once verified, you'll be able to:</p>
        <ul>
            <li>Access your church dashboard</li>
            <li>Manage member information</li>
            <li>Track attendance records</li>
            <li>And much more!</li>
        </ul>

        <div class="footer">
            <p>This email was sent to {{ $user->email }}</p>
            <p>© {{ date('Y') }} ChurchAfrica. All rights reserved.</p>
            <p style="font-size: 12px; color: #999;">
                If you have any questions, please contact us at support@churchafrica.com
            </p>
        </div>
    </div>
</body>
</html>

