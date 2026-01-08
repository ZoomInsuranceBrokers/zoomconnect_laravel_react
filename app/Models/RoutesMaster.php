<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoutesMaster extends Model
{
    protected $table = 'routes_master';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'route_name',
        'route_path',
        'module',
        'action',
        'method',
        'description',
        'is_active',
        'created_by',
        'created_on',
        'updated_on',
    ];

    protected $casts = [
        'is_active'  => 'integer',
        'created_by' => 'integer',
        'created_on' => 'datetime',
        'updated_on' => 'datetime',
    ];

    /**
     * Relationship: Route has many permissions
     */
    public function permissions()
    {
        return $this->hasMany(SuperadminRolePermission::class, 'route_id', 'id');
    }

    /**
     * Scope: Only active routes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    /**
     * Scope: Filter by module
     */
    public function scopeByModule($query, $module)
    {
        return $query->where('module', $module);
    }

    /**
     * Scope: Filter by action
     */
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope: Filter by method
     */
    public function scopeByMethod($query, $method)
    {
        return $query->where('method', $method);
    }
}
