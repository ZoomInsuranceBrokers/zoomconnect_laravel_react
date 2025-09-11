<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class UserMaster extends Authenticatable
{
    use HasFactory;

    protected $table = 'user_master';

    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'updated_on';

    protected $primaryKey = 'user_id';
    protected $fillable = [
        'user_id',
        'token',
        'full_name',
        'first_name',
        'last_name',
        'email',
        'profile_img',
        'pwd',
        'mobile',
        'role_id',
        'created_by',
        'is_active',
        'is_delete',
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
