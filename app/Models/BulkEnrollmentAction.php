<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkEnrollmentAction extends Model
{
    use HasFactory;

    protected $table = 'bulk_enrollment_actions';

    protected $fillable = [
        'enrollment_period_id',
        'uploaded_file',
        'inserted_data_file',
        'not_inserted_data_file',
        'total_records',
        'inserted_count',
        'failed_count',
        'status',
        'created_by',
    ];

    public function enrollmentPeriod()
    {
        return $this->belongsTo(EnrollmentPeriod::class, 'enrollment_period_id');
    }

    public function creator()
    {
        return $this->belongsTo(UserMaster::class, 'created_by', 'user_id');
    }
}
