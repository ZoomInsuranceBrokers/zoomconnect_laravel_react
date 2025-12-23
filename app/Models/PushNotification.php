<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PushNotification extends Model
{
    protected $table = 'push_notification';

    protected $fillable = [
        'title',
        'body',
        'image_url',
        'notification_type',
        'is_active',
        'sent_count',
        'failed_count',
        'total_recipients',
        'target_type',
        'company_ids',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'company_ids' => 'array',
        'is_active' => 'boolean',
        'sent_count' => 'integer',
        'failed_count' => 'integer',
        'total_recipients' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user who created this notification
     */
    public function creator()
    {
        return $this->belongsTo(UserMaster::class, 'created_by', 'user_id');
    }

    /**
     * Get the user who last updated this notification
     */
    public function updater()
    {
        return $this->belongsTo(UserMaster::class, 'updated_by', 'user_id');
    }

    /**
     * Get the companies targeted by this notification (if specific)
     */
    public function companies()
    {
        if ($this->target_type === 'specific' && !empty($this->company_ids)) {
            return CompanyMaster::whereIn('comp_id', $this->company_ids)->get();
        }
        return collect();
    }

    /**
     * Get success rate percentage
     */
    public function getSuccessRateAttribute()
    {
        if ($this->total_recipients == 0) {
            return 0;
        }
        return round(($this->sent_count / $this->total_recipients) * 100, 2);
    }

    /**
     * Check if notification is completed
     */
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    /**
     * Check if notification is processing
     */
    public function isProcessing()
    {
        return in_array($this->status, ['pending', 'processing']);
    }
}
