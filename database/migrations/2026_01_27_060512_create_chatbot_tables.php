<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Chatbot Conversations Table
        Schema::create('chatbot_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('conversation_id')->unique();
            $table->unsignedBigInteger('emp_id');
            $table->unsignedBigInteger('cmp_id');
            $table->string('current_state')->default('start');
            $table->boolean('is_completed')->default(false);
            $table->timestamps();
            
            $table->index(['emp_id', 'cmp_id']);
            $table->index('conversation_id');
        });

        // Chatbot Messages Table
        Schema::create('chatbot_messages', function (Blueprint $table) {
            $table->id();
            $table->string('conversation_id');
            $table->enum('sender_type', ['user', 'bot']);
            $table->text('message');
            $table->json('options')->nullable();
            $table->string('state')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('conversation_id');
            $table->foreign('conversation_id')
                  ->references('conversation_id')
                  ->on('chatbot_conversations')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatbot_messages');
        Schema::dropIfExists('chatbot_conversations');
    }
};
