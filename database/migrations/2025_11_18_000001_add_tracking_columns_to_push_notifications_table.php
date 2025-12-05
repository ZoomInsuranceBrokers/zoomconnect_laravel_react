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
        Schema::table('push_notification', function (Blueprint $table) {
            $table->integer('sent_count')->default(0)->after('body')->comment('Number of notifications successfully sent');
            $table->integer('failed_count')->default(0)->after('sent_count')->comment('Number of notifications that failed to send');
            $table->integer('total_recipients')->default(0)->after('failed_count')->comment('Total number of target recipients');
            $table->enum('target_type', ['all', 'specific'])->default('all')->after('total_recipients')->comment('Target audience: all companies or specific');
            $table->json('company_ids')->nullable()->after('target_type')->comment('Array of company IDs if target_type is specific');
            $table->enum('status', ['draft', 'pending', 'processing', 'completed', 'failed'])->default('draft')->after('is_active')->comment('Processing status of notification');
            $table->unsignedBigInteger('created_by')->nullable()->after('status')->comment('User who created the notification');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by')->comment('User who last updated the notification');
            $table->text('image_url')->nullable()->after('body')->comment('Optional notification image URL');
            $table->string('notification_type')->default('general')->after('image_url')->comment('Type/category of notification');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('push_notifications', function (Blueprint $table) {
            $table->dropColumn([
                'sent_count',
                'failed_count',
                'total_recipients',
                'target_type',
                'company_ids',
                'status',
                'created_by',
                'updated_by',
                'image_url',
                'notification_type'
            ]);
        });
    }
};
