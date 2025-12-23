<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BulkEmployeeAction extends Model
{
    use HasFactory;

    protected $table = 'bulk_employee_actions';
    protected $primaryKey = 'id';

    protected $fillable = [
        'comp_id',
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

    /**
     * Relationship to CompanyMaster
     */
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'comp_id', 'comp_id');
    }

    /**
     * Relationship to User who created this action
     */
    public function creator()
    {
        return $this->belongsTo(UserMaster::class, 'created_by', 'user_id');
    }

    /**
     * Get formatted action type
     */
    public function getFormattedActionTypeAttribute()
    {
        return $this->action_type === 'bulk_add' ? 'Bulk Add' : 'Bulk Remove';
    }

    /**
     * Get formatted status
     */
    public function getFormattedStatusAttribute()
    {
        return ucfirst($this->status);
    }
}
