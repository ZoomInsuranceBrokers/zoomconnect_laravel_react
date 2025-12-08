<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <!-- Inline styles will be applied directly on elements for email client compatibility -->
</head>
</body>
    <body style="font-family: 'Poppins', Arial, Helvetica, sans-serif; background-color:#f8f9fa; padding:20px; -webkit-text-size-adjust:100%;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa; width:100%;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); text-align:center; padding:32px 20px;">
                            <img src="{{ asset('assets/logo/ZoomConnect-logo.png') }}" alt="ZoomConnect" style="height:48px; max-width:220px; display:inline-block;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 28px; text-align:center; color:#2c3e50;">
                            <h2 style="font-size:22px; font-weight:700; margin:0 0 8px;">Verification Code</h2>
                            <p style="margin:0 0 18px; color:#7f8c8d; font-size:15px;">Login verification required.</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 22px;">
                                <tr>
                                    <td style="background:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:16px; text-align:left; font-size:14px; color:#2c3e50;">
                                        <strong>Login Verification:</strong>
                                        <p style="margin:8px 0 0;">We received a request to login to your ZoomConnect account. Please use the verification code below to complete your login. If you didn't request this login, please ignore this email.</p>
                                    </td>
                                </tr>
                            </table>

                            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:12px; padding:22px; color:#ffffff; display:inline-block; min-width:260px;">
                                <div style="font-size:13px; opacity:0.95; margin-bottom:8px;">Your verification code is:</div>
                                <div style="font-size:34px; font-weight:700; letter-spacing:6px; font-family: 'Courier New', Courier, monospace; margin:6px 0;">{{ $otp }}</div>
                                <div style="font-size:13px; opacity:0.9; margin-top:8px;">This code will expire in 10 minutes</div>
                            </div>

                            <div style="background:#fff3cd; border:1px solid #ffeaa7; border-radius:8px; padding:12px; margin:20px auto 0; display:inline-block; color:#856404; font-size:13px;">
                                <strong>Expires:</strong> {{ date('d/m/Y H:i', strtotime('+10 minutes')) }}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#2c3e50; color:#ecf0f1; text-align:center; padding:20px;">
                            <p style="font-size:12px; margin:0 0 6px;">&copy; {{ date('Y') }} ZoomConnect. All rights reserved.</p>
                            <p style="font-size:12px; margin:0;">This email was sent to {{ $email ?? 'your email' }}. If you didn't request this, please ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
