<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('endorsement_data', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->integer('emp_id');
            $table->integer('policy_id')->nullable();
            $table->integer('cmp_id')->nullable();
            $table->integer('mapping_id')->nullable();

            $table->integer('addition_endorsement_id');
            $table->integer('deletion_endorsement_id')->nullable();
            $table->integer('updation_endorsement_id')->nullable();
            $table->integer('updated_entry_id')->nullable();

            $table->integer('is_delete')->default(0);

            $table->string('remarks')->nullable();
            $table->string('insurer_code')->nullable();
            $table->string('uhid')->nullable();

            $table->string('insured_name')->nullable();
            $table->string('gender')->nullable();
            $table->string('relation')->nullable();
            $table->date('dob')->nullable();
            $table->string('unique_relation_id')->nullable();
            $table->integer('rank')->nullable();

            $table->date('date_of_joining')->nullable();
            $table->date('date_of_leaving')->nullable();

            // Base
            $table->decimal('base_sum_insured', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('base_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('pro_rata_base_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('pro_rata_base_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('refund_base_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('refund_base_premium_on_employee', 11, 2)->default(0.00);

            // Topup
            $table->decimal('topup_sum_insured', 11, 2)->default(0.00);
            $table->decimal('topup_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('topup_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('pro_rata_topup_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('pro_rata_topup_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('refund_topup_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('refund_topup_premium_on_employee', 11, 2)->default(0.00);

            // Parent
            $table->decimal('parent_sum_insured', 11, 2)->default(0.00);
            $table->decimal('parent_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('parent_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('pro_rata_parent_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('pro_rata_parent_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('refund_parent_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('refund_parent_premium_on_employee', 11, 2)->default(0.00);

            // Parent In-Law
            $table->decimal('parent_in_law_sum_insured', 11, 2)->default(0.00);
            $table->decimal('parent_in_law_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('parent_in_law_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('pro_rata_parent_in_law_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('pro_rata_parent_in_law_premium_on_employee', 11, 2)->default(0.00);
            $table->decimal('refund_parent_in_law_premium_on_company', 11, 2)->default(0.00);
            $table->decimal('refund_parent_in_law_premium_on_employee', 11, 2)->default(0.00);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('endorsement_data');
    }
};
