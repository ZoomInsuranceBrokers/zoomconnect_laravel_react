<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HelpSupportChat;
use App\Models\HelpSupportStatusTracker;
use App\Models\CompanyUser;
use App\Models\CompanyEmployee;
use App\Mail\SupportTicketMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Helpers\ApiResponse;

/**
 * HelpSupportController
 * 
 * Manages the Help/Support Chat API system with:
 * - Chatbot flow with predefined Q&A
 * - Ticket-based support system
 * - Email notifications for unresolved queries
 * 
 * @author ZoomConnect Development Team
 */
class HelpSupportController extends Controller
{
    /**
     * Predefined chatbot flow configuration
     * Contains all questions, answers, and navigation paths
     */
    private function getChatbotFlow(): array
    {
        return [
            'start' => [
                'message' => 'Hello! How can I assist you with your insurance policy today?',
                'options' => [
                    ['id' => 'policy_details', 'label' => 'My Policy Details', 'next' => 'policy_flow'],
                    ['id' => 'claims', 'label' => 'Claims & Reimbursement', 'next' => 'claims_flow'],
                    ['id' => 'ecard', 'label' => 'Download E-Card', 'next' => 'ecard_action'],
                    ['id' => 'network', 'label' => 'Network Hospitals', 'next' => 'network_action'],
                ],
            ],

            'policy_flow' => [
                'message' => 'Sure, what specifically would you like to know about your policy?',
                'options' => [
                    ['id' => 'coverage', 'label' => 'View Coverage', 'next' => 'coverage_info'],
                    ['id' => 'dependants', 'label' => 'Add/View Dependants', 'next' => 'dependants_info'],
                    ['id' => 'end_date', 'label' => 'Policy Expiry Date', 'next' => 'expiry_info'],
                ],
            ],

            'claims_flow' => [
                'message' => 'I can help with claims. What is your query?',
                'options' => [
                    ['id' => 'status', 'label' => 'Check Claim Status', 'next' => 'status_check'],
                    ['id' => 'file_new', 'label' => 'How to file a claim?', 'next' => 'file_claim_info'],
                    ['id' => 'rejected', 'label' => 'Why was my claim rejected?', 'next' => 'rejection_info'],
                ],
            ],

            // Terminal nodes (no further options)
            'coverage_info' => [
                'message' => 'Your policy covers hospitalization, pre/post-hospitalization expenses, and daycare procedures up to ₹5 Lakhs.',
                'options' => [],
            ],
            'dependants_info' => [
                'message' => 'You can view or add dependants from the \'My Policy\' section in the app.',
                'options' => [],
            ],
            'expiry_info' => [
                'message' => 'Your current policy is valid until 31st March 2026.',
                'options' => [],
            ],
            'ecard_action' => [
                'message' => 'You can download your E-Card from the \'E-Card\' section in the dashboard.',
                'options' => [],
            ],
            'network_action' => [
                'message' => 'Use the Network Hospital locator on the dashboard to find nearby hospitals.',
                'options' => [],
            ],
            'status_check' => [
                'message' => 'Please provide your Claim Intimation Number to check the status.',
                'options' => [],
            ],
            'file_claim_info' => [
                'message' => 'To file a claim, upload your hospital bills within 30 days of discharge through the Claims section.',
                'options' => [],
            ],
            'rejection_info' => [
                'message' => 'Claims may be rejected due to missing documents, non-covered treatments, or incomplete information.',
                'options' => [],
            ],
        ];
    }

