<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentDetail extends Model
{
    use HasFactory;

    protected $table = 'enrolment_details';

    protected $fillable = [
        'cmp_id',
        'creation_status',
        'enrolment_name',
        'corporate_enrolment_name',
        'family_defination',
        'rator_type', // Keep to save rating type: Simple Plan, Age-Based Plan, Per Life, Floater, Relation Wise, Flexi Plan, Base Sum Insured Type
        'rating_config',
        'policy_start_date',
        'policy_end_date',
        'enrolment_directory_name',
        'extra_coverage_plans',
        'mail_configuration',
        'twin_allowed',
        'enrollment_statements',
        'is_self_allowed_by_default',
        'grade_exclude',
        'reminder_mail_enable',
        'frequency_of_reminder_mail',
        'frequency_days',
        'send_welcome_mail',
        'send_confirmation_mail',
        'send_deadline_reminder',
        'send_completion_mail',
        'reminder_before_deadline_days',
        'custom_reminder_message',
        'auto_reminder_enable',
        'manual_reminder_enable',
        'status',
    ];

    protected $casts = [
        'family_defination' => 'array',
        'rating_config' => 'array',
        'extra_coverage_plans' => 'array',
        'mail_configuration' => 'array',
        'enrollment_statements' => 'array',
        'policy_start_date' => 'datetime',
        'policy_end_date' => 'datetime',
        'twin_allowed' => 'boolean',
        'is_self_allowed_by_default' => 'boolean',
        'grade_exclude' => 'array',
        'reminder_mail_enable' => 'boolean',
        'send_welcome_mail' => 'boolean',
        'send_confirmation_mail' => 'boolean',
        'send_deadline_reminder' => 'boolean',
        'send_completion_mail' => 'boolean',
        'auto_reminder_enable' => 'boolean',
        'manual_reminder_enable' => 'boolean',
        'status' => 'boolean'
    ];

    // Relationship with company
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'cmp_id');
    }

    // Relationship with enrollment periods
    public function enrollmentPeriods()
    {
        return $this->hasMany(EnrollmentPeriod::class, 'enrolment_id');
    }

    // Relationship with enrollment data
    public function enrollmentData()
    {
        return $this->hasMany(EnrollmentData::class, 'enrolment_id');
    }

    // Scope for active enrollments
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    // Scope for inactive enrollments
    public function scopeInactive($query)
    {
        return $query->where('status', 0);
    }

    // Get formatted family definition
    public function getFormattedFamilyDefinationAttribute()
    {
        if (!$this->family_defination) {
            return [];
        }

        return $this->family_defination;
    }

    // Get status label
    public function getStatusLabelAttribute()
    {
        return $this->status ? 'Active' : 'Inactive';
    }
}
