<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use App\Helpers\ApiResponse;

class TpaService
{
    /**
     * Dispatch to TPA-specific handler
     */
    public function getDetails(int $tpaId, $policy, $employee, $company)
    {
        switch ($tpaId) {
            case 62: // PHS
                return $this->phsDetails($policy, $employee, $company);
            case 63: // ICICI
                return $this->iciciDetails($policy, $employee, $company);
            default:
                return ApiResponse::error('Service under maintenance for this TPA', null, 503);
        }
    }

    /**
     * PHS policy details implementation (adapted from legacy code)
     */
    private function phsDetails($policy, $employee, $company)
    {
        // tpa_data from phs_endorsement_data
        $tpaData = DB::table('phs_endorsement_data')
            ->where('policy_id', $policy->id)
            ->where('emp_id', $employee->id)
            ->first();

        $mappingData = DB::table('policy_mapping_master')
            ->where('policy_id', $policy->id)
            ->where('emp_id', $employee->id)
            ->where('cmp_id', $company->comp_id)
            ->where('status', 1)
            ->first();

        $escalationMatrix = DB::table('escalation_matrix')
            ->where('policy_id', $policy->id)
            ->get();

        if (empty($mappingData)) {
            return ApiResponse::error('Policy is not mapped', null, 400);
        }

        // cover string
        $coverQuery = "SELECT CONCAT_WS(
            ' <br> & <br>', 
                IF(SUM(base_sum_insured) > 0, CONCAT('Base SI <br> Rs. ', FORMAT(SUM(base_sum_insured), 0)), NULL),
                IF(SUM(topup_sum_insured) > 0, CONCAT('Top Up SI <br> Rs. ', FORMAT(SUM(topup_sum_insured), 0)), NULL),
                IF(SUM(parent_sum_insured) > 0, CONCAT('Parents SI <br> Rs. ', FORMAT(SUM(parent_sum_insured), 0)), NULL),
                IF(SUM(parent_in_law_sum_insured) > 0, CONCAT('Parents in Law SI <br> Rs.', FORMAT(SUM(parent_in_law_sum_insured), 0)), NULL)
            ) AS output_string FROM phs_endorsement_data WHERE cmp_id = " . intval($company->comp_id) . " AND policy_id = " . intval($policy->id) . " AND emp_id = " . intval($employee->id) . " AND mapping_id = " . intval($mappingData->id) . " AND addition_endorsement_id = " . intval($mappingData->addition_endorsement_id);

        $coverRow = DB::select($coverQuery);
        $coverStr = $coverRow[0]->output_string ?? null;

        // Call remote PHS API for enrollment details
        $client = new Client(['timeout' => 10]);
        $payload = [
            'USERNAME' => 'ZOOM-ADMIN',
            'PASSWORD' => 'ADMIN-USER@389',
            'POLICY_NO' => $policy->policy_number,
            'EMPLOYEE_NO' => $employee->employees_code
        ];

        $endpoint = 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/GetEnrollmentDetails';

        try {
            $response = $client->post($endpoint, [
                'headers' => ['Content-Type' => 'application/json'],
                'json' => $payload
            ]);

            $body = (string)$response->getBody();
        } catch (\Exception $e) {
            Log::error('PHS API request failed: ' . $e->getMessage());
            $body = null;
        }

        // Persist log for debugging
        $this->writeTpaLog('phs', $payload, $body, 'phs/get_enrollment_details');

        $enrollmentData = [];
        if (!empty($body)) {
            $json = json_decode($body);
            $enrollmentData = $json->GetEnrollmentDetailsResult ?? [];
        }

        $dependents = [];
        foreach ($enrollmentData as $enrollment) {
            $relation = $enrollment->RELATION ?? null;
            $item = [
                'relation' => ($relation === 'EMPLOYEE' ? 'SELF' : ($relation ?? '')),
                'dependent' => $enrollment->BENEFICIARY_NAME ?? null,
                'dob' => $enrollment->DATE_OF_BIRTH ?? null,
                'gender' => $enrollment->GENDER ?? null,
            ];

            if (($relation ?? '') === 'EMPLOYEE') {
                array_unshift($dependents, $item);
            } else {
                $dependents[] = $item;
            }
        }

