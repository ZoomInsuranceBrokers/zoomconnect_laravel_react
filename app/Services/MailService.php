<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class MailService
{
    /**
     * Dispatch mail to the queue. This prepares and normalizes parameters and
     * pushes a SendMailJob which will perform the actual HTTP call.
     *
     * @param array $params
     * @return void
     */
    public static function dispatchMail(array $params)
    {
        // Normalize and provide defaults
        $default = [
            'subject' => $params['subject'] ?? 'Zoom Connect Notification',
            'body' => $params['body'] ?? '',
            'is_html' => $params['is_html'] ?? false,
            'cc' => $params['cc'] ?? [],
            'bcc' => $params['bcc'] ?? [],
            'attachments' => $params['attachments'] ?? [],
            'from_email' => $params['from_email'] ?? env('MAIL_FROM_ADDRESS', 'noreply@portal.zoomconnect.co.in'),
            'from_name' => $params['from_name'] ?? env('MAIL_FROM_NAME', 'Zoom Connect'),
            'reply_to' => $params['reply_to'] ?? null,
            'template' => $params['template'] ?? null,
            'template_data' => $params['template_data'] ?? [],
            'to' => $params['to'] ?? null
        ];

        $mailData = array_merge($default, $params);

        // If only bcc is provided, ensure there's a top-level 'to' (ZeptoMail requirement)
        if (empty($mailData['to']) && !empty($mailData['bcc'])) {
            $mailData['to'] = $mailData['from_email'];
        }

        // Validate basic requirements
        if (empty($mailData['to'])) {
            throw new \InvalidArgumentException('The "to" field is required when dispatching mail');
        }

        // Dispatch job
        \App\Jobs\SendMailJob::dispatch($mailData);
    }

    /* ---------------------------------------------------------------------
     | Backwards-compatible convenience wrappers (delegate to sendMail())
     | Keep these so existing callers continue to work while using the
     | single dynamic backend.
     */

    public static function sendOtpEmail(string $email, string $otp, bool $useTemplate = true)
    {
        if ($useTemplate) {
            $mailData = [
                'to' => $email,
                'subject' => 'Zoom Connect - Login OTP',
                'template' => 'emails.otp',
                'template_data' => [
                    'otp' => $otp,
                    'email' => $email
                ]
            ];
        } else {
            $mailData = [
                'to' => $email,
                'subject' => 'Zoom Connect - Login OTP',
                'body' => "Your OTP for Zoom Connect login is: {$otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this OTP, please ignore this email."
            ];
        }

        return self::dispatchMail($mailData);
    }

    public static function sendWelcomeEmail(string $email, string $name, array $additionalData = [])
    {
        $mailData = [
            'to' => $email,
            'subject' => 'Welcome to Zoom Connect',
            'template' => 'emails.welcome',
            'template_data' => array_merge([
                'name' => $name,
                'email' => $email
            ], $additionalData)
        ];

        return self::dispatchMail($mailData);
    }

    public static function sendCustomEmail(array $params)
    {
        return self::dispatchMail($params);
    }

    public static function sendHtmlEmail($to, string $subject, string $htmlBody, array $options = [])
    {
        $mailData = array_merge([
            'to' => $to,
            'subject' => $subject,
            'body' => $htmlBody
        ], $options);

        return self::dispatchMail($mailData);
    }

    public static function sendEmailWithAttachments($to, string $subject, string $body, array $attachments, array $options = [])
    {
        $mailData = array_merge([
            'to' => $to,
            'subject' => $subject,
            'body' => $body,
            'attachments' => $attachments
        ], $options);

        return self::dispatchMail($mailData);
    }

    public static function sendBulkEmail(string $subject, string $body, array $recipients, array $options = [])
    {
        $mailData = array_merge([
            'bcc' => $recipients,
            'subject' => $subject,
            'body' => $body
        ], $options);

        return self::dispatchMail($mailData);
    }
}
