<?php

namespace App\Http\Controllers;

use App\Models\CorporateLabel;
use App\Models\CorporateGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

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
        $groups = CorporateGroup::where('is_delete', 0)->get();

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
}
