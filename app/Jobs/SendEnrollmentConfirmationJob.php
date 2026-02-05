<?php

namespace App\Jobs;

use App\Mail\EnrollmentConfirmation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEnrollmentConfirmationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $employee;
    protected $enrollmentData;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    
    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct($employee, $enrollmentData)
    {
        $this->employee = $employee;
        $this->enrollmentData = $enrollmentData;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info('📧 Sending enrollment confirmation email', [
                'employee_id' => $this->employee->id,
                'employee_email' => $this->employee->email,
            ]);

            Mail::to($this->employee->email)
                ->send(new EnrollmentConfirmation($this->enrollmentData));

            Log::info('✅ Enrollment confirmation email sent successfully', [
                'employee_id' => $this->employee->id,
                'employee_email' => $this->employee->email,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Failed to send enrollment confirmation email', [
                'employee_id' => $this->employee->id,
                'employee_email' => $this->employee->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Re-throw exception to trigger retry
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('🚫 Enrollment confirmation email job failed permanently', [
            'employee_id' => $this->employee->id,
            'employee_email' => $this->employee->email,
            'error' => $exception->getMessage(),
        ]);

        // You can send a notification to admins here
    }
}
