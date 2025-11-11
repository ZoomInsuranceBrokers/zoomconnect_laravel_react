<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyMaster extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'company_master';

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'comp_id';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = true;

    /**
     * Indicates if the model should be timestamped.
     * Set to false since you have custom datetime columns (created_date, updated_date).
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'comp_name',
        'comp_slug',
        'file_dir',
        'comp_code',
        'rm_id',
        'sales_rm_id',
        'sales_vertical_id',
        'label_id',
        'group_id',
        'phone',
        'email',
        'source',
        'business_type',
        'comp_addr',
        'comp_city',
        'comp_state',
        'comp_pincode',
        'comp_icon_url',
        'pan_card_url',
        'gst_details_url',
        'cheque_copy_url',
        'mandate_latter_url',
        'status',
        'is_approved',
        'created_date',
        'updated_by',
        'updated_date',
        'created_by',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'sales_vertical_id' => 'integer',
        'label_id' => 'integer',
        'group_id' => 'integer',
        'status' => 'integer',
        'is_approved' => 'integer',
        'created_date' => 'datetime',
        'updated_date' => 'datetime',
    ];

    public function rmUser()
    {
        return $this->belongsTo(UserMaster::class, 'rm_id', 'user_id');
    }

    // Relationship with UserMaster for sales_rm_id
    public function salesRmUser()
    {
        return $this->belongsTo(UserMaster::class, 'sales_rm_id', 'user_id');
    }

    // Relationship with UserMaster for sales_vertical_id
    public function salesVerticalUser()
    {
        return $this->belongsTo(UserMaster::class, 'sales_vertical_id', 'user_id');
    }

    // Relationship with CorporateLabel for label_id
    public function corporateLabel()
    {
        return $this->belongsTo(CorporateLabel::class, 'label_id', 'id');
    }

    // Relationship with CorporateGroup for group_id
    public function corporateGroup()
    {
        return $this->belongsTo(CorporateGroup::class, 'group_id', 'id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(UserMaster::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(UserMaster::class, 'updated_by');
    }

    public function policies()
    {
        return $this->hasMany(PolicyMaster::class, 'comp_id', 'comp_id')
            ->where('is_active', 1)
            ->where('policy_end_date', '>=', now())
            ->where('policy_status', 1)
            ->with('insurance:id,insurance_company_name'); // fetch only company name
    }

    public function enrollmentDetails()
    {
        return $this->hasMany(EnrollmentDetail::class, 'cmp_id');
    }

    public function enrollmentData()
    {
        return $this->hasMany(EnrollmentData::class, 'cmp_id', 'comp_id');
    }

    public function wellnessServices()
    {
        return $this->hasMany(WellnessService::class, 'company_id', 'comp_id');
    }

}
