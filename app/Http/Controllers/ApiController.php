<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\CompanyEmployee;
use App\Models\CompanyUser;
use App\Models\WellnessService;
use App\Models\HelpSupportChat;
use App\Models\HelpSupportStatusTracker;
use App\Mail\SupportTicketMail;
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

    // ============================================
    // Help / Support Chat Methods
    // ============================================

    /**
     * Predefined chatbot flow configuration - Multi-layered help system
     * Similar to Swiggy-style help with nested options and sub-menus
     */
    private function getChatbotFlow(): array
    {
        return [
            // ==================== LEVEL 1: Main Menu ====================
            'start' => [
                'message' => '👋 Hello! I\'m here to help you with your insurance needs. What would you like assistance with today?',
                'options' => [
                    ['id' => 'policy_details', 'label' => '📋 My Policy Details', 'next' => 'policy_menu'],
                    ['id' => 'claims', 'label' => '💰 Claims & Reimbursement', 'next' => 'claims_menu'],
                    ['id' => 'ecard', 'label' => '🎴 E-Card Services', 'next' => 'ecard_menu'],
                    ['id' => 'network', 'label' => '🏥 Network Hospitals', 'next' => 'network_menu'],
                    ['id' => 'wellness', 'label' => '💪 Wellness Services', 'next' => 'wellness_menu'],
                    ['id' => 'enrollment', 'label' => '📝 Enrollment & Registration', 'next' => 'enrollment_menu'],
                ],
            ],

            // ==================== LEVEL 2: Policy Details Menu ====================
            'policy_menu' => [
                'message' => 'What information do you need about your policy?',
                'options' => [
                    ['id' => 'coverage', 'label' => 'Coverage Details', 'next' => 'coverage_submenu'],
                    ['id' => 'members', 'label' => 'Family Members & Dependants', 'next' => 'members_submenu'],
                    ['id' => 'policy_docs', 'label' => 'Policy Documents', 'next' => 'policy_docs_submenu'],
                    ['id' => 'policy_dates', 'label' => 'Policy Period & Renewal', 'next' => 'policy_dates_submenu'],
                    ['id' => 'premium', 'label' => 'Premium & Payment', 'next' => 'premium_submenu'],
                ],
            ],

            // ==================== LEVEL 3: Coverage Sub-menu ====================
            'coverage_submenu' => [
                'message' => 'Which coverage information would you like to know?',
                'options' => [
                    ['id' => 'basic_coverage', 'label' => 'Basic Coverage', 'next' => 'basic_coverage_info'],
                    ['id' => 'room_rent', 'label' => 'Room Rent Limits', 'next' => 'room_rent_info'],
                    ['id' => 'pre_post_hosp', 'label' => 'Pre & Post Hospitalization', 'next' => 'pre_post_hosp_info'],
                    ['id' => 'daycare', 'label' => 'Daycare Procedures', 'next' => 'daycare_info'],
                    ['id' => 'maternity', 'label' => 'Maternity Coverage', 'next' => 'maternity_submenu'],
                    ['id' => 'exclusions', 'label' => 'What\'s NOT Covered', 'next' => 'exclusions_info'],
                ],
            ],

            // ==================== LEVEL 4: Maternity Sub-menu ====================
            'maternity_submenu' => [
                'message' => 'What would you like to know about maternity coverage?',
                'options' => [
                    ['id' => 'normal_delivery', 'label' => 'Normal Delivery Coverage', 'next' => 'normal_delivery_info'],
                    ['id' => 'c_section', 'label' => 'C-Section Coverage', 'next' => 'c_section_info'],
                    ['id' => 'waiting_period', 'label' => 'Waiting Period', 'next' => 'maternity_waiting_info'],
                    ['id' => 'newborn_coverage', 'label' => 'Newborn Baby Coverage', 'next' => 'newborn_info'],
                ],
            ],

            // ==================== LEVEL 3: Members Sub-menu ====================
            'members_submenu' => [
                'message' => 'What would you like to do with family members?',
                'options' => [
                    ['id' => 'view_members', 'label' => 'View All Members', 'next' => 'view_members_info'],
                    ['id' => 'add_dependant', 'label' => 'Add Dependant', 'next' => 'add_dependant_submenu'],
                    ['id' => 'remove_dependant', 'label' => 'Remove Dependant', 'next' => 'remove_dependant_info'],
                    ['id' => 'update_member', 'label' => 'Update Member Details', 'next' => 'update_member_info'],
                ],
            ],

            // ==================== LEVEL 4: Add Dependant Sub-menu ====================
            'add_dependant_submenu' => [
                'message' => 'Who would you like to add to your policy?',
                'options' => [
                    ['id' => 'add_spouse', 'label' => 'Add Spouse', 'next' => 'add_spouse_info'],
                    ['id' => 'add_child', 'label' => 'Add Child', 'next' => 'add_child_info'],
                    ['id' => 'add_parent', 'label' => 'Add Parent', 'next' => 'add_parent_info'],
                    ['id' => 'add_parent_in_law', 'label' => 'Add Parent-in-law', 'next' => 'add_parent_in_law_info'],
                ],
            ],

            // ==================== LEVEL 3: Policy Documents Sub-menu ====================
            'policy_docs_submenu' => [
                'message' => 'Which document do you need?',
                'options' => [
                    ['id' => 'policy_copy', 'label' => 'Download Policy Copy', 'next' => 'policy_copy_info'],
                    ['id' => 'policy_schedule', 'label' => 'Policy Schedule', 'next' => 'policy_schedule_info'],
                    ['id' => 'endorsement', 'label' => 'Endorsement Letter', 'next' => 'endorsement_info'],
                    ['id' => 'policy_certificate', 'label' => 'Policy Certificate', 'next' => 'policy_certificate_info'],
                ],
            ],

            // ==================== LEVEL 3: Policy Dates Sub-menu ====================
            'policy_dates_submenu' => [
                'message' => 'What date information do you need?',
                'options' => [
                    ['id' => 'start_date', 'label' => 'Policy Start Date', 'next' => 'start_date_info'],
                    ['id' => 'end_date', 'label' => 'Policy Expiry Date', 'next' => 'end_date_info'],
                    ['id' => 'renewal_date', 'label' => 'Renewal Date', 'next' => 'renewal_date_info'],
                    ['id' => 'cooling_period', 'label' => 'Cooling Off Period', 'next' => 'cooling_period_info'],
                ],
            ],

            // ==================== LEVEL 3: Premium Sub-menu ====================
            'premium_submenu' => [
                'message' => 'What would you like to know about premium?',
                'options' => [
                    ['id' => 'view_premium', 'label' => 'View Premium Amount', 'next' => 'view_premium_info'],
                    ['id' => 'payment_history', 'label' => 'Payment History', 'next' => 'payment_history_info'],
                    ['id' => 'payment_methods', 'label' => 'Payment Methods', 'next' => 'payment_methods_info'],
                    ['id' => 'premium_breakdown', 'label' => 'Premium Breakdown', 'next' => 'premium_breakdown_info'],
                ],
            ],

            // ==================== LEVEL 2: Claims Menu ====================
            'claims_menu' => [
                'message' => 'How can I help you with claims?',
                'options' => [
                    ['id' => 'file_claim', 'label' => 'File a New Claim', 'next' => 'file_claim_submenu'],
                    ['id' => 'track_claim', 'label' => 'Track Claim Status', 'next' => 'track_claim_submenu'],
                    ['id' => 'claim_rejected', 'label' => 'Claim Rejected/Queries', 'next' => 'claim_rejected_submenu'],
                    ['id' => 'claim_settlement', 'label' => 'Claim Settlement', 'next' => 'claim_settlement_submenu'],
                    ['id' => 'reimbursement', 'label' => 'Reimbursement Process', 'next' => 'reimbursement_submenu'],
                ],
            ],

            // ==================== LEVEL 3: File Claim Sub-menu ====================
            'file_claim_submenu' => [
                'message' => 'What type of claim would you like to file?',
                'options' => [
                    ['id' => 'cashless_claim', 'label' => 'Cashless Hospitalization', 'next' => 'cashless_claim_info'],
                    ['id' => 'reimbursement_claim', 'label' => 'Reimbursement Claim', 'next' => 'reimbursement_claim_info'],
                    ['id' => 'daycare_claim', 'label' => 'Daycare Claim', 'next' => 'daycare_claim_info'],
                    ['id' => 'maternity_claim', 'label' => 'Maternity Claim', 'next' => 'maternity_claim_info'],
                ],
            ],

            // ==================== LEVEL 3: Track Claim Sub-menu ====================
            'track_claim_submenu' => [
                'message' => 'How would you like to track your claim?',
                'options' => [
                    ['id' => 'by_claim_number', 'label' => 'By Claim Number', 'next' => 'track_by_number_info'],
                    ['id' => 'recent_claims', 'label' => 'View Recent Claims', 'next' => 'recent_claims_info'],
                    ['id' => 'pending_claims', 'label' => 'Pending Claims', 'next' => 'pending_claims_info'],
                    ['id' => 'settled_claims', 'label' => 'Settled Claims', 'next' => 'settled_claims_info'],
                ],
            ],

            // ==================== LEVEL 3: Claim Rejected Sub-menu ====================
            'claim_rejected_submenu' => [
                'message' => 'Why was your claim rejected?',
                'options' => [
                    ['id' => 'missing_docs', 'label' => 'Missing Documents', 'next' => 'missing_docs_info'],
                    ['id' => 'pre_existing', 'label' => 'Pre-existing Disease', 'next' => 'pre_existing_info'],
                    ['id' => 'waiting_period_issue', 'label' => 'Waiting Period Not Complete', 'next' => 'waiting_period_issue_info'],
                    ['id' => 'non_covered', 'label' => 'Treatment Not Covered', 'next' => 'non_covered_info'],
                    ['id' => 'appeal_process', 'label' => 'How to Appeal', 'next' => 'appeal_process_info'],
                ],
            ],

            // ==================== LEVEL 3: Claim Settlement Sub-menu ====================
            'claim_settlement_submenu' => [
                'message' => 'What would you like to know about claim settlement?',
                'options' => [
                    ['id' => 'settlement_time', 'label' => 'Settlement Timeline', 'next' => 'settlement_time_info'],
                    ['id' => 'settlement_amount', 'label' => 'Settlement Amount Details', 'next' => 'settlement_amount_info'],
                    ['id' => 'payment_mode', 'label' => 'Payment Mode', 'next' => 'payment_mode_info'],
                    ['id' => 'deductions', 'label' => 'Why Deductions?', 'next' => 'deductions_info'],
                ],
            ],

            // ==================== LEVEL 3: Reimbursement Sub-menu ====================
            'reimbursement_submenu' => [
                'message' => 'What do you need help with for reimbursement?',
                'options' => [
                    ['id' => 'documents_needed', 'label' => 'Documents Required', 'next' => 'documents_needed_info'],
                    ['id' => 'submission_deadline', 'label' => 'Submission Deadline', 'next' => 'submission_deadline_info'],
                    ['id' => 'how_to_submit', 'label' => 'How to Submit', 'next' => 'how_to_submit_info'],
                    ['id' => 'reimbursement_status', 'label' => 'Check Reimbursement Status', 'next' => 'reimbursement_status_info'],
                ],
            ],

            // ==================== LEVEL 2: E-Card Menu ====================
            'ecard_menu' => [
                'message' => 'What would you like to do with your E-Card?',
                'options' => [
                    ['id' => 'download_ecard', 'label' => 'Download E-Card', 'next' => 'download_ecard_info'],
                    ['id' => 'share_ecard', 'label' => 'Share E-Card', 'next' => 'share_ecard_info'],
                    ['id' => 'family_ecards', 'label' => 'Family E-Cards', 'next' => 'family_ecards_info'],
                    ['id' => 'ecard_not_working', 'label' => 'E-Card Issues', 'next' => 'ecard_issues_submenu'],
                ],
            ],

            // ==================== LEVEL 3: E-Card Issues Sub-menu ====================
            'ecard_issues_submenu' => [
                'message' => 'What issue are you facing with E-Card?',
                'options' => [
                    ['id' => 'cant_download', 'label' => 'Can\'t Download', 'next' => 'cant_download_info'],
                    ['id' => 'wrong_details', 'label' => 'Wrong Details on E-Card', 'next' => 'wrong_details_info'],
                    ['id' => 'ecard_expired', 'label' => 'E-Card Expired', 'next' => 'ecard_expired_info'],
                    ['id' => 'hospital_rejected', 'label' => 'Hospital Rejected E-Card', 'next' => 'hospital_rejected_info'],
                ],
            ],

            // ==================== LEVEL 2: Network Hospitals Menu ====================
            'network_menu' => [
                'message' => 'How can I help you find network hospitals?',
                'options' => [
                    ['id' => 'search_hospital', 'label' => 'Search Hospital', 'next' => 'search_hospital_submenu'],
                    ['id' => 'nearby_hospitals', 'label' => 'Nearby Hospitals', 'next' => 'nearby_hospitals_info'],
                    ['id' => 'hospital_facilities', 'label' => 'Hospital Facilities', 'next' => 'hospital_facilities_info'],
                    ['id' => 'cashless_process', 'label' => 'Cashless Process at Hospital', 'next' => 'cashless_process_info'],
                ],
            ],

            // ==================== LEVEL 3: Search Hospital Sub-menu ====================
            'search_hospital_submenu' => [
                'message' => 'How would you like to search for hospitals?',
                'options' => [
                    ['id' => 'by_city', 'label' => 'Search by City', 'next' => 'by_city_info'],
                    ['id' => 'by_specialty', 'label' => 'Search by Specialty', 'next' => 'by_specialty_info'],
                    ['id' => 'by_name', 'label' => 'Search by Hospital Name', 'next' => 'by_name_info'],
                    ['id' => 'top_hospitals', 'label' => 'Top Rated Hospitals', 'next' => 'top_hospitals_info'],
                ],
            ],

            // ==================== LEVEL 2: Wellness Menu ====================
            'wellness_menu' => [
                'message' => 'What wellness service are you interested in?',
                'options' => [
                    ['id' => 'health_checkup', 'label' => 'Health Checkup', 'next' => 'health_checkup_submenu'],
                    ['id' => 'fitness', 'label' => 'Fitness Programs', 'next' => 'fitness_info'],
                    ['id' => 'mental_health', 'label' => 'Mental Health Support', 'next' => 'mental_health_info'],
                    ['id' => 'nutrition', 'label' => 'Nutrition Counseling', 'next' => 'nutrition_info'],
                    ['id' => 'yoga', 'label' => 'Yoga & Meditation', 'next' => 'yoga_info'],
                ],
            ],

            // ==================== LEVEL 3: Health Checkup Sub-menu ====================
            'health_checkup_submenu' => [
                'message' => 'What type of health checkup are you looking for?',
                'options' => [
                    ['id' => 'basic_checkup', 'label' => 'Basic Health Checkup', 'next' => 'basic_checkup_info'],
                    ['id' => 'comprehensive', 'label' => 'Comprehensive Checkup', 'next' => 'comprehensive_info'],
                    ['id' => 'cardiac', 'label' => 'Cardiac Checkup', 'next' => 'cardiac_info'],
                    ['id' => 'diabetes', 'label' => 'Diabetes Screening', 'next' => 'diabetes_info'],
                    ['id' => 'women_health', 'label' => 'Women\'s Health Checkup', 'next' => 'women_health_info'],
                ],
            ],

            // ==================== LEVEL 2: Enrollment Menu ====================
            'enrollment_menu' => [
                'message' => 'What do you need help with regarding enrollment?',
                'options' => [
                    ['id' => 'new_enrollment', 'label' => 'New Enrollment', 'next' => 'new_enrollment_info'],
                    ['id' => 'enrollment_status', 'label' => 'Check Enrollment Status', 'next' => 'enrollment_status_info'],
                    ['id' => 'modify_enrollment', 'label' => 'Modify Enrollment', 'next' => 'modify_enrollment_info'],
                    ['id' => 'enrollment_deadline', 'label' => 'Enrollment Deadline', 'next' => 'enrollment_deadline_info'],
                ],
            ],

            // ==================== TERMINAL NODES (Final Answers) ====================
            
            // Policy Details - Coverage
            'basic_coverage_info' => [
                'message' => '✅ Your policy covers:\n• Hospitalization expenses up to ₹5 Lakhs\n• Room rent (as per policy terms)\n• ICU charges\n• Doctor fees\n• Surgical procedures\n• Medical tests & diagnostics\n\n📞 Need more details? Contact support.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'room_rent_info' => [
                'message' => '🛏️ Room Rent Coverage:\n• Single AC room: Covered\n• Actual room charges up to ₹5,000/day\n• ICU: Covered up to ₹10,000/day\n\n💡 If you choose a higher room category, proportionate deductions may apply.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pre_post_hosp_info' => [
                'message' => '📅 Pre & Post Hospitalization Coverage:\n• Pre-hospitalization: 30 days before admission\n• Post-hospitalization: 60 days after discharge\n• Includes consultations, medicines, and tests related to the hospitalization.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'daycare_info' => [
                'message' => '⏰ Daycare Procedures Covered:\n• Cataract surgery\n• Chemotherapy\n• Dialysis\n• Tonsillectomy\n• And 150+ other procedures\n\n✅ No hospitalization required for these treatments.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'normal_delivery_info' => [
                'message' => '👶 Normal Delivery Coverage:\n• Covered up to ₹50,000\n• Includes prenatal and postnatal care\n• Waiting period: 9 months from policy start date\n\n📝 Documents required: Hospital bills, discharge summary, birth certificate.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'c_section_info' => [
                'message' => '🏥 C-Section Coverage:\n• Covered up to ₹75,000\n• Includes surgery, anesthesia, and room charges\n• Waiting period: 9 months from policy start date\n\n📋 Pre-authorization required from TPA.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'maternity_waiting_info' => [
                'message' => '⏳ Maternity Waiting Period:\n• 9 months from policy start date\n• No claims will be entertained before completion of waiting period\n• Applicable for both normal and C-section deliveries\n\n💡 Plan your family accordingly!',
                'options' => [],
                'show_thank_you' => true,
            ],
            'newborn_info' => [
                'message' => '👶 Newborn Baby Coverage:\n• Covered from day 1 after birth\n• Vaccination expenses covered\n• Any congenital disorders covered up to ₹50,000\n\n📝 Add baby to policy within 30 days of birth.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'exclusions_info' => [
                'message' => '❌ What\'s NOT Covered:\n• Cosmetic surgery\n• Dental treatment (except accident)\n• Pre-existing diseases (waiting period applies)\n• Self-inflicted injuries\n• Drug/alcohol abuse\n• War & nuclear risks\n\n📄 Check policy document for complete list.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Members Management
            'view_members_info' => [
                'message' => '👨‍👩‍👧‍👦 To view all covered members:\n1. Go to "My Policy" section\n2. Click on "Family Members"\n3. You\'ll see all covered members with their details\n\n✅ You can also download member-wise E-Cards from there.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_spouse_info' => [
                'message' => '💑 To Add Spouse:\n1. Go to "Family Members" section\n2. Click "Add Member"\n3. Select "Spouse"\n4. Upload: Marriage certificate, Aadhaar, Photo\n5. Additional premium will be calculated\n\n⏰ Can be added during annual enrollment or within 30 days of marriage.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_child_info' => [
                'message' => '👶 To Add Child:\n1. Go to "Family Members" section\n2. Click "Add Member"\n3. Select "Child"\n4. Upload: Birth certificate, Aadhaar (if available)\n\n⏰ Must be added within 30 days of birth for immediate coverage.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_parent_info' => [
                'message' => '👴 To Add Parent:\n1. Only during annual enrollment\n2. Upload medical records\n3. May require pre-medical checkup\n4. Higher premium applicable\n\n⚠️ Pre-existing disease waiting period: 2-4 years.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'add_parent_in_law_info' => [
                'message' => '👵 To Add Parent-in-law:\n• Same process as adding parent\n• Requires proof of relationship\n• Medical checkup mandatory if age > 45 years\n• Premium depends on age and health condition\n\n📞 Contact HR for enrollment form.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'remove_dependant_info' => [
                'message' => '➖ To Remove Dependant:\n1. Contact your HR department\n2. Submit removal request form\n3. Reason required (e.g., child married, parent deceased)\n4. Premium will be adjusted from next policy period\n\n⚠️ Cannot be done mid-policy year except for specific cases.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'update_member_info' => [
                'message' => '✏️ To Update Member Details:\n1. Go to "My Policy" > "Family Members"\n2. Select member to update\n3. Update information (name, DOB, etc.)\n4. Upload supporting documents\n\n📝 Documents may be required for verification.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Policy Documents
            'policy_copy_info' => [
                'message' => '📄 Download Policy Copy:\n1. Go to "My Policy" section\n2. Click "Documents"\n3. Select "Policy Document"\n4. Download PDF\n\n💡 You can also email it to yourself directly from the app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'policy_schedule_info' => [
                'message' => '📋 Policy Schedule:\nAvailable in "My Policy" > "Documents" section.\n\nIt contains:\n• Sum insured details\n• Premium breakdown\n• Coverage dates\n• Member details\n\n📥 Download as PDF anytime.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'endorsement_info' => [
                'message' => '📜 Endorsement Letter:\n• Generated when you add/remove members\n• Available in "Documents" section\n• Shows changes made to policy\n\n⏰ Updated within 7 working days of approval.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'policy_certificate_info' => [
                'message' => '🎖️ Policy Certificate:\n• Proof of insurance coverage\n• Available in "Documents" section\n• Can be used for visa, loan applications\n\n📧 Can be emailed directly to required authority.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Policy Dates
            'start_date_info' => [
                'message' => '📅 Your policy start date is: April 1, 2025\n\n✅ Coverage is active from this date.\n\n💡 Check "My Policy" for exact details.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'end_date_info' => [
                'message' => '📅 Your policy expires on: March 31, 2026\n\n⚠️ Ensure renewal before this date to avoid coverage gap.\n\n📧 You\'ll receive renewal reminders 30 days in advance.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'renewal_date_info' => [
                'message' => '🔄 Policy Renewal:\n• Renewal date: March 31, 2026\n• Renewal window: 30 days before expiry\n• No break in coverage if renewed on time\n\n💡 Auto-renewal option available!',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cooling_period_info' => [
                'message' => '❄️ Cooling-off Period:\n• 15 days from policy issuance\n• You can cancel policy and get refund\n• Refund: Premium paid minus proportionate risk premium\n\n📝 Submit cancellation request through HR.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Premium
            'view_premium_info' => [
                'message' => '💰 Your Premium Details:\n• Total Premium: Available in "My Policy"\n• Company contribution: Check with HR\n• Employee contribution: Check payslip\n\n📊 View detailed breakup in policy schedule.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'payment_history_info' => [
                'message' => '📜 Payment History:\n1. Go to "My Policy" > "Payments"\n2. View all premium payments\n3. Download payment receipts\n\n💳 Shows mode of payment and dates.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'payment_methods_info' => [
                'message' => '💳 Payment Methods:\n• Salary deduction (default for corporate)\n• Net banking\n• Debit/Credit card\n• UPI\n• Cheque/DD\n\n✅ All methods are secure and encrypted.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'premium_breakdown_info' => [
                'message' => '📊 Premium Breakdown:\n• Base premium: For main member\n• Dependant premium: For each family member\n• GST: 18% on total premium\n• Loading charges: If applicable\n\n📄 Detailed breakdown in policy schedule.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Claims
            'cashless_claim_info' => [
                'message' => '🏥 Cashless Hospitalization:\n1. Show E-Card at network hospital\n2. Hospital sends pre-authorization to TPA\n3. TPA approves within 2-4 hours\n4. Get admitted without payment\n5. Settle only non-covered expenses\n\n✅ Valid at all network hospitals.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'reimbursement_claim_info' => [
                'message' => '💰 Reimbursement Claim:\n1. Get treated at any hospital\n2. Collect all bills and documents\n3. Submit claim within 30 days\n4. Upload documents via app or email\n5. Claim settled in 15-20 days\n\n📋 Documents: Bills, discharge summary, prescriptions.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'daycare_claim_info' => [
                'message' => '⏰ Daycare Claim:\n1. Inform TPA before procedure\n2. Get pre-authorization (if cashless)\n3. OR pay and submit documents for reimbursement\n4. Submit: Bills, doctor prescription, discharge card\n\n✅ No 24-hour hospitalization needed.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'maternity_claim_info' => [
                'message' => '👶 Maternity Claim:\n1. Inform TPA at time of admission\n2. Pre-authorization for C-section\n3. For normal delivery, submit bills post-discharge\n4. Include: Bills, birth certificate, discharge summary\n\n⏳ Waiting period: 9 months must be completed.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Track Claim
            'track_by_number_info' => [
                'message' => '🔍 Track by Claim Number:\n1. Go to "Claims" section\n2. Click "Track Claim"\n3. Enter claim/intimation number\n4. View real-time status\n\n📱 Push notifications enabled for updates.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'recent_claims_info' => [
                'message' => '📋 Recent Claims:\n• View last 6 months claims\n• Available in "Claims" section\n• Shows status and settlement details\n\n🔔 Get alerts on status changes.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pending_claims_info' => [
                'message' => '⏳ Pending Claims:\n• View all pending claims in "Claims" section\n• Check reason for pending\n• Upload additional documents if required\n\n📞 Contact TPA if pending > 30 days.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'settled_claims_info' => [
                'message' => '✅ Settled Claims:\n• View complete claim history\n• Download settlement letter\n• Check payment details\n\n📧 Settlement confirmation sent via email.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Claim Rejected
            'missing_docs_info' => [
                'message' => '📄 Missing Documents:\n• TPA will send query letter\n• Upload missing documents via app\n• Resubmit within 15 days\n\n⚠️ Claim may be closed if docs not submitted on time.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'pre_existing_info' => [
                'message' => '🏥 Pre-existing Disease:\n• Waiting period: 2-4 years (check policy)\n• Cannot claim during waiting period\n• Coverage starts after waiting period completion\n\n💡 Declare all diseases during enrollment.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'waiting_period_issue_info' => [
                'message' => '⏳ Waiting Period:\n• Initial waiting: 30 days\n• Specific diseases: 2 years\n• Pre-existing: 2-4 years\n• Maternity: 9 months\n\n📅 Check policy start date to calculate.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'non_covered_info' => [
                'message' => '❌ Treatment Not Covered:\nCommon exclusions:\n• Cosmetic procedures\n• Dental (except accident)\n• Alternative medicine\n• Self-inflicted injuries\n\n📄 Check exclusions list in policy document.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'appeal_process_info' => [
                'message' => '📢 Appeal Process:\n1. Get rejection letter from TPA\n2. Collect supporting documents\n3. Submit appeal within 30 days\n4. Write to grievance@tpa.com\n5. Escalate to insurance ombudsman if needed\n\n📞 Keep all communication documented.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Claim Settlement
            'settlement_time_info' => [
                'message' => '⏱️ Settlement Timeline:\n• Cashless: Real-time approval\n• Reimbursement: 15-20 days\n• Additional documents: +7 days\n• Complex cases: Up to 30 days\n\n📧 Updates sent via email/SMS.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'settlement_amount_info' => [
                'message' => '💰 Settlement Amount:\n= Eligible amount - Deductions - Copay\n\nDeductions may include:\n• Non-medical expenses\n• Room rent excess\n• Consumables\n\n📊 Detailed breakdown in settlement letter.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'payment_mode_info' => [
                'message' => '💳 Payment Mode:\n• Direct bank transfer (NEFT/RTGS)\n• Credited within 2-3 working days\n• SMS notification sent\n\n🏦 Ensure bank details are updated in profile.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'deductions_info' => [
                'message' => '➖ Why Deductions?\nCommon reasons:\n• Room rent limit exceeded\n• Non-medical items (tissues, diapers)\n• Consumables not covered\n• Items not related to treatment\n\n📋 Check policy for covered items.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Reimbursement
            'documents_needed_info' => [
                'message' => '📋 Documents Required:\n✅ Hospital bills (original)\n✅ Discharge summary\n✅ Payment receipts\n✅ Prescriptions\n✅ Investigation reports\n✅ Pharmacy bills\n✅ Claim form (duly filled)\n\n📸 Upload via app or email to tpa@company.com',
                'options' => [],
                'show_thank_you' => true,
            ],
            'submission_deadline_info' => [
                'message' => '⏰ Submission Deadline:\n• Within 30 days of discharge\n• Grace period: 15 days (with penalty)\n• Beyond 45 days: Claim may be rejected\n\n💡 Submit as early as possible for faster settlement.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'how_to_submit_info' => [
                'message' => '📤 How to Submit:\n1. App: Go to "Claims" > "Submit Documents"\n2. Email: tpa@company.com\n3. Courier: TPA office address\n4. In-person: Visit TPA office\n\n✅ Get acknowledgment receipt for tracking.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'reimbursement_status_info' => [
                'message' => '🔍 Check Reimbursement Status:\n1. Go to "Claims" section\n2. Enter claim number\n3. View current status\n\nStatus types:\n• Received\n• Under review\n• Query raised\n• Approved\n• Settled\n\n📱 Enable push notifications for updates.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // E-Card
            'download_ecard_info' => [
                'message' => '🎴 Download E-Card:\n1. Open app\n2. Go to "E-Card" section\n3. Click "Download"\n4. Save as PDF or image\n\n💡 Keep digital copy on phone for easy access.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'share_ecard_info' => [
                'message' => '📤 Share E-Card:\n1. Open E-Card\n2. Click "Share" button\n3. Choose platform (WhatsApp, Email, etc.)\n\n✅ Send to family members for their reference.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'family_ecards_info' => [
                'message' => '👨‍👩‍👧 Family E-Cards:\n1. Go to "E-Card" section\n2. Select family member from dropdown\n3. Download individual E-Cards\n\n📱 All family members have unique card numbers.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cant_download_info' => [
                'message' => '❌ Can\'t Download E-Card?\nTroubleshooting:\n1. Check internet connection\n2. Clear app cache\n3. Update app to latest version\n4. Try from desktop browser\n\n📞 Still facing issue? Contact support.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'wrong_details_info' => [
                'message' => '⚠️ Wrong Details on E-Card?\n1. Take screenshot\n2. Submit correction request via app\n3. Upload supporting documents\n4. Updated E-Card in 3-5 days\n\n📝 Common errors: Name spelling, DOB, sum insured.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'ecard_expired_info' => [
                'message' => '📅 E-Card Expired?\n• Policy expired or not renewed\n• Contact HR for renewal status\n• Renew policy to get updated E-Card\n\n⚠️ Cannot use expired E-Card for cashless.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'hospital_rejected_info' => [
                'message' => '🏥 Hospital Rejected E-Card?\nPossible reasons:\n• Hospital not in network\n• Policy expired\n• Wrong policy number shared\n• TPA system down\n\n📞 Call TPA helpline immediately for authorization.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Network Hospitals
            'by_city_info' => [
                'message' => '🏙️ Search by City:\n1. Go to "Network Hospitals"\n2. Select "Search by City"\n3. Choose your city\n4. View all network hospitals\n\n📍 Filter by distance, rating, or specialty.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'by_specialty_info' => [
                'message' => '🩺 Search by Specialty:\n1. Select specialty (Cardiology, Orthopedic, etc.)\n2. View hospitals with that department\n3. Check doctor availability\n\n💡 Call hospital to confirm before visiting.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'by_name_info' => [
                'message' => '🔍 Search by Hospital Name:\n1. Go to "Network Hospitals"\n2. Enter hospital name\n3. Check if it\'s in network\n4. View contact details and address\n\n✅ Save favorites for quick access.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'top_hospitals_info' => [
                'message' => '⭐ Top Rated Hospitals:\n• View by user ratings\n• See success rate and facilities\n• Read patient reviews\n\n🏆 Apollo, Fortis, Max, Manipal are top partners.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'nearby_hospitals_info' => [
                'message' => '📍 Nearby Hospitals:\n1. Enable location access\n2. App shows nearest network hospitals\n3. Get directions via Google Maps\n\n🚗 Shows distance and estimated travel time.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'hospital_facilities_info' => [
                'message' => '🏥 Hospital Facilities:\nCheck before visiting:\n• ICU availability\n• Specialist doctors\n• Emergency services\n• Diagnostic centers\n• Pharmacy\n\n📞 Call hospital for current availability.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cashless_process_info' => [
                'message' => '💳 Cashless Process at Hospital:\n1. Show E-Card at admission desk\n2. Fill pre-authorization form\n3. Hospital sends to TPA\n4. Approval in 2-4 hours\n5. Get admitted without advance\n\n📱 Track approval status on app.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Wellness
            'fitness_info' => [
                'message' => '💪 Fitness Programs:\n• Free gym membership\n• Yoga sessions\n• Zumba classes\n• Personal trainer access\n\n📍 Available at partner fitness centers. Check "Wellness" section for locations.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'mental_health_info' => [
                'message' => '🧠 Mental Health Support:\n• Free counseling sessions\n• Stress management workshops\n• 24/7 helpline\n• Confidential consultations\n\n📞 Call: 1800-XXX-XXXX (toll-free)',
                'options' => [],
                'show_thank_you' => true,
            ],
            'nutrition_info' => [
                'message' => '🥗 Nutrition Counseling:\n• Personalized diet plans\n• Weight management programs\n• Diabetes diet planning\n• Free consultation (2 sessions/year)\n\n📅 Book appointment via app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'yoga_info' => [
                'message' => '🧘 Yoga & Meditation:\n• Online classes daily\n• Live sessions on weekends\n• Recorded sessions available\n• Certified instructors\n\n📱 Access via "Wellness" section.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'basic_checkup_info' => [
                'message' => '🩺 Basic Health Checkup:\nIncludes:\n• Blood sugar\n• Blood pressure\n• Cholesterol\n• Complete blood count\n• Urine test\n\n💰 Free once a year. Book via app.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'comprehensive_info' => [
                'message' => '🏥 Comprehensive Checkup:\nIncludes basic tests plus:\n• ECG\n• Chest X-ray\n• Liver function\n• Kidney function\n• Thyroid test\n\n💰 Discounted rate for policyholders.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'cardiac_info' => [
                'message' => '❤️ Cardiac Checkup:\n• ECG\n• 2D Echo\n• TMT (Treadmill test)\n• Lipid profile\n• Consultation with cardiologist\n\n📅 Recommended for age 40+',
                'options' => [],
                'show_thank_you' => true,
            ],
            'diabetes_info' => [
                'message' => '🩸 Diabetes Screening:\n• Fasting blood sugar\n• PP blood sugar\n• HbA1c\n• Urine sugar\n• Consultation included\n\n💡 Free for diabetic patients.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'women_health_info' => [
                'message' => '👩 Women\'s Health Checkup:\n• Pap smear\n• Mammography\n• Hormonal tests\n• Thyroid profile\n• Bone density\n\n📅 Book at partner diagnostic centers.',
                'options' => [],
                'show_thank_you' => true,
            ],

            // Enrollment
            'new_enrollment_info' => [
                'message' => '📝 New Enrollment:\n1. Wait for enrollment window (usually annual)\n2. Receive notification from HR\n3. Login to enrollment portal\n4. Select coverage and add members\n5. Submit documents\n\n⏰ Enrollment window typically in March.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'enrollment_status_info' => [
                'message' => '🔍 Check Enrollment Status:\n1. Go to "Enrollment" section\n2. View current enrollment\n3. Check approval status\n4. Download enrollment summary\n\n📧 Confirmation email sent after approval.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'modify_enrollment_info' => [
                'message' => '✏️ Modify Enrollment:\n• Can be done during enrollment window only\n• Or within 30 days of life event (marriage, birth)\n• Contact HR for modification form\n\n⚠️ Changes effective from next policy period.',
                'options' => [],
                'show_thank_you' => true,
            ],
            'enrollment_deadline_info' => [
                'message' => '⏰ Enrollment Deadline:\n• Typically last week of March\n• Exact dates communicated by HR\n• No extensions after deadline\n\n📧 Watch for reminder emails!',
                'options' => [],
                'show_thank_you' => true,
            ],
        ];
    }

    /**
     * Start a new help chat session
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function startHelpChat(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId = $decoded->sub;

            $employee = CompanyEmployee::find($userId);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            // Generate unique ticket ID
            $ticketId = HelpSupportChat::generateTicketId();

            // Get chatbot flow
            $chatbotFlow = $this->getChatbotFlow();
            $initialState = $chatbotFlow['start'];

            // Save bot's initial message
            HelpSupportChat::create([
                'ticket_id' => $ticketId,
                'user_id' => $userId,
                'cmp_id' => $employee->company_id ?? null,
                'emp_id' => $employee->id ?? null,
                'sender_type' => 'bot',
                'message' => json_encode([
                    'text' => $initialState['message'],
                    'options' => $initialState['options'],
                ]),
                'state_key' => 'start',
                'is_resolved' => false,
                'status' => 'open',
            ]);

            // Track initial status
            HelpSupportStatusTracker::trackStatusChange(
                $ticketId,
                null,
                'open',
                $userId,
                'Chat session started'
            );

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'message' => $initialState['message'],
                'options' => $initialState['options'],
                'state_key' => 'start',
            ], 'Chat session started successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to start chat', $e->getMessage(), 500);
        }
    }

    /**
     * Continue chat conversation
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function continueHelpChat(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'ticket_id' => 'required|string|exists:help_support_chats,ticket_id',
                'state_key' => 'nullable|string',
                'selected_option_id' => 'nullable|string',
                'free_text_message' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', $validator->errors(), 422);
            }

            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId = $decoded->sub;

            $employee = CompanyEmployee::find($userId);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            $ticketId = $request->ticket_id;
            $stateKey = $request->state_key;
            $selectedOptionId = $request->selected_option_id;
            $freeTextMessage = $request->free_text_message;

            // Verify ticket belongs to user
            $existingChat = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->first();

            if (!$existingChat) {
                return ApiResponse::error('Invalid ticket or unauthorized access', null, 403);
            }

            $chatbotFlow = $this->getChatbotFlow();

            // Case 1: User is typing a free text message (unresolved query)
            if ($freeTextMessage) {
                return $this->handleFreeTextMessage($ticketId, $userId, $freeTextMessage, $existingChat, $employee);
            }

            // Case 2: User selected an option from chatbot
            if ($selectedOptionId && $stateKey) {
                return $this->handleChatbotOption($ticketId, $userId, $stateKey, $selectedOptionId, $chatbotFlow, $existingChat);
            }

            return ApiResponse::error('Please provide either selected_option_id or free_text_message', null, 400);

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to process chat', $e->getMessage(), 500);
        }
    }

    /**
     * Handle chatbot option selection
     * 
     * @param string $ticketId
     * @param int $userId
     * @param string $stateKey
     * @param string $selectedOptionId
     * @param array $chatbotFlow
     * @param HelpSupportChat $existingChat
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleChatbotOption($ticketId, $userId, $stateKey, $selectedOptionId, $chatbotFlow, $existingChat)
    {
        // Get current state from chatbot flow
        if (!isset($chatbotFlow[$stateKey])) {
            return ApiResponse::error('Invalid state key', null, 400);
        }

        $currentState = $chatbotFlow[$stateKey];
        
        // Find the selected option
        $selectedOption = collect($currentState['options'])->firstWhere('id', $selectedOptionId);

        if (!$selectedOption) {
            return ApiResponse::error('Invalid option selected', null, 400);
        }

        // Save user's selection
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'user',
            'message' => json_encode([
                'selected_option' => $selectedOption['label'],
                'option_id' => $selectedOptionId,
            ]),
            'state_key' => $stateKey,
            'is_resolved' => false,
            'status' => $existingChat->status,
        ]);

        // Get next state
        $nextStateKey = $selectedOption['next'];
        
        if (!isset($chatbotFlow[$nextStateKey])) {
            return ApiResponse::error('Invalid next state', null, 500);
        }

        $nextState = $chatbotFlow[$nextStateKey];

        // Save bot's response
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'bot',
            'message' => json_encode([
                'text' => $nextState['message'],
                'options' => $nextState['options'],
            ]),
            'state_key' => $nextStateKey,
            'is_resolved' => false,
            'status' => $existingChat->status,
        ]);

        // Check if this is a terminal node (no more options)
        $isTerminal = empty($nextState['options']);

        // Prepare response data
        $responseData = [
            'ticket_id' => $ticketId,
            'message' => $nextState['message'],
            'options' => $nextState['options'],
            'state_key' => $nextStateKey,
            'is_terminal' => $isTerminal,
            'show_write_to_support' => $isTerminal,
        ];

        // Add thank you message if this is a terminal node with show_thank_you flag
        if ($isTerminal && isset($nextState['show_thank_you']) && $nextState['show_thank_you']) {
            $thankYouMessage = "🙏 Thank you for using our help service! \n\n"
                . "✅ I hope this information was helpful.\n\n"
                . "💬 If you need further assistance or have any questions, feel free to:\n"
                . "• Type your query below to connect with our support team\n"
                . "• Start a new chat by clicking the help button\n\n"
                . "📞 For urgent matters, call our helpline: 1800-XXX-XXXX\n\n"
                . "Have a great day! 😊";
            
            $responseData['thank_you_message'] = $thankYouMessage;
            
            // Also save thank you message in chat history
            HelpSupportChat::create([
                'ticket_id' => $ticketId,
                'user_id' => $userId,
                'cmp_id' => $existingChat->cmp_id,
                'emp_id' => $existingChat->emp_id,
                'sender_type' => 'bot',
                'message' => $thankYouMessage,
                'state_key' => 'thank_you',
                'is_resolved' => false,
                'status' => $existingChat->status,
            ]);
        }

        return ApiResponse::success($responseData, 'Chat continued successfully');
    }

    /**
     * Handle free text message (unresolved query)
     * 
     * @param string $ticketId
     * @param int $userId
     * @param string $message
     * @param HelpSupportChat $existingChat
     * @param CompanyEmployee $employee
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleFreeTextMessage($ticketId, $userId, $message, $existingChat, $employee)
    {
        // Save user's free text message
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'user',
            'message' => $message,
            'state_key' => 'user_query',
            'is_resolved' => false,
            'status' => 'in_progress',
        ]);

        // Update ticket status to in_progress
        HelpSupportChat::where('ticket_id', $ticketId)
            ->update(['status' => 'in_progress']);

        // Track status change
        HelpSupportStatusTracker::trackStatusChange(
            $ticketId,
            $existingChat->status,
            'in_progress',
            $userId,
            'User submitted unresolved query'
        );

        // Send email to support team
        try {
            $companyName = $employee->company->cmp_name ?? 'N/A';
            $userName = trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? '')) ?: 'User';
            
            Mail::to(config('mail.support_email', 'support@zoomconnect.com'))
                ->send(new SupportTicketMail(
                    $ticketId,
                    $userName,
                    $employee->email ?? 'N/A',
                    $message,
                    $companyName,
                    $employee->employee_id ?? null
                ));
        } catch (\Exception $e) {
            \Log::error('Failed to send support ticket email: ' . $e->getMessage());
        }

        // Save bot acknowledgment
        $acknowledgmentMessage = "Thank you for reaching out! Your ticket ({$ticketId}) has been created and sent to our support team. They will respond to you shortly.";
        
        HelpSupportChat::create([
            'ticket_id' => $ticketId,
            'user_id' => $userId,
            'cmp_id' => $existingChat->cmp_id,
            'emp_id' => $existingChat->emp_id,
            'sender_type' => 'bot',
            'message' => json_encode([
                'text' => $acknowledgmentMessage,
                'options' => [],
            ]),
            'state_key' => 'ticket_created',
            'is_resolved' => false,
            'status' => 'in_progress',
        ]);

        return ApiResponse::success([
            'ticket_id' => $ticketId,
            'message' => $acknowledgmentMessage,
            'status' => 'in_progress',
            'email_sent' => true,
        ], 'Support ticket created successfully');
    }

    /**
     * Get chat history for a specific ticket
     * 
     * @param Request $request
     * @param string $ticketId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHelpChatHistory(Request $request, $ticketId)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId = $decoded->sub;

            // Verify ticket belongs to user
            $ticketExists = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->exists();

            if (!$ticketExists) {
                return ApiResponse::error('Invalid ticket or unauthorized access', null, 403);
            }

            // Get all chat messages for this ticket
            $chatHistory = HelpSupportChat::where('ticket_id', $ticketId)
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($chat) {
                    // Decode message if it's JSON
                    $message = $chat->message;
                    if ($this->isJson($message)) {
                        $message = json_decode($message, true);
                    }

                    return [
                        'id' => $chat->id,
                        'sender_type' => $chat->sender_type,
                        'message' => $message,
                        'state_key' => $chat->state_key,
                        'timestamp' => $chat->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            // Get status history
            $statusHistory = HelpSupportStatusTracker::getTicketHistory($ticketId);

            // Get ticket metadata
            $ticketInfo = HelpSupportChat::where('ticket_id', $ticketId)
                ->first();

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'status' => $ticketInfo->status,
                'is_resolved' => $ticketInfo->is_resolved,
                'created_at' => $ticketInfo->created_at->format('Y-m-d H:i:s'),
                'chat_history' => $chatHistory,
                'status_history' => $statusHistory,
            ], 'Chat history retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve chat history', $e->getMessage(), 500);
        }
    }

    /**
     * Get all tickets for the authenticated user
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getHelpTickets(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId = $decoded->sub;

            $status = $request->query('status');

            $query = HelpSupportChat::where('user_id', $userId)
                ->select('ticket_id', 'status', 'is_resolved', 'created_at', 'updated_at')
                ->groupBy('ticket_id', 'status', 'is_resolved', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            $tickets = $query->get()->map(function ($ticket) {
                return [
                    'ticket_id' => $ticket->ticket_id,
                    'status' => $ticket->status,
                    'is_resolved' => $ticket->is_resolved,
                    'created_at' => $ticket->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $ticket->updated_at->format('Y-m-d H:i:s'),
                ];
            });

            return ApiResponse::success([
                'tickets' => $tickets,
                'total' => $tickets->count(),
            ], 'Tickets retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve tickets', $e->getMessage(), 500);
        }
    }

    /**
     * Update ticket status
     * 
     * @param Request $request
     * @param string $ticketId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateHelpTicketStatus(Request $request, $ticketId)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:open,in_progress,resolved,closed',
                'remarks' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', $validator->errors(), 422);
            }

            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userId = $decoded->sub;

            $newStatus = $request->status;
            $remarks = $request->remarks;

            // Verify ticket belongs to user
            $ticket = HelpSupportChat::where('ticket_id', $ticketId)
                ->where('user_id', $userId)
                ->first();

            if (!$ticket) {
                return ApiResponse::error('Invalid ticket or unauthorized access', null, 403);
            }

            $oldStatus = $ticket->status;

            // Update all chats for this ticket
            HelpSupportChat::where('ticket_id', $ticketId)
                ->update([
                    'status' => $newStatus,
                    'is_resolved' => in_array($newStatus, ['resolved', 'closed']),
                ]);

            // Track status change
            HelpSupportStatusTracker::trackStatusChange(
                $ticketId,
                $oldStatus,
                $newStatus,
                $userId,
                $remarks
            );

            return ApiResponse::success([
                'ticket_id' => $ticketId,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
            ], 'Ticket status updated successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update ticket status', $e->getMessage(), 500);
        }
    }

    /**
     * Get Policy Details with TPA-specific data
     * 
     * @param Request $request
     * @param int $policy_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPolicyDetails(Request $request, $policy_id)
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

            // Get policy details
            $policy = DB::table('policy_master')
                ->where('id', $policy_id)
                ->where('is_active', 1)
                ->first();

            if (!$policy) {
                return ApiResponse::error('Policy not found', null, 404);
            }

            // Check if employee's company matches policy company
            if ($policy->comp_id != $employee->company_id) {
                return ApiResponse::error('Unauthorized access to this policy', null, 403);
            }

            // Get insurance company details
            $insuranceCompany = DB::table('insurance_master')
                ->where('id', $policy->ins_id)
                ->first();

            // Get TPA company details
            $tpaCompany = DB::table('tpa_master')
                ->where('id', $policy->tpa_id)
                ->first();

            // Get policy mapping data
            $mappingData = DB::table('policy_mapping_master')
                ->where('policy_id', $policy->id)
                ->where('emp_id', $employee->id)
                ->where('cmp_id', $employee->company_id)
                ->where('status', 1)
                ->first();

            if (!$mappingData) {
                return ApiResponse::error('No policy mapping found for this employee', null, 404);
            }

            // Get escalation matrix
            $escalationMatrix = DB::table('escalation_matrix')
                ->where('policy_id', $policy->id)
                ->get();

            // Enrich escalation matrix with user details from escalation_users
            if ($escalationMatrix && $escalationMatrix->isNotEmpty()) {
                try {
                    $userIds = [];
                    foreach ($escalationMatrix as $row) {
                        if (!empty($row->claim_level_1_id)) {
                            $userIds[] = $row->claim_level_1_id;
                        }
                        if (!empty($row->claim_level_2_id)) {
                            $userIds[] = $row->claim_level_2_id;
                        }
                    }
                    $userIds = array_values(array_unique($userIds));

                    $escalationUsers = [];
                    if (!empty($userIds)) {
                        $escalationUsers = DB::table('escalation_users')
                            ->whereIn('id', $userIds)
                            ->get()
                            ->keyBy('id')
                            ->toArray();
                    }

                    $escalationMatrix = $escalationMatrix->map(function ($row) use ($escalationUsers) {
                        $out = (array) $row;

                        // Attach full user object for claim_level_1
                        $out['claim_level_1'] = null;
                        if (!empty($row->claim_level_1_id) && isset($escalationUsers[$row->claim_level_1_id])) {
                            $u = $escalationUsers[$row->claim_level_1_id];
                            $out['claim_level_1'] = [
                                'id' => $u->id ?? null,
                                'name' => $u->name ?? $u->user_name ?? null,
                                'email' => $u->email ?? null,
                                'mobile' => $u->mobile ?? $u->phone ?? null,
                            ];
                        }

                        // Attach full user object for claim_level_2
                        $out['claim_level_2'] = null;
                        if (!empty($row->claim_level_2_id) && isset($escalationUsers[$row->claim_level_2_id])) {
                            $u = $escalationUsers[$row->claim_level_2_id];
                            $out['claim_level_2'] = [
                                'id' => $u->id ?? null,
                                'name' => $u->name ?? $u->user_name ?? null,
                                'email' => $u->email ?? null,
                                'mobile' => $u->mobile ?? $u->phone ?? null,
                            ];
                        }

                        return $out;
                    })->toArray();
                } catch (\Exception $e) {
                    \Log::error('Failed to enrich escalation matrix: ' . $e->getMessage());
                }
            }

            // Determine table name based on is_old flag or TPA ID
            $tableData = $this->getPolicyTableData($policy, $employee, $mappingData);

            // Get policy features (inclusion / exclusion)
            $policyFeatures = [];
            try {
                $rows = DB::table('policy_feature')
                    ->where('policy_id', $policy->id)
                    ->where('is_active', 1)
                    ->get();

                $policyFeatures = ['inclusion' => [], 'exclusion' => []];
                foreach ($rows as $r) {
                    $item = [
                        'id' => $r->id ?? null,
                        'feature_type' => $r->feature_type ?? null,
                        'feature_title' => $r->feature_title ?? null,
                        'feature_desc' => $r->feature_desc ?? null,
                        'icon_type' => $r->icon_type ?? null,
                        'icon_data' => $r->icon_data ?? null,
                    ];

                    $type = strtolower(trim($r->feature_type ?? ''));
                    if ($type === 'inc') {
                        $policyFeatures['inclusion'][] = $item;
                    } elseif ($type === 'exl' || $type === 'excl' || $type === 'ex') {
                        $policyFeatures['exclusion'][] = $item;
                    } else {
                        // Unknown type: place under inclusion by default
                        $policyFeatures['inclusion'][] = $item;
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Failed to fetch policy features: ' . $e->getMessage());
            }

            // Return comprehensive policy details
            return ApiResponse::success([
                'policy' => [
                    'id' => $policy->id,
                    'policy_name' => $policy->policy_name ?? 'N/A',
                    'policy_number' => $policy->policy_number ?? 'N/A',
                    'policy_start_date' => $policy->policy_start_date ?? null,
                    'policy_end_date' => $policy->policy_end_date ?? null,
                    'tpa_id' => $policy->tpa_id ?? null,
                    'is_old' => $policy->is_old ?? 0,
                ],
                'insurance_company' => [
                    'id' => $insuranceCompany->id ?? null,
                    'name' => $insuranceCompany->insurance_company_name ?? 'N/A',
                    'logo' => $insuranceCompany->insurance_comp_icon_url ?? null,
                ],
                'tpa_company' => [
                    'id' => $tpaCompany->id ?? null,
                    'name' => $tpaCompany->tpa_company_name ?? $tpaCompany->tpa_company_name ?? 'N/A',
                    'logo' => $tpaCompany->tpa_icon_url ?? $tpaCompany->tpa_comp_icon_url ?? $tpaCompany->logo ?? null,
                ],
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->full_name,
                    'employee_code' => $employee->employees_code,
                    'email' => $employee->email,
                ],
                'mapping' => [
                    'id' => $mappingData->id,
                    'addition_endorsement_id' => $mappingData->addition_endorsement_id ?? null,
                ],
                'tpa_data' => $tableData['tpa_data'] ?? null,
                'dependents' => $tableData['dependents'] ?? [],
                'cover_summary' => $tableData['cover_str'] ?? 'No coverage information available',
                'policy_feature' => $policyFeatures,
                'escalation_matrix' => $escalationMatrix ?? [],
            ], 'Policy details retrieved successfully');

        } catch (\Exception $e) {
            \Log::error('❌ Get policy details error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return ApiResponse::error('Failed to retrieve policy details', $e->getMessage(), 500);
        }
    }

    /**
     * Get TPA-specific table data based on policy configuration
     * 
     * @param object $policy
     * @param object $employee
     * @param object $mappingData
     * @return array
     */
    private function getPolicyTableData($policy, $employee, $mappingData)
    {
        $result = [
            'tpa_data' => null,
            'dependents' => [],
            'cover_str' => ''
        ];

        // If is_old == 2, use endorsement_data table
        if (isset($policy->is_old) && $policy->is_old == 2) {
            $tableName = 'endorsement_data';
            $primaryKey = 'endorsement_id';
        } else {
            // Map TPA ID to table name and primary key
            $tpaConfig = $this->getTpaTableConfig($policy->tpa_id);
            $tableName = $tpaConfig['table'];
            $primaryKey = $tpaConfig['primary_key'];
        }

        // If no valid table found, return empty
        if (!$tableName) {
            return $result;
        }

        try {
            // Get main TPA data
            $result['tpa_data'] = DB::table($tableName)
                ->where('policy_id', $policy->id)
                ->where('emp_id', $employee->id)
                ->first();
            // Get dependents
            $result['dependents'] = DB::table($tableName)
                ->select($primaryKey, 'insured_name', 'dob', 'gender', 'relation')
                ->where('emp_id', $employee->id)
                ->where('policy_id', $policy->id)
                ->whereNotNull('addition_endorsement_id')
                ->where('addition_endorsement_id', '!=', 0)
                ->get();
            // Get cover summary string
            $coverQuery = "
                SELECT CONCAT_WS(
                    ' <br> & <br>', 
                    IF(SUM(base_sum_insured) > 0, CONCAT('Base SI <br> Rs. ', FORMAT(SUM(base_sum_insured), 0)), NULL),
                    IF(SUM(topup_sum_insured) > 0, CONCAT('Top Up SI <br> Rs. ', FORMAT(SUM(topup_sum_insured), 0)), NULL),
                    IF(SUM(parent_sum_insured) > 0, CONCAT('Parents SI <br> Rs. ', FORMAT(SUM(parent_sum_insured), 0)), NULL),
                    IF(SUM(parent_in_law_sum_insured) > 0, CONCAT('Parents in Law SI <br> Rs. ', FORMAT(SUM(parent_in_law_sum_insured), 0)), NULL)
                ) AS output_string 
                FROM {$tableName}
                WHERE cmp_id = ? 
                AND policy_id = ? 
                AND emp_id = ? 
                AND mapping_id = ? 
                AND addition_endorsement_id = ?
            ";

            $coverResult = DB::select($coverQuery, [
                $employee->company_id,
                $policy->id,
                $employee->id,
                $mappingData->id,
                $mappingData->addition_endorsement_id ?? 0
            ]);

            $result['cover_str'] = $coverResult[0]->output_string ?? '';
        } catch (\Exception $e) {
            \Log::error('Error fetching TPA table data: ' . $e->getMessage());
        }

        return $result;
    }

    /**
     * Get TPA table configuration (table name and primary key)
     * 
     * @param int $tpaId
     * @return array
     */
    private function getTpaTableConfig($tpaId)
    {
        $tpaMapping = [
            60 => ['table' => 'demo_endorsement_data', 'primary_key' => 'demo_id'],
            62 => ['table' => 'phs_endorsement_data', 'primary_key' => 'phs_id'],
            63 => ['table' => 'icici_endorsement_data', 'primary_key' => 'icici_id'],
            64 => ['table' => 'go_digit_endorsement_data', 'primary_key' => 'go_digit_id'],
            65 => ['table' => 'vidal_endorsement_data', 'primary_key' => 'vidal_id'],
            66 => ['table' => 'fhpl_endorsement_data', 'primary_key' => 'main_member_uhid'],
            67 => ['table' => 'mediassist_endorsement_data', 'primary_key' => 'mediassist_id'],
            68 => ['table' => 'safeway_endorsement_data', 'primary_key' => 'safeway_id'],
            69 => ['table' => 'care_endorsement_data', 'primary_key' => 'care_id'],
            70 => ['table' => 'health_india_endorsement_data', 'primary_key' => 'health_india_id'],
            71 => ['table' => 'ewa_endorsement_data', 'primary_key' => 'ewa_id'],
            72 => ['table' => 'sbi_endorsement_data', 'primary_key' => 'sbi_id'],
            73 => ['table' => 'ericson_endorsement_data', 'primary_key' => 'ericson_id'],
            75 => ['table' => 'ab_endorsement_data', 'primary_key' => 'ab_id'],
            76 => ['table' => 'iffco_endorsement_data', 'primary_key' => 'iffco_id'],
        ];
        return $tpaMapping[$tpaId];
    }

    /**
     * Check if a string is valid JSON
     * 
     * @param string $string
     * @return bool
     */
    private function isJson($string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * Get network hospital table configuration for each TPA
     * 
     * @param int $tpaId
     * @return array|null
     */
    private function getNetworkHospitalTableConfig($tpaId)
    {
        $tpaMapping = [
            62 => [ // PHS - Uses external API
                'table' => null,
                'uses_api' => true,
            ],
            63 => [ // ICICI
                'table' => 'icici_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'address1_column' => 'addressLine1',
                'address2_column' => 'addressLine2',
                'city_column' => 'city',
                'state_column' => 'state',
                'pincode_column' => 'pinCode',
                'phone_column' => 'landLineNumber',
                'email_column' => 'email',
                'type_column' => 'hospitalType',
            ],
            65 => [ // Vidal
                'table' => 'vidal_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'address1_column' => 'address_line_1',
                'address2_column' => 'address_line_2',
                'city_column' => 'city_name',
                'state_column' => 'state_name',
                'pincode_column' => 'pincode',
                'phone_column' => 'phone_number',
                'email_column' => 'email',
                'type_column' => 'hospital_type',
                'landmark1_column' => 'landmark1',
            ],
            66 => [ // FHPL
                'table' => 'fhpl_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'address1_column' => 'address_line_1',
                'address2_column' => 'address_line_2',
                'city_column' => 'city_name',
                'state_column' => 'state_name',
                'pincode_column' => 'pincode',
                'phone_column' => 'phone_number',
                'email_column' => 'email',
                'landmark1_column' => 'landmark1',
            ],
            67 => [ // Mediassist
                'table' => 'mediassist_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospitaL_NAME',
                'address1_column' => 'addresS1',
                'address2_column' => 'addresS2',
                'city_column' => 'citY_NAME',
                'state_column' => 'statE_NAME',
                'pincode_column' => 'piN_CODE',
                'phone_column' => 'phonE_NO',
                'email_column' => 'email',
                'landmark1_column' => 'landmarK_1',
            ],
            68 => [ // Safeway
                'table' => 'safeway_new_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'Name',
                'address1_column' => 'Address',
                'city_column' => 'city',
                'state_column' => 'state',
                'pincode_column' => 'pincode',
                'phone_column' => 'phone',
                'email_column' => 'email',
            ],
            69 => [ // Care
                'table' => 'care_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'city_column' => 'city',
                'state_column' => 'state',
                'pincode_column' => 'pinCode',
                'phone_column' => 'phone',
                'location_column' => 'location',
            ],
            71 => [ // EWA
                'table' => 'ewa_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'address1_column' => 'address_line_1',
                'address2_column' => 'address_line_2',
                'city_column' => 'city_name',
                'state_column' => 'state_name',
                'pincode_column' => 'pincode',
                'phone_column' => 'phone_number',
                'email_column' => 'email',
                'landmark1_column' => 'landmark1',
                'type_column' => 'hospital_type',
            ],
            73 => [ // Ericson
                'table' => 'ericson_network_hospitals',
                'id_column' => 'id',
                'name_column' => 'hospital_name',
                'address1_column' => 'address_line_1',
                'address2_column' => 'address_line_2',
                'city_column' => 'city_name',
                'state_column' => 'state_name',
                'pincode_column' => 'pincode',
                'phone_column' => 'phone_number',
                'email_column' => 'email',
                'type_column' => 'hospital_type',
            ],
        ];

        return $tpaMapping[$tpaId] ?? null;
    }

    /**
     * Standardize network hospital response across different TPAs
     */
    private function standardizeNetworkHospitalResponse($hospitals, $tpaConfig)
    {
        $standardized = [];

        foreach ($hospitals as $hospital) {
            $hospitalData = (array) $hospital;
            
            $standardized[] = [
                'hospital_id' => $hospitalData[$tpaConfig['id_column']] ?? null,
                'hospital_name' => $hospitalData[$tpaConfig['name_column']] ?? '',
                'address_line_1' => $hospitalData[$tpaConfig['address1_column'] ?? 'address_line_1'] ?? '',
                'address_line_2' => $hospitalData[$tpaConfig['address2_column'] ?? 'address_line_2'] ?? '',
                'city' => $hospitalData[$tpaConfig['city_column']] ?? '',
                'state' => $hospitalData[$tpaConfig['state_column']] ?? '',
                'pincode' => $hospitalData[$tpaConfig['pincode_column']] ?? '',
                'phone' => $hospitalData[$tpaConfig['phone_column'] ?? 'phone'] ?? '',
                'email' => $hospitalData[$tpaConfig['email_column'] ?? 'email'] ?? '',
                'hospital_type' => $hospitalData[$tpaConfig['type_column'] ?? 'hospital_type'] ?? '',
                'landmark' => $hospitalData[$tpaConfig['landmark1_column'] ?? 'landmark'] ?? '',
                'location' => $hospitalData[$tpaConfig['location_column'] ?? 'location'] ?? '',
            ];
        }

        return $standardized;
    }

    /**
     * Get network hospital search options (states and cities) for a policy
     */
    public function getNetworkHospitalSearchOptions(Request $request, $policy_id)
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

            // Get policy details
            $policy = DB::table('policy_master')
                ->where('id', $policy_id)
                ->where('is_active', 1)
                ->first();

            if (!$policy) {
                return ApiResponse::error('Policy not found', null, 404);
            }

            // Check if employee's company matches policy company
            if ($policy->comp_id != $employee->company_id) {
                return ApiResponse::error('Unauthorized access to this policy', null, 403);
            }

            $tpaId = $policy->tpa_id;

            // Special handling for PHS (TPA ID 62) - requires pincode
            if ($tpaId == 62) {
                return ApiResponse::success([
                    'policy_id' => $policy_id,
                    'policy_number' => $policy->policy_number ?? null,
                    'tpa_id' => $tpaId,
                    'search_type' => 'pincode_only',
                    'message' => 'Please enter pincode to search hospitals',
                ], 'PHS TPA requires pincode for search');
            }

            // Get TPA network hospital table configuration
            $tpaConfig = $this->getNetworkHospitalTableConfig($tpaId);

            if (!$tpaConfig) {
                return ApiResponse::error('Network hospital data not available for this TPA', null, 404);
            }

            $tableName = $tpaConfig['table'];
            $stateColumn = $tpaConfig['state_column'] ?? 'state';
            $cityColumn = $tpaConfig['city_column'] ?? 'city';

            // Get states with their cities
            $statesWithCities = DB::table($tableName)
                ->select($stateColumn . ' as state', $cityColumn . ' as city')
                ->whereNotNull($stateColumn)
                ->where($stateColumn, '!=', '')
                ->whereNotNull($cityColumn)
                ->where($cityColumn, '!=', '')
                ->distinct()
                ->orderBy('state')
                ->orderBy('city')
                ->get();

            // Group cities by state
            $groupedStates = [];
            foreach ($statesWithCities as $row) {
                $state = $row->state;
                $city = $row->city;

                if (!isset($groupedStates[$state])) {
                    $groupedStates[$state] = [];
                }

                if (!in_array($city, $groupedStates[$state])) {
                    $groupedStates[$state][] = $city;
                }
            }

            // Format as array of state objects with cities
            $formattedStates = [];
            foreach ($groupedStates as $state => $cities) {
                $formattedStates[] = [
                    'state' => $state,
                    'cities' => array_values($cities),
                ];
            }

            return ApiResponse::success([
                'policy_id' => $policy_id,
                'policy_number' => $policy->policy_number ?? null,
                'tpa_id' => $tpaId,
                'search_type' => 'state_city_or_pincode',
                'search_options' => [
                    'states' => $formattedStates,
                ],
            ], 'Search options retrieved successfully');

        } catch (\Exception $e) {
            \Log::error('Failed to get network hospital search options: ' . $e->getMessage());
            return ApiResponse::error('Failed to retrieve search options', $e->getMessage(), 500);
        }
    }

    /**
     * Get network hospital list based on policy and search criteria
     */
    public function getNetworkHospitalList(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $validator = Validator::make($request->all(), [
                'policy_id' => 'required|integer',
                'pincode' => 'nullable|string',
                'state' => 'nullable|string',
                'city' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', $validator->errors(), 422);
            }

            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('User not found', null, 404);
            }

            $policyId = $request->policy_id;
            $pincode = $request->pincode;
            $state = $request->state;
            $city = $request->city;

            // Get policy details
            $policy = DB::table('policy_master')
                ->where('id', $policyId)
                ->where('is_active', 1)
                ->first();

            if (!$policy) {
                return ApiResponse::error('Policy not found', null, 404);
            }

            // Check if employee's company matches policy company
            if ($policy->comp_id != $employee->company_id) {
                return ApiResponse::error('Unauthorized access to this policy', null, 403);
            }

            $tpaId = $policy->tpa_id;

            // Special handling for PHS (TPA ID 62) - uses external API
            if ($tpaId == 62) {
                return $this->getPhsNetworkHospitals($policy, $pincode);
            }

            // Get TPA network hospital table configuration
            $tpaConfig = $this->getNetworkHospitalTableConfig($tpaId);

            if (!$tpaConfig) {
                return ApiResponse::error('Network hospital data not available for this TPA', null, 404);
            }

            $tableName = $tpaConfig['table'];

            // Build query
            $query = DB::table($tableName);

            // Apply filters
            if ($pincode) {
                $pincodeColumn = $tpaConfig['pincode_column'] ?? 'pincode';
                $query->where($pincodeColumn, $pincode);
            } else {
                if ($state) {
                    $stateColumn = $tpaConfig['state_column'] ?? 'state';
                    $query->where($stateColumn, $state);
                }
                if ($city) {
                    $cityColumn = $tpaConfig['city_column'] ?? 'city';
                    $query->where($cityColumn, $city);
                }
            }

            $hospitals = $query->limit(500)->get();

            // Standardize response
            $standardizedHospitals = $this->standardizeNetworkHospitalResponse($hospitals, $tpaConfig);

            return ApiResponse::success([
                'policy_id' => $policyId,
                'policy_number' => $policy->policy_number ?? null,
                'tpa_id' => $tpaId,
                'search_criteria' => [
                    'pincode' => $pincode,
                    'state' => $state,
                    'city' => $city,
                ],
                'total_hospitals' => count($standardizedHospitals),
                'hospitals' => $standardizedHospitals,
            ], 'Network hospitals retrieved successfully');

        } catch (\Exception $e) {
            \Log::error('Failed to get network hospitals: ' . $e->getMessage());
            return ApiResponse::error('Failed to retrieve network hospitals', $e->getMessage(), 500);
        }
    }

    /**
     * Get PHS network hospitals via external API
     */
    private function getPhsNetworkHospitals($policy, $pincode)
    {
        if (!$pincode) {
            return ApiResponse::error('Pincode is required for PHS network hospitals', null, 400);
        }

        $attempts = 0;
        $maxAttempts = 3;

        while ($attempts < $maxAttempts) {
            try {
                $requestData = [
                    "USERNAME" => "ZOOM-ADMIN",
                    "PASSWORD" => "ADMIN-USER@389",
                    "PIN_CODE" => $pincode,
                    "POLICY_NO" => $policy->policy_number ?? '',
                ];

                $ch = curl_init();
                curl_setopt_array($ch, [
                    CURLOPT_URL => 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/GetHospitalList',
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_ENCODING => '',
                    CURLOPT_MAXREDIRS => 10,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                    CURLOPT_CUSTOMREQUEST => 'POST',
                    CURLOPT_POSTFIELDS => json_encode($requestData),
                    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                ]);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                // Log API call
                \Log::info('PHS Network Hospital API Request', [
                    'request' => $requestData,
                    'response' => $response,
                    'http_code' => $httpCode,
                ]);

                if ($response && $httpCode == 200) {
                    $responseData = json_decode($response, true);
                    $hospitals = $responseData['GetHospitalListResult'] ?? [];

                    return ApiResponse::success([
                        'policy_id' => $policy->id,
                        'policy_number' => $policy->policy_number ?? null,
                        'tpa_id' => 62,
                        'search_criteria' => ['pincode' => $pincode],
                        'total_hospitals' => count($hospitals),
                        'hospitals' => $hospitals,
                    ], 'PHS network hospitals retrieved successfully');
                }

                $attempts++;
                if ($attempts < $maxAttempts) {
                    sleep(1); // Wait 1 second before retry
                }

            } catch (\Exception $e) {
                \Log::error('PHS API Error: ' . $e->getMessage());
                $attempts++;
            }
        }

        return ApiResponse::error('Failed to retrieve PHS network hospitals after multiple attempts', null, 500);
    }

    // ============================================
    // Survey APIs
    // ============================================

    /**
     * Get assigned surveys for the authenticated employee
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAssignedSurveys(Request $request)
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
                return ApiResponse::error('Employee not found', null, 404);
            }

            $companyId = $employee->company_id;
            $employeeId = $employee->id;
            $today = date('Y-m-d');

            // Get assigned surveys with submission status
            $sql = "
                SELECT 
                    cas.*, 
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 
                            FROM survey_responses sr 
                            WHERE sr.assigned_survey_id = cas.id 
                            AND sr.emp_id = ?
                        ) THEN 1 
                        ELSE 0 
                    END AS is_submit
                FROM 
                    company_assign_survey cas
                WHERE 
                    cas.comp_id = ? 
                    AND cas.survey_start_date <= ? 
                    AND cas.survey_end_date >= ?
                LIMIT 1
            ";

            $assignedSurveys = DB::select($sql, [$employeeId, $companyId, $today, $today]);

            return ApiResponse::success([
                'surveys' => $assignedSurveys,
            ], 'Assigned surveys retrieved successfully');

        } catch (\Exception $e) {
            \Log::error('Failed to get assigned surveys: ' . $e->getMessage());
            return ApiResponse::error('Failed to retrieve assigned surveys', $e->getMessage(), 500);
        }
    }

    /**
     * Get survey questions for a specific survey
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getSurveyQuestions(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $validator = Validator::make($request->all(), [
                'survey_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', $validator->errors(), 422);
            }

            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('Employee not found', null, 404);
            }

            $surveyId = $request->survey_id;

            // Get survey questions
            $questions = DB::table('survey_questions')
                ->where('survey_id', $surveyId)
                ->orderBy('id')
                ->get();

            return ApiResponse::success([
                'survey_id' => $surveyId,
                'questions' => $questions,
            ], 'Survey questions retrieved successfully');

        } catch (\Exception $e) {
            \Log::error('Failed to get survey questions: ' . $e->getMessage());
            return ApiResponse::error('Failed to retrieve survey questions', $e->getMessage(), 500);
        }
    }

    /**
     * Submit survey responses
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function submitSurveyResponse(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $validator = Validator::make($request->all(), [
                'survey_id' => 'required|integer',
                'assigned_survey_id' => 'required|integer',
                'responses' => 'required|array',
                'responses.*.question_id' => 'required|integer',
                'responses.*.rating' => 'nullable|integer',
                'responses.*.response_text' => 'nullable|string',
                'responses.*.response_choice' => 'nullable|string',
                'responses.*.response_checkboxes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return ApiResponse::error('Validation failed', $validator->errors(), 422);
            }

            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));

            $employee = CompanyEmployee::find($decoded->sub);

            if (!$employee) {
                return ApiResponse::error('Employee not found', null, 404);
            }

            $employeeId = $employee->id;
            $surveyId = $request->survey_id;
            $assignedSurveyId = $request->assigned_survey_id;
            $responses = $request->responses;

            // Check if survey already submitted
            $existingResponse = DB::table('survey_responses')
                ->where('assigned_survey_id', $assignedSurveyId)
                ->where('emp_id', $employeeId)
                ->exists();

            if ($existingResponse) {
                return ApiResponse::error('Survey already submitted', null, 400);
            }

            // Insert all responses
            $insertData = [];
            $now = now();

            foreach ($responses as $response) {
                $insertData[] = [
                    'assigned_survey_id' => $assignedSurveyId,
                    'survey_id' => $surveyId,
                    'question_id' => $response['question_id'],
                    'emp_id' => $employeeId,
                    'rating' => $response['rating'] ?? null,
                    'response_text' => $response['response_text'] ?? null,
                    'response_choice' => $response['response_choice'] ?? null,
                    'response_checkboxes' => $response['response_checkboxes'] ?? null,
                    'focus_area' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            DB::table('survey_responses')->insert($insertData);

            return ApiResponse::success([
                'survey_id' => $surveyId,
                'assigned_survey_id' => $assignedSurveyId,
                'responses_count' => count($insertData),
            ], 'Survey responses saved successfully');

        } catch (\Exception $e) {
            \Log::error('Failed to submit survey responses: ' . $e->getMessage());
            return ApiResponse::error('Failed to save survey responses', $e->getMessage(), 500);
        }
    }

    /**
     * Natural Addition - Store new dependent
     */
    public function naturalAdditionStore(Request $request)
    {
        $employeeId = $request->employee_id;
        $employee = CompanyEmployee::find($employeeId);

        if (!$employee) {
            return ApiResponse::error('Employee Not Found', null, 404);
        }

        $payload = $request->only([
            'dependent_name',
            'dependent_relation',
            'dependent_gender',
            'dependent_dob',
            'date_of_event',
            'document',
            'policy_id'
        ]);

        $validator = Validator::make($payload, [
            'dependent_name' => 'required|string',
            'dependent_relation' => 'required|in:SPOUSE,CHILD',
            'dependent_gender' => 'required|in:MALE,FEMALE',
            'dependent_dob' => 'required|date',
            'document' => 'required|string',
            'policy_id' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validation error', $validator->errors()->first(), 400);
        }

        $dependent_relation = $payload['dependent_relation'];
        $date_of_event = $payload['date_of_event'] ?? null;
        $dependent_dob = $payload['dependent_dob'];

        if ($dependent_relation === 'SPOUSE' && empty($date_of_event)) {
            return ApiResponse::error('Date of Event is required for Spouse.', null, 400);
        }

        $now = now();
        $limitDate = $now->copy()->subDays(30)->startOfDay();

        if ($dependent_relation === 'SPOUSE') {
            if (\Carbon\Carbon::parse($date_of_event)->lt($limitDate)) {
                return ApiResponse::error('Date of Event for Spouse cannot be more than 30 days in the past.', null, 400);
            }
        }

        if ($dependent_relation === 'CHILD') {
            if (\Carbon\Carbon::parse($dependent_dob)->lt($limitDate)) {
                return ApiResponse::error('Date of Birth for Child cannot be more than 30 days in the past.', null, 400);
            }
        }

        $entryCount = DB::table('natural_addition')->where('emp_id', $employeeId)->where('relation', $dependent_relation)->count();

        if ($dependent_relation === 'SPOUSE' && $entryCount >= 1) {
            return ApiResponse::error('You can only add 1 spouse.', null, 400);
        }

        if ($dependent_relation === 'CHILD' && $entryCount >= 2) {
            return ApiResponse::error('You can only add 2 children.', null, 400);
        }

        // Save document (base64 PDF)
        $documentBase64 = $payload['document'];
        $imageData = base64_decode($documentBase64);
        $dir = public_path('uploads/natural_addition');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $fileName = 'uploads/natural_addition/' . time() . '_' . rand(1000, 9999) . '.pdf';
        file_put_contents(public_path($fileName), $imageData);

        $insert = [
            'emp_id' => $employeeId,
            'emp_code' => $employee->employees_code ?? null,
            'policy_id' => $payload['policy_id'] ?? 1,
            'cmp_id' => $employee->company_id ?? null,
            'insured_name' => $payload['dependent_name'],
            'gender' => $payload['dependent_gender'],
            'relation' => $payload['dependent_relation'],
            'dob' => $payload['dependent_dob'],
            'date_of_event' => $date_of_event,
            'document' => $fileName,
            'status' => 0,
            'created_at' => $now->toDateTimeString(),
            'updated_at' => $now->toDateTimeString(),
        ];

        $id = DB::table('natural_addition')->insertGetId($insert);

        return ApiResponse::success(['id' => $id], 'Data Sent to the HR For the Review', 200);
    }

    /**
     * Natural Addition - Update existing dependent
     */
    public function naturalAdditionUpdate(Request $request)
    {
        $id = $request->input('id');
        $employeeId = $request->employee_id;

        if (empty($id)) {
            return ApiResponse::error('ID Not Found', null, 404);
        }

        $employee = CompanyEmployee::find($employeeId);
        if (!$employee) {
            return ApiResponse::error('Employee Not Found', null, 404);
        }

        $payload = $request->only([
            'dependent_name',
            'dependent_relation',
            'dependent_gender',
            'dependent_dob',
            'date_of_event',
            'document',
            'policy_id'
        ]);

        $rules = [
            'dependent_name' => 'required|string',
            'dependent_relation' => 'required|in:SPOUSE,CHILD',
            'dependent_gender' => 'required|in:MALE,FEMALE',
            'dependent_dob' => 'required|date',
            'policy_id' => 'nullable|integer'
        ];

        if ($request->filled('document')) {
            $rules['document'] = 'string';
        }

        $validator = Validator::make($payload, $rules);
        if ($validator->fails()) {
            return ApiResponse::error('Validation error', $validator->errors()->first(), 400);
        }

        $dependent_relation = $payload['dependent_relation'];
        $date_of_event = $payload['date_of_event'] ?? null;
        $dependent_dob = $payload['dependent_dob'];

        if ($dependent_relation === 'SPOUSE' && empty($date_of_event)) {
            return ApiResponse::error('Date of Event is required for Spouse.', null, 400);
        }

        $now = now();
        $limitDate = $now->copy()->subDays(30)->startOfDay();

        if ($dependent_relation === 'SPOUSE') {
            if (\Carbon\Carbon::parse($date_of_event)->lt($limitDate)) {
                return ApiResponse::error('Date of Event for Spouse cannot be more than 30 days in the past.', null, 400);
            }
        }

        if ($dependent_relation === 'CHILD') {
            if (\Carbon\Carbon::parse($dependent_dob)->lt($limitDate)) {
                return ApiResponse::error('Date of Birth for Child cannot be more than 30 days in the past.', null, 400);
            }
        }

        $entryCount = DB::table('natural_addition')->where('emp_id', $employeeId)->where('relation', $dependent_relation)->count();

        if ($dependent_relation === 'SPOUSE' && $entryCount > 1) {
            return ApiResponse::error('You can only add 1 spouse.', null, 400);
        }

        if ($dependent_relation === 'CHILD' && $entryCount > 2) {
            return ApiResponse::error('You can only add 2 children.', null, 400);
        }

        $update = [
            'emp_id' => $employeeId,
            'emp_code' => $employee->employees_code ?? null,
            'policy_id' => $payload['policy_id'] ?? 1,
            'cmp_id' => $employee->company_id ?? null,
            'insured_name' => $payload['dependent_name'],
            'gender' => $payload['dependent_gender'],
            'relation' => $payload['dependent_relation'],
            'dob' => $payload['dependent_dob'],
            'date_of_event' => $date_of_event,
            'status' => 0,
            'updated_at' => $now->toDateTimeString(),
        ];

        if ($request->filled('document')) {
            $documentBase64 = $payload['document'];
            $imageData = base64_decode($documentBase64);
            $dir = public_path('uploads/natural_addition');
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            $fileName = 'uploads/natural_addition/' . time() . '_' . rand(1000, 9999) . '.pdf';
            file_put_contents(public_path($fileName), $imageData);
            $update['document'] = $fileName;
        }

        DB::table('natural_addition')->where('id', $id)->update($update);

        return ApiResponse::success([], 'Data Sent to the HR For the Review', 200);
    }

    /**
     * Natural Addition - List all dependents for employee
     */
    public function naturalAdditionList(Request $request)
    {
        $employeeId = $request->employee_id;

        $natural = DB::table('natural_addition')->where('emp_id', $employeeId)->get();

        return ApiResponse::success(['data' => $natural], 'Natural addition list fetched successfully', 200);
    }

    /**
     * Claim Details - Get all claims for employee across all policies
     */
    public function claimDetails(Request $request)
    {
        $employeeId = $request->employee_id;
        $employee = CompanyEmployee::find($employeeId);

        if (!$employee) {
            return ApiResponse::error('Employee Not Found', null, 404);
        }

        // Get UHID data
        $uhidData = DB::table('icici_endorsement_data')->where('emp_id', $employeeId)->get();

        // Get all active policies for this employee
        $allPolicies = DB::select(
            "SELECT policy_mapping_master.policy_id, policy_master.policy_name, policy_master.policy_start_date, 
            policy_master.policy_end_date, policy_master.policy_number, policy_master.policy_type, policy_master.tpa_id, 
            insurance_master.insurance_company_name, insurance_master.insurance_comp_icon_url, tpa_master.tpa_table_name AS tpa_table 
            FROM policy_mapping_master 
            INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id 
            INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id 
            INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id 
            INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id 
            WHERE policy_mapping_master.emp_id = ? 
            AND policy_mapping_master.status = 1 
            AND policy_master.policy_status = 1 
            AND policy_endorsements.status = 1 
            AND policy_mapping_master.addition_endorsement_id IS NOT NULL 
            AND policy_master.is_active = 1",
            [$employee->id]
        );

        $claims = [];

        foreach ($allPolicies as $policy) {
            // TPA ID 63 - ICICI Lombard
            if ($policy->tpa_id == 63) {
                foreach ($uhidData as $uhid) {
                    $iciciClaims = $this->getIciciClaims($policy, $employee, $uhid);
                    $claims = array_merge($claims, $iciciClaims);
                }
            }

            // TPA ID 62 - Paramount (PHS)
            if ($policy->tpa_id == 62) {
                $phsClaims = $this->getPhsClaims($policy, $employee);
                $claims = array_merge($claims, $phsClaims);
            }

            // TPA ID 66 - FHPL
            if ($policy->tpa_id == 66) {
                $fhplClaims = $this->getFhplClaims($policy, $employee);
                $claims = array_merge($claims, $fhplClaims);
            }

            // TPA ID 67 - Mediassist
            if ($policy->tpa_id == 67) {
                $mediClaims = $this->getMediassistClaims($policy, $employee);
                $claims = array_merge($claims, $mediClaims);
            }

            // TPA ID 68 - Safeway
            if ($policy->tpa_id == 68) {
                $safewayClaims = $this->getSafewayClaims($policy, $employee);
                $claims = array_merge($claims, $safewayClaims);
            }

            // TPA ID 70 - Health India
            if ($policy->tpa_id == 70) {
                $healthIndiaClaims = $this->getHealthIndiaClaims($policy, $employee);
                $claims = array_merge($claims, $healthIndiaClaims);
            }

            // TPA ID 71 - EWA
            if ($policy->tpa_id == 71) {
                $ewaClaims = $this->getEwaClaims($policy, $employee);
                $claims = array_merge($claims, $ewaClaims);
            }
        }

        return ApiResponse::success(['claims' => $claims], 'Claim Data Sent Successfully', 200);
    }

    /**
     * Get ICICI Lombard claims
     */
    private function getIciciClaims($policy, $employee, $uhid)
    {
        $claims = [];
        $iciciId = $uhid->icici_id;
        $dob = $uhid->dob;
        $scope = "esb-healthclaimlist";

        $authToken = $this->getIciciAuthToken($scope);
        if (!$authToken) {
            return $claims;
        }

        $jsonData = json_encode([
            'DOB' => $dob . 'T00:00:00',
            'MobileNumber' => '',
            'PolicyNumber' => $policy->policy_number,
            'UHID' => $iciciId,
            'EmployeeID' => '',
            'CorrelationId' => 'd9217d8b-a8ac-46ac-a9c1-91d7d84c7db4'
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://janus.icicilombard.com/claims/ilservices/misc2/v1/claims/health/list',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $authToken,
                'Content-Type: application/json'
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('ICICI Claim API', ['request' => $jsonData, 'response' => $response]);

        $response = json_decode($response);
        if (isset($response->status) && $response->status == 1 && $response->statusMessage == "SUCCESS") {
            foreach ($response->claimList as $iciciClaim) {
                $claims[] = [
                    'policy' => $policy,
                    'insurance_company' => $policy->insurance_company_name,
                    'tpa_company' => 'ICICI',
                    'policy_number' => $policy->policy_number,
                    'policy_name' => $policy->policy_name,
                    'employee_name' => $employee->full_name,
                    'employee_id' => $employee->employees_code,
                    'patient_name' => $uhid->insured_name,
                    'patient_relation' => $uhid->relation,
                    'date_of_birth' => $uhid->dob,
                    'hospital_name' => $iciciClaim->hospitalName,
                    'ailment' => '',
                    'date_of_admission' => date('M d, Y', strtotime($iciciClaim->dateofAdmission)),
                    'date_of_discharge' => date('M d, Y', strtotime($iciciClaim->dateOfDischarge)),
                    'claim_amount' => $iciciClaim->claimAmount,
                    'claim_document' => '',
                    'last_query_reason' => '',
                    'query_letter' => '',
                    'paid_amt' => $iciciClaim->claimAmount,
                    'deduction_reasons' => '',
                    'settlment_letter' => '',
                    'tpa_claim_id' => $iciciClaim->claimNumber,
                    'claim_intimation_no' => '',
                    'type_of_claim' => $iciciClaim->claimType,
                    'claim_mode' => $iciciClaim->categoryOfClaim,
                    'rejection_date' => '',
                    'rejection_reason' => '',
                    'claim_status' => $iciciClaim->claimStatus,
                ];
            }
        }

        return $claims;
    }

    /**
     * Get Paramount (PHS) claims
     */
    private function getPhsClaims($policy, $employee)
    {
        $claims = [];
        $data2 = json_encode([
            'USERNAME' => 'ZOOM-ADMIN',
            'PASSWORD' => 'ADMIN-USER@389',
            'POLICY_NO' => $policy->policy_number,
            'EMPLOYEE_NO' => $employee->employees_code
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/GetClaimMISDetails',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data2,
            CURLOPT_HTTPHEADER => ['Content-Type:application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('PHS Claim API', ['request' => $data2, 'response' => $response]);

        $response = json_decode($response);
        if (isset($response->GetClaimMISDetailsResult) &&
            trim($response->GetClaimMISDetailsResult[0]->MESSAGE ?? '') != 'Invalid Policy Number' &&
            trim($response->GetClaimMISDetailsResult[0]->MESSAGE ?? '') != 'No data Found') {

            foreach ($response->GetClaimMISDetailsResult as $phsClaim) {
                if (isset($phsClaim->UNIQUE_CLAIM_NO)) {
                    $claims[] = [
                        'policy' => $policy,
                        'insurance_company' => $policy->insurance_company_name,
                        'tpa_company' => 'PHS',
                        'policy_number' => $policy->policy_number,
                        'policy_name' => $policy->policy_name,
                        'employee_name' => $employee->full_name,
                        'employee_id' => $employee->employees_code,
                        'patient_name' => $phsClaim->MEMBER_NAME ?? '',
                        'patient_relation' => $phsClaim->RELATION ?? '',
                        'date_of_birth' => '',
                        'hospital_name' => $phsClaim->NAME_OF_HOSPITAL ?? '',
                        'ailment' => '',
                        'date_of_admission' => $phsClaim->Date_of_Admission ?? '',
                        'date_of_discharge' => $phsClaim->Date_of_Discharge ?? '',
                        'claim_amount' => $phsClaim->TOTAL_AMOUNT_CLAIMED ?? '',
                        'claim_document' => $phsClaim->CLAIM_DOCUMENTS ?? '',
                        'last_query_reason' => '',
                        'query_letter' => '',
                        'paid_amt' => $phsClaim->Amount_Cleared ?? '',
                        'deduction_reasons' => '',
                        'settlment_letter' => $phsClaim->SETTLEMENT_LETTER ?? '',
                        'tpa_claim_id' => $phsClaim->UNIQUE_CLAIM_NO,
                        'claim_intimation_no' => '',
                        'type_of_claim' => $phsClaim->TYPE_OF_CLAIM ?? '',
                        'claim_mode' => $phsClaim->TYPE_OF_CLAIM ?? '',
                        'rejection_date' => '',
                        'rejection_reason' => '',
                        'claim_status' => $phsClaim->CLAIM_STATUS ?? '',
                    ];
                }
            }
        }

        return $claims;
    }

    /**
     * Get FHPL claims
     */
    private function getFhplClaims($policy, $employee)
    {
        $claims = [];
        $authToken = $this->getFhplAuthToken();
        if (!$authToken) {
            return $claims;
        }

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://m.fhpl.net/BcServiceAPI/api/GetClaimsDetails_Employee',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => 'UserName=ZoomInsurance&Password=fhla209oz&EmployeeID=' . $employee->employees_code . '&PolicyNumber=' . $policy->policy_number,
            CURLOPT_HTTPHEADER => [
                'Authorization: bearer ' . $authToken,
                'Content-Type: application/x-www-form-urlencoded'
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('FHPL Claim API', ['response' => $response]);

        $fhplClaims = json_decode($response, true);
        if ($fhplClaims) {
            foreach ($fhplClaims as $fhplClaim) {
                $claimData = [
                    'policy' => $policy,
                    'insurance_company' => $policy->insurance_company_name,
                    'tpa_company' => 'FHPL',
                    'policy_number' => $policy->policy_number,
                    'policy_name' => $policy->policy_name,
                    'employee_name' => $employee->full_name,
                    'employee_id' => $employee->employees_code,
                    'patient_name' => $fhplClaim['patient_name'] ?? '',
                    'patient_relation' => $fhplClaim['patient_relation'] ?? '',
                    'date_of_birth' => $fhplClaim['DATE_OF_BIRTH'] ?? '',
                    'hospital_name' => $fhplClaim['hospital_name'] ?? '',
                    'ailment' => $fhplClaim['AILMENT'] ?? '',
                    'date_of_admission' => $fhplClaim['date_of_admission'] ?? '',
                    'date_of_discharge' => $fhplClaim['DATE_OF_DISCHARGE'] ?? '',
                    'claim_document' => '',
                    'claim_amount' => $fhplClaim['claim_amount'] ?? '',
                ];

                $status = $fhplClaim['claim_status'] ?? '';
                if (in_array($status, ['Cashless Approved', 'Settled'])) {
                    $claimData['paid_amt'] = $fhplClaim['APPROVED_AMOUNT'] ?? '';
                    $claimData['deduction_reasons'] = $fhplClaim['DEDUCTION_REASONS'] ?? '';
                    $claimData['settlment_letter'] = $fhplClaim['Final Settlement Letter'] ?? '';
                    $claimData['claim_status'] = $status;
                } elseif ($status == 'Under Query') {
                    $claimData['last_query_reason'] = $fhplClaim['Deficiency Reason'] ?? '';
                    $claimData['query_letter'] = $fhplClaim['Query Letter'] ?? '';
                    $claimData['claim_status'] = 'Under Query';
                } elseif ($status == 'Repudiated') {
                    $claimData['rejection_date'] = $fhplClaim['CLAIM_REJECTION_DATE'] ?? '';
                    $claimData['rejection_reason'] = $fhplClaim['Reject Reason'] ?? '';
                    $claimData['claim_status'] = 'Rejected';
                }

                $claimData['tpa_claim_id'] = $fhplClaim['CLAIM_ID'] ?? '';
                $claimData['type_of_claim'] = $fhplClaim['TYPE_OF_CLAIM'] ?? '';
                $claimData['claim_mode'] = $fhplClaim['claim_type'] ?? '';

                $claims[] = $claimData;
            }
        }

        return $claims;
    }

    /**
     * Get Mediassist claims
     */
    private function getMediassistClaims($policy, $employee)
    {
        $claims = [];
        $data2 = json_encode([
            'policyNo' => $policy->policy_number,
            'employeeCode' => $employee->employees_code
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://apiintegration.mediassist.in/ClaimAPIServiceV2/ClaimService/ClaimDetail',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data2,
            CURLOPT_HTTPHEADER => [
                'Username: zoombroker',
                'Password: Zoom18Mx1IHgRdd90WQ',
                'Content-Type: application/json'
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('Mediassist Claim API', ['request' => $data2, 'response' => $response]);

        $response = json_decode($response);
        if (isset($response->isSuccess) && $response->isSuccess) {
            foreach ($response->claimsData as $mediClaim) {
                $downloadLetters = [];
                foreach ($mediClaim->documentdetails ?? [] as $doc) {
                    $downloadLetters[$doc->documentName] = $doc->documentdownloadURL;
                }

                $claims[] = [
                    'policy' => $policy,
                    'insurance_company' => $policy->insurance_company_name,
                    'tpa_company' => 'Mediassist',
                    'policy_number' => $mediClaim->policY_NUMBER ?? '',
                    'policy_name' => $policy->policy_name,
                    'employee_name' => $mediClaim->employeE_NAME ?? '',
                    'employee_id' => $employee->employees_code,
                    'patient_name' => $mediClaim->beneficiarY_NAME ?? '',
                    'patient_relation' => $mediClaim->relation ?? '',
                    'date_of_birth' => '',
                    'hospital_name' => $mediClaim->hospitaL_NAME ?? '',
                    'ailment' => '',
                    'date_of_admission' => $mediClaim->datE_OF_ADMISSION ?? '',
                    'date_of_discharge' => $mediClaim->datE_OF_DISCHARGE ?? '',
                    'claim_amount' => $mediClaim->finaL_BILL_AMOUNT ?? '',
                    'claim_document' => '',
                    'paid_amt' => $mediClaim->paiD_AMOUNT ?? '',
                    'deduction_reasons' => $mediClaim->deductioN_REASONS ?? '',
                    'query_letter' => $mediClaim->query_letterLink ?? '',
                    'settlment_letter' => $mediClaim->settlement_LetterLink ?? '',
                    'tpa_claim_id' => $mediClaim->tpA_HEALTH_ID ?? '',
                    'type_of_claim' => $mediClaim->typE_OF_CLAIM ?? '',
                    'claim_mode' => $mediClaim->typE_OF_CLAIM ?? '',
                    'claim_status' => $mediClaim->claim_Current_Status ?? '',
                    'download_letters' => $downloadLetters,
                ];
            }
        }

        return $claims;
    }

    /**
     * Get Safeway claims
     */
    private function getSafewayClaims($policy, $employee)
    {
        $claims = [];
        $data2 = json_encode([
            'Username' => 'AGSW4',
            'Password' => 'AGSW@4',
            'PolicyNo' => $policy->policy_number,
            'FromDate' => $policy->policy_start_date,
            'ToDate' => $policy->policy_end_date,
            'Empcode' => $employee->employees_code
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://brokerapi.safewaytpa.in/API/claimdata_employeewise',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data2,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('Safeway Claim API', ['request' => $data2, 'response' => $response]);

        $response = json_decode($response);
        if (isset($response->Data)) {
            foreach ($response->Data as $safeClaim) {
                $claims[] = [
                    'policy' => $policy,
                    'insurance_company' => $policy->insurance_company_name,
                    'tpa_company' => 'Safeway',
                    'policy_number' => $safeClaim->POLICY_NO ?? '',
                    'policy_name' => $policy->policy_name,
                    'employee_name' => $employee->full_name,
                    'employee_id' => $employee->employees_code,
                    'patient_name' => $safeClaim->PATIENT_NAME ?? '',
                    'patient_relation' => $safeClaim->PATIENT_RELATION ?? '',
                    'date_of_birth' => $safeClaim->PATIENT_DOB ?? '',
                    'hospital_name' => $safeClaim->HOSPITAL_NAME ?? '',
                    'ailment' => $safeClaim->AILMENT ?? '',
                    'date_of_admission' => $safeClaim->DATE_OF_ADMISSION ?? '',
                    'date_of_discharge' => $safeClaim->DATE_OF_DISCHARGE ?? '',
                    'claim_amount' => $safeClaim->CLAIM_AMOUNT ?? '',
                    'claim_document' => $safeClaim->Document ?? '',
                    'tpa_claim_id' => $safeClaim->CLAIM_ID ?? '',
                    'type_of_claim' => $safeClaim->CLAIM_TYPE ?? '',
                    'claim_status' => $safeClaim->CLAIM_STATUS ?? '',
                ];
            }
        }

        return $claims;
    }

    /**
     * Get Health India claims
     */
    private function getHealthIndiaClaims($policy, $employee)
    {
        $claims = [];
        $authToken = $this->getHealthIndiaAuthToken();
        if (!$authToken) {
            return $claims;
        }

        $postdata = json_encode([
            'ACCESS_TOKEN' => $authToken,
            'POLICY_NUMBER' => $policy->policy_number,
            'EMPLOYEE_NUMBER' => $employee->employees_code,
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://software.healthindiatpa.com/HiWebApi/ZOOM/GetClaimStatus',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $postdata,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        \Log::info('Health India Claim API', ['request' => $postdata, 'response' => $response]);

        $response = json_decode($response, true);
        if (isset($response['STATUS']) && $response['STATUS'] == "1" && $response['MESSAGE'] == "SUCCESS") {
            foreach ($response['RESULT'] as $healthIndiaClaim) {
                if (isset($healthIndiaClaim['FIR_Number'])) {
                    $claims[] = [
                        'policy' => $policy,
                        'insurance_company' => $policy->insurance_company_name,
                        'tpa_company' => 'Health India',
                        'policy_number' => $policy->policy_number,
                        'policy_name' => $policy->policy_name,
                        'employee_name' => $employee->full_name,
                        'employee_id' => $employee->employees_code,
                        'patient_name' => $healthIndiaClaim['Patient_Name'] ?? '',
                        'patient_relation' => $healthIndiaClaim['Relationship'] ?? '',
                        'date_of_birth' => '',
                        'hospital_name' => $healthIndiaClaim['Name_of_Hospital'] ?? '',
                        'ailment' => '',
                        'date_of_admission' => $healthIndiaClaim['Date_of_Admission_Probable_Date_of_Admission'] ?? '',
                        'date_of_discharge' => $healthIndiaClaim['Date_of_Discharge_Probable_Date_of_Discharge'] ?? '',
                        'claim_amount' => $healthIndiaClaim['Total_Amount_Claimed'] ?? '',
                        'claim_document' => $healthIndiaClaim['Claim_Document'] ?? '',
                        'query_letter' => $healthIndiaClaim['Query_Letter'] ?? '',
                        'paid_amt' => $healthIndiaClaim['Amount_Cleared'] ?? '',
                        'deduction_reasons' => $healthIndiaClaim['Deduction_Reasons'] ?? '',
                        'settlment_letter' => $healthIndiaClaim['Settlement_Letter'] ?? '',
                        'tpa_claim_id' => $healthIndiaClaim['FIR_Number'],
                        'type_of_claim' => $healthIndiaClaim['TYPE_OF_CLAIM'] ?? '',
                        'claim_mode' => $healthIndiaClaim['TYPE_OF_CLAIM'] ?? '',
                        'claim_status' => $healthIndiaClaim['CLAIM_STATUS'] ?? '',
                    ];
                }
            }
        }

        return $claims;
    }

    /**
     * Get EWA claims
     */
    private function getEwaClaims($policy, $employee)
    {
        $claims = [];
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://apiadmin.ewatpa.com/zoom/getClaimDetails',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode([
                'userName' => 'nipun.bansal@zoominsurancebrokers.com',
                'password' => 'Test@123',
                'policyNo' => $policy->policy_number,
                'empCode' => $employee->employees_code
            ]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $cleanedResponse = preg_replace('/^\)\]\}\',\s*/', '', $response);
        \Log::info('EWA Claim API', ['response' => $cleanedResponse]);

        $responseData = json_decode($cleanedResponse, true);
        if (isset($responseData['status']) && $responseData['status'] == 200 && !empty($responseData['body'])) {
            foreach ($responseData['body'] as $claimData) {
                $claims[] = [
                    'policy' => $policy,
                    'insurance_company' => $policy->insurance_company_name,
                    'tpa_company' => 'EWA',
                    'policy_number' => $policy->policy_number,
                    'policy_name' => $policy->policy_name,
                    'employee_name' => $employee->full_name,
                    'employee_id' => $employee->employees_code,
                    'patient_name' => $claimData['patient_name'] ?? '',
                    'patient_relation' => $claimData['patient_relation'] ?? '',
                    'date_of_birth' => '',
                    'hospital_name' => $claimData['hospital_name'] ?? '',
                    'ailment' => '',
                    'date_of_admission' => $claimData['date_of_admission'] ?? '',
                    'date_of_discharge' => $claimData['date_of_discharge'] ?? '',
                    'claim_amount' => $claimData['claim_amount'] ?? '',
                    'claim_document' => '',
                    'last_query_reason' => $claimData['last_query_reason'] ?? '',
                    'query_letter' => $claimData['query_letter'] ?? '',
                    'deduction_reasons' => $claimData['deduction_reasons'] ?? '',
                    'settlment_letter' => $claimData['settlment_letter'] ?? '',
                    'tpa_claim_id' => $claimData['tpa_claim_id'] ?? '',
                    'type_of_claim' => $claimData['type_of_claim'] ?? '',
                    'claim_mode' => $claimData['claim_mode'] ?? '',
                    'rejection_date' => $claimData['rejection_date'] ?? '',
                    'rejection_reason' => $claimData['rejection_reason'] ?? '',
                    'claim_status' => $claimData['claim_status'] ?? '',
                ];
            }
        }

        return $claims;
    }

    // Helper methods for auth tokens
    private function getIciciAuthToken($scope)
    {
        // Implement ICICI auth token logic
        return env('ICICI_AUTH_TOKEN', '');
    }

    private function getFhplAuthToken()
    {
        // Implement FHPL auth token logic
        return env('FHPL_AUTH_TOKEN', '');
    }

    private function getHealthIndiaAuthToken()
    {
        // Implement Health India auth token logic
        return env('HEALTH_INDIA_AUTH_TOKEN', '');
    }
}
