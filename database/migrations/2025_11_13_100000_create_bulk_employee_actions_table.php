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
        Schema::create('bulk_employee_actions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comp_id');
            $table->enum('action_type', ['bulk_add', 'bulk_remove'])->default('bulk_add');
            $table->string('uploaded_file')->nullable(); // Original uploaded CSV
            $table->string('inserted_data_file')->nullable(); // CSV of successfully inserted records
            $table->string('not_inserted_data_file')->nullable(); // CSV of failed records
            $table->integer('total_records')->default(0);
            $table->integer('inserted_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            // Foreign keys
            // $table->foreign('comp_id')->references('comp_id')->on('company_master')->onDelete('cascade');
            // $table->foreign('created_by')->references('user_id')->on('users_master')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulk_employee_actions');
    }
};
