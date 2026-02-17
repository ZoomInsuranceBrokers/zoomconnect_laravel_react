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
        Schema::create('bulk_enrollment_actions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('enrollment_period_id');
            $table->string('uploaded_file')->nullable();
            $table->string('inserted_data_file')->nullable();
            $table->string('not_inserted_data_file')->nullable();
            $table->integer('total_records')->default(0);
            $table->integer('inserted_count')->default(0);
            $table->integer('failed_count')->default(0);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('enrollment_period_id')->references('id')->on('enrolment_period')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulk_enrollment_actions');
    }
};
