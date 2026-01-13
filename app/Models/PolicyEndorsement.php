<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyEndorsement extends Model
{
    protected $table = 'policy_endorsements';
    protected $primaryKey = 'id';

    protected $fillable = [
        'policy_id',
        'cmp_id',
        'endorsement_date',
        'endorsement_no',
        'endorsement_copy',
        'endorsement_type',
        'status',
    ];

    public $timestamps = true;
    // Add relationship to PolicyMaster
    public function policy()
    {
        return $this->belongsTo(PolicyMaster::class, 'policy_id');
    }
}
