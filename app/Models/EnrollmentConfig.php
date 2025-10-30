<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentConfig extends Model
{
    use HasFactory;

    protected $table = 'enrolment_config';

    protected $fillable = [
        'config_name',
        'config_desc',
        'config_type',
        'status',
        'rater_view',
        'enrollment_status_page',
        'enrollment_form',
        'enrollment_backend_function',
        'edit_enrollment_page',
        'edit_enrollment_backend_function',
        'enrollment_detail_page',
        'enrollment_table',
        'sample_enrollment_upload_function',
        'verify_enrollment_csv',
        'enrollment_upload_function',
        'download_enrollment_data_function',
        'download_unenrollment_data_function',
        'reminder_mail_function'
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

    // Relationship with enrollment details
    public function enrollmentDetails()
    {
        return $this->hasMany(EnrollmentDetail::class, 'config_id');
    }

    // Scope for active configs
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    // Scope for specific configs
    public function scopeSpecific($query)
    {
        return $query->where('config_type', 'specific');
    }

    // Get status label
    public function getStatusLabelAttribute()
    {
        return $this->status ? 'Active' : 'Inactive';
    }
}
