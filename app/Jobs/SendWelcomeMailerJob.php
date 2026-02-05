<?php

namespace App\Jobs;

use App\Models\WelcomeMailer;
use App\Models\CompanyEmployee;
use App\Models\MessageTemplate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWelcomeMailerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $mailerId;

    public function __construct($mailerId)
    {
        $this->mailerId = $mailerId;
    }

    public function handle()
    {
        \Log::info('SendWelcomeMailerJob: Start', ['mailerId' => $this->mailerId]);
        $mailer = WelcomeMailer::find($this->mailerId);
        if (!$mailer) {
            \Log::info('SendWelcomeMailerJob: No mailer found', ['mailerId' => $this->mailerId]);
            return;
        }

        \Log::info('SendWelcomeMailerJob: Mailer found', ['mailer' => $mailer->toArray()]);
        $template = MessageTemplate::find($mailer->template_id);
        if (!$template) {
            \Log::info('SendWelcomeMailerJob: No template found', ['template_id' => $mailer->template_id]);
            return;
        }

        \Log::info('SendWelcomeMailerJob: Template found', ['template' => $template->toArray()]);
        // Get employee IDs from correct table
        $empIds = \App\Helpers\WelcomeMailerHelper::getEmployeeIds($mailer->policy_id, $mailer->endorsement_id);
        \Log::info('SendWelcomeMailerJob: Employee IDs', ['empIds' => $empIds]);
        if (empty($empIds)) {
            \Log::info('SendWelcomeMailerJob: No employee IDs');
            $mailer->total_count = 0;
            $mailer->sent_count = 0;
            $mailer->not_sent_count = 0;
            $mailer->save();
            return;
        }

        $employees = CompanyEmployee::whereIn('id', $empIds)->get();
        \Log::info('SendWelcomeMailerJob: Employees fetched', ['count' => $employees->count()]);
        $total = $employees->count();
        $sent = 0;
        $notSent = 0;

        foreach ($employees as $employee) {
            \Log::info('SendWelcomeMailerJob: Processing employee', ['employee_id' => $employee->id, 'email' => $employee->email]);
            if (empty($employee->email)) {
                $notSent++;
                \Log::info('SendWelcomeMailerJob: Employee missing email', ['employee_id' => $employee->id]);
                continue;
            }

            // Fetch company logo URL using correct company_id field

            $companyId = $employee->company_id ?? $employee->cmp_id ?? null;
            $company = $companyId ? \App\Models\CompanyMaster::find($companyId) : null;
            $companyLogoUrl = $company && $company->comp_icon_url ? 'https://zoomconnect.co.in/' . ltrim($company->comp_icon_url, '/') : '';

            // Fetch all escalation matrix contacts for this company and policy
            $escalationContacts = \DB::table('escalation_matrix')
                ->where('cmp_id', $companyId)
                ->where('policy_id', $mailer->policy_id)
                ->get();

            \Log::info('SendWelcomeMailerJob: Escalation contacts fetched', ['count' => $escalationContacts->count(), 'contacts' => $escalationContacts]);

            // Prepare escalation matrix HTML block matching the new template (single table with thead/tbody)
            $escalationRows = '';
            if ($escalationContacts->count() > 0) {
                foreach ($escalationContacts as $contact) {
                    $escalationRows .= '<tr>';
                    $escalationRows .= '<td>' . htmlspecialchars($contact->matrix ?? '') . '</td>';
                    $escalationRows .= '<td>' . htmlspecialchars($contact->full_name ?? '') . '</td>';
                    $escalationRows .= '<td><a href="mailto:' . htmlspecialchars($contact->email_id ?? '') . '" style="text-decoration:underline;color:#3d85c6">' . htmlspecialchars($contact->email_id ?? '') . '</a></td>';
                    $escalationRows .= '<td><a href="tel:' . htmlspecialchars($contact->mobile ?? '') . '" style="text-decoration:underline;color:#333333">' . htmlspecialchars($contact->mobile ?? '') . '</a></td>';
                    $escalationRows .= '</tr>';
                }
            } else {
                $escalationRows .= '<tr><td colspan="4" style="text-align:center;">No data available</td></tr>';
            }

            // Replace all template variables
            $body = $template->body;
            $replacements = [
                '{{EmployeeName}}' => $employee->full_name,
                '{{CompanyLogo}}' => $companyLogoUrl,
                // Remove single contact variables, use rows instead
            ];
            $body = str_replace(array_keys($replacements), array_values($replacements), $body);

            // Replace escalation matrix block
            // Use a unique placeholder in your template for the escalation matrix rows, e.g. {{EscalationRows}}
            $body = str_replace('{{EscalationRows}}', $escalationRows, $body);

            \Log::info('SendWelcomeMailerJob: Final mail body', ['body' => $body]);

            try {
                Mail::send([], [], function ($message) use ($employee, $mailer, $body) {
                    $message->to($employee->email)
                        ->subject($mailer->subject)
                        ->html($body);
                });
                $sent++;
                \Log::info('SendWelcomeMailerJob: Mail sent', ['employee_id' => $employee->id, 'email' => $employee->email]);
            } catch (\Exception $e) {
                $notSent++;
                \Log::error('SendWelcomeMailerJob failed to send mail', [
                    'employee_id' => $employee->id ?? null,
                    'employee_email' => $employee->email ?? null,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        $mailer->total_count = $total;
        $mailer->sent_count = $sent;
        $mailer->not_sent_count = $notSent;
        $mailer->save();
    }
}
