<?php

namespace App\Http\Controllers;

use App\Models\CorporateLabel;
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
    {        Session::forget('superadmin_logged_in');
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

        return Inertia::render('superadmin/labels/Index', [
            'labels' => $labels
        ]);
    }

    public function corporateLabelsCreate()
    {

        return Inertia::render('superadmin/labels/Create', [
            'CorporateLabel' => $CorporateLabel
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

    public function corporateLabelsEdit(CorporateLabel $label)
    {
        return Inertia::render('CorporateLabels/Edit', [
            'label' => $label
        ]);
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

}
