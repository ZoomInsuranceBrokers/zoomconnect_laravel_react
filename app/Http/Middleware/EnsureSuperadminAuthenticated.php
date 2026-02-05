<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class EnsureSuperadminAuthenticated
{
    /**
     * Handle an incoming request.
     * Ensure superadmin is authenticated before accessing protected routes.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if superadmin is logged in
        if (!Session::has('superadmin_user')) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        return $next($request);
    }
}
