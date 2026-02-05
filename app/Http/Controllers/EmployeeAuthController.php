<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CompanyEmployee;
use App\Models\UserMaster;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMailJob;
use Illuminate\Support\Facades\Log;

class EmployeeAuthController extends Controller
{
    /**
     * Show employee login page
     */
    public function employeeLogin()
    {
        return Inertia::render('Employee/Login');
    }

    /**
     * Process employee login (send OTP to email)
     */
    public function processLogin(Request $request)
    {
        $request->validate([
            'login_type' => 'required|in:email,mobile,employee_code',
            'email' => 'required_if:login_type,email|email',
        ]);

        if ($request->login_type === 'email') {
            // Find employee by email with company details
            $employee = CompanyEmployee::with('company')
                ->where('email', $request->email)
                ->first();

            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found. Please contact your administrator.'
                ], 404);
            }

            // Check if employee is deleted
            if ($employee->is_delete == 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is deleted. You cannot log in.'
                ], 403);
            }

            // Check if employee is active
            if ($employee->is_active == 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is inactive. You cannot log in.'
                ], 403);
            }

            // Check if company exists
            if (!$employee->company) {
                return response()->json([
                    'success' => false,
                    'message' => 'Company not found. Please contact your administrator.'
                ], 404);
            }

            // Check if company is active
            if ($employee->company->status == 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your Company is now Inactive. You cannot log in.'
                ], 403);
            }

            // Generate 6-digit OTP
            $otp = sprintf("%06d", rand(0, 999999));
            
            // Store OTP in session with 10 minute expiry
            Session::put('employee_otp', $otp);
            Session::put('employee_otp_expires', now()->addMinutes(10));
            Session::put('employee_login_email', $request->email);
            Session::put('employee_id', $employee->id);

            // Send OTP via email
            try {
                Mail::raw("Your OTP for ZoomConnect Employee Portal is: {$otp}\n\nThis OTP will expire in 10 minutes.", function ($message) use ($request) {
                    $message->to($request->email)
                        ->subject('ZoomConnect Employee Portal - OTP Verification');
                });

                return response()->json([
                    'success' => true,
                    'message' => 'OTP sent successfully to your email.',
                    'require_otp' => true
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send employee OTP email: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send OTP. Please try again.'
                ], 500);
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'This login method is not yet implemented.'
        ], 400);
    }

    /**
     * Verify OTP and complete login
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:6'
        ]);

        $storedOtp = Session::get('employee_otp');
        $otpExpires = Session::get('employee_otp_expires');
        $email = Session::get('employee_login_email');
        $employeeId = Session::get('employee_id');

        if (!$storedOtp || !$otpExpires || !$email || !$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired. Please request a new OTP.'
            ], 400);
        }

        if (now()->greaterThan($otpExpires)) {
            Session::forget(['employee_otp', 'employee_otp_expires', 'employee_login_email', 'employee_id']);
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.'
            ], 400);
        }

        if ($request->otp != $storedOtp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP. Please try again.'
            ], 400);
        }

        // OTP is valid, create employee session
        $employee = CompanyEmployee::with(['company', 'location'])->find($employeeId);
        
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found.'
            ], 404);
        }

        // Double-check employee is still active and not deleted
        if ($employee->is_delete == 1) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is deleted. You cannot log in.'
            ], 403);
        }

        if ($employee->is_active == 0) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is inactive. You cannot log in.'
            ], 403);
        }

        // Check company status again
        if ($employee->company && $employee->company->status == 0) {
            return response()->json([
                'success' => false,
                'message' => 'Your Company is now Inactive. You cannot log in.'
            ], 403);
        }

        // Log the login attempt
        try {
            \DB::table('login_logs')->insert([
                'emp_id' => $employee->id,
                'comp_id' => $employee->company_id,
                'source' => 'WEB PORTAL',
                'created_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log employee login: ' . $e->getMessage());
        }

        // Clear OTP session data
        Session::forget(['employee_otp', 'employee_otp_expires', 'employee_login_email', 'employee_id']);

        // Set comprehensive employee session
        Session::put('employee_user', [
            'id' => $employee->id,
            'employee_code' => $employee->employees_code,
            'full_name' => $employee->full_name,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email' => $employee->email,
            'mobile' => $employee->mobile,
            'gender' => $employee->gender,
            'photo' => $employee->photo,
            'designation' => $employee->designation,
            'grade' => $employee->grade,
            'dob' => $employee->dob,
            'date_of_joining' => $employee->date_of_joining,
            'company_id' => $employee->company_id,
            'location_id' => $employee->location_id,
            'company_name' => $employee->company->comp_name ?? null,
            'company_code' => $employee->company->comp_code ?? null,
            'location_name' => $employee->location->location_name ?? null,
            'is_active' => $employee->is_active,
            'first_login' => $employee->first_login,
            'set_profile' => $employee->set_profile,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login successful!',
            'redirect' => route('employee.dashboard')
        ]);
    }

    /**
     * Logout employee
     */
    public function logout(Request $request)
    {
        Session::forget('employee_user');
        Session::flush();
        
        return redirect()->route('employee.login')->with('success', 'Logged out successfully.');
    }

    /**
     * Employee Dashboard
     */
    public function dashboard()
    {
        $employee = Session::get('employee_user');
        $employeeId = $employee['id'];
        
        // Get policies from policy_master with enrollment mapping
        $policies = \DB::select("
            SELECT 
                policy_master.*, 
                policy_enrollment_mapping_master.monthly_endorsement_id, 
                insurance_master.insurance_comp_icon_url, 
                insurance_master.insurance_company_name  
            FROM policy_master 
            INNER JOIN policy_enrollment_mapping_master ON policy_master.id = policy_enrollment_mapping_master.policy_id
            INNER JOIN insurance_master ON insurance_master.id = policy_master.ins_id 
            WHERE policy_enrollment_mapping_master.emp_id = ? 
            AND policy_enrollment_mapping_master.policy_issued = 1 
            AND policy_master.policy_status = 1 
            AND policy_master.policy_end_date >= CURDATE()
        ", [$employeeId]);

        // Get active employee policies with TPA data
        $newPolicies = $this->getActiveEmployeePolicies($employeeId);
        
        return Inertia::render('Employee/Dashboard', [
            'employee' => $employee,
            'policies' => $policies,
            'newPolicies' => $newPolicies
        ]);
    }

    /**
     * Employee Home
     */
    public function home()
    {
        $employee = Session::get('employee_user');
        
        return Inertia::render('Employee/Home', [
            'employee' => $employee
        ]);
    }

    /**
     * Employee Wellness
     */
    public function wellness()
    {
        $employee = Session::get('employee_user');
        
        // Fetch wellness services: company_id = 0 (for all) OR matches employee's company
        $wellnessServices = \App\Models\WellnessService::with(['vendor', 'category'])
            ->where(function($query) use ($employee) {
                $query->where('company_id', 0)
                      ->orWhere('company_id', $employee->comp_id ?? 0);
            })
            ->where('status', 1)
            ->get();
        
        // Fetch all active categories
        $categories = \App\Models\WellnessCategory::where('status', 1)
            ->orderBy('category_name')
            ->get();
        
        return Inertia::render('Employee/Wellness', [
            'employee' => $employee,
            'wellnessServices' => $wellnessServices,
            'categories' => $categories
        ]);
    }

    /**
     * Open Wellness Service - Handle redirects to external wellness platforms
     */
    public function openWellnessService($wellnessId)
    {
        $employee = Session::get('employee_user');
        
        if (!$employee) {
            return redirect()->route('employee.login')->with('error', 'Please login to access wellness services');
        }
        // Get the employee full details from database
        $employeeData = CompanyEmployee::with('company')->find($employee['id']);
        if (!$employeeData || !$employeeData->company) {
            return redirect()->route('employee.wellness')->with('error', 'Employee or company not found');
        }

        // Get active employee policies
        $newPolicies = $this->getActiveEmployeePolicies($employeeData->id);
        $policiesId = [];

        foreach ($newPolicies as $policy) {
            $policiesId[] = $policy->id;
        }

        // Only create MediBuddy user if employee has active policies
        if (!empty($policiesId)) {
            try {
                $this->createMediBuddyUser($employeeData);
            } catch (\Exception $e) {
                Log::error('MediBuddy user creation failed: ' . $e->getMessage());
                // Continue with redirect even if MediBuddy creation fails
            }
        }

        // Handle wellness service redirects based on ID
        $redirectUrl = $this->getWellnessRedirectUrl($wellnessId, $employeeData);
        
        if ($redirectUrl) {
            return redirect()->away($redirectUrl);
        }

        return redirect()->route('employee.wellness')->with('error', 'Invalid wellness service');
    }

    /**
     * Get wellness service redirect URL based on service ID
     */
    private function getWellnessRedirectUrl($wellnessId, $employeeData)
    {
        switch ((int) $wellnessId) {
            case 1:
                // Health Checks - Health Check Packages
                return $this->getMediBuddyUrl("/consumerPackages", $employeeData);

            case 2:
                // Lab Tests
                return $this->getMediBuddyUrl("/labTestsListing", $employeeData);

            case 3:
                // Talk to Doctor (Specialists) - Teleconsultation
                return $this->getMediBuddyUrl("https://doctor.medibuddy.in?entityId=11213503", $employeeData);

            case 4:
                // Medicine
                return $this->getMediBuddyUrl("/Medicine", $employeeData);

            case 5:
                // Book Dr. Appointment - Offline Consultation
                return $this->getMediBuddyUrl("/", $employeeData);

            case 6:
                // Health Risk Assessment
                return $this->getMediBuddyUrl("/", $employeeData);

            case 7:
                // Surgical Assistance
                return $this->getMediBuddyUrl("/surgery-care", $employeeData);

            case 8:
                // Condition Management Program
                return "https://form.typeform.com/to/OW68FVTC";

            case 9:
                // Maternity Care Program
                return "https://form.typeform.com/to/bXS7jS9B";

            case 11:
                // Additional service
                return "https://form.typeform.com/to/wtZCtJTx";

            default:
                return null;
        }
    }

    /**
     * Create MediBuddy user via API
     */
    private function createMediBuddyUser($employeeData)
    {
        $secretKey = '0BgexjtOb4aE3m09UMdP3z27ayo7tKgxs571X7oUwm9fGvIil3Q7F9iguqRIRegY4WvgSH7R0M91vxLXyndZRuwMeClp5w==';
        $url = 'https://bifrost-prod.medibuddy.in/sdk/user';

        // Generate the Auth token
        $authToken = $this->generateHmac($secretKey, $url);

        // Headers
        $headers = [
            'Content-Type: application/json',
            'corporateId: 11213503',
            'x-api-token: ' . $authToken
        ];

        // Create MediBuddy user payload
        $userData = [
            'memberId' => $employeeData->employees_code ?? $employeeData->id,
            'firstName' => $employeeData->first_name,
            'mobileNumber' => $employeeData->mobile,
            'emailId' => $employeeData->email,
            'dateOfBirth' => date('Y-m-d', strtotime($employeeData->dob)),
            'gender' => ucfirst(strtolower($employeeData->gender)),
            'grade' => "A",
            'policyId' => 3301001,
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'address' => 'Address',
            'pincode' => '560032',
            'relation' => 'Self'
        ];

        // Create MediBuddy user
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));

        $response = curl_exec($ch);

        if ($response === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \Exception('cURL Error: ' . $error);
        }

        curl_close($ch);
        
        return json_decode($response, true);
    }

    /**
     * Generate MediBuddy SSO URL with JWT token
     */
    private function getMediBuddyUrl($redirectPage, $employeeData)
    {
        $key = "ZCAP05H6LoKvbRRa/QkqLNMI7coomuaRyHzyg7nsrffqwrcfvhz4SzYh4Fqwjyi3KJHlSXKPwVu2+bXr6CtpgQ==";

        if ($redirectPage == 5 || $redirectPage == "/") {
            $redirectPage = "/";
        }

        $gender = strtoupper($employeeData->gender);
        if ($gender === 'MALE') {
            $genderCode = 'M';
        } elseif ($gender === 'FEMALE') {
            $genderCode = 'F';
        } else {
            $genderCode = '';
        }

        // Define payload
        $payload = [
            "Issuer" => "medibuddy",
            "EmailId" => $employeeData->email,
            "EntityId" => "11213503",
            "EmployeeId" => $employeeData->employees_code ?? $employeeData->id,
            "MobileNo" => $employeeData->mobile,
            "Name" => $employeeData->full_name,
            "Gender" => $genderCode,
            "dob" => date('Y-m-d', strtotime($employeeData->dob)),
            "Grade" => $employeeData->grade ?? 'A',
            "isVerified" => true,
            "isActive" => true,
            "VendorID" => "0",
            "FrontEndLandingRoute" => $redirectPage,
            "iat" => time(),
            "exp" => time() + 31536000 // 1 year expiry
        ];

        $token = $this->generateJwtToken($payload, $key);

        return "https://www.medibuddy.in/NonTPASSO?EntityId=11213503&MedibuddyToken=" . $token;
    }

    /**
     * Generate JWT Token for MediBuddy authentication
     */
    private function generateJwtToken($payload, $secretKey)
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $headerEncoded = $this->base64urlEncode(json_encode($header));
        $dataEncoded = $this->base64urlEncode(json_encode($payload));
        $signingInput = $headerEncoded . "." . $dataEncoded;

        $signature = hash_hmac('sha256', $signingInput, base64_decode($secretKey), true);
        $signatureEncoded = $this->base64urlEncode($signature);

        return $signingInput . "." . $signatureEncoded;
    }

    /**
     * Base64 URL-safe encoding
     */
    private function base64urlEncode($data)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    /**
     * Generate HMAC signature for API authentication
     */
    private function generateHmac($secretKey, $url)
    {
        return hash_hmac('sha256', $url, $secretKey);
    }

    /**
     * Get Care TPA Token
     */
    public function care_token2()
    {
        $curl = curl_init();
        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://api.careinsurance.com/relinterfacerestful/religare/secure/restful/generatePartnerToken',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => '{
                                            "partnerTokenGeneratorInputIO": {
                                                "partnerId": "95161",
                                                "securityKey": "dkpBQ0Q3cGVGb1NXVnNsWW1EaERWb0ErQVFyTGFhSytNZCtrVzdzRGtrOW1DWktaTDdwWHRWdVZoYnpyV1JseA=="
                                            }
                                        }',
                CURLOPT_HTTPHEADER => array(
                    'appId: 95161',
                    'Signature:jfcHY9AUIxhEQSN/hWPUe1CMLxmwOB+yj8VdXGNGrm8=',
                    'TimeStamp: 1636707591485',
                    'applicationCD: PARTNERAPP',
                    'Content-Type: application/json'
                ),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);
        $data = json_decode($response, true);

        if (isset($data['responseData']['status']) && $data['responseData']['status'] === "1" && isset($data['responseData']['message']) && $data['responseData']['message'] === "Success") {

            $tokenKey = $data['partnerTokenGeneratorInputIO']['listOfToken'][0]['tokenKey'] ?? '';
            $tokenValue = $data['partnerTokenGeneratorInputIO']['listOfToken'][0]['tokenValue'] ?? '';
            $sessionId = $data['partnerTokenGeneratorInputIO']['sessionId'] ?? '';

            $final_token = $this->encryptToken($tokenKey, $tokenValue);

            $final_result = array(
                'token' => $final_token,
                'session_id' => $sessionId,
            );

            return $final_result;
        }

        return null;
    }

    /**
     * Encrypt Care token (AES-256-CBC + base64)
     */
    private function encryptToken($tokenKey, $tokenValue, $aesSecretKey = 'z5yK1lw7XYt6YKdP7Pne2Jw3zRkMAziH', $aesInitVector = 'i0kbCAlFTlDXshYV')
    {
        $token = $tokenKey . '|' . $tokenValue;
        $encryptedToken = openssl_encrypt($token, 'aes-256-cbc', $aesSecretKey, 0, $aesInitVector);
        $base64EncodedToken = base64_encode($encryptedToken);
        return $base64EncodedToken;
    }

 
    /**
     * Employee Claims
     */
    public function claims()
    {
        $employee = Session::get('employee_user');
        
        return Inertia::render('Employee/Claims', [
            'employee' => $employee
        ]);
    }

    /**
     * Render Initiate Claim Page
     */
    public function initiateClaim()
    {
        return Inertia::render('Employee/InitiateClaim');
    }

    /**
     * Get Active GMI Policies for Claims
     */
    public function getActivePolicies()
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $employeeId = $employee['id'];

        // Get active GMI policies
        $policies = \DB::select("
            SELECT DISTINCT 
                policy_master.*, 
                policy_mapping_master.id AS mapping_id,
                insurance_master.insurance_company_name, 
                insurance_master.insurance_comp_icon_url, 
                tpa_master.tpa_company_name,
                tpa_master.id as tpa_id
            FROM policy_mapping_master 
            INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id 
            INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id 
            INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id 
            INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id 
            WHERE policy_mapping_master.status = 1 
            AND policy_endorsements.status = 1 
            AND policy_master.is_old = 0 
            AND policy_master.policy_type = 'gmi'
            AND policy_master.policy_end_date >= CURRENT_TIMESTAMP 
            AND policy_mapping_master.emp_id = ?
        ", [$employeeId]);

        return response()->json([
            'success' => true,
            'data' => $policies
        ]);
    }

    /**
     * Get Policy Dependents for Claims
     */
    public function getPolicyDependents(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'policy_id' => 'required|integer'
        ]);

        $policyId = $request->policy_id;
        $employeeId = $employee['id'];

        // Get policy details to determine TPA table
        $policy = \DB::table('policy_master')
            ->where('id', $policyId)
            ->first();

        if (!$policy) {
            return response()->json(['success' => false, 'message' => 'Policy not found'], 404);
        }

        // Get TPA configuration
        $tpaConfig = $this->getTpaTableConfig($policy->tpa_id);
        $tableName = $tpaConfig['table'] ?? null;
        $primaryKey = $tpaConfig['primary_key'] ?? null;

        if (!$tableName) {
            return response()->json(['success' => false, 'message' => 'TPA configuration not found'], 404);
        }

        try {
            // Get dependents with more flexible column selection
            $query = \DB::table($tableName)
                ->where('emp_id', $employeeId)
                ->where('policy_id', $policyId);
            
            // Check if endorsement columns exist
            $columns = \Schema::getColumnListing($tableName);
            if (in_array('addition_endorsement_id', $columns)) {
                $query->whereNotNull('addition_endorsement_id')
                      ->where('addition_endorsement_id', '!=', 0);
            }
            if (in_array('deletion_endorsement_id', $columns)) {
                $query->whereNull('deletion_endorsement_id');
            }
            
            // Select columns dynamically
            $selectColumns = [$primaryKey . ' as uhid'];
            if (in_array('insured_name', $columns)) $selectColumns[] = 'insured_name';
            if (in_array('dob', $columns)) $selectColumns[] = 'dob';
            if (in_array('gender', $columns)) $selectColumns[] = 'gender';
            if (in_array('relation', $columns)) $selectColumns[] = 'relation';
            if (in_array('policy_number', $columns)) $selectColumns[] = 'policy_number';
            
            $dependents = $query->select($selectColumns)->get();

            return response()->json([
                'success' => true,
                'data' => $dependents
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching dependents: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false, 
                'message' => 'Failed to fetch dependents: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit Claim
     */
    public function submitClaim(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'policy_id' => 'required|integer',
            'relation_name' => 'required|string',
            'policy_number' => 'required|string',
            'uhid_member_id' => 'required|string',
            'claim_type' => 'required|in:intimation,reimbursement',
            'date_of_admission' => 'required|date',
            'hospital_name' => 'required|string',
            'hospital_state' => 'required|string',
            'hospital_city' => 'required|string',
            'hospital_pin_code' => 'required|string',
            'diagnosis' => 'required|string',
            'claim_amount' => 'required|numeric',
            'relation_with_patient' => 'required|string',
            'mobile_no' => 'required|string',
            'email' => 'required|email',
            'date_of_discharge' => 'nullable|date',
            'emergency_contact_name' => 'nullable|string',
            'category' => 'nullable|string',
            'file_url' => 'nullable|string',
        ]);

        try {
            // Get policy details
            $policy = \DB::table('policy_master')
                ->where('id', $request->policy_id)
                ->first();

            if (!$policy) {
                return response()->json(['success' => false, 'message' => 'Policy not found'], 404);
            }

            // Save to ClaimData
            $claimData = new \App\Models\ClaimData();
            $claimData->emp_id = $employee['id'];
            $claimData->cmp_id = $employee['company_id'];
            $claimData->policy_id = $request->policy_id;
            $claimData->relation_name = $request->relation_name;
            $claimData->policy_number = $request->policy_number;
            $claimData->uhid_member_id = $request->uhid_member_id;
            $claimData->date_of_admission = $request->date_of_admission;
            $claimData->date_of_discharge = $request->date_of_discharge;
            $claimData->hospital_name = $request->hospital_name;
            $claimData->hospital_state = $request->hospital_state;
            $claimData->hospital_city = $request->hospital_city;
            $claimData->hospital_pin_code = $request->hospital_pin_code;
            $claimData->diagnosis = $request->diagnosis;
            $claimData->claim_amount = $request->claim_amount;
            $claimData->relation_with_patient = $request->relation_with_patient;
            $claimData->mobile_no = $request->mobile_no;
            $claimData->email = $request->email;
            $claimData->claim_type = $request->claim_type;
            $claimData->emergency_contact_name = $request->emergency_contact_name;
            $claimData->category = $request->category;
            $claimData->file_url = $request->file_url;
            $claimData->status = 'pending';
            $claimData->save();

            // Call TPA API based on TPA ID (only for intimation)
            if ($request->claim_type === 'intimation') {
                $tpaResponse = $this->initiateTpaClaim($policy, $request, $employee);
                
                if ($tpaResponse['success']) {
                    // Update claim data with TPA reference
                    $claimData->tpa_reference_number = $tpaResponse['reference_number'];
                    $claimData->status = 'submitted';
                    $claimData->save();

                    return response()->json([
                        'success' => true,
                        'message' => 'Claim intimated successfully! Reference No: ' . $tpaResponse['reference_number'],
                        'reference_number' => $tpaResponse['reference_number']
                    ]);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => $tpaResponse['message']
                    ], 400);
                }
            } else {
                // For reimbursement, just save the data
                return response()->json([
                    'success' => true,
                    'message' => 'Reimbursement claim submitted successfully! Your claim will be processed shortly.'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Claim submission error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit claim: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Initiate TPA Claim based on TPA ID
     */
    private function initiateTpaClaim($policy, $request, $employee)
    {
        $tpaId = $policy->tpa_id;

        switch ($tpaId) {
            case 62: // PHS
                return $this->initiatePHSClaim($policy, $request, $employee);
            
            case 69: // Care
                return $this->initiateCareClaim($policy, $request, $employee);
            
            case 70: // Health India
                return $this->initiateHealthIndiaClaim($policy, $request, $employee);
            
            case 64: // Go Digit
                return $this->initiateGoDigitClaim($policy, $request, $employee);
            
            case 71: // EWA
                return $this->initiateEWAClaim($policy, $request, $employee);
            
            case 73: // Ericson
                return $this->initiateEricsonClaim($policy, $request, $employee);
            
            case 63: // ICICI
                return $this->initiateICICIClaim($policy, $request, $employee);
            
            case 66: // FHPL
                return $this->initiateFHPLClaim($policy, $request, $employee);
            
            case 68: // Safeway
                return $this->initiateSafewayClaim($policy, $request, $employee);
            
            default:
                return [
                    'success' => false,
                    'message' => 'TPA not supported for online claim intimation. Please contact support.'
                ];
        }
    }

    /**
     * PHS Claim Intimation
     */
    private function initiatePHSClaim($policy, $request, $employee)
    {
        $maxAttempts = 10;
        $attempt = 0;

        do {
            $curl = curl_init();

            $data = json_encode([
                "USERNAME" => "ZOOM-ADMIN",
                "PASSWORD" => "ADMIN-USER@389",
                "PHM" => $request->uhid_member_id,
                "POLICY_NO" => $request->policy_number,
                "RELATION" => $request->relation_name,
                "NAME" => $request->relation_with_patient,
                "AILMENT" => $request->diagnosis,
                "CLAIM_AMOUNT" => $request->claim_amount,
                "DATE_OF_ADMISSION" => date('d M Y', strtotime($request->date_of_admission)),
                "NAME_OF_HOSPITAL" => $request->hospital_name,
                "NAME_OF_DOCTOR" => $request->emergency_contact_name ?? 'N/A',
                "MOBILE_NO" => $request->mobile_no,
                "EMAIL_ID" => $request->email,
                "CLAIM_TYPE" => "Cashless"
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/INTIMATE_CLAIM',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $data,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            $decoded = json_decode($response, true);
            
            if (isset($decoded['INTIMATE_CLAIMResult'][0])) {
                $result = $decoded['INTIMATE_CLAIMResult'][0];
                if ($result['STATUS'] === 'SUCCESS') {
                    return [
                        'success' => true,
                        'reference_number' => $result['CLAIM_INTIMATION_NUMBER']
                    ];
                }
            }

            $attempt++;
        } while ($attempt < $maxAttempts);

        return [
            'success' => false,
            'message' => 'Failed to connect to PHS server. Please try again later.'
        ];
    }

    /**
     * Care Claim Intimation
     */
    private function initiateCareClaim($policy, $request, $employee)
    {
        $tokenData = $this->care_token2();

        $postData = json_encode([
            'claimIntimationGenieIO' => [
                'caseID' => '1',
                'uhid' => $request->uhid_member_id,
                'providerID' => '51066825',
                'policyNumber' => $request->policy_number,
                'claimType' => '2',
                'patientName' => $request->relation_with_patient,
                'relationshipWithPatient' => $request->relation_name,
                'relationshipWithProposer' => $request->relation_name,
                'emergencyContactNo' => $request->mobile_no,
                'emergencyContactName' => $request->emergency_contact_name ?? 'N/A',
                'emergencyMailId' => $request->email,
                'firstReportedDate' => $request->date_of_admission,
                'initialDiagnosis' => $request->diagnosis,
                'doa' => $request->date_of_admission,
                'expectedDateOfDischarge' => $request->date_of_discharge ?? $request->date_of_admission,
                'estimatedAmount' => $request->claim_amount,
                'claimedAmount' => $request->claim_amount,
                'providerName' => $request->hospital_name,
                'address1' => "NA",
                'address2' => "NA",
                'state' => $request->hospital_state,
                'city' => $request->hospital_city,
                'pinCode' => $request->hospital_pin_code,
                'treatmentTypeID' => 19,
                'roomDetails' => [[
                    'fromDate' => "",
                    'toDate' => "",
                    'roomTypeID' => ""
                ]],
            ]
        ]);

        $apiHeader = [
            'appId: 95161',
            'signature: jfcHY9AUIxhEQSN/hWPUe1CMLxmwOB+yj8VdXGNGrm8=',
            'timestamp: 1636707591485',
            'sessionId:' . $tokenData['session_id'],
            'tokenId: ' . $tokenData['token'],
            'Content-Type: application/json',
            'applicationCD: PARTNERAPP'
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.careinsurance.com/relinterfacerestful/religare/secure/restful/preIntimateClaimGenie',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => $apiHeader
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response, true);

        if (isset($decoded['claimIntimationGenieIO']['claimIntimationGenieResponse']['data']['intimationNumber'])) {
            return [
                'success' => true,
                'reference_number' => $decoded['claimIntimationGenieIO']['claimIntimationGenieResponse']['data']['intimationNumber']
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Care server. Please try again later.'
        ];
    }

    /**
     * Health India Claim Intimation
     */
    private function initiateHealthIndiaClaim($policy, $request, $employee)
    {
        $authToken = $this->health_india_auth_token();

        $data = json_encode([
            "ACCESS_TOKEN" => $authToken,
            "AilmentDescription" => $request->diagnosis,
            "ContactNo" => $request->mobile_no,
            "DateOfAdmission" => $request->date_of_admission,
            "HospName" => $request->hospital_name,
            "HospAddress" => $request->hospital_city . ', ' . $request->hospital_state,
            "MEMBER_ID" => $request->uhid_member_id,
            "POLICY_NUMBER" => $request->policy_number
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://software.healthindiatpa.com/HiWebApi/ZOOM/IntimateClaimRequest',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json']
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response, true);

        if (isset($decoded['RESULT'][0]['CCN'])) {
            return [
                'success' => true,
                'reference_number' => $decoded['RESULT'][0]['CCN']
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Health India server. Please try again later.'
        ];
    }

    /**
     * Go Digit Claim Intimation
     */
    private function initiateGoDigitClaim($policy, $request, $employee)
    {
        $authToken = $this->go_digit_auth_token();

        $nameParts = explode(' ', $request->relation_with_patient, 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        $data = json_encode([
            "healthClaimsGMCClaimIntimation" => [
                "masterPolicyNumber" => $policy->policy_number,
                "policyNumber" => $request->policy_number,
                "claimType" => "Reimbursement",
                "sickPerson" => $request->uhid_member_id,
                "person" => [
                    "firstName" => $firstName,
                    "lastName" => $lastName,
                    "relationWithPH" => $request->relation_name,
                ],
                "typeOfTreatment" => "Already discharged",
                "callerDetails" => [
                    "callerEmailAddress" => $request->email,
                    "contactNumber" => $request->mobile_no,
                    "callerName" => $employee['full_name'],
                ],
                "hospitalizationDetails" => [
                    "dateOfAdmission" => date('d-m-Y H:i:s', strtotime($request->date_of_admission)),
                    "dateOfDischarge" => date('d-m-Y H:i:s', strtotime($request->date_of_discharge ?? $request->date_of_admission)),
                ],
                "hospitalDetails" => [
                    "pincode" => $request->hospital_pin_code,
                    "city" => $request->hospital_city,
                    "hospitalAddress" => $request->hospital_name,
                    "hospitalName" => $request->hospital_name,
                    "state" => $request->hospital_state,
                ],
                "claimDetails" => [
                    "incurredAmount" => $request->claim_amount,
                ],
            ]
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://oneapi.godigit.com/OneAPI/v1/executor',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => [
                'integrationId: 22507-0100',
                'Authorization: Bearer ' . $authToken,
                'Content-Type: application/json'
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response, true);

        if (isset($decoded['ListOfClaims'][0]['claimNumber'])) {
            return [
                'success' => true,
                'reference_number' => $decoded['ListOfClaims'][0]['claimNumber']
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Go Digit server. Please try again later.'
        ];
    }

    /**
     * EWA Claim Intimation
     */
    private function initiateEWAClaim($policy, $request, $employee)
    {
        $data = json_encode([
            "userName" => "nipun.bansal@zoominsurancebrokers.com",
            "password" => "Test@123",
            "tpaReferenceId" => $request->uhid_member_id,
            "policyNo" => $request->policy_number,
            "relation" => $request->relation_name,
            "name" => $request->relation_with_patient,
            "ailment" => $request->diagnosis,
            "claimAmount" => $request->claim_amount,
            "dateOfAdmission" => date('d-M-Y', strtotime($request->date_of_admission)),
            "nameOfhospital" => $request->hospital_name,
            "nameOfDoctor" => $request->emergency_contact_name ?? 'N/A',
            "mobile" => $request->mobile_no,
            "eMail" => $request->email,
            "claimType" => "Cashless"
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://apiadmin.ewatpa.com/zoom/claimintimtion',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $cleaned = preg_replace('/^\)\]\}\',\s*/', '', $response);
        $decoded = json_decode($cleaned);

        if (isset($decoded->body->claim_INTIMATION_NUMBER)) {
            return [
                'success' => true,
                'reference_number' => $decoded->body->claim_INTIMATION_NUMBER
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to EWA server. Please try again later.'
        ];
    }

    /**
     * Ericson Claim Intimation
     */
    private function initiateEricsonClaim($policy, $request, $employee)
    {
        $postData = http_build_query([
            "Username" => "ZOOM INSURANCE BROKERS PVT LTD",
            "Password" => "384",
            "CardId" => $request->uhid_member_id,
            "ClaimType_1ForCashless_2ForReImbursement" => "1",
            "Categry1ForMainClaim_2ForPrePostClaim" => "1",
            "AdmissionDate_DDMMYYYY" => date('dmY', strtotime($request->date_of_admission)),
            "DischargeDate_DDMMYYYY" => date('dmY', strtotime($request->date_of_discharge ?? $request->date_of_admission)),
            "LengthOfStay" => "1",
            "ClaimAmount" => $request->claim_amount,
            "Disease" => $request->diagnosis,
            "HospitalName" => $request->hospital_name,
            "HospitalAddress" => $request->hospital_city . ', ' . $request->hospital_state,
            "IntimationGivenBy" => $employee['full_name'],
            "ReltionWithPatient" => $request->relation_name,
            "ContactNo" => $request->mobile_no,
            "EmailId" => $request->email,
            "Remarks" => "NA"
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://sata.ericsontpa.com/SataServices/EricsonTpaServices.asmx/ClaimIntimation',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response);

        if (isset($decoded->data[0]->Msg)) {
            return [
                'success' => true,
                'reference_number' => $decoded->data[0]->Msg
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Ericson server. Please try again later.'
        ];
    }

    /**
     * ICICI Claim Intimation
     */
    private function initiateICICIClaim($policy, $request, $employee)
    {
        $authToken = $this->icici_auth_token('esbfetchclaimintimation');

        $postData = json_encode([
            "PolicyNumber" => $request->policy_number,
            "UHID" => $request->uhid_member_id,
            "DateOfAdmission" => $request->date_of_admission . 'T00:00:00',
            "DateOfDischarge" => ($request->date_of_discharge ?? $request->date_of_admission) . 'T00:00:00',
            "HospitalName" => $request->hospital_name,
            "HospitalState" => $request->hospital_state,
            "HospitalCity" => $request->hospital_city,
            "HospitalPinCode" => $request->hospital_pin_code,
            "IsNetworkHospital" => "No",
            "ReasonForAdmission" => $request->diagnosis,
            "Diagnosis" => $request->diagnosis,
            "TypeOfClaim" => "Member Reimbursement",
            "ClaimAmount" => $request->claim_amount,
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://janus.icicilombard.com/claims/ilservices/misc2/v1/claims/fetchclaimintimation',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $authToken
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response);

        if (isset($decoded->claimIntimationNumber)) {
            return [
                'success' => true,
                'reference_number' => $decoded->claimIntimationNumber
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to ICICI server. Please try again later.'
        ];
    }

    /**
     * FHPL Claim Intimation
     */
    private function initiateFHPLClaim($policy, $request, $employee)
    {
        $authToken = $this->fhpl_new_authentication_api();

        $data = json_encode([
            "Member_UHID" => $request->uhid_member_id,
            "Date_of_Admission" => date('d M Y', strtotime($request->date_of_admission)),
            "Policy_Number" => $request->policy_number,
            "Type_of_Claim" => 2,
            "Diagnosis" => $request->diagnosis,
            "Mobile_number" => $request->mobile_no,
            "Email_id" => $request->email,
            "Name_of_hospital" => $request->hospital_name,
            "Hospital_address" => $request->hospital_city . ', ' . $request->hospital_state,
            "HospitalID" => 0,
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://bconnect-api.fhpl.net/api/ClaimIntimation',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => [
                'Authorization: bearer ' . $authToken,
                'Content-Type: application/json'
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response);

        if (isset($decoded->IntimationID)) {
            return [
                'success' => true,
                'reference_number' => $decoded->IntimationID
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to FHPL server. Please try again later.'
        ];
    }

    /**
     * Safeway Claim Intimation
     */
    private function initiateSafewayClaim($policy, $request, $employee)
    {
        $data = json_encode([
            "Username" => "AGSW4",
            "Password" => "AGSW@4",
            "MemebercardID" => $request->uhid_member_id,
            "Ailment" => $request->diagnosis,
            "CliamAmount" => $request->claim_amount,
            "DOA" => $request->date_of_admission,
            "Hospitalname" => $request->hospital_name,
            "Mobileno" => $request->mobile_no,
            "Emailid" => $request->email,
            "Hospitaladdress" => $request->hospital_city . ', ' . $request->hospital_state,
            "Claimtype" => "cashless",
            "Hospitalcity" => $request->hospital_city,
            "Hospitalstate" => $request->hospital_state
        ]);

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://brokerapi.safewaytpa.in/api/Claimintimation',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $decoded = json_decode($response);

        if (isset($decoded->Refno)) {
            return [
                'success' => true,
                'reference_number' => $decoded->Refno
            ];
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Safeway server. Please try again later.'
        ];
    }

  
    /**
     * Employee Policy
     */
    public function policy()
    {
        $employee = Session::get('employee_user');
        $employeeId = $employee['id'];
        
        // Get policies from policy_master with enrollment mapping
        $policies = \DB::select("
            SELECT 
                policy_master.*, 
                policy_enrollment_mapping_master.monthly_endorsement_id, 
                insurance_master.insurance_comp_icon_url, 
                insurance_master.insurance_company_name  
            FROM policy_master 
            INNER JOIN policy_enrollment_mapping_master ON policy_master.id = policy_enrollment_mapping_master.policy_id
            INNER JOIN insurance_master ON insurance_master.id = policy_master.ins_id 
            WHERE policy_enrollment_mapping_master.emp_id = ? 
            AND policy_enrollment_mapping_master.policy_issued = 1 
            AND policy_master.policy_status = 1 
            AND policy_master.policy_end_date >= CURDATE()
        ", [$employeeId]);

        // Get active employee policies with TPA data
        $newPolicies = $this->getActiveEmployeePolicies($employeeId);
        
        return Inertia::render('Employee/Policy', [
            'employee' => $employee,
            'policies' => $policies,
            'newPolicies' => $newPolicies
        ]);
    }

    /**
     * Get active employee policies
     */
    private function getActiveEmployeePolicies($employeeId)
    {
        // Get distinct TPA table names
        $tpaTables = \DB::select("
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
            AND policy_mapping_master.emp_id = ?
        ", [$employeeId]);

        $policiesData = [];
        foreach ($tpaTables as $tpaTable) {
            $tableName = $tpaTable->tpa_table_name;
            try {
                $policies = \DB::select("
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
                    JOIN {$tableName} ON {$tableName}.mapping_id = policy_mapping_master.id 
                    WHERE policy_mapping_master.status = 1 
                    AND policy_endorsements.status = 1 
                    AND policy_master.is_old = 0 
                    AND policy_master.policy_end_date >= CURRENT_TIMESTAMP 
                    AND policy_mapping_master.emp_id = ? 
                    AND {$tableName}.addition_endorsement_id IS NOT NULL 
                    AND {$tableName}.deletion_endorsement_id IS NULL 
                    AND {$tableName}.updation_endorsement_id IS NULL 
                    AND {$tableName}.addition_endorsement_id != 0
                ", [$employeeId]);

                // Get cover details for GMI policies
                foreach ($policies as $policy) {
                    if ($policy->policy_type === 'gmi') {
                        $coverDetails = \DB::select("
                            SELECT 
                                CONCAT_WS(
                                    ' | ',
                                    IF(base_sum > 0, CONCAT('₹', FORMAT(base_sum, 0)), NULL),
                                    IF(topup_sum > 0, CONCAT('Top Up ₹', FORMAT(topup_sum, 0)), NULL),
                                    IF(parent_sum > 0, CONCAT('Parents ₹', FORMAT(parent_sum, 0)), NULL),
                                    IF(parent_in_law_sum > 0, CONCAT('In-laws ₹', FORMAT(parent_in_law_sum, 0)), NULL)
                                ) AS cover_string,
                                base_sum, topup_sum, parent_sum, parent_in_law_sum
                            FROM (
                                SELECT
                                    (SELECT SUM(base_sum_insured) FROM {$tableName}
                                    WHERE cmp_id = ? AND policy_id = ?
                                    AND emp_id = ? AND mapping_id = ?
                                    AND addition_endorsement_id != 0
                                    AND deletion_endorsement_id IS NULL) AS base_sum,
                                    (SELECT SUM(topup_sum_insured) FROM {$tableName}
                                    WHERE cmp_id = ? AND policy_id = ?
                                    AND emp_id = ? AND mapping_id = ?) AS topup_sum,
                                    (SELECT SUM(parent_sum_insured) FROM {$tableName}
                                    WHERE cmp_id = ? AND policy_id = ?
                                    AND emp_id = ? AND mapping_id = ?) AS parent_sum,
                                    (SELECT SUM(parent_in_law_sum_insured) FROM {$tableName}
                                    WHERE cmp_id = ? AND policy_id = ?
                                    AND emp_id = ? AND mapping_id = ?) AS parent_in_law_sum
                            ) AS sums
                        ", [
                            $policy->comp_id, $policy->id, $policy->emp_id, $policy->mapping_id,
                            $policy->comp_id, $policy->id, $policy->emp_id, $policy->mapping_id,
                            $policy->comp_id, $policy->id, $policy->emp_id, $policy->mapping_id,
                            $policy->comp_id, $policy->id, $policy->emp_id, $policy->mapping_id
                        ]);
                        
                        if (!empty($coverDetails)) {
                            $policy->cover_string = $coverDetails[0]->cover_string;
                            $policy->base_sum = $coverDetails[0]->base_sum;
                        }
                    }
                }

                $policiesData = array_merge($policiesData, $policies);
            } catch (\Exception $e) {
                Log::error('Error fetching policies from table ' . $tableName . ': ' . $e->getMessage());
            }
        }

        return $policiesData;
    }

    /**
     * Employee Help
     */
    public function help()
    {
        $employee = Session::get('employee_user');
        
        return Inertia::render('Employee/Help', [
            'employee' => $employee
        ]);
    }

    /**
     * Get FAQs
     */
    public function getFaqs()
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $faqs = \DB::table('faq_master')
            ->where('is_active', 1)
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'faq_title as question',
                'faq_description as answer',
                'created_at'
            ]);

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Get Employee Support Tickets
     */
    public function getTickets()
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $tickets = \DB::table('help_support_chats')
            ->where('emp_id', $employee['id'])
            ->where('cmp_id', $employee['company_id'])
            ->whereNotNull('ticket_id')
            ->select(
                'ticket_id',
                'message',
                'status',
                'is_resolved',
                'created_at',
                'updated_at'
            )
            ->groupBy('ticket_id')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($ticket) {
                // Get message count for each ticket
                $messageCount = \DB::table('help_support_chats')
                    ->where('ticket_id', $ticket->ticket_id)
                    ->count();

                return [
                    'ticket_id' => $ticket->ticket_id,
                    'subject' => $ticket->message,
                    'status' => $ticket->status ?? 'open',
                    'is_resolved' => (bool) $ticket->is_resolved,
                    'message_count' => $messageCount,
                    'created_at' => $ticket->created_at,
                    'updated_at' => $ticket->updated_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    /**
     * Create New Support Ticket
     */
    public function createTicket(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Generate unique ticket ID
        do {
            $ticketId = 'TKT-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(5));
        } while (\DB::table('help_support_chats')->where('ticket_id', $ticketId)->exists());

        // Create initial ticket message
        $ticketData = [
            'ticket_id' => $ticketId,
            'emp_id' => $employee['id'],
            'cmp_id' => $employee['company_id'],
            'sender_type' => 'employee',
            'message' => $request->subject . '\n\n' . $request->message,
            'status' => 'open',
            'is_resolved' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        \DB::table('help_support_chats')->insert($ticketData);

        // Track status
        \DB::table('help_support_status_tracker')->insert([
            'ticket_id' => $ticketId,
            'old_status' => null,
            'new_status' => 'open',
            'changed_by' => $employee['id'],
            'remarks' => 'Ticket created',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Support ticket created successfully',
            'data' => [
                'ticket_id' => $ticketId
            ]
        ]);
    }

    /**
     * Get Ticket Details and Chat History
     */
    public function getTicketDetails($ticketId)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Verify ticket belongs to employee
        $ticket = \DB::table('help_support_chats')
            ->where('ticket_id', $ticketId)
            ->where('emp_id', $employee['id'])
            ->where('cmp_id', $employee['company_id'])
            ->first();

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Ticket not found'], 404);
        }

        // Get all messages for this ticket
        $messages = \DB::table('help_support_chats')
            ->where('ticket_id', $ticketId)
            ->orderBy('created_at', 'asc')
            ->get([
                'id',
                'sender_type',
                'message',
                'created_at'
            ]);

        // Get status history
        $statusHistory = \DB::table('help_support_status_tracker')
            ->where('ticket_id', $ticketId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'ticket_id' => $ticket->ticket_id,
                'status' => $ticket->status,
                'is_resolved' => (bool) $ticket->is_resolved,
                'messages' => $messages,
                'status_history' => $statusHistory,
            ]
        ]);
    }

    /**
     * Add Message to Ticket
     */
    public function addTicketMessage(Request $request, $ticketId)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'message' => 'required|string',
        ]);

        // Verify ticket belongs to employee
        $ticket = \DB::table('help_support_chats')
            ->where('ticket_id', $ticketId)
            ->where('emp_id', $employee['id'])
            ->where('cmp_id', $employee['company_id'])
            ->first();

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Ticket not found'], 404);
        }

        // Add new message
        \DB::table('help_support_chats')->insert([
            'ticket_id' => $ticketId,
            'emp_id' => $employee['id'],
            'cmp_id' => $employee['company_id'],
            'sender_type' => 'employee',
            'message' => $request->message,
            'status' => $ticket->status,
            'is_resolved' => $ticket->is_resolved,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message added successfully'
        ]);
    }

    /**
     * Get chatbot conversations for employee
     */
    public function getChatbotConversations(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Get all chatbot conversations with message count
        $conversations = \DB::table('chatbot_conversations')
            ->select('id', 'conversation_id', 'current_state', 'is_completed', 'created_at', 'updated_at')
            ->selectRaw('(SELECT COUNT(*) FROM chatbot_messages WHERE chatbot_messages.conversation_id = chatbot_conversations.conversation_id) as message_count')
            ->where('emp_id', $employee['id'])
            ->where('cmp_id', $employee['company_id'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'conversations' => $conversations
        ]);
    }

    /**
     * Start a new chatbot conversation
     */
    public function startChatbot(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Generate unique conversation ID
        $conversationId = 'CHAT-' . date('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(6));

        // Create conversation record
        \DB::table('chatbot_conversations')->insert([
            'conversation_id' => $conversationId,
            'emp_id' => $employee['id'],
            'cmp_id' => $employee['company_id'],
            'current_state' => 'start',
            'is_completed' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Get initial chatbot message
        $chatbotFlow = \App\Services\ChatbotFlowService::getNextStep('start');

        // Save bot message
        \DB::table('chatbot_messages')->insert([
            'conversation_id' => $conversationId,
            'sender_type' => 'bot',
            'message' => $chatbotFlow['message'],
            'options' => json_encode($chatbotFlow['options']),
            'state' => 'start',
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'conversation_id' => $conversationId,
            'message' => $chatbotFlow['message'],
            'options' => $chatbotFlow['options'],
            'show_thank_you' => $chatbotFlow['show_thank_you'] ?? false,
        ]);
    }

    /**
     * Process chatbot response
     */
    public function chatbotRespond(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'conversation_id' => 'required|string',
            'selected_option' => 'required|string',
        ]);

        // Get conversation
        $conversation = \DB::table('chatbot_conversations')
            ->where('conversation_id', $request->conversation_id)
            ->where('emp_id', $employee['id'])
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Save user selection
        \DB::table('chatbot_messages')->insert([
            'conversation_id' => $request->conversation_id,
            'sender_type' => 'user',
            'message' => $request->selected_option,
            'state' => $conversation->current_state,
            'created_at' => now(),
        ]);

        // Get next step
        $nextStep = \App\Services\ChatbotFlowService::getNextStep($conversation->current_state, $request->selected_option);

        if (isset($nextStep['error'])) {
            return response()->json(['success' => false, 'message' => $nextStep['message']], 400);
        }

        // Update conversation state
        \DB::table('chatbot_conversations')
            ->where('conversation_id', $request->conversation_id)
            ->update([
                'current_state' => $nextStep['state'],
                'is_completed' => $nextStep['show_thank_you'] ?? false,
                'updated_at' => now(),
            ]);

        // Save bot response
        \DB::table('chatbot_messages')->insert([
            'conversation_id' => $request->conversation_id,
            'sender_type' => 'bot',
            'message' => $nextStep['message'],
            'options' => json_encode($nextStep['options']),
            'state' => $nextStep['state'],
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => $nextStep['message'],
            'options' => $nextStep['options'],
            'show_thank_you' => $nextStep['show_thank_you'] ?? false,
            'state' => $nextStep['state'],
        ]);
    }

    /**
     * Get single chatbot conversation with all messages
     */
    public function getChatbotConversation($conversationId)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Get conversation
        $conversation = \DB::table('chatbot_conversations')
            ->where('conversation_id', $conversationId)
            ->where('emp_id', $employee['id'])
            ->first();

        if (!$conversation) {
            return response()->json(['success' => false, 'message' => 'Conversation not found'], 404);
        }

        // Get all messages
        $messages = \DB::table('chatbot_messages')
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'conversation' => $conversation,
            'messages' => $messages
        ]);
    }

    /**
     * Network Hospitals Page
     */
    public function networkHospitals(Request $request, $encodedPolicyId)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return redirect()->route('employee.login');
        }

        // Decode policy ID
        $policyId = base64_decode($encodedPolicyId);

        // Get policy details
        $policy = \DB::table('policy_master')
            ->where('id', $policyId)
            ->where('is_active', 1)
            ->first();

        if (!$policy) {
            return redirect()->route('employee.policy')->with('error', 'Policy not found');
        }

        // Get insurance company details
        $insuranceCompany = \DB::table('insurance_master')
            ->where('id', $policy->ins_id)
            ->first();

        // Get search options (states/cities or pincode message)
        $searchOptions = $this->getNetworkHospitalSearchOptions($policy);

        return Inertia::render('Employee/NetworkHospitals', [
            'employee' => $employee,
            'policy' => [
                'id' => $policy->id,
                'policy_number' => $policy->policy_number,
                'policy_name' => $policy->policy_name ?? $policy->corporate_policy_name,
                'tpa_id' => $policy->tpa_id,
            ],
            'insurance_company' => [
                'name' => $insuranceCompany->insurance_company_name ?? 'N/A',
                'logo' => $insuranceCompany->insurance_comp_icon_url ?? null,
            ],
            'searchType' => $searchOptions['search_type'],
            'searchOptions' => $searchOptions['search_options'],
        ]);
    }

    /**
     * Search Network Hospitals
     */
    public function networkHospitalsSearch(Request $request)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'policy_id' => 'required|integer',
            'pincode' => 'nullable|string|max:6',
            'state' => 'nullable|string',
            'city' => 'nullable|string',
        ]);

        $policyId = $request->policy_id;
        $pincode = $request->pincode;
        $state = $request->state;
        $city = $request->city;

        // Get policy details
        $policy = \DB::table('policy_master')
            ->where('id', $policyId)
            ->where('is_active', 1)
            ->first();

        if (!$policy) {
            return response()->json(['success' => false, 'message' => 'Policy not found'], 404);
        }

        $tpaId = $policy->tpa_id;

        // Get TPA configuration
        $tpaConfig = $this->getNetworkHospitalTableConfig($tpaId);

        if (!$tpaConfig) {
            return response()->json(['success' => false, 'message' => 'TPA configuration not found'], 404);
        }

        // Handle PHS TPA (external API)
        if ($tpaId == 62) {
            if (!$pincode) {
                return response()->json(['success' => false, 'message' => 'Pincode is required for this TPA'], 400);
            }

            $hospitals = $this->getPhsNetworkHospitals($policy, $pincode);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'hospitals' => $hospitals,
                    'total_hospitals' => count($hospitals),
                ]
            ]);
        }

        // Search from database
        $query = \DB::table($tpaConfig['table'])
            ->where($tpaConfig['columns']['policy_id'], $policyId);

        if ($pincode) {
            $query->where($tpaConfig['columns']['pincode'], 'LIKE', "%{$pincode}%");
        } else {
            if ($state) {
                $query->where($tpaConfig['columns']['state'], $state);
            }
            if ($city) {
                $query->where($tpaConfig['columns']['city'], $city);
            }
        }

        $hospitals = $query->limit(500)->get();

        // Standardize response
        $standardizedHospitals = $this->standardizeNetworkHospitalResponse($hospitals, $tpaConfig);

        return response()->json([
            'success' => true,
            'data' => [
                'hospitals' => $standardizedHospitals,
                'total_hospitals' => count($standardizedHospitals),
            ]
        ]);
    }

    /**
     * Get search options for network hospitals
     */
    private function getNetworkHospitalSearchOptions($policy)
    {
        $tpaId = $policy->tpa_id;

        // PHS TPA uses external API - pincode only
        if ($tpaId == 62) {
            return [
                'search_type' => 'pincode_only',
                'search_options' => null,
            ];
        }

        // Get TPA configuration
        $tpaConfig = $this->getNetworkHospitalTableConfig($tpaId);

        if (!$tpaConfig) {
            return [
                'search_type' => 'state_city_or_pincode',
                'search_options' => ['states' => []],
            ];
        }

        // Get unique states with their cities
        $states = \DB::table($tpaConfig['table'])
            ->select($tpaConfig['columns']['state'], $tpaConfig['columns']['city'])
            ->where($tpaConfig['columns']['policy_id'], $policy->id)
            ->whereNotNull($tpaConfig['columns']['state'])
            ->where($tpaConfig['columns']['state'], '!=', '')
            ->distinct()
            ->get()
            ->groupBy($tpaConfig['columns']['state'])
            ->map(function ($cities, $state) use ($tpaConfig) {
                return [
                    'state' => $state,
                    'cities' => $cities->pluck($tpaConfig['columns']['city'])->unique()->filter()->values()->toArray()
                ];
            })
            ->values()
            ->toArray();

        return [
            'search_type' => 'state_city_or_pincode',
            'search_options' => ['states' => $states],
        ];
    }

    private function getNetworkHospitalTableConfig($tpaId)
    {
        $configs = [
            62 => null, // PHS-API based
            63 => [ // ICICI
                'table' => 'icici_lombard_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'hospital_name',
                    'address_line_1' => 'address',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pincode',
                    'phone' => 'contact_no',
                ]
            ],
            65 => [ // Vidal
                'table' => 'vidal_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'hospital_name',
                    'address_line_1' => 'address_line_1',
                    'address_line_2' => 'address_line_2',
                    'city' => 'city_name',
                    'state' => 'state_name',
                    'pincode' => 'pincode',
                    'phone' => 'phone_number',
                    'email' => 'email',
                    'hospital_type' => 'hospital_type',
                ]
            ],
            66 => [ // FHPL
                'table' => 'fhpl_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'provider_name',
                    'address_line_1' => 'address',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pincode',
                    'phone' => 'contact_no',
                ]
            ],
            67 => [ // Mediassist
                'table' => 'mediassist_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'hospitaL_NAME',
                    'address_line_1' => 'addresS1',
                    'address_line_2' => 'addresS2',
                    'city' => 'citY_NAME',
                    'state' => 'statE_NAME',
                    'pincode' => 'piN_CODE',
                    'phone' => 'phonE_NO',
                    'email' => 'emaiL_ID',
                    'landmark' => 'landmarK1',
                    'location' => 'locatioN1',
                ]
            ],
            68 => [ // Safeway
                'table' => 'safeway_new_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'Name',
                    'address_line_1' => 'Address',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pincode',
                ]
            ],
            69 => [ // Care
                'table' => 'care_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'hospital_name',
                    'address_line_1' => 'address',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pincode',
                    'phone' => 'phone',
                ]
            ],
            71 => [ // EWA
                'table' => 'ewa_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'provider_name',
                    'address_line_1' => 'address',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pincode',
                ]
            ],
            73 => [ // Ericson
                'table' => 'ericson_network_hospitals',
                'columns' => [
                    'policy_id' => 'policy_id',
                    'hospital_name' => 'hospital_name',
                    'address_line_1' => 'address_1',
                    'address_line_2' => 'address_2',
                    'city' => 'city',
                    'state' => 'state',
                    'pincode' => 'pin_code',
                    'phone' => 'phone_number',
                    'email' => 'email_id',
                ]
            ],
        ];

        return $configs[$tpaId] ?? null;
    }

    /**
     * Standardize hospital response
     */
    private function standardizeNetworkHospitalResponse($hospitals, $tpaConfig)
    {
        $standardized = [];

        foreach ($hospitals as $hospital) {
            $item = [];

            foreach ($tpaConfig['columns'] as $standardKey => $dbColumn) {
                $item[$standardKey] = $hospital->{$dbColumn} ?? null;
            }

            $standardized[] = $item;
        }

        return $standardized;
    }

    /**
     * Get PHS Network Hospitals from external API
     */
    private function getPhsNetworkHospitals($policy, $pincode)
    {
        // Implement PHS API call here
        // For now, return empty array
        return [];
    }

    /**
     * Get Policy Details
     */
    public function policyDetails(Request $request, $encodedPolicyId)
    {
        $employee = Session::get('employee_user');

        if (!$employee) {
            return redirect()->route('employee.login');
        }

        try {
            // Decode policy ID
            $policyId = base64_decode($encodedPolicyId);

            // Get policy details
            $policy = \DB::table('policy_master')
                ->where('id', $policyId)
                ->where('is_active', 1)
                ->first();

            if (!$policy) {
                return redirect()->route('employee.policy')->with('error', 'Policy not found');
            }

            // Check if employee's company matches policy company
            if ($policy->comp_id != $employee['company_id']) {
                return redirect()->route('employee.policy')->with('error', 'Unauthorized access to this policy');
            }

            // Get insurance company details
            $insuranceCompany = \DB::table('insurance_master')
                ->where('id', $policy->ins_id)
                ->first();

            // Get TPA company details
            $tpaCompany = \DB::table('tpa_master')
                ->where('id', $policy->tpa_id)
                ->first();

            // Get policy mapping data
            $mappingData = \DB::table('policy_mapping_master')
                ->where('policy_id', $policy->id)
                ->where('emp_id', $employee['id'])
                ->where('cmp_id', $employee['company_id'])
                ->where('status', 1)
                ->first();

            if (!$mappingData) {
                return redirect()->route('employee.policy')->with('error', 'No policy mapping found');
            }

            // Get TPA table data
            $tableData = $this->getPolicyTableDataForEmployee($policy, $employee, $mappingData);

            // Get policy features (inclusion / exclusion)
            $policyFeatures = ['inclusion' => [], 'exclusion' => []];
            try {
                $rows = \DB::table('policy_feature')
                    ->where('policy_id', $policy->id)
                    ->where('is_active', 1)
                    ->get();

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
                        $policyFeatures['inclusion'][] = $item;
                    }
                }
            } catch (\Exception $e) {
                Log::error('Failed to fetch policy features: ' . $e->getMessage());
            }

            // Get escalation matrix
            $escalationMatrix = [];
            try {
                $escalationRows = \DB::table('escalation_matrix')
                    ->where('policy_id', $policy->id)
                    ->get();

                // Enrich escalation matrix with user details from escalation_users
                if ($escalationRows && $escalationRows->isNotEmpty()) {
                    $userIds = [];
                    foreach ($escalationRows as $row) {
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
                        $escalationUsers = \DB::table('escalation_users')
                            ->whereIn('id', $userIds)
                            ->get()
                            ->keyBy('id')
                            ->toArray();
                    }

                    $escalationMatrix = $escalationRows->map(function ($row) use ($escalationUsers) {
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
                }
            } catch (\Exception $e) {
                Log::error('Failed to enrich escalation matrix: ' . $e->getMessage());
            }
            // Prepare response data
            $policyDetails = [
                'policy' => $policy,
                'insurance_company' => [
                    'id' => $insuranceCompany->id ?? null,
                    'name' => $insuranceCompany->insurance_company_name ?? 'N/A',
                    'logo' => $insuranceCompany->insurance_comp_icon_url ?? null,
                ],
                'tpa_company' => [
                    'id' => $tpaCompany->id ?? null,
                    'name' => $tpaCompany->tpa_company_name ?? 'N/A',
                ],
                'mapping' => [
                    'id' => $mappingData->id,
                    'addition_endorsement_id' => $mappingData->addition_endorsement_id ?? null,
                ],
                'tpa_data' => $tableData['tpa_data'] ?? null,
                'dependents' => $tableData['dependents'] ?? [],
                'cover_summary' => $tableData['cover_str'] ?? 'No coverage information available',
                'policy_features' => $policyFeatures,
                'escalation_matrix' => $escalationMatrix,
            ];

            return Inertia::render('Employee/PolicyDetail', [
                'employee' => $employee,
                'policyDetails' => $policyDetails
            ]);

        } catch (\Exception $e) {
            Log::error('Get policy details error: ' . $e->getMessage());
            return redirect()->route('employee.policy')->with('error', 'Failed to retrieve policy details');
        }
    }

    /**
     * Get TPA-specific table data based on policy configuration
     */
    private function getPolicyTableDataForEmployee($policy, $employee, $mappingData)
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
            $tableName = $tpaConfig['table'] ?? null;
            $primaryKey = $tpaConfig['primary_key'] ?? null;
        }

        // If no valid table found, return empty
        if (!$tableName) {
            return $result;
        }

        try {
            // Get main TPA data
            $result['tpa_data'] = \DB::table($tableName)
                ->where('policy_id', $policy->id)
                ->where('emp_id', $employee['id'])
                ->first();

            // Get dependents with standardized uhid field
            $dependents = \DB::table($tableName)
                ->select($primaryKey, 'insured_name', 'dob', 'gender', 'relation')
                ->where('emp_id', $employee['id'])
                ->where('policy_id', $policy->id)
                ->whereNotNull('addition_endorsement_id')
                ->where('addition_endorsement_id', '!=', 0)
                ->get();

            // Map primary key to standardized 'uhid' field
            $result['dependents'] = $dependents->map(function($dependent) use ($primaryKey) {
                $arr = (array) $dependent;
                $arr['uhid'] = $arr[$primaryKey] ?? null;
                return (object) $arr;
            });

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

            $coverResult = \DB::select($coverQuery, [
                $employee['company_id'],
                $policy->id,
                $employee['id'],
                $mappingData->id,
                $mappingData->addition_endorsement_id ?? 0
            ]);

            $result['cover_str'] = $coverResult[0]->output_string ?? '';
        } catch (\Exception $e) {
            Log::error('Error fetching TPA table data: ' . $e->getMessage());
        }

        return $result;
    }

    /**
     * Get TPA table configuration (table name and primary key)
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
        
        return $tpaMapping[$tpaId] ?? ['table' => null, 'primary_key' => null];
    }

    /**
     * Download E-Card based on TPA
     */
    public function downloadECard(Request $request)
    {
        $employee = Session::get('employee_user');
        
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        try {
            $request->validate([
                'policy_id' => 'required|integer',
                'uhid' => 'nullable|string',
                'dob' => 'nullable|date'
            ]);

            // Get policy details
            $policy = \DB::table('policy_master')
                ->where('id', $request->policy_id)
                ->first();

            if (!$policy) {
                return response()->json([
                    'success' => false,
                    'message' => 'Policy not found'
                ], 404);
            }

            // Get employee code
            $employeeData = \DB::table('company_employees')
                ->where('id', $employee['id'])
                ->first();

            if (!$employeeData) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee data not found'
                ], 404);
            }

            $data = [
                'policy' => $policy,
                'employee' => $employeeData,
                'emp_id' => $employeeData->employees_code ?? $employee['employee_code'],
                'policy_number' => $policy->policy_number,
                'dob' => $request->dob ?? $employeeData->dob,
                'uhid' => $request->uhid,
                'policy_start_date' => $policy->policy_start_date ?? null,
                'policy_end_date' => $policy->policy_end_date ?? null,
            ];

            // Route to appropriate TPA download method
            switch ($policy->tpa_id) {
                case 60:
                    return $this->demo_new_download_e_card($data);
                    
                case 62:
                    return $this->phs_download_e_card($data);
                    
                case 63:
                    return $this->icici_download_e_card($data);
                    
                case 64:
                    return $this->go_digit_download_e_card($data);
                    
                case 65:
                    return $this->vidal_new_download_e_card($data);
                    
                case 66:
                    return $this->fhpl_new_download_e_card($data);
                    
                case 67:
                    return $this->mediassist_download_e_card($data);
                    
                case 68:
                    return $this->safeway_download_e_card($data);
                    
                case 69:
                    return $this->care_download_e_card($data);
                    
                case 70:
                    return $this->health_india_download_e_card($data);
                    
                case 71:
                    return $this->ewa_download_e_card($data);
                    
                case 72:
                    return $this->sbi_download_e_card($data);
                    
                case 73:
                    return $this->ericson_download_e_card($data);
                    
                case 74:
                    return $this->future_generali_download_e_card($data);
                    
                case 75:
                    return $this->ab_download_e_card($data);
                    
                case 76:
                    return $this->iffco_download_e_card($data);
                    
                case 77:
                    return $this->reliance_download_e_card($data);
                    
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'E-Card download not available for this TPA'
                    ], 400);
            }
        } catch (\Exception $e) {
            Log::error('E-Card download error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to download E-Card'
            ], 500);
        }
    }

    /**
     * Demo TPA E-Card Download
     */
    private function demo_new_download_e_card($data)
    {
        $maxRetries = 3;
        $retryCount = 0;

        do {
            $curl = curl_init();

            $requestData = json_encode([
                "USERNAME" => "ZOOM-ADMIN",
                "PASSWORD" => "ADMIN-USER@389",
                "POLICY_NUMBER" => $data['policy_number'],
                "EMPLOYEE_NUMBER" => $data['emp_id'],
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/GetFamilyECard',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_HTTPHEADER => ['Content-Type:application/json'],
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $requestData,
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            Log::channel('single')->info('Demo E-Card Request', [
                'request' => $requestData,
                'response' => $response
            ]);

            $responseData = json_decode($response);

            if (!empty($responseData) && gettype($responseData) != 'string' && $responseData != null && 
                isset($responseData->GetFamilyECardResult[0]->STATUS) && 
                $responseData->GetFamilyECardResult[0]->STATUS == 'SUCCESS') {
                $url = $responseData->GetFamilyECardResult[0]->E_Card;
                return response()->json(['success' => true, 'url' => $url]);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * PHS TPA E-Card Download
     */
    private function phs_download_e_card($data)
    {
        $maxRetries = 10;
        $retryCount = 0;

        do {
            $curl = curl_init();

            $requestData = json_encode([
                "USERNAME" => "ZOOM-ADMIN",
                "PASSWORD" => "ADMIN-USER@389",
                "POLICY_NUMBER" => $data['policy_number'],
                "EMPLOYEE_NUMBER" => $data['emp_id'],
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://webintegrations.paramounttpa.com/ZoomBrokerAPI/Service1.svc/GetFamilyECard',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_HTTPHEADER => ['Content-Type:application/json'],
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $requestData,
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            Log::channel('single')->info('PHS E-Card Request', [
                'request' => $requestData,
                'response' => $response
            ]);

            $responseData = json_decode($response);

            if (!empty($responseData) && gettype($responseData) != 'string' && $responseData != null && 
                isset($responseData->GetFamilyECardResult[0]->STATUS) && 
                $responseData->GetFamilyECardResult[0]->STATUS == 'SUCCESS') {
                $url = $responseData->GetFamilyECardResult[0]->E_Card;
                return response()->json(['success' => true, 'url' => $url]);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * ICICI TPA E-Card Download
     */
    private function icici_download_e_card($data)
    {
        // Get auth token (you'll need to implement this method)
        $authToken = $this->icici_auth_token('esbhealth');
        
        if (!$authToken) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with ICICI'], 500);
        }

        $curl = curl_init();

        $dobFormatted = date("d-M-Y", strtotime($data['dob']));

        $jsonData = json_encode([
            "CorrelationId" => "e909d465-ebe6-4d0c-bfd3-86e8ef731362",
            "UHIDNo" => $data['emp_id'],
            "DOB" => $dobFormatted,
            "CompanyName" => null,
            "Age" => "",
            "MemberId" => "",
            "PolicyType" => "Corporate",
            "PolicyNo" => ""
        ]);

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://janus.icicilombard.com/health/ilservices/health/v2/healthcard/fetch',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $authToken,
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('ICICI E-Card Request', [
            'request' => $jsonData,
            'response' => substr($response, 0, 500) // Log first 500 chars
        ]);

        if (strpos($response, '%PDF-1.') !== false) {
            // Return PDF as base64
            $base64Pdf = base64_encode($response);
            return response()->json(['success' => true, 'pdf' => $base64Pdf, 'type' => 'pdf']);
        } else {
            $responseData = json_decode($response, true);
            $errorMessage = $responseData['errorText'] ?? 'Unknown error';
            return response()->json(['success' => false, 'message' => $errorMessage], 500);
        }
    }

    /**
     * Go Digit TPA E-Card Download
     */
    private function go_digit_download_e_card($data)
    {
        // Get auth token
        $authToken = $this->go_digit_auth_token();
        
        if (!$authToken) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with Go Digit'], 500);
        }

        $curl = curl_init();

        $headers = [
            'Authorization: Bearer ' . $authToken,
            'Content-Type: application/json',
            'IntegrationID: 20780-0100'
        ];

        $requestData = json_encode([
            "gMCSMEGMCSMEDownloadDocuments" => [
                "gstNumber" => "",
                "partnerReferenceNumber" => $data['emp_id'],
                "documents" => [
                    [
                        "fromDate" => $data['policy_start_date'],
                        "toDate" => $data['policy_end_date'],
                        "asOnDate" => "",
                        "documentType" => "CPE"
                    ]
                ],
                "cutomerAccount" => "",
                "headerParam" => [
                    "Authorization" => "Q0DKCSJJKVBLTLOLU9INUPRPL63KJZE0"
                ],
                "masterPolicyNumber" => $data['policy_number'],
                "policyNumber" => ""
            ]
        ]);

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://oneapi.godigit.com/OneAPI/v1/executor',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $requestData,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        $responseData = json_decode($response, true);

        Log::channel('single')->info('Go Digit E-Card Request', [
            'request' => $requestData,
            'response' => $response
        ]);

        $documentLink = $responseData['GMC SME-GMC SME Download Documents']['resposeBody']['documents'][0]['documentLink'] ?? null;

        if ($documentLink) {
            preg_match('/s3Link=(https?:\/\/[^\)]*)/', $documentLink, $matches);

            if (!empty($matches[1])) {
                $s3Url = $matches[1];
                return response()->json(['success' => true, 's3_url' => $s3Url]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Unable to retrieve the E-Card link.'], 500);
    }

    /**
     * Vidal TPA E-Card Download
     */
    private function vidal_new_download_e_card($data)
    {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://tips.vidalhealthtpa.com/rest/vidalbrokerservices/ecardservice',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_HTTPHEADER => [
                'username: ZoomC_prod',
                'password: ZoomC@prod',
                'policyNo: ' . $data['policy_number'],
                'enrollmentNo:' . $data['uhid'],
                'Authorization: Basic dmlkYWxicm9rZXJwcm9kbG9naW46dmlkYWxwcm9kQDEyMw=='
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('Vidal E-Card Request', [
            'policy_number' => $data['policy_number'],
            'uhid' => $data['uhid'],
            'response' => $response
        ]);

        $responseData = json_decode($response);

        if (isset($responseData[0]->Result[0]->{"ECardDownloadLink"})) {
            $url = $responseData[0]->Result[0]->{"ECardDownloadLink"};
            return response()->json(['success' => true, 'url' => $url]);
        }

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Try Again Later'], 500);
    }

    /**
     * MediAssist TPA E-Card Download
     */
    private function mediassist_download_e_card($data)
    {
        $maxRetries = 3;
        $retryCount = 0;

        do {
            $curl = curl_init();

            $requestData = json_encode([
                "employeeId" => $data['emp_id'],
                "PolicyNo" => $data['policy_number']
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://apiintegration.mediassist.in/ClaimAPIServiceV2/ClaimService/EcardUrl',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $requestData,
                CURLOPT_HTTPHEADER => [
                    'Username: ZoomInsBroker',
                    'Password: zun@t+GJA{1PZeFHTXo$j',
                    'Content-Type: application/json',
                ],
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            Log::channel('single')->info('MediAssist E-Card Request', [
                'request' => $requestData,
                'response' => $response
            ]);

            $responseData = json_decode($response);

            if (!empty($responseData) && gettype($responseData) != 'string' && $responseData != null && 
                isset($responseData->isSuccess) && $responseData->isSuccess) {
                $url = $responseData->ecardUrl;
                return response()->json(['success' => true, 'url' => $url]);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * FHPL TPA E-Card Download
     */
    private function fhpl_new_download_e_card($data)
    {
        $authToken = $this->fhpl_new_authentication_api();

        if (!$authToken) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with FHPL'], 500);
        }

        $curl = curl_init();

        $postFields = 'UserName=ZoomInsurance&Password=fhla209oz&EmployeeID=' . $data['emp_id'] . '&PolicyNumber=' . $data['policy_number'];

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://bconnect-api.fhpl.net/api/GetEcard',
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

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('FHPL E-Card Request', [
            'request' => $postFields,
            'response' => $response
        ]);

        $responseData = json_decode($response);

        if (isset($responseData[0]->STATUS) && $responseData[0]->STATUS == 'SUCCESS') {
            return response()->json(['success' => true, 'url' => $responseData[0]->E_Card]);
        }

        return response()->json(['success' => false, 'message' => 'Something Try Again Later.'], 500);
    }

    /**
     * Safeway TPA E-Card Download
     */
    private function safeway_download_e_card($data)
    {
        $curl = curl_init();

        $requestData = json_encode([
            "Username" => "AGSW4",
            "Password" => "AGSW@4",
            "PolicyNo" => $data['policy_number'],
            "Employeecode" => $data['emp_id'],
        ]);

        curl_setopt_array($curl, [
            CURLOPT_URL => 'http://brokerapi.safewaytpa.in/api/EcardEmpMember',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $requestData,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('Safeway E-Card Request', [
            'request' => $requestData,
            'response' => $response
        ]);

        $responseData = json_decode($response);

        if (isset($responseData->Status) && $responseData->Status == 1) {
            return response()->json(['success' => true, 'e_card_url' => $responseData->E_Card]);
        }

        return response()->json(['success' => false, 'message' => $responseData->Message ?? 'Failed to download E-Card'], 500);
    }

    /**
     * Care TPA E-Card Download
     */
    private function care_download_e_card($data)
    {
        $token = $this->care_token();

        if (!$token) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with Care'], 500);
        }

        $requestArray = [
            "apikey" => "63dcc08fce352",
            "customer_id" => "",
            "employee_id" => $data['emp_id'],
            "member_name" => "",
            "member_dob" => "",
            "policy_number" => $data['policy_number'],
            "product_code" => "",
            "addon_code" => "",
            "policy_type" => "corporate",
            "policy_end_date" => "",
            "policy_start_date" => "",
            "card_type" => "HCK"
        ];

        $jsonData = json_encode($requestArray);
        $encryptedData = $this->encrypt_data_care($jsonData);

        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://rhiclapi.religarehealthinsurance.com/getHealthAndOpdCard.php',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => ['req_data' => $encryptedData],
            CURLOPT_HTTPHEADER => ['Authorization: Bearer' . $token],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('Care E-Card Request', [
            'request' => $requestArray,
            'response' => substr($response, 0, 500)
        ]);

        if (strpos($response, '%PDF-1.') !== false) {
            $base64Pdf = base64_encode($response);
            return response()->json(['success' => true, 'pdf' => $base64Pdf, 'type' => 'pdf']);
        }

        return response()->json(['success' => false, 'message' => 'Failed to download E-Card'], 500);
    }

    /**
     * Health India TPA E-Card Download
     */
    private function health_india_download_e_card($data)
    {
        $authToken = $this->health_india_auth_token();

        if (!$authToken) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with Health India'], 500);
        }

        $maxRetries = 3;
        $retryCount = 0;

        do {
            $curl = curl_init();

            $requestData = json_encode([
                "ACCESS_TOKEN" => $authToken,
                "POLICY_NUMBER" => $data['policy_number'],
                "EMPLOYEE_NUMBER" => $data['emp_id']
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://software.healthindiatpa.com/HiWebApi/ZOOM/GetFamilyECard',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $requestData,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            $responseData = json_decode($response, true);

            Log::channel('single')->info('Health India E-Card Request', [
                'request' => $requestData,
                'response' => $response
            ]);

            if (isset($responseData['MESSAGE']) && $responseData['MESSAGE'] == "SUCCESS") {
                $documentLink = $responseData["RESULT"];
                return response()->json(['success' => true, 'url' => $documentLink]);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * EWA TPA E-Card Download
     */
    private function ewa_download_e_card($data)
    {
        $maxRetries = 10;
        $retryCount = 0;

        do {
            $curl = curl_init();

            $requestData = json_encode([
                "userName" => "nipun.bansal@zoominsurancebrokers.com",
                "password" => "Test@123",
                "policyNo" => $data['policy_number'],
                "empCode" => $data['emp_id'],
            ]);

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://apiadmin.ewatpa.com/zoom/getEcard',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_HTTPHEADER => ['Content-Type:application/json'],
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $requestData,
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            $cleanedResponse = preg_replace('/^\)\]\}\',\s*/', '', $response);
            $responseData = json_decode($cleanedResponse, true);

            Log::channel('single')->info('EWA E-Card Request', [
                'request' => $requestData,
                'response' => $response
            ]);

            if (!empty($responseData) && isset($responseData['message']) && 
                $responseData['message'] == 'family id card created') {
                $base64Pdf = $responseData['body'];
                return response()->json(['success' => true, 'pdf' => $base64Pdf, 'type' => 'pdf']);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * SBI TPA E-Card Download
     */
    private function sbi_download_e_card($data)
    {
        if ($data['policy_number'] == "41010240900000211-00") {
            $pdfUrl = url('uploads/sbi_ecards/resman/41010240900000211-00_' . $data['emp_id'] . '.pdf');
            return response()->json(['success' => true, 'url' => $pdfUrl]);
        }

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * Ericson TPA E-Card Download
     */
    private function ericson_download_e_card($data)
    {
        $maxRetries = 10;
        $retryCount = 0;

        do {
            $postData = [
                'UserName' => 'ZOOM INSURANCE BROKERS PVT LTD',
                'Password' => '384',
                'PolicyNo' => $data['policy_number'],
                'EmpCode' => $data['emp_id'],
                'TPAID' => '',
            ];

            $curl = curl_init();

            curl_setopt_array($curl, [
                CURLOPT_URL => 'https://sata.ericsontpa.com/sataservices/ericsontpaservices.asmx/Get_Ecard',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => http_build_query($postData),
                CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            Log::channel('single')->info('Ericson E-Card Request', [
                'request' => $postData,
                'response' => $response
            ]);

            $responseData = json_decode($response);

            if (!empty($responseData) && isset($responseData->result[0]->URL)) {
                $url = $responseData->result[0]->URL;
                return response()->json(['success' => true, 'url' => $url]);
            }

            $retryCount++;
        } while ($retryCount < $maxRetries);

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * Future Generali TPA E-Card Download
     */
    private function future_generali_download_e_card($data)
    {
        $authToken = $this->future_generali_auth_token();

        if (!$authToken) {
            return response()->json(['success' => false, 'message' => 'Failed to authenticate with Future Generali'], 500);
        }

        $curl = curl_init();

        $requestData = json_encode([
            "UniqueRequestID" => "3456wert787654",
            "MasterPolicyumber" => $data['policy_number'],
            "EmployeeCode" => $data['emp_id'],
            "BrokerCode" => "60000272",
            "VenderCode" => "345676dfg543"
        ]);

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://uat-internal-apigw.futuregenerali.in:8243/HealthClaim-Process/1.0.0/HealthClaim_V1/GetFamilyEcardBytes',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $requestData,
            CURLOPT_HTTPHEADER => [
                'accept: */*',
                'Content-Type: application/json',
                'Authorization: Bearer ' . $authToken
            ],
        ]);

        $response = curl_exec($curl);
        curl_close($curl);

        Log::channel('single')->info('Future Generali E-Card Request', [
            'request' => $requestData,
            'response' => substr($response, 0, 500)
        ]);

        $responseData = json_decode($response);

        // Handle response based on API structure
        if ($responseData && isset($responseData->Status) && $responseData->Status == 'SUCCESS') {
            return response()->json(['success' => true, 'url' => $responseData->E_Card ?? null]);
        }

        return response()->json(['success' => false, 'message' => 'Something Try Again Later.'], 500);
    }

    /**
     * AB TPA E-Card Download
     */
    private function ab_download_e_card($data)
    {
        if ($data['policy_number'] == "2-81-25-00005037-000") {
            $pdfUrl = url('uploads/ab_ecard/bharatpe/' . $data['emp_id'] . '.pdf');
            return response()->json(['success' => true, 'url' => $pdfUrl]);
        } elseif ($data['policy_number'] == "2-81-25-00003199-000") {
            $dir = public_path('uploads/ab_ecard/global_step/');
            $pattern = $dir . $data['emp_id'] . '_*.pdf';
            $files = glob($pattern);
            
            if ($files && count($files) > 0) {
                $filename = basename($files[0]);
                $pdfUrl = url('uploads/ab_ecard/global_step/' . $filename);
                return response()->json(['success' => true, 'url' => $pdfUrl]);
            }
            
            return response()->json(['success' => false, 'message' => 'E-Card not found for this Employee ID'], 404);
        }

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * IFFCO TPA E-Card Download
     */
    private function iffco_download_e_card($data)
    {
        if ($data['policy_number'] == "H1605551") {
            $pdfUrl = url('uploads/iffco_ecard/econ/' . $data['emp_id'] . '.PDF');
            return response()->json(['success' => true, 'url' => $pdfUrl]);
        } elseif ($data['policy_number'] == "H1611550") {
            $pdfUrl = url('uploads/iffco_ecard/vdc/' . $data['emp_id'] . '.PDF');
            return response()->json(['success' => true, 'url' => $pdfUrl]);
        }

        return response()->json(['success' => false, 'message' => 'Something Went Wrong! Kindly Try again Later'], 500);
    }

    /**
     * Reliance TPA E-Card Download
     */
    private function reliance_download_e_card($data)
    {
        $employeeId = $data['emp_id'];
        $corporateCode = 'BTP1';
        $issueDate = $data['policy_start_date'];
        
        $ssoUrl = $this->ghip_sso_encrypt($employeeId, $corporateCode, $issueDate);
        
        return response()->json(['success' => true, 'url' => $ssoUrl]);
    }

    /**
     * GHIP SSO Encryption for Reliance
     */
    private function ghip_sso_encrypt($employeeId, $corporateCode, $issueDate)
    {
        $issueDate = str_replace(['-', '_'], '/', $issueDate);
        $ssoParams = array(
            'EmployeeId' => $employeeId,
            'CorporateCode' => $corporateCode,
            'IssueDate' => $issueDate
        );

        $key = 'b14ca5898a4e4133bbce2ea2315a1916';
        $paramsToEncrypt = json_encode($ssoParams);
        $paramsToEncryptUtf8 = mb_convert_encoding($paramsToEncrypt, 'UTF-8');
        $raw = openssl_encrypt($paramsToEncryptUtf8, "AES-256-CBC", substr($key, 0, 32), OPENSSL_RAW_DATA, str_repeat("\0", 16));
        $encrypted = base64_encode($raw);
        $ssoUrl = 'https://preenrolluat.reliancegeneral.co.in/cp-member?sso=' . $encrypted;
        
        return $ssoUrl;
    }

    // ========== Helper methods for TPA authentication tokens ==========

    private function icici_auth_token($scope)
    {
        $data = array(
            'username' => 'ZoomInsur',
            'password' => 'xUCfV8J6S64ahZW',
            'client_id' => 'ZoomInsur',
            'client_secret' => 'f2tn56Dr6oS4yJwWysPJTxpEQAncUC7n1l8i0UgoXAeMLk7LB7iBGfGrKnBYmxn8',
            'scope' => $scope,
            'grant_type' => 'password'
        );
        $curl = curl_init();
        // Convert the data array to a URL-encoded string
        $request = http_build_query($data);

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://janus.icicilombard.com/generate-jwt-token',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $request,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/x-www-form-urlencoded'
                ),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);
        
        $responseData = json_decode($response, true);
        return $responseData['access_token'] ?? null;
    }

    private function go_digit_auth_token()
    {
        $curl = curl_init();

        $data = array(
            'username' => '76831512',
            'password' => 'Digit@351$',
        );

        $request = json_encode($data);

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://oneapi.godigit.com/OneAPI/digit/generateAuthKey',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $request,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json'
                ),
            )
        );
        $response = curl_exec($curl);
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($http_status == 200) {
            $response_data = json_decode($response, true);
            return $response_data['access_token'] ?? null;
        }
        
        return null;
    }

    private function fhpl_new_authentication_api()
    {
        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://bconnect-api.fhpl.net/token',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => 'UserName=ZoomInsurance&Password=fhla209oz&grant_type=password',
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/x-www-form-urlencoded'
                ),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);

        $responseData = json_decode($response);

        Log::channel('single')->info('FHPL Auth Request', [
            'request' => 'UserName=ZoomInsurance&Password=fhla209oz&grant_type=password',
            'response' => $response
        ]);

        return $responseData->access_token ?? null;
    }

    private function care_token()
    {
        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://rhiclapi.religarehealthinsurance.com/accessToken.php',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => array('api_key' => '63dcc08fce352'),
            )
        );

        $response = curl_exec($curl);
        curl_close($curl);

        $data = json_decode($response, true);

        if (isset($data['response']['status']) && $data['response']['status'] == 1 && 
            isset($data['response']['message']) && $data['response']['message'] == "success") {
            return $data['response']['listOfToken'][0]['tokenValue'] ?? null;
        }
        
        return null;
    }

    private function encrypt_data_care($data)
    {
        $key = '63dcc08fce352';
        $method = 'AES-128-ECB';
        $encrypted = openssl_encrypt($data, $method, $key, OPENSSL_RAW_DATA);
        return base64_encode($encrypted);
    }

    private function health_india_auth_token()
    {
        $curl = curl_init();

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://software.healthindiatpa.com/HiWebApi/ZOOM/ValidateCredentials',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => '{
                    "USERNAME": "tL5fqFWl5YG/meWZi7jfZg==",
                    "PASSWORD": "45f2/P1j4zY4odQTIrVxvCmFE/qdPLZAPm70p3mI0qQ="
                }',
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json'
                ),
            )
        );

        $response = curl_exec($curl);
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($http_status == 200) {
            $response_data = json_decode($response, true);
            return $response_data['RESULT'] ?? null;
        }
        
        return null;
    }

    private function future_generali_auth_token()
    {
        $curl = curl_init();

        $data = array(
            'username' => '76831512',
            'password' => 'Digit@351$',
        );

        $request = json_encode($data);

        curl_setopt_array(
            $curl,
            array(
                CURLOPT_URL => 'https://oneapi.godigit.com/OneAPI/digit/generateAuthKey',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $request,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json'
                ),
            )
        );
        $response = curl_exec($curl);
        $http_status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($http_status == 200) {
            $response_data = json_decode($response, true);
            return $response_data['access_token'] ?? null;
        }
        
        return null;
    }

    /**
     * Get policies for employee's company
     */
    public function getPolicies(Request $request)
    {
        $employeeId = Session::get('employee_id');

        
        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $employee = CompanyEmployee::with('company')->find($employeeId);

        if (!$employee || !$employee->company) {
            return response()->json([
                'success' => false,
                'message' => 'Employee or company not found'
            ], 404);
        }

        // Get active policies for the employee's company
        $policies = \App\Models\PolicyMaster::where('comp_id', $employee->company->comp_id)
            ->where('is_active', 1)
            ->where('policy_status', 1)
            ->with(['insurance'])
            ->select('id', 'policy_name', 'corporate_policy_name', 'policy_number', 'policy_start_date', 'policy_end_date', 'policy_type', 'ins_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $policies->map(function ($policy) {
                return [
                    'id' => $policy->id,
                    'name' => $policy->corporate_policy_name ?: $policy->policy_name,
                    'policy_number' => $policy->policy_number,
                    'policy_type' => $policy->policy_type,
                    'start_date' => $policy->policy_start_date,
                    'end_date' => $policy->policy_end_date,
                    'insurance_name' => $policy->insurance->name ?? 'N/A',
                ];
            })
        ]);
    }
}


