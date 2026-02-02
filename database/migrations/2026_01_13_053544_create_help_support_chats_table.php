<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Table: help_support_chats
     * Purpose: Store all chat messages (bot, user, support) and ticket conversations
     */
    public function up(): void
    {
        Schema::create('help_support_chats', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_id')->index()->comment('Unique ticket identifier for conversation thread');
            $table->unsignedBigInteger('user_id')->index()->comment('Authenticated user ID');
            $table->unsignedBigInteger('cmp_id')->nullable()->index()->comment('Company ID from company_master');
            $table->unsignedBigInteger('emp_id')->nullable()->index()->comment('Employee ID from company_employees');
            $table->enum('sender_type', ['user', 'bot', 'support'])->default('user')->comment('Message sender type');
            $table->text('message')->comment('Chat message content or JSON data');
            $table->string('state_key')->nullable()->comment('Chatbot flow state identifier');
            $table->boolean('is_resolved')->default(false)->index()->comment('Ticket resolution status');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open')->index()->comment('Current ticket status');
            $table->timestamps();
            
            // Add indexes for better query performance
            $table->index(['ticket_id', 'created_at']);
            $table->index(['user_id', 'is_resolved']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('help_support_chats');
    }
};
