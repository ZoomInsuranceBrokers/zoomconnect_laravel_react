<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageTemplate extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'message_templates';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'category',
        'subject',
        'body',
        'is_logo_sent',
        'logo_position',
        'is_company_logo_sent',
        'company_logo_position',
        'banner_image',
        'attachment',
        'status',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_logo_sent' => 'boolean',
        'is_company_logo_sent' => 'boolean',
        'status' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [];

    /**
     * Get the user who created the template.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated the template.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to only include active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    /**
     * Scope a query to only include inactive templates.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', false);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get the banner image URL.
     */
    public function getBannerImageUrlAttribute()
    {
        if ($this->banner_image) {
            return asset('storage/' . $this->banner_image);
        }
        return null;
    }

    /**
     * Get the attachment URL.
     */
    public function getAttachmentUrlAttribute()
    {
        if ($this->attachment) {
            return asset('storage/' . $this->attachment);
        }
        return null;
    }

    /**
     * Get the logo position options.
     */
    public static function getLogoPositions()
    {
        return ['top', 'bottom', 'left', 'right', 'center'];
    }

    /**
     * Get the template categories (can be customized based on requirements).
     */
    public static function getCategories()
    {
        return [
            'welcome' => 'Welcome Email',
            'promotional' => 'Promotional',
            'notification' => 'Notification',
            'newsletter' => 'Newsletter',
            'transactional' => 'Transactional',
            'reminder' => 'Reminder',
            'invitation' => 'Invitation',
            'announcement' => 'Announcement'
        ];
    }
}
