<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyLocationMaster extends Model
{
    use HasFactory;

    protected $table = 'company_location_master';
    protected $primaryKey = 'id';
    public $timestamps = false; // since you have 'created_on' instead of Laravel's default created_at/updated_at

    protected $fillable = [
        'location_id',
        'branch_name',
        'address',
        'comp_id',
        'state_name',
        'city',
        'pincode',
        'status',
        'created_on',
    ];

    /**
     * Company location may have many employees assigned to it.
     */
    public function employees()
    {
        return $this->hasMany(CompanyEmployee::class, 'location_id', 'id');
    }
}
