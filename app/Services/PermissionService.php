<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\RoutesMaster;

class PermissionService
{
    /**
     * Get all permissions for a specific role
     */
    public static function getRolePermissions($roleId)
    {
        if (!$roleId) {
            return [];
        }

        $permissions = DB::table('superadmin_role_permission as srp')
            ->join('routes_master as rm', 'srp.route_id', '=', 'rm.id')
            ->where('srp.role_id', $roleId)
            ->where('srp.is_allowed', 1)
            ->where('rm.is_active', 1)
            ->select('rm.route_name', 'rm.module', 'rm.action', 'rm.method')
            ->get();

        return $permissions;
    }

    /**
     * Check if a role has permission for a specific route
     */
    public static function hasPermission($roleId, $routeName)
    {
        if (!$roleId || !$routeName) {
            return false;
        }

        return DB::table('superadmin_role_permission as srp')
            ->join('routes_master as rm', 'srp.route_id', '=', 'rm.id')
            ->where('srp.role_id', $roleId)
            ->where('rm.route_name', $routeName)
            ->where('srp.is_allowed', 1)
            ->where('rm.is_active', 1)
            ->exists();
    }

    /**
     * Check if a role has permission for a specific module and action
     */
    public static function hasModulePermission($roleId, $module, $action)
    {
        if (!$roleId || !$module || !$action) {
            return false;
        }

        return DB::table('superadmin_role_permission as srp')
            ->join('routes_master as rm', 'srp.route_id', '=', 'rm.id')
            ->where('srp.role_id', $roleId)
            ->where('rm.module', $module)
            ->where('rm.action', $action)
            ->where('srp.is_allowed', 1)
            ->where('rm.is_active', 1)
            ->exists();
    }

    /**
     * Get permissions formatted for frontend
     */
    public static function getPermissionsForFrontend($roleId)
    {
        $permissions = self::getRolePermissions($roleId);
        
        $formatted = [
            'routes' => [],
            'modules' => []
        ];

        foreach ($permissions as $permission) {
            // Store by route name for easy lookup
            $formatted['routes'][$permission->route_name] = true;
            
            // Store by module.action for easier checks
            $key = $permission->module . '.' . $permission->action;
            $formatted['modules'][$key] = true;
        }

        return $formatted;
    }
}
