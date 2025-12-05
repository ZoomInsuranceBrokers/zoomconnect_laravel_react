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
<<<<<<< HEAD
if (Schema::hasTable('wellness_services')) {
        return;
    }

=======
>>>>>>> main
        Schema::create('wellness_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vendor_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('company_id')->default(0);
            $table->string('wellness_name');
            $table->string('icon_url')->nullable();
            $table->string('link')->nullable();
            $table->string('heading');
            $table->text('description')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('vendor_id')->references('id')->on('vendors');
            $table->foreign('category_id')->references('id')->on('wellness_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wellness_services');
    }
};
