<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnrollmentConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;
    public $dependents;
    public $basePremium;
    public $extraCoveragePremium;
    public $companyContribution;
    public $totalPremium;

    /**
     * Create a new message instance.
     */
    public function __construct($enrollmentData)
    {
        $this->employee = $enrollmentData['employee'];
        $this->dependents = $enrollmentData['dependents'];
        $this->basePremium = $enrollmentData['base_premium'] ?? 0;
        $this->extraCoveragePremium = $enrollmentData['extra_coverage_premium'] ?? 0;
        $this->companyContribution = $enrollmentData['company_contribution'] ?? 0;
        $this->totalPremium = $enrollmentData['total_premium'] ?? 0;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Enrollment Confirmation - Health Insurance',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.enrollment-confirmation',
            with: [
                'employeeName' => $this->employee->full_name,
                'basePremium' => $this->basePremium,
                'extraCoveragePremium' => $this->extraCoveragePremium,
                'companyContribution' => $this->companyContribution,
                'totalPremium' => $this->totalPremium,
                'dependents' => $this->dependents,
                'totalMembers' => count($this->dependents),
            ]
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
