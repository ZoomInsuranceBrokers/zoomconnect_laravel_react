<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NaturalAddition extends Model
{
    use HasFactory;

    protected $table = 'natural_addition';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'emp_id',
        'emp_code',
        'policy_id',
        'cmp_id',
        'insured_name',
        'gender',
        'relation',
        'dob',
        'date_of_event',
        'document',
        'status',
        'reason',
    ];

    protected $casts = [
        'id' => 'integer',
        'emp_id' => 'integer',
        'policy_id' => 'integer',
        'cmp_id' => 'integer',
        'dob' => 'date',
        'date_of_event' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
