# Multi-Layer Chatbot System - Complete Documentation

## 🎯 Overview
This is a comprehensive multi-layered chatbot system similar to Swiggy's help system, designed for insurance policy support. The chatbot provides pre-filled options with nested sub-menus that guide users through 3-4+ levels of navigation to reach detailed answers.

---

## 🌳 Chatbot Flow Structure

### **Level 1: Main Menu (Start)**
When user starts a chat, they see 6 main categories:

1. **📋 My Policy Details** → `policy_menu`
2. **💰 Claims & Reimbursement** → `claims_menu`
3. **🎴 E-Card Services** → `ecard_menu`
4. **🏥 Network Hospitals** → `network_menu`
5. **💪 Wellness Services** → `wellness_menu`
6. **📝 Enrollment & Registration** → `enrollment_menu`

---

### **Level 2: Category Menus**

#### 1. Policy Details Menu (`policy_menu`)
- Coverage Details → `coverage_submenu` (Level 3)
- Family Members & Dependants → `members_submenu` (Level 3)
- Policy Documents → `policy_docs_submenu` (Level 3)
- Policy Period & Renewal → `policy_dates_submenu` (Level 3)
- Premium & Payment → `premium_submenu` (Level 3)

#### 2. Claims Menu (`claims_menu`)
- File a New Claim → `file_claim_submenu` (Level 3)
- Track Claim Status → `track_claim_submenu` (Level 3)
- Claim Rejected/Queries → `claim_rejected_submenu` (Level 3)
- Claim Settlement → `claim_settlement_submenu` (Level 3)
- Reimbursement Process → `reimbursement_submenu` (Level 3)

#### 3. E-Card Menu (`ecard_menu`)
- Download E-Card → `download_ecard_info` (Terminal)
- Share E-Card → `share_ecard_info` (Terminal)
- Family E-Cards → `family_ecards_info` (Terminal)
- E-Card Issues → `ecard_issues_submenu` (Level 3)

#### 4. Network Hospitals Menu (`network_menu`)
- Search Hospital → `search_hospital_submenu` (Level 3)
- Nearby Hospitals → `nearby_hospitals_info` (Terminal)
- Hospital Facilities → `hospital_facilities_info` (Terminal)
- Cashless Process at Hospital → `cashless_process_info` (Terminal)

#### 5. Wellness Menu (`wellness_menu`)
- Health Checkup → `health_checkup_submenu` (Level 3)
- Fitness Programs → `fitness_info` (Terminal)
- Mental Health Support → `mental_health_info` (Terminal)
- Nutrition Counseling → `nutrition_info` (Terminal)
- Yoga & Meditation → `yoga_info` (Terminal)

#### 6. Enrollment Menu (`enrollment_menu`)
- New Enrollment → `new_enrollment_info` (Terminal)
- Check Enrollment Status → `enrollment_status_info` (Terminal)
- Modify Enrollment → `modify_enrollment_info` (Terminal)
- Enrollment Deadline → `enrollment_deadline_info` (Terminal)

---

### **Level 3: Sub-Category Menus**

#### Coverage Sub-menu (`coverage_submenu`)
- Basic Coverage → `basic_coverage_info` (Terminal)
- Room Rent Limits → `room_rent_info` (Terminal)
- Pre & Post Hospitalization → `pre_post_hosp_info` (Terminal)
- Daycare Procedures → `daycare_info` (Terminal)
- **Maternity Coverage** → `maternity_submenu` (Level 4) ⭐
- What's NOT Covered → `exclusions_info` (Terminal)

#### Members Sub-menu (`members_submenu`)
- View All Members → `view_members_info` (Terminal)
- **Add Dependant** → `add_dependant_submenu` (Level 4) ⭐
- Remove Dependant → `remove_dependant_info` (Terminal)
- Update Member Details → `update_member_info` (Terminal)

#### Policy Documents Sub-menu (`policy_docs_submenu`)
- Download Policy Copy → `policy_copy_info` (Terminal)
- Policy Schedule → `policy_schedule_info` (Terminal)
- Endorsement Letter → `endorsement_info` (Terminal)
- Policy Certificate → `policy_certificate_info` (Terminal)

