<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EscalationUser extends Model
{
    use HasFactory;

    protected $table = 'escalation_users';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'designation',
        'department',
        'is_active',
        'created_at',
        'updated_at',
    ];

    public function policiesAsDataEscalation()
    {
        return $this->hasMany(PolicyMaster::class, 'data_escalation_id', 'id');
    }

    public function policiesAsClaimLevel1()
    {
        return $this->hasMany(PolicyMaster::class, 'claim_level_1_id', 'id');
    }

    public function policiesAsClaimLevel2()
    {
        return $this->hasMany(PolicyMaster::class, 'claim_level_2_id', 'id');
    }
}