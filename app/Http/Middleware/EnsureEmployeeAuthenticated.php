<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class EnsureEmployeeAuthenticated
{
    /**
     * Handle an incoming request.
     * Ensure employee is authenticated, redirect to login if not
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Session::has('employee_user')) {
            return redirect()->route('employee.login')->with('error', 'Please login to continue.');
        }

        return $next($request);
    }
}
