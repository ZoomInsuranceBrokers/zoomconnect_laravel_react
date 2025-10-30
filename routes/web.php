<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;

Route::get('/', function () {
    return Inertia::render('Public/Home');
});

Route::get('/book-demo', function () {
    return Inertia::render('Public/BookDemo');
})->name('book.demo');

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Route::get('/login', [AuthController::class, 'superadminLogin'])->name('login');
Route::post('/login', [AuthController::class, 'processLogin'])->name('login.process');
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('verify.otp');

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Route::middleware(['auth.session'])->group(function () {
// Logout route without prefix
Route::post('/logout', [SuperAdminController::class, 'logout'])->name('logout');

// SuperAdmin routes with prefix
Route::prefix('superadmin')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'dashboard'])->name('superadmin.dashboard');

    // Corporate Labels Routes
    Route::get('/corporate/labels', [SuperAdminController::class, 'corporateLabelsIndex'])->name('corporate.labels.index');
    Route::post('/corporate/labels', [SuperAdminController::class, 'corporateLabelsStore'])->name('corporate.labels.store');
    Route::put('/corporate/labels/{label}', [SuperAdminController::class, 'corporateLabelsUpdate'])->name('corporate.labels.update');
    Route::delete('/corporate/labels/{label}', [SuperAdminController::class, 'corporateLabelsDestroy'])->name('corporate.labels.destroy');

    // Corporate Groups Routes
    Route::get('/corporate/groups', [SuperAdminController::class, 'corporateGroupsIndex'])->name('corporate.groups.index');
    Route::post('/corporate/groups', [SuperAdminController::class, 'corporateGroupsStore'])->name('corporate.groups.store');
    Route::put('/corporate/groups/{group}', [SuperAdminController::class, 'corporateGroupsUpdate'])->name('corporate.groups.update');
    Route::delete('/corporate/groups/{group}', [SuperAdminController::class, 'corporateGroupsDestroy'])->name('corporate.groups.destroy');

    // Corporate lists Routes
    Route::get('/corporate/list', [SuperAdminController::class, 'corporateList'])->name('corporate.list.index');
    Route::get('/corporate/create', [SuperAdminController::class, 'corporateCreate'])->name('corporate.create');
    Route::post('/corporate/store', [SuperAdminController::class, 'corporateStore'])->name('corporate.store');

    // Wellness Module Routes
    Route::get('/wellness/vendor-list', [SuperAdminController::class, 'vendorList'])->name('wellness.vendor-list');
    Route::post('/wellness/vendor-list', [SuperAdminController::class, 'vendorStore'])->name('superadmin.wellness.vendor.store');
    Route::put('/wellness/vendor/{vendor}', [SuperAdminController::class, 'vendorUpdate'])->name('superadmin.wellness.vendor.update');
    Route::put('/wellness/vendor/{vendor}/toggle-status', [SuperAdminController::class, 'vendorToggleStatus'])->name('wellness.vendor.toggle-status');
    Route::get('/wellness/category-list', [SuperAdminController::class, 'categoryList'])->name('superadmin.wellness.category.index');
    Route::post('/wellness/category-list', [SuperAdminController::class, 'categoryStore'])->name('superadmin.wellness.category.store');
    Route::put('/wellness/category/{category}', [SuperAdminController::class, 'categoryUpdate'])->name('superadmin.wellness.category.update');
    Route::put('/wellness/category/{category}/toggle-status', [SuperAdminController::class, 'categoryToggleStatus'])->name('superadmin.wellness.category.toggle-status');
    Route::get('/wellness/services', [SuperAdminController::class, 'servicesList'])->name('superadmin.wellness.services.index');
    Route::post('/wellness/services', [SuperAdminController::class, 'servicesStore'])->name('superadmin.wellness.services.store');
    Route::put('/wellness/services/{service}', [SuperAdminController::class, 'servicesUpdate'])->name('superadmin.wellness.services.update');
    Route::put('/wellness/services/{service}/toggle-status', [SuperAdminController::class, 'servicesToggleStatus'])->name('superadmin.wellness.services.toggle-status');
});
// });
