<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RoleMaster;
use App\Models\RoutesMaster;
use App\Models\UserMaster;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $routeName = null)
    {
        // Get the current user's role_id from session
        $roleId = session('superadmin_user');
        $user = UserMaster::where('email', $roleId['email'])->first();
        $roleId = $user ? $user->role_id : null;
        
        if (!$roleId) {
            // If no role in session, deny access
            return response()->json(['error' => 'Unauthorized - No role assigned'], 403);
        }

        // Get the route name to check
        $currentRouteName = $routeName ?? $request->route()->getName();
        
        if (!$currentRouteName) {
            // If no route name, allow (for unnamed routes)
            return $next($request);
        }

        // Find the route in routes_master
        $route = RoutesMaster::where('route_name', $currentRouteName)
            ->where('is_active', 1)
            ->first();

        if (!$route) {
            // Route not found in master table, allow access (backward compatibility)
            return $next($request);
        }

        // Check if the role has permission for this route
        $hasPermission = DB::table('superadmin_role_permission')
            ->where('role_id', $roleId)
            ->where('route_id', $route->id)
            ->where('is_allowed', 1)
            ->exists();

        if (!$hasPermission) {
            // User doesn't have permission
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['error' => 'Forbidden - Insufficient permissions'], 403);
            }
            
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
