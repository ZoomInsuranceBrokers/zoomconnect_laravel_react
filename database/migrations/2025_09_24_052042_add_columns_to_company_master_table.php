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
        Schema::table('company_master', function (Blueprint $table) {
            $table->unsignedBigInteger('sales_vertical_id')->nullable()->after('sales_rm_id');
            $table->unsignedBigInteger('label_id')->nullable()->after('sales_vertical_id');
            $table->unsignedBigInteger('group_id')->nullable()->after('label_id');
            $table->string('phone')->nullable()->after('group_id');
            $table->string('email')->nullable()->after('phone');
            $table->string('source')->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_master', function (Blueprint $table) {
            $table->dropColumn(['sales_vertical_id', 'label_id', 'group_id']);
        });
    }
};
