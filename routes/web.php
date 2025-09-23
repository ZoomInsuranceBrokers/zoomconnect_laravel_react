<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;

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

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Route::middleware(['auth.session'])->group(function () {
    // Logout route without prefix
    Route::post('/logout',[SuperAdminController::class,'logout'])->name('logout');

    // SuperAdmin routes with prefix
    Route::prefix('superadmin')->group(function () {
        Route::get('/dashboard',[SuperAdminController::class,'dashboard'])->name('superadmin.dashboard');

        // Corporate Labels Routes
        Route::get('/corporate/labels', [SuperAdminController::class, 'corporateLabelsIndex'])->name('corporate.labels.index');
        Route::post('/corporate/labels', [SuperAdminController::class, 'corporateLabelsStore'])->name('corporate.labels.store');
        Route::put('/corporate/labels/{label}', [SuperAdminController::class, 'corporateLabelsUpdate'])->name('corporate.labels.update');
        Route::delete('/corporate/labels/{label}', [SuperAdminController::class, 'corporateLabelsDestroy'])->name('corporate.labels.destroy');
    });
// });


