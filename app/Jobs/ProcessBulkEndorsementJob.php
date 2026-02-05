<?php

namespace App\Jobs;

use App\Models\BulkEndorsementAction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProcessBulkEndorsementJob implements ShouldQueue
{
    private function generateCsv($headers, $rows, $type)
    {
        if (empty($rows)) {
            return null;
        }
        $filename = 'bulk_uploads/' . $this->bulkAction->id . '_' . $type . '_' . time() . '.csv';
        $path = storage_path('app/public/' . $filename);
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $file = fopen($path, 'w');
        fputcsv($file, $headers);
        foreach ($rows as $row) {
            $rowData = [];
            foreach ($headers as $header) {
                $rowData[] = $row[$header] ?? '';
            }
            fputcsv($file, $rowData);
        }
        fclose($file);
        return $filename;
    }
    /**
     * Common function to process and validate a single endorsement row.
     * Returns array with keys: 'data' (insert array) or 'error' (validation error message)
     */
    private function processEndorsementRow($member, $policy, $endorsement)
    {
        // Required fields
        $requiredFields = [
            'S.No',
            'Employee Code',
            'Insured Name',
            'Gender',
            'Relation',
            'D.O.B(dd-mm-yyyy)',
            'Date Of Joining(dd-mm-yyyy)',
            'Base Sum Insured',
            'Base Premium On Company',
            'Base Premium On Employee',
            'Topup Sum Insured',
            'Topup Premium On Company',
            'Topup Premium On Employee',
            'Parent Sum Insured',
            'Parent Premium On Company',
            'Parent Premium On Employee',
            'Parent-In-Law Sum Insured',
            'Parent-In-Law Premium On Company',
            'Parent-In-Law Premium On Employee'
        ];
        foreach ($requiredFields as $field) {
            // Allow '0' as valid for numeric fields
            if (!isset($member[$field]) || ($member[$field] === '' || $member[$field] === null)) {
                return ['error' => ($member['Employee Code'] ?? 'Unknown') . ': ' . $field . ' is Missing'];
            }
        }
        // Gender check
        if (!in_array($member['Gender'], ['MALE', 'FEMALE', 'OTHER'])) {
            return ['error' => $member['Employee Code'] . ': Gender is not in correct format'];
        }
        // Relation check
        $relations = ['SELF', 'WIFE', 'HUSBAND', 'SON', 'DAUGHTER', 'MOTHER', 'FATHER', 'MOTHER-IN-LAW', 'FATHER-IN-LAW', 'SIBLING', 'SPOUSE'];
        $relationValue = strtoupper(trim($member['Relation']));
        if (!in_array($relationValue, $relations)) {
            return ['error' => $member['Employee Code'] . ': Incorrect relation mentioned'];
        }
        // Date diff check
        $doj = strtotime(str_replace('/', '-', $member['Date Of Joining(dd-mm-yyyy)']));
        $policyEnd = strtotime($policy->policy_end_date);
        $diff = abs(round(($doj - $policyEnd) / 86400));
        if ($diff < 1) {
            return ['error' => $member['Employee Code'] . ': Kindly check your Date of Joining'];
        }
        // Find employee by employees_code and company_id
        $employee = DB::table('company_employees')
            ->where('is_delete', 0)
            ->where('employees_code', $member['Employee Code'])
            ->where('company_id', $policy->comp_id)
            ->first();
        if (!$employee) {
            return ['error' => $member['Employee Code'] . ': Employee Not Found'];
        }
        // Find or create mapping in policy_mapping_master
        $mapping = DB::table('policy_mapping_master')
            ->where('policy_id', $policy->id)
            ->where('cmp_id', $policy->comp_id)
            ->where('emp_id', $employee->id)
            ->first();
        if (!$mapping) {
            $mappingId = DB::table('policy_mapping_master')->insertGetId([
                'policy_id' => $policy->id,
                'cmp_id' => $policy->comp_id,
                'emp_id' => $employee->id,
                'addition_endorsement_id' => $endorsement->id,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $mappingId = $mapping->id;
        }
        // Build insert data
        $insertData = [
            'policy_id' => $policy->id,
            'cmp_id' => $policy->comp_id,
            'emp_id' => $employee->id,
            'mapping_id' => $mappingId,
            'addition_endorsement_id' => $endorsement->id,
            // Dynamic UHID/id column will be set in main loop
            'insured_name' => $member['Insured Name'],
            'gender' => $member['Gender'],
            'relation' => $member['Relation'],
            'dob' => date('Y-m-d', strtotime(str_replace('/', '-', $member['D.O.B(dd-mm-yyyy)']))),
            'date_of_joining' => date('Y-m-d', strtotime(str_replace('/', '-', $member['Date Of Joining(dd-mm-yyyy)']))),
            'base_sum_insured' => $member['Base Sum Insured'],
            'base_premium_on_company' => $member['Base Premium On Company'],
            'base_premium_on_employee' => $member['Base Premium On Employee'],
            'topup_sum_insured' => $member['Topup Sum Insured'],
            'topup_premium_on_company' => $member['Topup Premium On Company'],
            'topup_premium_on_employee' => $member['Topup Premium On Employee'],
            'parent_sum_insured' => $member['Parent Sum Insured'],
            'parent_premium_on_company' => $member['Parent Premium On Company'],
            'parent_premium_on_employee' => $member['Parent Premium On Employee'],
            'parent_in_law_sum_insured' => $member['Parent-In-Law Sum Insured'],
            'parent_in_law_premium_on_company' => $member['Parent-In-Law Premium On Company'],
            'parent_in_law_premium_on_employee' => $member['Parent-In-Law Premium On Employee'],
            'created_at' => now(),
            'updated_at' => now(),
        ];
        return ['data' => $insertData, 'employee' => $employee];
    }

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bulkAction;

    /**
     * Create a new job instance.
     */
    public function __construct(BulkEndorsementAction $bulkAction)
    {
        $this->bulkAction = $bulkAction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $this->bulkAction->update(['status' => 'processing']);
            Log::info('ProcessBulkEndorsementJob started', [
                'bulkActionId' => $this->bulkAction->id,
                'uploaded_file' => $this->bulkAction->uploaded_file,
            ]);
            $endorsement = $this->bulkAction->endorsement;
            $policy = $endorsement ? $endorsement->policy : null;
            $tpa_table_name = '';
            $uhid = 'UHID';
            if ($policy) {
                if (isset($policy->is_old) && $policy->is_old == 0) {
                    $tpa_id = $policy->tpa_id ?? null;
                    if ($tpa_id) {
                        switch ($tpa_id) {
                            case 60:
                                $uhid = 'demo_id';
                                break;
                            case 61:
                                $uhid = 'star_id';
                                break;
                            case 62:
                                $uhid = 'phs_id';
                                break;
                            case 63:
                                $uhid = 'icici_id';
                                break;
                            case 64:
                                $uhid = 'go_digit_id';
                                break;
                            case 65:
                                $uhid = 'vidal_id';
                                break;
                            case 66:
                                $uhid = 'fhpl_id';
                                break;
                            case 67:
                                $uhid = 'mediassist_id';
                                break;
                            case 68:
                                $uhid = 'safeway_id';
                                break;
                            case 69:
                                $uhid = 'care_id';
                                break;
                            case 70:
                                $uhid = 'health_india_id';
                                break;
                            case 71:
                                $uhid = 'ewa_id';
                                break;
                            case 72:
                                $uhid = 'sbi_id';
                                break;
                            case 73:
                                $uhid = 'ericson_id';
                                break;
                            case 75:
                                $uhid = 'ab_id';
                                break;
                            default:
                                $uhid = '';
                                break;
                        }
                        $tpa = DB::table('tpa_master')->where('id', $tpa_id)->first();
                        if ($tpa && isset($tpa->tpa_table_name)) {
                            $tpa_table_name = $tpa->tpa_table_name;
                        }
                    }
                } elseif (isset($policy->is_old) && $policy->is_old == 2) {
                    $tpa_table_name = 'endorsement_data';
                    $uhid = 'uhid';
                } else {
                    $tpa_table_name = $policy->tpa_table_name ?? '';
                }
            }
            $filePath = storage_path('app/public/' . $this->bulkAction->uploaded_file);
            Log::info('ProcessBulkEndorsementJob file check', [
                'filePath' => $filePath,
                'file_exists' => file_exists($filePath),
                'tpa_table_name' => $tpa_table_name,
                'uhid' => $uhid,
            ]);
            $inserted = 0;
            $failed = 0;
            $total = 0;
            $insertedRows = [];
            $failedRows = [];
            $headersWithRemark = [];
            $headersWithErrorRemark = [];
            if ($tpa_table_name && file_exists($filePath)) {
                $csv = array_map('str_getcsv', file($filePath));
                $headers = array_map('trim', array_shift($csv));
                $headersWithRemark = array_merge($headers, ['Remark']);
                $headersWithErrorRemark = array_merge($headers, ['Error', 'Remark']);
                Log::info('ProcessBulkEndorsementJob: action_type', ['action_type' => $this->bulkAction->action_type]);
                if ($this->bulkAction->action_type === 'bulk_add') {
                    Log::info('ProcessBulkEndorsementJob: Confirmed bulk_add block, will call processEndorsementRow');
                    Log::info('ProcessBulkEndorsementJob: Entered bulk_add block');
                    foreach ($csv as $row) {
                        $total++;
                        if (count($row) !== count($headers)) {
                            $failed++;
                            continue;
                        }
                        $member = array_combine($headers, $row);
                        $result = $this->processEndorsementRow($member, $policy, $endorsement);
                        if (isset($result['error'])) {
                            $member['Error'] = $result['error'];
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            Log::error('BulkEndorsement Validation Failed', ['error' => $result['error'], 'row' => $member]);
                            continue;
                        }
                        $insertData = $result['data'];
                        if (!empty($uhid) && isset($member[$uhid])) {
                            $insertData[$uhid] = $member[$uhid];
                        }
                        $duplicate = false;
                        if (!empty($uhid) && isset($insertData[$uhid])) {
                            $query = DB::table($tpa_table_name)
                                ->where('emp_id', $insertData['emp_id'] ?? null)
                                ->where('policy_id', $insertData['policy_id'] ?? null)
                                ->where('cmp_id', $insertData['cmp_id'] ?? null)
                                ->whereNull('deletion_endorsement_id')
                                ->where($uhid, $insertData[$uhid])
                                ->where('insured_name', $insertData['insured_name'] ?? null)
                                ->where('gender', $insertData['gender'] ?? null)
                                ->where('relation', $insertData['relation'] ?? null);
                            $duplicate = $query->exists();
                        }
                        if ($duplicate) {
                            $member['Error'] = 'Record already exists';
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            Log::info('BulkEndorsement Duplicate Skipped', [
                                'reason' => 'Record already exists',
                                'emp_id' => $insertData['emp_id'] ?? null,
                                'policy_id' => $insertData['policy_id'] ?? null,
                                'cmp_id' => $insertData['cmp_id'] ?? null,
                                'uhid' => $insertData[$uhid] ?? null,
                                'insured_name' => $insertData['insured_name'] ?? null,
                                'gender' => $insertData['gender'] ?? null,
                                'relation' => $insertData['relation'] ?? null,
                                'row' => $insertData
                            ]);
                            continue;
                        }
                        Log::info('BulkEndorsement Insert Row', [
                            'policy_id' => $insertData['policy_id'] ?? null,
                            'cmp_id' => $insertData['cmp_id'] ?? null,
                            'emp_id' => $insertData['emp_id'] ?? null,
                            'mapping_id' => $insertData['mapping_id'] ?? null,
                            'row' => $insertData
                        ]);
                        try {
                            DB::table($tpa_table_name)->insert($insertData);
                            $member['Remark'] = 'Inserted';
                            $insertedRows[] = $member;
                            $inserted++;
                        } catch (\Exception $e) {
                            $member['Error'] = $e->getMessage();
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            Log::error('ProcessBulkEndorsementJob insert failed', [
                                'error' => $e->getMessage(),
                                'row' => $member,
                            ]);
                            continue;
                        }
                    }
                } else if ($this->bulkAction->action_type === 'bulk_remove') {
                    Log::info('ProcessBulkEndorsementJob: Confirmed bulk_remove block, will NOT call processEndorsementRow');
                    Log::info('ProcessBulkEndorsementJob: Entered bulk_remove block');
                    Log::info('ProcessBulkEndorsementJob: bulk_remove required fields', [
                        'fields' => [
                            'S.No',
                            'Employee Code',
                            'Insured Name',
                            'Relation',
                            'Date Of Leaving(dd-mm-yyyy)',
                            'Refund Base Premium On Company',
                            'Refund Base Premium On Employee',
                            'Refund Topup Premium On Company',
                            'Refund Topup Premium On Employee',
                            'Refund Parent Premium On Company',
                            'Refund Parent Premium On Employee',
                            'Refund Parent-In-Law Premium On Company',
                            'Refund Parent-In-Law Premium On Employee',
                        ]
                    ]);
                    foreach ($csv as $row) {
                        $total++;
                        if (count($row) !== count($headers)) {
                            $failed++;
                            continue;
                        }
                        $member = array_combine($headers, $row);
                        // Validate required fields for remove
                        $requiredFields = [
                            'S.No',
                            'Employee Code',
                            'Insured Name',
                            'Relation',
                            'Date Of Leaving(dd-mm-yyyy)',
                            'Refund Base Premium On Company',
                            'Refund Base Premium On Employee',
                            'Refund Topup Premium On Company',
                            'Refund Topup Premium On Employee',
                            'Refund Parent Premium On Company',
                            'Refund Parent Premium On Employee',
                            'Refund Parent-In-Law Premium On Company',
                            'Refund Parent-In-Law Premium On Employee',
                        ];
                        $missing = [];
                        foreach ($requiredFields as $field) {
                            if (!isset($member[$field]) || $member[$field] === '') {
                                $missing[] = $field;
                            }
                        }
                        if (count($missing) > 0) {
                            $member['Error'] = 'Missing fields: ' . implode(', ', $missing);
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            continue;
                        }
                        // Find employee
                        $employee = DB::table('company_employees')
                            ->where('is_delete', 0)
                            ->where('employees_code', $member['Employee Code'])
                            ->where('company_id', $policy->comp_id)
                            ->first();
                        if (!$employee) {
                            $member['Error'] = 'Employee Not Found';
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            continue;
                        }
                        // Find mapping
                        $mapping = DB::table('policy_mapping_master')
                            ->where('policy_id', $policy->id)
                            ->where('cmp_id', $policy->comp_id)
                            ->where('emp_id', $employee->id)
                            ->first();
                        if (!$mapping) {
                            $member['Error'] = 'Mapping Not Found';
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            continue;
                        }
                        // Find record to delete
                        $query = DB::table($tpa_table_name)
                            ->where('emp_id', $employee->id)
                            ->where('policy_id', $policy->id)
                            ->where('cmp_id', $policy->comp_id)
                            ->where('insured_name', $member['Insured Name'])
                            ->where('relation', $member['Relation'])
                            ->whereNull('deletion_endorsement_id');
                        if (!empty($uhid) && isset($member[$uhid])) {
                            $query->where($uhid, $member[$uhid]);
                        }
                        $existing = $query->first();
                        if (!$existing) {
                            $member['Error'] = 'Record not found or already removed';
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            continue;
                        }
                        // Mark as deleted and update refund fields
                        try {
                            DB::table($tpa_table_name)
                                ->where('id', $existing->id)
                                ->update([
                                    'deletion_endorsement_id' => $endorsement->id,
                                    'date_of_leaving' => date('Y-m-d', strtotime(str_replace('/', '-', $member['Date Of Leaving(dd-mm-yyyy)']))),
                                    'refund_base_premium_on_company' => $member['Refund Base Premium On Company'],
                                    'refund_base_premium_on_employee' => $member['Refund Base Premium On Employee'],
                                    'refund_topup_premium_on_company' => $member['Refund Topup Premium On Company'],
                                    'refund_topup_premium_on_employee' => $member['Refund Topup Premium On Employee'],
                                    'refund_parent_premium_on_company' => $member['Refund Parent Premium On Company'],
                                    'refund_parent_premium_on_employee' => $member['Refund Parent Premium On Employee'],
                                    'refund_parent_in_law_premium_on_company' => $member['Refund Parent-In-Law Premium On Company'],
                                    'refund_parent_in_law_premium_on_employee' => $member['Refund Parent-In-Law Premium On Employee'],
                                    'updated_at' => now(),
                                ]);
                            $member['Remark'] = 'Removed';
                            $insertedRows[] = $member;
                            $inserted++;
                        } catch (\Exception $e) {
                            $member['Error'] = $e->getMessage();
                            $member['Remark'] = '';
                            $failedRows[] = $member;
                            $failed++;
                            Log::error('ProcessBulkEndorsementJob remove failed', [
                                'error' => $e->getMessage(),
                                'row' => $member,
                            ]);
                            continue;
                        }
                    }
                } else {
                    Log::warning('ProcessBulkEndorsementJob: Unknown action_type, neither bulk_add nor bulk_remove', [
                        'action_type' => $this->bulkAction->action_type
                    ]);
                }
                $insertedFile = $this->generateCsv($headersWithRemark, $insertedRows, 'inserted');
                $failedFile = $this->generateCsv($headersWithErrorRemark, $failedRows, 'failed');
            }
            $insertedFileUrl = $insertedFile ? asset('storage/' . $insertedFile) : null;
            $failedFileUrl = $failedFile ? asset('storage/' . $failedFile) : null;
            $this->bulkAction->update([
                'inserted_count' => $inserted,
                'failed_count' => $failed,
                'total_records' => $total,
                'inserted_data_file' => $insertedFile ?? null,
                'not_inserted_data_file' => $failedFile ?? null,
                'inserted_data_url' => $insertedFileUrl,
                'not_inserted_data_url' => $failedFileUrl,
                'status' => 'completed',
            ]);
            Log::info('ProcessBulkEndorsementJob completed', [
                'inserted' => $inserted,
                'failed' => $failed,
                'total' => $total,
                'inserted_data_file' => $insertedFile ?? null,
                'inserted_data_url' => $insertedFileUrl,
                'not_inserted_data_file' => $failedFile ?? null,
                'not_inserted_data_url' => $failedFileUrl,
            ]);
        } catch (\Exception $e) {
            $this->bulkAction->update(['status' => 'failed']);
            Log::error('ProcessBulkEndorsementJob failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
