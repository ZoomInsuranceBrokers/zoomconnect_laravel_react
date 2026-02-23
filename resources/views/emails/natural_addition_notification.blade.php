<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Natural Addition Request</title>
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
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
        }
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-approved {
            background-color: #d4edda;
            color: #155724;
        }
        .status-rejected {
            background-color: #f8d7da;
            color: #721c24;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 2px solid #934790;
        }
        .highlight {
            background-color: #e7f3ff;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #934790;
        }
        .member-card {
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #934790;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">Natural Addition Request</h1>
        <p style="margin: 5px 0 0 0;">{{ ucfirst($action) }}</p>
    </div>

    <div class="content">
        <div class="highlight">
            <p style="margin: 0;">
                <strong>Employee {{ $employee->employee_name }}</strong> has {{ $action }} a natural addition request for adding a new member to their policy.
            </p>
        </div>

        <div class="section">
            <div class="section-title">Employee Information</div>
            <div class="info-row">
                <span class="info-label">Employee Name:</span>
                <span class="info-value">{{ $employee->employee_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Employee Code:</span>
                <span class="info-value">{{ $employee->employee_code }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ $employee->email }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Company:</span>
                <span class="info-value">{{ $company->company_name }}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Policy Information</div>
            <div class="info-row">
                <span class="info-label">Policy Name:</span>
                <span class="info-value">{{ $policy->policy_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Policy Number:</span>
                <span class="info-value">{{ $policy->policy_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Policy Type:</span>
                <span class="info-value">{{ strtoupper($policy->policy_type) }}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">New Member Details</div>
            <div class="member-card">
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">{{ $naturalAddition->insured_name }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Relation:</span>
                    <span class="info-value">{{ ucfirst($naturalAddition->relation) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Gender:</span>
                    <span class="info-value">{{ ucfirst($naturalAddition->gender) }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date of Birth:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($naturalAddition->dob)->format('d M Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date of Event:</span>
                    <span class="info-value">{{ \Carbon\Carbon::parse($naturalAddition->date_of_event)->format('d M Y') }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                        <span class="status-badge status-{{ strtolower($naturalAddition->status) }}">
                            {{ ucfirst($naturalAddition->status) }}
                        </span>
                    </span>
                </div>
                @if($naturalAddition->document)
                <div class="info-row">
                    <span class="info-label">Document:</span>
                    <span class="info-value">Attached</span>
                </div>
                @endif
            </div>
        </div>

        @if($naturalAddition->status === 'rejected' && $naturalAddition->reason)
        <div class="section">
            <div class="section-title">Rejection Reason</div>
            <div class="highlight" style="background-color: #f8d7da; border-left-color: #721c24;">
                <p style="margin: 0; color: #721c24;">{{ $naturalAddition->reason }}</p>
            </div>
        </div>
        @endif

        <div class="section">
            <p style="color: #666; font-size: 14px;">
                Please review this request in the admin portal and take appropriate action.
            </p>
        </div>
    </div>

    <div class="footer">
        <p>This is an automated notification from ZoomConnect Health Insurance Portal.</p>
        <p style="color: #999; font-size: 12px;">Please do not reply to this email.</p>
    </div>
</body>
</html>
