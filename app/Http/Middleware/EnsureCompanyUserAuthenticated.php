<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class EnsureCompanyUserAuthenticated
{
    /**
     * Handle an incoming request.
     * Ensure company user is authenticated, redirect to login if not
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Session::has('company_user_logged_in') || !Session::get('company_user_logged_in')) {
            return redirect()->route('company.user.login')->with('error', 'Please login to continue.');
        }

        return $next($request);
    }
}
