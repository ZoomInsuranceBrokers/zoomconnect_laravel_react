<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Add 'is_wallet' column to 'enrolment_details' table after 'policy_end_date'
        Schema::table('enrolment_details', function (Blueprint $table) {
            $table->integer('is_wallet')->default(0)->after('policy_end_date');
        });

        // Add columns to 'enrolment_mapping_master' table after 'edit_option'
        Schema::table('enrolment_mapping_master', function (Blueprint $table) {
            $table->decimal('available_balance', 11, 2)->default(0.00)->after('edit_option');
            $table->decimal('used_balance', 11, 2)->default(0.00)->after('available_balance');
            $table->integer('wallet_assigned')->default(0)->after('used_balance');
        });
    }

    public function down(): void
    {
        // Remove 'is_wallet' column from 'enrolment_details' table
        Schema::table('enrolment_details', function (Blueprint $table) {
            $table->dropColumn('is_wallet');
        });

        // Remove columns from 'enrolment_mapping_master' table
        Schema::table('enrolment_mapping_master', function (Blueprint $table) {
            $table->dropColumn(['available_balance', 'used_balance', 'wallet_assigned']);
        });
    }
};
