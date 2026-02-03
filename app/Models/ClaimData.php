<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClaimData extends Model
{
    use HasFactory;

    protected $table = 'claim_data';

    protected $fillable = [
        'cmp_id',
        'policy_id',
        'tpa_id',
        'emp_id',
        'relation_name',
        'policy_number',
        'uhid_member_id',
        'date_of_admission',
        'date_of_discharge',
        'hospital_name',
        'hospital_state',
        'hospital_city',
        'hospital_pin_code',
        'diagnosis',
        'claim_amount',
        'relation_with_patient',
        'mobile_no',
        'email',
        'claim_type',
        'emergency_contact_name',
        'category',
        'file_url',
        'file_name',
        'claim_status',
        'claim_no',
        'api_response',
    ];

    protected $casts = [
        'api_response' => 'array',
        'date_of_admission' => 'date',
        'date_of_discharge' => 'date',
        'claim_amount' => 'decimal:2',
    ];
}
