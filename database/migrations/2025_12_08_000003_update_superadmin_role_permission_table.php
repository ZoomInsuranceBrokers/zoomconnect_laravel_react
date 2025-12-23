<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('superadmin_role_permission', function (Blueprint $table) {
            // Drop old columns if they exist
            if (Schema::hasColumn('superadmin_role_permission', 'module')) {
                $table->dropColumn(['module', 'action', 'route_name']);
            }
            
            // Add route_id column
            if (!Schema::hasColumn('superadmin_role_permission', 'route_id')) {
                $table->unsignedBigInteger('route_id')->after('role_id');
                $table->foreign('route_id')->references('id')->on('routes_master')->onDelete('cascade');
            }
        });

        // Update unique constraint
        Schema::table('superadmin_role_permission', function (Blueprint $table) {
            $table->dropIndex('unique_role_permission');
            $table->unique(['role_id', 'route_id'], 'unique_role_route');
        });
    }

    public function down(): void
    {
        Schema::table('superadmin_role_permission', function (Blueprint $table) {
            $table->dropForeign(['route_id']);
            $table->dropUnique('unique_role_route');
            $table->dropColumn('route_id');
            
            $table->string('module', 50);
            $table->string('action', 50);
            $table->string('route_name', 100)->nullable();
            $table->unique(['role_id', 'module', 'action'], 'unique_role_permission');
        });
    }
};
