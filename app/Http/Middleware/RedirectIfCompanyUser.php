<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class RedirectIfCompanyUser
{
    /**
     * Handle an incoming request.
     * Redirect to dashboard if company user is already logged in
     */
    public function handle(Request $request, Closure $next)
    {
        if (Session::has('company_user_logged_in') && Session::get('company_user_logged_in')) {
            return redirect()->route('company.user.dashboard');
        }

        return $next($request);
    }
}
