<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\CompanyEmployee;
use App\Models\WellnessService;
use App\Services\MailService;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Helpers\ApiResponse;

class ApiController extends Controller
{
    /**
     * Login with Email - Send OTP to email
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginWithEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation error', $validator->errors(), 422);
        }

        $email = $request->email;

        // Check if user exists in CompanyEmployee table
        $employee = CompanyEmployee::where('email', $email)
            ->where('is_active', 1)
            ->where('is_delete', 0)
            ->first();

        if (!$employee) {
            return ApiResponse::error('User not found or inactive', null, 404);
        }

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Store OTP in cache for 10 minutes
        Cache::put('otp_email_' . $email, $otp, now()->addMinutes(10));

        // Send OTP via email
        try {
            // Use MailService static helper to send an HTML email
            MailService::sendHtmlEmail(
                $email,
                'Login OTP - ZoomConnect',
                "Your OTP for login is: <strong>{$otp}</strong>. Valid for 10 minutes.",
                ['from_name' => $employee->first_name ?? 'User']
            );

            return ApiResponse::success(['email' => $email], 'OTP sent to your email successfully', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to send OTP. Please try again.', $e->getMessage(), 500);
        }
    }


    /**
     * Login with Phone - Send OTP via SMS
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function loginWithPhone(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|digits:10'
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation error', $validator->errors(), 422);
        }

        $mobile = $request->mobile;

        // Check if user exists in CompanyEmployee table
        $employee = CompanyEmployee::where('mobile', $mobile)
            ->where('is_active', 1)
            ->first();

        if (!$employee) {
            return ApiResponse::error('User not found or inactive', null, 404);
        }

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Store OTP in cache for 10 minutes
        Cache::put('otp_mobile_' . $mobile, $otp, now()->addMinutes(10));

        // Send OTP via SMS
        try {
            // TODO: Integrate SMS gateway service (Twilio, MSG91, etc.)
            // For now, we'll just log it
            \Log::info("OTP for mobile {$mobile}: {$otp}");

            // Example SMS integration (uncomment and configure when ready)
            // $this->sendSMS($mobile, "Your OTP for login is: {$otp}. Valid for 10 minutes.");

            return ApiResponse::success(['mobile' => $mobile, 'otp' => $otp], 'OTP sent to your mobile successfully', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to send OTP. Please try again.', $e->getMessage(), 500);
        }
    }

    /**
     * Verify OTP and return JWT token
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'login_type' => 'required|in:email,mobile',
            'login_value' => 'required',
            'otp' => 'required|digits:6'
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation error', $validator->errors(), 422);
        }

        $loginType = $request->login_type;
        $loginValue = $request->login_value;
        $otp = $request->otp;

        // Get OTP from cache
        $cacheKey = $loginType === 'email' ? 'otp_email_' . $loginValue : 'otp_mobile_' . $loginValue;
        $cachedOtp = Cache::get($cacheKey);

        if (!$cachedOtp) {
            return ApiResponse::error('OTP expired or not found. Please request a new OTP.', null, 400);
        }

        if ($cachedOtp != $otp) {
            return ApiResponse::error('Invalid OTP. Please try again.', null, 400);
        }

        // Get employee details
        $employee = null;
        if ($loginType === 'email') {
            $employee = CompanyEmployee::where('email', $loginValue)->where('is_active', 1)->first();
        } else {
            $employee = CompanyEmployee::where('mobile_no', $loginValue)->where('is_active', 1)->first();
        }

        if (!$employee) {
            return ApiResponse::error('User not found', null, 404);
        }

        // Clear OTP from cache
        Cache::forget($cacheKey);

        // Generate JWT token
        $token = $this->generateJwtToken($employee);

        return ApiResponse::success([
            'token' => $token,
            'user' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'email' => $employee->email,
                'mobile_no' => $employee->mobile,
                'company_id' => $employee->company_id,
                'location_id' => $employee->location_id
            ]
        ], 'Login successful', 200);
    }

    /**
     * Generate JWT token for authenticated user
     * 
     * @param CompanyEmployee $employee
     * @return string
     */
    private function generateJwtToken($employee)
    {
        $payload = [
            'iss' => config('app.url'), // Issuer
            'sub' => $employee->id, // Subject (user ID)
            'iat' => time(), // Issued at
            'exp' => time() + (60 * 60 * 24 * 30), // Expiration time (30 days)
            'data' => [
                'employee_id' => $employee->employee_id,
                'email' => $employee->email,
                'mobile' => $employee->mobile_no,
                'company_id' => $employee->company_id
            ]
        ];

        $secret = config('app.key');

        return JWT::encode($payload, $secret, 'HS256');
    }

