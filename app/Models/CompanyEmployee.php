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
}
