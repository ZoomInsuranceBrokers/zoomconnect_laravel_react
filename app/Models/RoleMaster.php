<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleMaster extends Model
{
    protected $table = 'role_master';
    
    protected $primaryKey = 'id';
    
    public $timestamps = false;

    protected $fillable = [
        'role_id',
        'role_name',
        'role_desc',
        'is_active',
        'is_delete',
        'created_by',
        'created_on',
        'updated_on',
    ];

    protected $casts = [
        'role_id' => 'integer',
        'is_active' => 'integer',
        'is_delete' => 'integer',
        'created_by' => 'integer',
        'created_on' => 'datetime',
        'updated_on' => 'datetime',
    ];

    /**
     * Get all permissions for this role
     */
    public function permissions()
    {
        return $this->hasMany(SuperadminRolePermission::class, 'role_id', 'role_id');
    }

    /**
     * Check if role has permission for a specific route
     */
    public function hasRoutePermission($routeId)
    {
        return $this->permissions()
            ->where('route_id', $routeId)
            ->where('is_allowed', 1)
            ->exists();
    }

    /**
     * Check if role has permission by route name
     */
    public function hasPermissionByRouteName($routeName)
    {
        return $this->permissions()
            ->whereHas('route', function($q) use ($routeName) {
                $q->where('route_name', $routeName);
            })
            ->where('is_allowed', 1)
            ->exists();
    }

    /**
     * Scope to get only active roles
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1)->where('is_delete', 0);
    }
}
