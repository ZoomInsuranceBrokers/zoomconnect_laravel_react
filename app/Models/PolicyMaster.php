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
        'is_paperless',
        'doc_courier_name',
        'doc_courier_address',
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
        'data_escalation_id',
        'claim_level_1_id',
        'claim_level_2_id',
        'sales_rm_id',
        'service_rm_id',
        'sales_vertical_id',
        'is_twin_allowed',
        'natural_addition_allowed',
    ];

    public function insurance()
    {
        return $this->belongsTo(InsuranceMaster::class, 'ins_id', 'id');
    }

    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'comp_id', 'comp_id');
    }

    public function dataEscalationUser()
    {
        return $this->belongsTo(EscalationUser::class, 'data_escalation_id', 'id');
    }

    public function claimLevel1User()
    {
        return $this->belongsTo(EscalationUser::class, 'claim_level_1_id', 'id');
    }

    public function claimLevel2User()
    {
        return $this->belongsTo(EscalationUser::class, 'claim_level_2_id', 'id');
    }

    public function tpa()
    {
        return $this->belongsTo(TpaMaster::class, 'tpa_id', 'id');
    }
}
