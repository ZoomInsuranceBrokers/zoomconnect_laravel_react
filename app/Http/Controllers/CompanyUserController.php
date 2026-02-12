<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use App\Models\CompanyEmployee;
use App\Models\PolicyMaster;
use App\Models\EnrollmentData;
use App\Models\CompanyAssignSurvey;
use App\Models\CompanyLocationMaster;
use App\Models\EnrollmentDetail;
use App\Models\CdMaster;
use Carbon\Carbon;

class CompanyUserController extends Controller
{
    /**
     * Show company user dashboard
     */
    public function dashboard()
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // Active Employees
        $activeEmployees = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 1)
            ->count();

        $employeesJoinedLast30Days = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('created_on', '>=', $thirtyDaysAgo)
            ->count();

        // Policies
        $totalPolicies = PolicyMaster::where('comp_id', $companyId)
            ->where('is_active', 1)
            ->count();

        $policiesAddedLast30Days = PolicyMaster::where('comp_id', $companyId)
            ->where('is_active', 1)
            ->where('created_on', '>=', $thirtyDaysAgo)
            ->count();

        // Employees Left (inactive)
        $employeesLeft = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 0)
            ->count();

        $employeesLeftLast30Days = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 0)
            ->where('updated_on', '>=', $thirtyDaysAgo)
            ->count();

        // Total Entities (Locations)
        $totalEntities = CompanyLocationMaster::where('comp_id', $companyId)
            ->where('status', 1)
            ->count();

        $entitiesAddedLast30Days = CompanyLocationMaster::where('comp_id', $companyId)
            ->where('status', 1)
            ->where('created_on', '>=', $thirtyDaysAgo)
            ->count();

        // Family Definition Bifurcation
        // Relation is stored on EnrollmentData, so aggregate from that table
        $familyBifurcation = EnrollmentData::join('company_employees', 'enrollment_data.emp_id', '=', 'company_employees.id')
            ->where('company_employees.company_id', $companyId)
            ->where('enrollment_data.is_delete', 0)
            ->selectRaw('COALESCE(enrollment_data.relation, "SELF") as relation, COUNT(*) as count')
            ->groupBy('enrollment_data.relation')
            ->get()
            ->mapWithKeys(function($item) {
                return [$item->relation => $item->count];
            });

        // Gender wise bifurcation
        $genderBifurcation = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 1)
            ->selectRaw('gender, COUNT(*) as count')
            ->groupBy('gender')
            ->get()
            ->mapWithKeys(function($item) {
                return [$item->gender => $item->count];
            });

        // Active GMC Policies
        $activePolicies = PolicyMaster::with(['insurance', 'tpa'])
            ->where('comp_id', $companyId)
            ->where('is_active', 1)
            ->get();

        // CD Accounts
        $cdAccounts = CdMaster::where('comp_id', $companyId)
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get dashboard statistics
        $stats = [
            'active_employees' => $activeEmployees,
            'employees_joined_last_30_days' => $employeesJoinedLast30Days,
            'total_policies' => $totalPolicies,
            'policies_added_last_30_days' => $policiesAddedLast30Days,
            'employees_left' => $employeesLeft,
            'employees_left_last_30_days' => $employeesLeftLast30Days,
            'total_entities' => $totalEntities,
            'entities_added_last_30_days' => $entitiesAddedLast30Days,
            'family_bifurcation' => $familyBifurcation,
            'gender_bifurcation' => $genderBifurcation,
            'total_employees' => $activeEmployees + $employeesLeft,
        ];

        return Inertia::render('CompanyUser/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'activePolicies' => $activePolicies,
            'cdAccounts' => $cdAccounts,
        ]);
    }

    /**
     * Show employees list
     */
    public function employees(Request $request)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        // Build query
        $query = CompanyEmployee::with(['company', 'location'])
            ->where('company_id', $companyId)
            ->where('is_delete', 0);

        // Apply filters if provided
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('employees_code', 'like', "%{$search}%")
                  ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('designation')) {
            $query->where('designation', 'like', "%{$request->designation}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // Get paginated employees
        $employees = $query->orderBy('created_on', 'desc')->paginate(15);

        // Calculate statistics
        $totalEmployees = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->count();

        $activeEmployees = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 1)
            ->count();

        $inactiveEmployees = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->where('is_active', 0)
            ->count();

        $newThisMonth = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->whereMonth('created_on', Carbon::now()->month)
            ->whereYear('created_on', Carbon::now()->year)
            ->count();

        // Get unique locations and grades for filters
        $locations = CompanyLocationMaster::where('comp_id', $companyId)
            ->where('status', 1)
            ->select('id', 'branch_name')
            ->get();

        $grades = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->whereNotNull('grade')
            ->distinct()
            ->pluck('grade');

        $designations = CompanyEmployee::where('company_id', $companyId)
            ->where('is_delete', 0)
            ->whereNotNull('designation')
            ->distinct()
            ->pluck('designation');

        return Inertia::render('CompanyUser/Employees', [
            'user' => $user,
            'employees' => $employees,
            'stats' => [
                'total' => $totalEmployees,
                'active' => $activeEmployees,
                'inactive' => $inactiveEmployees,
                'new_this_month' => $newThisMonth,
            ],
            'filters' => [
                'locations' => $locations,
                'grades' => $grades,
                'designations' => $designations,
            ],
            'currentFilters' => $request->only(['search', 'location_id', 'grade', 'designation', 'is_active', 'gender'])
        ]);
    }

    /**
     * Show policies list
     */
    public function policies()
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $policies = PolicyMaster::with(['insurance', 'tpa'])
            ->where('comp_id', $companyId)
            ->where('is_delete', 0)
            ->orderBy('created_on', 'desc')
            ->paginate(20);

        return Inertia::render('CompanyUser/Policies', [
            'user' => $user,
            'policies' => $policies
        ]);
    }

    /**
     * Show enrollments list
     */
    public function enrollments()
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $enrollments = EnrollmentData::with(['employee', 'policy', 'period'])
            ->whereHas('employee', function($query) use ($companyId) {
                $query->where('company_id', $companyId);
            })
            ->orderBy('created_on', 'desc')
            ->paginate(20);

        return Inertia::render('CompanyUser/Enrollments', [
            'user' => $user,
            'enrollments' => $enrollments
        ]);
    }

    /**
     * Show survey list
     */
    public function survey()
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $surveys = CompanyAssignSurvey::with(['survey', 'company'])
            ->where('comp_id', $companyId)
            ->orderBy('created_on', 'desc')
            ->paginate(20);

        return Inertia::render('CompanyUser/Survey', [
            'user' => $user,
            'surveys' => $surveys
        ]);
    }
}
