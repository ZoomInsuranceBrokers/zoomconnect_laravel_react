<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NaturalAdditionNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $naturalAddition;
    public $employee;
    public $company;
    public $policy;
    public $action;

    /**
     * Create a new message instance.
     */
    public function __construct($naturalAddition, $employee, $company, $policy, $action = 'submitted')
    {
        $this->naturalAddition = $naturalAddition;
        $this->employee = $employee;
        $this->company = $company;
        $this->policy = $policy;
        $this->action = $action; // submitted, edited, resubmitted
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = 'Natural Addition Request - ' . ucfirst($this->action);
        
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.natural_addition_notification',
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
