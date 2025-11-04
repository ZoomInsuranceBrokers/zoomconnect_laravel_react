<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InsuranceMaster extends Model
{
    use HasFactory;

    protected $table = 'insurance_master';

    protected $primaryKey = 'id';

    public $timestamps = true; // because you already have created_at & updated_at

    protected $fillable = [
        'insurance_company_name',
        'address',
        'file_dir',
        'insurance_comp_icon_url',
        'state_name',
        'city_name',
        'pincode',
        'black_hospital',
        'status',
        'created_at',
        'updated_at',
    ];

    public function policies()
    {
        return $this->hasMany(PolicyMaster::class, 'ins_id', 'id');
    }
}
