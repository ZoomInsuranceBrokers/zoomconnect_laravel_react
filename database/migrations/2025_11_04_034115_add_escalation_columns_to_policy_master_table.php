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
        Schema::table('policy_master', function (Blueprint $table) {
            $table->unsignedBigInteger('data_escalation_id')->nullable()->after('updated_at');
            $table->unsignedBigInteger('claim_level_1_id')->nullable()->after('data_escalation_id');
            $table->unsignedBigInteger('claim_level_2_id')->nullable()->after('claim_level_1_id');

            $table->foreign('data_escalation_id')->references('id')->on('escalation_users');
            $table->foreign('claim_level_1_id')->references('id')->on('escalation_users');
            $table->foreign('claim_level_2_id')->references('id')->on('escalation_users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('policy_master', function (Blueprint $table) {
            $table->dropForeign(['data_escalation_id']);
            $table->dropForeign(['claim_level_1_id']);
            $table->dropForeign(['claim_level_2_id']);

            $table->dropColumn(['data_escalation_id', 'claim_level_1_id', 'claim_level_2_id']);
        });
    }
};
