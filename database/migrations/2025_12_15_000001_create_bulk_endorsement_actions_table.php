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
        Schema::create('bulk_endorsement_actions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('endorsement_id');
            $table->enum('action_type', ['bulk_add', 'bulk_remove'])->default('bulk_add');
            $table->string('uploaded_file')->nullable();
            $table->string('inserted_data_file')->nullable();
            $table->string('not_inserted_data_file')->nullable();
            $table->integer('total_records')->default(0);
            $table->integer('inserted_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulk_endorsement_actions');
    }
};
