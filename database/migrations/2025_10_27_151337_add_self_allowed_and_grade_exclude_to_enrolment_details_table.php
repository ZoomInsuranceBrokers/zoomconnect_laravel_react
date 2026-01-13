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
        Schema::table('enrolment_details', function (Blueprint $table) {
            // Add self allowed by default option
            $table->boolean('is_self_allowed_by_default')->default(true)->after('twin_allowed');

            // // Add grade exclude option - JSON field to store multiple grades
            $table->json('grade_exclude')->nullable()->after('is_self_allowed_by_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrolment_details', function (Blueprint $table) {
            $table->dropColumn(['is_self_allowed_by_default', 'grade_exclude']);
        });
    }
};
