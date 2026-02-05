<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class RedirectIfSuperadmin
{
    /**
     * Handle an incoming request.
     * If a superadmin is already authenticated, prevent access to login routes.
     */
    public function handle(Request $request, Closure $next)
    {
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
