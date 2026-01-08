<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('new_enrolment_data', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('emp_id')->index();
            $table->integer('cmp_id')->nullable()->index();
            $table->integer('enrolment_id')->nullable()->index();
            $table->integer('enrolment_portal_id')->nullable()->index();
            $table->integer('enrolment_mapping_id')->nullable()->index();

            $table->string('insured_name')->nullable()->index();
            $table->string('gender')->nullable()->index();
            $table->string('relation')->nullable()->index();
            $table->string('detailed_relation')->nullable()->index();

            $table->date('dob')->nullable()->index();
            $table->date('date_of_joining')->nullable()->index();

            $table->decimal('base_sum_insured', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_employee', 11, 2)->default(0.00);

            $table->string('base_plan_name')->nullable();
            $table->string('extra_coverage_plan_name')->nullable();

            $table->decimal('extra_coverage_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('extra_coverage_premium_on_employee', 11, 2)->default(0.00);

            $table->integer('is_edit')->default(0)->index();
            $table->integer('is_delete')->default(0)->index();

            $table->string('created_by')->nullable()->index();
            $table->string('updated_by')->nullable()->index();

            $table->dateTime('created_at')->useCurrent()->index();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('new_enrolment_data');
    }
};
