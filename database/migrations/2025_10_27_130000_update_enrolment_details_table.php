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
            // Drop unnecessary columns
            if (Schema::hasColumn('enrolment_details', 'config_id')) {
                $table->dropColumn('config_id');
            }
            // Keep rator_type to save the rating type selected in frontend
            // (Simple Plan, Age-Based Plan, Per Life, Floater, Relation Wise, Flexi Plan, Base Sum Insured Type)
            if (Schema::hasColumn('enrolment_details', 'enrolment_rator')) {
                $table->dropColumn('enrolment_rator');
            }
            if (Schema::hasColumn('enrolment_details', 'gmc_rator')) {
                $table->dropColumn('gmc_rator');
            }
            if (Schema::hasColumn('enrolment_details', 'gpa_rator')) {
                $table->dropColumn('gpa_rator');
            }
            if (Schema::hasColumn('enrolment_details', 'gtl_rator')) {
                $table->dropColumn('gtl_rator');
            }

            // Add new columns for comprehensive enrollment data
            $table->json('rating_config')->nullable()->after('family_defination');
            $table->json('extra_coverage_plans')->nullable()->after('rating_config');
            $table->json('mail_configuration')->nullable()->after('extra_coverage_plans');

            // Step 6: Additional Settings
            $table->boolean('twin_allowed')->default(false)->after('mail_configuration');
            $table->json('enrollment_statements')->nullable()->after('twin_allowed');

            // Reminder Mail Configuration - easy to understand boolean flags
            $table->boolean('reminder_mail_enable')->default(false)->after('enrollment_statements');
            $table->string('frequency_of_reminder_mail')->nullable()->after('reminder_mail_enable'); // daily, weekly, monthly, custom
            $table->integer('frequency_days')->nullable()->after('frequency_of_reminder_mail'); // specific days count for custom frequency
            $table->boolean('send_welcome_mail')->default(false)->after('frequency_days');
            $table->boolean('send_confirmation_mail')->default(false)->after('send_welcome_mail');
            $table->boolean('send_deadline_reminder')->default(false)->after('send_confirmation_mail');
            $table->boolean('send_completion_mail')->default(false)->after('send_deadline_reminder');
            $table->integer('reminder_before_deadline_days')->nullable()->after('send_completion_mail'); // days before deadline to send reminder
            $table->text('custom_reminder_message')->nullable()->after('reminder_before_deadline_days');
            $table->boolean('auto_reminder_enable')->default(false)->after('custom_reminder_message'); // auto send reminders
            $table->boolean('manual_reminder_enable')->default(false)->after('auto_reminder_enable'); // manual trigger reminders
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enrolment_details', function (Blueprint $table) {
            // Add back the old columns (except rator_type which we kept)
            $table->unsignedBigInteger('config_id')->nullable()->after('cmp_id');
            $table->json('enrolment_rator')->nullable()->after('rator_type');
            $table->string('gmc_rator')->nullable()->after('policy_end_date');
            $table->string('gpa_rator')->nullable()->after('gmc_rator');
            $table->string('gtl_rator')->nullable()->after('gpa_rator');

            // Drop the new columns
            $table->dropColumn([
                'rating_config',
                'extra_coverage_plans',
                'mail_configuration',
                'twin_allowed',
                'enrollment_statements',
                'reminder_mail_enable',
                'frequency_of_reminder_mail',
                'frequency_days',
                'send_welcome_mail',
                'send_confirmation_mail',
                'send_deadline_reminder',
                'send_completion_mail',
                'reminder_before_deadline_days',
                'custom_reminder_message',
                'auto_reminder_enable',
                'manual_reminder_enable'
            ]);
        });
    }
};