    /**
     * Start a new help chat session
     * 
     * Creates a new ticket and returns the initial chatbot message
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function startChat(Request $request)
    {
        try {
            $userId = auth()->id();
            
            if (!$userId) {
                return ApiResponse::error('Unauthorized. Please login to continue.', 401);
            }

            // Get user details
            $user = CompanyUser::find($userId);
            $employee = CompanyEmployee::where('user_id', $userId)->first();

            // Generate unique ticket ID
            $ticketId = HelpSupportChat::generateTicketId();

            // Get chatbot flow
            $chatbotFlow = $this->getChatbotFlow();
            $initialState = $chatbotFlow['start'];

            // Save bot's initial message
            HelpSupportChat::create([
                'ticket_id' => $ticketId,
                'user_id' => $userId,
                'cmp_id' => $user->cmp_id ?? null,
                'emp_id' => $employee->emp_id ?? null,
                'sender_type' => 'bot',
                'message' => json_encode([
                    'text' => $initialState['message'],
                    'options' => $initialState['options'],
                ]),
                'state_key' => 'start',
                'is_resolved' => false,
                'status' => 'open',
            ]);

            // Track initial status
            HelpSupportStatusTracker::trackStatusChange(
                $ticketId,
                null,
                'open',
                $userId,
                'Chat session started'
            );

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'message' => $initialState['message'],
                'options' => $initialState['options'],
                'state_key' => 'start',
            ], 'Chat session started successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to start chat: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Continue chat conversation
     * 
     * Handles user responses and returns next chatbot message
     * Or allows user to submit a free text message for support
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function continueChat(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'ticket_id' => 'required|string|exists:help_support_chats,ticket_id',
                'state_key' => 'nullable|string',
                'selected_option_id' => 'nullable|string',
                'free_text_message' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', 422, $validator->errors());
            }

            $userId = auth()->id();
            $ticketId = $request->ticket_id;
            $stateKey = $request->state_key;
            $selectedOptionId = $request->selected_option_id;
            $freeTextMessage = $request->free_text_message;

            // Verify ticket belongs to user
            $existingChat = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->first();

            if (!$existingChat) {
                return ApiResponse::error('Invalid ticket or unauthorized access', 403);
            }

            $chatbotFlow = $this->getChatbotFlow();

            // Case 1: User is typing a free text message (unresolved query)
            if ($freeTextMessage) {
                return $this->handleFreeTextMessage($ticketId, $userId, $freeTextMessage, $existingChat);
            }

            // Case 2: User selected an option from chatbot
            if ($selectedOptionId && $stateKey) {
                return $this->handleChatbotOption($ticketId, $userId, $stateKey, $selectedOptionId, $chatbotFlow, $existingChat);
            }

            return ApiResponse::error('Please provide either selected_option_id or free_text_message', 400);

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to process chat: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle chatbot option selection
     * 
     * @param string $ticketId
     * @param int $userId
     * @param string $stateKey
     * @param string $selectedOptionId
     * @param array $chatbotFlow
     * @param HelpSupportChat $existingChat
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleChatbotOption($ticketId, $userId, $stateKey, $selectedOptionId, $chatbotFlow, $existingChat)
    {
        // Get current state from chatbot flow
        if (!isset($chatbotFlow[$stateKey])) {
            return ApiResponse::error('Invalid state key', 400);
        }

        $currentState = $chatbotFlow[$stateKey];
        
        // Find the selected option
        $selectedOption = collect($currentState['options'])->firstWhere('id', $selectedOptionId);

        if (!$selectedOption) {
            return ApiResponse::error('Invalid option selected', 400);
        }

        // Save user's selection
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'user',
            'message' => json_encode([
                'selected_option' => $selectedOption['label'],
                'option_id' => $selectedOptionId,
            ]),
            'state_key' => $stateKey,
            'is_resolved' => false,
            'status' => $existingChat->status,
        ]);

        // Get next state
        $nextStateKey = $selectedOption['next'];
        
        if (!isset($chatbotFlow[$nextStateKey])) {
            return ApiResponse::error('Invalid next state', 500);
        }

        $nextState = $chatbotFlow[$nextStateKey];

        // Save bot's response
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'bot',
            'message' => json_encode([
                'text' => $nextState['message'],
                'options' => $nextState['options'],
            ]),
            'state_key' => $nextStateKey,
            'is_resolved' => false,
            'status' => $existingChat->status,
        ]);

        // Check if this is a terminal node (no more options)
        $isTerminal = empty($nextState['options']);

        return ApiResponse::success([
            'ticket_id' => $ticketId,
            'message' => $nextState['message'],
            'options' => $nextState['options'],
            'state_key' => $nextStateKey,
            'is_terminal' => $isTerminal,
            'show_write_to_support' => $isTerminal, // Show "Write to Support" if no more options
        ], 'Chat continued successfully');
    }

    /**
     * Handle free text message (unresolved query)
     * 
     * Creates a support ticket and sends email to support team
     * 
     * @param string $ticketId
     * @param int $userId
     * @param string $message
     * @param HelpSupportChat $existingChat
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleFreeTextMessage($ticketId, $userId, $message, $existingChat)
    {
        // Get user details
        $user = CompanyUser::find($userId);
        $employee = CompanyEmployee::where('user_id', $userId)->first();

        // Save user's free text message
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'user',
            'message' => $message,
            'state_key' => 'user_query',
            'is_resolved' => false,
            'status' => 'in_progress',
        ]);

        // Update ticket status to in_progress
        HelpSupportChat::where('ticket_id', $ticketId)
            ->update(['status' => 'in_progress']);

        // Track status change
        HelpSupportStatusTracker::trackStatusChange(
            $ticketId,
            $existingChat->status,
            'in_progress',
            $userId,
            'User submitted unresolved query'
        );

        // Send email to support team
        try {
            $companyName = $user->company->cmp_name ?? 'N/A';
            
            Mail::to(config('mail.support_email', 'support@zoomconnect.com'))
                ->send(new SupportTicketMail(
                    $ticketId,
                    $user->name ?? 'User',
                    $user->email ?? 'N/A',
                    $message,
                    $companyName,
                    $employee->emp_id ?? null
                ));
        } catch (\Exception $e) {
            // Log email error but don't fail the request
            \Log::error('Failed to send support ticket email: ' . $e->getMessage());
        }

        // Save bot acknowledgment
        $acknowledgmentMessage = "Thank you for reaching out! Your ticket ({$ticketId}) has been created and sent to our support team. They will respond to you shortly.";
        
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'bot',
            'message' => json_encode([
                'text' => $acknowledgmentMessage,
                'options' => [],
            ]),
            'state_key' => 'ticket_created',
            'is_resolved' => false,
            'status' => 'in_progress',
        ]);

        return ApiResponse::success([
            'ticket_id' => $ticketId,
            'message' => $acknowledgmentMessage,
            'status' => 'in_progress',
            'email_sent' => true,
        ], 'Support ticket created successfully');
    }

    /**
     * Get chat history for a specific ticket
     * 
     * @param string $ticketId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getChatHistory($ticketId)
    {
        try {
            $userId = auth()->id();

            // Verify ticket belongs to user
            $ticketExists = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->exists();

            if (!$ticketExists) {
                return ApiResponse::error('Invalid ticket or unauthorized access', 403);
            }

            // Get all chat messages for this ticket
            $chatHistory = HelpSupportChat::where('ticket_id', $ticketId)
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($chat) {
                    // Decode message if it's JSON
                    $message = $chat->message;
                    if ($this->isJson($message)) {
                        $message = json_decode($message, true);
                    }

                    return [
                        'id' => $chat->id,
                        'sender_type' => $chat->sender_type,
                        'message' => $message,
                        'state_key' => $chat->state_key,
                        'timestamp' => $chat->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            // Get status history
            $statusHistory = HelpSupportStatusTracker::getTicketHistory($ticketId);

            // Get ticket metadata
            $ticketInfo = HelpSupportChat::where('ticket_id', $ticketId)
                ->first();

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'status' => $ticketInfo->status,
                'is_resolved' => $ticketInfo->is_resolved,
                'created_at' => $ticketInfo->created_at->format('Y-m-d H:i:s'),
                'chat_history' => $chatHistory,
                'status_history' => $statusHistory,
            ], 'Chat history retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve chat history: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get all tickets for the authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserTickets(Request $request)
    {
        try {
            $userId = auth()->id();
            $status = $request->query('status'); // Optional filter by status

            $query = HelpSupportChat::where('user_id', $userId)
                ->select('ticket_id', 'status', 'is_resolved', 'created_at', 'updated_at')
                ->groupBy('ticket_id', 'status', 'is_resolved', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            $tickets = $query->get()->map(function ($ticket) {
                return [
                    'ticket_id' => $ticket->ticket_id,
                    'status' => $ticket->status,
                    'is_resolved' => $ticket->is_resolved,
                    'created_at' => $ticket->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $ticket->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            return ApiResponse::success([
                'tickets' => $tickets,
                'total' => $tickets->count(),
            ], 'Tickets retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve tickets: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update ticket status
     * 
     * @param Request $request
     * @param string $ticketId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTicketStatus(Request $request, $ticketId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:open,in_progress,resolved,closed',
                'remarks' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', 422, $validator->errors());
            }

            $userId = auth()->id();
            $newStatus = $request->status;
            $remarks = $request->remarks;

            // Verify ticket belongs to user
            $ticket = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->first();

            if (!$ticket) {
                return ApiResponse::error('Invalid ticket or unauthorized access', 403);
            }

            $oldStatus = $ticket->status;

            // Update all chats for this ticket
            HelpSupportChat::where('ticket_id', $ticketId)
                ->update([
                    'status' => $newStatus,
                    'is_resolved' => in_array($newStatus, ['resolved', 'closed']),
                ]);

            // Track status change
            HelpSupportStatusTracker::trackStatusChange(
                $ticketId,
                $oldStatus,
                $newStatus,
                $userId,
                $remarks
            );

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ], 'Ticket status updated successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update ticket status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Check if a string is valid JSON
     * 
     * @param string $string
     * @return bool
     */
    private function isJson($string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
