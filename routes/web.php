
<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return Inertia::render('Public/Home');
});

Route::get('/book-demo', function () {
    return Inertia::render('Public/BookDemo');
})->name('book.demo');

// Product Routes
Route::prefix('products')->name('products.')->group(function () {
    Route::get('/group-medical-cover', [ProductController::class, 'groupMedicalCover'])->name('group-medical-cover');
    Route::get('/group-accident-cover', [ProductController::class, 'groupAccidentCover'])->name('group-accident-cover');
    Route::get('/group-term-life', [ProductController::class, 'groupTermLife'])->name('group-term-life');
    Route::get('/wellness-programs', [ProductController::class, 'wellnessPrograms'])->name('wellness-programs');
    Route::get('/telehealth-services', [ProductController::class, 'telehealthServices'])->name('telehealth-services');
});

Route::get('/employee', [App\Http\Controllers\ProductController::class, 'employee'])->name('employee');
Route::get('/employer', [App\Http\Controllers\ProductController::class, 'employer'])->name('employer');
Route::get('/mobile', [App\Http\Controllers\ProductController::class, 'mobile'])->name('mobile');

// Solutions
Route::get('/small-teams', [App\Http\Controllers\ProductController::class, 'smallTeams'])->name('smallTeams');
Route::get('/large-teams', [App\Http\Controllers\ProductController::class, 'largeTeams'])->name('largeTeams');
Route::get('/hybrid', [App\Http\Controllers\ProductController::class, 'hybrid'])->name('hybrid');

// Explore
Route::get('/resources', [App\Http\Controllers\ProductController::class, 'resources'])->name('resources');
Route::get('/blog', [App\Http\Controllers\ProductController::class, 'blog'])->name('blog');
Route::get('/cases', [App\Http\Controllers\ProductController::class, 'cases'])->name('cases');
Route::get('/faq', [App\Http\Controllers\ProductController::class, 'faq'])->name('faq');

