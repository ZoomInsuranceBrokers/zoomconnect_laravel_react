# Help/Support Chat API - Updated Implementation

## ✅ Changes Made

All Help/Support functionality has been **moved to ApiController** and now follows the same authentication pattern as your existing APIs (like `/profile`).

### Files Modified:
1. **app/Http/Controllers/ApiController.php** - Added all help support methods
2. **routes/api.php** - Updated to use ApiController
3. **Deleted:** `app/Http/Controllers/Api/HelpSupportController.php`

### Migrations Run:
- ✅ `help_support_chats` table created
- ✅ `help_support_status_tracker` table created

---

## 🔗 API Endpoints (All use Bearer Token)

Base URL: `http://127.0.0.1:8000/api/v1`

### 1. Start Help Chat
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/start" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Chat session started successfully",
  "data": {
    "ticket_id": "TKT-20260113-TXQNX",
    "message": "Hello! How can I assist you with your insurance policy today?",
    "options": [
      {"id": "policy_details", "label": "My Policy Details", "next": "policy_flow"},
      {"id": "claims", "label": "Claims & Reimbursement", "next": "claims_flow"},
      {"id": "ecard", "label": "Download E-Card", "next": "ecard_action"},
      {"id": "network", "label": "Network Hospitals", "next": "network_action"}
    ],
    "state_key": "start"
  }
}
```

---

### 2. Continue Chat - Select Option
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/message" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-TXQNX",
    "state_key": "start",
    "selected_option_id": "policy_details"
  }'
```

---

### 3. Continue Chat - Submit Free Text (Create Ticket)
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/message" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-TXQNX",
    "free_text_message": "I need help with my claim rejection. I submitted all documents on time."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Support ticket created successfully",
  "data": {
    "ticket_id": "TKT-20260113-TXQNX",
    "message": "Thank you for reaching out! Your ticket (TKT-20260113-TXQNX) has been created...",
    "status": "in_progress",
    "email_sent": true
  }
}
```

---

### 4. Get Chat History
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/help/chat/TKT-20260113-TXQNX" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 5. Get All User Tickets
```bash
# All tickets
curl -X GET "http://127.0.0.1:8000/api/v1/help/tickets" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by status
curl -X GET "http://127.0.0.1:8000/api/v1/help/tickets?status=open" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 6. Update Ticket Status
```bash
curl -X PATCH "http://127.0.0.1:8000/api/v1/help/ticket/TKT-20260113-TXQNX/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "remarks": "Issue resolved by support team"
  }'
```

**Allowed status values:** `open`, `in_progress`, `resolved`, `closed`

---

## 🔑 Authentication Method

All endpoints now use **JWT token decoding** (same as your `/profile` endpoint):

```php
$token = $request->bearerToken();
$secret = config('app.key');
$decoded = JWT::decode($token, new Key($secret, 'HS256'));
$userId = $decoded->sub;
$employee = CompanyEmployee::find($userId);
```

---

## 📊 Complete Test Flow

### Step 1: Start Chat
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/start" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoxOTMwMjksImlhdCI6MTc2ODI4MzkxNCwiZXhwIjoxNzcwODc1OTE0LCJkYXRhIjp7ImVtcGxveWVlX2lkIjpudWxsLCJlbWFpbCI6ImFua2l0LnNoYXJtYUB6b29taW5zdXJhbmNlYnJva2Vycy5jb20iLCJtb2JpbGUiOm51bGwsImNvbXBhbnlfaWQiOjE3Mn19.vNy8nmJaeMo0BLsWEHCwfyzpSfHHs3baQH-HVjzyJk4" \
  -H "Content-Type: application/json"
```

### Step 2: Select Option (Policy Details)
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/message" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoxOTMwMjksImlhdCI6MTc2ODI4MzkxNCwiZXhwIjoxNzcwODc1OTE0LCJkYXRhIjp7ImVtcGxveWVlX2lkIjpudWxsLCJlbWFpbCI6ImFua2l0LnNoYXJtYUB6b29taW5zdXJhbmNlYnJva2Vycy5jb20iLCJtb2JpbGUiOm51bGwsImNvbXBhbnlfaWQiOjE3Mn19.vNy8nmJaeMo0BLsWEHCwfyzpSfHHs3baQH-HVjzyJk4" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-TXQNX",
    "state_key": "start",
    "selected_option_id": "policy_details"
  }'
```

### Step 3: Select Coverage
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/message" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoxOTMwMjksImlhdCI6MTc2ODI4MzkxNCwiZXhwIjoxNzcwODc1OTE0LCJkYXRhIjp7ImVtcGxveWVlX2lkIjpudWxsLCJlbWFpbCI6ImFua2l0LnNoYXJtYUB6b29taW5zdXJhbmNlYnJva2Vycy5jb20iLCJtb2JpbGUiOm51bGwsImNvbXBhbnlfaWQiOjE3Mn19.vNy8nmJaeMo0BLsWEHCwfyzpSfHHs3baQH-HVjzyJk4" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-TXQNX",
    "state_key": "policy_flow",
    "selected_option_id": "coverage"
  }'
```

### Step 4: Submit Free Text (Create Support Ticket)
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/help/message" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoxOTMwMjksImlhdCI6MTc2ODI4MzkxNCwiZXhwIjoxNzcwODc1OTE0LCJkYXRhIjp7ImVtcGxveWVlX2lkIjpudWxsLCJlbWFpbCI6ImFua2l0LnNoYXJtYUB6b29taW5zdXJhbmNlYnJva2Vycy5jb20iLCJtb2JpbGUiOm51bGwsImNvbXBhbnlfaWQiOjE3Mn19.vNy8nmJaeMo0BLsWEHCwfyzpSfHHs3baQH-HVjzyJk4" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TKT-20260113-TXQNX",
    "free_text_message": "I need detailed information about maternity coverage"
  }'
```

---

## 🎯 Key Differences from Previous Implementation

### Before (HelpSupportController):
```php
$userId = optional($request->user())->id ?? auth()->id();
```

### Now (ApiController - Same as /profile):
```php
$token = $request->bearerToken();
$secret = config('app.key');
$decoded = JWT::decode($token, new Key($secret, 'HS256'));
$userId = $decoded->sub;
$employee = CompanyEmployee::find($userId);
```

This ensures **100% consistency** with your existing API authentication.

---

## ✅ Verification

### Routes Registered:
```
GET|HEAD   api/v1/help/chat/{ticket_id} ......... ApiController@getHelpChatHistory
POST       api/v1/help/message .................. ApiController@continueHelpChat
POST       api/v1/help/start .................... ApiController@startHelpChat
PATCH      api/v1/help/ticket/{ticket_id}/status  ApiController@updateHelpTicketStatus
GET|HEAD   api/v1/help/tickets .................. ApiController@getHelpTickets
```

### Database Tables:
```
✓ help_support_chats
✓ help_support_status_tracker
```

### Test Result:
```json
✓ API working with your JWT token
✓ Ticket created: TKT-20260113-TXQNX
✓ Chatbot flow functioning correctly
```

---

## 📝 Notes

1. **Authentication:** Uses JWT decode (same as `/profile`)
2. **User ID:** Retrieved from `$decoded->sub`
3. **Employee Data:** Fetched from `CompanyEmployee::find($userId)`
4. **Error Handling:** Consistent with existing API patterns
5. **Response Format:** Uses `ApiResponse` helper

---

## 🚀 Ready to Use

The Help/Support Chat API is now fully integrated into your `ApiController` and uses the same authentication flow as all your other APIs. Test it with your JWT token!

**Date:** January 13, 2026  
**Status:** ✅ Working & Tested
