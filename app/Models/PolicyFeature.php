<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolicyFeature extends Model
{
    use HasFactory;

    protected $table = 'policy_feature';

    protected $fillable = [
        'policy_id',
        'feature_type',
        'feature_title',
        'feature_desc',
        'icon_type',
        'icon_data',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the policy that owns the feature.
     */
    public function policy()
    {
        return $this->belongsTo(PolicyMaster::class, 'policy_id');
    }
}
