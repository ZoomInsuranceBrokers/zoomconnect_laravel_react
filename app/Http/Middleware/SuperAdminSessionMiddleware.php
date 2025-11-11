<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminSessionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Session::has('superadmin_logged_in') || !Session::get('superadmin_logged_in')) {
            return redirect()->route('login')->with('error', 'Please login to access this area.');
        }

        return $next($request);
    }
}
