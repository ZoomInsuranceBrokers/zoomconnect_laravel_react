<?php

namespace App\Services;

class ChatbotFlowService
{
    /**
     * Get the complete chatbot conversation flow
     */
    public static function getChatbotFlow(): array
    {
        return [
            // ==================== LEVEL 1: Main Menu ====================
            'start' => [
                'message' => '👋 Hello! I\'m here to help you with your insurance needs. What would you like assistance with today?',
                'options' => [
                    ['id' => 'policy_details', 'label' => '📋 My Policy Details', 'next' => 'policy_menu'],
                    ['id' => 'claims', 'label' => '💰 Claims & Reimbursement', 'next' => 'claims_menu'],
                    ['id' => 'ecard', 'label' => '🎴 E-Card Services', 'next' => 'ecard_menu'],
                    ['id' => 'network', 'label' => '🏥 Network Hospitals', 'next' => 'network_menu'],
                    ['id' => 'wellness', 'label' => '💪 Wellness Services', 'next' => 'wellness_menu'],
                    ['id' => 'enrollment', 'label' => '📝 Enrollment & Registration', 'next' => 'enrollment_menu'],
                ],
            ],

            // ==================== LEVEL 2: Policy Details Menu ====================
            'policy_menu' => [
                'message' => 'What information do you need about your policy?',
                'options' => [
                    ['id' => 'coverage', 'label' => 'Coverage Details', 'next' => 'coverage_submenu'],
                    ['id' => 'members', 'label' => 'Family Members & Dependants', 'next' => 'members_submenu'],
                    ['id' => 'policy_docs', 'label' => 'Policy Documents', 'next' => 'policy_docs_submenu'],
                    ['id' => 'policy_dates', 'label' => 'Policy Period & Renewal', 'next' => 'policy_dates_submenu'],
                    ['id' => 'premium', 'label' => 'Premium & Payment', 'next' => 'premium_submenu'],
                ],
            ],

            // ==================== LEVEL 3: Coverage Sub-menu ====================
            'coverage_submenu' => [
                'message' => 'Which coverage information would you like to know?',
                'options' => [
                    ['id' => 'basic_coverage', 'label' => 'Basic Coverage', 'next' => 'basic_coverage_info'],
                    ['id' => 'room_rent', 'label' => 'Room Rent Limits', 'next' => 'room_rent_info'],
                    ['id' => 'pre_post_hosp', 'label' => 'Pre & Post Hospitalization', 'next' => 'pre_post_hosp_info'],
                    ['id' => 'daycare', 'label' => 'Daycare Procedures', 'next' => 'daycare_info'],
                    ['id' => 'exclusions', 'label' => 'What\'s NOT Covered', 'next' => 'exclusions_info'],
                ],
            ],

            // ==================== LEVEL 3: Members Sub-menu ====================
            'members_submenu' => [
                'message' => 'What would you like to do with family members?',
                'options' => [
                    ['id' => 'view_members', 'label' => 'View All Members', 'next' => 'view_members_info'],
                    ['id' => 'add_dependant', 'label' => 'Add Dependant', 'next' => 'add_dependant_submenu'],
                    ['id' => 'remove_dependant', 'label' => 'Remove Dependant', 'next' => 'remove_dependant_info'],
                    ['id' => 'update_member', 'label' => 'Update Member Details', 'next' => 'update_member_info'],
                ],
            ],

            // ==================== LEVEL 4: Add Dependant Sub-menu ====================
            'add_dependant_submenu' => [
                'message' => 'Who would you like to add to your policy?',
                'options' => [
                    ['id' => 'add_spouse', 'label' => 'Add Spouse', 'next' => 'add_spouse_info'],
                    ['id' => 'add_child', 'label' => 'Add Child', 'next' => 'add_child_info'],
                    ['id' => 'add_parent', 'label' => 'Add Parent', 'next' => 'add_parent_info'],
                ],
            ],

            // ==================== LEVEL 3: Policy Documents Sub-menu ====================
            'policy_docs_submenu' => [
                'message' => 'Which document do you need?',
                'options' => [
                    ['id' => 'policy_copy', 'label' => 'Download Policy Copy', 'next' => 'policy_copy_info'],
                    ['id' => 'policy_schedule', 'label' => 'Policy Schedule', 'next' => 'policy_schedule_info'],
                    ['id' => 'endorsement', 'label' => 'Endorsement Letter', 'next' => 'endorsement_info'],
                ],
            ],

            // ==================== LEVEL 3: Policy Dates Sub-menu ====================
            'policy_dates_submenu' => [
                'message' => 'What date information do you need?',
                'options' => [
                    ['id' => 'start_date', 'label' => 'Policy Start Date', 'next' => 'start_date_info'],
                    ['id' => 'end_date', 'label' => 'Policy Expiry Date', 'next' => 'end_date_info'],
                    ['id' => 'renewal_date', 'label' => 'Renewal Date', 'next' => 'renewal_date_info'],
                ],
            ],

            // ==================== LEVEL 3: Premium Sub-menu ====================
            'premium_submenu' => [
                'message' => 'What would you like to know about premium?',
                'options' => [
                    ['id' => 'view_premium', 'label' => 'View Premium Amount', 'next' => 'view_premium_info'],
                    ['id' => 'payment_history', 'label' => 'Payment History', 'next' => 'payment_history_info'],
                    ['id' => 'payment_methods', 'label' => 'Payment Methods', 'next' => 'payment_methods_info'],
                ],
            ],

            // ==================== LEVEL 2: Claims Menu ====================
            'claims_menu' => [
                'message' => 'How can I help you with claims?',
                'options' => [
                    ['id' => 'file_claim', 'label' => 'File a New Claim', 'next' => 'file_claim_submenu'],
                    ['id' => 'track_claim', 'label' => 'Track Claim Status', 'next' => 'track_claim_submenu'],
                    ['id' => 'claim_rejected', 'label' => 'Claim Rejected/Queries', 'next' => 'claim_rejected_submenu'],
                    ['id' => 'reimbursement', 'label' => 'Reimbursement Process', 'next' => 'reimbursement_submenu'],
                ],
            ],

            // ==================== LEVEL 3: File Claim Sub-menu ====================
            'file_claim_submenu' => [
                'message' => 'What type of claim would you like to file?',
                'options' => [
                    ['id' => 'cashless_claim', 'label' => 'Cashless Hospitalization', 'next' => 'cashless_claim_info'],
                    ['id' => 'reimbursement_claim', 'label' => 'Reimbursement Claim', 'next' => 'reimbursement_claim_info'],
                    ['id' => 'daycare_claim', 'label' => 'Daycare Claim', 'next' => 'daycare_claim_info'],
                ],
            ],

            // ==================== LEVEL 3: Track Claim Sub-menu ====================
            'track_claim_submenu' => [
                'message' => 'How would you like to track your claim?',
                'options' => [
                    ['id' => 'by_claim_number', 'label' => 'By Claim Number', 'next' => 'track_by_number_info'],
                    ['id' => 'recent_claims', 'label' => 'View Recent Claims', 'next' => 'recent_claims_info'],
                    ['id' => 'pending_claims', 'label' => 'Pending Claims', 'next' => 'pending_claims_info'],
                ],
            ],

            // ==================== LEVEL 3: Claim Rejected Sub-menu ====================
            'claim_rejected_submenu' => [
                'message' => 'Why was your claim rejected?',
                'options' => [
                    ['id' => 'missing_docs', 'label' => 'Missing Documents', 'next' => 'missing_docs_info'],
                    ['id' => 'pre_existing', 'label' => 'Pre-existing Disease', 'next' => 'pre_existing_info'],
                    ['id' => 'waiting_period_issue', 'label' => 'Waiting Period Not Complete', 'next' => 'waiting_period_issue_info'],
                    ['id' => 'appeal_process', 'label' => 'How to Appeal', 'next' => 'appeal_process_info'],
                ],
            ],

            // ==================== LEVEL 3: Reimbursement Sub-menu ====================
            'reimbursement_submenu' => [
                'message' => 'What do you need help with for reimbursement?',
                'options' => [
                    ['id' => 'documents_needed', 'label' => 'Documents Required', 'next' => 'documents_needed_info'],
                    ['id' => 'submission_deadline', 'label' => 'Submission Deadline', 'next' => 'submission_deadline_info'],
                    ['id' => 'how_to_submit', 'label' => 'How to Submit', 'next' => 'how_to_submit_info'],
                ],
            ],

            // ==================== LEVEL 2: E-Card Menu ====================
            'ecard_menu' => [
                'message' => 'What would you like to do with your E-Card?',
                'options' => [
                    ['id' => 'download_ecard', 'label' => 'Download E-Card', 'next' => 'download_ecard_info'],
                    ['id' => 'share_ecard', 'label' => 'Share E-Card', 'next' => 'share_ecard_info'],
                    ['id' => 'family_ecards', 'label' => 'Family E-Cards', 'next' => 'family_ecards_info'],
                    ['id' => 'ecard_not_working', 'label' => 'E-Card Issues', 'next' => 'ecard_issues_submenu'],
                ],
            ],

            // ==================== LEVEL 3: E-Card Issues Sub-menu ====================
            'ecard_issues_submenu' => [
                'message' => 'What issue are you facing with E-Card?',
                'options' => [
                    ['id' => 'cant_download', 'label' => 'Can\'t Download', 'next' => 'cant_download_info'],
                    ['id' => 'wrong_details', 'label' => 'Wrong Details on E-Card', 'next' => 'wrong_details_info'],
                    ['id' => 'ecard_expired', 'label' => 'E-Card Expired', 'next' => 'ecard_expired_info'],
                ],
            ],

            // ==================== LEVEL 2: Network Hospitals Menu ====================
            'network_menu' => [
                'message' => 'How can I help you find network hospitals?',
                'options' => [
                    ['id' => 'search_hospital', 'label' => 'Search Hospital', 'next' => 'search_hospital_submenu'],
                    ['id' => 'nearby_hospitals', 'label' => 'Nearby Hospitals', 'next' => 'nearby_hospitals_info'],
                    ['id' => 'cashless_process', 'label' => 'Cashless Process at Hospital', 'next' => 'cashless_process_info'],
                ],
            ],

            // ==================== LEVEL 3: Search Hospital Sub-menu ====================
            'search_hospital_submenu' => [
                'message' => 'How would you like to search for hospitals?',
                'options' => [
                    ['id' => 'by_city', 'label' => 'Search by City', 'next' => 'by_city_info'],
                    ['id' => 'by_specialty', 'label' => 'Search by Specialty', 'next' => 'by_specialty_info'],
                    ['id' => 'by_name', 'label' => 'Search by Hospital Name', 'next' => 'by_name_info'],
                ],
            ],

            // ==================== LEVEL 2: Wellness Menu ====================
            'wellness_menu' => [
                'message' => 'What wellness service are you interested in?',
                'options' => [
                    ['id' => 'health_checkup', 'label' => 'Health Checkup', 'next' => 'health_checkup_submenu'],
                    ['id' => 'fitness', 'label' => 'Fitness Programs', 'next' => 'fitness_info'],
                    ['id' => 'mental_health', 'label' => 'Mental Health Support', 'next' => 'mental_health_info'],
                    ['id' => 'yoga', 'label' => 'Yoga & Meditation', 'next' => 'yoga_info'],
                ],
            ],

            // ==================== LEVEL 3: Health Checkup Sub-menu ====================
            'health_checkup_submenu' => [
                'message' => 'What type of health checkup are you looking for?',
                'options' => [
                    ['id' => 'basic_checkup', 'label' => 'Basic Health Checkup', 'next' => 'basic_checkup_info'],
                    ['id' => 'comprehensive', 'label' => 'Comprehensive Checkup', 'next' => 'comprehensive_info'],
                    ['id' => 'cardiac', 'label' => 'Cardiac Checkup', 'next' => 'cardiac_info'],
                ],
            ],

            // ==================== LEVEL 2: Enrollment Menu ====================
            'enrollment_menu' => [
                'message' => 'What do you need help with regarding enrollment?',
                'options' => [
                    ['id' => 'new_enrollment', 'label' => 'New Enrollment', 'next' => 'new_enrollment_info'],
                    ['id' => 'enrollment_status', 'label' => 'Check Enrollment Status', 'next' => 'enrollment_status_info'],
                    ['id' => 'modify_enrollment', 'label' => 'Modify Enrollment', 'next' => 'modify_enrollment_info'],
                ],
            ],

            // ==================== TERMINAL NODES (Final Answers) ====================
            
            'basic_coverage_info' => [
                'message' => '✅ Your policy covers:\n• Hospitalization expenses\n• Room rent (as per policy terms)\n• ICU charges\n• Doctor fees\n• Surgical procedures\n• Medical tests & diagnostics\n\n📞 Need more details? Contact support.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'room_rent_info' => [
                'message' => '🛏️ Room Rent Coverage:\n• Single AC room: Covered\n• Actual room charges up to policy limit\n• ICU: Covered as per policy\n\n💡 If you choose a higher room category, proportionate deductions may apply.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pre_post_hosp_info' => [
                'message' => '📅 Pre & Post Hospitalization Coverage:\n• Pre-hospitalization: 30 days before admission\n• Post-hospitalization: 60 days after discharge\n• Includes consultations, medicines, and tests related to the hospitalization.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'daycare_info' => [
                'message' => '⏰ Daycare Procedures Covered:\n• Cataract surgery\n• Chemotherapy\n• Dialysis\n• Tonsillectomy\n• And 150+ other procedures\n\n✅ No hospitalization required for these treatments.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'exclusions_info' => [
                'message' => '❌ What\'s NOT Covered:\n• Cosmetic surgery\n• Dental treatment (except accident)\n• Pre-existing diseases (waiting period applies)\n• Self-inflicted injuries\n• Drug/alcohol abuse\n\n📄 Check policy document for complete list.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'view_members_info' => [
                'message' => '👨‍👩‍👧‍👦 To view all covered members:\n1. Go to "My Policy" section\n2. Click on "Family Members"\n3. You\'ll see all covered members with their details\n\n✅ You can also download member-wise E-Cards from there.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_spouse_info' => [
                'message' => '💑 To Add Spouse:\n1. Go to "Family Members" section\n2. Click "Add Member"\n3. Select "Spouse"\n4. Upload: Marriage certificate, Aadhaar, Photo\n5. Additional premium will be calculated\n\n⏰ Can be added during annual enrollment or within 30 days of marriage.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_child_info' => [
                'message' => '👶 To Add Child:\n1. Go to "Family Members" section\n2. Click "Add Member"\n3. Select "Child"\n4. Upload: Birth certificate, Aadhaar (if available)\n\n⏰ Must be added within 30 days of birth for immediate coverage.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_parent_info' => [
                'message' => '👴 To Add Parent:\n1. Only during annual enrollment\n2. Upload medical records\n3. May require pre-medical checkup\n4. Higher premium applicable\n\n⚠️ Pre-existing disease waiting period: 2-4 years.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'remove_dependant_info' => [
                'message' => '➖ To Remove Dependant:\n1. Contact your HR department\n2. Submit removal request form\n3. Reason required (e.g., child married, parent deceased)\n4. Premium will be adjusted from next policy period\n\n⚠️ Cannot be done mid-policy year except for specific cases.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'update_member_info' => [
                'message' => '✏️ To Update Member Details:\n1. Go to "My Policy" > "Family Members"\n2. Select member to update\n3. Update information (name, DOB, etc.)\n4. Upload supporting documents\n\n📝 Documents may be required for verification.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'policy_copy_info' => [
                'message' => '📄 Download Policy Copy:\n1. Go to "My Policy" section\n2. Click "Documents"\n3. Select "Policy Document"\n4. Download PDF\n\n💡 You can also email it to yourself directly from the app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'policy_schedule_info' => [
                'message' => '📋 Policy Schedule:\nAvailable in "My Policy" > "Documents" section.\n\nIt contains:\n• Sum insured details\n• Premium breakdown\n• Coverage dates\n• Member details',
                'options' => [],
                'show_thank_you' => true,
            ],
            'endorsement_info' => [
                'message' => '📜 Endorsement Letter:\n• Generated when you add/remove members\n• Available in "Documents" section\n• Shows changes made to policy\n\n⏰ Updated within 7 working days of approval.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'start_date_info' => [
                'message' => '📅 Your policy start date information is available in "My Policy" section.\n\n✅ Coverage is active from the start date.\n\n💡 Check "My Policy" for exact details.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'end_date_info' => [
                'message' => '📅 Your policy expiry date is mentioned in your policy document.\n\n⚠️ Ensure renewal before this date to avoid coverage gap.\n\n📧 You\'ll receive renewal reminders 30 days in advance.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'renewal_date_info' => [
                'message' => '🔄 Policy Renewal:\n• Check your policy document for renewal date\n• Renewal window: 30 days before expiry\n• No break in coverage if renewed on time\n\n💡 Auto-renewal option available!',
                'options' => [],
                'show_thank_you' => true,
            ],
            'view_premium_info' => [
                'message' => '💰 Your Premium Details:\n• Total Premium: Available in "My Policy"\n• Company contribution: Check with HR\n• Employee contribution: Check payslip\n\n📊 View detailed breakup in policy schedule.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'payment_history_info' => [
                'message' => '📜 Payment History:\n1. Go to "My Policy" > "Payments"\n2. View all premium payments\n3. Download payment receipts\n\n💳 Shows mode of payment and dates.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'payment_methods_info' => [
                'message' => '💳 Payment Methods:\n• Salary deduction (default for corporate)\n• Net banking\n• Debit/Credit card\n• UPI\n\n✅ All methods are secure and encrypted.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cashless_claim_info' => [
                'message' => '🏥 Cashless Hospitalization:\n1. Show E-Card at network hospital\n2. Hospital sends pre-authorization to TPA\n3. TPA approves within 2-4 hours\n4. Get admitted without payment\n5. Settle only non-covered expenses\n\n✅ Valid at all network hospitals.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'reimbursement_claim_info' => [
                'message' => '💰 Reimbursement Claim:\n1. Get treated at any hospital\n2. Collect all bills and documents\n3. Submit claim within 30 days\n4. Upload documents via app or email\n5. Claim settled in 15-20 days\n\n📋 Documents: Bills, discharge summary, prescriptions.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'daycare_claim_info' => [
                'message' => '⏰ Daycare Claim:\n1. Inform TPA before procedure\n2. Get pre-authorization (if cashless)\n3. OR pay and submit documents for reimbursement\n4. Submit: Bills, doctor prescription, discharge card\n\n✅ No 24-hour hospitalization needed.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'track_by_number_info' => [
                'message' => '🔍 Track by Claim Number:\n1. Go to "Claims" section\n2. Click "Track Claim"\n3. Enter claim/intimation number\n4. View real-time status\n\n📱 Push notifications enabled for updates.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'recent_claims_info' => [
                'message' => '📋 Recent Claims:\n• View last 6 months claims\n• Available in "Claims" section\n• Shows status and settlement details\n\n🔔 Get alerts on status changes.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pending_claims_info' => [
                'message' => '⏳ Pending Claims:\n• View all pending claims in "Claims" section\n• Check reason for pending\n• Upload additional documents if required\n\n📞 Contact TPA if pending > 30 days.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'missing_docs_info' => [
                'message' => '📄 Missing Documents:\n• TPA will send query letter\n• Upload missing documents via app\n• Resubmit within 15 days\n\n⚠️ Claim may be closed if docs not submitted on time.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pre_existing_info' => [
                'message' => '🏥 Pre-existing Disease:\n• Waiting period: 2-4 years (check policy)\n• Cannot claim during waiting period\n• Coverage starts after waiting period completion\n\n💡 Declare all diseases during enrollment.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'waiting_period_issue_info' => [
                'message' => '⏳ Waiting Period:\n• Initial waiting: 30 days\n• Specific diseases: 2 years\n• Pre-existing: 2-4 years\n\n📅 Check policy start date to calculate.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'appeal_process_info' => [
                'message' => '📢 Appeal Process:\n1. Get rejection letter from TPA\n2. Collect supporting documents\n3. Submit appeal within 30 days\n4. Write to grievance email\n5. Escalate to insurance ombudsman if needed\n\n📞 Keep all communication documented.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'documents_needed_info' => [
                'message' => '📋 Documents Required:\n✅ Hospital bills (original)\n✅ Discharge summary\n✅ Payment receipts\n✅ Prescriptions\n✅ Investigation reports\n✅ Claim form (duly filled)\n\n📸 Upload via app or email',
                'options' => [],
                'show_thank_you' => true,
            ],
            'submission_deadline_info' => [
                'message' => '⏰ Submission Deadline:\n• Within 30 days of discharge\n• Grace period: 15 days (with penalty)\n• Beyond 45 days: Claim may be rejected\n\n💡 Submit as early as possible for faster settlement.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'how_to_submit_info' => [
                'message' => '📤 How to Submit:\n1. App: Go to "Claims" > "Submit Documents"\n2. Email: tpa@company.com\n3. Courier: TPA office address\n\n✅ Get acknowledgment receipt for tracking.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'download_ecard_info' => [
                'message' => '🎴 Download E-Card:\n1. Open app\n2. Go to "E-Card" section\n3. Click "Download"\n4. Save as PDF or image\n\n💡 Keep digital copy on phone for easy access.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'share_ecard_info' => [
                'message' => '📤 Share E-Card:\n1. Open E-Card\n2. Click "Share" button\n3. Choose platform (WhatsApp, Email, etc.)\n\n✅ Send to family members for their reference.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'family_ecards_info' => [
                'message' => '👨‍👩‍👧 Family E-Cards:\n1. Go to "E-Card" section\n2. Select family member from dropdown\n3. Download individual E-Cards\n\n📱 All family members have unique card numbers.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cant_download_info' => [
                'message' => '❌ Can\'t Download E-Card?\nTroubleshooting:\n1. Check internet connection\n2. Clear app cache\n3. Update app to latest version\n4. Try from desktop browser\n\n📞 Still facing issue? Contact support.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'wrong_details_info' => [
                'message' => '⚠️ Wrong Details on E-Card?\n1. Take screenshot\n2. Submit correction request via app\n3. Upload supporting documents\n4. Updated E-Card in 3-5 days\n\n📝 Common errors: Name spelling, DOB, sum insured.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'ecard_expired_info' => [
                'message' => '📅 E-Card Expired?\n• Policy expired or not renewed\n• Contact HR for renewal status\n• Renew policy to get updated E-Card\n\n⚠️ Cannot use expired E-Card for cashless.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'by_city_info' => [
                'message' => '🏙️ Search by City:\n1. Go to "Network Hospitals"\n2. Select "Search by City"\n3. Choose your city\n4. View all network hospitals\n\n📍 Filter by distance, rating, or specialty.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'by_specialty_info' => [
                'message' => '🩺 Search by Specialty:\n1. Select specialty (Cardiology, Orthopedic, etc.)\n2. View hospitals with that department\n3. Check doctor availability\n\n💡 Call hospital to confirm before visiting.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'by_name_info' => [
                'message' => '🔍 Search by Hospital Name:\n1. Go to "Network Hospitals"\n2. Enter hospital name\n3. Check if it\'s in network\n4. View contact details and address\n\n✅ Save favorites for quick access.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'nearby_hospitals_info' => [
                'message' => '📍 Nearby Hospitals:\n1. Enable location access\n2. App shows nearest network hospitals\n3. Get directions via Google Maps\n\n🚗 Shows distance and estimated travel time.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cashless_process_info' => [
                'message' => '💳 Cashless Process at Hospital:\n1. Show E-Card at admission desk\n2. Fill pre-authorization form\n3. Hospital sends to TPA\n4. Approval in 2-4 hours\n5. Get admitted without advance\n\n📱 Track approval status on app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'fitness_info' => [
                'message' => '💪 Fitness Programs:\n• Free gym membership\n• Yoga sessions\n• Zumba classes\n• Personal trainer access\n\n📍 Available at partner fitness centers. Check "Wellness" section for locations.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'mental_health_info' => [
                'message' => '🧠 Mental Health Support:\n• Free counseling sessions\n• Stress management workshops\n• 24/7 helpline\n• Confidential consultations\n\n📞 Call helpline for support.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'yoga_info' => [
                'message' => '🧘 Yoga & Meditation:\n• Online classes daily\n• Live sessions on weekends\n• Recorded sessions available\n• Certified instructors\n\n📱 Access via "Wellness" section.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'basic_checkup_info' => [
                'message' => '🩺 Basic Health Checkup:\nIncludes:\n• Blood sugar\n• Blood pressure\n• Cholesterol\n• Complete blood count\n• Urine test\n\n💰 Free once a year. Book via app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'comprehensive_info' => [
                'message' => '🏥 Comprehensive Checkup:\nIncludes basic tests plus:\n• ECG\n• Chest X-ray\n• Liver function\n• Kidney function\n• Thyroid test\n\n💰 Discounted rate for policyholders.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cardiac_info' => [
                'message' => '❤️ Cardiac Checkup:\n• ECG\n• 2D Echo\n• TMT (Treadmill test)\n• Lipid profile\n• Consultation with cardiologist\n\n📅 Recommended for age 40+',
                'options' => [],
                'show_thank_you' => true,
            ],
            'new_enrollment_info' => [
                'message' => '📝 New Enrollment:\n1. Wait for enrollment window (usually annual)\n2. Receive notification from HR\n3. Login to enrollment portal\n4. Select coverage and add members\n5. Submit documents\n\n⏰ Enrollment window typically in March.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'enrollment_status_info' => [
                'message' => '🔍 Check Enrollment Status:\n1. Go to "Enrollment" section\n2. View current enrollment\n3. Check approval status\n4. Download enrollment summary\n\n📧 Confirmation email sent after approval.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'modify_enrollment_info' => [
                'message' => '✏️ Modify Enrollment:\n• Can be done during enrollment window only\n• Or within 30 days of life event (marriage, birth)\n• Contact HR for modification form\n\n⚠️ Changes effective from next policy period.',
                'options' => [],
                'show_thank_you' => true,
            ],
        ];
    }

    /**
     * Get next step in chatbot flow
     */
    public static function getNextStep(string $currentState, ?string $selectedOption = null): array
    {
        $flow = self::getChatbotFlow();
        
        if (!isset($flow[$currentState])) {
            return [
                'error' => true,
                'message' => 'Invalid state'
            ];
        }

        $currentNode = $flow[$currentState];
        
        // If options are selected, move to next state
        if ($selectedOption && !empty($currentNode['options'])) {
            foreach ($currentNode['options'] as $option) {
                if ($option['id'] === $selectedOption) {
                    $nextState = $option['next'];
                    if (isset($flow[$nextState])) {
                        return [
                            'state' => $nextState,
                            'message' => $flow[$nextState]['message'],
                            'options' => $flow[$nextState]['options'] ?? [],
                            'show_thank_you' => $flow[$nextState]['show_thank_you'] ?? false,
                        ];
                    }
                }
            }
        }

        // Return current state
        return [
            'state' => $currentState,
            'message' => $currentNode['message'],
            'options' => $currentNode['options'] ?? [],
            'show_thank_you' => $currentNode['show_thank_you'] ?? false,
        ];
    }
}
