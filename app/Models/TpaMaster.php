<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TpaMaster extends Model
{
    use HasFactory;

    protected $table = 'tpa_master';

    protected $primaryKey = 'id';

    public $timestamps = true; // because you have created_at & updated_at in DB

    protected $fillable = [
        'tpa_company_name',
        'address',
        'file_dir',
        'state_name',
        'city_name',
        'pincode',
        'status',
        'tpa_comp_icon_url',
        'tpa_table_name',
        'created_at',
        'updated_at',
    ];

    public function policies()
    {
        return $this->hasMany(PolicyMaster::class, 'tpa_id', 'id');
    }
}
