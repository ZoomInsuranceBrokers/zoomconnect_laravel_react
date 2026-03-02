<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CheckFirstLogin
{
    /**
     * Handle an incoming request.
     * Redirect to first-login page if employee hasn't completed first login
     */
    public function handle(Request $request, Closure $next)
    {
        $employee = Session::get('employee_user');

        if ($employee && $employee['first_login'] == 1) {
            // Redirect to first login page if not already there
            if (!$request->is('employee/first-login*')) {
                return redirect()->route('employee.first.login');
            }
        }

        return $next($request);
    }
}
