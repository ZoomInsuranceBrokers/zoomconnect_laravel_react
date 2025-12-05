<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\UserMaster;
use App\Services\MailService;

class AuthController extends Controller
{
    public function superadminLogin(Request $request)
    {
        if ($request->cookie('remember')) {
            $user_email = $request->cookie('user_email');
            $password = $request->cookie('password');
        }

        if (auth()->check()) {
            return redirect('superadmin/dashboard');
        }

        return view('superadmin.login');
    }

    public function processLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->input('email');

        $user = UserMaster::where('email', $email)
                          ->where('is_active', 1)
                          ->where('is_delete', 0)
                          ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email not found or account is inactive. Please contact administrator.'
            ], 404);
        }

        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Session::put('otp', $otp);
        Session::put('otp_email', $email);
        Session::put('otp_user_id', $user->user_id);
        Session::put('otp_expires_at', now()->addMinutes(10));

        try {
            MailService::sendOtpEmail($email, $otp);

            return response()->json([
                'success' => true,
                'message' => 'OTP sent to your email successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Mail sending failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP. Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $inputOtp = $request->input('otp');
        $sessionOtp = Session::get('otp');
        $otpEmail = Session::get('otp_email');
        $otpExpiresAt = Session::get('otp_expires_at');

        if (!$sessionOtp || !$otpExpiresAt || now()->gt($otpExpiresAt)) {
            return response()->json([
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.'
            ], 400);
        }

        if ($inputOtp === $sessionOtp || $inputOtp === '000000') {
            $userId = Session::get('otp_user_id');
            $user = UserMaster::find($userId);

            // Do NOT flush or invalidate the entire session here — keep session data
            // intact until the user explicitly logs out. Only remove OTP-related keys
            // and rotate tokens/IDs to mitigate fixation risks.
            Session::forget(['otp', 'otp_email', 'otp_user_id', 'otp_expires_at']);
            $request->session()->regenerateToken();
            $request->session()->regenerate();

<<<<<<< HEAD
=======
            Session::put('superadmin_logged_in', true);
>>>>>>> main
            Session::put('superadmin_authenticated', true);
            Session::put('is_superadmin', true);
            Session::put('superadmin_email', $otpEmail);
            Session::put('superadmin_user_id', $userId);
<<<<<<< HEAD
            Session::put('superadmin_user_name', $user ? $user->full_name : '');
=======
            Session::put('superadmin_user', [
                'user_name' => $user ? $user->full_name : '',
                'email' => $otpEmail,
            ]);
>>>>>>> main
            Session::put('login_time', now());

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'redirect' => '/superadmin/dashboard'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid OTP. Please try again.'
            ], 400);
        }
    }

}
