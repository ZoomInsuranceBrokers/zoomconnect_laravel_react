<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}
