<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * HelpSupportStatusTracker Model
 * 
 * Tracks all status changes for support tickets.
 * Maintains an audit log of status transitions.
 */
class HelpSupportStatusTracker extends Model
{
    protected $table = 'help_support_status_tracker';

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'ticket_id',
        'old_status',
        'new_status',
        'changed_by',
        'remarks',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Track status change for a ticket
     * 
     * @param string $ticketId
     * @param string $oldStatus
     * @param string $newStatus
     * @param int|null $changedBy
     * @param string|null $remarks
     */
    public static function trackStatusChange(
        string $ticketId,
        ?string $oldStatus,
        string $newStatus,
        ?int $changedBy = null,
        ?string $remarks = null
    ): void {
        self::create([
            'ticket_id' => $ticketId,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $changedBy,
            'remarks' => $remarks,
        ]);
    }

    /**
     * Get status history for a ticket
     */
    public static function getTicketHistory(string $ticketId)
    {
        return self::where('ticket_id', $ticketId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Relationship: User who changed the status
     */
    public function changedByUser()
    {
        return $this->belongsTo(CompanyUser::class, 'changed_by');
    }

    /**
     * Relationship: Support chat ticket
     */
    public function supportChat()
    {
        return $this->belongsTo(HelpSupportChat::class, 'ticket_id', 'ticket_id');
    }
}
