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
        Schema::table('faq_master', function (Blueprint $table) {
            $table->string('icon_url')->nullable()->after('faq_description');
            $table->boolean('is_mobile')->default(false)->after('icon_url');
            $table->boolean('is_webportal')->default(false)->after('is_mobile');
            $table->boolean('is_website')->default(false)->after('is_webportal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faq_master', function (Blueprint $table) {
            $table->dropColumn(['icon_url', 'is_mobile', 'is_webportal', 'is_website']);
        });
    }
};
