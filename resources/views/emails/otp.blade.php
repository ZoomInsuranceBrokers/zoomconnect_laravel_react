<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }

        .decorative-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
        }

        .dot {
            position: absolute;
            border-radius: 50%;
            opacity: 0.3;
        }

        .dot-1 { width: 8px; height: 8px; background: #ff6b6b; top: 20px; left: 50px; }
        .dot-2 { width: 6px; height: 6px; background: #4ecdc4; top: 40px; right: 80px; }
        .dot-3 { width: 10px; height: 10px; background: #45b7d1; bottom: 30px; left: 80px; }
        .dot-4 { width: 7px; height: 7px; background: #f9ca24; top: 60px; left: 120px; }
        .dot-5 { width: 9px; height: 9px; background: #f0932b; bottom: 50px; right: 60px; }
        .dot-6 { width: 5px; height: 5px; background: #eb4d4b; top: 80px; right: 120px; }

        .cross {
            position: absolute;
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
            font-weight: bold;
        }

        .cross-1 { top: 30px; right: 40px; }
        .cross-2 { bottom: 40px; left: 40px; }
        .cross-3 { top: 70px; left: 160px; }

        .circle {
            position: absolute;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
        }

        .circle-1 { width: 20px; height: 20px; top: 50px; left: 200px; }
        .circle-2 { width: 16px; height: 16px; bottom: 60px; right: 100px; }

        .logo {
            position: relative;
            z-index: 10;
            margin-bottom: 10px;
        }

        .logo h1 {
            color: white;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
        }

        .logo .zoom { color: #FF0066; }
        .logo .connect { color: white; }

        .bell-icon {
            position: relative;
            z-index: 10;
            margin: 20px auto;
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .bell-svg {
            width: 30px;
            height: 30px;
            fill: #667eea;
        }

        .content {
            padding: 40px 30px;
            text-align: center;
        }

        .title {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .subtitle {
            color: #7f8c8d;
            font-size: 16px;
            margin-bottom: 30px;
        }

        .service-notice {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            text-align: left;
        }

        .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            color: white;
        }

        .otp-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
        }

        .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
        }

        .otp-expiry {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 10px;
        }

        .cta-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
            transition: transform 0.2s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        .footer {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 30px;
            text-align: center;
        }

        .social-icons {
            margin: 20px 0;
        }

        .social-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #34495e;
            border-radius: 50%;
            margin: 0 8px;
            text-decoration: none;
            color: white;
            line-height: 40px;
            transition: background 0.3s;
        }

        .social-icon:hover {
            background: #667eea;
        }

        .footer-text {
            font-size: 12px;
            opacity: 0.8;
            margin: 10px 0;
        }

        .expiry-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 12px;
            }

            .header {
                padding: 30px 20px;
            }

            .content {
                padding: 30px 20px;
            }

            .otp-code {
                font-size: 28px;
                letter-spacing: 6px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header with decorative elements -->
        <div class="header">
            <div class="decorative-elements">
                <div class="dot dot-1"></div>
                <div class="dot dot-2"></div>
                <div class="dot dot-3"></div>
                <div class="dot dot-4"></div>
                <div class="dot dot-5"></div>
                <div class="dot dot-6"></div>
                <div class="cross cross-1">×</div>
                <div class="cross cross-2">×</div>
                <div class="cross cross-3">×</div>
                <div class="circle circle-1"></div>
                <div class="circle circle-2"></div>
            </div>

            <div class="logo">
                <h1><span class="zoom">Zoom</span><span class="connect">Connect</span></h1>
            </div>

            <div class="bell-icon">
                <svg class="bell-svg" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
            </div>
        </div>

        <!-- Main content -->
        <div class="content">
            <h2 class="title">Verification Code</h2>
            <p class="subtitle">Login verification required.</p>

            <div class="service-notice">
                <p><strong>Login Verification:</strong></p>
                <p>We received a request to login to your ZoomConnect account. Please use the verification code below to complete your login. If you didn't request this login, please ignore this email.</p>
            </div>

            <div class="otp-container">
                <div class="otp-label">Your verification code is:</div>
                <div class="otp-code">{{ $otp }}</div>
                <div class="otp-expiry">This code will expire in 10 minutes</div>
            </div>
            <div class="expiry-notice">
                <strong>Expires:</strong> {{ date('d/m/Y', strtotime('+10 minutes')) }}
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">&copy; 2025 ZoomConnect. All rights reserved.</p>
            <p class="footer-text">This email was sent to {{ $email ?? 'your email' }}. If you didn't request this, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
