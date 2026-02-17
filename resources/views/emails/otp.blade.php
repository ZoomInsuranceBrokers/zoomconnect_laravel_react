<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        /* Import Google Font for a modern look */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7f6;
            font-family: 'Poppins', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        @media only screen and (max-width: 620px) {
            .wrapper { width: 100% !important; border-radius: 0 !important; }
            .otp-box { font-size: 36px !important; letter-spacing: 8px !important; }
            .content-area { padding: 25px 20px !important; }
            .footer-area { padding: 25px 15px !important; }
        }
    </style>
</head>

<body style="margin:0; padding:0; background:#f4f7f6; font-family:'Poppins', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 0; background-color:#f4f7f6;">
<tr><td align="center">

<table class="wrapper" width="600" cellpadding="0" cellspacing="0" border="0"
       style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden;
              box-shadow:0 10px 30px rgba(147,71,144,0.08);">

    <tr>
        <td align="center" style="padding:40px 20px 20px; background-color:#ffffff;">
            <img src="https://portal.zoomconnect.co.in/assets/logo/ZoomConnect-logo.png"
                 alt="ZoomConnect" style="height:50px; display:block; border:0;">
        </td>
    </tr>

    <tr>
        <td class="content-area" align="center" valign="top" style="padding:10px 40px 40px; background-color:#ffffff;">
            
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px; max-width: 400px;">
                <tr>
                    <td align="center" bgcolor="#934790" 
                        style="background-color: #934790; 
                               background-image: linear-gradient(135deg, #934790 0%, #4b0e55 100%); 
                               border-radius: 16px; 
                               padding: 35px 20px; 
                               color: #ffffff; 
                               box-shadow: 0 8px 20px rgba(147,71,144,0.25);">
                        
                        <p style="margin:0 0 12px; font-size:14px; font-weight:500; text-transform:uppercase; letter-spacing:1px; color:#e0cde6; font-family:'Poppins', Arial, sans-serif;">
                            Your Verification Code
                        </p>
                        
                        <div class="otp-box" style="font-size:46px; font-weight:700; letter-spacing:12px; 
                                                    font-family:'Courier New', monospace; margin:0; 
                                                    color: #ffffff;">
                            {{ $otp }}
                        </div>
                        
                        <p style="margin:12px 0 0; font-size:13px; color:#e0cde6; font-family:'Poppins', Arial, sans-serif;">
                            Expires in <strong style="color:#ffffff;">10 minutes</strong>
                        </p>
                    </td>
                </tr>
            </table>

            <div style="text-align:center;">
                <h2 style="margin:0 0 12px; color:#18031d; font-size:22px; font-weight:600; font-family:'Poppins', Arial, sans-serif;">Secure Your Account</h2>
                <p style="margin:0 0 25px; color:#675e6d; font-size:15px; line-height:1.7; font-family:'Poppins', Arial, sans-serif;">
                    A login request has been initiated for your ZoomConnect account. To proceed and keep your account secure, please use the verification code provided above.
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="background-color:#fff5f5; border-left:4px solid #e53e3e; padding:12px 16px; 
                                   border-radius:0 8px 8px 0; font-size:13px; color:#c53030; text-align:left; font-family:'Poppins', Arial, sans-serif;">
                            <strong>Didn't request this?</strong> If you didn't attempt to log in, someone else might be trying to access your account. Please ignore this email or contact support.
                        </td>
                    </tr>
                </table>
            </div>

        </td>
    </tr>

    <tr>
        <td class="footer-area" align="center" style="background-color:#18031d; padding:35px 40px;">
            
            <p style="margin:0 0 8px; font-size:14px; color:#ffffff; font-weight:500; font-family:'Poppins', Arial, sans-serif;">
                © {{ date('Y') }} ZoomConnect • Secure Communication
            </p>
            <p style="margin:0 0 20px; font-size:13px; color:#bca9c5; font-family:'Poppins', Arial, sans-serif;">
                This message was sent to <span style="color:#ffffff;">{{ $email ?? 'your email address' }}</span>
            </p>

            <div style="height:1px; background-color:#3a2240; margin:0 0 20px; font-size:1px; line-height:1px;">&nbsp;</div>

            <p style="margin:0 0 10px; font-size:11px; color:#897b93; line-height:1.6; text-align:center; font-family:'Poppins', Arial, sans-serif;">
                <strong>Registered & Corporate Office:</strong> D-104, Udyog Vihar Phase V, Sector-19, Gurugram, Haryana-122016<br>
                <strong>CIN:</strong> U66000HR2008PTC065899 | <strong>IRDAI Licence No.:</strong> 389<br>
                <strong>Licence Category:</strong> Composite | <strong>Licence Expiry:</strong> 1st January 2027
            </p>
            <p style="margin:0; font-size:10px; color:#6a5e73; line-height:1.5; text-align:center; font-style:italic; font-family:'Poppins', Arial, sans-serif;">
                Insurance is a subject matter of solicitation. Kindly read all policy related documents and take expert advice before taking any insurance or investment decisions.
            </p>

        </td>
    </tr>

</table>

</td></tr>
</table>

</body>
</html>