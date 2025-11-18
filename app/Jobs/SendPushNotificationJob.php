<?php

namespace App\Jobs;

use App\Models\PushNotification;
use App\Models\CompanyEmployee;
use App\Models\CompanyMaster;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Google_Client;

class SendPushNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $pushNotification;
    protected $offset = 0;
    protected $batchSize = 200; // default batch size
    // Retry limits to avoid infinite retry storms
    public $tries = 3;
    public $backoff = 60; // seconds before retry

    /**
     * Create a new job instance.
     */
    public function __construct(PushNotification $pushNotification, int $offset = 0, int $batchSize = 200)
    {
        $this->pushNotification = $pushNotification;
        $this->offset = max(0, $offset);
        $this->batchSize = max(1, $batchSize);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Update status to processing
            $this->pushNotification->update(['status' => 'processing']);

            // Build base query and compute total recipients on first run
            $baseQuery = $this->buildTargetQuery();
            $totalRecipients = 0;
            if ($this->offset === 0) {
                $totalRecipients = $baseQuery->count();
                if ($totalRecipients === 0) {
                    $this->pushNotification->update([
                        'status' => 'failed',
                        'total_recipients' => 0
                    ]);
                    Log::warning("Push notification {$this->pushNotification->id} has no valid recipients");
                    return;
                }
                $this->pushNotification->update(['total_recipients' => $totalRecipients, 'status' => 'processing']);
            }

            // Get current batch
            $employees = $baseQuery->orderBy('id')->skip($this->offset)->take($this->batchSize)->get();

            if ($employees->isEmpty()) {
                // Nothing left to process — mark completed if not already
                $this->pushNotification->update(['status' => 'completed']);
                Log::info("Push notification {$this->pushNotification->id} has no more recipients to process.");
                return;
            }

            // Initialize Google Client for FCM
            try {
                $accessToken = $this->getGoogleAccessToken();
            } catch (\Exception $e) {
                Log::error('Google access token error: ' . $e->getMessage());
                // mark notification as failed (permanent) and stop processing further
                try {
                    $this->pushNotification->update(['status' => 'failed']);
                } catch (\Throwable $t) {
                    // ignore
                }
                return;
            }

            $sentCount = 0;
            $failedCount = 0;

            // Send notification to each employee with FCM token (batch)
            foreach ($employees as $employee) {
                $result = $this->sendFcmNotification(
                    $employee->device_token,
                    $this->pushNotification->title,
                    $this->pushNotification->body,
                    $this->pushNotification->image_url,
                    $this->pushNotification->notification_type,
                    $accessToken
                );

                if ($result['status']) {
                    $sentCount++;
                } else {
                    $failedCount++;
                    Log::error("Failed to send push notification to employee {$employee->id}: {$result['message']}");
                }

                // Small delay to avoid rate limiting
                usleep(50000); // 50ms delay
            }

            // Increment cumulative counts
            if ($sentCount > 0) {
                $this->pushNotification->increment('sent_count', $sentCount);
            }
            if ($failedCount > 0) {
                $this->pushNotification->increment('failed_count', $failedCount);
            }

            Log::info("Processed batch starting at {$this->offset} for push notification {$this->pushNotification->id}. Sent: {$sentCount}, Failed: {$failedCount}");

                // If we processed a full batch, there may be more — dispatch a follow-up job instance with a short delay
            if ($employees->count() === $this->batchSize) {
                $nextOffset = $this->offset + $this->batchSize;
                dispatch(new self($this->pushNotification, $nextOffset, $this->batchSize))->delay(now()->addSeconds(20));
                Log::info("Dispatched next batch job for push notification {$this->pushNotification->id} starting at {$nextOffset}");
            } else {
                // Last batch — mark completed
                $this->pushNotification->update(['status' => 'completed']);
                Log::info("Push notification {$this->pushNotification->id} completed. Total sent increment: {$sentCount}, failed increment: {$failedCount}");
            }

        } catch (\Exception $e) {
            // Log and mark failed; do not rethrow to avoid exhausting attempts for permanent errors.
            Log::error("Push notification job failed: " . $e->getMessage());
            try {
                $this->pushNotification->update(['status' => 'failed']);
            } catch (\Throwable $t) {
                // ignore
            }
            return;
        }
    }

    /**
     * Get target employees based on notification settings
     */
    protected function getTargetEmployees()
    {
        $query = CompanyEmployee::where('is_delete', 0)
            ->where('is_active', 1);

        if ($this->pushNotification->target_type === 'specific' && !empty($this->pushNotification->company_ids)) {
            $query->whereIn('company_id', $this->pushNotification->company_ids);
        }

        // Only include employees that have a device token (not null/empty)
        $query->whereNotNull('device_token')->where('device_token', '<>', '');

        return $query->get();
    }

    /**
     * Build the query used to select target employees (returns a Builder, not executed)
     */
    protected function buildTargetQuery()
    {
        $query = CompanyEmployee::where('is_delete', 0)
            ->where('is_active', 1);

        if ($this->pushNotification->target_type === 'specific' && !empty($this->pushNotification->company_ids)) {
            $query->whereIn('company_id', $this->pushNotification->company_ids);
        }

        $query->whereNotNull('device_token')->where('device_token', '<>', '');

        return $query;
    }

    /**
     * Get Google OAuth2 access token for FCM
     */
    protected function getGoogleAccessToken()
    {
        try {
            $client = new Google_Client();

            // Path to your google_api.json service account credentials
            $credentialsPath = storage_path('app/config/google_api.json');

            if (!file_exists($credentialsPath)) {
                throw new \Exception('Google API credentials file not found at: ' . $credentialsPath);
            }

            $client->setAuthConfig($credentialsPath);
            $client->addScope('https://www.googleapis.com/auth/cloud-platform');

            $accessToken = $client->fetchAccessTokenWithAssertion();

            if (isset($accessToken['access_token'])) {
                return $accessToken['access_token'];
            } else {
                throw new \Exception('Failed to obtain access token from Google Client.');
            }
        } catch (\Exception $e) {
            Log::error('Failed to set up Google Client: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Send FCM notification to a single device
     */
    protected function sendFcmNotification($deviceToken, $title, $body, $imageUrl, $type, $accessToken)
    {
        $url = 'https://fcm.googleapis.com/v1/projects/zoomconnect-837b5/messages:send';

        $message = [
            'message' => [
                'token' => $deviceToken,
                // 'token' => "d0eiJflMa0eikhRA_bEGtg:APA91bHsQiMEdoTA0u3fjsXsxOSMqAHgQn5EHjydLQ6rA2dZTxxwlQDNfMUgDG3UtjFKl3sqUu35j15fCVcED2dieyS8nC1Vt1l7V5SpUt5RJZXbzgjuXeU",
                'notification' => [
                    'title' => $title,
                    'body'  => $body,
                ],
                'data' => [
                    'type' => $type
                ]
            ]
        ];

        // Add image if provided
        if (!empty($imageUrl)) {
            $message['message']['notification']['image'] = $imageUrl;
        }

        $fields = json_encode($message);

        $headers = [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);

        if ($result === FALSE) {
            $error = curl_error($ch);
            curl_close($ch);
            return [
                'status' => false,
                'message' => 'cURL error: ' . $error
            ];
        }

        curl_close($ch);

        $response = json_decode($result, true);

        if (isset($response['error'])) {
            return [
                'status' => false,
                'message' => 'Firebase error: ' . $response['error']['message']
            ];
        }

        return [
            'status' => true,
            'message' => 'Notification sent successfully.',
            'data' => $response
        ];
    }
}
