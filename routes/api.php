<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    // Login Routes
    Route::post('/login/email', [App\Http\Controllers\ApiController::class, 'loginWithEmail'])->name('api.login.email');
    Route::post('/login/mobile', [App\Http\Controllers\ApiController::class, 'loginWithPhone'])->name('api.login.mobile');
    Route::post('/verify-otp', [App\Http\Controllers\ApiController::class, 'verifyOtp'])->name('api.verify.otp');

    // Protected Routes (require JWT token)
    Route::middleware([\App\Http\Middleware\ApiJwtMiddleware::class])->group(function () {
        Route::get('/profile', [App\Http\Controllers\ApiController::class, 'getProfile'])->name('api.profile');
        Route::get('/wellness-services', [App\Http\Controllers\ApiController::class, 'getWellnessServices'])->name('api.wellness.services');
        Route::get('/employee-policies', [App\Http\Controllers\ApiController::class, 'getEmployeePolicies'])->name('api.employee.policies');
        Route::post('/logout', [App\Http\Controllers\ApiController::class, 'logout'])->name('api.logout');
        Route::post('/verify-token', [App\Http\Controllers\ApiController::class, 'verifyToken'])->name('api.verify.token');
        // Policy details (uses JWT middleware to identify employee)
        Route::get('/policy-details/{policy}', [App\Http\Controllers\Api\PolicyDetailsController::class, 'show'])->name('api.policy.details');
    });
});
