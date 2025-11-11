<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class CompanyUser extends Authenticatable
{
    use HasFactory;

    protected $table = 'company_users';

    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'updated_on';

    protected $fillable = [
        'token',
        'full_name',
        'first_name',
        'last_name',
        'email',
        'pwd',
        'designation_name',
        'role_id',
        'rm_id',
        'company_id',
        'created_by',
        'is_active',
        'first_login',
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
