<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentData extends Model
{
    use HasFactory;

    protected $table = 'enrollment_data';

    protected $fillable = [
        'emp_id',
        'cmp_id',
        'enrolment_id',
        'enrolment_portal_id',
        'enrolment_mapping_id',
        'insured_name',
        'gender',
        'relation',
        'detailed_relation',
        'dob',
        'date_of_joining',
        'base_sum_insured',
        'base_premium_on_company',
        'base_premium_on_employee',
        'topup_sum_insured',
        'topup_premium_on_company',
        'topup_premium_on_employee',
        'extra_coverage_plan',
        'extra_coverage_premium',
        'is_edit',
        'is_delete',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'dob' => 'date',
        'date_of_joining' => 'date',
        'base_sum_insured' => 'decimal:2',
        'base_premium_on_company' => 'decimal:2',
        'base_premium_on_employee' => 'decimal:2',
        'topup_sum_insured' => 'decimal:2',
        'topup_premium_on_company' => 'decimal:2',
        'topup_premium_on_employee' => 'decimal:2',
        'extra_coverage_premium' => 'decimal:2',
        'is_edit' => 'integer',
        'is_delete' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationship with CompanyEmployee
     */
    public function employee()
    {
        return $this->belongsTo(CompanyEmployee::class, 'emp_id', 'id');
    }

    /**
     * Relationship with CompanyMaster
     */
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'cmp_id', 'comp_id');
    }

    /**
     * Relationship with EnrollmentDetail
     */
    public function enrollmentDetail()
    {
        return $this->belongsTo(EnrollmentDetail::class, 'enrolment_id', 'id');
    }

    /**
     * Scope to get active (non-deleted) records
     */
    public function scopeActive($query)
    {
        return $query->where('is_delete', 0);
    }

    /**
     * Scope to get records by enrollment portal
     */
    public function scopeByPortal($query, $portalId)
    {
        return $query->where('enrolment_portal_id', $portalId);
    }

    /**
     * Scope to get records by employee
     */
    public function scopeByEmployee($query, $empId)
    {
        return $query->where('emp_id', $empId);
    }

    /**
     * Scope to get records by company
     */
    public function scopeByCompany($query, $companyId)
    {
        return $query->where('cmp_id', $companyId);
    }

    /**
     * Calculate total premium (base + topup + extra coverage)
     */
    public function getTotalPremiumOnEmployeeAttribute()
    {
        return $this->base_premium_on_employee +
               $this->topup_premium_on_employee +
               $this->extra_coverage_premium;
    }

    /**
     * Calculate total premium on company
     */
    public function getTotalPremiumOnCompanyAttribute()
    {
        return $this->base_premium_on_company + $this->topup_premium_on_company;
    }

    /**
     * Calculate total sum insured (base + topup)
     */
    public function getTotalSumInsuredAttribute()
    {
        return $this->base_sum_insured + $this->topup_sum_insured;
    }

    /**
     * Get formatted premium amount
     */
    public function getFormattedTotalPremiumAttribute()
    {
        return number_format($this->total_premium_on_employee, 2);
    }

    /**
     * Check if employee has extra coverage
     */
    public function hasExtraCoverage()
    {
        return !empty($this->extra_coverage_plan) && $this->extra_coverage_premium > 0;
    }

    /**
     * Get age based on date of birth
     */
    public function getAgeAttribute()
    {
        if (!$this->dob) {
            return null;
        }

        return \Carbon\Carbon::parse($this->dob)->age;
    }
}