// Company
Route::get('/about', [App\Http\Controllers\ProductController::class, 'about'])->name('about');
Route::get('/careers', [App\Http\Controllers\ProductController::class, 'careers'])->name('careers');
Route::get('/contact', [App\Http\Controllers\ProductController::class, 'contact'])->name('contact');
// Contact Us Route
Route::get('/contact-us', [ProductController::class, 'contactUs'])->name('contact-us');

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

    // Marketing Module Routes
    Route::get('/marketing/campaigns', [SuperAdminController::class, 'marketingCampaigns'])->name('superadmin.marketing.campaigns.index');
    Route::post('/marketing/campaigns', [SuperAdminController::class, 'marketingCampaignsStore'])->name('superadmin.marketing.campaigns.store');
    Route::put('/marketing/campaigns/{campaign}', [SuperAdminController::class, 'marketingCampaignsUpdate'])->name('superadmin.marketing.campaigns.update');
    Route::delete('/marketing/campaigns/{campaign}', [SuperAdminController::class, 'marketingCampaignsDestroy'])->name('superadmin.marketing.campaigns.destroy');

    Route::get('/marketing/welcome-mailer', [SuperAdminController::class, 'marketingWelcomeMailer'])->name('superadmin.marketing.welcome-mailer.index');
    Route::post('/marketing/welcome-mailer', [SuperAdminController::class, 'marketingWelcomeMailerStore'])->name('superadmin.marketing.welcome-mailer.store');
    Route::put('/marketing/welcome-mailer/{mailer}', [SuperAdminController::class, 'marketingWelcomeMailerUpdate'])->name('superadmin.marketing.welcome-mailer.update');
    Route::delete('/marketing/welcome-mailer/{mailer}', [SuperAdminController::class, 'marketingWelcomeMailerDestroy'])->name('superadmin.marketing.welcome-mailer.destroy');

    Route::get('/marketing/message-template', [SuperAdminController::class, 'marketingMessageTemplate'])->name('superadmin.marketing.message-template.index');
    Route::get('/marketing/message-template/create', [SuperAdminController::class, 'marketingMessageTemplateCreate'])->name('superadmin.marketing.message-template.create');
    Route::post('/marketing/message-template', [SuperAdminController::class, 'marketingMessageTemplateStore'])->name('superadmin.marketing.message-template.store');
    Route::get('/marketing/message-template/{template}', [SuperAdminController::class, 'marketingMessageTemplateShow'])->name('superadmin.marketing.message-template.show');
    Route::get('/marketing/message-template/{template}/edit', [SuperAdminController::class, 'marketingMessageTemplateEdit'])->name('superadmin.marketing.message-template.edit');
    Route::put('/marketing/message-template/{template}', [SuperAdminController::class, 'marketingMessageTemplateUpdate'])->name('superadmin.marketing.message-template.update');
    Route::delete('/marketing/message-template/{template}', [SuperAdminController::class, 'marketingMessageTemplateDestroy'])->name('superadmin.marketing.message-template.destroy');

    Route::get('/marketing/push-notifications', [SuperAdminController::class, 'marketingPushNotifications'])->name('superadmin.marketing.push-notifications.index');
    Route::post('/marketing/push-notifications', [SuperAdminController::class, 'marketingPushNotificationsStore'])->name('superadmin.marketing.push-notifications.store');
    Route::put('/marketing/push-notifications/{notification}', [SuperAdminController::class, 'marketingPushNotificationsUpdate'])->name('superadmin.marketing.push-notifications.update');
    Route::delete('/marketing/push-notifications/{notification}', [SuperAdminController::class, 'marketingPushNotificationsDestroy'])->name('superadmin.marketing.push-notifications.destroy');

    // Policy Module Routes
    Route::get('/policy/enrollment-lists', [SuperAdminController::class, 'policyEnrollmentLists'])->name('superadmin.policy.enrollment-lists.index');
    Route::get('/policy/enrollment-lists/create', [SuperAdminController::class, 'policyEnrollmentListsCreate'])->name('superadmin.policy.enrollment-lists.create');
    Route::post('/policy/enrollment-lists', [SuperAdminController::class, 'policyEnrollmentListsStore'])->name('superadmin.policy.enrollment-lists.store');
    Route::post('/policy/enrollment-lists/validate-step', [SuperAdminController::class, 'validateEnrollmentStep'])->name('superadmin.policy.enrollment-lists.validate-step');
    Route::get('/policy/enrollment-lists/{enrollment}/edit', [SuperAdminController::class, 'policyEnrollmentListsEdit'])->name('superadmin.policy.enrollment-lists.edit');
    Route::put('/policy/enrollment-lists/{enrollment}', [SuperAdminController::class, 'policyEnrollmentListsUpdate'])->name('superadmin.policy.enrollment-lists.update');
    Route::put('/policy/enrollment-lists/{enrollment}/toggle-status', [SuperAdminController::class, 'policyEnrollmentListsToggleStatus'])->name('superadmin.policy.enrollment-lists.toggle-status');
    Route::put('/policy/enrollment-lists/{enrollment}/make-active', [SuperAdminController::class, 'policyEnrollmentListsMakeActive'])->name('superadmin.policy.enrollment-lists.make-active');
    Route::put('/policy/enrollment-lists/{enrollment}/make-inactive', [SuperAdminController::class, 'policyEnrollmentListsMakeInactive'])->name('superadmin.policy.enrollment-lists.make-inactive');
    Route::delete('/policy/enrollment-lists/{enrollment}', [SuperAdminController::class, 'policyEnrollmentListsDestroy'])->name('superadmin.policy.enrollment-lists.destroy');
    Route::get('/policy/enrollment-details/{enrollment}', [SuperAdminController::class, 'policyEnrollmentDetails'])->name('superadmin.policy.enrollment-details');
    Route::get('/policy/open-enrollment-portal/{enrollment}', [SuperAdminController::class, 'openEnrollmentPortal'])->name('superadmin.open-enrollment-portal');
    Route::post('/create-enrollment-period/{enrollment}', [SuperAdminController::class, 'createEnrollmentPeriod'])->name('superadmin.create-enrollment-period');
    Route::get('/select-employees-for-portal/{enrollmentPeriod}', [SuperAdminController::class, 'selectEmployeesForPortal'])->name('superadmin.select-employees-for-portal');
    Route::post('/policy/employee-mapping', [SuperAdminController::class, 'employeeMapping'])->name('superadmin.policy.employee-mapping');
    Route::get('/view-live-portal/{enrollmentPeriod}', [SuperAdminController::class, 'viewLivePortal'])->name('superadmin.view-live-portal');
    Route::get('/view-enrollment-period-details/{enrollmentPeriod}', [SuperAdminController::class, 'viewEnrollmentPeriodDetails'])->name('superadmin.view-enrollment-period-details');
    Route::get('/enrollment-period-details/{enrollmentPeriod}', [SuperAdminController::class, 'enrollmentPeriodDetails'])->name('superadmin.enrollment-period-details');
    Route::get('/policy/edit-enrollment-period/{enrollmentPeriod}', [SuperAdminController::class, 'editEnrollmentPeriod'])->name('superadmin.edit-enrollment-period');
    Route::put('/update-enrollment-period/{enrollmentPeriod}', [SuperAdminController::class, 'updateEnrollmentPeriod'])->name('superadmin.update-enrollment-period');

    // Policy Users Routes
    Route::get('/policy/policy-users', [SuperAdminController::class, 'policyUsers'])->name('superadmin.policy.policy-users.index');

    // Policies Routes
    Route::get('/policy/policies', [SuperAdminController::class, 'policies'])->name('superadmin.policy.policies.index');
    Route::get('/policy/policies/create', [SuperAdminController::class, 'createPolicy'])->name('superadmin.policy.policies.create');
    Route::post('/policy/policies', [SuperAdminController::class, 'storePolicy'])->name('superadmin.policy.policies.store');
    Route::get('/policy/policies/{policy}', [SuperAdminController::class, 'showPolicy'])->name('superadmin.policy.policies.show');
    Route::get('/policy/policies/{policy}/edit', [SuperAdminController::class, 'editPolicy'])->name('superadmin.policy.policies.edit');
    Route::put('/policy/policies/{policy}', [SuperAdminController::class, 'updatePolicy'])->name('superadmin.policy.policies.update');
    Route::delete('/policy/policies/{policy}', [SuperAdminController::class, 'destroyPolicy'])->name('superadmin.policy.policies.destroy');

    // Fill Enrollment Routes
    Route::get('/fill-enrollment/{enrollmentPeriod}/employee/{employee}', [SuperAdminController::class, 'fillEnrollment'])->name('superadmin.fill-enrollment');
    Route::post('/fill-enrollment/submit', [SuperAdminController::class, 'submitEnrollment'])->name('superadmin.submit-enrollment');
    });
// });
// });

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- Product Pages Routes --- ///////////////////////
///////////////////////////////////////////////////////////////////////////////

