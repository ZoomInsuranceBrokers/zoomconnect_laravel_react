<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add columns only if they do not already exist
        if (!Schema::hasColumn('policy_master', 'is_twin_allowed')) {
            Schema::table('policy_master', function (Blueprint $table) {
                $table->boolean('is_twin_allowed')->default(0);
            });
        }

        if (!Schema::hasColumn('policy_master', 'natural_addition_allowed')) {
            Schema::table('policy_master', function (Blueprint $table) {
                $table->boolean('natural_addition_allowed')->default(0)->after('is_twin_allowed');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('policy_master', 'natural_addition_allowed')) {
            Schema::table('policy_master', function (Blueprint $table) {
                $table->dropColumn('natural_addition_allowed');
            });
        }

        if (Schema::hasColumn('policy_master', 'is_twin_allowed')) {
            Schema::table('policy_master', function (Blueprint $table) {
                $table->dropColumn('is_twin_allowed');
            });
        }
    }
};
