<?php

namespace App\Http\Controllers;

use App\Models\CorporateLabel;
use App\Models\CorporateGroup;
use App\Models\CompanyMaster;
use App\Models\UserMaster;
use App\Models\WellnessService;
use App\Models\WellnessCategory;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

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
}