#### Policy Dates Sub-menu (`policy_dates_submenu`)
- Policy Start Date → `start_date_info` (Terminal)
- Policy Expiry Date → `end_date_info` (Terminal)
- Renewal Date → `renewal_date_info` (Terminal)
- Cooling Off Period → `cooling_period_info` (Terminal)

#### Premium Sub-menu (`premium_submenu`)
- View Premium Amount → `view_premium_info` (Terminal)
- Payment History → `payment_history_info` (Terminal)
- Payment Methods → `payment_methods_info` (Terminal)
- Premium Breakdown → `premium_breakdown_info` (Terminal)

#### File Claim Sub-menu (`file_claim_submenu`)
- Cashless Hospitalization → `cashless_claim_info` (Terminal)
- Reimbursement Claim → `reimbursement_claim_info` (Terminal)
- Daycare Claim → `daycare_claim_info` (Terminal)
- Maternity Claim → `maternity_claim_info` (Terminal)

#### Track Claim Sub-menu (`track_claim_submenu`)
- By Claim Number → `track_by_number_info` (Terminal)
- View Recent Claims → `recent_claims_info` (Terminal)
- Pending Claims → `pending_claims_info` (Terminal)
- Settled Claims → `settled_claims_info` (Terminal)

#### Claim Rejected Sub-menu (`claim_rejected_submenu`)
- Missing Documents → `missing_docs_info` (Terminal)
- Pre-existing Disease → `pre_existing_info` (Terminal)
- Waiting Period Not Complete → `waiting_period_issue_info` (Terminal)
- Treatment Not Covered → `non_covered_info` (Terminal)
- How to Appeal → `appeal_process_info` (Terminal)

#### Claim Settlement Sub-menu (`claim_settlement_submenu`)
- Settlement Timeline → `settlement_time_info` (Terminal)
- Settlement Amount Details → `settlement_amount_info` (Terminal)
- Payment Mode → `payment_mode_info` (Terminal)
- Why Deductions? → `deductions_info` (Terminal)

#### Reimbursement Sub-menu (`reimbursement_submenu`)
- Documents Required → `documents_needed_info` (Terminal)
- Submission Deadline → `submission_deadline_info` (Terminal)
- How to Submit → `how_to_submit_info` (Terminal)
- Check Reimbursement Status → `reimbursement_status_info` (Terminal)

#### E-Card Issues Sub-menu (`ecard_issues_submenu`)
- Can't Download → `cant_download_info` (Terminal)
- Wrong Details on E-Card → `wrong_details_info` (Terminal)
- E-Card Expired → `ecard_expired_info` (Terminal)
- Hospital Rejected E-Card → `hospital_rejected_info` (Terminal)

#### Search Hospital Sub-menu (`search_hospital_submenu`)
- Search by City → `by_city_info` (Terminal)
- Search by Specialty → `by_specialty_info` (Terminal)
- Search by Hospital Name → `by_name_info` (Terminal)
- Top Rated Hospitals → `top_hospitals_info` (Terminal)

#### Health Checkup Sub-menu (`health_checkup_submenu`)
- Basic Health Checkup → `basic_checkup_info` (Terminal)
- Comprehensive Checkup → `comprehensive_info` (Terminal)
- Cardiac Checkup → `cardiac_info` (Terminal)
- Diabetes Screening → `diabetes_info` (Terminal)
- Women's Health Checkup → `women_health_info` (Terminal)

---

### **Level 4: Deep Sub-menus**

#### Maternity Sub-menu (`maternity_submenu`) ⭐
Final level with detailed maternity options:
- Normal Delivery Coverage → `normal_delivery_info` (Terminal + Thank You)
- C-Section Coverage → `c_section_info` (Terminal + Thank You)
- Waiting Period → `maternity_waiting_info` (Terminal + Thank You)
- Newborn Baby Coverage → `newborn_info` (Terminal + Thank You)

#### Add Dependant Sub-menu (`add_dependant_submenu`) ⭐
Final level for adding family members:
- Add Spouse → `add_spouse_info` (Terminal + Thank You)
- Add Child → `add_child_info` (Terminal + Thank You)
- Add Parent → `add_parent_info` (Terminal + Thank You)
- Add Parent-in-law → `add_parent_in_law_info` (Terminal + Thank You)

