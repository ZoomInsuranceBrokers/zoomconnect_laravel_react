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
        Schema::create('message_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Template name');
            $table->string('category')->comment('Template category');
            $table->string('subject')->comment('Email subject');
            $table->longText('body')->comment('HTML email template body');
            $table->boolean('is_logo_sent')->default(false)->comment('Whether to include logo');
            $table->enum('logo_position', ['top', 'bottom', 'left', 'right', 'center'])->nullable()->comment('Logo position in template');
            $table->boolean('is_company_logo_sent')->default(false)->comment('Whether to include company logo');
            $table->enum('company_logo_position', ['top', 'bottom', 'left', 'right', 'center'])->nullable()->comment('Company logo position in template');
            $table->string('banner_image')->nullable()->comment('Banner image path');
            $table->string('attachment')->nullable()->comment('Attachment file path');
            $table->boolean('status')->default(true)->comment('Template status (active/inactive)');
            $table->unsignedBigInteger('created_by')->nullable()->comment('User who created the template');
            $table->unsignedBigInteger('updated_by')->nullable()->comment('User who last updated the template');
            $table->timestamps();

            // Indexes for performance
            $table->index('category');
            $table->index('status');
            $table->index('created_by');
            $table->index('updated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_templates');
    }
};
