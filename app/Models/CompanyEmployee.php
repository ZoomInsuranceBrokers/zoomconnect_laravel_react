<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyEmployee extends Model
{
    use HasFactory;

    protected $table = 'company_employees';

    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'updated_on';

    protected $fillable = [
        'token',
        'employees_code',
        'full_name',
        'first_name',
        'last_name',
        'gender',
        'photo',
        'email',
        'mobile',
        'pwd',
        'device_token',
        'company_id',
        'location_id',
        'designation',
        'dob',
        'date_of_joining',
        'grade',
        'created_by',
        'is_active',
        'first_login',
        'set_profile',
        'is_delete',
        'dol',
        'permanent_deletion',
        'updated_by',
    ];

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->pwd;
    }

    /**
     * Get the company that owns the employee.
     */
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'company_id', 'comp_id');
    }

    /**
     * Get the enrollment data for this employee.
     */
    public function enrollmentData()
    {
        return $this->hasMany(EnrollmentData::class, 'emp_id');
    }

    /**
     * Get the location (branch) for this employee.
     */
    public function location()
    {
        return $this->belongsTo(CompanyLocationMaster::class, 'location_id', 'id');
    }
}
