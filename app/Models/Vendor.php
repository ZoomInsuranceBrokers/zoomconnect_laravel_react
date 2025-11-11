<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $table = 'vendors';

    protected $fillable = [
        'vendor_name',
        'logo_url',
        'is_active',
        'is_delete',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_delete' => 'boolean',
    ];

    /**
     * Scope to get only active vendors
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', 1)->where('is_delete', 0);
    }

    /**
     * Scope to get only non-deleted vendors
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('is_delete', 0);
    }

    /**
     * Get the logo URL attribute with full path
     */
    public function getLogoUrlAttribute($value)
    {
        if ($value && !str_starts_with($value, 'http')) {
            return asset($value);
        }
        return $value;
    }
}
