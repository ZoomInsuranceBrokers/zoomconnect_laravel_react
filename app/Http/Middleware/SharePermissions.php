<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\PermissionService;
use App\Models\UserMaster;
use Illuminate\Support\Facades\Log;

class SharePermissions
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Match CheckPermission logic EXACTLY
        $roleId = session('superadmin_user');
        $user = null;
        $actualRoleId = null;
        
        if ($roleId && is_array($roleId) && isset($roleId['email'])) {
            $user = UserMaster::where('email', $roleId['email'])->first();
            $actualRoleId = $user ? $user->role_id : null;
        }

        // Compute auth payload immediately and share as a concrete value
        $auth = [
            'permissions' => ['routes' => [], 'modules' => [], 'routeKeys' => []],
            'roleId' => $actualRoleId,
            'userId' => $user ? $user->user_id : null,
            'user' => session('superadmin_user'),
            'currentRouteName' => $request->route() ? $request->route()->getName() : null,
            'currentPath' => $request->path(),
        ];

        if ($actualRoleId) {
            Log::info('[SharePermissions] computing permissions for role', ['roleId' => $actualRoleId, 'email' => $roleId['email'] ?? 'N/A']);
            $perms = PermissionService::getPermissionsForFrontend($actualRoleId);
            $auth['permissions']['routes'] = $perms['routes'] ?? [];
            $auth['permissions']['modules'] = $perms['modules'] ?? [];
            $auth['permissions']['routeKeys'] = array_keys($perms['routes'] ?? []);
            Log::info('[SharePermissions] computed permissions', [
                'route_count' => count($auth['permissions']['routes']),
                'sample_routes' => array_slice(array_keys($auth['permissions']['routes']), 0, 5)
            ]);
        } else {
            Log::warning('[SharePermissions] no roleId found', [
                'has_session_user' => !empty($roleId),
                'session_keys' => array_keys(session()->all())
            ]);
        }

        Inertia::share(['auth' => $auth]);

        return $next($request);
    }
}
