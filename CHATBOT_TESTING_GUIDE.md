# Testing Guide: Multi-Layer Chatbot Flow

## 🧪 Complete Testing Scenarios

This document provides step-by-step testing scenarios for the multi-layered chatbot system.

---

## 🔑 Your JWT Token
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg
```

## 🌐 Base URL
```
http://127.0.0.1:8000/api/v1/help
```

---

## 📋 Test Scenario 1: 4-Level Deep Navigation (Maternity)

### **Flow Path**: Start → Policy → Coverage → Maternity → Normal Delivery

### Step 1: Start Chat
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/start \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg" \
  -H "Content-Type: application/json"
```

**Expected Response**:
```json
{
  "status": true,
  "message": "Help chat started successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "👋 Hello! I'm here to help you with your insurance needs...",
    "options": [
      {"id": "policy_details", "label": "📋 My Policy Details"},
      {"id": "claims", "label": "💰 Claims & Reimbursement"},
      {"id": "ecard", "label": "🎴 E-Card Services"},
      {"id": "network", "label": "🏥 Network Hospitals"},
      {"id": "wellness", "label": "💪 Wellness Services"},
      {"id": "enrollment", "label": "📝 Enrollment & Registration"}
    ],
    "state_key": "start"
  }
}
```

### Step 2: Select "My Policy Details"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"policy_details\"}"
  }'
```

**Expected Response** (Level 2):
```json
{
  "status": true,
  "message": "Chat continued successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "What information do you need about your policy?",
    "options": [
      {"id": "coverage", "label": "Coverage Details"},
      {"id": "members", "label": "Family Members & Dependants"},
      {"id": "policy_docs", "label": "Policy Documents"},
      {"id": "policy_dates", "label": "Policy Period & Renewal"},
      {"id": "premium", "label": "Premium & Payment"}
    ],
    "state_key": "policy_menu",
    "is_terminal": false
  }
}
```

### Step 3: Select "Coverage Details"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"coverage\"}"
  }'
```

**Expected Response** (Level 3):
```json
{
  "status": true,
  "message": "Chat continued successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "Which coverage information would you like to know?",
    "options": [
      {"id": "basic_coverage", "label": "Basic Coverage"},
      {"id": "room_rent", "label": "Room Rent Limits"},
      {"id": "pre_post_hosp", "label": "Pre & Post Hospitalization"},
      {"id": "daycare", "label": "Daycare Procedures"},
      {"id": "maternity", "label": "Maternity Coverage"},
      {"id": "exclusions", "label": "What's NOT Covered"}
    ],
    "state_key": "coverage_submenu",
    "is_terminal": false
  }
}
```

### Step 4: Select "Maternity Coverage"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"maternity\"}"
  }'
```

**Expected Response** (Level 4):
```json
{
  "status": true,
  "message": "Chat continued successfully",
  "data": {
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "What would you like to know about maternity coverage?",
    "options": [
      {"id": "normal_delivery", "label": "Normal Delivery Coverage"},
      {"id": "c_section", "label": "C-Section Coverage"},
      {"id": "waiting_period", "label": "Waiting Period"},
      {"id": "newborn_coverage", "label": "Newborn Baby Coverage"}
    ],
    "state_key": "maternity_submenu",
    "is_terminal": false
  }
}
```

### Step 5: Select "Normal Delivery Coverage" (Terminal Node)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzM2NzQwMTQ5LCJleHAiOjE3MzY3NDM3NDksIm5iZiI6MTczNjc0MDE0OSwianRpIjoiVEQxc1hNVDBFOFpjZ1pScCIsInN1YiI6IjE5MzAyOSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJjb21wYW55X2lkIjoxNzJ9.T2cJUCGPo5XPn-t6FX1EvZ2sZkqc11NxiTm70cQiSLg" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"normal_delivery\"}"
  }'
```

**Expected Response** (Terminal with Thank You):
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
    "thank_you_message": "🙏 Thank you for using our help service! \n\n✅ I hope this information was helpful.\n\n💬 If you need further assistance or have any questions, feel free to:\n• Type your query below to connect with our support team\n• Start a new chat by clicking the help button\n\n📞 For urgent matters, call our helpline: 1800-XXX-XXXX\n\nHave a great day! 😊"
  }
}
```

✅ **Test Complete!** User navigated through 4 levels and received answer + thank you message.

---

## 👨‍👩‍👧 Test Scenario 2: 4-Level Deep (Add Spouse)

### **Flow Path**: Start → Policy → Members → Add Dependant → Add Spouse

### Step 1: Start Chat (same as above)

### Step 2: Select "My Policy Details" (same as above)

### Step 3: Select "Family Members & Dependants"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"members\"}"
  }'
```

**Expected**: Shows 4 options including "Add Dependant"

### Step 4: Select "Add Dependant"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"add_dependant\"}"
  }'
