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
        Schema::create('enrollment_data', function (Blueprint $table) {
            $table->id(); // bigint UNSIGNED AUTO_INCREMENT
            $table->integer('emp_id');
            $table->integer('cmp_id')->nullable();
            $table->integer('enrolment_id')->nullable();
            $table->integer('enrolment_portal_id')->nullable();
            $table->integer('enrolment_mapping_id')->nullable();
            $table->string('insured_name')->nullable();
            $table->string('gender')->nullable();
            $table->string('relation')->nullable();
            $table->string('detailed_relation')->nullable();
            $table->date('dob')->nullable();
            $table->date('date_of_joining')->nullable();

            // Base coverage columns
            $table->decimal('base_sum_insured', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_employee', 11, 2)->default(0.00);

            // Top-up coverage columns
            $table->decimal('topup_sum_insured', 11, 2)->default(0.00);
            $table->decimal('topup_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('topup_premium_on_employee', 11, 2)->default(0.00);

            // Extra coverage plan columns
            $table->string('extra_coverage_plan')->nullable()->comment('Selected extra coverage plan name/type');
            $table->decimal('extra_coverage_premium', 11, 2)->default(0.00)->comment('Premium amount for extra coverage plan');

            // System columns
            $table->integer('is_edit')->default(0);
            $table->integer('is_delete')->default(0);
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            // Indexes for better performance
            $table->index('emp_id');
            $table->index('cmp_id');
            $table->index('enrolment_id');
            $table->index('enrolment_portal_id');
            $table->index(['emp_id', 'enrolment_portal_id'], 'emp_portal_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_data');
    }
};
