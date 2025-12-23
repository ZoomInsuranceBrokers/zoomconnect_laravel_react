<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SuperAdminController;
use Illuminate\Http\Request;
use App\Models\UserMaster;
use App\Services\PermissionService;
use App\Http\Controllers\ProductController;
use App\Services\PHPMailerService;
use App\Services\MailService;

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
    Route::get('/surveys', function () {
        return Inertia::render('Public/Products/Surveys');
    })->name('surveys');
    Route::get('/telehealth-services', [ProductController::class, 'telehealthServices'])->name('telehealth-services');
});

Route::get('/employee', [App\Http\Controllers\ProductController::class, 'employee'])->name('employee');
Route::get('/employer', [App\Http\Controllers\ProductController::class, 'employer'])->name('employer');
Route::get('/mobile', [App\Http\Controllers\ProductController::class, 'mobile'])->name('mobile');

// Solutions (grouped under /solutions)
Route::prefix('solutions')->name('solutions.')->group(function () {
    Route::get('/small-teams', [App\Http\Controllers\ProductController::class, 'smallTeams'])->name('smallTeams');
    Route::get('/large-teams', [App\Http\Controllers\ProductController::class, 'largeTeams'])->name('largeTeams');
    Route::get('/medium-teams', [App\Http\Controllers\ProductController::class, 'mediumTeams'])->name('mediumTeams');
});

// Explore
Route::get('/resources', [App\Http\Controllers\ProductController::class, 'resources'])->name('resources');
Route::get('/resources/{slug}', [App\Http\Controllers\ProductController::class, 'resourceShow'])->name('resources.show');
Route::get('/blog', [App\Http\Controllers\ProductController::class, 'blog'])->name('blog');
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

