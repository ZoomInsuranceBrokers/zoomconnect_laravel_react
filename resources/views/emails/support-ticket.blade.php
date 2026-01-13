<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Support Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4A90E2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .ticket-info {
            background-color: white;
            padding: 15px;
            border-left: 4px solid #4A90E2;
            margin: 15px 0;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        .message-box {
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>🎫 New Support Ticket Received</h2>
    </div>
    
    <div class="content">
        <p>Hello Support Team,</p>
        <p>A new support ticket has been created by a user who needs assistance. Please review the details below:</p>
        
        <div class="ticket-info">
            <p><span class="label">Ticket ID:</span> {{ $ticketId }}</p>
            <p><span class="label">User Name:</span> {{ $userName }}</p>
            <p><span class="label">User Email:</span> {{ $userEmail }}</p>
            @if($companyName)
                <p><span class="label">Company:</span> {{ $companyName }}</p>
            @endif
            @if($employeeId)
                <p><span class="label">Employee ID:</span> {{ $employeeId }}</p>
            @endif
            <p><span class="label">Date & Time:</span> {{ now()->format('d M Y, h:i A') }}</p>
        </div>
        
        <div class="message-box">
            <p class="label">User Message:</p>
            <p>{{ $userMessage }}</p>
        </div>
        
        <p><strong>Action Required:</strong> Please review this ticket and respond to the user at the earliest.</p>
    </div>
    
    <div class="footer">
        <p>This is an automated email from ZoomConnect Support System.</p>
        <p>&copy; {{ date('Y') }} ZoomConnect. All rights reserved.</p>
    </div>
</body>
</html>
