<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSuperadminAuthenticated
{
    /**
     * Handle an incoming request.
     * Only enforce authentication for routes under the `superadmin` prefix.
     */
    public function handle(Request $request, Closure $next)
    {
        // Only act on superadmin prefixed routes
        if ($request->is('superadmin') || $request->is('superadmin/*')) {
            $session = $request->session();
            $loggedIn = $session->get('superadmin_authenticated') || $session->get('superadmin_logged_in');

            if (! $loggedIn) {
                return redirect('/login');
            }
        }

        return $next($request);
    }
}
