<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * HelpSupportChat Model
 * 
 * Stores all chat messages and support ticket conversations.
 * Handles both chatbot interactions and human support messages.
 */
class HelpSupportChat extends Model
{
    protected $table = 'help_support_chats';

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'cmp_id',
        'emp_id',
        'sender_type',
        'message',
        'state_key',
        'is_resolved',
        'status',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'is_resolved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Generate a unique ticket ID
     * Format: TKT-YYYYMMDD-XXXXX
     */
    public static function generateTicketId(): string
    {
        do {
            $ticketId = 'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(5));
        } while (self::where('ticket_id', $ticketId)->exists());

        return $ticketId;
    }

    /**
     * Get all chats for a specific ticket
     */
    public static function getChatHistory(string $ticketId)
    {
        return self::where('ticket_id', $ticketId)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Relationship: Status tracker history
     */
    public function statusHistory()
    {
        return $this->hasMany(HelpSupportStatusTracker::class, 'ticket_id', 'ticket_id')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Relationship: User who created the chat
     */
    public function user()
    {
        return $this->belongsTo(CompanyUser::class, 'user_id');
    }

    /**
     * Relationship: Company
     */
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'cmp_id');
    }

    /**
     * Relationship: Employee
     */
    public function employee()
    {
        return $this->belongsTo(CompanyEmployee::class, 'emp_id');
    }

    /**
     * Scope: Get only user messages
     */
    public function scopeUserMessages($query)
    {
        return $query->where('sender_type', 'user');
    }

    /**
     * Scope: Get unresolved tickets
     */
    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    /**
     * Scope: Get by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