Route::middleware([\App\Http\Middleware\RedirectIfSuperadmin::class])->group(function () {
    Route::get('/login', [AuthController::class, 'superadminLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'processLogin'])->name('login.process');
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->name('verify.otp');
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- SuperAdmin Login --- ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Route::middleware(['auth.session'])->group(function () {
// Logout route without prefix
Route::post('/logout', [SuperAdminController::class, 'logout'])->name('logout');

// SuperAdmin routes with prefix
Route::middleware([\App\Http\Middleware\EnsureSuperadminAuthenticated::class, 'permission'])->prefix('superadmin')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'dashboard'])->name('superadmin.dashboard');

    // Debug route: return session superadmin_user, resolved roleId and userId
    Route::get('/session-user', function (Request $request) {
        $sessionUser = session('superadmin_user');
        if (!$sessionUser || !is_array($sessionUser) || !isset($sessionUser['email'])) {
            return response()->json(['ok' => false, 'message' => 'no session user', 'session' => $sessionUser]);
        }
        $user = UserMaster::where('email', $sessionUser['email'])->first();
        $roleId = $user ? $user->role_id : null;
        $userId = $user ? $user->user_id : null;
        $permissions = [];
        if ($roleId) {
            $perms = PermissionService::getPermissionsForFrontend($roleId);
            $permissions = [
                'routes' => $perms['routes'] ?? [],
                'modules' => $perms['modules'] ?? [],
                'routeKeys' => array_keys($perms['routes'] ?? []),
            ];
        }

        return response()->json([
            'ok' => true,
            'session_user' => $sessionUser,
            'roleId' => $roleId,
            'userId' => $userId,
            'permissions' => $permissions,
        ]);
    })->name('superadmin.session.user');

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
    Route::get('/corporate/{company}/edit', [SuperAdminController::class, 'corporateEdit'])->name('corporate.edit');
    Route::put('/corporate/{company}', [SuperAdminController::class, 'corporateUpdate'])->name('corporate.update');
    Route::put('/corporate/{company}/toggle-status', [SuperAdminController::class, 'corporateToggleStatus'])->name('corporate.toggle-status');
    // Manage employees/entity for a company
    Route::get('/corporate/{company}/manage-employees', [SuperAdminController::class, 'manageCompanyEmployees'])->name('corporate.manage-employees');
    Route::get('/corporate/{company}/manage-entity', [SuperAdminController::class, 'manageCompanyEntity'])->name('corporate.manage-entity');
    // Get employee policies
    Route::get('/employee/{employee}/policies', [SuperAdminController::class, 'getEmployeePolicies'])->name('employee.policies');
    // Add Single Employee form (single entry) and store
    Route::get('/corporate/{company}/employee/create', [SuperAdminController::class, 'addSingleEmployee'])->name('corporate.employee.create');
    Route::post('/corporate/{company}/employee', [SuperAdminController::class, 'storeEmployee'])->name('corporate.employee.store');
    // Edit and Update Employee
    Route::get('/corporate/{company}/employee/{employee}/edit', [SuperAdminController::class, 'editEmployee'])->name('corporate.employee.edit');
    Route::put('/corporate/{company}/employee/{employee}', [SuperAdminController::class, 'updateEmployeeFull'])->name('corporate.employee.update');
    // Employee update / toggle status (modal inline edit)
    Route::put('/employee/{employee}', [SuperAdminController::class, 'updateEmployee'])->name('employee.update');
    Route::put('/employee/{employee}/toggle-status', [SuperAdminController::class, 'employeeToggleStatus'])->name('employee.toggle-status');

    // Entity (Location) Management Routes
    Route::get('/corporate/{company}/entity/create', [SuperAdminController::class, 'createEntity'])->name('corporate.entity.create');
    Route::post('/corporate/{company}/entity', [SuperAdminController::class, 'storeEntity'])->name('corporate.entity.store');
    Route::get('/corporate/{company}/entity/{entity}/edit', [SuperAdminController::class, 'editEntity'])->name('corporate.entity.edit');
    Route::put('/corporate/{company}/entity/{entity}', [SuperAdminController::class, 'updateEntity'])->name('corporate.entity.update');
    Route::put('/entity/{entity}/toggle-status', [SuperAdminController::class, 'entityToggleStatus'])->name('entity.toggle-status');

    // Bulk Employee Actions Routes
    Route::get('/corporate/{company}/bulk-employee-actions', [SuperAdminController::class, 'bulkEmployeeActions'])->name('corporate.bulk-employee-actions');
    Route::get('/corporate/{company}/bulk-upload-employee', [SuperAdminController::class, 'bulkUploadEmployee'])->name('corporate.bulk-upload-employee');
    Route::get('/corporate/{company}/bulk-remove-employee', [SuperAdminController::class, 'bulkRemoveEmployee'])->name('corporate.bulk-remove-employee');
    Route::get('/download-sample-csv/{type}', [SuperAdminController::class, 'downloadSampleCsv'])->name('download-sample-csv');
    Route::post('/corporate/{company}/upload-bulk-csv', [SuperAdminController::class, 'uploadBulkCsv'])->name('corporate.upload-bulk-csv');
    Route::post('/corporate/{company}/process-bulk-action', [SuperAdminController::class, 'processBulkAction'])->name('corporate.process-bulk-action');
    Route::get('/bulk-action/{action}/download/{type}', [SuperAdminController::class, 'downloadBulkActionFile'])->name('bulk-action.download-file');
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
    Route::get('/marketing/welcome-mailer/create', [SuperAdminController::class, 'marketingWelcomeMailerCreate'])->name('superadmin.marketing.welcome-mailer.create');
    Route::get('/marketing/welcome-mailer/company/{companyId}/policies', [SuperAdminController::class, 'marketingWelcomeMailerCompanyPolicies'])->name('superadmin.marketing.welcome-mailer.policies');
    Route::get('/marketing/welcome-mailer/policy/{policyId}/endorsements', [SuperAdminController::class, 'marketingWelcomeMailerPolicyEndorsements'])->name('superadmin.marketing.welcome-mailer.endorsements');
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
    Route::get('/marketing/push-notifications/create', [SuperAdminController::class, 'marketingPushNotificationsCreate'])->name('superadmin.marketing.push-notifications.create');
    Route::post('/marketing/push-notifications', [SuperAdminController::class, 'marketingPushNotificationsStore'])->name('superadmin.marketing.push-notifications.store');
    Route::put('/marketing/push-notifications/{notification}', [SuperAdminController::class, 'marketingPushNotificationsUpdate'])->name('superadmin.marketing.push-notifications.update');
    Route::delete('/marketing/push-notifications/{notification}', [SuperAdminController::class, 'marketingPushNotificationsDestroy'])->name('superadmin.marketing.push-notifications.destroy');

    // Admin -> FAQs Routes
    Route::get('/admin/faqs', [SuperAdminController::class, 'adminFaqsIndex'])->name('superadmin.admin.faqs.index');
    Route::post('/admin/faqs', [SuperAdminController::class, 'adminFaqsStore'])->name('superadmin.admin.faqs.store');
    Route::put('/admin/faqs/{faq}', [SuperAdminController::class, 'adminFaqsUpdate'])->name('superadmin.admin.faqs.update');
    Route::delete('/admin/faqs/{faq}', [SuperAdminController::class, 'adminFaqsDestroy'])->name('superadmin.admin.faqs.destroy');

    // Admin -> Blogs Routes
    Route::get('/admin/blogs', [SuperAdminController::class, 'adminBlogsIndex'])->name('superadmin.admin.blogs.index');
    Route::get('/admin/blogs/create', [SuperAdminController::class, 'adminBlogsCreate'])->name('superadmin.admin.blogs.create');
    Route::post('/admin/blogs', [SuperAdminController::class, 'adminBlogsStore'])->name('superadmin.admin.blogs.store');
    Route::get('/admin/blogs/{blog}/edit', [SuperAdminController::class, 'adminBlogsEdit'])->name('superadmin.admin.blogs.edit');
    Route::put('/admin/blogs/{blog}', [SuperAdminController::class, 'adminBlogsUpdate'])->name('superadmin.admin.blogs.update');
    Route::delete('/admin/blogs/{blog}', [SuperAdminController::class, 'adminBlogsDestroy'])->name('superadmin.admin.blogs.destroy');

    // Admin -> Surveys Routes
    Route::get('/admin/surveys', [SuperAdminController::class, 'adminSurveysIndex'])->name('superadmin.admin.surveys.index');
    Route::get('/admin/surveys/create', [SuperAdminController::class, 'adminSurveysCreate'])->name('superadmin.admin.surveys.create');
    Route::post('/admin/surveys', [SuperAdminController::class, 'adminSurveysStore'])->name('superadmin.admin.surveys.store');
    Route::get('/admin/surveys/{survey}/edit', [SuperAdminController::class, 'adminSurveysEdit'])->name('superadmin.admin.surveys.edit');
    Route::put('/admin/surveys/{survey}', [SuperAdminController::class, 'adminSurveysUpdate'])->name('superadmin.admin.surveys.update');
    Route::delete('/admin/surveys/{survey}', [SuperAdminController::class, 'adminSurveysDestroy'])->name('superadmin.admin.surveys.destroy');
    Route::get('/admin/surveys/{survey}/questions', [SuperAdminController::class, 'adminSurveyQuestions'])->name('superadmin.admin.surveys.questions');
    Route::post('/admin/surveys/{survey}/questions', [SuperAdminController::class, 'adminSurveyQuestionsStore'])->name('superadmin.admin.surveys.questions.store');
    Route::get('/admin/surveys/{survey}/assign', [SuperAdminController::class, 'adminSurveyAssign'])->name('superadmin.admin.surveys.assign');
    Route::post('/admin/surveys/{survey}/assign', [SuperAdminController::class, 'adminSurveyAssignStore'])->name('superadmin.admin.surveys.assign.store');
    Route::put('/admin/surveys/assignment/{assignment}', [SuperAdminController::class, 'adminSurveyAssignmentUpdate'])->name('superadmin.admin.surveys.assignment.update');
    Route::delete('/admin/surveys/assignment/{assignment}', [SuperAdminController::class, 'adminSurveyAssignmentDelete'])->name('superadmin.admin.surveys.assignment.delete');
    Route::get('/admin/surveys/reports', [SuperAdminController::class, 'adminSurveysReports'])->name('superadmin.admin.surveys.reports');

    // Admin -> Resources Routes
    Route::get('/admin/resources', [SuperAdminController::class, 'adminResourcesIndex'])->name('superadmin.admin.resources.index');
    Route::get('/admin/resources/create', [SuperAdminController::class, 'adminResourcesCreate'])->name('superadmin.admin.resources.create');
    Route::post('/admin/resources', [SuperAdminController::class, 'adminResourcesStore'])->name('superadmin.admin.resources.store');
    Route::get('/admin/resources/{resource}/edit', [SuperAdminController::class, 'adminResourcesEdit'])->name('superadmin.admin.resources.edit');
    Route::put('/admin/resources/{resource}', [SuperAdminController::class, 'adminResourcesUpdate'])->name('superadmin.admin.resources.update');
    Route::delete('/admin/resources/{resource}', [SuperAdminController::class, 'adminResourcesDestroy'])->name('superadmin.admin.resources.destroy');

    // Admin -> Roles & Permissions Routes
    Route::get('/admin/roles-permissions', [\App\Http\Controllers\RolePermissionController::class, 'index'])->name('superadmin.admin.roles-permissions.index');

    // Admin -> Users Routes
    Route::get('/admin/users', [SuperAdminController::class, 'adminUsersIndex'])->name('superadmin.admin.users.index');
    Route::post('/admin/users', [SuperAdminController::class, 'adminUsersStore'])->name('superadmin.admin.users.store');
    Route::put('/admin/users/{user}', [SuperAdminController::class, 'adminUsersUpdate'])->name('superadmin.admin.users.update');
    Route::put('/admin/users/{user}/toggle-active', [SuperAdminController::class, 'adminUsersToggleActive'])->name('superadmin.admin.users.toggle-active');
    Route::get('/admin/roles/{roleId}/permissions-manage', [\App\Http\Controllers\RolePermissionController::class, 'managePermissions'])->name('superadmin.admin.roles.permissions.manage');
    Route::get('/admin/roles/{roleId}/permissions', [\App\Http\Controllers\RolePermissionController::class, 'getRolePermissions'])->name('superadmin.admin.roles.permissions');
    Route::post('/admin/roles/{roleId}/permissions', [\App\Http\Controllers\RolePermissionController::class, 'updatePermissions'])->name('superadmin.admin.roles.permissions.update');
    Route::post('/admin/roles', [\App\Http\Controllers\RolePermissionController::class, 'createRole'])->name('superadmin.admin.roles.create');
    Route::put('/admin/roles/{id}', [\App\Http\Controllers\RolePermissionController::class, 'updateRole'])->name('superadmin.admin.roles.update');
    Route::delete('/admin/roles/{id}', [\App\Http\Controllers\RolePermissionController::class, 'deleteRole'])->name('superadmin.admin.roles.delete');

    // Insurance Routes
    Route::get('/policy/insurance', [SuperAdminController::class, 'insuranceIndex'])->name('superadmin.policy.insurance.index');
    Route::get('/policy/insurance/create', [SuperAdminController::class, 'insuranceCreate'])->name('superadmin.policy.insurance.create');
    Route::post('/policy/insurance', [SuperAdminController::class, 'insuranceStore'])->name('superadmin.policy.insurance.store');
    Route::get('/policy/insurance/{insurance}/edit', [SuperAdminController::class, 'insuranceEdit'])->name('superadmin.policy.insurance.edit');
    Route::put('/policy/insurance/{insurance}', [SuperAdminController::class, 'insuranceUpdate'])->name('superadmin.policy.insurance.update');
    Route::put('/policy/insurance/{insurance}/toggle-status', [SuperAdminController::class, 'insuranceToggleStatus'])->name('superadmin.policy.insurance.toggle-status');
    Route::delete('/policy/insurance/{insurance}', [SuperAdminController::class, 'insuranceDestroy'])->name('superadmin.policy.insurance.destroy');

    // TPA Routes
    Route::get('/policy/tpa', [SuperAdminController::class, 'tpaIndex'])->name('superadmin.policy.tpa.index');
    Route::get('/policy/tpa/create', [SuperAdminController::class, 'tpaCreate'])->name('superadmin.policy.tpa.create');
    Route::post('/policy/tpa', [SuperAdminController::class, 'tpaStore'])->name('superadmin.policy.tpa.store');
    Route::get('/policy/tpa/{tpa}/edit', [SuperAdminController::class, 'tpaEdit'])->name('superadmin.policy.tpa.edit');
    Route::put('/policy/tpa/{tpa}', [SuperAdminController::class, 'tpaUpdate'])->name('superadmin.policy.tpa.update');
    Route::put('/policy/tpa/{tpa}/toggle-status', [SuperAdminController::class, 'tpaToggleStatus'])->name('superadmin.policy.tpa.toggle-status');
    Route::delete('/policy/tpa/{tpa}', [SuperAdminController::class, 'tpaDestroy'])->name('superadmin.policy.tpa.destroy');

    // Enrollment Lists
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
    Route::post('/policy/policy-users/store', [SuperAdminController::class, 'storePolicyUser'])->name('superadmin.policy-users.store');
    Route::post('/policy/policy-users/{id}/update', [SuperAdminController::class, 'updatePolicyUser'])->name('superadmin.policy-users.update');
    Route::post('/policy/policy-users/{id}/toggle', [SuperAdminController::class, 'togglePolicyUser'])->name('superadmin.policy-users.toggle');
    Route::post('/policy/policy-users/{id}/deactivate-assign', [SuperAdminController::class, 'deactivateAssignPolicyUser'])->name('superadmin.policy-users.deactivate-assign');

    // Policies Routes
    Route::get('/policy/policies', [SuperAdminController::class, 'policies'])->name('superadmin.policy.policies.index');
    Route::get('/policy/policies/create', [SuperAdminController::class, 'createPolicy'])->name('superadmin.policy.policies.create');
    // Endorsements list
    Route::get('/policy/endorsements', [SuperAdminController::class, 'endorsements'])->name('superadmin.policy.endorsements.index');
    // Show single endorsement
    Route::get('/policy/endorsements/{endorsement}', [SuperAdminController::class, 'showPolicyEndorsement'])->name('superadmin.policy.endorsements.show');
    // Update endorsement
    Route::put('/policy/endorsements/{endorsement}', [SuperAdminController::class, 'updatePolicyEndorsement'])->name('superadmin.policy.endorsements.update');
    Route::get('/policy/policies/cd-accounts/{companyId}', [SuperAdminController::class, 'getCdAccountsByCompany'])->name('superadmin.policy.policies.cd-accounts');
    Route::post('/policy/policies', [SuperAdminController::class, 'storePolicy'])->name('superadmin.policy.policies.store');
    Route::get('/policy/policies/{policy}', [SuperAdminController::class, 'showPolicy'])->name('superadmin.policy.policies.show');
    // List endorsements for a policy and create new endorsement
    Route::get('/policy/policies/{policy}/endorsements', [SuperAdminController::class, 'policyEndorsements'])->name('superadmin.policy.policies.endorsements');
    Route::post('/policy/policies/{policy}/endorsements', [SuperAdminController::class, 'storePolicyEndorsement'])->name('superadmin.policy.policies.endorsements.store');
    Route::get('/policy/policies/{policy}/edit', [SuperAdminController::class, 'editPolicy'])->name('superadmin.policy.policies.edit');
    Route::put('/policy/policies/{policy}', [SuperAdminController::class, 'updatePolicy'])->name('superadmin.policy.policies.update');
    Route::delete('/policy/policies/{policy}', [SuperAdminController::class, 'destroyPolicy'])->name('superadmin.policy.policies.destroy');

    // Fill Enrollment Routes
    Route::get('/fill-enrollment/{enrollmentPeriod}/employee/{employee}', [SuperAdminController::class, 'fillEnrollment'])->name('superadmin.fill-enrollment');
    Route::post('/fill-enrollment/submit', [SuperAdminController::class, 'submitEnrollment'])->name('superadmin.submit-enrollment');

 // CD Accounts Routes
    Route::get('/policy/cd-accounts', [SuperAdminController::class, 'cdAccountsIndex'])->name('superadmin.policy.cd-accounts.index');
    Route::get('/policy/cd-accounts/create', [SuperAdminController::class, 'cdAccountsCreate'])->name('superadmin.policy.cd-accounts.create');
    Route::post('/policy/cd-accounts', [SuperAdminController::class, 'cdAccountsStore'])->name('superadmin.policy.cd-accounts.store');
    Route::get('/policy/cd-accounts/{id}/edit', [SuperAdminController::class, 'cdAccountsEdit'])->name('superadmin.policy.cd-accounts.edit');
    Route::get('/policy/cd-accounts/{id}/cd-details', [SuperAdminController::class, 'cdAccountsDetails'])->name('superadmin.policy.cd-accounts.cd-details');
    Route::put('/policy/cd-accounts/{id}', [SuperAdminController::class, 'cdAccountsUpdate'])->name('superadmin.policy.cd-accounts.update');
    Route::put('/policy/cd-accounts/{id}/toggle-active', [SuperAdminController::class, 'cdAccountsToggleActive'])->name('superadmin.policy.cd-accounts.toggle-active');
    Route::post('/policy/cd-accounts/transaction', [SuperAdminController::class, 'cdAccountsTransactionStore']);
    Route::delete('/policy/cd-accounts/transaction/{id}', [SuperAdminController::class, 'cdAccountsTransactionDelete']);
    // Wellness Module Routes
   
});
// });
// });

////////////////////////////////////////////////////////////////////////////////
///////////////////////// --- Product Pages Routes --- ///////////////////////
///////////////////////////////////////////////////////////////////////////////
