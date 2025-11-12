<?php

namespace App\Http\Controllers;

use App\Models\CorporateLabel;
use App\Models\CorporateGroup;
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
            ->map(function($member) {
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

        return Inertia::render('superadmin/Marketing/PushNotifications', [
            'user' => $user,
            'notifications' => []
        ]);
    }

    /**
     * Store new push notification
     */
    public function marketingPushNotificationsStore(Request $request)
    {
        return redirect()->route('superadmin.marketing.push-notifications.index')
            ->with('success', 'Push notification created successfully.');
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
                'blog_title', 'blog_slug', 'blog_author', 'blog_content', 'blog_thumbnail_alt',
                'blog_banner_alt', 'focus_keyword', 'meta_title', 'meta_description', 'meta_keywords',
                'og_title', 'og_description', 'twitter_title', 'twitter_description', 'blog_tags', 'blog_categories'
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
                'blog_title', 'blog_slug', 'blog_author', 'blog_content', 'blog_thumbnail_alt',
                'blog_banner_alt', 'focus_keyword', 'meta_title', 'meta_description', 'meta_keywords',
                'og_title', 'og_description', 'twitter_title', 'twitter_description', 'blog_tags', 'blog_categories'
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

        $data = $request->only(['heading','slug','tags','category','content','author','status','published_at']);

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

        $data = $request->only(['heading','slug','tags','category','content','author','status','published_at']);

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
}
