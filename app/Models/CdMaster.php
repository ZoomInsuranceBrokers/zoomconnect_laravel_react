<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CdMaster extends Model
{
    protected $table = 'cd_master';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'comp_id',
        'ins_id',
        'cd_ac_name',
        'cd_ac_no',
        'minimum_balance',
        'cd_folder',
        'statement_file',
        'status',
        'created_at',
        'updated_at',
    ];
}
