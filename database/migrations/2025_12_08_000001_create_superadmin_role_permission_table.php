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
        Schema::create('superadmin_role_permission', function (Blueprint $table) {
            $table->id();
            $table->integer('role_id')->index();
            $table->string('module', 100)->index(); // e.g., 'dashboard', 'companies', 'employees', etc.
            $table->string('action', 50)->index(); // e.g., 'view', 'create', 'edit', 'delete', 'export', etc.
            $table->string('route_name', 255)->nullable(); // Laravel route name for reference
            $table->tinyInteger('is_allowed')->default(0); // 0 = denied, 1 = allowed
            $table->integer('created_by')->nullable();
            $table->datetime('created_on')->nullable();
            $table->datetime('updated_on')->nullable();
            
            // Composite index for fast permission checks
            $table->index(['role_id', 'module', 'action'], 'idx_role_module_action');
            
            // Prevent duplicate permissions
            $table->unique(['role_id', 'module', 'action'], 'unique_role_permission');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('superadmin_role_permission');
    }
};
