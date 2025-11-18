<?php

namespace App\Jobs;

use App\Models\BulkEmployeeAction;
use App\Models\CompanyEmployee;
use App\Models\CompanyLocationMaster;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ProcessBulkEmployeeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $bulkAction;

    /**
     * Create a new job instance.
     */
    public function __construct(BulkEmployeeAction $bulkAction)
    {
        $this->bulkAction = $bulkAction;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Update status to processing
            $this->bulkAction->update(['status' => 'processing']);

            // Read CSV file
            $filePath = storage_path('app/public/' . $this->bulkAction->uploaded_file);
            $csv = array_map('str_getcsv', file($filePath));
            $headers = array_shift($csv);

            $insertedRows = [];
            $failedRows = [];
            $insertedCount = 0;
            $failedCount = 0;


            // Always add Remark column to headers
            $headersWithRemark = array_merge($headers, ['Remark']);
            $headersWithErrorRemark = array_merge($headers, ['Error', 'Remark']);

            foreach ($csv as $row) {
                if (count($row) !== count($headers)) {
                    continue; // Skip malformed rows
                }

                $employee = array_combine($headers, $row);

                try {
                    if ($this->bulkAction->action_type === 'bulk_add') {
                        $result = $this->processAddEmployee($employee);
                    } else {
                        $result = $this->processRemoveEmployee($employee);
                    }

                    if ($result['success']) {
                        // Set Remark for success
                        $employee['Remark'] = $result['remark'] ?? '';
                        $insertedRows[] = $employee;
                        $insertedCount++;
                    } else {
                        $employee['Error'] = $result['message'];
                        $employee['Remark'] = $result['remark'] ?? '';
                        $failedRows[] = $employee;
                        $failedCount++;
                    }
                } catch (\Exception $e) {
                    $employee['Error'] = $e->getMessage();
                    $employee['Remark'] = '';
                    $failedRows[] = $employee;
                    $failedCount++;
                }
            }

            // Generate CSV files for inserted and failed records
            $insertedFile = $this->generateCsv($headersWithRemark, $insertedRows, 'inserted');
            $failedFile = $this->generateCsv($headersWithErrorRemark, $failedRows, 'failed');

            // Update bulk action record
            $this->bulkAction->update([
                'total_records' => count($csv),
                'inserted_count' => $insertedCount,
                'failed_count' => $failedCount,
                'inserted_data_file' => $insertedFile,
                'not_inserted_data_file' => $failedFile,
                'status' => 'completed',
            ]);
        } catch (\Exception $e) {
            $this->bulkAction->update([
                'status' => 'failed',
            ]);
            throw $e;
        }
    }

    private function processAddEmployee($employee)
    {
        $companyId = $this->bulkAction->comp_id;
        $employeeCode = $employee['Employee Code'] ?? '';
        $isEdit = false;
        $remark = '';
        $emailUpdated = false;

        // 1. Check if employee code exists
        $findExistingEmployee = CompanyEmployee::where('is_delete', 0)
            ->where('employees_code', $employeeCode)
            ->where('company_id', $companyId)
            ->first();

        if ($findExistingEmployee) {
            // If employee exists, email must match
            if (trim(strtolower($findExistingEmployee->email)) != trim(strtolower($employee['Email']))) {
                return ['success' => false, 'message' => $employeeCode . ': Employee Code Is Not Unique', 'remark' => ''];
            } else {
                $isEdit = true;
            }
        }

        // 2. Validate Email format
        if (!filter_var(trim($employee['Email']), FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => $employeeCode . ': Email is not Valid', 'remark' => ''];
        }

        // 3. Check if Email is already in use by another employee
        $findExistingEmail = CompanyEmployee::where('is_delete', 0)
            ->where('email', trim($employee['Email']))
            ->where('company_id', $companyId)
            ->first();

        if ($findExistingEmail) {
            if ($findExistingEmail->employees_code != $employeeCode) {
                return ['success' => false, 'message' => $employeeCode . ': Email is Already In Use', 'remark' => ''];
            } else {
                $isEdit = true;
            }
        }

        // 4. Validate New Email if provided
        if (!empty($employee['New Email']) && $employee['New Email'] != "") {
            if (!filter_var(trim($employee['New Email']), FILTER_VALIDATE_EMAIL)) {
                return ['success' => false, 'message' => $employeeCode . ': New Email is not Valid', 'remark' => ''];
            }

            $findExistingNewEmail = CompanyEmployee::where('is_delete', 0)
                ->where('email', trim($employee['New Email']))
                ->where('company_id', $companyId)
                ->first();

            if ($findExistingNewEmail) {
                return ['success' => false, 'message' => $employeeCode . ': New Email is Already in Use', 'remark' => ''];
            }
            $emailUpdated = true;
        }

        // 5. Validate required fields
        if (empty($employee['First Name']) || $employee['First Name'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': First Name is Missing', 'remark' => ''];
        }

        if (empty($employee['Gender']) || $employee['Gender'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': Gender is Missing', 'remark' => ''];
        }

        if (empty($employee['Date of Joining(dd-mm-yyyy)']) || $employee['Date of Joining(dd-mm-yyyy)'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': Date of Joining is Missing', 'remark' => ''];
        }

        if (empty($employee['D.O.B(dd-mm-yyyy)']) || $employee['D.O.B(dd-mm-yyyy)'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': D.O.B is Missing', 'remark' => ''];
        }

        if (empty($employee['Designation']) || $employee['Designation'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': Designation is Missing', 'remark' => ''];
        }

        if (empty($employee['Grade']) || $employee['Grade'] == "") {
            return ['success' => false, 'message' => $employeeCode . ': Grade is Missing', 'remark' => ''];
        }

        // 6. Validate Contact Number
        if (!empty($employee['Contact Number']) && $employee['Contact Number'] != "") {
            $contactNumber = preg_replace('/[^0-9]/', '', $employee['Contact Number']);
            if (strlen($contactNumber) != 10) {
                return ['success' => false, 'message' => $employeeCode . ': Contact Number is Not Valid', 'remark' => ''];
            }
        }

        // 7. Validate Gender values
        $validGenders = ['MALE', 'FEMALE', 'OTHER'];
        if (!in_array(strtoupper($employee['Gender']), $validGenders)) {
            return ['success' => false, 'message' => $employeeCode . ': Gender is not in correct format', 'remark' => ''];
        }

        // 8. Check if Entity exists
        $findEntity = CompanyLocationMaster::where('location_id', $employee['Entity Code'])
            ->where('comp_id', $companyId)
            ->first();

        if (empty($findEntity)) {
            return ['success' => false, 'message' => $employeeCode . ': Entity Not Found', 'remark' => ''];
        }

        // 9. Parse dates
        $doj = $this->parseDate($employee['Date of Joining(dd-mm-yyyy)']);
        $dob = $this->parseDate($employee['D.O.B(dd-mm-yyyy)']);

        // 10. Prepare employee data
        $employeeData = [
            'employees_code' => $employeeCode,
            'first_name' => strtoupper($employee['First Name']),
            'last_name' => strtoupper($employee['Last Name'] ?? ''),
            'full_name' => strtoupper(trim(($employee['First Name'] ?? '') . ' ' . ($employee['Last Name'] ?? ''))),
            'email' => !empty($employee['New Email']) && $employee['New Email'] != "" ? trim($employee['New Email']) : trim($employee['Email']),
            'gender' => strtolower($employee['Gender']),
            'date_of_joining' => $doj,
            'dob' => $dob,
            'designation' => $employee['Designation'],
            'grade' => $employee['Grade'],
            'location_id' => $findEntity->id,
            'mobile' => !empty($employee['Contact Number']) && $employee['Contact Number'] != "" ? preg_replace('/[^0-9]/', '', $employee['Contact Number']) : null,
            'company_id' => $companyId,
        ];

        // Set password as hash of dob in dd/mm/yyyy format
        $dobForPassword = $employee['D.O.B(dd-mm-yyyy)'];

        // Assign photo based on gender
        if (strtoupper($employee['Gender']) === 'MALE') {
            $employeeData['photo_url'] = asset('assets/male.png');
        } elseif (strtoupper($employee['Gender']) === 'FEMALE') {
            $employeeData['photo_url'] = asset('assets/female.png');
        } else {
            $employeeData['photo_url'] = asset('assets/other.png');
        }

        // 11. Update or Create employee
        if ($isEdit) {
            try {
                // If email is updated
                if ($emailUpdated) {
                    $remark = 'Email Updated';
                } else {
                    $remark = 'Data Updated';
                }
                $findExistingEmployee->update($employeeData);
                return ['success' => true, 'message' => $employeeCode . ': Employee Updated Successfully', 'remark' => $remark];
            } catch (\Exception $e) {
                return ['success' => false, 'message' => $employeeCode . ': Employee not updated due to internal server issue', 'remark' => ''];
            }
        } else {
            try {
                $employeeData['pwd'] = \Hash::make($dobForPassword);

                $employeeData['is_active'] = 1;
                $employeeData['is_delete'] = 0;
                $employeeData['created_on'] = now();
                $remark = 'Data Added';
                CompanyEmployee::create($employeeData);
                return ['success' => true, 'message' => $employeeCode . ': Employee added Successfully', 'remark' => $remark];
            } catch (\Exception $e) {
                return ['success' => false, 'message' => $employeeCode . ': Employee not added due to internal server issue', 'remark' => ''];
            }
        }
    }

    private function processRemoveEmployee($employee)
    {
        $companyId = $this->bulkAction->comp_id;

        $existingEmployee = CompanyEmployee::where('employees_code', $employee['Employee Code'])
            ->where('email', trim($employee['Email']))
            ->where('company_id', $companyId)
            ->where('is_delete', 0)
            ->first();

        if (!$existingEmployee) {
            return ['success' => false, 'message' => 'Employee not found'];
        }

        // Soft delete
        $existingEmployee->update([
            'is_delete' => 1,
            'is_active' => 0,
            'updated_on' => now(),
        ]);

        return ['success' => true, 'message' => 'Employee removed'];
    }

    private function parseDate($dateString)
    {
        try {
            // Try dd/mm/yyyy format
            if (strpos($dateString, '/') !== false) {
                $parts = explode('/', $dateString);
                if (count($parts) === 3) {
                    return Carbon::createFromFormat('d/m/Y', $dateString)->format('Y-m-d');
                }
            }

            // Try dd-mm-yyyy format
            if (strpos($dateString, '-') !== false) {
                $parts = explode('-', $dateString);
                if (count($parts) === 3 && strlen($parts[0]) <= 2) {
                    return Carbon::createFromFormat('d-m-Y', $dateString)->format('Y-m-d');
                }
            }

            // Fallback: assume Y-m-d format
            return $dateString;
        } catch (\Exception $e) {
            return $dateString;
        }
    }

    private function generateCsv($headers, $rows, $type)
    {
        if (empty($rows)) {
            return null;
        }

        $filename = 'bulk_uploads/' . $this->bulkAction->id . '_' . $type . '_' . time() . '.csv';
        $path = storage_path('app/public/' . $filename);

        // Create directory if it doesn't exist
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
}
