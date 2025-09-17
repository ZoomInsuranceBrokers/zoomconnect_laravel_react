<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $mailData;

    /**
     * Create a new job instance.
     *
     * @param array $mailData
     */
    public function __construct(array $mailData)
    {
        $this->mailData = $mailData;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $to = $this->mailData['to']; // Mandatory
            $subject = $this->mailData['subject'] ?? 'No Subject';
            $body = $this->mailData['body'] ?? '';
            $cc = $this->mailData['cc'] ?? [];
            $bcc = $this->mailData['bcc'] ?? [];
            $attachments = $this->mailData['attachments'] ?? [];
            $isHtml = $this->mailData['is_html'] ?? false;
            $fromEmail = $this->mailData['from_email'] ?? config('mail.from.address');
            $fromName = $this->mailData['from_name'] ?? config('mail.from.name');
            $replyTo = $this->mailData['reply_to'] ?? null;
            $template = $this->mailData['template'] ?? null;
            $templateData = $this->mailData['template_data'] ?? [];

            // Send email using Laravel Mail
            if ($template) {
                // Send using Blade template
                Mail::send($template, $templateData, function ($message) use (
                    $to, $subject, $cc, $bcc, $attachments, $fromEmail, $fromName, $replyTo
                ) {
                    $this->configureMessage($message, $to, $subject, $cc, $bcc, $attachments, $fromEmail, $fromName, $replyTo);
                });
            } else {
                // Send raw email
                $method = $isHtml ? 'html' : 'raw';
                Mail::$method($body, function ($message) use (
                    $to, $subject, $cc, $bcc, $attachments, $fromEmail, $fromName, $replyTo
                ) {
                    $this->configureMessage($message, $to, $subject, $cc, $bcc, $attachments, $fromEmail, $fromName, $replyTo);
                });
            }

            Log::info('Email sent successfully', [
                'to' => $to,
                'subject' => $subject,
                'job_id' => $this->job->getJobId()
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send email', [
                'error' => $e->getMessage(),
                'mail_data' => $this->mailData,
                'job_id' => $this->job->getJobId()
            ]);

            // Optionally rethrow to retry the job
            throw $e;
        }
    }

    /**
     * Configure the message with all parameters
     *
     * @param $message
     * @param $to
     * @param $subject
     * @param $cc
     * @param $bcc
     * @param $attachments
     * @param $fromEmail
     * @param $fromName
     * @param $replyTo
     */
    private function configureMessage($message, $to, $subject, $cc, $bcc, $attachments, $fromEmail, $fromName, $replyTo)
    {
        // Set recipient(s) - can be string or array
        if (is_array($to)) {
            foreach ($to as $recipient) {
                if (is_array($recipient)) {
                    $message->to($recipient['email'], $recipient['name'] ?? '');
                } else {
                    $message->to($recipient);
                }
            }
        } else {
            $message->to($to);
        }

        // Set subject
        $message->subject($subject);

        // Set from address
        $message->from($fromEmail, $fromName);

        // Set reply-to if provided
        if ($replyTo) {
            if (is_array($replyTo)) {
                $message->replyTo($replyTo['email'], $replyTo['name'] ?? '');
            } else {
                $message->replyTo($replyTo);
            }
        }

        // Set CC recipients
        if (!empty($cc)) {
            if (is_array($cc)) {
                foreach ($cc as $ccRecipient) {
                    if (is_array($ccRecipient)) {
                        $message->cc($ccRecipient['email'], $ccRecipient['name'] ?? '');
                    } else {
                        $message->cc($ccRecipient);
                    }
                }
            } else {
                $message->cc($cc);
            }
        }

        // Set BCC recipients
        if (!empty($bcc)) {
            if (is_array($bcc)) {
                foreach ($bcc as $bccRecipient) {
                    if (is_array($bccRecipient)) {
                        $message->bcc($bccRecipient['email'], $bccRecipient['name'] ?? '');
                    } else {
                        $message->bcc($bccRecipient);
                    }
                }
            } else {
                $message->bcc($bcc);
            }
        }

        // Attach files
        if (!empty($attachments)) {
            foreach ($attachments as $attachment) {
                if (is_array($attachment)) {
                    $message->attach(
                        $attachment['path'],
                        [
                            'as' => $attachment['name'] ?? null,
                            'mime' => $attachment['mime'] ?? null
                        ]
                    );
                } else {
                    $message->attach($attachment);
                }
            }
        }
    }

    /**
     * Handle a job failure.
     *
     * @param \Exception $exception
     * @return void
     */
    public function failed(\Exception $exception)
    {
        Log::error('SendMailJob failed permanently', [
            'error' => $exception->getMessage(),
            'mail_data' => $this->mailData,
            'job_id' => $this->job->getJobId()
        ]);
    }
}
