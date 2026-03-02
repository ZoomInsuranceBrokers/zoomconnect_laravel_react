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
    public $topupPremium;
    public $extraCoveragePremium;
    public $gst;
    public $grossPlusGst;
    public $companyContribution;
    public $companyContributionPercentage;
    public $walletDeduction;
    public $isWallet;
    public $totalPremium;
    public $policyName;
    public $policyStartDate;
    public $policyEndDate;
    public $portalName;
    public $extraCoverage;
    public $selectedPlans;
    public $prorationFactor;
    public $remainingDays;
    public $totalPolicyDays;

    /**
     * Create a new message instance.
     */
    public function __construct($enrollmentData)
    {
        $this->employee                     = $enrollmentData['employee'];
        $this->dependents                   = $enrollmentData['dependents'];
        $this->basePremium                  = $enrollmentData['base_premium'] ?? 0;
        $this->topupPremium                 = $enrollmentData['topup_premium'] ?? 0;
        $this->extraCoveragePremium         = $enrollmentData['extra_coverage_premium'] ?? 0;
        $this->gst                          = $enrollmentData['gst'] ?? 0;
        $this->grossPlusGst                 = $enrollmentData['gross_plus_gst'] ?? 0;
        $this->companyContribution          = $enrollmentData['company_contribution'] ?? 0;
        $this->companyContributionPercentage = $enrollmentData['company_contribution_percentage'] ?? 0;
        $this->walletDeduction              = $enrollmentData['wallet_deduction'] ?? 0;
        $this->isWallet                     = $enrollmentData['is_wallet'] ?? false;
        $this->totalPremium                 = $enrollmentData['total_premium'] ?? 0;
        $this->policyName                   = $enrollmentData['policy_name'] ?? null;
        $this->policyStartDate              = $enrollmentData['policy_start_date'] ?? null;
        $this->policyEndDate                = $enrollmentData['policy_end_date'] ?? null;
        $this->portalName                   = $enrollmentData['portal_name'] ?? null;
        $this->extraCoverage                = $enrollmentData['extra_coverage'] ?? null;
        $this->selectedPlans                = $enrollmentData['selected_plans'] ?? [];
        $this->prorationFactor              = $enrollmentData['proration_factor'] ?? 1;
        $this->remainingDays                = $enrollmentData['remaining_days'] ?? null;
        $this->totalPolicyDays              = $enrollmentData['total_policy_days'] ?? null;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Enrollment Confirmation - ' . ($this->policyName ?? 'Health Insurance'),
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
                'employee'                      => $this->employee,
                'employeeName'                  => $this->employee->full_name,
                'employeeCode'                  => $this->employee->employees_code ?? '',
                'employeeEmail'                 => $this->employee->email ?? '',
                'dependents'                    => $this->dependents,
                'totalMembers'                  => count($this->dependents),
                'basePremium'                   => $this->basePremium,
                'topupPremium'                  => $this->topupPremium,
                'extraCoveragePremium'          => $this->extraCoveragePremium,
                'gst'                           => $this->gst,
                'grossPlusGst'                  => $this->grossPlusGst,
                'companyContribution'           => $this->companyContribution,
                'companyContributionPercentage' => $this->companyContributionPercentage,
                'walletDeduction'               => $this->walletDeduction,
                'isWallet'                      => $this->isWallet,
                'totalPremium'                  => $this->totalPremium,
                'policyName'                    => $this->policyName,
                'policyStartDate'               => $this->policyStartDate,
                'policyEndDate'                 => $this->policyEndDate,
                'portalName'                    => $this->portalName,
                'extraCoverage'                 => $this->extraCoverage,
                'selectedPlans'                 => $this->selectedPlans,
                'prorationFactor'               => $this->prorationFactor,
                'remainingDays'                 => $this->remainingDays,
                'totalPolicyDays'               => $this->totalPolicyDays,
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
