<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentPeriod extends Model
{
    use HasFactory;

    protected $table = 'enrolment_period';

    protected $fillable = [
        'cmp_id',
        'enrolment_id',
        'creation_status',
        'portal_start_date',
        'portal_end_date',
        'enrolment_portal_name',
        'welcome_mail_subject',
        'welcome_mail_content',
        'reminder_mail_subject',
        'reminder_mail_content',
        'is_active',
        'is_delete'
    ];

    protected $casts = [
        'portal_start_date' => 'datetime',
        'portal_end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_active' => 'boolean',
        'is_delete' => 'boolean',
        'creation_status' => 'integer',
    ];

    /**
     * Relationship with EnrollmentDetail
     */
    public function enrollmentDetail()
    {
        return $this->belongsTo(EnrollmentDetail::class, 'enrolment_id');
    }

    /**
     * Relationship with CompanyMaster
     */
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'cmp_id', 'comp_id');
    }

    /**
     * Relationship with EnrollmentData
     */
    public function enrollmentData()
    {
        return $this->hasMany(EnrollmentData::class, 'enrolment_portal_id');
    }
}
