<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * SupportTicketMail
 * 
 * Email sent to support team when a user submits an unresolved query.
 * Contains ticket details and user message for support team to act upon.
 */
class SupportTicketMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $ticketId;
    public $userName;
    public $userEmail;
    public $userMessage;
    public $companyName;
    public $employeeId;

    /**
     * Create a new message instance.
     *
     * @param string $ticketId
     * @param string $userName
     * @param string $userEmail
     * @param string $userMessage
     * @param string|null $companyName
     * @param int|null $employeeId
     */
    public function __construct(
        string $ticketId,
        string $userName,
        string $userEmail,
        string $userMessage,
        ?string $companyName = null,
        ?int $employeeId = null
    ) {
        $this->ticketId = $ticketId;
        $this->userName = $userName;
        $this->userEmail = $userEmail;
        $this->userMessage = $userMessage;
        $this->companyName = $companyName;
        $this->employeeId = $employeeId;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Support Ticket - ' . $this->ticketId,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            html: 'emails.support-ticket',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
