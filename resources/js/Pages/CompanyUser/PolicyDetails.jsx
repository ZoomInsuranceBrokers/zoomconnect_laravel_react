import React from 'react';
import { Link } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiArrowLeft, FiShield, FiFileText, FiCalendar, FiUsers,
    FiCheckCircle, FiDollarSign, FiDownload, FiExternalLink,
    FiBriefcase, FiClipboard, FiInfo, FiMail, FiActivity, FiPhone
} from 'react-icons/fi';

// Helper Component for consistent data display
const DetailItem = ({ icon: Icon, label, value, subValue, className = "" }) => (
    <div className={`flex items-start gap-3 ${className}`}>
        {Icon && (
            <div className="mt-1 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-100">
                <Icon className="w-4 h-4" />
            </div>
        )}
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">{value || 'N/A'}</p>
            {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
        </div>
    </div>
);

export default function PolicyDetails({ user, policy, stats }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(amount);
    };

    const getPolicyGradient = (type) => {
        switch (type?.toLowerCase()) {
            case 'gmc': return 'from-indigo-600 via-purple-600 to-purple-800';
            case 'gpa': return 'from-blue-600 via-cyan-600 to-teal-700';
            case 'gtl': return 'from-emerald-600 via-green-600 to-teal-800';
            default: return 'from-slate-700 via-gray-700 to-zinc-800';
        }
    };

    const isActive = policy?.policy_status == 1;

    return (
        <CompanyUserLayout user={user}>
            <div className="min-h-screen bg-slate-50 pb-12">
                
                {/* Header Navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/company-user/policies"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        <span>Back to Policies</span>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* =======================
                            LEFT COLUMN (70% Area) 
                           ======================= */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Hero Card */}
                            <div className={`relative overflow-hidden rounded-3xl p-8 text-white shadow-xl bg-gradient-to-br ${getPolicyGradient(policy?.policy_type)}`}>
                                {/* Abstract Background Patterns */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex gap-5">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                                                {policy?.insurance?.insurance_comp_icon_url ? (
                                                    <img
                                                        src={policy.insurance.insurance_comp_icon_url}
                                                        alt="Insurance Logo"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <FiShield className="w-8 h-8 text-gray-600" />
                                                )}
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                                                    {policy?.policy_name || policy?.corporate_policy_name}
                                                </h1>
                                                <div className="flex items-center gap-3 text-white/80 text-sm">
                                                    <span className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                                                        <FiFileText className="w-3.5 h-3.5" />
                                                        {policy?.policy_number}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="uppercase font-semibold tracking-wider text-xs">
                                                        {policy?.policy_type || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border ${isActive ? 'bg-green-500/20 border-green-400 text-green-100' : 'bg-red-500/20 border-red-400 text-red-100'}`}>
                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    {/* Quick Info Grid inside Hero */}
                                    <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6 mt-6">
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Valid From</p>
                                            <p className="font-semibold">{formatDate(policy?.policy_start_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Valid Thru</p>
                                            <p className="font-semibold">{formatDate(policy?.policy_end_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Members</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <FiUsers className="w-4 h-4" />
                                                {stats?.total_members || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Information Panels */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <FiBriefcase className="text-indigo-500" />
                                        Policy & Insurance Details
                                    </h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    {/* Insurance Company */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">Insurer Information</h4>
                                        <DetailItem
                                            icon={FiShield}
                                            label="Insurance Company"
                                            value={policy?.insurance?.insurance_company_name}
                                        />
                                        {policy?.insurance?.insurance_company_email && (
                                            <DetailItem
                                                icon={FiMail}
                                                label="Insurer Email"
                                                value={policy.insurance.insurance_company_email}
                                                className="truncate"
                                            />
                                        )}
                                    </div>

                                    {/* TPA Details */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">TPA Information</h4>
                                        <DetailItem
                                            icon={FiActivity}
                                            label="TPA Name"
                                            value={policy?.tpa?.tpa_name || "Direct (No TPA)"}
                                        />
                                        {policy?.tpa?.tpa_email && (
                                            <DetailItem
                                                icon={FiMail}
                                                label="TPA Email"
                                                value={policy.tpa.tpa_email}
                                                className="truncate"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Coverage Section */}
                            {(policy?.sum_insured || policy?.family_definition) && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <FiDollarSign className="text-green-600" />
                                            Coverage & Benefits
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {policy?.sum_insured && (
                                                <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                        <FiDollarSign className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-green-700 font-medium uppercase">Sum Insured</p>
                                                        <p className="text-xl font-bold text-green-900">{formatCurrency(policy.sum_insured)}</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {policy?.family_definition && (
                                                <DetailItem
                                                    icon={FiUsers}
                                                    label="Family Definition"
                                                    value={policy.family_definition}
                                                />
                                            )}
                                            
                                            {policy?.cd_ac_master?.cd_ac_name && (
                                                <DetailItem
                                                    icon={FiClipboard}
                                                    label="CD/AC Type"
                                                    value={policy.cd_ac_master.cd_ac_name}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =======================
                            RIGHT COLUMN (30% Area) 
                           ======================= */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Actions Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={`/company-user/policies/${policy?.id}/endorsements`}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                <FiShield className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900">Endorsements</span>
                                                <span className="block text-xs text-slate-500">Add or remove members</span>
                                            </div>
                                        </div>
                                        <FiExternalLink className="text-slate-400 group-hover:text-indigo-500" />
                                    </Link>

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                                <FiDownload className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-sm font-semibold text-slate-700 group-hover:text-slate-900">Download Policy</span>
                                                <span className="block text-xs text-slate-500">PDF Document</span>
                                            </div>
                                        </div>
                                        <FiDownload className="text-slate-400 group-hover:text-blue-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Stats Summary Widget */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800">Endorsement Status</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm font-medium text-slate-600">Active</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-800">{stats?.active_endorsements || 0}</span>
                                    </div>
                                    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                            <span className="text-sm font-medium text-slate-600">Pending</span>
                                        </div>
                                        <span className="text-lg font-bold text-slate-800">{stats?.pending_endorsements || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info Widget */}
                            {policy?.company && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Corporate Account</h3>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                            {/* FIXED: Added optional chaining and fallback */}
                                            {policy.company.company_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            {/* FIXED: Added fallback for name */}
                                            <h4 className="font-bold text-slate-800 text-sm">{policy.company.company_name || 'N/A'}</h4>
                                            {policy.company.cinno && (
                                                <p className="text-xs text-slate-500 mt-0.5">CIN: {policy.company.cinno}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Help Box */}
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white text-center shadow-lg">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                    <FiPhone className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold mb-1">Need Assistance?</h3>
                                <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                                    Contact your dedicated support team for claims or policy queries.
                                </p>
                                <button className="w-full py-2 px-4 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                                    Contact Support
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </CompanyUserLayout>
    );
}