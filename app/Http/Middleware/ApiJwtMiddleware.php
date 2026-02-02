<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Symfony\Component\HttpFoundation\Response;
use App\Helpers\ApiResponse;

class ApiJwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return ApiResponse::error('Token not provided', null, 401);
        }

        try {
            $secret = config('app.key');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            
            // Add decoded data to request for use in controllers
            $request->attributes->add(['jwt_user' => $decoded]);
            
            return $next($request);
        } catch (\Firebase\JWT\ExpiredException $e) {
            return ApiResponse::error('Token has expired', null, 401);
        } catch (\Exception $e) {
            return ApiResponse::error('Invalid token', $e->getMessage(), 401);
        }
    }
}
