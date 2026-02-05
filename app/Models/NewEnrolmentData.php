<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewEnrolmentData extends Model
{
    protected $table = 'new_enrolment_data';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'emp_id',
        'cmp_id',
        'enrolment_id',
        'enrolment_portal_id',
        'enrolment_mapping_id',
        'insured_name',
        'gender',
        'relation',
        'detailed_relation',
        'dob',
        'date_of_joining',
        'base_sum_insured',
        'base_premium_on_company',
        'base_premium_on_employee',
        'base_plan_name',
        'extra_coverage_plan_name',
        'extra_coverage_premium_on_company',
        'extra_coverage_premium_on_employee',
        'is_edit',
        'is_delete',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
    ];

}
