<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\CompanyEmployee;
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
                'user' => [
                    'id' => $employee->id,
                    'employee_id' => $employee->employee_id,
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'email' => $employee->email,
                    'mobile_no' => $employee->mobile_no,
                    'company_id' => $employee->company_id,
                    'location_id' => $employee->location_id,
                    'is_active' => $employee->is_active
                ]
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
