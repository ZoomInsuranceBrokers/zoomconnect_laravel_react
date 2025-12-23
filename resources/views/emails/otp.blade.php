<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
        @media only screen and (max-width: 620px) {
            .wrapper { width: 100% !important; }
            .otp-box { font-size: 32px !important; letter-spacing: 8px !important; }
        }
    </style>
</head>

<body style="margin:0; padding:0; background:#f5f3fa; font-family:'Poppins', Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
<tr><td align="center">

<!-- MAIN WRAPPER -->
<table class="wrapper" width="600" cellpadding="0" cellspacing="0"
       style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden;
              box-shadow:0 10px 25px rgba(0,0,0,0.08);">

    <!-- HEADER WITH GRADIENT -->
    <tr>
        <td align="center" style="
            padding:45px 20px;
            background-size:cover; background-repeat:no-repeat;
            color:#ffffff;
        ">

            <img src="https://portal.zoomconnect.co.in/assets/logo/ZoomConnect-logo.png"
                 alt="ZoomConnect" style="height:58px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">

        
        </td>
    </tr>

    <!-- MAIN CONTENT -->
    <tr>
        <td align="center" valign="top" style="padding:30px;">
            <div style="max-width:520px; width:100%; margin:0 auto; text-align:left;">

            <!-- GLASS CARD -->
            <div style="padding:20px 25px; border-radius:16px; background:rgba(147,71,144,0.05); border:1px solid rgba(147,71,144,0.12); backdrop-filter:blur(8px); margin-bottom:25px; text-align:left;">
                <h3 style="margin:0; color:#4b0e55; font-size:18px;">One-Time Verification Code</h3>
                <p style="margin:8px 0 0; color:#675e6d; font-size:14px; line-height:1.6;">We are verifying your identity to keep your ZoomConnect account secure.</p>

                <h3 style="margin:12px 0 0; color:#4b0e55; font-size:18px;">Action Needed</h3>
                <p style="margin:8px 0 0; color:#675e6d; font-size:14px; line-height:1.6;">A login request has been initiated. To proceed, use the verification code below.</p>
            </div>

            <!-- SIMPLE OTP BOX (CLEAN WHITE TEXT, NO GRADIENT) -->
            <div style="
                margin:20px auto 25px;
                display:inline-block;
                padding:28px 40px;
                border-radius:18px;
                border:2px dashed #934790;
                background:#ffffff;
                color:#934790;
            ">

                <div style="font-size:14px; opacity:0.8; margin-bottom:8px;">
                    Your OTP
                </div>

                <div class="otp-box"
                     style="font-size:44px; font-weight:800;
                            letter-spacing:12px;
                            font-family:'Courier New', monospace;
                            color:#934790; margin:8px 0;">
                    {{ $otp }}
                </div>

                <div style="font-size:13px; color:#6b5570; margin-top:8px;">
                    Expires in <strong>10 minutes</strong>
                </div>
            </div>

            <!-- FOOTER WARNING -->
            <div style="
                margin-top:10px;
                background:#fff6f0;
                border:1px solid #ffd7c1;
                padding:10px 16px;
                border-radius:10px;
                display:inline-block;
                font-size:12px;
                color:#b04c0d;
            ">
                If this wasn't you, simply ignore this message.
            </div>

            </div>
        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td align="center" style="background:#18031d; padding:22px;">
            <p style="margin:0; font-size:12px; color:#bca9c5;">
                © {{ date('Y') }} ZoomConnect • Secure Communication
            </p>
            <p style="margin:5px 0 0; font-size:12px; color:#897b93;">
                Sent to {{ $email ?? 'your email address' }}
            </p>
        </td>
    </tr>

</table>

</td></tr>
</table>

</body>
</html>
