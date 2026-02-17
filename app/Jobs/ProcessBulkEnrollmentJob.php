<?php

namespace App\Jobs;

use App\Models\BulkEnrollmentAction;
use App\Models\CompanyEmployee;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProcessBulkEnrollmentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bulkAction;

    /**
     * Create a new job instance.
     */
    public function __construct(BulkEnrollmentAction $bulkAction)
    {
        $this->bulkAction = $bulkAction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->bulkAction->update(['status' => 'processing']);
        $filePath = storage_path('app/public/' . $this->bulkAction->uploaded_file);
        if (!file_exists($filePath)) {
            $this->bulkAction->update(['status' => 'failed']);
            Log::error('Bulk enrollment file not found: ' . $filePath);
            return;
        }
        $csv = array_map('str_getcsv', file($filePath));
        $headers = array_map('trim', array_shift($csv));
        $inserted = 0;
        $failed = 0;
        $total = count($csv);
        $insertedRows = [];
        $failedRows = [];
        $enrollmentPeriodId = $this->bulkAction->enrollment_period_id;
        $enrollmentId = $this->bulkAction->enrollment_id;
        $rowNumber = 2;
        foreach ($csv as $row) {
            if (count($row) !== count($headers)) {
                $failedRows[] = array_merge(array_combine($headers, $row), ['_error' => 'Malformed row', '_row' => $rowNumber]);
                $failed++;
                $rowNumber++;
                continue;
            }
            $data = array_combine($headers, $row);
            try {
                DB::beginTransaction();
                // Find or create employee
                $employee = CompanyEmployee::where('employees_code', $data['employee_code'])
                    ->where('is_delete', 0)
                    ->first();
                if (!$employee) {
                    $employee = new CompanyEmployee();
                    $employee->company_id = $data['company_id'] ?? null;
                    $employee->employees_code = $data['employee_code'];
                    $employee->full_name = $data['insured_name'] ?? '';
                    $employee->email = $data['email'] ?? '';
                    $employee->gender = $data['gender'] ?? '';
                    $employee->dob = !empty($data['dob']) ? date('Y-m-d', strtotime(str_replace(['/', '.'], '-', $data['dob']))) : null;
                    $employee->is_active = 1;
                    $employee->is_delete = 0;
                    $employee->created_on = now();
                    $employee->save();
                }
                // Insert into new_enrolment_data
                \App\Models\NewEnrolmentData::create([
                    'emp_id' => $employee->id,
                    'cmp_id' => $employee->company_id,
                    'enrolment_id' => $enrollmentId,
                    'enrolment_portal_id' => $enrollmentPeriodId,
                    'insured_name' => $data['insured_name'] ?? '',
                    'gender' => $data['gender'] ?? '',
                    'relation' => $data['relation'] ?? '',
                    'detailed_relation' => $data['relation'] ?? '',
                    'dob' => !empty($data['dob']) ? date('Y-m-d', strtotime(str_replace(['/', '.'], '-', $data['dob']))) : null,
                    'base_sum_insured' => $data['base_sum_insured'] ?? 0,
                    'base_premium_on_company' => $data['base_premium_on_company'] ?? 0,
                    'base_premium_on_employee' => $data['base_premium_on_employee'] ?? 0,
                    'base_plan_name' => $data['base_plan_name'] ?? '',
                    'extra_coverage_plan_name' => $data['extra_coverage_plan_name'] ?? '',
                    'extra_coverage_premium_on_company' => $data['extra_coverage_premium_on_company'] ?? 0,
                    'extra_coverage_premium_on_employee' => $data['extra_coverage_premium_on_employee'] ?? 0,
                    'is_edit' => 0,
                    'is_delete' => 0,
                    'created_by' => 'SuperAdmin',
                    'updated_by' => 'SuperAdmin',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::commit();
                $insertedRows[] = $data;
                $inserted++;
            } catch (\Exception $e) {
                DB::rollBack();
                $data['_error'] = $e->getMessage();
                $failedRows[] = $data;
                $failed++;
                Log::error('Bulk enrollment row failed: ' . $e->getMessage());
            }
            $rowNumber++;
        }
        $this->bulkAction->update([
            'inserted_count' => $inserted,
            'failed_count' => $failed,
            'total_records' => $total,
            'status' => 'completed',
        ]);
    }
}
