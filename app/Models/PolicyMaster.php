<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PolicyMaster extends Model
{
    use HasFactory;

    protected $table = 'policy_master';

    protected $primaryKey = 'id';

    public $timestamps = false; // because we are not using Laravel default created_at

    protected $fillable = [
        'comp_id',
        'policy_config',
        'policy_selection',
        'interval_period',
        'creation_status',
        'policy_name',
        'corporate_policy_name',
        'policy_number',
        'family_defination',
        'policy_type',
        'policy_type_definition',
        'policy_start_date',
        'policy_end_date',
        'policy_document',
        'policy_directory_name',
        'policy_status',
        'ins_id',
        'tpa_id',
        'cd_ac_id',
        'is_ready',
        'is_active',
        'is_old',
        'created_on',
        'updated_at',
    ];

    public function insurance()
    {
        return $this->belongsTo(InsuranceMaster::class, 'ins_id', 'id');
    }
}