        // Build response
        $result = [
            'policy' => $policy,
            'insurance_comp' => DB::table('insurance_master')->where('id', $policy->ins_id)->first(),
            'tpa_data' => $tpaData,
            'mapping_data' => $mappingData,
            'escalation_matrix' => $escalationMatrix,
            'cover_string' => $coverStr,
            'dependents' => $dependents,
        ];

        return ApiResponse::success($result, 'Policy details fetched', 200);
    }

    /**
     * ICICI policy details implementation
     */
    private function iciciDetails($policy, $employee, $company)
    {
        $tpaData = DB::table('icici_endorsement_data')
            ->where('policy_id', $policy->id)
            ->where('emp_id', $employee->id)
            ->first();

        $mappingData = DB::table('policy_mapping_master')
            ->where('policy_id', $policy->id)
            ->where('emp_id', $employee->id)
            ->where('cmp_id', $company->comp_id)
            ->where('status', 1)
            ->first();

        $escalationMatrix = DB::table('escalation_matrix')
            ->where('policy_id', $policy->id)
            ->get();

        if (empty($mappingData)) {
            return ApiResponse::error('Policy is not mapped', null, 400);
        }

        // dependents from icici_endorsement_data
        $dependents = DB::select(
            "SELECT `icici_id` as icici_id, `insured_name` as insured_name, `dob` as dob, `gender` as gender, `relation` as relation FROM `icici_endorsement_data` WHERE `emp_id` = ? AND `addition_endorsement_id` IS NOT NULL AND `addition_endorsement_id` != 0 AND `policy_id` = ?",
            [$employee->id, $policy->id]
        );

        // cover string
        $coverQuery = "SELECT CONCAT_WS(
            ' <br> & <br>', 
            IF(SUM(base_sum_insured) > 0, CONCAT('Base SI <br> Rs. ', FORMAT(SUM(base_sum_insured), 0)), NULL),
            IF(SUM(topup_sum_insured) > 0, CONCAT('Top Up SI <br> Rs. ', FORMAT(SUM(topup_sum_insured), 0)), NULL),
            IF(SUM(parent_sum_insured) > 0, CONCAT('Parents SI <br> Rs. ', FORMAT(SUM(parent_sum_insured), 0)), NULL),
            IF(SUM(parent_in_law_sum_insured) > 0, CONCAT('Parents in Law SI <br> Rs. ', FORMAT(SUM(parent_in_law_sum_insured), 0)), NULL)
        ) AS output_string 
        FROM icici_endorsement_data 
        WHERE cmp_id = " . intval($company->comp_id) . " 
        AND policy_id = " . intval($policy->id) . " 
        AND emp_id = " . intval($employee->id) . " 
        AND mapping_id = " . intval($mappingData->id) . " 
        AND addition_endorsement_id = " . intval($mappingData->addition_endorsement_id);

        $coverRow = DB::select($coverQuery);
        $coverStr = $coverRow[0]->output_string ?? null;

        $result = [
            'policy' => $policy,
            'insurance_comp' => DB::table('insurance_master')->where('id', $policy->ins_id)->first(),
            'tpa_data' => $tpaData,
            'mapping_data' => $mappingData,
            'escalation_matrix' => $escalationMatrix,
            'cover_string' => $coverStr,
            'dependents' => $dependents,
        ];

        return ApiResponse::success($result, 'Policy details fetched', 200);
    }

    /**
     * Write TPA request/response to storage/logs for debugging
     */
    private function writeTpaLog($tpaCompany, $request, $response, $path = '')
    {
        $date = date('Y-m-d');
        $basePath = storage_path("logs/tpa_logs/{$tpaCompany}");
        if (!is_dir($basePath)) {
            mkdir($basePath, 0777, true);
        }
        $logFile = $basePath . "/{$date}.log";

        $logText = "==============================\n";
        $logText .= "Timestamp   : " . now()->toDateTimeString() . "\n";
        $logText .= "TPA Company : {$tpaCompany}\n";
        $logText .= "Log Path    : {$path}\n";
        $logText .= "Request     :\n" . print_r($request, true) . "\n";
        $logText .= "Response    :\n" . print_r($response, true) . "\n";
        $logText .= "==============================\n\n";

        file_put_contents($logFile, $logText, FILE_APPEND);
    }
}
