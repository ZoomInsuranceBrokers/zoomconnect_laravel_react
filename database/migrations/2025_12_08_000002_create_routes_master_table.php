<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routes_master', function (Blueprint $table) {
            $table->id();
            $table->string('route_name', 100)->unique();
            $table->string('route_path', 255);
            $table->string('module', 50);
            $table->string('action', 50);
            $table->string('method', 10)->default('GET'); // GET, POST, PUT, DELETE
            $table->text('description')->nullable();
            $table->tinyInteger('is_active')->default(1);
            $table->integer('created_by')->nullable();
            $table->timestamp('created_on')->useCurrent();
            $table->timestamp('updated_on')->useCurrent()->useCurrentOnUpdate();
            
            $table->index(['module', 'action']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routes_master');
    }
};
