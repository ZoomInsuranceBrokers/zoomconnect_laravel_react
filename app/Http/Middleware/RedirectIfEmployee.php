<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class RedirectIfEmployee
{
    /**
     * Handle an incoming request.
     * Redirect to employee dashboard if already logged in as employee
     * or redirect to respective dashboard if logged in as other user type
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if employee is logged in
        if (Session::has('employee_user')) {
            // Don't redirect if already on employee routes to prevent loop
            if (!$request->is('employee/*') && !$request->is('employee/logout')) {
                return redirect()->route('employee.dashboard');
            }
        }

        // Check if superadmin is logged in
        if (Session::has('superadmin_user')) {
            // Don't redirect if already on superadmin routes to prevent loop
            if (!$request->is('superadmin/*') && !$request->is('logout')) {
                return redirect()->route('superadmin.dashboard');
            }
        }

        return $next($request);
    }
}