---

## 🎉 Thank You Message Feature

When a user reaches a **terminal node** (final answer with no more options), the system automatically displays a thank you message:

### Thank You Message Content:
```
🙏 Thank you for using our help service!

✅ I hope this information was helpful.

💬 If you need further assistance or have any questions, feel free to:
• Type your query below to connect with our support team
• Start a new chat by clicking the help button

📞 For urgent matters, call our helpline: 1800-XXX-XXXX

Have a great day! 😊
```

### How It Works:
1. All terminal nodes have `'show_thank_you' => true` flag
2. When user selects an option leading to terminal node, they see:
   - The detailed answer
   - The thank you message
   - Option to type free text query or start new chat

---

## 📊 Example User Journey

### Journey 1: Maternity Coverage (4 Levels Deep)
```
Level 1: Start
  ↓ Select: "📋 My Policy Details"
  
Level 2: Policy Menu
  ↓ Select: "Coverage Details"
  
Level 3: Coverage Sub-menu
  ↓ Select: "Maternity Coverage"
  
Level 4: Maternity Sub-menu
  ↓ Select: "Normal Delivery Coverage"
  
Terminal: Shows detailed info about normal delivery
  ↓ Automatically displays thank you message
  
User can now: Type custom query OR Start new chat
```

### Journey 2: Add Spouse (4 Levels Deep)
```
Level 1: Start
  ↓ Select: "📋 My Policy Details"
  
Level 2: Policy Menu
  ↓ Select: "Family Members & Dependants"
  
Level 3: Members Sub-menu
  ↓ Select: "Add Dependant"
  
Level 4: Add Dependant Sub-menu
  ↓ Select: "Add Spouse"
  
Terminal: Shows step-by-step guide to add spouse
  ↓ Automatically displays thank you message
  
User can now: Type custom query OR Start new chat
```

### Journey 3: Track Claim (3 Levels Deep)
```
Level 1: Start
  ↓ Select: "💰 Claims & Reimbursement"
  
Level 2: Claims Menu
  ↓ Select: "Track Claim Status"
  
Level 3: Track Claim Sub-menu
  ↓ Select: "By Claim Number"
  
Terminal: Shows how to track claim by number
  ↓ Automatically displays thank you message
  
User can now: Type custom query OR Start new chat
```

---

## 🔧 Technical Implementation

### Chatbot Flow Configuration
The chatbot flow is defined in `getChatbotFlow()` method in `ApiController.php`.

**Structure of each node:**
```php
'node_key' => [
    'message' => 'The message to display',
    'options' => [
        ['id' => 'option_id', 'label' => 'Option Label', 'next' => 'next_node_key'],
        // ... more options
    ],
    'show_thank_you' => true, // Only for terminal nodes
],
```

### Terminal Nodes
A terminal node has:
- `'options' => []` (empty options array)
- `'show_thank_you' => true` (enables thank you message)

### Flow Logic
1. User starts chat → `start` node with 6 main categories
2. User selects option → Navigates to `next` node
3. Process repeats until terminal node
4. At terminal node → Shows answer + thank you message
5. User can type free text → Creates support ticket with email notification

---

## 📱 API Response Format

### Non-Terminal Node Response:
```json
{
  "status": true,
  "message": "Chat continued successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "What information do you need about your policy?",
    "options": [
      {
        "id": "coverage",
        "label": "Coverage Details",
        "next": "coverage_submenu"
      }
    ],
    "state_key": "policy_menu",
    "is_terminal": false,
    "show_write_to_support": false
  }
}
```

### Terminal Node Response (with Thank You):
```json
{
  "status": true,
  "message": "Chat continued successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "👶 Normal Delivery Coverage:\n• Covered up to ₹50,000\n• Includes prenatal and postnatal care\n• Waiting period: 9 months from policy start date\n\n📝 Documents required: Hospital bills, discharge summary, birth certificate.",
    "options": [],
    "state_key": "normal_delivery_info",
    "is_terminal": true,
    "show_write_to_support": true,
    "thank_you_message": "🙏 Thank you for using our help service! \n\n✅ I hope this information was helpful.\n\n💬 If you need further assistance..."
  }
}
```

