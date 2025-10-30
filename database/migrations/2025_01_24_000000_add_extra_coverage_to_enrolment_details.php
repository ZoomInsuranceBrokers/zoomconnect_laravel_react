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
            // Add new columns if they don't exist
            if (!Schema::hasColumn('enrolment_details', 'extra_coverage_options')) {
                $table->json('extra_coverage_options')->nullable()->after('enrolment_directory_name');
            }
            if (!Schema::hasColumn('enrolment_details', 'co_pay_options')) {
                $table->json('co_pay_options')->nullable()->after('extra_coverage_options');
            }
            if (!Schema::hasColumn('enrolment_details', 'maternity_options')) {
                $table->json('maternity_options')->nullable()->after('co_pay_options');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrolment_details', function (Blueprint $table) {
            $table->dropColumn(['extra_coverage_options', 'co_pay_options', 'maternity_options']);
        });
    }
};
