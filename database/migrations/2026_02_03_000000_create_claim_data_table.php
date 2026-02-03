<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClaimDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('claim_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cmp_id')->nullable();
            $table->unsignedBigInteger('policy_id')->nullable();
            $table->unsignedBigInteger('tpa_id')->nullable();
            $table->unsignedBigInteger('emp_id')->nullable();

            $table->string('relation_name')->nullable();
            $table->string('policy_number')->nullable();
            $table->string('uhid_member_id')->nullable();
            $table->date('date_of_admission')->nullable();
            $table->date('date_of_discharge')->nullable();

            $table->string('hospital_name')->nullable();
            $table->string('hospital_state')->nullable();
            $table->string('hospital_city')->nullable();
            $table->string('hospital_pin_code')->nullable();

            $table->text('diagnosis')->nullable();
            $table->decimal('claim_amount', 12, 2)->nullable();
            $table->string('relation_with_patient')->nullable();

            $table->string('mobile_no')->nullable();
            $table->string('email')->nullable();
            $table->string('claim_type')->nullable();
            $table->string('emergency_contact_name')->nullable();

            $table->string('category')->nullable();
            $table->string('file_url')->nullable();
            $table->string('file_name')->nullable();

            $table->string('claim_status')->nullable();
            $table->string('claim_no')->nullable();
            $table->json('api_response')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('claim_data');
    }
}
