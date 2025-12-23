<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RoleMaster;

class SuperadminRolePermission extends Model
{
    protected $table = 'superadmin_role_permission';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'role_id',
        'route_id',
        'is_allowed',
        'created_by',
        'created_on',
        'updated_on',
    ];

    protected $casts = [
        'role_id'     => 'integer',
        'route_id'    => 'integer',
        'is_allowed'  => 'integer',
        'created_by'  => 'integer',
        'created_on'  => 'datetime',
        'updated_on'  => 'datetime',
    ];

    /**
     * Relationship: Permission belongs to a Role
     */
    public function role()
    {
        return $this->belongsTo(RoleMaster::class, 'role_id', 'id');
    }

    /**
     * Relationship: Permission belongs to a Route
     */
    public function route()
    {
        return $this->belongsTo(RoutesMaster::class, 'route_id', 'id');
    }

    /**
     * Scope: Only allowed permissions
     */
    public function scopeAllowed($query)
    {
        return $query->where('is_allowed', 1);
    }

    /**
     * Scope: Filter by route ID
     */
    public function scopeForRoute($query, $routeId)
    {
        return $query->where('route_id', $routeId);
    }
}
