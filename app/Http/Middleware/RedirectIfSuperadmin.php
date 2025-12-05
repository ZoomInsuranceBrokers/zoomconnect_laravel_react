<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectIfSuperadmin
{
    /**
     * Handle an incoming request.
     * If a superadmin is already authenticated, prevent access to login routes.
     */
    public function handle(Request $request, Closure $next)
    {
        // Only act on the login-related routes
        if ($request->is('login') || $request->is('verify-otp')) {
            $session = $request->session();
            $loggedIn = $session->get('superadmin_authenticated') || $session->get('superadmin_logged_in');

            if ($loggedIn) {
                return redirect('/superadmin/dashboard');
            }
        }

        return $next($request);
    }
}
