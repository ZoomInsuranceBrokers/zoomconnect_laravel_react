<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Confirmation</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f0f0f0;
        }

        .wrapper {
            max-width: 620px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #934790, #6b2d6b);
            color: #ffffff;
            padding: 30px 24px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 6px;
        }

        .header p {
            font-size: 14px;
            opacity: 0.9;
        }

        /* Body */
        .body {
            padding: 24px;
        }

        .greeting {
            font-size: 15px;
            color: #333;
            margin-bottom: 16px;
        }

        /* Section card */
        .section {
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
        }

        .section-header {
            background-color: #f3e8f8;
            padding: 10px 14px;
            font-size: 14px;
            font-weight: bold;
            color: #6b2d6b;
            border-bottom: 1px solid #e5e7eb;
        }

        .section-body {
            padding: 14px;
        }

        /* Info rows */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 7px 8px;
            font-size: 13px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
        }

        .info-table tr:last-child td {
            border-bottom: none;
        }

        .info-table .lbl {
            color: #6b7280;
            width: 45%;
            font-weight: bold;
        }

        .info-table .val {
            color: #111827;
        }

        /* Members */
        .member-card {
            background: #faf5ff;
            border-left: 3px solid #934790;
            border-radius: 4px;
            padding: 10px 12px;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .member-card:last-child {
            margin-bottom: 0;
        }

        .member-name {
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
        }

        .member-meta {
            color: #6b7280;
        }

        .badge {
            display: inline-block;
            background: #934790;
            color: #fff;
            font-size: 10px;
            padding: 1px 6px;
            border-radius: 10px;
            margin-left: 6px;
            vertical-align: middle;
        }

        /* Premium table */
        .premium-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .premium-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #f0f0f0;
        }

        .premium-table tr:last-child td {
            border-bottom: none;
        }

        .premium-table .plbl {
            color: #374151;
        }

        .premium-table .pval {
            text-align: right;
            font-weight: 600;
            color: #111827;
            white-space: nowrap;
        }

        .premium-table .pval-green {
            color: #16a34a;
        }

        .premium-table .pval-purple {
            color: #7c3aed;
        }

        .divider-row td {
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
        }

        .total-row td {
            font-size: 15px;
            font-weight: bold;
            color: #111827;
            padding-top: 10px;
        }

        .total-row .pval {
            font-size: 18px;
            color: #934790;
        }

        /* Pro-rata notice */
        .prorate-notice {
            background: #fefce8;
            border: 1px solid #fde047;
            border-radius: 4px;
            padding: 10px 12px;
            margin-bottom: 12px;
            font-size: 12px;
            color: #92400e;
        }

        /* Important notes */
        .notes-list {
            padding-left: 18px;
            color: #6b7280;
            font-size: 13px;
        }

        .notes-list li {
            margin-bottom: 6px;
        }

        /* Footer */
        .footer {
            background: #4a3f5c;
            padding: 28px 24px;
            text-align: center;
            font-size: 12px;
            color: #c9bfdb;
        }

        .footer strong {
            color: #ffffff;
        }

        .footer a {
            color: #e0c8f0;
        }

        .footer .footer-divider {
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            margin: 14px 0;
        }

        .footer .footer-legal {
            font-size: 11px;
            color: #a89fc0;
            font-style: italic;
            line-height: 1.6;
            margin-top: 10px;
        }

        /* Responsive */
        @media screen and (max-width: 480px) {
            .body {
                padding: 14px;
            }

            .header {
                padding: 20px 14px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">

        <!-- Logo Bar -->
        <div style="background:#ffffff; text-align:center; padding:18px 24px; border-bottom:1px solid #e5e7eb;">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('assets/logo/zoom_connect_logo.png'))) }}" alt="ZoomConnect"
                style="max-height:50px; width:auto; display:inline-block;">
        </div>

        <!-- Header -->
        <div class="header">
            <h1>Enrollment Confirmed!</h1>
            <p>Your health insurance enrollment has been successfully submitted.</p>
        </div>

        <div class="body">

            <p class="greeting">
                Dear <strong>{{ $employeeName }}</strong>
                @if ($employeeCode)
                    ({{ $employeeCode }})
                @endif,<br>
                <span style="font-size:13px; color:#6b7280;">
                    Thank you for completing your enrollment. Below is a summary of your submission for your records.
                </span>
            </p>

            <!-- Policy Information -->
            @if ($policyName || $policyStartDate || $policyEndDate || $portalName)
                <div class="section">
                    <div class="section-header">&#128196; Policy Information</div>
                    <div class="section-body">
                        <table class="info-table">
                            @if ($policyName)
                                <tr>
                                    <td class="lbl">Policy Name</td>
                                    <td class="val">{{ $policyName }}</td>
                                </tr>
                            @endif
                            @if ($policyStartDate && $policyEndDate)
                                <tr>
                                    <td class="lbl">Policy Period</td>
                                    <td class="val">
                                        {{ \Carbon\Carbon::parse($policyStartDate)->format('d M Y') }}
                                        &ndash;
                                        {{ \Carbon\Carbon::parse($policyEndDate)->format('d M Y') }}
                                    </td>
                                </tr>
                            @endif
                            @if ($portalName)
                                <tr>
                                    <td class="lbl">Enrollment Portal</td>
                                    <td class="val">{{ $portalName }}</td>
                                </tr>
                            @endif
                            <tr>
                                <td class="lbl">Employee</td>
                                <td class="val">{{ $employeeName }}@if ($employeeCode)
                                        &mdash; {{ $employeeCode }}
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td class="lbl">Total Members Enrolled</td>
                                <td class="val">{{ $totalMembers }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            @endif

            <!-- Selected Plans -->
            @php
                $basePlanName = $selectedPlans['selectedPlanName'] ?? null;
                $sumInsured = $selectedPlans['baseSumInsured'] ?? ($selectedPlans['sumInsured'] ?? null);
                $extraNames = $selectedPlans['extraCoverageSelectedNames'] ?? null;
            @endphp
            @if ($basePlanName || $extraCoverage || ($extraNames && count((array) $extraNames)))
                <div class="section">
                    <div class="section-header">&#127959; Selected Plans</div>
                    <div class="section-body">
                        <table class="info-table">
                            @if ($basePlanName)
                                <tr>
                                    <td class="lbl">Base Plan</td>
                                    <td class="val">{{ $basePlanName }}
                                        @if ($sumInsured)
                                            <span style="color:#6b7280;"> &mdash; Sum Insured:
                                                &#8377;{{ number_format($sumInsured) }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @endif
                            @if ($extraCoverage && is_array($extraCoverage))
                                <tr>
                                    <td class="lbl">Extra Coverage</td>
                                    <td class="val">
                                        {{ $extraCoverage['plan_name'] ?? 'Extra Coverage' }}
                                        @if (!empty($extraCoverage['sum_insured']))
                                            <span style="color:#6b7280;"> &mdash;
                                                &#8377;{{ number_format($extraCoverage['sum_insured']) }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @elseif($extraNames && is_array($extraNames) && count($extraNames))
                                <tr>
                                    <td class="lbl">Extra Coverage</td>
                                    <td class="val">{{ implode(', ', $extraNames) }}</td>
                                </tr>
                            @endif
                        </table>
                    </div>
                </div>
            @endif

            <!-- Enrolled Members -->
            <div class="section">
                <div class="section-header">&#128101; Enrolled Members ({{ $totalMembers }})</div>
                <div class="section-body">
                    @foreach ($dependents as $dep)
                        @php
                            $name = $dep['insured_name'] ?? ($dep['name'] ?? 'N/A');
                            $relation = ucfirst($dep['detailed_relation'] ?? ($dep['relation'] ?? ''));
                            $gender = ucfirst($dep['gender'] ?? '');
                            $dob = !empty($dep['dob']) ? date('d M Y', strtotime($dep['dob'])) : null;
                            $isSelf = strtolower($dep['relation'] ?? '') === 'self';
                        @endphp
                        <div class="member-card">
                            <div class="member-name">
                                {{ $name }}
                                @if ($isSelf)
                                    <span class="badge">Employee</span>
                                @endif
                            </div>
                            <div class="member-meta">
                                {{ $relation }}
                                @if ($gender)
                                    &bull; {{ $gender }}
                                @endif
                                @if ($dob)
                                    &bull; DOB: {{ $dob }}
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Premium Breakdown -->
            <div class="section">
                <div class="section-header">&#128200; Premium Breakdown</div>
                <div class="section-body">

                    @if ($prorationFactor < 1)
                        <div class="prorate-notice">
                            <strong>&#9432; Pro-rata Applied (Mid-year Joining)</strong><br>
                            Premium calculated for {{ $remainingDays }} days out of {{ $totalPolicyDays }} days
                            ({{ round($prorationFactor * 100) }}% of annual premium).
                        </div>
                    @endif

                    <table class="premium-table">
                        <tr>
                            <td class="plbl">Base Plan Premium{{ $prorationFactor < 1 ? ' (Pro-rated)' : '' }}</td>
                            <td class="pval">&#8377;{{ number_format($basePremium, 2) }}</td>
                        </tr>
                        @if ($topupPremium > 0)
                            <tr>
                                <td class="plbl">Top-up Plan Premium</td>
                                <td class="pval">&#8377;{{ number_format($topupPremium, 2) }}</td>
                            </tr>
                        @endif
                        @if ($extraCoveragePremium > 0)
                            <tr>
                                <td class="plbl">Extra Coverage
                                    Premium{{ $prorationFactor < 1 ? ' (Pro-rated)' : '' }}</td>
                                <td class="pval">&#8377;{{ number_format($extraCoveragePremium, 2) }}</td>
                            </tr>
                        @endif
                        <tr class="divider-row">
                            <td class="plbl" style="color:#6b7280;">Subtotal (Before GST)</td>
                            <td class="pval" style="color:#6b7280;">
                                &#8377;{{ number_format($basePremium + $topupPremium + $extraCoveragePremium, 2) }}
                            </td>
                        </tr>
                        <tr>
                            <td class="plbl">GST (18%)</td>
                            <td class="pval">&#8377;{{ number_format($gst, 2) }}</td>
                        </tr>
                        <tr class="divider-row">
                            <td class="plbl" style="font-weight:bold;">Total (with GST)</td>
                            <td class="pval">&#8377;{{ number_format($grossPlusGst, 2) }}</td>
                        </tr>
                        @if ($companyContribution > 0)
                            <tr>
                                <td class="plbl">
                                    Company Contribution
                                    @if ($companyContributionPercentage > 0)
                                        ({{ $companyContributionPercentage }}%)
                                    @endif
                                </td>
                                <td class="pval pval-green">&minus;&#8377;{{ number_format($companyContribution, 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($isWallet && $walletDeduction > 0)
                            <tr>
                                <td class="plbl">Wallet Deduction</td>
                                <td class="pval pval-purple">&minus;&#8377;{{ number_format($walletDeduction, 2) }}
                                </td>
                            </tr>
                        @endif
                        <tr class="total-row divider-row">
                            <td class="plbl">Employee Annual Payable</td>
                            <td class="pval">&#8377;{{ number_format(max(0, $totalPremium - $walletDeduction), 2) }}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        </div><!-- /.body -->

        <!-- QR Banner -->
        <div style="background:#4a4a5a; margin:0; padding:16px 20px; border-radius:10px; display:block;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="100" style="vertical-align:middle; padding-right:16px;">
                        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('assets/images/zoomConnectQR.png'))) }}" alt="ZoomConnect QR Code"
                            width="90" height="90" style="display:block; border-radius:6px;">
                    </td>
                    <td style="vertical-align:middle;">
                        <p
                            style="margin:0 0 4px 0; font-size:14px; font-weight:bold; font-style:italic; color:#ffffff; line-height:1.4;">
                            Scan the QR code to download the ZoomConnect Mobile App.
                        </p>
                        <p style="margin:0; font-size:12px; font-style:italic; color:#c9bfdb;">
                            One Platform, Total Wellbeing
                        </p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p style="font-size:14px; color:#ffffff; font-weight:bold;">
                &copy; {{ date('Y') }} ZoomConnect &bull; Secure Communication
            </p>
            <p style="margin-top:6px; color:#c9bfdb;">
                This message was sent to
                <a href="mailto:{{ $employeeEmail }}" style="color:#e0c8f0;">{{ $employeeEmail }}</a>
            </p>

            <hr class="footer-divider">

            <p style="color:#c9bfdb; line-height:1.8;">
                <strong>Registered &amp; Corporate Office:</strong>
                D-104, Udyog Vihar Phase V, Sector-19, Gurugram, Haryana-122016<br>
                <strong>CIN:</strong> U66000HR2008PTC065899 &nbsp;|&nbsp;
                <strong>IRDAI Licence No.:</strong> 389<br>
                <strong>Licence Category:</strong> Composite &nbsp;|&nbsp;
                <strong>Licence Expiry:</strong> 1st January 2027
            </p>

            <p class="footer-legal">
                Insurance is a subject matter of solicitation. Kindly read all policy related documents
                and take expert advice before taking any insurance or investment decisions.
            </p>
        </div>

    </div><!-- /.wrapper -->
</body>

</html>
