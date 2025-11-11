<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WellnessCategory extends Model
{
    use HasFactory;

    protected $table = 'wellness_categories';

    protected $fillable = [
        'category_name',
        'icon_url',
        'description',
        'status',
    ];

     protected $casts = [
        'status' => 'integer',
    ];

    /**
     * Scope to get only active categories
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}
