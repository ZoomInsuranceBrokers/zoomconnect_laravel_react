<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CompanyUser;
use App\Models\CompanyMaster;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Services\MailService;

class CompanyUserAuthController extends Controller
{
    /**
     * Show company user login page
     */
    public function companyUserLogin()
    {
        return Inertia::render('CompanyUser/Login');
    }

    /**
     * Process company user login (send OTP to email)
     */
    public function processLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');

        // Find company user by email with company details
        $companyUser = CompanyUser::where('email', $email)
            ->where('is_active', 1)
            ->first();

        if (!$companyUser) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found or account is inactive. Please contact administrator.'
            ], 404);
        }

        // Check if company exists and is active
        $company = CompanyMaster::where('comp_id', $companyUser->company_id)
            ->where('status', 1)
            ->first();

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'Company not found or inactive. Please contact administrator.'
            ], 404);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in session with 10 minute expiry
        Session::put('company_user_otp', $otp);
        Session::put('company_user_otp_email', $email);
        Session::put('company_user_id', $companyUser->id);
        Session::put('company_user_otp_expires_at', now()->addMinutes(10));

        try {
            // Send OTP via email
            MailService::sendOtpEmail($email, $otp);

            return response()->json([
                'success' => true,
                'message' => 'OTP sent to your email successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Company User OTP Mail sending failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP. Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP and complete login
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $inputOtp = $request->input('otp');
        $sessionOtp = Session::get('company_user_otp');
        $otpEmail = Session::get('company_user_otp_email');
        $otpExpiresAt = Session::get('company_user_otp_expires_at');

        if (!$sessionOtp || !$otpExpiresAt || now()->gt($otpExpiresAt)) {
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.'
            ], 400);
        }

        // Verify OTP (allow 000000 for testing)
        if ($inputOtp === $sessionOtp || $inputOtp === '000000') {
            $userId = Session::get('company_user_id');
            $companyUser = CompanyUser::with('company')->find($userId);

            // Clear OTP-related session data
            Session::forget(['company_user_otp', 'company_user_otp_email', 'company_user_otp_expires_at']);
            
            // Regenerate session to prevent fixation
            $request->session()->regenerateToken();
            $request->session()->regenerate();

            // Set company user session data
            Session::put('company_user_logged_in', true);
            Session::put('company_user_authenticated', true);
            Session::put('company_user_id', $userId);
            Session::put('company_user_email', $otpEmail);
            Session::put('company_user', [
                'id' => $companyUser->id,
                'full_name' => $companyUser->full_name,
                'first_name' => $companyUser->first_name,
                'last_name' => $companyUser->last_name,
                'email' => $companyUser->email,
                'designation_name' => $companyUser->designation_name,
                'role_id' => $companyUser->role_id,
                'company_id' => $companyUser->company_id,
                'company_name' => $companyUser->company ? $companyUser->company->company_name : '',
            ]);
            Session::put('login_time', now());

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'redirect' => '/company-user/dashboard'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP. Please try again.'
            ], 400);
        }
    }

    /**
     * Logout company user
     */
    public function logout()
    {
        Session::forget('company_user_logged_in');
        Session::forget('company_user_authenticated');
        Session::forget('company_user_id');
        Session::forget('company_user_email');
        Session::forget('company_user');
        Session::flush();

        return redirect()->route('company.user.login')->with('success', 'Logged out successfully');
    }
}
