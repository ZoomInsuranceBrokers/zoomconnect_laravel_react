<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMaster extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'user_master';

    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'updated_on';

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'user_id',
        'role_id',
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
    public function role(): BelongsTo
    {
        return $this->belongsTo(RoleMaster::class, 'role_id');
    }

    public function getAuthPassword()
    {
        return $this->pwd;
    }

    public function companiesAsRm()
    {
        return $this->hasMany(CompanyMaster::class, 'rm_id', 'id');
    }

    public function companiesAsSalesRm()
    {
        return $this->hasMany(CompanyMaster::class, 'sales_rm_id', 'id');
    }

    public function companiesAsSalesVertical()
    {
        return $this->hasMany(CompanyMaster::class, 'sales_vertical_id', 'id');
    }
}