---

## 🎨 UI/UX Recommendations

### Display Strategy:
1. **Show Options as Buttons**: Display options as clickable buttons for easy navigation
2. **Breadcrumb Trail**: Show current location (e.g., "Policy > Coverage > Maternity > Normal Delivery")
3. **Back Button**: Allow users to go back one level
4. **Main Menu Button**: Quick return to start
5. **Thank You Screen**: Display thank you message in a highlighted card/box
6. **Free Text Input**: Always available at bottom for custom queries

### Visual Hierarchy:
```
┌─────────────────────────────────────┐
│  🤖 Insurance Help Bot              │
│  📍 Policy > Coverage > Maternity   │
├─────────────────────────────────────┤
│                                     │
│  Bot: Which coverage info?          │
│  ┌─────────────────────────────┐   │
│  │ Normal Delivery             │   │
│  │ C-Section                   │   │
│  │ Waiting Period              │   │
│  │ Newborn Coverage            │   │
│  └─────────────────────────────┘   │
│                                     │
│  [← Back]          [🏠 Main Menu]  │
│                                     │
│  💬 Type your query here...         │
└─────────────────────────────────────┘
```

---

## 📈 Statistics & Coverage

### Total Nodes: 100+
- **Level 1 (Main Menu)**: 1 node with 6 options
- **Level 2 (Category Menus)**: 6 nodes with 3-5 options each
- **Level 3 (Sub-Category Menus)**: 18 nodes with 3-5 options each
- **Level 4 (Deep Sub-menus)**: 2 nodes with 4 options each
- **Terminal Nodes**: 70+ nodes with detailed answers

### Coverage Areas:
✅ Policy Details (Coverage, Members, Documents, Dates, Premium)
✅ Claims (Filing, Tracking, Rejection, Settlement, Reimbursement)
✅ E-Card Services (Download, Share, Issues)
✅ Network Hospitals (Search, Nearby, Facilities, Cashless)
✅ Wellness (Health Checkup, Fitness, Mental Health, Nutrition, Yoga)
✅ Enrollment (New, Status, Modify, Deadline)

---

## 🚀 Testing the Multi-Layer Chatbot

### Test Case 1: Deep Navigation
```bash
# Start chat
curl -X POST http://127.0.0.1:8000/api/v1/help/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Response: Shows 6 main options

# Select Policy Details
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"policy_details\"}"
  }'

# Response: Shows 5 policy options

# Select Coverage Details
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"coverage\"}"
  }'

# Response: Shows 6 coverage options

# Select Maternity Coverage
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"maternity\"}"
  }'

# Response: Shows 4 maternity options

# Select Normal Delivery
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"normal_delivery\"}"
  }'

# Response: Shows detailed answer + THANK YOU MESSAGE
```

---

## 🔄 Future Enhancements

1. **Dynamic Content**: Pull real-time data from database (policy dates, premium amounts, etc.)
2. **Personalization**: Customize messages based on user's policy type
3. **Analytics**: Track which paths users take most frequently
4. **A/B Testing**: Test different message formats
5. **Multi-language Support**: Add regional language options
6. **Voice Input**: Enable voice queries
7. **Rich Media**: Add images, videos, PDFs in responses
8. **Search Functionality**: Allow users to search across all answers
9. **Smart Suggestions**: Show "You might also be interested in..." options
10. **Rating System**: Let users rate helpfulness of answers

---

## 📞 Support

For any queries or issues with the chatbot system:
- **Email**: support@zoomconnect.com
- **Phone**: 1800-XXX-XXXX (Toll-free)
- **Technical Support**: tech@zoomconnect.com

---

## ✅ Summary

This multi-layered chatbot provides:
- ✅ **3-4+ levels of nested navigation**
- ✅ **100+ information nodes** covering all insurance topics
- ✅ **Automatic thank you messages** on completion
- ✅ **Seamless transition** to human support via free text
- ✅ **Complete chat history** with state tracking
- ✅ **Email notifications** for support tickets
- ✅ **Status tracking** for unresolved queries

The system mimics Swiggy's help interface with pre-filled options, intuitive navigation, and comprehensive coverage of all user queries! 🎉
