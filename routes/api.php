<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    // Login Routes
    Route::post('/login/email', [App\Http\Controllers\ApiController::class, 'loginWithEmail'])->name('api.login.email');
    Route::post('/login/mobile', [App\Http\Controllers\ApiController::class, 'loginWithPhone'])->name('api.login.mobile');
    Route::post('/verify-otp', [App\Http\Controllers\ApiController::class, 'verifyOtp'])->name('api.verify.otp');

    // Employee Code Login Routes
    Route::get('/login/companies', [App\Http\Controllers\ApiController::class, 'getActiveCompanies'])->name('api.login.companies');
    Route::post('/login/employee-code', [App\Http\Controllers\ApiController::class, 'loginWithEmployeeCode'])->name('api.login.employee.code');

    // Public Routes
    Route::get('/faqs', [App\Http\Controllers\ApiController::class, 'getFaqs'])->name('api.faqs');

    // Protected Routes (require JWT token)
    Route::middleware([\App\Http\Middleware\ApiJwtMiddleware::class])->group(function () {
        Route::get('/profile', [App\Http\Controllers\ApiController::class, 'getProfile'])->name('api.profile');
        Route::get('/wellness-services', [App\Http\Controllers\ApiController::class, 'getWellnessServices'])->name('api.wellness.services');
        Route::get('/employee-policies', [App\Http\Controllers\ApiController::class, 'getEmployeePolicies'])->name('api.employee.policies');
        Route::post('/logout', [App\Http\Controllers\ApiController::class, 'logout'])->name('api.logout');
        Route::post('/verify-token', [App\Http\Controllers\ApiController::class, 'verifyToken'])->name('api.verify.token');
        Route::post('/download-ecard', [App\Http\Controllers\ApiController::class, 'downloadECard'])->name('api.download.ecard');
        // Add /device-token endpoint to save or remove device tokens for authenticated employee
        Route::post('/device-token', [App\Http\Controllers\ApiController::class, 'saveDeviceToken'])->name('api.device.token');

        // Reset Password Route
        Route::post('/reset-password', [App\Http\Controllers\ApiController::class, 'resetPassword'])->name('api.reset.password');

        // Policy details (uses JWT middleware to identify employee)
        Route::get('/policy-details/{policy}', [App\Http\Controllers\ApiController::class, 'getPolicyDetails'])->name('api.policy.details');

        // Download E-Card for employee
        Route::post('/download-ecard', [App\Http\Controllers\ApiController::class, 'downloadECard'])->name('api.download.ecard');

        Route::post('/get-banners', [App\Http\Controllers\ApiController::class, 'getBanners'])->name('api.get.banners');
        // ============================================
        // Help / Support Chat API Routes (Legacy)
        // ============================================
        Route::prefix('help')->group(function () {
            // Start a new help chat session
            Route::post('/start', [App\Http\Controllers\ApiController::class, 'startHelpChat'])
                ->name('api.help.start');

            // Continue existing chat conversation
            Route::post('/message', [App\Http\Controllers\ApiController::class, 'continueHelpChat'])
                ->name('api.help.message');

            // Get chat history for a specific ticket
            Route::get('/chat/{ticket_id}', [App\Http\Controllers\ApiController::class, 'getHelpChatHistory'])
                ->name('api.help.chat.history');

            // Get all tickets for the authenticated user
            Route::get('/tickets', [App\Http\Controllers\ApiController::class, 'getHelpTickets'])
                ->name('api.help.tickets');

            // Update ticket status (resolve, close, etc.)
            Route::patch('/ticket/{ticket_id}/status', [App\Http\Controllers\ApiController::class, 'updateHelpTicketStatus'])
                ->name('api.help.ticket.status');
        });

        // ============================================
        // Chatbot Conversation API Routes (Separate from Tickets)
        // ============================================
        Route::prefix('chatbot')->group(function () {
            // Get all chatbot conversations
            Route::get('/conversations', [App\Http\Controllers\ApiController::class, 'getChatbotConversations'])
                ->name('api.chatbot.conversations');

            // Start a new chatbot conversation
            Route::post('/start', [App\Http\Controllers\ApiController::class, 'startChatbot'])
                ->name('api.chatbot.start');

            // Process chatbot response
            Route::post('/respond', [App\Http\Controllers\ApiController::class, 'chatbotRespond'])
                ->name('api.chatbot.respond');

            // Get single chatbot conversation with all messages
            Route::get('/conversation/{conversationId}', [App\Http\Controllers\ApiController::class, 'getChatbotConversation'])
                ->name('api.chatbot.conversation');
        });

        // ============================================
        // Support Ticket API Routes (Escalation from Chatbot)
        // ============================================
        Route::prefix('support')->group(function () {
            // Create a new support ticket
            Route::post('/tickets', [App\Http\Controllers\ApiController::class, 'createSupportTicket'])
                ->name('api.support.ticket.create');

            // Get all support tickets
            Route::get('/tickets', [App\Http\Controllers\ApiController::class, 'getSupportTickets'])
                ->name('api.support.tickets');

            // Get ticket details with messages
            Route::get('/tickets/{ticketId}', [App\Http\Controllers\ApiController::class, 'getSupportTicketDetails'])
                ->name('api.support.ticket.details');

            // Add message to existing ticket
            Route::post('/tickets/{ticketId}/message', [App\Http\Controllers\ApiController::class, 'addSupportTicketMessage'])
                ->name('api.support.ticket.message');
        });

        // ============================================
        // Network Hospitals API Routes
        // ============================================
        Route::prefix('network-hospitals')->group(function () {
            // Get search options (states, cities, pincodes) for a policy
            Route::get('/search-options/{policy_id}', [App\Http\Controllers\ApiController::class, 'getNetworkHospitalSearchOptions'])
                ->name('api.network.hospitals.search.options');

            // Get network hospital list based on search criteria
            Route::post('/list', [App\Http\Controllers\ApiController::class, 'getNetworkHospitalList'])
                ->name('api.network.hospitals.list');
        });

        // ============================================
        // Survey API Routes
        // ============================================
        Route::prefix('surveys')->group(function () {
            // Get assigned surveys for the authenticated employee
            Route::get('/assigned', [App\Http\Controllers\ApiController::class, 'getAssignedSurveys'])
                ->name('api.surveys.assigned');

            // Get survey questions for a specific survey
            Route::post('/questions', [App\Http\Controllers\ApiController::class, 'getSurveyQuestions'])
                ->name('api.surveys.questions');

            // Submit survey responses
            Route::post('/submit', [App\Http\Controllers\ApiController::class, 'submitSurveyResponse'])
                ->name('api.surveys.submit');
        });

        // ============================================
        // Natural Addition API Routes
        // ============================================
        Route::prefix('natural-addition')->group(function () {
            // Add new dependent (spouse/child)
            Route::post('/', [App\Http\Controllers\ApiController::class, 'naturalAdditionStore'])
                ->name('api.natural.addition.store');

            // Update existing dependent
            Route::post('/edit', [App\Http\Controllers\ApiController::class, 'naturalAdditionUpdate'])
                ->name('api.natural.addition.update');

            // List all dependents for employee
            Route::post('/list', [App\Http\Controllers\ApiController::class, 'naturalAdditionList'])
                ->name('api.natural.addition.list');
        });

        // ============================================
        // Claim Details API Route
        // ============================================
        // Get all claims for authenticated employee
        Route::post('/claim-details', [App\Http\Controllers\ApiController::class, 'claimDetails'])
            ->name('api.claim.details');
    });
});
