<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UpdatedSuperadminRolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $userId = 1;
        $roleId = 13; // Super Admin role

        // Get all route IDs
        $routes = DB::table('routes_master')->where('is_active', 1)->get();

        $permissions = [];
        foreach ($routes as $route) {
            $permissions[] = [
                'role_id' => $roleId,
                'route_id' => $route->id,
                'is_allowed' => 1,
                'created_by' => $userId,
                'created_on' => $now,
                'updated_on' => $now,
            ];
        }

        DB::table('superadmin_role_permission')->insert($permissions);

        $this->command->info('Successfully granted all permissions to role_id ' . $roleId);
        $this->command->info('Total permissions granted: ' . count($permissions));
    }
}
