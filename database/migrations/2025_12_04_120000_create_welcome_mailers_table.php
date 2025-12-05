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
        Schema::create('welcome_mailers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('cmp_id')->nullable()->index();
            $table->unsignedBigInteger('policy_id')->nullable()->index();
            $table->unsignedBigInteger('endorsement_id')->nullable()->index();
            $table->unsignedBigInteger('template_id')->nullable()->index();
            $table->unsignedInteger('total_count')->default(0);
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('not_sent_count')->default(0);
            $table->text('subject')->nullable();
            $table->boolean('status')->default(true)->comment('1 = active, 0 = inactive');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('welcome_mailers');
    }
};
