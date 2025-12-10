<?php

namespace App\Http\Controllers;

use App\Models\RoleMaster;
use App\Models\SuperadminRolePermission;
use App\Models\RoutesMaster;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class RolePermissionController extends Controller
{
    /**
     * Display roles and permissions management page
     */
    public function index()
    {
        $roles = RoleMaster::active()
            ->orderBy('role_name', 'asc')
            ->get();

        // Debug: log what session contains when this route is hit
        Log::info('[RolePermissionController@index] Session data', [
            'superadmin_user' => session('superadmin_user'),
            'session_id' => session()->getId(),
            'all_session_keys' => array_keys(session()->all()),
        ]);

        // Also log Inertia shared props (what will be sent to client)
        try {
            $shared = Inertia::getShared();
            Log::info('[RolePermissionController@index] Inertia shared', ['shared_keys' => array_keys($shared), 'auth' => $shared['auth'] ?? null]);
        } catch (\Throwable $e) {
            Log::warning('[RolePermissionController@index] Failed to get Inertia shared: ' . $e->getMessage());
        }

        return Inertia::render('superadmin/admin/roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Display permission management page for a role
     */
    public function managePermissions($roleId)
    {
        $role = RoleMaster::findOrFail($roleId);

        return Inertia::render('superadmin/admin/roles/PermissionManagement', [
            'role' => $role,
            'roleId' => $roleId,
        ]);
    }

    /**
     * Get permissions for a specific role
     */
    public function getRolePermissions($roleId)
    {
        $permissions = SuperadminRolePermission::with('route')
            ->where('role_id', $roleId)
            ->get()
            ->groupBy('route.module');

        // Get all available routes grouped by module
        $allRoutes = RoutesMaster::active()
            ->orderBy('module', 'asc')
            ->orderBy('action', 'asc')
            ->get()
            ->groupBy('module');

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
            'allRoutes' => $allRoutes,
        ]);
    }

    /**
     * Update permissions for a role
     */
    public function updatePermissions(Request $request, $roleId)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*.route_id' => 'required|exists:routes_master,id',
            'permissions.*.is_allowed' => 'required|boolean',
        ]);

        try {
            DB::beginTransaction();

            $userId = session('superadmin_user_id', 1);
            $now = Carbon::now();

            foreach ($request->permissions as $permissionData) {
                SuperadminRolePermission::updateOrCreate(
                    [
                        'role_id' => $roleId,
                        'route_id' => $permissionData['route_id'],
                    ],
                    [
                        'is_allowed' => $permissionData['is_allowed'] ? 1 : 0,
                        'created_by' => $userId,
                        'created_on' => $now,
                        'updated_on' => $now,
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Permissions updated successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update permissions: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new role
     */
    public function createRole(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:255',
            'role_desc' => 'nullable|string|max:255',
        ]);

        try {
            $userId = session('superadmin_user_id', 1);
            $now = Carbon::now();

            // Get the next role_id
            $maxRoleId = RoleMaster::max('role_id') ?? 0;

            $role = RoleMaster::create([
                'role_id' => $maxRoleId + 1,
                'role_name' => $request->role_name,
                'role_desc' => $request->role_desc,
                'is_active' => 1,
                'is_delete' => 0,
                'created_by' => $userId,
                'created_on' => $now,
                'updated_on' => $now,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Role created successfully',
                'role' => $role,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create role: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a role
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role_name' => 'required|string|max:255',
            'role_desc' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        try {
            $role = RoleMaster::findOrFail($id);
            
            $role->update([
                'role_name' => $request->role_name,
                'role_desc' => $request->role_desc,
                'is_active' => $request->is_active ? 1 : 0,
                'updated_on' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Role updated successfully',
                'role' => $role,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update role: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a role (soft delete)
     */
    public function deleteRole($id)
    {
        try {
            $role = RoleMaster::findOrFail($id);
            
            $role->update([
                'is_delete' => 1,
                'updated_on' => Carbon::now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Role deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete role: ' . $e->getMessage(),
            ], 500);
        }
    }
}
