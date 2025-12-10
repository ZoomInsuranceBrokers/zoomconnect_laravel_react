<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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
            $jobId = null;
            try {
                $jobId = isset($this->job) && method_exists($this->job, 'getJobId') ? $this->job->getJobId() : null;
            } catch (\Throwable $_) {
                $jobId = null;
            }

            // Perform the HTTP send to ZeptoMail directly in the job
            $apiKey = env('ZEPTO_API_KEY', env('MAIL_PASSWORD'));
            $url = env('ZEPTO_API_URL', 'https://api.zeptomail.in/v1.1/email');

            if (empty($apiKey)) {
                throw new \Exception('ZeptoMail API key not configured');
            }

            $data = $this->mailData;
            $fromEmail = $data['from_email'] ?? env('MAIL_FROM_ADDRESS', 'noreply@portal.zoomconnect.co.in');
            $fromName = $data['from_name'] ?? env('MAIL_FROM_NAME', 'Zoom Connect');
            $subject = $data['subject'] ?? 'No Subject';

            // Build payload
            $payload = [
                'from' => ['address' => $fromEmail, 'name' => $fromName],
                'subject' => $subject
            ];

            // to
            $to = $data['to'] ?? null;
            if (empty($to) && !empty($data['bcc'])) {
                $to = $fromEmail;
            }

            $toList = [];
            if (is_array($to)) {
                foreach ($to as $recipient) {
                    if (is_array($recipient) && isset($recipient['email'])) {
                        $toList[] = ['email_address' => ['address' => $recipient['email'], 'name' => $recipient['name'] ?? '']];
                    } elseif (is_array($recipient) && isset($recipient['email_address'])) {
                        $toList[] = $recipient;
                    } else {
                        $toList[] = ['email_address' => ['address' => $recipient, 'name' => '']];
                    }
                }
            } elseif ($to) {
                $toList[] = ['email_address' => ['address' => $to, 'name' => '']];
            }
            if (!empty($toList)) {
                $payload['to'] = $toList;
            }

            // cc
            if (!empty($data['cc'])) {
                $ccList = [];
                foreach ((array)$data['cc'] as $c) {
                    if (is_array($c) && isset($c['email'])) {
                        $ccList[] = ['email_address' => ['address' => $c['email'], 'name' => $c['name'] ?? '']];
                    } else {
                        $ccList[] = ['email_address' => ['address' => $c, 'name' => '']];
                    }
                }
                $payload['cc'] = $ccList;
            }

            // bcc
            if (!empty($data['bcc'])) {
                $bccList = [];
                foreach ((array)$data['bcc'] as $b) {
                    if (is_array($b) && isset($b['email'])) {
                        $bccList[] = ['email_address' => ['address' => $b['email'], 'name' => $b['name'] ?? '']];
                    } else {
                        $bccList[] = ['email_address' => ['address' => $b, 'name' => '']];
                    }
                }
                $payload['bcc'] = $bccList;
            }

            // Render template or use body
            if (!empty($data['template'])) {
                try {
                    $html = view($data['template'], $data['template_data'] ?? [])->render();
                    $payload['htmlbody'] = $html;
                } catch (\Throwable $e) {
                    Log::error('SendMailJob: template render failed', ['error' => $e->getMessage(), 'template' => $data['template']]);
                    $payload['htmlbody'] = $data['body'] ?? '';
                }
            } else {
                $payload['htmlbody'] = $data['body'] ?? '';
            }

            // attachments (optional) - expect array of ['path'=>..., 'name'=>..., 'mime'=>...]
            if (!empty($data['attachments'])) {
                $payload['attachments'] = [];
                foreach ($data['attachments'] as $att) {
                    if (is_array($att) && !empty($att['path']) && file_exists($att['path'])) {
                        try {
                            $contents = base64_encode(file_get_contents($att['path']));
                            $payload['attachments'][] = [
                                'content' => $contents,
                                'name' => $att['name'] ?? basename($att['path']),
                                'type' => $att['mime'] ?? null
                            ];
                        } catch (\Throwable $e) {
                            Log::warning('SendMailJob: failed to read attachment', ['path' => $att['path'], 'error' => $e->getMessage()]);
                        }
                    }
                }
            }

            // Perform curl
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json',
                'Authorization: Zoho-enczapikey ' . $apiKey
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

            $response = curl_exec($ch);
            $curlErr = curl_error($ch);
            $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($curlErr) {
                Log::error('SendMailJob curl error', ['error' => $curlErr, 'mail_data' => $this->mailData]);
                throw new \Exception('Mail sending failed: ' . $curlErr);
            }

            $decoded = json_decode($response, true);

            if ($httpStatus >= 200 && $httpStatus < 300) {
                Log::info('Email sent via ZeptoMail', [
                    'to' => $this->mailData['to'] ?? null,
                    'subject' => $subject,
                    'job_id' => $jobId,
                    'response' => $decoded
                ]);
            } else {
                Log::error('SendMailJob: API error', ['http_status' => $httpStatus, 'response' => $decoded ?? $response, 'mail_data' => $this->mailData]);
                throw new \Exception('Mail sending failed with status ' . $httpStatus . ': ' . ($decoded['message'] ?? $response));
            }

        } catch (\Exception $e) {
            $jobId = null;
            try {
                $jobId = isset($this->job) && method_exists($this->job, 'getJobId') ? $this->job->getJobId() : null;
            } catch (\Throwable $_) {
                $jobId = null;
            }

            Log::error('Failed to send email in job', [
                'error' => $e->getMessage(),
                'mail_data' => $this->mailData,
                'job_id' => $jobId
            ]);

            // Rethrow to allow the queue to retry the job
            throw $e;
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
        $jobId = null;
        try {
            $jobId = isset($this->job) && method_exists($this->job, 'getJobId') ? $this->job->getJobId() : null;
        } catch (\Throwable $_) {
            $jobId = null;
        }

        Log::error('SendMailJob failed permanently', [
            'error' => $exception->getMessage(),
            'mail_data' => $this->mailData,
            'job_id' => $jobId
        ]);
    }
}
