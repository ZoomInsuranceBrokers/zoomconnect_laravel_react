<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Confirmation</title>
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
            background-color: #934790;
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
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            color: #934790;
            margin-bottom: 10px;
            font-size: 18px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-label {
            font-weight: bold;
            color: #666;
        }
        .info-value {
            color: #333;
        }
        .dependent-card {
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #934790;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 2px solid #934790;
        }
        .amount {
            font-size: 24px;
            color: #934790;
            font-weight: bold;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Enrollment Confirmation</h1>
        <p>Your health insurance enrollment has been successfully submitted!</p>
    </div>
    
    <div class="content">
        <div class="section">
            <p>Dear <strong>{{ $employeeName }}</strong>,</p>
            <p>Thank you for completing your health insurance enrollment. Your enrollment details have been successfully recorded.</p>
        </div>

        <div class="section">
            <div class="section-title">📋 Premium Summary</div>
            <div class="info-row">
                <span class="info-label">Base Plan Premium:</span>
                <span class="info-value">₹{{ number_format($basePremium, 2) }}</span>
            </div>
            @if($extraCoveragePremium > 0)
            <div class="info-row">
                <span class="info-label">Extra Coverage Premium:</span>
                <span class="info-value">₹{{ number_format($extraCoveragePremium, 2) }}</span>
            </div>
            @endif
            @if($companyContribution > 0)
            <div class="info-row">
                <span class="info-label">Company Contribution:</span>
                <span class="info-value" style="color: #16a34a;">-₹{{ number_format($companyContribution, 2) }}</span>
            </div>
            @endif
        </div>

        @if($totalPremium > 0)
        <div class="highlight">
            <div style="text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #666;">Your Total Annual Payable</p>
                <div class="amount">₹{{ number_format($totalPremium, 2) }}</div>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">This amount will be deducted from your salary</p>
            </div>
        </div>
        @endif

        <div class="section">
            <div class="section-title">👥 Enrolled Members ({{ $totalMembers }})</div>
            @foreach($dependents as $dependent)
            <div class="dependent-card">
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{{ $dependent['name'] ?? $dependent['insured_name'] ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Relation:</span>
                    <span class="info-value">{{ ucfirst($dependent['detailed_relation'] ?? $dependent['relation']) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Gender:</span>
                    <span class="info-value">{{ $dependent['gender'] }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date of Birth:</span>
                    <span class="info-value">{{ date('d-M-Y', strtotime($dependent['dob'])) }}</span>
                </div>
            </div>
            @endforeach
        </div>

        <div class="section">
            <div class="section-title">📌 Important Notes</div>
            <ul style="color: #666; font-size: 14px;">
                <li>Please keep this email for your records</li>
                <li>Your enrollment will be processed by the HR department</li>
                <li>Policy documents will be shared separately once available</li>
                <li>For any queries, please contact your HR department</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p><strong>This is an automated email. Please do not reply to this message.</strong></p>
        <p>© {{ date('Y') }} ZoomConnect. All rights reserved.</p>
    </div>
</body>
</html>