    /**
     * Verify JWT token
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token not provided'
            ], 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            return ApiResponse::success($decoded, 'Token is valid', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Invalid or expired token', $e->getMessage(), 401);
        }
    }

    /**
     * Get user profile
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            return ApiResponse::success([
                'user' => $employee
            ], 'Profile fetched', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Invalid or expired token', $e->getMessage(), 401);
        }
    }

    /**
     * Logout - Invalidate token (optional, as JWT is stateless)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Since JWT is stateless, we can't truly "invalidate" a token
        // You could implement a token blacklist if needed

        return ApiResponse::success(null, 'Logged out successfully. Please remove token from client.', 200);
    }

    /**
     * Get wellness services for authenticated user
     * Returns services that are active and either:
     * - Available for all companies (company_id = 0)
     * - Specifically for the user's company
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWellnessServices(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            // Get wellness services that are active and either for all companies or for this company
            $wellnessServices = WellnessService::where('status', 1)
                ->where(function($query) use ($employee) {
                    $query->where('company_id', 0)
                          ->orWhere('company_id', $employee->company_id);
                })
                ->with(['vendor', 'category'])
                ->get();

            return ApiResponse::success([
                'services' => $wellnessServices
            ], 'Wellness services fetched successfully', 200);
        } catch (\Exception $e) {
            return ApiResponse::error('Invalid or expired token', $e->getMessage(), 401);
        }
    }

    /**
     * Get all policies for authenticated employee
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEmployeePolicies(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            // Get active employee policies
            $policies = $this->getActiveEmployeePolicies($employee->id);
            
            // Process each policy with sum insured data and URLs
            $processedPolicies = [];
            
            foreach ($policies as $policy) {
                // Get sum insured data
                $sumInsuredQuery = "SELECT 
                    SUM({$policy->tpa_table_name}.base_sum_insured) AS total_base_sum_insured, 
                    SUM({$policy->tpa_table_name}.topup_sum_insured) AS total_topup_sum_insured, 
                    SUM({$policy->tpa_table_name}.parent_sum_insured) AS total_parent_sum_insured, 
                    SUM({$policy->tpa_table_name}.parent_in_law_sum_insured) AS parent_in_law_sum_insured,
                    SUM({$policy->tpa_table_name}.base_premium_on_company + {$policy->tpa_table_name}.base_premium_on_employee + 
                        {$policy->tpa_table_name}.topup_premium_on_company + {$policy->tpa_table_name}.topup_premium_on_employee + 
                        {$policy->tpa_table_name}.parent_premium_on_company + {$policy->tpa_table_name}.parent_premium_on_employee + 
                        {$policy->tpa_table_name}.parent_in_law_premium_on_company + {$policy->tpa_table_name}.parent_in_law_premium_on_employee) AS total_premium_amt,
                    SUM({$policy->tpa_table_name}.pro_rata_base_premium_on_company + {$policy->tpa_table_name}.pro_rata_base_premium_on_employee + 
                        {$policy->tpa_table_name}.pro_rata_topup_premium_on_company + {$policy->tpa_table_name}.pro_rata_topup_premium_on_employee + 
                        {$policy->tpa_table_name}.pro_rata_parent_premium_on_company + {$policy->tpa_table_name}.pro_rata_parent_premium_on_employee + 
                        {$policy->tpa_table_name}.pro_rata_parent_in_law_premium_on_company + {$policy->tpa_table_name}.pro_rata_parent_in_law_premium_on_employee) AS total_pro_rate_premium_amt
                    FROM {$policy->tpa_table_name} 
                    WHERE emp_id = {$employee->id} 
                    AND addition_endorsement_id != 0 
                    AND policy_id = {$policy->id}";
                
                $sumInsuredData = DB::select($sumInsuredQuery)[0] ?? null;
                
                if ($sumInsuredData) {
                    $policy->cover_string = $sumInsuredData;
                    $policy->total_cover = ($sumInsuredData->total_base_sum_insured ?? 0) + 
                                          ($sumInsuredData->total_topup_sum_insured ?? 0) + 
                                          ($sumInsuredData->total_parent_sum_insured ?? 0) + 
                                          ($sumInsuredData->parent_in_law_sum_insured ?? 0);
                }
                
                // Add URLs
                $baseUrl = config('app.url');
                $policy->download_e_card_url = $baseUrl . '/app/download-e-card/' . $policy->id;
                $policy->network_hospitals_url = $baseUrl . '/app/network-hospitals/' . $policy->id;
                $policy->pre_network_hospitals = "https://www.paramounttpa.com/Home/ProviderNetwork.aspx";
                $policy->single_policy_detail = $baseUrl . '/app/policy-detail/' . $policy->id;
                $policy->single_policy_detail_gpa = $baseUrl . '/app/policy-detail-gpa/' . $policy->id;
                $policy->single_policy_detail_gtl = $baseUrl . '/app/policy-detail-gtl/' . $policy->id;
                $policy->claim_intimation = $baseUrl . '/app/file-claim/' . $policy->id;
                
                $processedPolicies[] = $policy;
            }

            // Get enrollment data
            $enrollmentAssigned = [];
            $newEnrollmentAssigned = [];
            $newEnrollmentSubmitted = [];
            
            try {
                $enrollmentAssigned = DB::select("
                    SELECT policy_enrollment_mapping_master.*, policy_master.policy_config 
                    FROM policy_enrollment_mapping_master 
                    INNER JOIN policy_master ON policy_master.id = policy_enrollment_mapping_master.policy_id 
                    WHERE policy_enrollment_mapping_master.emp_id = {$employee->id}
                    AND policy_enrollment_mapping_master.policy_issued = 0 
                    AND policy_enrollment_mapping_master.submit_status = 0 
                    AND policy_master.policy_end_date >= CURDATE() 
                    AND policy_master.is_active = 1
                ");
            } catch (\Exception $e) {
                \Log::error('Error fetching enrollment assigned: ' . $e->getMessage());
            }

            try {
                $newEnrollmentAssigned = DB::select("
                    SELECT emm.*, ep.portal_start_date, ep.portal_end_date, ed.enrolment_name, ed.rator_type 
                    FROM enrolment_mapping_master emm 
                    INNER JOIN enrolment_period ep ON ep.id = emm.enrolment_period_id 
                    INNER JOIN enrolment_details ed ON ed.id = emm.enrolment_id 
                    WHERE ep.portal_start_date <= CONVERT_TZ(NOW(), '+00:00', '+05:30') 
                    AND ep.portal_end_date > CONVERT_TZ(NOW(), '+00:00', '+05:30') 
                    AND ep.is_active = 1 
                    AND emm.status = 1 
                    AND emm.submit_status = 0 
                    AND emm.emp_id = {$employee->id}
                    AND ((ed.id = 94 AND NOT EXISTS (
                        SELECT 1 FROM zoom_enrolment_data zed 
                        WHERE zed.emp_id = emm.emp_id 
                        AND zed.enrolment_portal_id = emm.enrolment_period_id
                    )) OR (ed.id <> 94 AND NOT EXISTS (
                        SELECT 1 FROM enrolment_data ed1 
                        WHERE ed1.emp_id = emm.emp_id 
                        AND ed1.enrolment_portal_id = emm.enrolment_period_id
                    )))
                    ORDER BY ep.portal_end_date DESC
                ");
            } catch (\Exception $e) {
                \Log::error('Error fetching new enrollment assigned: ' . $e->getMessage());
            }

            try {
                $newEnrollmentSubmitted = DB::select("
                    SELECT emm.*, ep.portal_start_date, ep.portal_end_date, ed.enrolment_name, ed.rator_type 
                    FROM enrolment_mapping_master emm 
                    INNER JOIN enrolment_period ep ON ep.id = emm.enrolment_period_id 
                    INNER JOIN enrolment_details ed ON ed.id = emm.enrolment_id 
                    WHERE ep.portal_start_date <= CONVERT_TZ(NOW(), '+00:00', '+05:30') 
                    AND ep.portal_end_date > DATE_SUB(NOW(), INTERVAL 50 DAY)
                    AND ep.is_active = 1 
                    AND emm.status = 1 
                    AND emm.submit_status = 1 
                    AND emm.emp_id = {$employee->id}
                    AND ((ed.id = 94 AND EXISTS (
                        SELECT 1 FROM zoom_enrolment_data zed 
                        WHERE zed.emp_id = emm.emp_id 
                        AND zed.enrolment_portal_id = emm.enrolment_period_id
                    )) OR (ed.id <> 94 AND EXISTS (
                        SELECT 1 FROM enrolment_data ed1 
                        WHERE ed1.emp_id = emm.emp_id 
                        AND ed1.enrolment_portal_id = emm.enrolment_period_id
                    )))
                    ORDER BY ep.portal_end_date DESC
                ");
            } catch (\Exception $e) {
                \Log::error('Error fetching new enrollment submitted: ' . $e->getMessage());
            }

            $enrolment = [
                'new_enrolment_assigned' => $newEnrollmentAssigned,
                'new_enrolment_submitted' => $newEnrollmentSubmitted,
                'enrollment_assigned' => $enrollmentAssigned
            ];

            return ApiResponse::success([
                'policy_details' => $processedPolicies,
                'enrolment' => $enrolment
            ], 'Policy details sent successfully', 200);

        } catch (\Exception $e) {
            return ApiResponse::error('Error fetching policies', $e->getMessage(), 500);
        }
    }

    /**
     * Get active employee policies
     * 
     * @param int $employeeId
     * @return array
     */
    private function getActiveEmployeePolicies($employeeId)
    {
        // Initialize empty array
        $policiesData = [];
        
        try {
            // Get distinct TPA table names
            $tpaTables = DB::select("
                SELECT DISTINCT tpa_master.tpa_table_name 
                FROM policy_mapping_master 
                INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id 
                INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id 
                INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id 
                INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id 
                WHERE policy_mapping_master.status = 1 
                AND policy_endorsements.status = 1 
                AND policy_master.is_old = 0 
                AND policy_master.policy_end_date >= CURRENT_TIMESTAMP 
                AND policy_mapping_master.emp_id = {$employeeId}
            ");

            // If no TPA tables found, return empty array
            if (empty($tpaTables)) {
                return $policiesData;
            }

            foreach ($tpaTables as $tpaTable) {
                $policies = DB::select("
                    SELECT DISTINCT 
                        policy_master.*, 
                        policy_mapping_master.emp_id, 
                        policy_mapping_master.id AS mapping_id, 
                        policy_mapping_master.addition_endorsement_id, 
                        insurance_master.insurance_company_name, 
                        insurance_master.insurance_comp_icon_url, 
                        tpa_master.tpa_company_name, 
                        tpa_master.tpa_table_name 
                    FROM policy_mapping_master 
                    INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id 
                    INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id 
                    INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id 
                    INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id 
                    JOIN {$tpaTable->tpa_table_name} ON {$tpaTable->tpa_table_name}.mapping_id = policy_mapping_master.id 
                    WHERE policy_mapping_master.status = 1 
                    AND policy_endorsements.status = 1 
                    AND policy_master.is_old = 0 
                    AND policy_master.policy_end_date >= CURRENT_TIMESTAMP 
                    AND policy_mapping_master.emp_id = {$employeeId}
                    AND {$tpaTable->tpa_table_name}.addition_endorsement_id IS NOT NULL 
                    AND {$tpaTable->tpa_table_name}.deletion_endorsement_id IS NULL 
                    AND {$tpaTable->tpa_table_name}.updation_endorsement_id IS NULL 
                    AND {$tpaTable->tpa_table_name}.addition_endorsement_id != 0
                ");

                if (!empty($policies)) {
                    $policiesData = array_merge($policiesData, $policies);
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error fetching active policies: ' . $e->getMessage());
            return [];
        }

        return $policiesData;
    }

    /**
     * Send SMS helper function
     * 
     * @param string $mobile
     * @param string $message
     * @return bool
     */
    private function sendSMS($mobile, $message)
    {
        // TODO: Integrate with SMS gateway
        // Example for MSG91 or Twilio

        /*
        // Example MSG91
        $authKey = config('services.msg91.auth_key');
        $senderId = config('services.msg91.sender_id');
        $route = '4';
        
        $url = "https://api.msg91.com/api/sendhttp.php";
        $postData = [
            'authkey' => $authKey,
            'mobiles' => $mobile,
            'message' => $message,
            'sender' => $senderId,
            'route' => $route
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return true;
        */

        return true;
    }
}
