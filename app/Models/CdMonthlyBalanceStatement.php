<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CdMonthlyBalanceStatement extends Model
{
    protected $table = 'cd_monthly_balance_statements';

    protected $fillable = [
        'cd_master_id',
        'transaction_name',
        'transaction_date',
        'premium',
        'transaction_type',
        'cd_current_balance',
        'remarks',
        'document_proof',
        'cd_file',
        'created_at',
        'updated_at',
    ];
}
