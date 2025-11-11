<?php

namespace App\Services;

use App\Jobs\SendMailJob;
use Illuminate\Support\Facades\Queue;

class MailService
{
    /**
     * Send OTP email
     *
     * @param string $email
     * @param string $otp
     * @param bool $useTemplate
     * @return void
     */
    public static function sendOtpEmail(string $email, string $otp, bool $useTemplate = false)
    {
        if ($useTemplate) {
            // Send with HTML template
            $mailData = [
                'to' => $email,
                'subject' => 'Zoom Connect - Login OTP',
                'template' => 'emails.otp',
                'template_data' => [
                    'otp' => $otp,
                    'email' => $email
                ],
                'from_email' => 'noreply@zoomconnect.co.in',
                'from_name' => 'ZoomConnect'
            ];
        } else {
            // Send as plain text
            $mailData = [
                'to' => $email,
                'subject' => 'Zoom Connect - Login OTP',
                'body' => "Your OTP for Zoom Connect login is: {$otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this OTP, please ignore this email.",
                'is_html' => false,
                'from_email' => 'noreply@zoomconnect.co.in',
                'from_name' => 'ZoomConnect'
            ];
        }

        SendMailJob::dispatch($mailData);
    }

    /**
     * Send welcome email with template
     *
     * @param string $email
     * @param string $name
     * @param array $additionalData
     * @return void
     */
    public static function sendWelcomeEmail(string $email, string $name, array $additionalData = [])
    {
        $mailData = [
            'to' => $email,
            'subject' => 'Welcome to Zoom Connect',
            'template' => 'emails.welcome',
            'template_data' => array_merge([
                'name' => $name,
                'email' => $email
            ], $additionalData),
            'from_email' => 'noreply@zoomconnect.co.in',
            'from_name' => 'ZoomConnect'
        ];

        SendMailJob::dispatch($mailData);
    }

    /**
     * Send custom email
     *
     * @param array $params
     * @return void
     */
    public static function sendCustomEmail(array $params)
    {
        // Validate required fields
        if (!isset($params['to'])) {
            throw new \InvalidArgumentException('The "to" field is required');
        }

        $defaultParams = [
            'subject' => 'Zoom Connect Notification',
            'body' => '',
            'is_html' => false,
            'from_email' => 'noreply@zoomconnect.co.in',
            'from_name' => 'ZoomConnect',
            'cc' => [],
            'bcc' => [],
            'attachments' => []
        ];

        $mailData = array_merge($defaultParams, $params);

        SendMailJob::dispatch($mailData);
    }

    /**
     * Send HTML email
     *
     * @param string|array $to
     * @param string $subject
     * @param string $htmlBody
     * @param array $options
     * @return void
     */
    public static function sendHtmlEmail($to, string $subject, string $htmlBody, array $options = [])
    {
        $mailData = array_merge([
            'to' => $to,
            'subject' => $subject,
            'body' => $htmlBody,
            'is_html' => true,
            'from_email' => 'noreply@zoomconnect.co.in',
            'from_name' => 'ZoomConnect',
            'cc' => [],
            'bcc' => [],
            'attachments' => []
        ], $options);

        SendMailJob::dispatch($mailData);
    }

    /**
     * Send email with attachments
     *
     * @param string|array $to
     * @param string $subject
     * @param string $body
     * @param array $attachments
     * @param array $options
     * @return void
     */
    public static function sendEmailWithAttachments($to, string $subject, string $body, array $attachments, array $options = [])
    {
        $mailData = array_merge([
            'to' => $to,
            'subject' => $subject,
            'body' => $body,
            'attachments' => $attachments,
            'is_html' => false,
            'from_email' => 'noreply@zoomconnect.co.in',
            'from_name' => 'ZoomConnect',
            'cc' => [],
            'bcc' => []
        ], $options);

        SendMailJob::dispatch($mailData);
    }

    /**
     * Send bulk email (with BCC)
     *
     * @param string $subject
     * @param string $body
     * @param array $recipients
     * @param array $options
     * @return void
     */
    public static function sendBulkEmail(string $subject, string $body, array $recipients, array $options = [])
    {
        $mailData = array_merge([
            'to' => 'noreply@zoomconnect.co.in', // Required field
            'bcc' => $recipients,
            'subject' => $subject,
            'body' => $body,
            'is_html' => false,
            'from_email' => 'noreply@zoomconnect.co.in',
            'from_name' => 'ZoomConnect'
        ], $options);

        SendMailJob::dispatch($mailData);
    }
}
