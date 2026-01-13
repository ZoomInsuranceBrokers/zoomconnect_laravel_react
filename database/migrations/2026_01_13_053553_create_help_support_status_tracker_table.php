<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Table: help_support_status_tracker
     * Purpose: Track all status changes for support tickets
     */
    public function up(): void
    {
        Schema::create('help_support_status_tracker', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_id')->index()->comment('Reference to help_support_chats.ticket_id');
            $table->enum('old_status', ['open', 'in_progress', 'resolved', 'closed'])->nullable()->comment('Previous status');
            $table->enum('new_status', ['open', 'in_progress', 'resolved', 'closed'])->comment('Updated status');
            $table->unsignedBigInteger('changed_by')->nullable()->comment('User who changed the status');
            $table->text('remarks')->nullable()->comment('Optional remarks for status change');
            $table->timestamps();
            
            // Index for fetching status history
            $table->index(['ticket_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('help_support_status_tracker');
    }
};
