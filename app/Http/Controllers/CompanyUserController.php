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
    public function policies(Request $request)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        // Build the query
        $query = "SELECT policy_master.*, 
                   insurance_master.insurance_company_name, 
                   insurance_master.insurance_comp_icon_url,
                   tpa_master.tpa_company_name as tpa_name
            FROM policy_master 
            INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id 
            LEFT JOIN tpa_master ON policy_master.tpa_id = tpa_master.id
            WHERE policy_master.comp_id = ? 
            AND policy_master.is_active = 1 
            AND policy_master.policy_end_date >= CURDATE() 
            AND policy_master.policy_status = 1";

        $params = [$companyId];

        // Apply filters
        if ($request->filled('policy_type')) {
            $query .= " AND policy_master.policy_type = ?";
            $params[] = $request->policy_type;
        }

        if ($request->filled('ins_id')) {
            $query .= " AND policy_master.ins_id = ?";
            $params[] = $request->ins_id;
        }

        $query .= " ORDER BY policy_master.created_on DESC";

        $policies = \DB::select($query, $params);

        // Calculate statistics
        $stats = [
            'total_policies' => count($policies),
            'total_members' => \DB::table('policy_mapping_master')
                ->whereIn('policy_id', array_column($policies, 'id'))
                ->where('cmp_id', $companyId)
                ->where('status', 1)
                ->count(),
            'active_endorsements' => \DB::table('policy_endorsements')
                ->whereIn('policy_id', array_column($policies, 'id'))
                ->where('cmp_id', $companyId)
                ->where('status', 1)
                ->count(),
        ];

        // Get filter options
        $insuranceCompanies = \DB::table('insurance_master')
            ->select('id', 'insurance_company_name')
            ->where('status', 1)
            ->orderBy('insurance_company_name')
            ->get();

        return Inertia::render('CompanyUser/Policies', [
            'user' => $user,
            'policies' => $policies,
            'stats' => $stats,
            'filters' => $request->only(['policy_type', 'ins_id']),
            'insuranceCompanies' => $insuranceCompanies
        ]);
    }

    /**
     * Show policy details
     */
    public function policyDetails($policyId)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $policy = PolicyMaster::with(['insurance', 'tpa', 'company', 'cdAcMaster'])
            ->where('comp_id', $companyId)
            ->where('id', $policyId)
            ->where('is_active', 1)
            ->first();

        if (!$policy) {
            return redirect()->route('company-user.policies')->with('error', 'Policy not found');
        }

        // Get policy statistics
        $stats = [
            'total_members' => \DB::table('policy_mapping_master')
                ->where('policy_id', $policyId)
                ->where('cmp_id', $companyId)
                ->where('status', 1)
                ->count(),
            'active_endorsements' => \DB::table('policy_endorsements')
                ->where('policy_id', $policyId)
                ->where('cmp_id', $companyId)
                ->where('status', 1)
                ->count(),
            'pending_endorsements' => \DB::table('policy_endorsements')
                ->where('policy_id', $policyId)
                ->where('cmp_id', $companyId)
                ->where('status', 0)
                ->count(),
        ];

        return Inertia::render('CompanyUser/PolicyDetails', [
            'user' => $user,
            'policy' => $policy,
            'stats' => $stats
        ]);
    }

    /**
     * Show policy endorsements
     */
    public function policyEndorsements(Request $request, $policyId)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $policy = PolicyMaster::with(['insurance', 'tpa'])
            ->where('comp_id', $companyId)
            ->where('id', $policyId)
            ->where('is_active', 1)
            ->first();

        if (!$policy) {
            return redirect()->route('company-user.policies')->with('error', 'Policy not found');
        }

        // Get all endorsements for this policy with filters
        $query = \DB::table('policy_endorsements')
            ->where('policy_id', $policyId)
            ->where('cmp_id', $companyId);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('endorsement_no', 'like', '%' . $request->search . '%');
        }

        $endorsements = $query->orderBy('status', 'desc')
            ->orderBy('endorsement_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('CompanyUser/PolicyEndorsements', [
            'user' => $user,
            'policy' => $policy,
            'endorsements' => $endorsements,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show endorsement details page with addition and deletion members
     */
    public function endorsementDetailsPage($endorsementId)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $endorsement = \DB::table('policy_endorsements')
            ->where('id', $endorsementId)
            ->where('cmp_id', $companyId)
            ->first();

        if (!$endorsement) {
            return redirect()->route('company-user.policies')->with('error', 'Endorsement not found');
        }

        $policy = PolicyMaster::with(['insurance', 'tpa', 'company'])->find($endorsement->policy_id);

        if (!$policy) {
            return redirect()->route('company-user.policies')->with('error', 'Policy not found');
        }

        // Determine tpa_table_name and uhid
        $tpa_table_name = '';
        $uhid = '';
        if (isset($policy->is_old) && $policy->is_old == 0) {
            $tpa_id = $policy->tpa_id ?? null;
            if ($tpa_id) {
                $tpa = \DB::table('tpa_master')->where('id', $tpa_id)->first();
                if ($tpa && isset($tpa->tpa_table_name)) {
                    $tpa_table_name = $tpa->tpa_table_name;
                }
                // Set uhid based on tpa_id
                $uhidMap = [
                    60 => 'demo_id', 61 => 'star_id', 62 => 'phs_id', 63 => 'icici_id',
                    64 => 'go_digit_id', 65 => 'vidal_id', 66 => 'fhpl_id', 67 => 'mediassist_id',
                    68 => 'safeway_id', 69 => 'care_id', 70 => 'health_india_id', 71 => 'ewa_id',
                    72 => 'sbi_id', 73 => 'ericson_id', 75 => 'ab_id'
                ];
                $uhid = $uhidMap[$tpa_id] ?? '';
            }
        } elseif (isset($policy->is_old) && $policy->is_old == 2) {
            $tpa_table_name = 'endorsement_data';
            $uhid = 'uhid';
        } else {
            $tpa_table_name = $policy->tpa_table_name ?? '';
            $uhid = '';
        }

        $additionMembers = [];
        $deletionMembers = [];

        if ($tpa_table_name) {
            try {
                $additionMembers = \DB::select("
                    SELECT ce.employees_code, ce.email, ce.full_name, tpa.*, tpa.{$uhid} as uhid
                    FROM {$tpa_table_name} tpa
                    INNER JOIN policy_mapping_master pmm ON tpa.mapping_id = pmm.id
                    INNER JOIN company_employees ce ON ce.id = tpa.emp_id
                    WHERE pmm.policy_id = ?
                        AND pmm.cmp_id = ?
                        AND pmm.status = 1
                        AND tpa.addition_endorsement_id = ?
                        AND tpa.updation_endorsement_id IS NULL
                    ORDER BY tpa.id DESC
                ", [$policy->id, $companyId, $endorsement->id]);

                $deletionMembers = \DB::select("
                    SELECT ce.employees_code, ce.email, ce.full_name, tpa.*, tpa.{$uhid} as uhid
                    FROM {$tpa_table_name} tpa
                    INNER JOIN policy_mapping_master pmm ON tpa.mapping_id = pmm.id
                    INNER JOIN company_employees ce ON ce.id = tpa.emp_id
                    WHERE pmm.policy_id = ?
                        AND pmm.cmp_id = ?
                        AND pmm.status = 1
                        AND tpa.deletion_endorsement_id = ?
                        AND tpa.addition_endorsement_id != 0
                        AND tpa.updated_entry_id IS NULL
                    ORDER BY tpa.id DESC
                ", [$policy->id, $companyId, $endorsement->id]);
            } catch (\Exception $e) {
                \Log::error('Error fetching endorsement members: ' . $e->getMessage());
            }
        }

        return Inertia::render('CompanyUser/EndorsementDetails', [
            'user' => $user,
            'policy' => $policy,
            'endorsement' => $endorsement,
            'additionMembers' => $additionMembers,
            'deletionMembers' => $deletionMembers,
        ]);
    }

    /**
     * Show endorsement details API (for AJAX requests)
     */
    public function endorsementDetails($endorsementId)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        $endorsement = \DB::table('policy_endorsements')
            ->where('id', $endorsementId)
            ->where('cmp_id', $companyId)
            ->first();

        if (!$endorsement) {
            return response()->json(['error' => 'Endorsement not found'], 404);
        }

        $policy = PolicyMaster::find($endorsement->policy_id);

        if (!$policy) {
            return response()->json(['error' => 'Policy not found'], 404);
        }

        // Determine tpa_table_name and uhid
        $tpa_table_name = '';
        $uhid = '';
        if (isset($policy->is_old) && $policy->is_old == 0) {
            $tpa_id = $policy->tpa_id ?? null;
            if ($tpa_id) {
                $tpa = \DB::table('tpa_master')->where('id', $tpa_id)->first();
                if ($tpa && isset($tpa->tpa_table_name)) {
                    $tpa_table_name = $tpa->tpa_table_name;
                }
                // Set uhid based on tpa_id
                $uhidMap = [
                    60 => 'demo_id', 61 => 'star_id', 62 => 'phs_id', 63 => 'icici_id',
                    64 => 'go_digit_id', 65 => 'vidal_id', 66 => 'fhpl_id', 67 => 'mediassist_id',
                    68 => 'safeway_id', 69 => 'care_id', 70 => 'health_india_id', 71 => 'ewa_id',
                    72 => 'sbi_id', 73 => 'ericson_id', 75 => 'ab_id'
                ];
                $uhid = $uhidMap[$tpa_id] ?? '';
            }
        } elseif (isset($policy->is_old) && $policy->is_old == 2) {
            $tpa_table_name = 'endorsement_data';
            $uhid = 'uhid';
        } else {
            $tpa_table_name = $policy->tpa_table_name ?? '';
            $uhid = '';
        }

        $additionMembers = [];
        $deletionMembers = [];

        if ($tpa_table_name) {
            try {
                $additionMembers = \DB::select("
                    SELECT ce.employees_code, ce.email, ce.full_name, tpa.*, tpa.{$uhid} as uhid
                    FROM {$tpa_table_name} tpa
                    INNER JOIN policy_mapping_master pmm ON tpa.mapping_id = pmm.id
                    INNER JOIN company_employees ce ON ce.id = tpa.emp_id
                    WHERE pmm.policy_id = ?
                        AND pmm.cmp_id = ?
                        AND pmm.status = 1
                        AND tpa.addition_endorsement_id = ?
                        AND tpa.updation_endorsement_id IS NULL
                    ORDER BY tpa.id DESC
                ", [$policy->id, $companyId, $endorsement->id]);

                $deletionMembers = \DB::select("
                    SELECT ce.employees_code, ce.email, ce.full_name, tpa.*, tpa.{$uhid} as uhid
                    FROM {$tpa_table_name} tpa
                    INNER JOIN policy_mapping_master pmm ON tpa.mapping_id = pmm.id
                    INNER JOIN company_employees ce ON ce.id = tpa.emp_id
                    WHERE pmm.policy_id = ?
                        AND pmm.cmp_id = ?
                        AND pmm.status = 1
                        AND tpa.deletion_endorsement_id = ?
                        AND tpa.addition_endorsement_id != 0
                        AND tpa.updated_entry_id IS NULL
                    ORDER BY tpa.id DESC
                ", [$policy->id, $companyId, $endorsement->id]);
            } catch (\Exception $e) {
                \Log::error('Error fetching endorsement members: ' . $e->getMessage());
            }
        }

        return response()->json([
            'additionMembers' => $additionMembers,
            'deletionMembers' => $deletionMembers
        ]);
    }

    /**
     * Show enrollments list for company
     */
    public function enrollments(Request $request)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        // Get search and filter parameters
        $search = $request->input('search');
        $status = $request->input('status');

        $enrollments = EnrollmentDetail::with(['company'])
            ->where('cmp_id', $companyId)
            ->when($search, function($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('enrolment_name', 'LIKE', "%{$search}%")
                      ->orWhere('corporate_enrolment_name', 'LIKE', "%{$search}%");
                });
            })
            ->when($status !== null && $status !== '', function($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('CompanyUser/Enrollments', [
            'user' => $user,
            'enrollments' => $enrollments,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ]
        ]);
    }

    /**
     * Show enrollment details with periods
     */
    public function enrollmentDetails($id)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        // Get enrollment detail - ensure it belongs to this company
        $enrollmentDetail = EnrollmentDetail::with('company')
            ->where('id', $id)
            ->where('cmp_id', $companyId)
            ->firstOrFail();

        // Get enrollment periods
        $enrollmentPeriods = \DB::select("
            SELECT enrolment_period.*, enrolment_details.corporate_enrolment_name
            FROM enrolment_period
            INNER JOIN enrolment_details ON enrolment_period.enrolment_id = enrolment_details.id
            WHERE enrolment_period.enrolment_id = ?
            AND enrolment_details.cmp_id = ?
            ORDER BY enrolment_period.portal_end_date DESC
        ", [$id, $companyId]);

        return Inertia::render('CompanyUser/EnrollmentDetails', [
            'user' => $user,
            'enrollmentDetail' => $enrollmentDetail,
            'enrollmentPeriods' => $enrollmentPeriods
        ]);
    }

    /**
     * Show enrollment portal with mapped employees
     */
    public function enrollmentPortal($enrollmentPeriodId)
    {
        $user = Session::get('company_user', []);
        $companyId = $user['company_id'] ?? null;

        // Get enrollment period
        $enrollmentPeriod = \DB::table('enrolment_period')->where('id', $enrollmentPeriodId)->first();

        if (!$enrollmentPeriod) {
            abort(404, 'Enrollment period not found');
        }

        // Get enrollment detail - ensure it belongs to this company
        $enrollmentDetail = \DB::table('enrolment_details')
            ->where('id', $enrollmentPeriod->enrolment_id)
            ->where('cmp_id', $companyId)
            ->first();

        if (!$enrollmentDetail) {
            abort(403, 'Unauthorized access');
        }

        // Get total selected employees count
        $totalSelectedEmployees = \DB::table('enrolment_mapping_master')
            ->where('status', 1)
            ->where('enrolment_period_id', $enrollmentPeriodId)
            ->where('enrolment_id', $enrollmentPeriod->enrolment_id)
            ->count();

        // Get total enrolled employees count
        $totalEnrolledEmployees = \DB::table('enrolment_mapping_master')
            ->where('status', 1)
            ->where('enrolment_period_id', $enrollmentPeriodId)
            ->where('enrolment_id', $enrollmentPeriod->enrolment_id)
            ->where('submit_status', 1)
            ->count();

        // Get employees with their enrollment status
        $employees = \DB::select("
            SELECT ce.*, emm.submit_status, emm.view_status,
                CASE 
                    WHEN emm.submit_status = 1 THEN 'ENROLLED'
                    WHEN emm.view_status = 1 THEN 'VISITED'
                    ELSE 'NOT VISITED'
                END as status
            FROM enrolment_mapping_master emm
            INNER JOIN company_employees ce ON emm.emp_id = ce.id
            WHERE emm.enrolment_id = ?
            AND emm.enrolment_period_id = ?
            AND emm.status = 1
            AND ce.company_id = ?
            ORDER BY ce.full_name ASC
        ", [$enrollmentPeriod->enrolment_id, $enrollmentPeriodId, $companyId]);

        return Inertia::render('CompanyUser/EnrollmentPortal', [
            'user' => $user,
            'enrollmentPeriod' => $enrollmentPeriod,
            'enrollmentDetail' => $enrollmentDetail,
            'totalSelectedEmployees' => $totalSelectedEmployees,
            'totalEnrolledEmployees' => $totalEnrolledEmployees,
            'employees' => $employees
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
