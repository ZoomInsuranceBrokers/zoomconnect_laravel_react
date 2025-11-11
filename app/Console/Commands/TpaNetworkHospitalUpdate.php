<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TpaNetworkHospitalUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tpanetworkhospitalupdate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update TPA network hospital data daily at midnight';

    /**
     * Execute the console command.
     */
    public function handle()
    {


        // Deactivate expired policies before running TPA updates
        $expiredPolicies = DB::table('policy_master')
            ->where('policy_end_date', '<', now())
            ->where('is_active', 1)
            ->get(['id', 'policy_number', 'policy_end_date']);

        if ($expiredPolicies->count() > 0) {
            $this->info('Deactivating expired policies:');
            foreach ($expiredPolicies as $policy) {
                $this->info(" - ID: {$policy->id}, Policy Number: {$policy->policy_number}, End Date: {$policy->policy_end_date}");
            }
        } else {
            $this->info('No policies to deactivate.');
        }

        DB::table('policy_master')
            ->where('policy_end_date', '<', now())
            ->where('is_active', 1)
            ->update(['is_active' => 0]);

        $this->info('=== Starting Hospital Network Data Update Process ===');
        $this->info('Started at: ' . now()->toDateTimeString());

        $functions = [
            'vidalNetworkHospital',
            'ericsonNetworkHospital',
            'mediassistNetworkHospital',
            'ewaNetworkHospital',
            'iciciNetworkHospital',
            'careNetworkHospital',
            'safewayNetworkHospital',
            'fhplNetworkHospitals'
        ];

        $completed = 0;
        $failed = 0;
        $total = count($functions);

        foreach ($functions as $function) {
            $this->info("[$completed/$total] Starting: $function");
            $this->info('Time: ' . now()->toDateTimeString());
            try {
                $this->{$function}();
                $this->info("✓ SUCCESS: $function - Hospitals uploaded successfully");
                $completed++;
            } catch (\Exception $e) {
                $this->error("✗ FAILED: $function - Error: " . $e->getMessage());
                $failed++;
            }
            $this->info('Completed at: ' . now()->toDateTimeString());
            $this->info(str_repeat('-', 60));
            sleep(2); // Add a small delay between functions
        }

        $this->info('=== Hospital Network Data Update Process Completed ===');
        $this->info("Total Functions: $total");
        $this->info("Completed Successfully: $completed");
        $this->info("Failed: $failed");
        $this->info('Finished at: ' . now()->toDateTimeString());

        if ($failed === 0) {
            $this->info('🎉 All hospital network functions completed successfully!');
        } else {
            $this->warn('⚠️  Some functions failed. Please check the logs above.');
        }
    }

    // --- TPA-specific stub methods ---
    /**
     * Vidal TPA: Fetch and update network hospitals
     */
    private function vidalNetworkHospital()
    {
        // 1. Truncate vidal_network_hospitals table
        DB::table('vidal_network_hospitals')->truncate();

        // 2. Get all active policies for Vidal TPA (tpa_id = 65)
        $policies = \App\Models\PolicyMaster::where(['tpa_id' => 65, 'is_active' => 1])->get();

        foreach ($policies as $policy) {
            $this->info('Processing policy: ' . $policy->policy_number);
            $headers = [
                'username: ZoomC_prod',
                'password: ZoomC@prod',
                'policynumber: ' . $policy->policy_number,
                'Authorization: Basic dmlkYWxicm9rZXJwcm9kbG9naW46dmlkYWxwcm9kQDEyMw=='
            ];

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://tips.vidalhealthtpa.com/rest/vidalbrokerservices/hospitalnetwork',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_HTTPHEADER => $headers,
            ]);
            $response = curl_exec($ch);
            curl_close($ch);

            $this->logApi('phs', $headers, $response, 'vidal_logs/network_hospital');

            $responseObj = json_decode($response);
            if (!$responseObj || !isset($responseObj->Result) || !is_array($responseObj->Result)) {
                $this->warn('No hospital data found for Vidal policy: ' . $policy->policy_number);
                continue;
            }
            $hospitals = json_decode(json_encode($responseObj->Result), true);
            foreach ($hospitals as $hospital) {
                $data = [
                    'policy_id' => $policy->id,
                    'hospital_id' => $hospital['HOSPITALID'] ?? null,
                    'hospital_name' => $hospital['HOSPITALNAME'] ?? '',
                    'zone_name' => $hospital['ZONE NAME'] ?? '',
                    'address_line_1' => $hospital['ADDRESSLINE1'] ?? '',
                    'address_line_2' => $hospital['ADDRESSLINE2'] ?? '',
                    'city_name' => $hospital['CITYNAME'] ?? '',
                    'state_name' => $hospital['STATENAME'] ?? '',
                    'pincode' => $hospital['PINCODE'] ?? '',
                    'landmark1' => $hospital['LANDMARK1'] ?? '',
                    'landmark2' => $hospital['LANDMARK2'] ?? '',
                    'stdcode' => $hospital['STDCODE'] ?? '',
                    'phone_number' => $hospital['PHONENUMBER'] ?? '',
                    'fax_number' => $hospital['FAXNUMBER'] ?? '',
                    'email' => $hospital['EMAIL'] ?? '',
                    'level_of_care' => $hospital['LEVELOFCARE'] ?? '',
                    'hospital_type' => $hospital['HOSPITAL TYPE'] ?? '',
                    'is_active' => $hospital['ISACTIVE'] ?? '',
                    'is_deleted' => $hospital['ISDELETED'] ?? '',
                    'latitude' => $hospital['LATITUDE'] ?? '',
                    'longitude' => $hospital['LONGITUDE'] ?? '',
                    'insurer_name' => $hospital['INSURER NAME'] ?? '',
                    'rohini_id' => $hospital['ROHINIID'] ?? ''
                ];
                DB::table('vidal_network_hospitals')->insert($data);
            }
        }
    }

    /**
     * Helper to log API requests/responses (mimics logfile_model->writeToLog)
     */
    private function logApi($tpa_company, $request, $response, $logPath)
    {
        // Build log file path: storage/logs/tpa_logs/{tpa_company}/network_hospital/{Y-m-d}.log
        $date = date('Y-m-d');
        $basePath = storage_path("logs/tpa_logs/{$tpa_company}/network_hospital");
        if (!is_dir($basePath)) {
            mkdir($basePath, 0777, true);
        }
        $logFile = $basePath . "/{$date}.log";

        // Format log entry for readability
        $logText = "==============================\n";
        $logText .= "Timestamp   : " . now()->toDateTimeString() . "\n";
        $logText .= "TPA Company : {$tpa_company}\n";
        $logText .= "Log Path    : {$logPath}\n";
        $logText .= "Request     :\n";
        if (is_array($request) || is_object($request)) {
            $logText .= print_r($request, true);
        } else {
            $logText .= (string)$request . "\n";
        }
        $logText .= "Response    :\n";
        if (is_array($response) || is_object($response)) {
            $logText .= print_r($response, true);
        } else {
            $logText .= (string)$response . "\n";
        }
        $logText .= "==============================\n\n";

        file_put_contents($logFile, $logText, FILE_APPEND);
    }

    /**
     * Ericson TPA: Fetch and update network hospitals
     */
    private function ericsonNetworkHospital()
    {
        // 1. Truncate ericson_network_hospitals table
        DB::table('ericson_network_hospitals')->truncate();

        // 2. Get all active policies for Ericson TPA (tpa_id = 73)
        $policies = \App\Models\PolicyMaster::where(['tpa_id' => 73, 'is_active' => 1])->get();

        foreach ($policies as $policy) {
            $this->info('Processing policy: ' . $policy->policy_number);
            $data2 = [
                'UserName' => 'ZOOM INSURANCE BROKERS PVT LTD',
                'Password' => '384',
                'PolicyNo' => $policy->policy_number,
            ];
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://sata.ericsontpa.com/sataservices/ericsontpaservices.asmx/NetworkHospital',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => http_build_query($data2),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/x-www-form-urlencoded'
                ],
            ]);
            $response = curl_exec($ch);
            curl_close($ch);

            $responseObj = json_decode($response);
            if (!$responseObj || !isset($responseObj->data) || !is_array($responseObj->data)) {
                $this->warn('No hospital data found for Ericson policy: ' . $policy->policy_number);
                continue;
            }
            $hospitals = $responseObj->data;
            foreach ($hospitals as $hospital) {
                $data = [
                    'policy_id' => $policy->id,
                    'hospital_id' => $hospital->hospital_list_code ?? null,
                    'hospital_name' => $hospital->hospital_list_name ?? '',
                    'zone_name' => '',
                    'address_line_1' => $hospital->hospital_list_addr_line1 ?? '',
                    'address_line_2' => $hospital->hospital_list_addr_line2 ?? '',
                    'city_name' => $hospital->hospital_list_city ?? '',
                    'state_name' => $hospital->hospital_list_state ?? '',
                    'pincode' => $hospital->hospital_list_pincode ?? '',
                    'landmark1' => '',
                    'landmark2' => '',
                    'stdcode' => $hospital->STDCode ?? '',
                    'phone_number' => $hospital->hospital_list_landline_number ?? '',
                    'fax_number' => $hospital->hospital_list_fax_number ?? '',
                    'email' => $hospital->hospital_list_email ?? '',
                    'level_of_care' => $hospital->LevelOfCare ?? '',
                    'hospital_type' => $hospital->NetworkType ?? '',
                    'is_active' => '1',
                    'is_deleted' => '0',
                    'latitude' => $hospital->latitude ?? '',
                    'longitude' => $hospital->longitude ?? '',
                    'insurer_name' => '',
                    'rohini_id' => $hospital->ROHINI_ID ?? ''
                ];
                DB::table('ericson_network_hospitals')->insert($data);
            }
        }
    }

    /**
     * Mediassist TPA: Fetch and update network hospitals
     */
    private function mediassistNetworkHospital()
    {
        // 1. Truncate mediassist_network_hospitals table
        DB::table('mediassist_network_hospitals')->truncate();

        // 2. Get all active policies for Mediassist TPA (tpa_id = 67)
        $policies = DB::table('policy_master')->where(['tpa_id' => 67, 'is_active' => 1])->get();

        foreach ($policies as $policy) {
            $data2 = '{"policyNumber": "' . $policy->policy_number . '"}';
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://apiintegration.mediassist.in/ClaimAPIServiceV2/ClaimService/NetworkHospital',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $data2,
                CURLOPT_HTTPHEADER => array(
                    'Username: zoombroker',
                    'Password: Zoom18Mx1IHgRdd90WQ',
                    'Content-Type: application/json',
                    'Cookie: Qr9P4DCuxyDHAAY_=v1BNOGSQSD3A7'
                ),
            ]);
            $response = curl_exec($ch);
            curl_close($ch);

            $apilog = [
                'tpa_company' => 'mediassist',
                'request' => $data2,
                'response' => $response
            ];
            $this->logApi('mediassist', $data2, $response, 'mediassist_logs/network_hospital');

            $responseObj = json_decode($response);
            if (!$responseObj || !isset($responseObj->isSuccess) || !$responseObj->isSuccess) {
                $this->warn('API call failed for policy: ' . $policy->policy_number);
                if (isset($responseObj->errorMessage)) {
                    $this->warn(' - Error: ' . $responseObj->errorMessage);
                }
                continue;
            }
            if (!isset($responseObj->providerData) || !is_array($responseObj->providerData)) {
                $this->warn('No hospital data found for policy: ' . $policy->policy_number);
                continue;
            }
            $hospitals = $responseObj->providerData;
            foreach ($hospitals as $hospital) {
                $data = [
                    'policy_id' => $policy->id,
                    'hosidnO1' => $hospital->hosidnO1 ?? '',
                    'partneR_ID' => $hospital->partneR_ID ?? '',
                    'zonE_NAME' => $hospital->zonE_NAME ?? '',
                    'hospitaL_NAME' => $hospital->hospitaL_NAME ?? '',
                    'addresS1' => $hospital->addresS1 ?? '',
                    'addresS2' => $hospital->addresS2 ?? '',
                    'citY_NAME' => $hospital->citY_NAME ?? '',
                    'statE_NAME' => $hospital->statE_NAME ?? '',
                    'piN_CODE' => $hospital->piN_CODE ?? '',
                    'landmarK_1' => $hospital->landmarK_1 ?? '',
                    'landmarK_2' => $hospital->landmarK_2 ?? '',
                    'phonE_NO' => $hospital->phonE_NO ?? '',
                    'email' => $hospital->email ?? '',
                    'leveL_OF_CARE' => $hospital->leveL_OF_CARE ?? '',
                    'ishospitalactive' => $hospital->ishospitalactive ?? '',
                    'insurance_Company' => $hospital->insurance_Company ?? '',
                    'hosP_CREATED_ON' => $hospital->hosP_CREATED_ON ?? '',
                    'hosP_MODIFIED_ON' => $hospital->hosP_MODIFIED_ON ?? '',
                    'hospLatitude' => $hospital->hospLatitude ?? '',
                    'hospLongitude' => $hospital->hospLongitude ?? '',
                    'rohinI_CODE' => $hospital->rohinI_CODE ?? ''
                ];
                DB::table('mediassist_network_hospitals')->insert($data);
            }
        }
    }

    /**
     * EWA TPA: Fetch and update network hospitals
     */
    private function ewaNetworkHospital()
    {
        // 1. Truncate ewa_network_hospitals table
        DB::table('ewa_network_hospitals')->truncate();

        // 2. Get all active policies for EWA TPA (tpa_id = 71)
        $policies = \App\Models\PolicyMaster::where(['tpa_id' => 71, 'is_active' => 1])->get();

        // 3. Get access token
        $accessToken = $this->ewaTokenGenerate();

        foreach ($policies as $policy) {
            // Map ins_id to insurerName as per provided logic
            switch ($policy->ins_id) {
                case 49:
                    $insurerName = 47;
                    break;
                case 50:
                    $insurerName = 37;
                    break;
                case 51:
                    $insurerName = 26;
                    break;
                case 52:
                    $insurerName = 23;
                    break;
                case 53:
                    $insurerName = 50;
                    break;
                case 54:
                    $insurerName = 28;
                    break;
                case 55:
                    $insurerName = 45;
                    break;
                case 56:
                    $insurerName = 36;
                    break;
                case 57:
                    $insurerName = 38;
                    break;
                case 58:
                    $insurerName = 8;
                    break;
                case 59:
                    $insurerName = 63;
                    break;
                case 60:
                    $insurerName = 21;
                    break;
                case 61:
                    $insurerName = 33;
                    break;
                case 62:
                    $insurerName = 16;
                    break;
                case 63:
                    $insurerName = 15;
                    break;
                case 64:
                    $insurerName = 44;
                    break;
                case 65:
                    $insurerName = 43;
                    break;
                case 66:
                    $insurerName = 4;
                    break;
                case 67:
                    $insurerName = 40;
                    break;
                case 68:
                    $insurerName = 7;
                    break;
                case 69:
                    $insurerName = 48;
                    break;
                case 70:
                    $insurerName = 31;
                    break;
                case 73:
                    $insurerName = 41;
                    break;
                default:
                    $this->warn('Unknown insurer ID: ' . $policy->ins_id);
                    continue 2;
            }

            $url = "https://apiadmin.ewatpa.com/trueclaim/policy-bazaar/hospital-network?insurerId=$insurerName&pageable=0&size=100000";
            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_HTTPHEADER => [
                    'Authorization: ' . $accessToken
                ],
            ]);
            $response = curl_exec($ch);
            curl_close($ch);

            $cleanedResponse = preg_replace("/^\)\]\}',\s*/", '', $response);
            $responseData = json_decode($cleanedResponse, true);

            if (isset($responseData['body'])) {
                foreach ($responseData['body'] as $hospital) {
                    $data = [
                        'policy_id' => $policy->id,
                        'insurance_id' => $policy->ins_id,
                        'hospital_id' => $hospital['hospital_ID'] ?? null,
                        'hospital_name' => $hospital['hospital_NAME'] ?? null,
                        'zone_name' => $hospital['network_TYPE'] ?? null,
                        'address_line_1' => $hospital['address_LINE_1'] ?? null,
                        'address_line_2' => $hospital['address_LINE_2'] ?? null,
                        'city_name' => $hospital['city_NAME'] ?? null,
                        'state_name' => $hospital['state_NAME'] ?? null,
                        'pincode' => $hospital['pincode'] ?? null,
                        'landmark1' => $hospital['landmark_1'] ?? null,
                        'landmark2' => $hospital['landmark_2'] ?? null,
                        'stdcode' => $hospital['std_CODE'] ?? null,
                        'phone_number' => $hospital['phone_NUMBER'] ?? null,
                        'fax_number' => $hospital['fax_NUMBER'] ?? null,
                        'email' => $hospital['email'] ?? null,
                        'level_of_care' => $hospital['level_OF_CARE'] ?? null,
                        'hospital_type' => $hospital['network_TYPE'] ?? null,
                        'is_active' => $hospital['hospital_list_is_active'] ?? null,
                        'latitude' => $hospital['hospital_list_latitude'] ?? null,
                        'longitude' => $hospital['hospital_list_longitude'] ?? null,
                        'insurer_name' => $insurerName,
                        'rohini_id' => $hospital['hospital_list_rohini_id'] ?? null,
                    ];
                    DB::table('ewa_network_hospitals')->insert($data);
                }
            } else {
                $this->warn('Error: ' . ($responseData['errorMessage'] ?? 'Unknown error'));
                continue;
            }
            $this->info('Hospitals added for insurer: ' . $insurerName);
        }
    }

    /**
     * Helper to get EWA access token (migrated from ewa_token_generate)
     */
    private function ewaTokenGenerate()
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://apiadmin.ewatpa.com/external/login',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                'emailId' => 'nipun.bansal@zoominsurancebrokers.com',
                'password' => 'Test@123',
                'loggedInPortal' => 'POLICY_CONFIGURATION_PORTAL'
            ]),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json'
            ],
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $cleanedResponse = preg_replace("/^\)\]\}',\s*/", '', $response);
        $responseData = json_decode($cleanedResponse, true);
        return $responseData['accessToken'] ?? null;
    }

    /**
     * ICICI TPA: Fetch and update network hospitals
     */
    private function iciciNetworkHospital()
    {
        // 1. Truncate icici_network_hospitals table
        DB::table('icici_network_hospitals')->truncate();

        // 2. Get access token
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://janus.icicilombard.com/generate-jwt-token',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => 'username=ZoomInsur&password=xUCfV8J6S64ahZW&client_id=ZoomInsur&client_secret=f2tn56Dr6oS4yJwWysPJTxpEQAncUC7n1l8i0UgoXAeMLk7LB7iBGfGrKnBYmxn8&scope=esbhealth&grant_type=password',
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ],
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $responseObj = json_decode($response);
        if (!isset($responseObj->token_type) || !isset($responseObj->access_token)) {
            $this->warn('ICICI token not generated');
            return;
        }
        $authHeader = $responseObj->token_type . ' ' . $responseObj->access_token;

        // 3. Call hospital list API
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://janus.icicilombard.com/health/ilservices/health/v1/generic/hospitalnetworklist',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => [
                'Content-type: application/json',
                'Authorization:' . $authHeader,
                'X-CorrelationId:cba1d91f-0a06-4f59-9df0-16596dd2e065'
            ],
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $responseObj = json_decode($response);
        if (!isset($responseObj->hospitalList) || !is_array($responseObj->hospitalList)) {
            $this->warn('No hospital data found from ICICI API');
            return;
        }
        foreach ($responseObj->hospitalList as $hospital) {
            $data = [
                'addressLine3' => $hospital->addressLine3 ?? '',
                'location' => $hospital->location ?? '',
                'landLineNumber2' => $hospital->landLineNumber2 ?? '',
                'hospitalProfile' => $hospital->hospitalProfile ?? '',
                'hospitalType' => $hospital->hospitalType ?? '',
                'irdaCode' => $hospital->irdaCode ?? '',
                'webSite' => $hospital->webSite ?? '',
                'hospitalCode' => $hospital->hospitalCode ?? '',
                'hospital_name' => $hospital->hospitalName ?? '',
                'addressLine1' => $hospital->addressLine1 ?? '',
                'addressLine2' => $hospital->addressLine2 ?? '',
                'city' => $hospital->city ?? '',
                'state' => $hospital->state ?? '',
                'pinCode' => $hospital->pinCode ?? '',
                'landLineNumber' => $hospital->landLineNumber ?? '',
                'faxNumber' => $hospital->faxNumber ?? '',
                'email' => $hospital->email ?? '',
                'status' => $hospital->status ?? '',
                'modifiedDate' => $hospital->modifiedDate ?? '',
            ];
            DB::table('icici_network_hospitals')->insert($data);
        }
    }

    /**
     * Care TPA: Fetch and update network hospitals
     */
    private function careNetworkHospital()
    {
        // 1. Truncate care_network_hospitals table
        DB::table('care_network_hospitals')->truncate();

        $page = 1;
        while (true) {
            $this->info("Fetching page: $page");

            // Refresh tokens each loop (in case of expiry)
            $tokenAndSession = $this->careToken2();
            if (!$tokenAndSession) {
                $this->warn('Care token/session not generated');
                break;
            }

            $payload = [
                'networkHospitalIO' => [
                    'name' => 'Rhicl',
                    'action' => 'get_network_hospital',
                    'input' => [
                        'device_id' => 'wrapper',
                        'visitor_id' => 'wrapper',
                        'type' => 'NL',
                        'state_id' => '',
                        'city_id' => '',
                        'page_no' => (string)$page
                    ]
                ]
            ];

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://api.careinsurance.com/relinterfacerestful/religare/secure/restful/getNetwork',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($payload),
                CURLOPT_HTTPHEADER => [
                    'appId: 95161',
                    'Signature: JjfcHY9AUIxhEQSN/hWPUe1CMLxmwOB+yj8VdXGNGrm8=',
                    'TimeStamp: 1636707591485',
                    'sessionId: ' . $tokenAndSession['session_id'],
                    'tokenId: ' . $tokenAndSession['token'],
                    'applicationCD: PARTNERAPP',
                    'Content-Type: application/json'
                ],
            ]);

            $response = curl_exec($ch);
            curl_close($ch);
            $responseObj = json_decode($response);

            if (!isset($responseObj->networkHospitalIO->networkHospitalResponse->data) || empty($responseObj->networkHospitalIO->networkHospitalResponse->data)) {
                $this->info("No more data found. Stopping at page $page");
                break;
            }

            $this->info('Hospital count on page ' . $page . ': ' . count($responseObj->networkHospitalIO->networkHospitalResponse->data));

            foreach ($responseObj->networkHospitalIO->networkHospitalResponse->data as $hospital) {
                $data = [
                    'netwrok_id'    => $hospital->netwrok_id ?? null,
                    'hospital_name' => $hospital->hospitalname ?? '',
                    'hospitalCode'  => $hospital->hospitalcode ?? '',
                    'state'         => $hospital->state ?? '',
                    'city'          => $hospital->city_name ?? '',
                    'location'      => $hospital->location ?? '',
                    'pinCode'       => $hospital->pincode ?? '',
                    'phone'         => $hospital->phone ?? '',
                    'created_at'    => now(),
                ];
                DB::table('care_network_hospitals')->insert($data);
            }

            $page++;
            sleep(1);
        }
    }

    /**
     * Helper to get Care token and session id (migrated from care_token2)
     */
    private function careToken2()
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.careinsurance.com/relinterfacerestful/religare/secure/restful/generatePartnerToken',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                'partnerTokenGeneratorInputIO' => [
                    'partnerId' => '95161',
                    'securityKey' => 'dkpBQ0Q3cGVGb1NXVnNsWW1EaERWb0ErQVFyTGFhSytNZCtrVzdzRGtrOW1DWktaTDdwWHRWdVZoYnpyV1JseA=='
                ]
            ]),
            CURLOPT_HTTPHEADER => [
                'appId: 95161',
                'Signature:jfcHY9AUIxhEQSN/hWPUe1CMLxmwOB+yj8VdXGNGrm8=',
                'TimeStamp: 1636707591485',
                'applicationCD: PARTNERAPP',
                'Content-Type: application/json'
            ],
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($response, true);
        if (isset($data['responseData']['status']) && $data['responseData']['status'] === "1" && isset($data['responseData']['message']) && $data['responseData']['message'] === "Success") {
            $tokenKey = $data['partnerTokenGeneratorInputIO']['listOfToken'][0]['tokenKey'] ?? '';
            $tokenValue = $data['partnerTokenGeneratorInputIO']['listOfToken'][0]['tokenValue'] ?? '';
            $sessionId = $data['partnerTokenGeneratorInputIO']['sessionId'] ?? '';
            $finalToken = $this->careEncryptToken($tokenKey, $tokenValue);
            return [
                'token' => $finalToken,
                'session_id' => $sessionId
            ];
        }
        return null;
    }

    /**
     * Helper to encrypt Care token (migrated from careencryptToken)
     */
    private function careEncryptToken($tokenKey, $tokenValue, $aesSecretKey = 'z5yK1lw7XYt6YKdP7Pne2Jw3zRkMAziH', $aesInitVector = 'i0kbCAlFTlDXshYV')
    {
        $token = $tokenKey . '|' . $tokenValue;
        $encryptedToken = openssl_encrypt($token, 'aes-256-cbc', $aesSecretKey, 0, $aesInitVector);
        $base64EncodedToken = base64_encode($encryptedToken);
        return $base64EncodedToken;
    }

    /**
     * Safeway TPA: Fetch and update network hospitals
     */
    private function safewayNetworkHospital()
    {
        // 1. Truncate safeway_new_network_hospitals table
        DB::table('safeway_new_network_hospitals')->truncate();

        // 2. Get all active policies for Safeway TPA (tpa_id = 68)
        $policies = \App\Models\PolicyMaster::where(['tpa_id' => 68, 'is_active' => 1])->get();

        foreach ($policies as $policy) {
            // Map ins_id to insurerName as per provided logic
            switch ($policy->ins_id) {
                case 49:
                    $insurerName = 'STAR HEALTH & ALLIED INSURANCE CO. LTD.';
                    break;
                case 50:
                    $insurerName = 'THE NEW INDIA ASSURANCE CO. LTD';
                    break;
                case 51:
                    $insurerName = 'ICICI Lombard General Insurance Co. Ltd.';
                    break;
                case 54:
                    $insurerName = 'IFFCO TOKIO GENERAL INSURANCE COMPANY LTD';
                    break;
                case 55:
                    $insurerName = 'SBI GENERAL INSURANCE COMPANY LIMITED';
                    break;
                case 56:
                    $insurerName = 'NATIONAL INSURANCE COMPANY LTD';
                    break;
                case 57:
                    $insurerName = 'THE ORIENTAL INSURANCE CO. LTD';
                    break;
                case 58:
                    $insurerName = 'ADITYA BIRLA HEALTH INSURANCE CO LTD';
                    break;
                case 59:
                    $insurerName = 'ZUNO GENERAL INSURANCE LIMITED';
                    break;
                case 60:
                    $insurerName = 'FUTURE GENERALI INDIA INSURANCE CO. LTD.';
                    break;
                case 61:
                    $insurerName = 'Magma General Insurance Limited';
                    break;
                case 62:
                    $insurerName = 'MANIPALCIGNA HEALTH INSURANCE COMPANY LTD';
                    break;
                case 63:
                    $insurerName = 'CHOLAMANDALAM MS GENERAL INSURANCE CO. LTD.';
                    break;
                case 64:
                    $insurerName = 'ROYAL SUNDARAM GENERAL INSURANCE CO. LTD';
                    break;
                case 65:
                    $insurerName = 'CARE HEALTH INSURANCE FORMERLY KNOWN AS RELIGARE H';
                    break;
                case 66:
                    $insurerName = 'HDFC ERGO GENERAL INSURANCE COMPANY';
                    break;
                case 69:
                    $insurerName = 'TATA AIG INSURANCE';
                    break;
                case 70:
                    $insurerName = 'LIBERTY GENERAL INSURANCE LIMITED';
                    break;
                default:
                    $this->warn('Unknown insurer ID: ' . $policy->ins_id);
                    continue 2;
            }

            $data = json_encode([
                'UWcode' => $insurerName
            ]);

            $ch = curl_init();
            curl_setopt_array($ch, [
                CURLOPT_URL => 'http://brokerapi.safewaytpa.in/api/Hospitalunderwriter',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json'
                ],
            ]);

            $response = curl_exec($ch);
            curl_close($ch);

            $cleanedResponse = preg_replace("/^\)\]\}',\s*/", '', $response);
            $responseData = json_decode($cleanedResponse, true);

            if (isset($responseData['HospitalList1'])) {
                foreach ($responseData['HospitalList1'] as $hospital) {
                    $data = [
                        'policy_id' => $policy->id,
                        'insurance_id' => $policy->ins_id,
                        'hospital_id' => $hospital['ID'] ?? null,
                        'Name' => $hospital['Name'] ?? null,
                        'Address' => $hospital['Address'] ?? null,
                        'city' => $hospital['city'] ?? null,
                        'state' => $hospital['state'] ?? null,
                        'pincode' => $hospital['pincode'] ?? null,
                        'phone' => $hospital['phone'] ?? null,
                        'mobile' => $hospital['mobile'] ?? null,
                        'email' => $hospital['email'] ?? null,
                        'latitude' => $hospital['latitude'] ?? null,
                        'longitude' => $hospital['longitude'] ?? null,
                        'insurer_name' => $insurerName,
                    ];
                    DB::table('safeway_new_network_hospitals')->insert($data);
                }
            } else {
                $this->warn('Error: ' . ($responseData['errorMessage'] ?? 'Unknown error'));
                continue;
            }
            $this->info('Hospitals added for insurer: ' . $insurerName);
        }
    }

    private function fhplAuthenticationApi()
    {
        $ch = curl_init();
        $postFields = 'UserName=ZoomInsurance&Password=fhla209oz&grant_type=password';
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://bconnect-api.fhpl.net/token',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $postFields,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded'
            ],
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $responseObj = json_decode($response);
        // Log API call
        $apilog = [
            'tpa_company' => 'fhpl',
            'request' => $postFields,
            'response' => $responseObj
        ];
        Log::info('FHPL Auth API', [
            'tpa_company' => 'fhpl',
            'request' => $postFields,
            'response' => $responseObj,
            'log_path' => 'fhpl_logs/auth_api'
        ]);
        return $responseObj->access_token ?? null;
    }

    /**
     * FHPL: Fetch and update network hospitals
     */
    private function fhplNetworkHospitals()
    {
        // 1. Truncate fhpl_network_hospitals table
        DB::table('fhpl_network_hospitals')->truncate();

        // 2. Get all active policies for FHPL TPA (tpa_id = 66)
        $policies = \App\Models\PolicyMaster::where(['tpa_id' => 66, 'is_active' => 1])->get();

        foreach ($policies as $policy) {
            $authToken = $this->fhplAuthenticationApi();
            if (!$authToken) {
                $this->warn('FHPL token not generated');
                continue;
            }
            $ch = curl_init();
            $postFields = 'UserName=ZoomInsurance&Password=fhla209oz&StartIndex=1&EndIndex=10000';
            curl_setopt_array($ch, [
                CURLOPT_URL => 'https://bconnect-api.fhpl.net/api/GetNetworkHospitalDetails',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $postFields,
                CURLOPT_HTTPHEADER => [
                    'Authorization: bearer ' . $authToken,
                    'Content-Type: application/x-www-form-urlencoded'
                ],
            ]);
            $response = curl_exec($ch);
            curl_close($ch);
            $responseObj = json_decode($response);
            if (!$responseObj || !isset($responseObj->Table1) || !is_array($responseObj->Table1)) {
                $this->warn('No hospital data found for FHPL policy: ' . $policy->policy_number);
                continue;
            }
            $networkHospitals = json_decode(json_encode($responseObj->Table1), true);
            foreach ($networkHospitals as $networkHospital) {
                $data = [
                    'policy_id' => $policy->id,
                    'hospital_id' => $networkHospital['HospitalId'] ?? null,
                    'hospital_name' => $networkHospital['HospitalName'] ?? null,
                    'address_line_1' => $networkHospital['AddressLine1'] ?? null,
                    'address_line_2' => $networkHospital['AddressLine2'] ?? null,
                    'city_name' => $networkHospital['CityName'] ?? null,
                    'state_name' => $networkHospital['stateName'] ?? null,
                    'pincode' => $networkHospital['Pincode'] ?? null,
                    'landmark1' => $networkHospital['Landmark1'] ?? null,
                    'landmark2' => $networkHospital['Landmark2'] ?? null,
                    'stdcode' => $networkHospital['STDCode'] ?? null,
                    'phone_number' => $networkHospital['PhoneNumber'] ?? null,
                    'fax_number' => $networkHospital['FaxNumber'] ?? null,
                    'email' => $networkHospital['Email'] ?? null,
                    'level_of_care' => $networkHospital['LevelOfCare'] ?? null,
                    'is_active' => 1,
                    'latitude' => $networkHospital['Latitude coordinates'] ?? null,
                    'longitude' => $networkHospital['Longitude coordinates'] ?? null,
                    'rohini_id' => $networkHospital['Rohini Code'] ?? null
                ];
                DB::table('fhpl_network_hospitals')->insert($data);
            }
            $this->info('Hospitals added for FHPL policy: ' . $policy->policy_number);
        }
    }
}
