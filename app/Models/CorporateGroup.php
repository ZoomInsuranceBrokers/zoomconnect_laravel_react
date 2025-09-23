<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CorporateGroup extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'corporate_groups';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'group_name',
        'remark',
        'logo',
        'is_active',
        'is_delete',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_active' => 'boolean',
        'is_delete' => 'boolean',
    ];
}
