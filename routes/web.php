<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Route::get('/login',[AuthController::class,'superadminLogin'])->name('login');
Route::post('/login',[AuthController::class,'processLogin'])->name('login.process');
Route::post('/verify-otp',[AuthController::class,'verifyOtp'])->name('verify.otp');
// Route::middleware(['superadmin.session'])->group(function () {
    Route::get('/superadmin/dashboard',[AuthController::class,'dashboard'])->name('superadmin.dashboard');
    // Add more superadmin-only routes here
// });
Route::post('/logout',[AuthController::class,'logout'])->name('logout');


////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
