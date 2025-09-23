<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporateLabel extends Model
{
    use HasFactory;

    protected $table = 'corporate_labels';

    protected $fillable = [
        'label',
        'remark',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Scope to get only active labels
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get inactive labels
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}
