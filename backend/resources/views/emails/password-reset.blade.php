<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - ChurchAfrica</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8B1538;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .content {
            margin-bottom: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #8B1538, #B8336A);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        .reset-button:hover {
            background: linear-gradient(135deg, #6B0F2A, #9A2A4F);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .security-note {
            background: #f8f9fa;
            border-left: 4px solid #8B1538;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 5px 5px 0;
        }
        .security-note h4 {
            margin: 0 0 10px 0;
            color: #8B1538;
            font-size: 16px;
        }
        .security-note p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .footer a {
            color: #8B1538;
            text-decoration: none;
        }
        .expiry-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .email-container {
                padding: 20px;
            }
            .reset-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">ChurchAfrica</div>
            <div class="subtitle">Church Management System</div>
        </div>

        <div class="content">
            <div class="greeting">Hello {{ $user->name }},</div>
            
            <div class="message">
                We received a request to reset your password for your ChurchAfrica account. If you made this request, click the button below to reset your password:
            </div>

            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="reset-button">Reset My Password</a>
            </div>

            <div class="expiry-warning">
                <strong>⏰ This link will expire in 1 hour</strong> for security reasons.
            </div>

            <div class="security-note">
                <h4>🔒 Security Information</h4>
                <p>
                    If you didn't request this password reset, please ignore this email. Your password will remain unchanged. 
                    For security reasons, we recommend changing your password regularly and using a strong, unique password.
                </p>
            </div>

            <div class="message">
                If the button above doesn't work, you can copy and paste the following link into your browser:
                <br><br>
                <a href="{{ $resetUrl }}" style="color: #8B1538; word-break: break-all;">{{ $resetUrl }}</a>
            </div>
        </div>

        <div class="footer">
            <p>
                This email was sent from ChurchAfrica. If you have any questions, please contact your system administrator.
            </p>
            <p>
                <a href="{{ config('app.frontend_url') }}">Visit ChurchAfrica</a> | 
                <a href="{{ config('app.frontend_url') }}/contact">Contact Support</a>
            </p>
            <p style="font-size: 12px; color: #999;">
                © {{ date('Y') }} ChurchAfrica. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