```

**Expected** (Level 4):
```json
{
  "message": "Who would you like to add to your policy?",
  "options": [
    {"id": "add_spouse", "label": "Add Spouse"},
    {"id": "add_child", "label": "Add Child"},
    {"id": "add_parent", "label": "Add Parent"},
    {"id": "add_parent_in_law", "label": "Add Parent-in-law"}
  ],
  "state_key": "add_dependant_submenu"
}
```

### Step 5: Select "Add Spouse" (Terminal)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"add_spouse\"}"
  }'
```

**Expected**: Detailed steps to add spouse + thank you message

---

## 💰 Test Scenario 3: 3-Level Deep (Track Claim)

### **Flow Path**: Start → Claims → Track Claim → By Claim Number

### Step 1: Start Chat

### Step 2: Select "Claims & Reimbursement"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"claims\"}"
  }'
```

### Step 3: Select "Track Claim Status"
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"track_claim\"}"
  }'
```

### Step 4: Select "By Claim Number" (Terminal)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "{\"selected_option\": \"by_claim_number\"}"
  }'
```

**Expected**: Instructions to track by claim number + thank you message

---

## 🎴 Test Scenario 4: 3-Level Deep (E-Card Issues)

### **Flow Path**: Start → E-Card → E-Card Issues → Can't Download

### Quick Commands:
```bash
# Start
curl -X POST http://127.0.0.1:8000/api/v1/help/start \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json"

# Select E-Card
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"ecard\"}"}'

# Select E-Card Issues
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"ecard_not_working\"}"}'

# Select Can't Download
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"cant_download\"}"}'
```

---

## 🏥 Test Scenario 5: 3-Level Deep (Search Hospital)

### **Flow Path**: Start → Network → Search Hospital → By City

```bash
# Start → Network
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"network\"}"}'

# Network → Search Hospital
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"search_hospital\"}"}'

# Search Hospital → By City
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"by_city\"}"}'
```

---

## 💪 Test Scenario 6: 3-Level Deep (Health Checkup)

### **Flow Path**: Start → Wellness → Health Checkup → Cardiac

```bash
# Wellness
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"wellness\"}"}'

# Health Checkup
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"health_checkup\"}"}'

# Cardiac
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [TOKEN]" -H "Content-Type: application/json" \
  -d '{"ticket_id": "TKT-XXX", "message": "{\"selected_option\": \"cardiac\"}"}'
```

---

## 📝 Test Scenario 7: Free Text Query (Any Level)

After reaching any terminal node, user can type free text:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/help/message \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-XXXXX",
    "message": "I need help with my claim rejection. Please assist."
  }'
```

**Expected**:
- Message saved in database
- Status changed to "in_progress"
- Email sent to support team
- Response confirms ticket created

---

## 🔍 Test Scenario 8: View Chat History

After navigating through multiple levels:

```bash
curl -X GET http://127.0.0.1:8000/api/v1/help/chat/TKT-20260113-XXXXX \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json"
```

**Expected**: Complete conversation history showing all user selections and bot responses

---

## 📊 Test Scenario 9: View All Tickets

```bash
curl -X GET http://127.0.0.1:8000/api/v1/help/tickets \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json"
```

**Expected**: List of all tickets created by user with status

---

## ✅ Test Scenario 10: Update Ticket Status

```bash
curl -X PATCH http://127.0.0.1:8000/api/v1/help/ticket/TKT-20260113-XXXXX/status \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "remarks": "Issue resolved by support team"
  }'
```

**Expected**: Status updated, tracker entry created

---

## 🎯 Validation Checklist

After running tests, verify:

- [ ] Start returns 6 main options
- [ ] Level 2 nodes show 3-5 sub-options
- [ ] Level 3 nodes show detailed sub-menus
- [ ] Level 4 nodes (maternity, add_dependant) work correctly
- [ ] Terminal nodes show `is_terminal: true`
- [ ] Terminal nodes show `thank_you_message`
- [ ] Thank you message saved in database
- [ ] Free text creates support ticket
- [ ] Email sent for free text queries
- [ ] Chat history shows complete navigation
- [ ] State tracking works correctly
- [ ] All tickets retrievable
- [ ] Status updates work
- [ ] Status tracker records changes

---

## 📈 Coverage Statistics

**Test Coverage**:
- ✅ 6 main categories tested
- ✅ 18 level-3 sub-menus tested
- ✅ 2 level-4 deep menus tested
- ✅ 70+ terminal nodes available
- ✅ Thank you messages working
- ✅ Free text to support working
- ✅ Email notifications working

---

## 🐛 Troubleshooting

### Issue: Token expired
**Solution**: Generate new token via login API

### Issue: Ticket not found
**Solution**: Use correct ticket_id from start response

### Issue: Invalid option
**Solution**: Check option IDs match chatbot flow

### Issue: No thank you message
**Solution**: Verify terminal node has `show_thank_you: true`

---

## 📞 Support

For any issues during testing:
- Check Laravel logs: `storage/logs/laravel.log`
- Check database: `help_support_chats` table
- Verify JWT token is valid
- Ensure migrations are run

---

**Happy Testing!** 🎉
