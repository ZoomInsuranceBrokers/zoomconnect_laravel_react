<?php

namespace App\Http\Controllers;

use App\Models\CorporateLabel;
use App\Models\CorporateGroup;
use App\Models\CompanyEmployee;
use App\Models\CompanyMaster;
use App\Models\MessageTemplate;
use App\Models\UserMaster;
use App\Models\WellnessService;
use App\Models\WellnessCategory;
use App\Models\Vendor;
use App\Models\FaqMaster;
use App\Models\EnrollmentDetail;
use App\Models\EnrollmentConfig;
use App\Models\PolicyMaster;
use App\Models\InsuranceMaster;
use App\Models\EscalationUser;
use App\Models\BlogMaster;
use App\Models\Resource;
use App\Models\PushNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Jobs\ReplaceEscalationUserJob;
use App\Jobs\SendPushNotificationJob;

class SuperAdminController extends Controller
{
    public function dashboard()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        return Inertia::render('superadmin/SuperAdminDashboard', [
            'user' => $user
        ]);
    }

    public function logout()
    {
        Session::forget('superadmin_logged_in');
        Session::forget('superadmin_user');
        Session::flush(); // Optional: clear entire session

        return redirect()->route('login')->with('success', 'Logged out successfully');
    }

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate Labels ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    public function corporateLabelsIndex()
    {
        $labels = CorporateLabel::orderBy('label', 'asc')->get();

        return Inertia::render('superadmin/corporate/labels/Index', [
            'labels' => $labels
        ]);
    }

    public function corporateLabelsStore(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:255|unique:corporate_labels,label',
            'remark' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        CorporateLabel::create([
            'label' => $request->label,
            'remark' => $request->remark,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('corporate.labels.index')
            ->with('success', 'Corporate label created successfully.');
    }

    public function corporateLabelsUpdate(Request $request, CorporateLabel $label)
    {
        $request->validate([
            'label' => 'required|string|max:255|unique:corporate_labels,label,' . $label->id,
            'remark' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $label->update([
            'label' => $request->label,
            'remark' => $request->remark,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('corporate.labels.index')
            ->with('success', 'Corporate label updated successfully.');
    }

    public function corporateLabelsDestroy(CorporateLabel $label)
    {
        $label->delete();

        return redirect()->route('corporate.labels.index')
            ->with('success', 'Corporate label deleted successfully.');
    }

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate Labels ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate Groups ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    public function corporateGroupsIndex()
    {
        $groups = CorporateGroup::where('is_delete', 0)
            ->orderBy('id', 'desc') // Sort by ID in descending order
            ->get();

        return Inertia::render('superadmin/corporate/groups/Index', [
            'groups' => $groups,
        ]);
    }

    public function corporateGroupsStore(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string|max:255',
            'remark' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'is_active' => 'required|boolean',
        ]);

        $logoPath = $request->file('logo') ? $request->file('logo')->store('corporate_groups') : null;

        CorporateGroup::create([
            'group_name' => $request->group_name,
            'remark' => $request->remark,
            'logo' => $logoPath,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('corporate.groups.index')->with('success', 'Corporate Group created successfully.');
    }

    public function corporateGroupsUpdate(Request $request, CorporateGroup $group)
    {
        $request->validate([
            'group_name' => 'required|string|max:255',
            'remark' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'is_active' => 'required|boolean',
        ]);

        if ($request->file('logo')) {
            $logoPath = $request->file('logo')->store('corporate_groups');
            $group->logo = $logoPath;
        }

        $group->update([
            'group_name' => $request->group_name,
            'remark' => $request->remark,
            'is_active' => $request->is_active,
        ]);

        return redirect()->route('corporate.groups.index')->with('success', 'Corporate Group updated successfully.');
    }

    public function corporateGroupsDestroy(CorporateGroup $group)
    {
        $group->update(['is_delete' => 1]);
        return redirect()->route('corporate.groups.index')->with('success', 'Corporate Group deleted successfully.');
    }

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate Groups ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate List ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    public function corporateList()
    {
        $companies = CompanyMaster::with([
            'rmUser',
            'salesRmUser',
            'salesVerticalUser',
            'corporateLabel',
            'corporateGroup',
            'createdByUser',
            'updatedByUser',
            'policies'
        ])
            ->whereIn('status', [0, 1]) // Include both active and inactive companies
            ->orderBy('comp_id', 'desc')
            ->get();

        return Inertia::render('superadmin/corporate/List', [
            'companies' => $companies,
        ]);
    }

    public function corporateCreate()
    {
        $labels = CorporateLabel::orderBy('label')->get();
        $groups = CorporateGroup::orderBy('group_name')->get();
        $users = UserMaster::orderBy('full_name')->get();

        return Inertia::render('superadmin/corporate/Create', [
            'labels' => $labels,
            'groups' => $groups,
            'users' => $users,
        ]);
    }

    public function corporateStore(Request $request)
    {
        try {
            $validated = $request->validate([
                'display_name' => 'required|string|max:255',
                'slug' => 'required|string|max:255',
                'referred_by' => 'required',
                'sales_rm_id' => 'required',
                'service_rm_id' => 'required',
                'label_id' => 'required',
                'email' => 'nullable|email',
                'phone' => 'nullable|string|max:20',
                'source' => 'nullable|string|max:255',
                'members.0.full_name' => 'required|string|max:255',
                'members.0.email' => 'required|email',
                'address_line1' => 'required|string|max:255',
                'pincode' => 'required|string|max:20',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
            ]);

            // 1. Directory setup
            $comp_slug = strtolower(str_replace(" ", "", preg_replace('/[^A-Za-z0-9\-]/', '', $request->slug)));

            if (\App\Models\CompanyMaster::where('comp_slug', $comp_slug)->exists()) {
                throw ValidationException::withMessages([
                    'slug' => 'Company Slug already exists. Please use a different slug.',
                ]);
            }

            foreach ($request->members as $member) {
                if (\App\Models\CompanyUser::where('email', $member['email'])->exists()) {
                    throw ValidationException::withMessages([
                        'members.0.email' => 'Member email "' . $member['email'] . '" already exists. Please use a different email.',
                    ]);
                }
            }
            $comp_dir = $comp_slug . uniqid();
            $full_dir_name = 'uploads/company_files/' . $comp_dir . '/';
            if (!is_dir(public_path($full_dir_name))) {
                mkdir(public_path($full_dir_name), 0777, true);
            }

            // 2. Logo upload
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoFile = $request->file('logo');
                $logoName = 'company_logo_' . time() . '.' . $logoFile->getClientOriginalExtension();
                $logoFile->move(public_path($full_dir_name), $logoName);
                $logoPath = $full_dir_name . $logoName;
            }

            // 3. Document upload (pan card)
            $panCardPath = null;
            if ($request->hasFile('document')) {
                $docFile = $request->file('document');
                $docName = 'pan_card_' . time() . '.' . $docFile->getClientOriginalExtension();
                $docFile->move(public_path($full_dir_name), $docName);
                $panCardPath = $full_dir_name . $docName;
            }

            // 4. Save company
            $company = \App\Models\CompanyMaster::create([
                'comp_name'      => strtoupper($request->display_name),
                'comp_slug'      => $comp_slug,
                'file_dir'       => $full_dir_name,
                'rm_id'          => $request->service_rm_id,
                'sales_rm_id'    => $request->sales_rm_id,
                'sales_vertical_id' => $request->referred_by ?? null,
                'label_id'       => $request->label_id,
                'group_id'       => $request->group_id,
                'email'          => $request->email ?? null,
                'phone'          => $request->phone ?? null,
                'source'         => $request->source ?? null,
                'comp_addr'      => $request->address_line1 . ($request->address_line2 ? ', ' . $request->address_line2 : ''),
                'comp_city'      => $request->city,
                'comp_state'     => $request->state,
                'comp_pincode'   => $request->pincode,
                'comp_icon_url'  => $logoPath ?? null,
                'pan_card_url'   => $panCardPath ?? null,
                'status'         => 1,
                'is_approved'    => 1,
                'created_date'   => now(),
                'created_by'     => auth()->id() ?? 1,
                'updated_by'     => auth()->id() ?? 1,
                'updated_date'   => now(),
            ]);

            // 5. Map menus
            $menu_ids = \DB::table('employee_menu_master')->pluck('id');
            $menuMappings = [];
            foreach ($menu_ids as $menu_id) {
                $menuMappings[] = [
                    'menu_id' => $menu_id,
                    'cmp_id' => $company->comp_id,
                    'is_active' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if ($menuMappings) {
                \DB::table('employee_menu_mapping')->insert($menuMappings);
            }

            // 6. Add company mapping
            \DB::table('company_mapping_master')->insert([
                'user_id' => auth()->id() ?? 1,
                'company_id' => $company->comp_id,
                'access' => 'yes',
            ]);

            // 7. Save members (company_users)
            foreach ($request->members as $member) {
                $plainPassword = \Str::random(8);
                \App\Models\CompanyUser::create([
                    'token' => \Str::random(32),
                    'role_id' => 1,
                    'full_name' => strtoupper($member['full_name']),
                    'designation_name' => 'Admin',
                    'email' => $member['email'],
                    'phone' => $member['phone'] ?? null,
                    'company_id' => $company->comp_id,
                    'pwd' => \Hash::make($plainPassword),
                    'is_active' => 1,
                    'created_on' => now(),
                    'created_by' => auth()->id() ?? 1,
                    'first_login' => 0,
                ]);
                // Log credentials
                \Log::build([
                    'driver' => 'single',
                    'path' => storage_path('logs/credentials.log'),
                ])->info("Company User Created: Email: {$member['email']} | Password: {$plainPassword}");
            }

            return redirect()->route('corporate.list.index')->with('success', 'Customer created!');
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Corporate Store Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }

    public function corporateEdit($id)
    {
        $company = \App\Models\CompanyMaster::with([
            'rmUser',
            'salesRmUser',
            'salesVerticalUser',
            'corporateLabel',
            'corporateGroup',
            'createdByUser',
            'updatedByUser'
        ])->findOrFail($id);

        // Get company members (company_users)
        $members = \App\Models\CompanyUser::where('company_id', $company->comp_id)
            ->where('is_active', 1)
            ->get()
            ->map(function ($member) {
                return [
                    'full_name' => $member->full_name,
                    'email' => $member->email,
                    'phone' => $member->phone ?? '',
                ];
            });

        // Format company data for frontend
        $companyData = [
            'id' => $company->comp_id,
            'display_name' => $company->comp_name,
            'phone' => $company->phone,
            'email' => $company->email,
            'slug' => $company->comp_slug,
            'referred_by' => $company->sales_vertical_id,
            'source' => $company->source,
            'group_id' => $company->group_id,
            'sales_rm_id' => $company->sales_rm_id,
            'service_rm_id' => $company->rm_id,
            'label_id' => $company->label_id,
            'address_line1' => explode(', ', $company->comp_addr)[0] ?? $company->comp_addr,
            'address_line2' => explode(', ', $company->comp_addr)[1] ?? '',
            'pincode' => $company->comp_pincode,
            'city' => $company->comp_city,
            'state' => $company->comp_state,
            'logo_url' => $company->comp_icon_url ? asset($company->comp_icon_url) : null,
            'members' => $members->isEmpty() ? [['full_name' => '', 'phone' => '', 'email' => '']] : $members->toArray(),
        ];

        $users = \App\Models\UserMaster::where('is_active', 1)->get();
        $labels = \App\Models\CorporateLabel::where('is_active', 0)->get();
        $groups = \App\Models\CorporateGroup::where('is_active', 0)->get();

        return Inertia::render('superadmin/corporate/Edit', [
            'company' => $companyData,
            'users' => $users,
            'labels' => $labels,
            'groups' => $groups
        ]);
    }

    /**
     * Manage company employees
     */
    public function manageCompanyEmployees($companyId)
    {
        // Fetch company basic info
        $company = CompanyMaster::findOrFail($companyId);

        // Fetch employees via Eloquent and eager-load location to include branch_name
        $employees = \App\Models\CompanyEmployee::with('location')
            ->where('company_id', $companyId)
            ->orderBy('created_on', 'desc')
            ->get()
            ->map(function ($e) {
                return [
                    'id' => $e->id,
                    'full_name' => $e->full_name,
                    'first_name' => $e->first_name,
                    'last_name' => $e->last_name,
                    'email' => $e->email,
                    'mobile' => $e->mobile,
                    'designation' => $e->designation ?? $e->designation ?? null,
                    'grade' => $e->grade,
                    'is_active' => $e->is_active,
                    'is_delete' => $e->is_delete ?? $e->is_delete ?? null,
                    'created_on' => $e->created_on,
                    'updated_on' => $e->updated_on,
                    'location_id' => $e->location_id,
                    'branch_name' => $e->location->branch_name ?? null,
                ];
            });

        return Inertia::render('superadmin/corporate/ManageEmployees', [
            'company' => $company,
            'employees' => $employees,
        ]);
    }

    /**
     * Show Add Single Employee form
     */
    public function addSingleEmployee($companyId)
    {
        try {
            $company = CompanyMaster::findOrFail($companyId);
            // fetch locations for this company
            $locations = DB::table('company_location_master')->where('comp_id', $companyId)->select('id', 'branch_name')->get();

            return Inertia::render('superadmin/corporate/AddSingleEmployee', [
                'company' => $company,
                'locations' => $locations,
            ]);
        } catch (\Exception $e) {
            Log::error('Add single employee page failed: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to load add employee form')->with('messageType', 'error');
        }
    }

    /**
     * Show Edit Employee form
     */
    public function editEmployee($companyId, $employeeId)
    {
        try {
            $company = CompanyMaster::findOrFail($companyId);
            $employee = \App\Models\CompanyEmployee::findOrFail($employeeId);
            $locations = DB::table('company_location_master')->where('comp_id', $companyId)->select('id', 'branch_name')->get();

            return Inertia::render('superadmin/corporate/EditEmployee', [
                'company' => $company,
                'employee' => $employee,
                'locations' => $locations,
            ]);
        } catch (\Exception $e) {
            Log::error('Edit employee page failed: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to load edit employee form')->with('messageType', 'error');
        }
    }

    /**
     * Store single employee (from Add Single Employee form)
     */

    public function storeEmployee(Request $request, $companyId)
    {
        $validated = $request->validate([
            'first_name' => 'required|max:100',
            'last_name' => 'required|max:100',
            'employee_code' => 'required|min:3|max:100|unique:company_employees,employees_code,NULL,id,company_id,' . $companyId,
            'email' => 'required|email|max:100|unique:company_employees,email,NULL,id,company_id,' . $companyId,
            'gender' => 'required|max:100',
            'designation' => 'required|max:100',
            'doj' => 'required|date',
            'dob' => 'required|date|before:today',
            'location_id' => 'required|exists:company_location_master,id',
            'grade' => 'required|max:100',
        ], [
            'first_name.required' => 'Employee First Name is required.',
            'last_name.required' => 'Employee Last Name is required.',
            'employee_code.required' => 'Employee Code is required.',
            'employee_code.min' => 'Employee Code must be at least 3 characters.',
            'employee_code.unique' => 'This Employee Code already exists for this company.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email already exists for this company.',
            'gender.required' => 'Gender is required.',
            'designation.required' => 'Designation is required.',
            'doj.required' => 'Date of Joining is required.',
            'dob.required' => 'Date of Birth is required.',
            'dob.before' => 'Date of Birth must be a past date.',
            'location_id.required' => 'Employee Location is required.',
            'grade.required' => 'Employee Grade is required.',
        ]);

        try {
            $token = bin2hex(random_bytes(16));
            $firstName = strtoupper($validated['first_name']);
            $lastName = strtoupper($validated['last_name']);
            $fullName = $firstName . ' ' . $lastName;

            $photo = $validated['gender'] === 'female'
                ? 'assets/img/profilef.png'
                : 'assets/img/profileimg.jpg';

            $dobFormatted = date('d/m/Y', strtotime($validated['dob']));
            $password = bcrypt($dobFormatted);

            $employee = new CompanyEmployee();
            $employee->fill([
                'company_id' => $companyId,
                'token' => $token,
                'full_name' => $fullName,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'employees_code' => strtoupper($validated['employee_code']),
                'email' => strtolower($validated['email']),
                'gender' => $validated['gender'],
                'designation' => $validated['designation'],
                'grade' => $validated['grade'],
                'location_id' => $validated['location_id'],
                'dob' => date('Y-m-d H:i:s', strtotime($validated['dob'])),
                'date_of_joining' => date('Y-m-d H:i:s', strtotime($validated['doj'])),
                'pwd' => $password,
                'photo' => $photo,
                'is_active' => 1,
                'is_delete' => 0,
                'first_login' => 1,
                'set_profile' => 1,
                'created_on' => now(),
                'created_by' => auth()->id() ?? 1,
                'updated_on' => now(),
            ]);

            $employee->save();

            return redirect()
                ->route('corporate.manage-employees', $companyId)
                ->with('message', 'Employee added successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Store employee failed: ' . $e->getMessage());

            return back()
                ->with('message', 'Failed to add employee: ' . $e->getMessage())
                ->with('messageType', 'error');
        }
    }

    /**
     * Update employee (full form from edit page)
     */
    public function updateEmployeeFull(Request $request, $companyId, $employeeId)
    {
        // Validate with same rules as add
        $validated = $request->validate([
            'first_name' => 'required|max:100',
            'last_name' => 'required|max:100',
            'employee_code' => 'required|min:3|max:100|unique:company_employees,employees_code,' . $employeeId . ',id,company_id,' . $companyId,
            'email' => 'required|email|max:100|unique:company_employees,email,' . $employeeId . ',id,company_id,' . $companyId,
            'gender' => 'required|max:100',
            'designation' => 'required|max:100',
            'doj' => 'required|date',
            'dob' => 'required|date|before:today',
            'location_id' => 'required|exists:company_location_master,id',
            'grade' => 'required|max:100',
        ], [
            'first_name.required' => 'Employee First Name is required.',
            'last_name.required' => 'Employee Last Name is required.',
            'employee_code.required' => 'Employee Code is required.',
            'employee_code.min' => 'Employee Code must be at least 3 characters.',
            'employee_code.unique' => 'This Employee Code already exists for this company.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.unique' => 'This email already exists for this company.',
            'gender.required' => 'Gender is required.',
            'designation.required' => 'Designation is required.',
            'doj.required' => 'Date of Joining is required.',
            'dob.required' => 'Date of Birth is required.',
            'dob.before' => 'Date of Birth must be a past date.',
            'location_id.required' => 'Employee Location is required.',
            'grade.required' => 'Employee Grade is required.',
        ]);

        try {
            $employee = \App\Models\CompanyEmployee::findOrFail($employeeId);

            // Convert names to uppercase
            $firstName = strtoupper($validated['first_name']);
            $lastName = strtoupper($validated['last_name']);
            $fullName = $firstName . ' ' . $lastName;

            // Update photo if gender changed
            if ($employee->gender !== $validated['gender']) {
                $photo = 'assets/img/profileimg.jpg'; // default male/other
                if ($validated['gender'] === 'female') {
                    $photo = 'assets/img/profilef.png';
                }
                $employee->photo = $photo;
            }

            $employee->full_name = $fullName;
            $employee->first_name = $firstName;
            $employee->last_name = $lastName;
            $employee->employees_code = strtoupper($validated['employee_code']);
            $employee->email = strtolower($validated['email']);
            $employee->gender = $validated['gender'];
            $employee->designation = $validated['designation'];
            $employee->grade = $validated['grade'];
            $employee->location_id = $validated['location_id'];
            $employee->dob = date('Y-m-d H:i:s', strtotime($validated['dob']));
            $employee->date_of_joining = date('Y-m-d H:i:s', strtotime($validated['doj']));
            $employee->updated_on = now();
            $employee->save();

            return redirect()->route('corporate.manage-employees', $companyId)
                ->with('message', 'Employee updated successfully!')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Update employee failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to update employee: ' . $e->getMessage())
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * Manage company entity
     */
    public function manageCompanyEntity($companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);
        $entities = \App\Models\CompanyLocationMaster::where('comp_id', $companyId)
            ->orderBy('created_on', 'desc')
            ->get();

        return Inertia::render('superadmin/corporate/ManageEntity', [
            'company' => $company,
            'entities' => $entities,
        ]);
    }

    public function createEntity($companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);

        return Inertia::render('superadmin/corporate/AddEntity', [
            'company' => $company,
        ]);
    }

    public function storeEntity(Request $request, $companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);

        $validated = $request->validate([
            'branch_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'state_name' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
        ], [
            'branch_name.required' => 'Entity name is required.',
            'address.required' => 'Entity address is required.',
            'state_name.required' => 'State is required.',
            'city.required' => 'City is required.',
            'pincode.required' => 'Pincode is required.',
        ]);

        // Generate unique 4-digit location_id
        do {
            $locationId = rand(1000, 9999);
            $exists = \App\Models\CompanyLocationMaster::where('location_id', $locationId)->exists();
        } while ($exists);

        \App\Models\CompanyLocationMaster::create([
            'location_id' => $locationId,
            'branch_name' => $validated['branch_name'],
            'address' => $validated['address'],
            'comp_id' => $companyId,
            'state_name' => $validated['state_name'],
            'city' => $validated['city'],
            'pincode' => $validated['pincode'],
            'status' => 1,
            'created_on' => now(),
        ]);

        return redirect()->route('corporate.manage-entity', $companyId)
            ->with('message', 'Entity created successfully!')
            ->with('messageType', 'success');
    }

    public function editEntity($companyId, $entityId)
    {
        $company = CompanyMaster::findOrFail($companyId);
        $entity = \App\Models\CompanyLocationMaster::findOrFail($entityId);

        return Inertia::render('superadmin/corporate/EditEntity', [
            'company' => $company,
            'entity' => $entity,
        ]);
    }

    public function updateEntity(Request $request, $companyId, $entityId)
    {
        $company = CompanyMaster::findOrFail($companyId);
        $entity = \App\Models\CompanyLocationMaster::findOrFail($entityId);

        $validated = $request->validate([
            'branch_name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'state_name' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
        ], [
            'branch_name.required' => 'Entity name is required.',
            'address.required' => 'Entity address is required.',
            'state_name.required' => 'State is required.',
            'city.required' => 'City is required.',
            'pincode.required' => 'Pincode is required.',
        ]);

        $entity->update([
            'branch_name' => $validated['branch_name'],
            'address' => $validated['address'],
            'state_name' => $validated['state_name'],
            'city' => $validated['city'],
            'pincode' => $validated['pincode'],
        ]);

        return redirect()->route('corporate.manage-entity', $companyId)
            ->with('message', 'Entity updated successfully!')
            ->with('messageType', 'success');
    }

    public function entityToggleStatus($entityId)
    {
        $entity = \App\Models\CompanyLocationMaster::findOrFail($entityId);
        $entity->status = $entity->status == 1 ? 0 : 1;
        $entity->save();

        return redirect()->back()
            ->with('message', $entity->status == 1 ? 'Entity activated successfully!' : 'Entity deactivated successfully!')
            ->with('messageType', 'success');
    }

    /**
     * =====================================================
     * BULK EMPLOYEE ACTIONS
     * =====================================================
     */

    public function bulkEmployeeActions($companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);
        $actions = \App\Models\BulkEmployeeAction::where('comp_id', $companyId)
            ->with(['creator'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('superadmin/corporate/BulkEmployeeActions', [
            'company' => $company,
            'actions' => $actions,
        ]);
    }

    public function bulkUploadEmployee($companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);
        $entities = \App\Models\CompanyLocationMaster::where('comp_id', $companyId)
            ->where('status', 1)
            ->get();

        return Inertia::render('superadmin/corporate/BulkUploadEmployee', [
            'company' => $company,
            'entities' => $entities,
            'action_type' => 'bulk_add',
        ]);
    }

    public function bulkRemoveEmployee($companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);

        return Inertia::render('superadmin/corporate/BulkUploadEmployee', [
            'company' => $company,
            'action_type' => 'bulk_remove',
        ]);
    }

    public function downloadSampleCsv($type)
    {
        $filename = $type === 'add' ? 'Sample_Employee_Bulk_Upload.csv' : 'Sample_Employee_Bulk_Remove.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        if ($type === 'add') {
            $columns = [
                'S.No',
                'Entity Code',
                'Employee Code',
                'First Name',
                'Last Name',
                'Gender',
                'Date of Joining(dd-mm-yyyy)',
                'D.O.B(dd-mm-yyyy)',
                'Designation',
                'Email',
                'New Email',
                'Grade',
                'Contact Number'
            ];

            $sample = [
                ['1', 'Copy It From HR Portal', 'EMP01', 'ASHISH', 'KUMAR', 'MALE', '13/11/2025', '13/11/1955', 'Manager', 'test1@democompany.com', '', 'A', '9876543210'],
                ['2', 'Copy It From HR Portal', 'EMP02', 'REKHA', 'SINGH', 'FEMALE', '13/11/2025', '13/11/1955', 'Executive', 'test2@democompany.com', '', 'A', '9222277770'],
                ['3', 'Copy It From HR Portal', 'EMP03', 'RASHMI', 'SINGH', 'FEMALE', '13/11/2025', '13/11/1955', 'Sr Executive', 'test3@democompany.com', '', 'A', '9090909090'],
            ];
        } else {
            $columns = [
                'S.No',
                'Employee Code',
                'Email',
                'Date Of Leaving(dd-mm-yyyy)'
            ];

            $sample = [
                ['1', 'EMP01', 'test1@testcompany.com', '2025-11-13'],
                ['2', 'EMP02', 'test2@testcompany.com', '2025-11-13'],
                ['3', 'EMP03', 'test3@testcompany.com', '2025-11-13'],
            ];
        }

        $callback = function () use ($columns, $sample) {
            // Open output stream without extra newline
            $file = fopen('php://output', 'w');
            if ($file === false) return;

            // Write header row (no blank line before)
            $trimmedColumns = array_map('trim', $columns);
            fputcsv($file, $trimmedColumns);

            // Write sample rows
            foreach ($sample as $row) {
                $trimmedRow = array_map(function ($v) {
                    return is_string($v) ? trim($v) : $v;
                }, $row);
                fputcsv($file, $trimmedRow);
            }

            fflush($file);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function uploadBulkCsv(Request $request, $companyId)
    {
        $company = CompanyMaster::findOrFail($companyId);

        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:10240',
            'action_type' => 'required|in:bulk_add,bulk_remove'
        ]);

        $file = $request->file('csv_file');
        $actionType = $request->input('action_type');

        // Read and validate CSV
        $csv = array_map('str_getcsv', file($file->getRealPath()));
        $headers = array_shift($csv);

        // Validate headers based on action type
        $requiredHeaders = $actionType === 'bulk_add'
            ? ['Entity Code', 'Employee Code', 'First Name', 'Last Name', 'Gender', 'Date of Joining(dd-mm-yyyy)', 'D.O.B(dd-mm-yyyy)', 'Designation', 'Email', 'Grade']
            : ['Employee Code', 'Email', 'Date Of Leaving(dd-mm-yyyy)'];

        foreach ($requiredHeaders as $requiredHeader) {
            if (!in_array($requiredHeader, $headers)) {
                return response()->json([
                    'success' => false,
                    'message' => "Missing required column: {$requiredHeader}"
                ], 422);
            }
        }

        // Process and validate each row
        $validRows = [];
        $invalidRows = [];
        $rowNumber = 2; // Start from 2 (1 is header)

        foreach ($csv as $row) {
            if (count($row) !== count($headers)) {
                continue; // Skip empty or malformed rows
            }

            $employee = array_combine($headers, $row);

            if ($actionType === 'bulk_add') {
                $validation = $this->validateBulkAddEmployee($employee, $companyId, $rowNumber);
            } else {
                $validation = $this->validateBulkRemoveEmployee($employee, $companyId, $rowNumber);
            }

            if ($validation['valid']) {
                $validRows[] = $employee;
            } else {
                $employee['_error'] = $validation['message'];
                $invalidRows[] = $employee;
            }

            $rowNumber++;
        }

        // Store uploaded file
        $uploadedFilePath = $file->store('bulk_uploads', 'public');

        return response()->json([
            'success' => true,
            'preview' => [
                'total' => count($csv),
                'valid' => count($validRows),
                'invalid' => count($invalidRows),
                'valid_rows' => array_slice($validRows, 0, 10), // Preview first 10
                'invalid_rows' => $invalidRows,
                'uploaded_file_path' => $uploadedFilePath,
                'headers' => $headers,
            ]
        ]);
    }

    private function validateBulkAddEmployee($employee, $companyId, $rowNumber)
    {
        $employeeCode = $employee['Employee Code'] ?? '';

        // Check required fields
        if (empty($employee['First Name'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: First Name is missing"];
        }
        if (empty($employee['Gender'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Gender is missing"];
        }
        if (empty($employee['Date of Joining(dd-mm-yyyy)'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Date of Joining is missing"];
        }
        if (empty($employee['D.O.B(dd-mm-yyyy)'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: D.O.B is missing"];
        }
        if (empty($employee['Designation'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Designation is missing"];
        }
        if (empty($employee['Email'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Email is missing"];
        }
        if (empty($employee['Grade'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Grade is missing"];
        }

        // Validate email
        if (!filter_var(trim($employee['Email']), FILTER_VALIDATE_EMAIL)) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Email is not valid"];
        }

        // Validate gender
        $gender = strtoupper($employee['Gender']);
        if (!in_array($gender, ['MALE', 'FEMALE', 'OTHER'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Gender must be MALE, FEMALE, or OTHER"];
        }

        // Validate contact number if provided
        if (!empty($employee['Contact Number'])) {
            $contact = preg_replace('/[^0-9]/', '', $employee['Contact Number']);
            if (strlen($contact) != 10) {
                return ['valid' => false, 'message' => "Row {$rowNumber}: Contact Number must be 10 digits"];
            }
        }

        // Check if entity exists
        $entity = \App\Models\CompanyLocationMaster::where('location_id', $employee['Entity Code'])
            ->where('comp_id', $companyId)
            ->first();

        if (!$entity) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Entity Code not found"];
        }

        // Check if employee code already exists
        $existingEmployee = CompanyEmployee::where('employees_code', $employeeCode)
            ->where('company_id', $companyId)
            ->where('is_delete', 0)
            ->first();

        if ($existingEmployee && strtolower($existingEmployee->email) !== strtolower(trim($employee['Email']))) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Employee Code already exists with different email"];
        }

        // Check if email already exists
        $existingEmail = CompanyEmployee::where('email', trim($employee['Email']))
            ->where('company_id', $companyId)
            ->where('is_delete', 0)
            ->first();

        if ($existingEmail && $existingEmail->employees_code !== $employeeCode) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Email already in use"];
        }

        // Validate new email if provided
        if (!empty($employee['New Email'])) {
            if (!filter_var(trim($employee['New Email']), FILTER_VALIDATE_EMAIL)) {
                return ['valid' => false, 'message' => "Row {$rowNumber}: New Email is not valid"];
            }

            $existingNewEmail = CompanyEmployee::where('email', trim($employee['New Email']))
                ->where('company_id', $companyId)
                ->where('is_delete', 0)
                ->first();

            if ($existingNewEmail) {
                return ['valid' => false, 'message' => "Row {$rowNumber}: New Email already in use"];
            }
        }

        return ['valid' => true];
    }

    private function validateBulkRemoveEmployee($employee, $companyId, $rowNumber)
    {
        if (empty($employee['Employee Code'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Employee Code is missing"];
        }
        if (empty($employee['Email'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Email is missing"];
        }
        if (empty($employee['Date Of Leaving(dd-mm-yyyy)'])) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Date Of Leaving is missing"];
        }

        // Check if employee exists
        $existingEmployee = CompanyEmployee::where('employees_code', $employee['Employee Code'])
            ->where('email', trim($employee['Email']))
            ->where('company_id', $companyId)
            ->where('is_delete', 0)
            ->first();

        if (!$existingEmployee) {
            return ['valid' => false, 'message' => "Row {$rowNumber}: Employee not found"];
        }

        return ['valid' => true];
    }

    public function processBulkAction(Request $request, $companyId)
    {
        $request->validate([
            'uploaded_file_path' => 'required|string',
            'action_type' => 'required|in:bulk_add,bulk_remove',
        ]);

        $company = CompanyMaster::findOrFail($companyId);
        $userId = auth()->user()->user_id ?? 1; // Get logged-in user ID

        // Create bulk action record
        $bulkAction = \App\Models\BulkEmployeeAction::create([
            'comp_id' => $companyId,
            'action_type' => $request->input('action_type'),
            'uploaded_file' => $request->input('uploaded_file_path'),
            'status' => 'pending',
            'created_by' => $userId,
        ]);

        // Dispatch job to process in background
        \App\Jobs\ProcessBulkEmployeeJob::dispatch($bulkAction);

        return redirect()->route('corporate.bulk-employee-actions', $companyId)
            ->with('message', 'Bulk action submitted successfully! Processing in background.')
            ->with('messageType', 'success');
    }

    public function downloadBulkActionFile($actionId, $type)
    {
        $action = \App\Models\BulkEmployeeAction::findOrFail($actionId);

        $filePath = match ($type) {
            'uploaded' => $action->uploaded_file,
            'inserted' => $action->inserted_data_file,
            'failed' => $action->not_inserted_data_file,
            default => null
        };

        if (!$filePath || !Storage::disk('public')->exists($filePath)) {
            abort(404, 'File not found');
        }

        return Storage::disk('public')->download($filePath);
    }

    public function getEmployeePolicies($employeeId)
    {
        // Get all TPA tables for this employee
        $tpa_tables = DB::select("SELECT DISTINCT tpa_master.tpa_table_name FROM policy_mapping_master INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id WHERE policy_mapping_master.status = 1 AND policy_endorsements.status = 1 AND policy_master.is_old = 0 AND policy_master.policy_end_date >= CURRENT_TIMESTAMP AND policy_mapping_master.emp_id = ?", [$employeeId]);

        $policies_data = [];
        foreach ($tpa_tables as $tpa_table) {
            $table_name = $tpa_table->tpa_table_name;
            $policy = DB::select("SELECT DISTINCT policy_master.*, policy_mapping_master.emp_id, policy_mapping_master.id AS mapping_id, policy_mapping_master.addition_endorsement_id, insurance_master.insurance_company_name, insurance_master.insurance_comp_icon_url, tpa_master.tpa_company_name, tpa_master.tpa_table_name FROM policy_mapping_master INNER JOIN policy_endorsements ON policy_mapping_master.addition_endorsement_id = policy_endorsements.id INNER JOIN policy_master ON policy_master.id = policy_mapping_master.policy_id INNER JOIN insurance_master ON policy_master.ins_id = insurance_master.id INNER JOIN tpa_master ON policy_master.tpa_id = tpa_master.id JOIN $table_name ON $table_name.mapping_id = policy_mapping_master.id WHERE policy_mapping_master.status = 1 AND policy_endorsements.status = 1 AND policy_master.is_old = 0 AND policy_master.policy_end_date >= CURRENT_TIMESTAMP AND policy_mapping_master.emp_id = ? AND $table_name.addition_endorsement_id IS NOT NULL AND $table_name.deletion_endorsement_id IS NULL AND $table_name.updation_endorsement_id IS NULL AND $table_name.addition_endorsement_id != 0", [$employeeId]);
            $policies_data = array_merge($policies_data, $policy);
        }

        return response()->json(['policies' => $policies_data]);
    }
    /**
     * Toggle employee active/inactive status (AJAX)
     */
    public function employeeToggleStatus($id)
    {
        try {
            $employee = \App\Models\CompanyEmployee::findOrFail($id);
            $employee->is_active = $employee->is_active == 1 ? 0 : 1;
            $employee->updated_on = now();
            $employee->save();

            return response()->json(['success' => true, 'is_active' => (int) $employee->is_active]);
        } catch (\Exception $e) {
            Log::error('Employee toggle status failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error toggling employee status'], 500);
        }
    }

    /**
     * Update employee details (AJAX)
     */
    public function updateEmployee(Request $request, $id)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'mobile' => 'nullable|string|max:20',
            'designation' => 'nullable|string|max:255',
            'location_id' => 'nullable|integer|exists:company_location_master,id',
        ]);

        try {
            $employee = \App\Models\CompanyEmployee::findOrFail($id);

            $employee->update([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'] ?? null,
                'mobile' => $validated['mobile'] ?? null,
                'designation' => $validated['designation'] ?? null,
                'location_id' => $validated['location_id'] ?? $employee->location_id,
                'updated_on' => now(),
            ]);

            return response()->json(['success' => true, 'employee' => $employee]);
        } catch (\Exception $e) {
            Log::error('Update employee failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update employee'], 500);
        }
    }
    public function corporateUpdate(Request $request, $id)
    {
        try {
            $company = \App\Models\CompanyMaster::findOrFail($id);

            $validated = $request->validate([
                'display_name' => 'required|string|max:255',
                'email' => 'nullable|email',
                'phone' => 'nullable|string|max:20',
                'service_rm_id' => 'required',
                'sales_rm_id' => 'required',
                'label_id' => 'required',
                'address_line1' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'pincode' => 'required|string|max:20',
            ]);

            // Handle logo upload if present
            $logoPath = $company->comp_icon_url;
            if ($request->hasFile('logo')) {
                $logoFile = $request->file('logo');
                $logoName = 'company_logo_' . time() . '.' . $logoFile->getClientOriginalExtension();
                $logoFile->move(public_path($company->file_dir), $logoName);
                $logoPath = $company->file_dir . $logoName;
            }

            // Update company
            $company->update([
                'comp_name' => strtoupper($request->display_name),
                'rm_id' => $request->service_rm_id,
                'sales_rm_id' => $request->sales_rm_id,
                'sales_vertical_id' => $request->referred_by ?? $company->sales_vertical_id,
                'label_id' => $request->label_id,
                'group_id' => $request->group_id,
                'email' => $request->email ?? null,
                'phone' => $request->phone ?? null,
                'comp_addr' => $request->address_line1 . ($request->address_line2 ? ', ' . $request->address_line2 : ''),
                'comp_city' => $request->city,
                'comp_state' => $request->state,
                'comp_pincode' => $request->pincode,
                'comp_icon_url' => $logoPath,
                'updated_by' => auth()->id() ?? 1,
                'updated_date' => now(),
            ]);

            return redirect()->route('corporate.list.index')->with('success', 'Customer updated successfully!');
        } catch (\Exception $e) {
            \Log::error('Corporate Update Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }

    public function corporateToggleStatus($id)
    {
        try {
            $company = \App\Models\CompanyMaster::findOrFail($id);

            $company->update([
                'status' => $company->status === 1 ? 0 : 1,
                'updated_by' => auth()->id() ?? 1,
                'updated_date' => now(),
            ]);

            $statusText = $company->status === 1 ? 'activated' : 'deactivated';
            return redirect()->back()->with('success', "Corporate {$statusText} successfully!");
        } catch (\Exception $e) {
            \Log::error('Corporate Toggle Status Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Something went wrong: ' . $e->getMessage());
        }
    }
    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Corporate List ///////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Wellness Vendors and Services /////////////////
    /////////////////////////////////////////////////////////////////////////

    public function vendorList()
    {
        $vendors = Vendor::where('is_delete', 0) // Change from WellnessVendor to Vendor
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('superadmin/wellness/VendorList', [
            'vendors' => $vendors
        ]);
    }

    public function vendorStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_name' => 'required|string|max:255|unique:vendors,vendor_name,NULL,id,is_delete,0',
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Removed gif as per your requirement
        ], [
            'vendor_name.required' => 'Vendor name is required.',
            'vendor_name.unique' => 'This vendor name already exists.',
            'logo.required' => 'Logo is required.',
            'logo.image' => 'Logo must be an image file.',
            'logo.mimes' => 'Logo must be a JPEG, PNG, or JPG file.',
            'logo.max' => 'Logo size must not exceed 2MB.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $logoUrl = null;

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logo = $request->file('logo');

            // Generate unique filename
            $logoName = time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();

            // Define upload path
            $uploadPath = public_path('uploads/wellness-vendor');

            // Create directory if it doesn't exist
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            // Move file to public/uploads/wellness-vendor
            if ($logo->move($uploadPath, $logoName)) {
                $logoUrl = '/uploads/wellness-vendor/' . $logoName;

                // Verify file was actually uploaded
                if (!file_exists(public_path($logoUrl))) {
                    return redirect()->back()
                        ->with('error', 'Failed to upload logo file.')
                        ->withInput();
                }
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to move uploaded file.')
                    ->withInput();
            }
        }

        try {
            Vendor::create([
                'vendor_name' => $request->vendor_name,
                'logo_url' => $logoUrl,
                'is_active' => 1,
                'is_delete' => 0,
            ]);

            return redirect()->route('wellness.vendor-list')
                ->with('success', 'Vendor created successfully.');
        } catch (\Exception $e) {
            // If there's an error, delete uploaded file
            if ($logoUrl && file_exists(public_path($logoUrl))) {
                unlink(public_path($logoUrl));
            }

            \Log::error('Vendor creation failed: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to create vendor. Please try again.')
                ->withInput();
        }
    }

    public function vendorUpdate(Request $request, Vendor $vendor)
    {
        $validator = Validator::make($request->all(), [
            'vendor_name' => 'required|string|max:255|unique:vendors,vendor_name,' . $vendor->id . ',id,is_delete,0',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'vendor_name.required' => 'Vendor name is required.',
            'vendor_name.unique' => 'This vendor name already exists.',
            'logo.image' => 'Logo must be an image file.',
            'logo.mimes' => 'Logo must be a JPEG, PNG, or JPG file.',
            'logo.max' => 'Logo size must not exceed 2MB.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $logoUrl = $vendor->logo_url;

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($vendor->logo_url && file_exists(public_path($vendor->logo_url))) {
                unlink(public_path($vendor->logo_url));
            }

            $logo = $request->file('logo');
            $logoName = time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();

            $uploadPath = public_path('uploads/wellness-vendor');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if ($logo->move($uploadPath, $logoName)) {
                $logoUrl = '/uploads/wellness-vendor/' . $logoName;
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to upload logo file.')
                    ->withInput();
            }
        }

        try {
            $vendor->update([
                'vendor_name' => $request->vendor_name,
                'logo_url' => $logoUrl,
                // is_active is not updated here, only through toggle function
            ]);

            return redirect()->route('superadmin.wellness.vendor.index')
                ->with('success', 'Vendor updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update vendor. Please try again.')
                ->withInput();
        }
    }

    public function vendorToggleStatus(Request $request, Vendor $vendor)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $vendor->update([
                'is_active' => $request->is_active
            ]);

            $status = $request->is_active ? 'activated' : 'deactivated';
            return redirect()->route('superadmin.wellness.vendor.index')
                ->with('success', "Vendor {$status} successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update vendor status. Please try again.');
        }
    }

    public function categoryList()
    {
        $categories = WellnessCategory::orderBy('created_at', 'desc')->get();

        return Inertia::render('superadmin/wellness/CategoryList', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created category
     */
    public function categoryStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:wellness_categories,category_name',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string|max:1000',
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.unique' => 'This category name already exists.',
            'icon.image' => 'Icon must be an image file.',
            'icon.mimes' => 'Icon must be a JPEG, PNG, or JPG file.',
            'icon.max' => 'Icon size must not exceed 2MB.',
            'description.max' => 'Description must not exceed 1000 characters.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $iconUrl = null;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconName = time() . '_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();

            $uploadPath = public_path('uploads/wellness-category');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if ($icon->move($uploadPath, $iconName)) {
                $iconUrl = '/uploads/wellness-category/' . $iconName;
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to upload icon file.')
                    ->withInput();
            }
        }

        try {
            WellnessCategory::create([
                'category_name' => $request->category_name,
                'icon_url' => $iconUrl,
                'description' => $request->description,
                'status' => 1, // Default to active
            ]);

            return redirect()->route('superadmin.wellness.category.index')
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            if ($iconUrl && file_exists(public_path($iconUrl))) {
                unlink(public_path($iconUrl));
            }

            return redirect()->back()
                ->with('error', 'Failed to create category. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update the specified category
     */
    public function categoryUpdate(Request $request, WellnessCategory $category)
    {
        $validator = Validator::make($request->all(), [
            'category_name' => 'required|string|max:255|unique:wellness_categories,category_name,' . $category->id,
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'description' => 'nullable|string|max:1000',
        ], [
            'category_name.required' => 'Category name is required.',
            'category_name.unique' => 'This category name already exists.',
            'icon.image' => 'Icon must be an image file.',
            'icon.mimes' => 'Icon must be a JPEG, PNG, or JPG file.',
            'icon.max' => 'Icon size must not exceed 2MB.',
            'description.max' => 'Description must not exceed 1000 characters.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $iconUrl = $category->icon_url;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($category->icon_url && file_exists(public_path($category->icon_url))) {
                unlink(public_path($category->icon_url));
            }

            $icon = $request->file('icon');
            $iconName = time() . '_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();

            $uploadPath = public_path('uploads/wellness-category');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if ($icon->move($uploadPath, $iconName)) {
                $iconUrl = '/uploads/wellness-category/' . $iconName;
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to upload icon file.')
                    ->withInput();
            }
        }

        try {
            $category->update([
                'category_name' => $request->category_name,
                'icon_url' => $iconUrl,
                'description' => $request->description,
            ]);

            return redirect()->route('superadmin.wellness.category.index')
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update category. Please try again.')
                ->withInput();
        }
    }

    /**
     * Toggle category status (active/inactive)
     */
    public function categoryToggleStatus(Request $request, WellnessCategory $category)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $category->update([
                'status' => $request->status
            ]);

            $status = $request->status ? 'activated' : 'deactivated';
            return redirect()->route('superadmin.wellness.category.index')
                ->with('success', "Category {$status} successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update category status. Please try again.');
        }
    }

    public function servicesList()
    {
        $services = WellnessService::with(['vendor', 'category', 'company'])
            ->orderBy('created_at', 'desc')
            ->get();

        $vendors = Vendor::where('is_delete', 0)->where('is_active', 1)->get();
        $categories = WellnessCategory::where('status', 1)->get();
        $companies = CompanyMaster::all();

        return Inertia::render('superadmin/wellness/ServicesList', [
            'services' => $services,
            'vendors' => $vendors,
            'categories' => $categories,
            'companies' => $companies
        ]);
    }

    /**
     * Store a newly created service
     */
    public function servicesStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendors,id',
            'category_id' => 'required|exists:wellness_categories,id',
            'company_id' => 'nullable',
            'wellness_name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'link' => 'nullable|url|max:500',
            'heading' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ], [
            'vendor_id.required' => 'Vendor is required.',
            'vendor_id.exists' => 'Selected vendor does not exist.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'company_id.exists' => 'Selected company does not exist.',
            'wellness_name.required' => 'Wellness name is required.',
            'icon.image' => 'Icon must be an image file.',
            'icon.mimes' => 'Icon must be a JPEG, PNG, or JPG file.',
            'icon.max' => 'Icon size must not exceed 2MB.',
            'link.url' => 'Link must be a valid URL.',
            'heading.required' => 'Heading is required.',
            'description.max' => 'Description must not exceed 1000 characters.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $iconUrl = null;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $icon = $request->file('icon');
            $iconName = time() . '_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();

            $uploadPath = public_path('uploads/wellness-service');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if ($icon->move($uploadPath, $iconName)) {
                $iconUrl = '/uploads/wellness-service/' . $iconName;
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to upload icon file.')
                    ->withInput();
            }
        }

        try {
            WellnessService::create([
                'vendor_id' => $request->vendor_id,
                'category_id' => $request->category_id,
                'company_id' => $request->company_id ?: 0,
                'wellness_name' => $request->wellness_name,
                'icon_url' => $iconUrl,
                'link' => $request->link,
                'heading' => $request->heading,
                'description' => $request->description,
                'status' => 1, // Default to active
            ]);

            return redirect()->route('superadmin.wellness.services.index')
                ->with('success', 'Service created successfully.');
        } catch (\Exception $e) {
            if ($iconUrl && file_exists(public_path($iconUrl))) {
                unlink(public_path($iconUrl));
            }

            return redirect()->back()
                ->with('error', 'Failed to create service. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update the specified service
     */
    public function servicesUpdate(Request $request, WellnessService $service)
    {
        $validator = Validator::make($request->all(), [
            'vendor_id' => 'required|exists:vendors,id',
            'category_id' => 'required|exists:wellness_categories,id',
            'company_id' => 'nullable',
            'wellness_name' => 'required|string|max:255',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'link' => 'nullable|url|max:500',
            'heading' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ], [
            'vendor_id.required' => 'Vendor is required.',
            'vendor_id.exists' => 'Selected vendor does not exist.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'company_id.exists' => 'Selected company does not exist.',
            'wellness_name.required' => 'Wellness name is required.',
            'icon.image' => 'Icon must be an image file.',
            'icon.mimes' => 'Icon must be a JPEG, PNG, or JPG file.',
            'icon.max' => 'Icon size must not exceed 2MB.',
            'link.url' => 'Link must be a valid URL.',
            'heading.required' => 'Heading is required.',
            'description.max' => 'Description must not exceed 1000 characters.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $iconUrl = $service->icon_url;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($service->icon_url && file_exists(public_path($service->icon_url))) {
                unlink(public_path($service->icon_url));
            }

            $icon = $request->file('icon');
            $iconName = time() . '_' . Str::random(10) . '.' . $icon->getClientOriginalExtension();

            $uploadPath = public_path('uploads/wellness-service');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0755, true);
            }

            if ($icon->move($uploadPath, $iconName)) {
                $iconUrl = '/uploads/wellness-service/' . $iconName;
            } else {
                return redirect()->back()
                    ->with('error', 'Failed to upload icon file.')
                    ->withInput();
            }
        }

        try {
            $service->update([
                'vendor_id' => $request->vendor_id,
                'category_id' => $request->category_id,
                'company_id' => $request->company_id ?: 0,
                'wellness_name' => $request->wellness_name,
                'icon_url' => $iconUrl,
                'link' => $request->link,
                'heading' => $request->heading,
                'description' => $request->description,
            ]);

            return redirect()->route('superadmin.wellness.services.index')
                ->with('success', 'Service updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update service. Please try again.')
                ->withInput();
        }
    }

    /**
     * Toggle service status (active/inactive)
     */
    public function servicesToggleStatus(Request $request, WellnessService $service)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $service->update([
                'status' => $request->status
            ]);

            $status = $request->status ? 'activated' : 'deactivated';
            return redirect()->route('superadmin.wellness.services.index')
                ->with('success', "Service {$status} successfully.");
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update service status. Please try again.');
        }
    }
    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Wellness Vendors and Services /////////////////
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Marketing Module /////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /**
     * Display campaigns listing page
     */
    public function marketingCampaigns()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        // Here you would typically fetch campaigns from database
        // For now returning empty array as placeholder
        return Inertia::render('superadmin/Marketing/Campaigns', [
            'user' => $user,
            'campaigns' => []
        ]);
    }

    /**
     * Store new campaign
     */
    public function marketingCampaignsStore(Request $request)
    {
        // Placeholder method for campaign creation
        // Add validation and store logic here
        return redirect()->route('superadmin.marketing.campaigns.index')
            ->with('success', 'Campaign created successfully.');
    }

    /**
     * Update existing campaign
     */
    public function marketingCampaignsUpdate(Request $request, $campaign)
    {
        // Placeholder method for campaign update
        // Add validation and update logic here
        return redirect()->route('superadmin.marketing.campaigns.index')
            ->with('success', 'Campaign updated successfully.');
    }

    /**
     * Delete campaign
     */
    public function marketingCampaignsDestroy($campaign)
    {
        // Placeholder method for campaign deletion
        // Add deletion logic here
        return redirect()->route('superadmin.marketing.campaigns.index')
            ->with('success', 'Campaign deleted successfully.');
    }

    /**
     * Display welcome mailer page
     */
    public function marketingWelcomeMailer()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        return Inertia::render('superadmin/Marketing/WelcomeMailer', [
            'user' => $user,
            'mailers' => []
        ]);
    }

    /**
     * Store new welcome mailer
     */
    public function marketingWelcomeMailerStore(Request $request)
    {
        return redirect()->route('superadmin.marketing.welcome-mailer.index')
            ->with('success', 'Welcome mailer created successfully.');
    }

    /**
     * Update existing welcome mailer
     */
    public function marketingWelcomeMailerUpdate(Request $request, $mailer)
    {
        return redirect()->route('superadmin.marketing.welcome-mailer.index')
            ->with('success', 'Welcome mailer updated successfully.');
    }

    /**
     * Delete welcome mailer
     */
    public function marketingWelcomeMailerDestroy($mailer)
    {
        return redirect()->route('superadmin.marketing.welcome-mailer.index')
            ->with('success', 'Welcome mailer deleted successfully.');
    }

    /**
     * Display message template page
     */
    public function marketingMessageTemplate()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        $templates = MessageTemplate::orderBy('created_at', 'desc')->get();
        $categories = MessageTemplate::getCategories();

        return Inertia::render('superadmin/Marketing/MessageTemplate', [
            'user' => $user,
            'templates' => $templates,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new message template
     */
    public function marketingMessageTemplateCreate()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        $categories = MessageTemplate::getCategories();

        return Inertia::render('superadmin/Marketing/CreateMessageTemplate', [
            'user' => $user,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for editing the specified message template
     */
    public function marketingMessageTemplateEdit(MessageTemplate $template)
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        $categories = MessageTemplate::getCategories();

        return Inertia::render('superadmin/Marketing/CreateMessageTemplate', [
            'user' => $user,
            'template' => $template,
            'categories' => $categories
        ]);
    }

    /**
     * Display the specified message template
     */
    public function marketingMessageTemplateShow(MessageTemplate $template)
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        return Inertia::render('superadmin/Marketing/ShowMessageTemplate', [
            'user' => $user,
            'template' => $template
        ]);
    }

    /**
     * Store new message template
     */
    public function marketingMessageTemplateStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subject' => 'required|string|max:500',
            'body' => 'required|string',
            'is_logo_sent' => 'nullable|boolean',
            'logo_position' => 'nullable|in:left,right,top,bottom,center',
            'is_company_logo_sent' => 'nullable|boolean',
            'company_logo_position' => 'nullable|in:left,right,top,bottom,center',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,txt,zip|max:10240',
            'status' => 'nullable|boolean'
        ]);

        // Ensure boolean fields are properly set
        $validated['is_logo_sent'] = $request->has('is_logo_sent') ? (bool) $request->input('is_logo_sent') : false;
        $validated['is_company_logo_sent'] = $request->has('is_company_logo_sent') ? (bool) $request->input('is_company_logo_sent') : false;
        $validated['status'] = $request->has('status') ? (bool) $request->input('status') : true;

        // Handle file uploads
        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('message_templates/banners', 'public');
        }

        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('message_templates/attachments', 'public');
        }

        // Set user IDs
        $validated['created_by'] = Session::get('superadmin_user.id', 1);
        $validated['updated_by'] = Session::get('superadmin_user.id', 1);

        MessageTemplate::create($validated);

        return redirect()->route('superadmin.marketing.message-template.index')
            ->with('success', 'Message template created successfully.');
    }

    /**
     * Update existing message template
     */
    public function marketingMessageTemplateUpdate(Request $request, MessageTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subject' => 'required|string|max:500',
            'body' => 'required|string',
            'is_logo_sent' => 'nullable|boolean',
            'logo_position' => 'nullable|in:left,right,top,bottom,center',
            'is_company_logo_sent' => 'nullable|boolean',
            'company_logo_position' => 'nullable|in:left,right,top,bottom,center',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,txt,zip|max:10240',
            'status' => 'nullable|boolean'
        ]);

        // Ensure boolean fields are properly set
        $validated['is_logo_sent'] = $request->has('is_logo_sent') ? (bool) $request->input('is_logo_sent') : false;
        $validated['is_company_logo_sent'] = $request->has('is_company_logo_sent') ? (bool) $request->input('is_company_logo_sent') : false;
        $validated['status'] = $request->has('status') ? (bool) $request->input('status') : true;

        // Remove file fields from validated array to avoid null updates
        unset($validated['banner_image']);
        unset($validated['attachment']);

        // Handle file uploads - keep existing files if no new files uploaded
        if ($request->hasFile('banner_image')) {
            // Delete old banner image if exists
            if ($template->banner_image) {
                \Storage::disk('public')->delete($template->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('message_templates/banners', 'public');
        }

        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($template->attachment) {
                \Storage::disk('public')->delete($template->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('message_templates/attachments', 'public');
        }

        $validated['updated_by'] = Session::get('superadmin_user.id', 1);

        $template->update($validated);

        return redirect()->route('superadmin.marketing.message-template.index')
            ->with('success', 'Message template updated successfully.');
    }

    /**
     * Delete message template
     */
    public function marketingMessageTemplateDestroy(MessageTemplate $template)
    {
        $template->delete();

        return redirect()->route('superadmin.marketing.message-template.index')
            ->with('success', 'Message template deleted successfully.');
    }

    /**
     * Display push notifications page
     */
    public function marketingPushNotifications()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        $notifications = PushNotification::with(['creator', 'updater'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('superadmin/Marketing/PushNotifications', [
            'user' => $user,
            'notifications' => $notifications
        ]);
    }

    /**
     * Show create push notification form
     */
    public function marketingPushNotificationsCreate()
    {
        $user = Session::get('superadmin_user', [
            'user_name' => 'SuperAdmin',
            'email' => 'admin@zoomconnect.com'
        ]);

        $companies = CompanyMaster::where('status', 1)
            ->orderBy('comp_name')
            ->get(['comp_id', 'comp_name']);

        return Inertia::render('superadmin/Marketing/SendPushNotification', [
            'user' => $user,
            'companies' => $companies
        ]);
    }

    /**
     * Store new push notification
     */
    public function marketingPushNotificationsStore(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:1000',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'notification_type' => 'nullable|string|max:100',
            'target_type' => 'required|in:all,specific',
            'company_ids' => 'required_if:target_type,specific|array',
            'company_ids.*' => 'exists:company_master,comp_id',
            'is_active' => 'nullable|boolean'
        ], [
            'title.required' => 'Notification title is required.',
            'body.required' => 'Notification message is required.',
            'body.max' => 'Notification message cannot exceed 1000 characters.',
            'target_type.required' => 'Please select target audience.',
            'company_ids.required_if' => 'Please select at least one company.',
            'company_ids.*.exists' => 'One or more selected companies are invalid.'
        ]);

        try {
            // Handle uploaded image file (if provided)
            $imageUrl = null;
            if ($request->hasFile('image_file')) {
                $file = $request->file('image_file');
                $filename = time() . '_' . \Illuminate\Support\Str::random(10) . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/push-notifications');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                if ($file->move($uploadPath, $filename)) {
                    $imageUrl = '/uploads/push-notifications/' . $filename;
                }
            }

            $pushNotification = PushNotification::create([
                'title' => $validated['title'],
                'body' => $validated['body'],
                'image_url' => $imageUrl,
                'notification_type' => $validated['notification_type'] ?? 'general',
                'target_type' => $validated['target_type'],
                'company_ids' => $validated['target_type'] === 'specific' ? $validated['company_ids'] : null,
                'is_active' => $validated['is_active'] ?? true,
                'status' => 'pending',
                'created_by' => Session::get('superadmin_user.id', 1),
                'updated_by' => Session::get('superadmin_user.id', 1)
            ]);

            // Dispatch job instance explicitly to avoid issues with static dispatch and constructor signature
            \Log::info('Dispatching SendPushNotificationJob for push id: ' . ($pushNotification->id ?? 'unknown'));
            dispatch(new \App\Jobs\SendPushNotificationJob($pushNotification));

            return redirect()->route('superadmin.marketing.push-notifications.index')
                ->with('success', 'Push notification is being sent in the background.');
        } catch (\Exception $e) {
            // If an image was uploaded but something failed, delete the uploaded file to avoid orphaned files
            if (!empty($imageUrl) && file_exists(public_path($imageUrl))) {
                @unlink(public_path($imageUrl));
            }
            Log::error('Failed to create push notification: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to create push notification. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update existing push notification
     */
    public function marketingPushNotificationsUpdate(Request $request, $notification)
    {
        return redirect()->route('superadmin.marketing.push-notifications.index')
            ->with('success', 'Push notification updated successfully.');
    }

    /**
     * Delete push notification
     */
    public function marketingPushNotificationsDestroy($notification)
    {
        return redirect()->route('superadmin.marketing.push-notifications.index')
            ->with('success', 'Push notification deleted successfully.');
    }

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Marketing Module /////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Policy Module ////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /**
     * Display enrollment lists
     */
    public function policyEnrollmentLists(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $enrollments = EnrollmentDetail::with(['company'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('enrolment_name', 'LIKE', "%{$search}%")
                        ->orWhere('corporate_enrolment_name', 'LIKE', "%{$search}%")
                        ->orWhereHas('company', function ($companyQuery) use ($search) {
                            $companyQuery->where('comp_name', 'LIKE', "%{$search}%");
                        });
                });
            })
            ->when($status !== null && $status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('superadmin/policy/EnrollmentLists', [
            'enrollments' => $enrollments,
            'filters' => [
                'search' => $search,
                'status' => $status
            ]
        ]);
    }

    /**
     * Show the form for creating new enrollment
     */
    public function policyEnrollmentListsCreate()
    {
        $companies = CompanyMaster::where('status', 1)->get(['comp_id as id', 'comp_name']);
        $messageTemplates = MessageTemplate::where('status', 1)->get(['id', 'name', 'category', 'subject', 'body', 'banner_image', 'attachment', 'status']);

        return Inertia::render('superadmin/policy/CreateEnrollment', [
            'companies' => $companies,
            'messageTemplates' => $messageTemplates
        ]);
    }

    /**
     * Store new enrollment
     */
    public function policyEnrollmentListsStore(Request $request)
    {
        // Custom validation for complex multi-step form
        $this->validateEnrollmentData($request);

        try {
            // Process the form data
            $processedData = $this->processEnrollmentData($request);

            // Save directly to EnrollmentDetail without creating separate config
            $processedData['creation_status'] = 1;

            EnrollmentDetail::create($processedData);

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Enrollment created successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Enrollment creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create enrollment. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Validate enrollment data with comprehensive rules
     */
    private function validateEnrollmentData(Request $request)
    {
        $rules = [
            // Basic Details
            'cmp_id' => 'required|exists:company_master,comp_id',
            'enrolment_name' => 'required|string|max:255',
            'corporate_enrolment_name' => 'required|string|max:255',
            'policy_start_date' => 'required|date',
            'policy_end_date' => 'required|date|after:policy_start_date',

            // JSON/Array fields - can be JSON strings or arrays
            'family_defination' => 'required',
            'rating_config' => 'required',
            'extra_coverage_plans' => 'nullable',
            'mail_configuration' => 'required',

            // Step 6: Additional Settings
            'twin_allowed' => 'required|boolean',
            'is_self_allowed_by_default' => 'required|boolean',
            'grade_exclude' => 'nullable',
            'enrollment_statements' => 'nullable',

            'status' => 'required|boolean'
        ];

        $messages = [
            'cmp_id.required' => 'Please select a company.',
            'cmp_id.exists' => 'The selected company is invalid.',
            'enrolment_name.required' => 'Enrollment name is required.',
            'corporate_enrolment_name.required' => 'Corporate enrollment name is required.',
            'policy_start_date.required' => 'Policy start date is required.',
            'policy_end_date.required' => 'Policy end date is required.',
            'policy_end_date.after' => 'Policy end date must be after the policy start date.',
            'family_defination.required' => 'Family definition is required.',
            'rating_config.required' => 'Rating configuration is required.',
            'mail_configuration.required' => 'Mail configuration is required.',
        ];

        $validated = $request->validate($rules, $messages);

        return $validated;
    }

    /**
     * Process enrollment data for storage
     */
    private function processEnrollmentData(Request $request)
    {
        $data = $request->all();

        // Handle JSON fields - decode if they are strings, keep as arrays if already arrays
        $data['family_defination'] = is_string($data['family_defination'])
            ? json_decode($data['family_defination'], true)
            : $data['family_defination'];

        $data['rating_config'] = is_string($data['rating_config'])
            ? json_decode($data['rating_config'], true)
            : $data['rating_config'];

        $data['extra_coverage_plans'] = is_string($data['extra_coverage_plans'])
            ? json_decode($data['extra_coverage_plans'], true)
            : $data['extra_coverage_plans'];

        $data['mail_configuration'] = is_string($data['mail_configuration'])
            ? json_decode($data['mail_configuration'], true)
            : $data['mail_configuration'];

        $data['enrollment_statements'] = is_string($data['enrollment_statements'])
            ? json_decode($data['enrollment_statements'], true)
            : $data['enrollment_statements'];

        $data['grade_exclude'] = is_string($data['grade_exclude'])
            ? json_decode($data['grade_exclude'], true)
            : $data['grade_exclude'];

        // Extract rator_type from rating_config for easier querying
        if (isset($data['rating_config']['plan_type'])) {
            $data['rator_type'] = $data['rating_config']['plan_type'];
        }

        // Extract and set reminder mail configuration fields
        if (isset($data['mail_configuration']['reminder_mail'])) {
            $reminderMail = $data['mail_configuration']['reminder_mail'];
            $data['reminder_mail_enable'] = $reminderMail['enabled'] ?? false;
            $data['frequency_of_reminder_mail'] = $reminderMail['frequency'] ?? null;
            $data['frequency_days'] = $reminderMail['frequency_value'] ?? null;
        }

        // Set default values for boolean fields
        $data['twin_allowed'] = $data['twin_allowed'] ?? false;
        $data['is_self_allowed_by_default'] = $data['is_self_allowed_by_default'] ?? true;
        $data['send_welcome_mail'] = false; // Can be set based on mail config
        $data['send_confirmation_mail'] = false; // Can be set based on mail config
        $data['send_deadline_reminder'] = $data['reminder_mail_enable'] ?? false;
        $data['send_completion_mail'] = false; // Can be set based on mail config
        $data['auto_reminder_enable'] = $data['reminder_mail_enable'] ?? false;
        $data['manual_reminder_enable'] = false; // Default to false

        // Set enrollment directory name based on enrollment name
        $data['enrolment_directory_name'] = strtolower(str_replace(' ', '_', $data['enrolment_name'])) . '_' . time();

        // Ensure status is boolean
        $data['status'] = $data['status'] ?? true;

        return $data;
    }

    /**
     * Validate decoded JSON data
     */
    private function validateDecodedData(Request $request)
    {
        // Decode JSON fields for validation
        $familyDef = json_decode($request->family_defination, true);
        $ratingConfig = json_decode($request->rating_config, true);
        $extraCoverage = json_decode($request->extra_coverage_plans, true);
        $mailConfig = json_decode($request->mail_configuration, true);

        $errors = [];

        // Validate family definition
        if (!$familyDef) {
            $errors['family_defination'] = 'Invalid family definition format.';
        } else {
            $errors = array_merge($errors, $this->validateFamilyDefinitionData($familyDef));
        }

        // Validate rating config
        if (!$ratingConfig) {
            $errors['rating_config'] = 'Invalid rating configuration format.';
        } else {
            $errors = array_merge($errors, $this->validateRatingConfigData($ratingConfig));
        }

        // Validate extra coverage
        if (!$extraCoverage) {
            $errors['extra_coverage_plans'] = 'Invalid extra coverage format.';
        } else {
            $errors = array_merge($errors, $this->validateExtraCoverageData($extraCoverage));
        }

        // Validate mail config
        if (!$mailConfig) {
            $errors['mail_configuration'] = 'Invalid mail configuration format.';
        } else {
            $errors = array_merge($errors, $this->validateMailConfigData($mailConfig));
        }

        if (!empty($errors)) {
            throw \Illuminate\Validation\ValidationException::withMessages($errors);
        }
    }

    /**
     * Validate family definition data
     */
    private function validateFamilyDefinitionData($familyDef)
    {
        $errors = [];

        // Check if at least one family member is enabled
        $enabledMembers = [];
        foreach (['self', 'spouse', 'kid', 'parent', 'parent_in_law', 'sibling', 'partners', 'others'] as $member) {
            if (($familyDef[$member] ?? '0') === '1') {
                $enabledMembers[] = $member;
            }
        }

        if (empty($enabledMembers)) {
            $errors['family_defination'] = 'At least one family member type must be enabled.';
        }

        // Validate age ranges for enabled members
        foreach ($enabledMembers as $member) {
            $minAge = (int)($familyDef["{$member}_min_age"] ?? 0);
            $maxAge = (int)($familyDef["{$member}_max_age"] ?? 0);

            if ($maxAge < $minAge) {
                $errors["family_defination.{$member}_age_range"] = "Maximum age must be greater than or equal to minimum age for {$member}.";
            }
        }

        return $errors;
    }

    /**
     * Validate rating configuration data
     */
    private function validateRatingConfigData($ratingConfig)
    {
        $errors = [];

        if (!isset($ratingConfig['plan_type'])) {
            $errors['rating_config.plan_type'] = 'Plan type is required.';
        }

        if (!isset($ratingConfig['base_sum_insured_type'])) {
            $errors['rating_config.base_sum_insured_type'] = 'Base sum insured type is required.';
        } else {
            if ($ratingConfig['base_sum_insured_type'] === 'fixed') {
                if (!isset($ratingConfig['base_sum_insured']) || $ratingConfig['base_sum_insured'] === '' || $ratingConfig['base_sum_insured'] === null) {
                    $errors['rating_config.base_sum_insured'] = 'Base sum insured amount is required.';
                } elseif ($ratingConfig['base_sum_insured'] < 0) {
                    $errors['rating_config.base_sum_insured'] = 'Base sum insured cannot be negative.';
                }
            } elseif ($ratingConfig['base_sum_insured_type'] === 'grade_wise') {
                if (!isset($ratingConfig['grade_wise_sum_insured']) || empty($ratingConfig['grade_wise_sum_insured'])) {
                    $errors['rating_config.grade_wise_sum_insured'] = 'At least one grade is required for grade-wise sum insured.';
                }
            }
        }

        return $errors;
    }

    /**
     * Validate extra coverage data
     */
    private function validateExtraCoverageData($extraCoverage)
    {
        $errors = [];

        // Extra coverage is optional, so only validate if plans exist
        if (empty($extraCoverage)) {
            return $errors; // No validation needed if no extra coverage
        }

        foreach ($extraCoverage as $index => $plan) {
            if (empty($plan['plan_name'])) {
                $errors["extra_coverage_plans.{$index}.plan_name"] = 'Plan name is required.';
            }

            // Check if at least one coverage is enabled
            $coverages = $plan['extra_coverages'] ?? [];
            $hasEnabledCoverage = false;

            foreach (['co_pay', 'maternity', 'room_rent'] as $coverageType) {
                if (isset($coverages[$coverageType]['enabled']) && $coverages[$coverageType]['enabled']) {
                    $hasEnabledCoverage = true;
                    break;
                }
            }

            if (!$hasEnabledCoverage) {
                $errors["extra_coverage_plans.{$index}"] = 'At least one coverage type must be enabled in each plan.';
            }
        }

        return $errors;
    }

    /**
     * Validate mail configuration data
     */
    private function validateMailConfigData($mailConfig)
    {
        $errors = [];

        if (!isset($mailConfig['enrollment_mail']['template_id']) || empty($mailConfig['enrollment_mail']['template_id'])) {
            $errors['mail_configuration.enrollment_mail.template_id'] = 'Enrollment mail template is required.';
        }

        if (isset($mailConfig['reminder_mail']['enabled']) && $mailConfig['reminder_mail']['enabled']) {
            if (!isset($mailConfig['reminder_mail']['template_id']) || empty($mailConfig['reminder_mail']['template_id'])) {
                $errors['mail_configuration.reminder_mail.template_id'] = 'Reminder mail template is required when reminder mail is enabled.';
            }

            if (!isset($mailConfig['reminder_mail']['frequency']) || empty($mailConfig['reminder_mail']['frequency'])) {
                $errors['mail_configuration.reminder_mail.frequency'] = 'Reminder frequency is required when reminder mail is enabled.';
            }

            if (!isset($mailConfig['reminder_mail']['frequency_value']) || $mailConfig['reminder_mail']['frequency_value'] < 1) {
                $errors['mail_configuration.reminder_mail.frequency_value'] = 'Frequency value must be at least 1.';
            }
        }

        return $errors;
    }

    /**
     * Validate data integrity
     */
    private function validateDataIntegrity($data)
    {
        // Ensure family definition consistency
        if (isset($data['family_defination'])) {
            foreach (['self', 'spouse', 'kid', 'parent', 'parent_in_law', 'sibling', 'partners', 'others'] as $member) {
                if (($data['family_defination'][$member] ?? '0') === '0') {
                    $data['family_defination']["{$member}_no"] = '0';
                }
            }
        }

        // Additional integrity checks can be added here
        return $data;
    }

    /**
     * Validate a specific enrollment step
     */
    public function validateEnrollmentStep(Request $request)
    {
        $step = $request->input('step');
        $stepData = $request->input('data', []);

        try {
            switch ($step) {
                case 1:
                    $this->validateBasicDetails($stepData);
                    break;
                case 2:
                    $this->validateFamilyDefinitionStep($stepData);
                    break;
                case 3:
                    $this->validateRatingConfigurationStep($stepData);
                    break;
                case 4:
                    $this->validateExtraCoverageStep($stepData);
                    break;
                case 5:
                    $this->validateMailConfigurationStep($stepData);
                    break;
                default:
                    return response()->json(['valid' => false, 'errors' => ['step' => 'Invalid step']], 422);
            }

            return response()->json(['valid' => true]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['valid' => false, 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['valid' => false, 'errors' => ['general' => $e->getMessage()]], 422);
        }
    }

    /**
     * Validate basic details step
     */
    private function validateBasicDetails($data)
    {
        $rules = [
            'cmp_id' => 'required|exists:company_master,comp_id',
            'enrolment_name' => 'required|string|max:255|regex:/^[a-zA-Z0-9\s\-_]+$/',
            'corporate_enrolment_name' => 'required|string|max:255|regex:/^[a-zA-Z0-9\s\-_]+$/',
            'policy_start_date' => 'required|date',
            'policy_end_date' => 'required|date|after:policy_start_date',
        ];

        $messages = [
            'cmp_id.required' => 'Please select a company.',
            'cmp_id.exists' => 'The selected company is invalid.',
            'enrolment_name.required' => 'Enrollment name is required.',
            'enrolment_name.regex' => 'Enrollment name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'corporate_enrolment_name.required' => 'Corporate enrollment name is required.',
            'corporate_enrolment_name.regex' => 'Corporate enrollment name can only contain letters, numbers, spaces, hyphens, and underscores.',
            'policy_start_date.required' => 'Policy start date is required.',
            'policy_end_date.required' => 'Policy end date is required.',
            'policy_end_date.after' => 'Policy end date must be after the policy start date.',
        ];

        $validator = \Validator::make($data, $rules, $messages);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    /**
     * Validate family definition step
     */
    private function validateFamilyDefinitionStep($data)
    {
        if (!isset($data['family_defination'])) {
            throw new \Exception('Family definition is required.');
        }

        $familyDef = $data['family_defination'];
        if (is_string($familyDef)) {
            $familyDef = json_decode($familyDef, true);
        }

        $errors = $this->validateFamilyDefinitionData($familyDef);

        if (!empty($errors)) {
            $validator = \Validator::make([], []);
            foreach ($errors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    /**
     * Validate rating configuration step
     */
    private function validateRatingConfigurationStep($data)
    {
        if (!isset($data['rating_config'])) {
            throw new \Exception('Rating configuration is required.');
        }

        $ratingConfig = $data['rating_config'];
        if (is_string($ratingConfig)) {
            $ratingConfig = json_decode($ratingConfig, true);
        }

        $errors = $this->validateRatingConfigData($ratingConfig);

        if (!empty($errors)) {
            $validator = \Validator::make([], []);
            foreach ($errors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    /**
     * Validate extra coverage step
     */
    private function validateExtraCoverageStep($data)
    {
        // Extra coverage is optional, so we only validate if it exists
        if (!isset($data['extra_coverage_plans']) || empty($data['extra_coverage_plans'])) {
            return; // No validation needed if no extra coverage
        }

        $extraCoverage = $data['extra_coverage_plans'];
        if (is_string($extraCoverage)) {
            $extraCoverage = json_decode($extraCoverage, true);
        }

        $errors = $this->validateExtraCoverageData($extraCoverage);

        if (!empty($errors)) {
            $validator = \Validator::make([], []);
            foreach ($errors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    /**
     * Validate mail configuration step
     */
    private function validateMailConfigurationStep($data)
    {
        if (!isset($data['mail_configuration'])) {
            throw new \Exception('Mail configuration is required.');
        }

        $mailConfig = $data['mail_configuration'];
        if (is_string($mailConfig)) {
            $mailConfig = json_decode($mailConfig, true);
        }

        $errors = $this->validateMailConfigData($mailConfig);

        if (!empty($errors)) {
            $validator = \Validator::make([], []);
            foreach ($errors as $field => $message) {
                $validator->errors()->add($field, $message);
            }
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    /**
     * Show edit form for enrollment
     */
    public function policyEnrollmentListsEdit($id)
    {
        $enrollment = EnrollmentDetail::findOrFail($id);
        $companies = CompanyMaster::where('status', 1)->get(['comp_id as id', 'comp_name']);
        $messageTemplates = MessageTemplate::where('status', 1)->get(['id', 'name', 'category', 'subject', 'body', 'banner_image', 'attachment', 'status']);

        return Inertia::render('superadmin/policy/EditEnrollment', [
            'enrollment' => $enrollment,
            'companies' => $companies,
            'messageTemplates' => $messageTemplates
        ]);
    }

    /**
     * Update enrollment
     */
    public function policyEnrollmentListsUpdate(Request $request, $id)
    {
        $enrollment = EnrollmentDetail::findOrFail($id);

        // Use the same validation as create
        $this->validateEnrollmentData($request);

        try {
            // Process the form data
            $processedData = $this->processEnrollmentData($request);

            // Update the enrollment
            $enrollment->update($processedData);

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('success', 'Enrollment updated successfully!');
        } catch (\Exception $e) {
            Log::error('Enrollment update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update enrollment. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Toggle enrollment status
     */
    public function policyEnrollmentListsToggleStatus($id)
    {
        try {
            $enrollment = EnrollmentDetail::findOrFail($id);
            $enrollment->status = !$enrollment->status;
            $enrollment->save();

            $status = $enrollment->status ? 'activated' : 'deactivated';

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', "Enrollment {$status} successfully!")
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Toggle enrollment status failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update enrollment status.']);
        }
    }

    /**
     * Make enrollment active
     */
    public function policyEnrollmentListsMakeActive($id)
    {
        try {
            $enrollment = EnrollmentDetail::findOrFail($id);

            if ($enrollment->status) {
                return redirect()->route('superadmin.policy.enrollment-lists.index')
                    ->with('message', 'Enrollment is already active!')
                    ->with('messageType', 'info');
            }

            $enrollment->status = true;
            $enrollment->save();

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Enrollment activated successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Make enrollment active failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to activate enrollment.']);
        }
    }

    /**
     * Make enrollment inactive
     */
    public function policyEnrollmentListsMakeInactive($id)
    {
        try {
            $enrollment = EnrollmentDetail::findOrFail($id);

            if (!$enrollment->status) {
                return redirect()->route('superadmin.policy.enrollment-lists.index')
                    ->with('message', 'Enrollment is already inactive!')
                    ->with('messageType', 'info');
            }

            $enrollment->status = false;
            $enrollment->save();

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Enrollment deactivated successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Make enrollment inactive failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to deactivate enrollment.']);
        }
    }

    /**
     * Delete enrollment
     */
    public function policyEnrollmentListsDestroy($id)
    {
        try {
            $enrollment = EnrollmentDetail::findOrFail($id);
            $enrollment->delete();

            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Enrollment deleted successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Enrollment deletion failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete enrollment. Please try again.']);
        }
    }

    /**
     * Show enrollment details and periods
     */
    public function policyEnrollmentDetails($id)
    {
        try {
            // Get the enrollment details
            $enrollmentDetail = EnrollmentDetail::with('company')->findOrFail($id);

            // Get enrollment periods using the specific query
            $enrollmentPeriods = \DB::select("
                SELECT enrolment_period.*, enrolment_details.corporate_enrolment_name
                FROM enrolment_period
                INNER JOIN enrolment_details ON enrolment_period.enrolment_id = enrolment_details.id
                WHERE enrolment_period.enrolment_id = ?
                ORDER BY enrolment_period.portal_end_date DESC
            ", [$id]);

            // Convert to array if needed
            $enrollmentPeriods = collect($enrollmentPeriods)->map(function ($period) {
                return (array) $period;
            })->toArray();

            return Inertia::render('superadmin/policy/EnrollmentDetails', [
                'enrollmentDetail' => $enrollmentDetail,
                'enrollmentPeriods' => $enrollmentPeriods
            ]);
        } catch (\Exception $e) {
            Log::error('Enrollment details fetch failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load enrollment details.')
                ->with('messageType', 'error');
        }
    }

    /**
     * View enrollment period details with smart redirection
     */
    public function viewEnrollmentPeriodDetails($enrollmentPeriodId)
    {
        try {
            $enrollmentPeriod = DB::table('enrolment_period')->where('id', $enrollmentPeriodId)->first();
            if (!$enrollmentPeriod) {
                return redirect()->route('superadmin.policy.enrollment-lists.index')
                    ->with('message', 'Enrollment period not found.')
                    ->with('messageType', 'error');
            }

            // Redirect based on creation_status
            switch ($enrollmentPeriod->creation_status) {
                case 1:
                    // Redirect to select employees
                    return redirect()->route('superadmin.select-employees-for-portal', $enrollmentPeriod->id);
                case 2:
                    // Redirect to live portal
                    return redirect()->route('superadmin.view-live-portal', $enrollmentPeriod->id);
                default:
                    // Fallback to enrollment details
                    return redirect()->route('superadmin.policy.enrollment-details', $enrollmentPeriod->enrolment_id);
            }
        } catch (\Exception $e) {
            Log::error('View enrollment period details failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load enrollment period details.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Open new enrollment portal
     */
    public function openEnrollmentPortal($id)
    {
        try {
            // Get the enrollment details
            $enrollmentDetail = EnrollmentDetail::with('company')->findOrFail($id);
            return Inertia::render('superadmin/policy/OpenEnrollmentPortal', [
                'enrollmentDetail' => $enrollmentDetail
            ]);
        } catch (\Exception $e) {
            Log::error('Open enrollment portal failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to open enrollment portal.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Create a new enrollment period
     */
    public function createEnrollmentPeriod(Request $request, $id)
    {
        try {

            // Validate the request
            $validated = $request->validate([
                'enrolment_portal_name' => 'required|string|max:255',
                'portal_start_date' => 'required|date',
                'portal_end_date' => 'required|date|after:portal_start_date',
            ]);

            // Get the enrollment detail
            $enrollmentDetail = EnrollmentDetail::findOrFail($id);

            // Create the enrollment period
            $enrollmentPeriod = new \App\Models\EnrollmentPeriod();
            $enrollmentPeriod->enrolment_id = $enrollmentDetail->id;
            $enrollmentPeriod->cmp_id = $enrollmentDetail->cmp_id;
            $enrollmentPeriod->enrolment_portal_name = $validated['enrolment_portal_name'];
            $enrollmentPeriod->portal_start_date = $validated['portal_start_date'];
            $enrollmentPeriod->portal_end_date = $validated['portal_end_date'];
            $enrollmentPeriod->creation_status = 1;
            $enrollmentPeriod->is_active = 1;
            $enrollmentPeriod->is_delete = 0;
            $enrollmentPeriod->save();

            // Redirect to select employees page
            return redirect()->route('superadmin.select-employees-for-portal', $enrollmentPeriod->id)
                ->with('message', 'Enrollment portal created successfully!')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Create enrollment period failed: ' . $e->getMessage());
            return back()
                ->with('message', 'Failed to create enrollment period. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * Show select employees for portal page
     */
    public function selectEmployeesForPortal($enrollmentPeriodId)
    {
        try {
            // Get the enrollment period with related data
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::with(['enrollmentDetail.company'])->findOrFail($enrollmentPeriodId);
            // Get enrollment details
            $enrollmentDetail = $enrollmentPeriod->enrollmentDetail;
            // Get family definition from enrollment details
            $familyDefinition = is_string($enrollmentDetail->family_defination)
                ? json_decode($enrollmentDetail->family_defination, true)
                : $enrollmentDetail->family_defination;

            // Get grade exclusions from enrollment details
            $gradeExclusions = is_string($enrollmentDetail->grade_exclude)
                ? json_decode($enrollmentDetail->grade_exclude, true)
                : $enrollmentDetail->grade_exclude;
            $gradeExclusions = $gradeExclusions ?? [];

            // Get currently mapped employees for THIS specific enrollment period
            $currentPortalMappedIds = \DB::table('enrolment_mapping_master')
                ->where('enrolment_id', $enrollmentPeriod->enrolment_id)
                ->where('status', 1)
                ->where('enrolment_period_id', $enrollmentPeriod->id)
                ->where('cmp_id', $enrollmentPeriod->cmp_id)
                ->pluck('emp_id')
                ->toArray();

            // Get employees mapped to ANY portal of this enrollment (for exclusion in edit mode)
            $allEnrollmentMappedIds = \DB::table('enrolment_mapping_master')
                ->where('enrolment_id', $enrollmentPeriod->enrolment_id)
                ->where('status', 1)
                ->where('cmp_id', $enrollmentPeriod->cmp_id)
                ->pluck('emp_id')
                ->toArray();

            // Start building the query for employees
            $query = \DB::table('company_employees')
                ->select([
                    'company_employees.*',
                    \DB::raw("CASE WHEN company_employees.id IN (" .
                        (empty($currentPortalMappedIds) ? "0" : implode(',', $currentPortalMappedIds)) .
                        ") THEN 'true' ELSE 'false' END as is_mapped_in_enrolment_id")
                ])
                ->where('company_employees.is_delete', 0)
                ->where('company_employees.company_id', $enrollmentPeriod->cmp_id);

            // For creation_status = 1 (first time), exclude all already mapped employees
            // For creation_status = 2 (editing), exclude employees mapped to OTHER portals, but include current portal employees
            if ($enrollmentPeriod->creation_status == 1) {
                // First time: exclude all mapped employees
                if (!empty($allEnrollmentMappedIds)) {
                    $query->whereNotIn('company_employees.id', $allEnrollmentMappedIds);
                }
            } else {
                // Edit mode: exclude employees mapped to other portals, keep current portal employees
                $otherPortalMappedIds = array_diff($allEnrollmentMappedIds, $currentPortalMappedIds);
                if (!empty($otherPortalMappedIds)) {
                    $query->whereNotIn('company_employees.id', $otherPortalMappedIds);
                }
            }
            // Apply family definition filters if self is enabled
            if (isset($familyDefinition['self']) && $familyDefinition['self'] == '1') {
                // Calculate age range
                $minAgeYears = (int)($familyDefinition['self_min_age'] ?? 18);
                $maxAgeYears = (int)($familyDefinition['self_max_age'] ?? 65);

                $minAgeDate = now()->subYears($minAgeYears)->format('Y-m-d');
                $maxAgeDate = now()->subYears($maxAgeYears)->format('Y-m-d');

                // Apply age filters
                $query->where('dob', '<', $minAgeDate)
                    ->where('dob', '>', $maxAgeDate);

                // Apply gender filters
                $selfGender = $familyDefinition['self_gender'] ?? 'all';
                if ($selfGender === 'both') {
                    $query->whereIn('gender', ['male', 'female', 'other']);
                } elseif ($selfGender === 'all') {
                    // No gender restriction
                } elseif (in_array($selfGender, ['male', 'female', 'other'])) {
                    $query->where('gender', $selfGender);
                }
            }
            // Apply grade exclusions
            if (!empty($gradeExclusions)) {
                // Handle both "A BAND" and "A" formats by checking both forms
                $gradeExclusionPatterns = [];
                foreach ($gradeExclusions as $grade) {
                    $gradeExclusionPatterns[] = $grade;
                    // If it contains "BAND", also try without "BAND"
                    if (strpos($grade, ' BAND') !== false) {
                        $gradeExclusionPatterns[] = str_replace(' BAND', '', $grade);
                    } else {
                        // If it doesn't contain "BAND", also try with "BAND"
                        $gradeExclusionPatterns[] = $grade . ' BAND';
                    }
                }

                $query->whereNotIn('grade', array_unique($gradeExclusionPatterns));
            }

            // Execute query and get results
            $employees = $query->orderBy('is_mapped_in_enrolment_id', 'desc')->get();

            return Inertia::render('superadmin/policy/SelectEmployeesForPortal', [
                'enrollmentPeriod' => $enrollmentPeriod,
                'unmappedEmployees' => $employees, // All employees (mapped and unmapped)
                'mappedEmployeeIds' => $currentPortalMappedIds, // IDs of currently selected employees
                'familyDefinition' => $familyDefinition,
                'gradeExclusions' => $gradeExclusions,
                'debugInfo' => [
                    'sampleGrades' => DB::table('company_employees')
                        ->where('is_delete', 0)
                        ->whereNotNull('grade')
                        ->distinct()
                        ->pluck('grade')
                        ->take(20)
                        ->toArray(),
                    'gradeExclusions' => $gradeExclusions,
                    'gradeExclusionPatterns' => isset($gradeExclusionPatterns) ? $gradeExclusionPatterns : []
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Select employees for portal failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load employee selection page.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Admin -> Surveys index
     */
    public function adminSurveysIndex()
    {
        $surveys = \App\Models\Survey::with('questions')
            ->withCount('questions')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('superadmin/admin/surveys/Index', [
            'surveys' => $surveys
        ]);
    }

    /**
     * Admin -> Surveys Reports
     * Accepts optional query param `ids` (comma separated) to limit which surveys to report on.
     */
    public function adminSurveysReports(Request $request)
    {
        // Check if this is an assignment-level report
        $assignmentId = $request->query('assignment');

        if ($assignmentId) {
            $assignment = \App\Models\CompanyAssignSurvey::with(['survey.questions', 'company'])
                ->findOrFail($assignmentId);

            // Get all responses for this assignment
            $responses = \DB::table('survey_responses')
                ->where('assigned_survey_id', $assignmentId)
                ->get();

            // Get questions for the survey
            $questions = \App\Models\SurveyQuestion::where('survey_id', $assignment->survey_id)->get();

            // Aggregate data by question type
            $ratingData = [];
            $multipleChoiceData = [];
            $textResponses = [];
            $checkboxData = [];
            $overviewStats = [
                'total_responses' => $responses->whereNotNull('emp_id')->unique('emp_id')->count(),
                'total_questions' => $questions->count(),
                'response_rate' => 0, // Calculate based on total employees if needed
            ];

            foreach ($questions as $question) {
                $questionResponses = $responses->where('question_id', $question->id);

                if ($question->type === 'rating') {
                    $ratings = $questionResponses->whereNotNull('rating');
                    $avgRating = $ratings->avg('rating');
                    $ratingData[] = [
                        'question_id' => $question->id,
                        'question' => $question->question,
                        'focus_area' => $question->focus_area,
                        'avg_rating' => $avgRating ? round($avgRating, 2) : 0,
                        'response_count' => $ratings->count(),
                        'ratings_distribution' => $this->getRatingDistribution($ratings),
                    ];
                } elseif ($question->type === 'multiple_choice') {
                    $choices = $questionResponses->whereNotNull('response_choice');
                    $choiceDistribution = [];
                    foreach ($choices as $choice) {
                        $responseChoice = json_decode($choice->response_choice, true);
                        if (is_array($responseChoice)) {
                            foreach ($responseChoice as $c) {
                                $choiceDistribution[$c] = ($choiceDistribution[$c] ?? 0) + 1;
                            }
                        }
                    }
                    $multipleChoiceData[] = [
                        'question_id' => $question->id,
                        'question' => $question->question,
                        'focus_area' => $question->focus_area,
                        'response_count' => $choices->count(),
                        'distribution' => $choiceDistribution,
                    ];
                } elseif ($question->type === 'text') {
                    $texts = $questionResponses->whereNotNull('response_text');
                    $textResponses[] = [
                        'question_id' => $question->id,
                        'question' => $question->question,
                        'focus_area' => $question->focus_area,
                        'response_count' => $texts->count(),
                        'responses' => $texts->pluck('response_text')->take(50)->values(), // Limit to 50 for display
                    ];
                } elseif ($question->type === 'checkbox') {
                    $checkboxes = $questionResponses->whereNotNull('response_checkboxes');
                    $checkboxDistribution = [];
                    foreach ($checkboxes as $checkbox) {
                        $responseCheckboxes = json_decode($checkbox->response_checkboxes, true);
                        if (is_array($responseCheckboxes)) {
                            foreach ($responseCheckboxes as $cb) {
                                $checkboxDistribution[$cb] = ($checkboxDistribution[$cb] ?? 0) + 1;
                            }
                        }
                    }
                    $checkboxData[] = [
                        'question_id' => $question->id,
                        'question' => $question->question,
                        'focus_area' => $question->focus_area,
                        'response_count' => $checkboxes->count(),
                        'distribution' => $checkboxDistribution,
                    ];
                }
            }

            // Focus area aggregation for overview
            $focusAreaStats = [];
            foreach ($ratingData as $rating) {
                $fa = $rating['focus_area'] ?? 'General';
                if (!isset($focusAreaStats[$fa])) {
                    $focusAreaStats[$fa] = ['total' => 0, 'count' => 0];
                }
                $focusAreaStats[$fa]['total'] += $rating['avg_rating'] * $rating['response_count'];
                $focusAreaStats[$fa]['count'] += $rating['response_count'];
            }

            $focusAreaAverages = [];
            foreach ($focusAreaStats as $fa => $data) {
                $focusAreaAverages[] = [
                    'focus_area' => $fa,
                    'avg_rating' => $data['count'] > 0 ? round($data['total'] / $data['count'], 2) : 0,
                    'response_count' => $data['count'],
                ];
            }

            // Transform data to analytics format
            $ratingQuestions = [];
            foreach ($ratingData as $rating) {
                $ratingQuestions[] = [
                    'question_text' => $rating['question'],
                    'focus_area' => $rating['focus_area'],
                    'avg_rating' => $rating['avg_rating'],
                    'response_count' => $rating['response_count'],
                ];
            }

            $multipleChoiceQuestions = [];
            foreach ($multipleChoiceData as $mc) {
                $choices = [];
                foreach ($mc['distribution'] as $choice => $count) {
                    $choices[] = ['choice' => $choice, 'count' => $count];
                }
                $multipleChoiceQuestions[] = [
                    'question_text' => $mc['question'],
                    'response_count' => $mc['response_count'],
                    'choices' => $choices,
                ];
            }

            $textQuestions = [];
            foreach ($textResponses as $text) {
                $textQuestions[] = [
                    'question_text' => $text['question'],
                    'response_count' => $text['response_count'],
                    'responses' => collect($text['responses'])->map(function ($resp) {
                        return [
                            'response_text' => $resp,
                            'created_at' => now(),
                        ];
                    })->all(),
                ];
            }

            $checkboxQuestions = [];
            foreach ($checkboxData as $cb) {
                $options = [];
                foreach ($cb['distribution'] as $option => $count) {
                    $options[] = ['option' => $option, 'count' => $count];
                }
                $checkboxQuestions[] = [
                    'question_text' => $cb['question'],
                    'response_count' => $cb['response_count'],
                    'options' => $options,
                ];
            }

            $overallAvgRating = 0;
            if (count($ratingQuestions) > 0) {
                $overallAvgRating = collect($ratingQuestions)->avg('avg_rating');
            }

            $analytics = [
                'total_responses' => $overviewStats['total_responses'],
                'total_questions' => $overviewStats['total_questions'],
                'overall_avg_rating' => round($overallAvgRating, 2),
                'rating_questions' => $ratingQuestions,
                'multiple_choice_questions' => $multipleChoiceQuestions,
                'text_questions' => $textQuestions,
                'checkbox_questions' => $checkboxQuestions,
                'focus_area_averages' => $focusAreaAverages,
            ];

            return Inertia::render('superadmin/admin/surveys/AssignedReports', [
                'assignment' => $assignment,
                'analytics' => $analytics,
            ]);
        }

        // Regular surveys-level reports
        $ids = $request->query('ids');
        if ($ids) {
            $idArray = array_filter(array_map('trim', explode(',', $ids)));
            $surveys = \App\Models\Survey::with('questions')
                ->whereIn('id', $idArray)
                ->get();
        } else {
            $surveys = \App\Models\Survey::with('questions')->get();
            $idArray = [];
        }

        return Inertia::render('superadmin/admin/surveys/Reports', [
            'surveys' => $surveys,
            'selectedIds' => $idArray,
        ]);
    }

    private function getRatingDistribution($ratings)
    {
        $distribution = [];
        foreach ($ratings as $r) {
            $rating = (int)$r->rating;
            $distribution[$rating] = ($distribution[$rating] ?? 0) + 1;
        }
        ksort($distribution);
        return $distribution;
    }

    /**
     * Admin -> Surveys create page
     */
    public function adminSurveysCreate()
    {
        return Inertia::render('superadmin/admin/surveys/Create');
    }

    /**
     * Store new survey
     */
    public function adminSurveysStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        try {
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logo = $request->file('logo');
                $logoName = time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();
                $uploadPath = public_path('uploads/surveys');

                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                if ($logo->move($uploadPath, $logoName)) {
                    $logoPath = 'uploads/surveys/' . $logoName;
                }
            }

            $survey = \App\Models\Survey::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'logo' => $logoPath,
            ]);

            return redirect()->route('superadmin.admin.surveys.questions', $survey->id)
                ->with('message', 'Survey created! Now add questions.')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey creation failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to create survey')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * Show edit survey form
     */
    public function adminSurveysEdit($id)
    {
        $survey = \App\Models\Survey::findOrFail($id);

        return Inertia::render('superadmin/admin/surveys/Edit', [
            'survey' => $survey
        ]);
    }

    /**
     * Update survey
     */
    public function adminSurveysUpdate(Request $request, $id)
    {
        $survey = \App\Models\Survey::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
        ]);

        try {
            $logoPath = $survey->logo;

            if ($request->hasFile('logo')) {
                // Delete old logo
                if ($logoPath && file_exists(public_path($logoPath))) {
                    unlink(public_path($logoPath));
                }

                $logo = $request->file('logo');
                $logoName = time() . '_' . Str::random(10) . '.' . $logo->getClientOriginalExtension();
                $uploadPath = public_path('uploads/surveys');

                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }

                if ($logo->move($uploadPath, $logoName)) {
                    $logoPath = 'uploads/surveys/' . $logoName;
                }
            }

            $survey->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'logo' => $logoPath,
            ]);

            return redirect()->route('superadmin.admin.surveys.index')
                ->with('message', 'Survey updated successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey update failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to update survey')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * Delete survey
     */
    public function adminSurveysDestroy($id)
    {
        try {
            $survey = \App\Models\Survey::findOrFail($id);

            // Delete logo
            if ($survey->logo && file_exists(public_path($survey->logo))) {
                unlink(public_path($survey->logo));
            }

            // Delete related questions and assignments
            $survey->questions()->delete();
            $survey->assignments()->delete();
            $survey->delete();

            return redirect()->route('superadmin.admin.surveys.index')
                ->with('message', 'Survey deleted successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey deletion failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to delete survey')
                ->with('messageType', 'error');
        }
    }

    /**
     * Manage survey questions
     */
    public function adminSurveyQuestions($id)
    {
        $survey = \App\Models\Survey::with('questions')->findOrFail($id);

        return Inertia::render('superadmin/admin/surveys/Questions', [
            'survey' => $survey
        ]);
    }

    /**
     * Store survey questions
     */
    public function adminSurveyQuestionsStore(Request $request, $id)
    {
        $survey = \App\Models\Survey::findOrFail($id);

        $validated = $request->validate([
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|in:text,multiplechoice,checkbox,rating',
            'questions.*.options' => 'nullable|array',
            'questions.*.focus_area' => 'required|string',
        ]);

        try {
            // Delete existing questions
            $survey->questions()->delete();

            // Create new questions
            foreach ($validated['questions'] as $questionData) {
                \App\Models\SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'question' => $questionData['question'],
                    'type' => $questionData['type'],
                    'options' => $questionData['options'] ?? null,
                    'focus_area' => $questionData['focus_area'],
                ]);
            }

            return redirect()->route('superadmin.admin.surveys.index')
                ->with('message', 'Survey questions saved successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey questions save failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to save questions')
                ->with('messageType', 'error');
        }
    }

    /**
     * Show assign survey to companies page
     */
    public function adminSurveyAssign($id)
    {
        $survey = \App\Models\Survey::findOrFail($id);
        $companies = CompanyMaster::where('status', 1)
            ->orderBy('comp_name')
            ->get(['comp_id', 'comp_name']);

        $assignments = \App\Models\CompanyAssignSurvey::where('survey_id', $id)
            ->with('company')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('superadmin/admin/surveys/Assign', [
            'survey' => $survey,
            'companies' => $companies,
            'assignments' => $assignments,
        ]);
    }

    /**
     * Store survey assignment to company
     */
    public function adminSurveyAssignStore(Request $request, $id)
    {
        $survey = \App\Models\Survey::findOrFail($id);

        $validated = $request->validate([
            'comp_id' => 'required|exists:company_master,comp_id',
            'name' => 'required|string|max:255',
            'survey_start_date' => 'required|date',
            'survey_end_date' => 'required|date|after:survey_start_date',
            'is_active' => 'boolean',
        ]);

        try {
            \App\Models\CompanyAssignSurvey::create([
                'survey_id' => $survey->id,
                'comp_id' => $validated['comp_id'],
                'name' => $validated['name'],
                'survey_start_date' => $validated['survey_start_date'],
                'survey_end_date' => $validated['survey_end_date'],
                'is_active' => $validated['is_active'] ?? 1,
            ]);

            return redirect()->back()
                ->with('message', 'Survey assigned to company successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey assignment failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to assign survey')
                ->with('messageType', 'error');
        }
    }

    /**
     * Update survey assignment
     */
    public function adminSurveyAssignmentUpdate(Request $request, $id)
    {
        $validated = $request->validate([
            'comp_id' => 'required|exists:company_master,comp_id',
            'name' => 'required|string|max:255',
            'survey_start_date' => 'required|date',
            'survey_end_date' => 'required|date|after:survey_start_date',
            'is_active' => 'boolean',
        ]);

        try {
            $assignment = \App\Models\CompanyAssignSurvey::findOrFail($id);
            $assignment->update([
                'comp_id' => $validated['comp_id'],
                'name' => $validated['name'],
                'survey_start_date' => $validated['survey_start_date'],
                'survey_end_date' => $validated['survey_end_date'],
                'is_active' => $validated['is_active'] ?? 1,
            ]);

            return redirect()->back()
                ->with('message', 'Assignment updated successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey assignment update failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to update assignment')
                ->with('messageType', 'error');
        }
    }

    /**
     * Delete survey assignment
     */
    public function adminSurveyAssignmentDelete($id)
    {
        try {
            $assignment = \App\Models\CompanyAssignSurvey::findOrFail($id);
            $assignment->delete();

            return redirect()->back()
                ->with('message', 'Assignment deleted successfully!')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            Log::error('Survey assignment deletion failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to delete assignment')
                ->with('messageType', 'error');
        }
    }

    /**
     * Handle employee mapping to enrollment portal (matches CodeIgniter logic)
     */
    public function employeeMapping(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'office' => 'required|array|min:1',
                'office.*' => 'integer|exists:company_employees,id',
                'portal_id' => 'required|integer|exists:enrolment_period,id',
                'enrolment_id' => 'required|integer'
            ]);

            $employees = $validatedData['office'];
            $portalId = $validatedData['portal_id'];
            $enrolmentId = $validatedData['enrolment_id'];

            $enrollmentPeriod = \App\Models\EnrollmentPeriod::with(['enrollmentDetail.company'])->findOrFail($portalId);

            // Step 1: Set status = 0 for existing mappings with this portal and enrollment
            DB::table('enrolment_mapping_master')
                ->where('enrolment_period_id', $portalId)
                ->where('enrolment_id', $enrolmentId)
                ->update(['status' => 0, 'updated_at' => now()]);

            // Step 2: Process each selected employee
            foreach ($employees as $employeeId) {
                // Check if employee has any mapping for this enrollment (any period)
                $existingMapping = DB::table('enrolment_mapping_master')
                    ->where('enrolment_id', $enrolmentId)
                    ->where('emp_id', $employeeId)
                    ->first();

                if ($existingMapping) {
                    // Update existing mapping to active
                    DB::table('enrolment_mapping_master')
                        ->where('enrolment_id', $enrolmentId)
                        ->where('emp_id', $employeeId)
                        ->update(['status' => 1, 'enrolment_period_id' => $portalId, 'updated_at' => now()]);

                    // If no current mapping exists, continue (don't create new one)
                } else {
                    // Employee doesn't exist in enrollment, create new mapping
                    DB::table('enrolment_mapping_master')->insert([
                        'emp_id' => $employeeId,
                        'cmp_id' =>  $enrollmentPeriod->cmp_id, // Default to 1 if no session
                        'enrolment_id' => $enrolmentId,
                        'enrolment_period_id' => $portalId,
                        'submit_status' => 0,
                        'view_status' => 0,
                        'status' => 1,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            // Step 3: Get enrollment portal and check creation status
            $enrollmentPeriod = DB::table('enrolment_period')->where('id', $portalId)->first();

            if ($enrollmentPeriod->creation_status > 1) {
                // Redirect to view live portal
                return redirect()->route('superadmin.view-live-portal', $enrollmentPeriod->id)
                    ->with('message', 'Employees successfully assigned!')
                    ->with('messageType', 'success');
            } else {
                // Update creation status to 2 and redirect to view live portal
                DB::table('enrolment_period')
                    ->where('id', $portalId)
                    ->update(['creation_status' => 2, 'updated_at' => now()]);

                return redirect()->route('superadmin.view-live-portal', $enrollmentPeriod->id)
                    ->with('message', 'Employees successfully assigned!')
                    ->with('messageType', 'success');
            }
        } catch (\Exception $e) {

            Log::error('Employee mapping failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to assign employees. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * View live enrollment portal (matches CodeIgniter logic)
     */
    public function viewLivePortal($enrollmentPeriodId)
    {
        try {
            $enrollmentPeriod = DB::table('enrolment_period')->where('id', $enrollmentPeriodId)->first();

            if (!$enrollmentPeriod) {
                return redirect()->route('superadmin.policy.enrollment-lists.index')
                    ->with('message', 'Enrollment portal not found.')
                    ->with('messageType', 'error');
            }

            $enrollmentDetail = DB::table('enrolment_details')->where('id', $enrollmentPeriod->enrolment_id)->first();

            // Handle creation status redirects
            switch ($enrollmentPeriod->creation_status) {
                case 1:
                    return redirect()->route('superadmin.select-employees-for-portal', $enrollmentPeriod->id);
                case 2:
                    // Continue to show portal (send mailers page would be here)
                    break;
            }


            // Get total selected employees count
            $totalSelectedEmployees = DB::select("
                SELECT COUNT(*) AS count
                FROM enrolment_mapping_master
                INNER JOIN company_employees ON enrolment_mapping_master.emp_id = company_employees.id
                WHERE enrolment_mapping_master.status = 1
                AND enrolment_mapping_master.enrolment_id = ?
                AND enrolment_mapping_master.enrolment_period_id = ?
                AND company_employees.is_delete = 0
            ", [$enrollmentDetail->id, $enrollmentPeriod->id]);
            // Get total enrolled employees count
            $totalEnrolledEmployees = DB::select("
                SELECT COUNT(*) AS count
                FROM enrolment_mapping_master
                INNER JOIN company_employees ON enrolment_mapping_master.emp_id = company_employees.id
                WHERE enrolment_mapping_master.status = 1
                AND enrolment_mapping_master.enrolment_id = ?
                AND enrolment_mapping_master.enrolment_period_id = ?
                AND company_employees.is_delete = 0
                AND enrolment_mapping_master.submit_status = 1
            ", [$enrollmentDetail->id, $enrollmentPeriod->id]);

            // Get employee list with enrollment status
            $employees = DB::select("
                SELECT
                    ce.id,
                    ce.employees_code,
                    ce.full_name,
                    ce.email,
                    ce.gender,
                    ce.designation,
                    ce.grade,
                    emm.submit_status,
                    emm.view_status,
                    CASE
                        WHEN emm.submit_status = 1 THEN 'ENROLLED'
                        WHEN emm.view_status = 1 THEN 'VISITED'
                        ELSE 'NOT VISITED'
                    END as status
                FROM enrolment_mapping_master emm
                INNER JOIN company_employees ce ON emm.emp_id = ce.id
                WHERE emm.status = 1
                AND emm.enrolment_id = ?
                AND emm.enrolment_period_id = ?
                AND ce.is_delete = 0
                ORDER BY ce.full_name
            ", [$enrollmentDetail->id, $enrollmentPeriod->id]);

            return Inertia::render('superadmin/policy/ViewLivePortal', [
                'enrollmentPeriod' => $enrollmentPeriod,
                'enrollmentDetail' => $enrollmentDetail,
                'totalSelectedEmployees' => $totalSelectedEmployees[0]->count ?? 0,
                'totalEnrolledEmployees' => $totalEnrolledEmployees[0]->count ?? 0,
                'employees' => $employees
            ]);
        } catch (\Exception $e) {
            Log::error('View live portal failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load enrollment portal.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Show enrollment period details
     */
    public function enrollmentPeriodDetails($enrollmentPeriodId)
    {
        try {
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::with(['enrollmentDetail.company'])->findOrFail($enrollmentPeriodId);

            return Inertia::render('superadmin/policy/EnrollmentPeriodDetails', [
                'enrollmentPeriod' => $enrollmentPeriod
            ]);
        } catch (\Exception $e) {
            Log::error('Enrollment period details failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load enrollment period details.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Show edit enrollment period form
     */
    public function editEnrollmentPeriod($enrollmentPeriodId)
    {
        try {
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::with(['enrollmentDetail.company'])->findOrFail($enrollmentPeriodId);
            $enrollmentDetail = $enrollmentPeriod->enrollmentDetail;

            // Format dates for HTML date inputs (YYYY-MM-DD)
            $enrollmentPeriod->portal_start_date = $enrollmentPeriod->portal_start_date ?
                date('Y-m-d', strtotime($enrollmentPeriod->portal_start_date)) : '';
            $enrollmentPeriod->portal_end_date = $enrollmentPeriod->portal_end_date ?
                date('Y-m-d', strtotime($enrollmentPeriod->portal_end_date)) : '';

            return Inertia::render('superadmin/policy/EditEnrollmentPeriod', [
                'enrollmentPeriod' => $enrollmentPeriod,
                'enrollmentDetail' => $enrollmentDetail
            ]);
        } catch (\Exception $e) {
            Log::error('Edit enrollment period failed: ' . $e->getMessage());
            return redirect()->route('superadmin.policy.enrollment-lists.index')
                ->with('message', 'Failed to load enrollment period for editing.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Update enrollment period
     */
    public function updateEnrollmentPeriod(Request $request, $enrollmentPeriodId)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'enrolment_portal_name' => 'required|string|max:255',
                'portal_start_date' => 'required|date',
                'portal_end_date' => 'required|date|after:portal_start_date',
            ]);

            // Find the enrollment period
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::findOrFail($enrollmentPeriodId);

            // Update the enrollment period
            $enrollmentPeriod->enrolment_portal_name = $validated['enrolment_portal_name'];
            $enrollmentPeriod->portal_start_date = $validated['portal_start_date'];
            $enrollmentPeriod->portal_end_date = $validated['portal_end_date'];
            $enrollmentPeriod->save();

            return redirect()->route('superadmin.view-live-portal', $enrollmentPeriod->id)
                ->with('message', 'Enrollment portal period updated successfully!')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Update enrollment period failed: ' . $e->getMessage());
            return back()
                ->with('message', 'Failed to update enrollment period. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /////////////////////////////////////////////////////////////////////////
    ///////////////////////// Policy Module ////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    /**
     * Show fill enrollment form
     */
    public function fillEnrollment($enrollmentPeriodId, $employeeId)
    {
        try {

            // Get the enrollment period with related data
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::with([
                'enrollmentDetail',
            ])->findOrFail($enrollmentPeriodId);
            // Get the employee
            $employee = \App\Models\CompanyEmployee::findOrFail($employeeId);

            // Get enrollment detail and config
            $enrollmentDetail = $enrollmentPeriod->enrollmentDetail;

            // Parse family definition from enrollment detail JSON
            $familyDefinitionJson = is_string($enrollmentDetail->family_defination)
                ? json_decode($enrollmentDetail->family_defination, true)
                : $enrollmentDetail->family_defination;

            $familyDefinition = [
                'self' => [
                    'enabled' => ($familyDefinitionJson['self'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['self_no'] ?? 1,
                    'min_age' => $familyDefinitionJson['self_min_age'] ?? 18,
                    'max_age' => $familyDefinitionJson['self_max_age'] ?? 65,
                    'gender' => $familyDefinitionJson['self_gender'] ?? 'both'
                ],
                'spouse' => [
                    'enabled' => ($familyDefinitionJson['spouse'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['spouse_no'] ?? 1,
                    'min_age' => $familyDefinitionJson['spouse_min_age'] ?? 18,
                    'max_age' => $familyDefinitionJson['spouse_max_age'] ?? 65,
                    'gender' => $familyDefinitionJson['spouse_gender'] ?? 'both'
                ],
                'kid' => [
                    'enabled' => ($familyDefinitionJson['kids'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['kids_no'] ?? 2,
                    'min_age' => $familyDefinitionJson['kids_min_age'] ?? 0,
                    'max_age' => $familyDefinitionJson['kids_max_age'] ?? 25,
                    'gender' => $familyDefinitionJson['kids_gender'] ?? 'both'
                ],
                'parent' => [
                    'enabled' => ($familyDefinitionJson['parent'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['parent_no'] ?? 2,
                    'min_age' => $familyDefinitionJson['parent_min_age'] ?? 45,
                    'max_age' => $familyDefinitionJson['parent_max_age'] ?? 80,
                    'gender' => $familyDefinitionJson['parent_gender'] ?? 'both'
                ],
                'parent_in_law' => [
                    'enabled' => ($familyDefinitionJson['parent_in_law'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['parent_in_law_no'] ?? 2,
                    'min_age' => $familyDefinitionJson['parent_in_law_min_age'] ?? 45,
                    'max_age' => $familyDefinitionJson['parent_in_law_max_age'] ?? 80,
                    'gender' => $familyDefinitionJson['parent_in_law_gender'] ?? 'both'
                ],
                'sibling' => [
                    'enabled' => ($familyDefinitionJson['sibling'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['sibling_no'] ?? 2,
                    'min_age' => $familyDefinitionJson['sibling_min_age'] ?? 18,
                    'max_age' => $familyDefinitionJson['sibling_max_age'] ?? 65,
                    'gender' => $familyDefinitionJson['sibling_gender'] ?? 'both'
                ],
                'partners' => [
                    'enabled' => ($familyDefinitionJson['partners'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['partners_no'] ?? 1,
                    'min_age' => $familyDefinitionJson['partners_min_age'] ?? 18,
                    'max_age' => $familyDefinitionJson['partners_max_age'] ?? 65,
                    'gender' => $familyDefinitionJson['partners_gender'] ?? 'both'
                ],
                'others' => [
                    'enabled' => ($familyDefinitionJson['others'] ?? '0') === '1',
                    'no' => $familyDefinitionJson['others_no'] ?? 2,
                    'min_age' => $familyDefinitionJson['others_min_age'] ?? 18,
                    'max_age' => $familyDefinitionJson['others_max_age'] ?? 65,
                    'gender' => $familyDefinitionJson['others_gender'] ?? 'both'
                ],
                // Add parent/in-law combination rule for frontend logic
                'add_both_parent_n_parent_in_law' => $familyDefinitionJson['add_both_parent_n_parent_in_law'] ?? 'both',
                'spouse_with_same_gender' => $familyDefinitionJson['spouse_with_same_gender'] ?? null,
            ];

            // Parse rating config to get available plans
            $ratingConfigJson = is_string($enrollmentDetail->rating_config)
                ? json_decode($enrollmentDetail->rating_config, true)
                : $enrollmentDetail->rating_config;

            $availablePlans = [
                'basePlans' => [],
                'topupPlans' => [],
                'ratingConfig' => $ratingConfigJson ?? []
            ];

            if (isset($ratingConfigJson['plans']) && is_array($ratingConfigJson['plans'])) {
                foreach ($ratingConfigJson['plans'] as $plan) {
                    $planData = [
                        'id' => $plan['id'] ?? 0,
                        'plan_name' => $plan['plan_name'] ?? 'Unknown Plan',
                        'sum_insured' => (int)($plan['sum_insured'] ?? 0),
                        'premium_amount' => (int)($plan['premium_amount'] ?? 0),
                        'employee_premium' => (int)($plan['premium_amount'] ?? 0),
                        'company_premium' => 0, // Default to 0, can be configured
                        'description' => $plan['description'] ?? 'Health insurance plan',
                        'age_brackets' => $plan['age_brackets'] ?? []
                    ];

                    // For now, treat all plans as base plans
                    // You can add logic here to differentiate between base and topup plans
                    $availablePlans['basePlans'][] = $planData;
                }
            }

            // Parse extra coverage plans
            $extraCoveragePlansJson = is_string($enrollmentDetail->extra_coverage_plans)
                ? json_decode($enrollmentDetail->extra_coverage_plans, true)
                : $enrollmentDetail->extra_coverage_plans;

            $extraCoveragePlans = [];

            if (is_array($extraCoveragePlansJson)) {
                foreach ($extraCoveragePlansJson as $extraPlan) {
                    $extraCoverageData = [
                        'id' => $extraPlan['id'] ?? 0,
                        'plan_name' => $extraPlan['plan_name'] ?? 'Extra Coverage Plan',
                        'premium' => (int)($extraPlan['premium_amount'] ?? 0),
                        'employee_contribution' => (int)($extraPlan['premium_amount'] ?? 0),
                        'description' => $extraPlan['description'] ?? 'Additional insurance coverage',
                        'coverage_type' => $extraPlan['coverage_type'] ?? 'Additional Coverage',
                        'features' => [],
                        'waiting_period' => $extraPlan['waiting_period'] ?? '30 days',
                        'pre_existing_coverage' => $extraPlan['pre_existing_coverage'] ?? 'After waiting period',
                        'cashless_hospitals' => $extraPlan['cashless_hospitals'] ?? 'Network hospitals',
                        'claim_settlement_ratio' => $extraPlan['claim_settlement_ratio'] ?? '95%'
                    ];

                    // Parse extra coverages like co_pay, maternity, room_rent
                    if (isset($extraPlan['extra_coverages']) && is_array($extraPlan['extra_coverages'])) {
                        foreach ($extraPlan['extra_coverages'] as $coverageType => $coverage) {
                            if (isset($coverage['enabled']) && $coverage['enabled']) {
                                $extraCoverageData['features'][] = ucfirst(str_replace('_', ' ', $coverageType)) .
                                    ': ₹' . number_format($coverage['amount'] ?? 0);
                            }
                        }
                    }

                    if (empty($extraCoverageData['features'])) {
                        $extraCoverageData['features'] = ['Additional health benefits'];
                    }

                    $extraCoveragePlans[] = $extraCoverageData;
                }
            }

            // Parse enrollment statements
            $enrollmentStatementsJson = is_string($enrollmentDetail->enrollment_statements)
                ? json_decode($enrollmentDetail->enrollment_statements, true)
                : $enrollmentDetail->enrollment_statements;

            $enrollmentStatements = is_array($enrollmentStatementsJson) ? $enrollmentStatementsJson : [];

            return Inertia::render('superadmin/policy/FillEnrollment', [
                'enrollmentPeriod' => $enrollmentPeriod,
                'enrollmentDetail' => $enrollmentDetail,
                'employee' => $employee,
                'familyDefinition' => $familyDefinition,
                'availablePlans' => $availablePlans,
                'extraCoveragePlans' => $extraCoveragePlans,
                'enrollmentStatements' => $enrollmentStatements
            ]);
        } catch (\Exception $e) {
            Log::error('Fill enrollment page failed: ' . $e->getMessage());
            return redirect()->back()
                ->with('message', 'Failed to load enrollment form. Please try again.')
                ->with('messageType', 'error');
        }
    }

    /**
     * Submit enrollment data
     */
    public function submitEnrollment(Request $request)
    {
        dd($request->all());
        try {
            // Validate the request
            $validated = $request->validate([
                'employee_id' => 'required|integer',
                'enrollment_period_id' => 'required|integer',
                'enrollment_detail_id' => 'required|integer',
                'enrollment_config_id' => 'nullable|integer',
                'dependents' => 'nullable|array',
                'selectedPlans' => 'required|array',
                'extraCoverage' => 'nullable',
                'premiumCalculations' => 'required|array'
            ]);

            \Log::info('🎯 Starting enrollment submission', [
                'employee_id' => $validated['employee_id'],
                'form_data' => $validated
            ]);

            DB::beginTransaction();

            // Get employee and enrollment data
            $employee = \App\Models\CompanyEmployee::findOrFail($validated['employee_id']);
            $enrollmentPeriod = \App\Models\EnrollmentPeriod::findOrFail($validated['enrollment_period_id']);
            $enrollmentDetail = \App\Models\EnrollmentDetail::findOrFail($validated['enrollment_detail_id']);

            // Save enrollment data for employee (SELF)
            $employeeEnrollment = $this->saveEnrollmentData(
                $employee,
                $validated,
                'SELF',
                $validated['selectedPlans']['employee'] ?? $validated['selectedPlans']
            );

            \Log::info('✅ Employee enrollment saved', ['id' => $employeeEnrollment->id]);

            // Save enrollment data for dependents
            if (!empty($validated['dependents'])) {
                foreach ($validated['dependents'] as $dependent) {
                    $dependentEnrollment = $this->saveEnrollmentData(
                        $employee,
                        $validated,
                        $dependent['relation'],
                        $validated['selectedPlans'][$dependent['id']] ?? $validated['selectedPlans'],
                        $dependent
                    );

                    \Log::info('✅ Dependent enrollment saved', [
                        'id' => $dependentEnrollment->id,
                        'name' => $dependent['insured_name'],
                        'relation' => $dependent['relation']
                    ]);
                }
            }

            // Update enrollment status or create summary record if needed
            // This can be used to track overall enrollment completion
            $this->updateEnrollmentStatus($employee, $enrollmentDetail, $validated);

            DB::commit();

            \Log::info('🎉 Enrollment submission completed successfully');

            return redirect()->route('superadmin.view-live-portal', $validated['enrollment_period_id'])
                ->with('message', 'Enrollment submitted successfully!')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            \Log::error('❌ Validation failed for enrollment submission', [
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('❌ Submit enrollment failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
            return back()
                ->with('message', 'Failed to submit enrollment. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    /**
     * Save enrollment data for a member
     */
    private function saveEnrollmentData($employee, $formData, $relation, $selectedPlans = null, $dependent = null)
    {
        Log::info("💾 Saving enrollment data for {$relation}", [
            'employee_id' => $employee->id,
            'dependent_name' => $dependent['insured_name'] ?? 'N/A',
            'selected_plans' => $selectedPlans
        ]);

        // Create enrollment data record
        $enrollmentData = new \App\Models\EnrollmentData();

        // Basic information
        $enrollmentData->emp_id = $employee->id;
        $enrollmentData->cmp_id = $employee->company_id;
        $enrollmentData->enrolment_id = $formData['enrollment_detail_id'];
        $enrollmentData->enrolment_portal_id = $formData['enrollment_period_id'];

        // Member information
        if ($relation === 'SELF') {
            $enrollmentData->insured_name = $employee->full_name;
            $enrollmentData->gender = $employee->gender;
            $enrollmentData->dob = $employee->date_of_birth;
            $enrollmentData->date_of_joining = $employee->date_of_joining;
        } else {
            $enrollmentData->insured_name = $dependent['insured_name'];
            $enrollmentData->gender = $dependent['gender'];
            $enrollmentData->dob = $dependent['dob'];
        }

        $enrollmentData->relation = $relation;
        $enrollmentData->detailed_relation = $dependent['detailed_relation'] ?? $relation;

        // Premium calculations from formData
        $premiumCalc = $formData['premiumCalculations'] ?? [];

        // Save base premium data
        if ($selectedPlans && isset($selectedPlans['basePlan'])) {
            $enrollmentData->base_plan_id = $selectedPlans['basePlan'];
            $enrollmentData->base_premium_on_employee = $premiumCalc['basePremium'] ?? 0;
            $enrollmentData->base_premium_on_company = 0; // Can be calculated based on company contribution
            $enrollmentData->base_sum_insured = $this->getPlanSumInsured($selectedPlans['basePlan'], 'base');
        }

        // Save topup premium data
        if ($selectedPlans && isset($selectedPlans['topupPlan'])) {
            $enrollmentData->topup_plan_id = $selectedPlans['topupPlan'];
            $enrollmentData->topup_premium_on_employee = $premiumCalc['topupPremium'] ?? 0;
            $enrollmentData->topup_premium_on_company = 0; // Can be calculated based on company contribution
            $enrollmentData->topup_sum_insured = $this->getPlanSumInsured($selectedPlans['topupPlan'], 'topup');
        }

        // Extra coverage (typically only for employee)
        if ($relation === 'SELF' && isset($formData['selectedPlans']['extraCoverageSelected'])) {
            $extraCoverage = $formData['selectedPlans']['extraCoverageSelected'];
            if (!empty($extraCoverage)) {
                $enrollmentData->extra_coverage_plan = json_encode($extraCoverage);
                $enrollmentData->extra_coverage_premium = $premiumCalc['extraCoveragePremium'] ?? 0;
            }
        }

        // Total premium calculations
        $enrollmentData->gross_premium = $premiumCalc['grossPremium'] ?? 0;
        $enrollmentData->gst_amount = $premiumCalc['gst'] ?? 0;
        $enrollmentData->gross_plus_gst = $premiumCalc['grossPlusGst'] ?? 0;
        $enrollmentData->company_contribution_amount = $premiumCalc['companyContributionAmount'] ?? 0;
        $enrollmentData->employee_payable = $premiumCalc['employeePayable'] ?? 0;

        // System fields
        $enrollmentData->created_by = 'SuperAdmin';
        $enrollmentData->updated_by = 'SuperAdmin';
        $enrollmentData->created_at = now();
        $enrollmentData->updated_at = now();

        $enrollmentData->save();

        Log::info("✅ Enrollment data saved successfully", [
            'id' => $enrollmentData->id,
            'insured_name' => $enrollmentData->insured_name,
            'relation' => $enrollmentData->relation
        ]);

        return $enrollmentData;
    }

    /**
     * Update enrollment status after successful submission
     */
    private function updateEnrollmentStatus($employee, $enrollmentDetail, $formData)
    {
        try {
            // You can add logic here to update overall enrollment status
            // For example, marking the employee as "enrolled" in a status table

            Log::info("📊 Updating enrollment status", [
                'employee_id' => $employee->id,
                'enrollment_detail_id' => $enrollmentDetail->id,
                'total_dependents' => count($formData['dependents'] ?? [])
            ]);

            // Example: Update employee's enrollment status
            // $employee->update(['enrollment_status' => 'completed']);

            // Example: Create or update enrollment summary record
            // This is optional and depends on your specific requirements

        } catch (\Exception $e) {
            Log::warning("⚠️ Failed to update enrollment status", [
                'error' => $e->getMessage(),
                'employee_id' => $employee->id
            ]);
            // Don't throw exception as this is not critical
        }
    }

    /**
     * Policy Users Index
     */
    public function policyUsers(Request $request)
    {
        try {
            $query = EscalationUser::query();

            // Search
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Status filter
            if ($request->filled('status')) {
                $query->where('is_active', $request->status === 'active' ? 1 : 0);
            }

            $policyUsers = $query->orderBy('id', 'desc')->paginate(10);

            // also send list of active escalation users for replacement dropdown
            $escalationUsers = EscalationUser::where('is_active', 1)->get(['id', 'name']);

            return Inertia::render('superadmin/policy/PolicyUsers/Index', [
                'policyUsers' => $policyUsers,
                'filters' => $request->only(['search', 'status']),
                'escalationUsers' => $escalationUsers,
            ]);
        } catch (\Exception $e) {
            Log::error('Policy Users index failed: ' . $e->getMessage());
            return back()->with('message', 'Failed to load policy users.')->with('messageType', 'error');
        }
    }

    /**
     * Deactivate a user and assign another escalation user across policy_master
     */
    public function deactivateAssignPolicyUser(Request $request, $id)
    {
        $validated = $request->validate([
            'replacement_user_id' => 'required|integer|exists:escalation_users,id',
        ]);

        try {
            $oldUser = EscalationUser::findOrFail($id);

            // mark old user inactive
            $oldUser->is_active = 0;
            $oldUser->save();

            // dispatch job to replace occurrences in policy_master
            ReplaceEscalationUserJob::dispatch($oldUser->id, $validated['replacement_user_id']);

            return response()->json(['success' => true, 'message' => 'User deactivated and replacement job done.']);
        } catch (\Exception $e) {
            Log::error('Deactivate assign failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to deactivate and assign'], 500);
        }
    }

    public function storePolicyUser(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|email',
            'mobile' => 'nullable|string|max:15',
        ]);

        try {
            EscalationUser::create([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'mobile' => $validated['mobile'] ?? null,
                'is_active' => 1,
            ]);

            return redirect()->back()->with('message', 'Policy User added successfully.');
        } catch (\Exception $e) {
            Log::error('Policy User store failed: ' . $e->getMessage());
            return back()->with('message', 'Failed to add Policy User.')->with('messageType', 'error');
        }
    }

    public function updatePolicyUser(Request $request, $id)
    {
        // Accept either 'mobile' or 'phone' (some frontend forms use different names)
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|email',
            'mobile' => 'nullable|string|max:15',
            'phone' => 'nullable|string|max:15',
        ]);

        try {
            $user = EscalationUser::findOrFail($id);

            // Normalize mobile value (prefer 'mobile', fallback to 'phone')
            $mobileValue = $validated['mobile'] ?? $validated['phone'] ?? null;

            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'mobile' => $mobileValue,
            ];

            $user->update($updateData);

            // If this was an AJAX / fetch request, return JSON so frontend can handle it
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['success' => true, 'user' => $user]);
            }

            return redirect()->back()->with('message', 'Policy User updated successfully.');
        } catch (\Exception $e) {
            Log::error('Policy User update failed: ' . $e->getMessage());

            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['success' => false, 'message' => 'Failed to update Policy User.'], 500);
            }

            return back()->with('message', 'Failed to update Policy User.')->with('messageType', 'error');
        }
    }

    public function togglePolicyUser($id)
    {
        try {
            $user = EscalationUser::findOrFail($id);
            $user->is_active = !$user->is_active;
            $user->save();

            return response()->json(['success' => true, 'is_active' => $user->is_active]);
        } catch (\Exception $e) {
            Log::error('Toggle active failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error toggling status']);
        }
    }

    /**
     * Policies Index
     */
    public function policies(Request $request)
    {
        // Get policies data from policy_master table
        $query = PolicyMaster::with(['company', 'tpa', 'insurance']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('policy_name', 'like', "%{$search}%")
                    ->orWhere('corporate_policy_name', 'like', "%{$search}%")
                    ->orWhere('policy_number', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'active') {
                $query->where('is_active', 1);
            } elseif ($status === 'inactive') {
                $query->where('is_active', 0);
            }
        }

        $policies = $query->orderBy('created_on', 'desc')->paginate(10);

        return Inertia::render('superadmin/policy/Policies/Index', [
            'policies' => $policies,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Create Policy Form
     */
    /**
     * Admin FAQs Index
     */
    public function adminFaqsIndex()
    {
        try {
            $faqs = FaqMaster::orderBy('id', 'desc')->get();

            return Inertia::render('superadmin/admin/faqs/Index', [
                'faqs' => $faqs,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load FAQs: ' . $e->getMessage());
            return back()->with('message', 'Failed to load FAQs.')->with('messageType', 'error');
        }
    }

    public function adminFaqsCreate()
    {
        return Inertia::render('superadmin/admin/faqs/Create');
    }

    public function adminFaqsStore(Request $request)
    {
        $request->validate([
            'faq_title' => 'required|string|max:255',
            'faq_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        FaqMaster::create([
            'faq_title' => $request->faq_title,
            'faq_description' => $request->faq_description,
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
        ]);

        return redirect()->route('superadmin.admin.faqs.index')->with('message', 'FAQ created successfully.')->with('messageType', 'success');
    }

    public function adminFaqsEdit(FaqMaster $faq)
    {
        return Inertia::render('superadmin/admin/faqs/Edit', [
            'faq' => $faq,
        ]);
    }

    public function adminFaqsUpdate(Request $request, FaqMaster $faq)
    {
        $request->validate([
            'faq_title' => 'required|string|max:255',
            'faq_description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $faq->update([
            'faq_title' => $request->faq_title,
            'faq_description' => $request->faq_description,
            'is_active' => $request->has('is_active') ? (bool) $request->is_active : true,
        ]);

        return redirect()->route('superadmin.admin.faqs.index')->with('message', 'FAQ updated successfully.')->with('messageType', 'success');
    }

    public function adminFaqsDestroy(FaqMaster $faq)
    {
        $faq->delete();
        return redirect()->route('superadmin.admin.faqs.index')->with('message', 'FAQ deleted successfully.')->with('messageType', 'success');
    }

    /**
     * Admin Blogs Index
     */
    public function adminBlogsIndex()
    {
        try {
            $blogs = BlogMaster::orderBy('blog_date', 'desc')->get();
            return Inertia::render('superadmin/admin/blogs/Index', [
                'blogs' => $blogs,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load blogs: ' . $e->getMessage());
            return back()->with('message', 'Failed to load blogs.')->with('messageType', 'error');
        }
    }

    public function adminBlogsCreate()
    {
        return Inertia::render('superadmin/admin/blogs/Create');
    }

    public function adminBlogsStore(Request $request)
    {
        try {
            $request->validate([
                'blog_title' => 'required|string|max:255',
                'blog_slug' => 'required|string|max:255|unique:blog_master,blog_slug',
                'blog_author' => 'nullable|string|max:255',
                'blog_thumbnail' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'blog_banner' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'blog_content' => 'nullable|string',
                'blog_tags' => 'nullable|string',
                'blog_categories' => 'nullable|string',
                'focus_keyword' => 'nullable|string|max:255',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'meta_keywords' => 'nullable|string',
                'blog_thumbnail_alt' => 'nullable|string|max:255',
                'blog_banner_alt' => 'nullable|string|max:255',
                'og_title' => 'nullable|string|max:255',
                'og_description' => 'nullable|string|max:500',
                'twitter_title' => 'nullable|string|max:255',
                'twitter_description' => 'nullable|string|max:500',
                'is_active' => 'nullable',
            ]);

            $data = $request->only([
                'blog_title',
                'blog_slug',
                'blog_author',
                'blog_content',
                'blog_thumbnail_alt',
                'blog_banner_alt',
                'focus_keyword',
                'meta_title',
                'meta_description',
                'meta_keywords',
                'og_title',
                'og_description',
                'twitter_title',
                'twitter_description',
                'blog_tags',
                'blog_categories'
            ]);

            if ($request->hasFile('blog_thumbnail')) {
                $data['blog_thumbnail'] = $request->file('blog_thumbnail')->store('blogs', 'public');
            }
            if ($request->hasFile('blog_banner')) {
                $data['blog_banner'] = $request->file('blog_banner')->store('blogs', 'public');
            }

            $data['blog_date'] = now();
            $data['is_active'] = $request->has('is_active') ? (bool) $request->is_active : true;

            BlogMaster::create($data);

            return redirect()->route('superadmin.admin.blogs.index')
                ->with('message', 'Blog created successfully.')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Blog creation failed: ' . $e->getMessage());
            return back()
                ->with('message', 'Failed to create blog. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    public function adminBlogsEdit(BlogMaster $blog)
    {
        return Inertia::render('superadmin/admin/blogs/Edit', [
            'blog' => $blog,
        ]);
    }

    public function adminBlogsUpdate(Request $request, BlogMaster $blog)
    {
        try {
            $request->validate([
                'blog_title' => 'required|string|max:255',
                'blog_slug' => 'required|string|max:255|unique:blog_master,blog_slug,' . $blog->id,
                'blog_author' => 'nullable|string|max:255',
                'blog_thumbnail' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'blog_banner' => 'nullable|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'blog_content' => 'nullable|string',
                'blog_tags' => 'nullable|string',
                'blog_categories' => 'nullable|string',
                'focus_keyword' => 'nullable|string|max:255',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'meta_keywords' => 'nullable|string',
                'blog_thumbnail_alt' => 'nullable|string|max:255',
                'blog_banner_alt' => 'nullable|string|max:255',
                'og_title' => 'nullable|string|max:255',
                'og_description' => 'nullable|string|max:500',
                'twitter_title' => 'nullable|string|max:255',
                'twitter_description' => 'nullable|string|max:500',
                'is_active' => 'nullable',
            ]);

            $data = $request->only([
                'blog_title',
                'blog_slug',
                'blog_author',
                'blog_content',
                'blog_thumbnail_alt',
                'blog_banner_alt',
                'focus_keyword',
                'meta_title',
                'meta_description',
                'meta_keywords',
                'og_title',
                'og_description',
                'twitter_title',
                'twitter_description',
                'blog_tags',
                'blog_categories'
            ]);

            if ($request->hasFile('blog_thumbnail')) {
                // Delete old thumbnail if exists
                if ($blog->blog_thumbnail && \Storage::disk('public')->exists($blog->blog_thumbnail)) {
                    \Storage::disk('public')->delete($blog->blog_thumbnail);
                }
                $data['blog_thumbnail'] = $request->file('blog_thumbnail')->store('blogs', 'public');
            }

            if ($request->hasFile('blog_banner')) {
                // Delete old banner if exists
                if ($blog->blog_banner && \Storage::disk('public')->exists($blog->blog_banner)) {
                    \Storage::disk('public')->delete($blog->blog_banner);
                }
                $data['blog_banner'] = $request->file('blog_banner')->store('blogs', 'public');
            }

            $data['is_active'] = $request->has('is_active') ? (bool) $request->is_active : $blog->is_active;

            $blog->update($data);

            return redirect()->route('superadmin.admin.blogs.index')
                ->with('message', 'Blog updated successfully.')
                ->with('messageType', 'success');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Blog update failed: ' . $e->getMessage());
            return back()
                ->with('message', 'Failed to update blog. Please try again.')
                ->with('messageType', 'error')
                ->withInput();
        }
    }

    public function adminBlogsDestroy(BlogMaster $blog)
    {
        try {
            // Delete associated files if they exist
            if ($blog->blog_thumbnail && \Storage::disk('public')->exists($blog->blog_thumbnail)) {
                \Storage::disk('public')->delete($blog->blog_thumbnail);
            }
            if ($blog->blog_banner && \Storage::disk('public')->exists($blog->blog_banner)) {
                \Storage::disk('public')->delete($blog->blog_banner);
            }

            $blog->delete();

            return redirect()->route('superadmin.admin.blogs.index')
                ->with('message', 'Blog deleted successfully.')
                ->with('messageType', 'success');
        } catch (\Exception $e) {
            \Log::error('Blog deletion failed: ' . $e->getMessage());
            return back()
                ->with('message', 'Failed to delete blog. Please try again.')
                ->with('messageType', 'error');
        }
    }
    /**
     * Admin Resources
     */
    public function adminResourcesIndex()
    {
        try {
            $resources = Resource::orderBy('published_at', 'desc')->get();
            return Inertia::render('superadmin/admin/resources/Index', [
                'resources' => $resources,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load resources: ' . $e->getMessage());
            return back()->with('message', 'Failed to load resources.')->with('messageType', 'error');
        }
    }

    public function adminResourcesCreate()
    {
        return Inertia::render('superadmin/admin/resources/Create');
    }

    public function adminResourcesStore(Request $request)
    {
        $request->validate([
            'heading' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:resources,slug',
            'tags' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'file_url' => 'nullable|file',
            'cover_image' => 'nullable|image',
            'author' => 'nullable|string|max:255',
            'status' => 'in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['heading', 'slug', 'tags', 'category', 'content', 'author', 'status', 'published_at']);

        if ($request->hasFile('file_url')) {
            $data['file_url'] = $request->file('file_url')->store('resources', 'public');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('resources', 'public');
        }

        Resource::create($data);

        return redirect()->route('superadmin.admin.resources.index')->with('message', 'Resource created successfully.')->with('messageType', 'success');
    }

    public function adminResourcesEdit(Resource $resource)
    {
        return Inertia::render('superadmin/admin/resources/Edit', [
            'resource' => $resource,
        ]);
    }

    public function adminResourcesUpdate(Request $request, Resource $resource)
    {
        $request->validate([
            'heading' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:resources,slug,' . $resource->id,
            'tags' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'file_url' => 'nullable|file',
            'cover_image' => 'nullable|image',
            'author' => 'nullable|string|max:255',
            'status' => 'in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['heading', 'slug', 'tags', 'category', 'content', 'author', 'status', 'published_at']);

        if ($request->hasFile('file_url')) {
            $data['file_url'] = $request->file('file_url')->store('resources', 'public');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('resources', 'public');
        }

        $resource->update($data);

        return redirect()->route('superadmin.admin.resources.index')->with('message', 'Resource updated successfully.')->with('messageType', 'success');
    }

    public function adminResourcesDestroy(Resource $resource)
    {
        $resource->delete();
        return redirect()->route('superadmin.admin.resources.index')->with('message', 'Resource deleted successfully.')->with('messageType', 'success');
    }

    public function createPolicy()
    {
        try {
            // Get data for dropdowns
            $insuranceProviders = InsuranceMaster::where('status', 1)->get();
            $escalationUsers = EscalationUser::where('is_active', 1)->get();

            return Inertia::render('superadmin/policy/Policies/Create', [
                'insuranceProviders' => $insuranceProviders,
                'escalationUsers' => $escalationUsers,
            ]);
        } catch (\Exception $e) {
            Log::error('Create policy form failed: ' . $e->getMessage());
            return back()->with('message', 'Failed to load create policy form.')->with('messageType', 'error');
        }
    }

    /**
     * Store New Policy
     */
    public function storePolicy(Request $request)
    {
        try {
            $validated = $request->validate([
                'policy_name' => 'required|string|max:255',
                'corporate_policy_name' => 'nullable|string|max:255',
                'policy_number' => 'nullable|string|max:255',
                'family_defination' => 'nullable|string|max:255',
                'policy_type' => 'nullable|string|max:255',
                'policy_type_definition' => 'nullable|string|max:255',
                'policy_start_date' => 'nullable|date',
                'policy_end_date' => 'nullable|date|after:policy_start_date',
                'policy_document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
                'policy_directory_name' => 'nullable|string|max:255',
                'ins_id' => 'required|exists:insurance_masters,id',
                'tpa_id' => 'nullable|string|max:255',
                'cd_ac_id' => 'nullable|string|max:255',
                'data_escalation_id' => 'nullable|exists:escalation_users,id',
                'claim_level_1_id' => 'nullable|exists:escalation_users,id',
                'claim_level_2_id' => 'nullable|exists:escalation_users,id',
                'is_active' => 'boolean',
            ]);

            // Handle file upload
            if ($request->hasFile('policy_document')) {
                $file = $request->file('policy_document');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('policy_documents', $fileName, 'public');
                $validated['policy_document'] = $filePath;
            }

            // Set default values
            $validated['is_ready'] = 0;
            $validated['is_old'] = 0;
            $validated['created_on'] = now();

            PolicyMaster::create($validated);

            return redirect()->route('superadmin.policy.policies.index')->with('message', 'Policy created successfully.')->with('messageType', 'success');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Store policy failed: ' . $e->getMessage());
            return back()->with('message', 'Failed to create policy.')->with('messageType', 'error')->withInput();
        }
    }

    /**
     * Get plan sum insured amount
     */
    private function getPlanSumInsured($planId, $planType)
    {
        try {
            // This would typically fetch from your plans database
            // For now, return a default value
            return 500000; // 5 Lakhs default
        } catch (\Exception $e) {
            Log::warning("Failed to get plan sum insured", [
                'plan_id' => $planId,
                'plan_type' => $planType,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }



    /**
     * CD Accounts Index
     */
    public function cdAccountsIndex()
    {
        $cdAccounts = \App\Models\CdMaster::query()
            ->leftJoin('company_master', 'cd_master.comp_id', '=', 'company_master.comp_id')
            ->leftJoin('insurance_master', 'cd_master.ins_id', '=', 'insurance_master.id')
            ->select([
                'cd_master.*',
                'company_master.comp_name as company_name',
                'insurance_master.insurance_company_name as insurance_name',
            ])
            ->orderBy('cd_master.id', 'desc')
            ->get();
        return Inertia::render('superadmin/policy/CdAccounts/Index', [
            'cdAccounts' => $cdAccounts
        ]);
    }

    /**
     * Show create CD Account form
     */
    public function cdAccountsCreate()
    {
        $companies = \App\Models\CompanyMaster::where('status', 1)->orderBy('comp_name')->get(['comp_id as id', 'comp_name as company_name']);
        $insurers = \App\Models\InsuranceMaster::where('status', 1)->orderBy('insurance_company_name')->get(['id', 'insurance_company_name as insurance_name']);
        return Inertia::render('superadmin/policy/CdAccounts/Create', [
            'companies' => $companies,
            'insurers' => $insurers
        ]);
    }

    /**
     * Store new CD Account
     */
    public function cdAccountsStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer',
            'insurance_id' => 'required|integer',
            'cd_ac_name' => 'required|string|max:255',
            'cd_ac_no' => 'required|string|max:255',
            'min_balance' => 'nullable|numeric',
        ]);
        $cdAccount = new \App\Models\CdMaster();
        $cdAccount->comp_id = $validated['company_id'];
        $cdAccount->ins_id = $validated['insurance_id'];
        $cdAccount->cd_ac_name = $validated['cd_ac_name'];
        $cdAccount->cd_ac_no = $validated['cd_ac_no'];
        $cdAccount->minimum_balance = $validated['min_balance'] ?? null;
        $cdAccount->status = 1;
        $cdAccount->created_at = now();
        $cdAccount->updated_at = now();
        $cdAccount->save();
        return redirect()->route('superadmin.policy.cd-accounts.index')->with('message', 'CD Account created successfully.');
    }

    /**
     * Show edit CD Account form
     */
    public function cdAccountsEdit($id)
    {
        $cdAccount = \App\Models\CdMaster::findOrFail($id);
        $companies = \App\Models\CompanyMaster::where('status', 1)->orderBy('comp_name')->get(['comp_id as id', 'comp_name as company_name']);
        $insurers = \App\Models\InsuranceMaster::where('status', 1)->orderBy('insurance_company_name')->get(['id', 'insurance_company_name as insurance_name']);
        return Inertia::render('superadmin/policy/CdAccounts/Edit', [
            'cdAccount' => $cdAccount,
            'companies' => $companies,
            'insurers' => $insurers
        ]);
    }

    /**
     * Update CD Account
     */
    public function cdAccountsUpdate(\Illuminate\Http\Request $request, $id)
    {
        $validated = $request->validate([
            'comp_id' => 'required|integer',
            'ins_id' => 'required|integer',
            'cd_ac_name' => 'nullable|string|max:255',
            'cd_ac_no' => 'nullable|string|max:255',
            'minimum_balance' => 'nullable|numeric',
            'cd_folder' => 'nullable|string|max:255',
            'statement_file' => 'nullable|string|max:255',

        ]);
        $validated['updated_at'] = now();
        $cdAccount = \App\Models\CdMaster::findOrFail($id);
        $cdAccount->update($validated);
        return redirect()->route('superadmin.policy.cd-accounts.index')->with('message', 'CD Account updated successfully.');
    }

    /**
     * Toggle active/inactive status
     */
    public function cdAccountsToggleActive($id)
    {
        $cdAccount = \App\Models\CdMaster::findOrFail($id);
        $cdAccount->status = $cdAccount->status ? 0 : 1;
        $cdAccount->save();
        return response()->json(['success' => true, 'status' => $cdAccount->status]);
    }

    public function cdAccountsDetails($id)
    {
        $cdAccount = \App\Models\CdMaster::findOrFail($id);
        $companies = \App\Models\CompanyMaster::where('status', 1)->orderBy('comp_name')->get(['comp_id as id', 'comp_name as company_name']);
        $insurers = \App\Models\InsuranceMaster::where('status', 1)->orderBy('insurance_company_name')->get(['id', 'insurance_company_name as insurance_name']);
        $transactions = \App\Models\CdMonthlyBalanceStatement::where('cd_ac_id', $id)->where('is_delete', 0)->orderBy('transaction_date', 'desc')->get();
        return Inertia::render('superadmin/policy/CdAccounts/Details', [
            'cdAccount' => $cdAccount,
            'companies' => $companies,
            'insurers' => $insurers,
            'transactions' => $transactions
        ]);
    }

    public function cdAccountsTransactionStore(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'cd_ac_id' => 'required|integer',
            'comp_id' => 'required|integer',
            'transaction_name' => 'required|string',
            'transaction_date' => 'required|date',
            'transaction_type' => 'required|string',
            'cd_balance_remaining' => 'nullable|numeric',
            'premium' => 'nullable|numeric',
            'remarks' => 'required|string',
            'cd_file' => 'required|file',
        ]);

        $filePath = $request->file('cd_file')->store('cd_files', 'public');
        $txn = new \App\Models\CdMonthlyBalanceStatement();
        $txn->cd_ac_id = $validated['cd_ac_id'];
        $txn->comp_id = $validated['comp_id'];
        $txn->transaction_name = $validated['transaction_name'];
        $txn->transaction_date = $validated['transaction_date'];
        $txn->transaction_side = $validated['transaction_type'];
        $txn->cd_balance_remaining = $validated['cd_balance_remaining'] ?? null;
        $txn->transaction_amt = $validated['premium'] ?? null;
        $txn->remarks = $validated['remarks'];
        $txn->file_url = '/storage/' . $filePath;
        $txn->is_delete = 0;
        $txn->save();
        return redirect()->back()->with('message', 'Transaction added successfully.');
    }

    /**
     * Soft delete a CD Account transaction (set is_delete = 1)
     */
    public function cdAccountsTransactionDelete($id)
    {
        $txn = \App\Models\CdMonthlyBalanceStatement::findOrFail($id);
        $txn->is_delete = 1;
        $txn->save();
        $cdAcId = $txn->cd_ac_id;
        // Inertia v0.11.x: return 204 for XHR, else redirect
        if (request()->header('X-Inertia')) {
            return response('', 204);
        }
        return redirect()->route('superadmin.policy.cd-accounts.cd-details', $cdAcId);
    }
}
