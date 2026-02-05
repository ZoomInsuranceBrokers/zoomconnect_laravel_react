<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkEndorsementAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'endorsement_id',
        'action_type',
        'uploaded_file',
        'inserted_data_file',
        'not_inserted_data_file',
        'total_records',
        'inserted_count',
        'failed_count',
        'status',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(UserMaster::class, 'created_by', 'user_id');
    }

    public function endorsement()
    {
        return $this->belongsTo(PolicyEndorsement::class, 'endorsement_id', 'id')->with('policy');
    }
}
