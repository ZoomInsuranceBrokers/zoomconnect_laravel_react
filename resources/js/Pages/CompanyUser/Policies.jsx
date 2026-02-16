import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch, FiFilter, FiDownload, FiFileText, FiCalendar, 
    FiShield, FiUsers, FiArrowRight, FiCheckCircle, FiAlertCircle,
    FiTrendingUp, FiActivity, FiEye, FiX
} from 'react-icons/fi';

export default function Policies({ user, policies, stats, filters = {}, insuranceCompanies = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterValues, setFilterValues] = useState({
        policy_type: filters.policy_type || '',
        ins_id: filters.ins_id || ''
    });

    const filteredPolicies = policies?.filter(policy => 
        policy.policy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.policy_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.insurance_company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getPolicyTypeColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'gmc': return 'bg-purple-100 text-purple-800';
            case 'gpa': return 'bg-blue-100 text-blue-800';
            case 'gtl': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const applyFilters = () => {
        router.get('/company-user/policies', filterValues, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setFilterValues({ policy_type: '', ins_id: '' });
        router.get('/company-user/policies', {}, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const activeFilterCount = Object.values(filterValues).filter(v => v).length;

    return (
        <CompanyUserLayout user={user}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent blur-[100px] rounded-full"></div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Policies</p>
                            <p className="text-3xl font-light text-gray-900">{stats?.total_policies || 0}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <FiTrendingUp className="w-3 h-3" />
                                All Active
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <FiShield className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Covered Members</p>
                            <p className="text-3xl font-light text-gray-900">{stats?.total_members || 0}</p>
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <FiActivity className="w-3 h-3" />
                                Across All Policies
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Active Endorsements</p>
                            <p className="text-3xl font-light text-gray-900">{stats?.active_endorsements || 0}</p>
                            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                                <FiCheckCircle className="w-3 h-3" />
                                Completed
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <FiFileText className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 70-30 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* LEFT: 70% - Policies Table */}
                <div className="lg:col-span-7">
                    {/* Search Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                            <div className="flex-1 relative w-full">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search policies by name, number, or insurance company..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setShowFilterModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl hover:bg-gray-50 bg-white transition-all relative"
                                >
                                    <FiFilter className="w-3.5 h-3.5" />
                                    <span>Filter</span>
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white rounded-full text-[10px] flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#2d2d2d] text-white rounded-xl hover:bg-[#1f1f1f] transition-all">
                                    <FiDownload className="w-3.5 h-3.5" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Policies Table */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Policy Details</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Insurance / TPA</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Validity</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPolicies.length > 0 ? (
                                        filteredPolicies.map((policy) => {
                                            const daysLeft = getDaysRemaining(policy.policy_end_date);
                                            return (
                                                <tr 
                                                    key={policy.id}
                                                    onClick={() => setSelectedPolicy(policy)}
                                                    className={`hover:bg-purple-50/50 transition-colors cursor-pointer ${
                                                        selectedPolicy?.id === policy.id ? 'bg-purple-50/50' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                                {policy.insurance_comp_icon_url ? (
                                                                    <img 
                                                                        src={policy.insurance_comp_icon_url} 
                                                                        alt={policy.insurance_company_name}
                                                                        className="w-6 h-6 object-contain"
                                                                    />
                                                                ) : (
                                                                    <FiShield className="w-5 h-5 text-white" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-semibold text-gray-900 truncate">
                                                                    {policy.policy_name || policy.corporate_policy_name}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] text-gray-500">
                                                                        {policy.policy_number}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${getPolicyTypeColor(policy.policy_type)}`}>
                                                                        {policy.policy_type?.toUpperCase() || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-xs font-medium text-gray-900">{policy.insurance_company_name}</div>
                                                        <div className="text-[10px] text-gray-500 mt-0.5">{policy.tpa_name || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-xs text-gray-900">{formatDate(policy.policy_start_date)}</div>
                                                        <div className="text-[10px] text-gray-500 mt-0.5">to {formatDate(policy.policy_end_date)}</div>
                                                        {daysLeft <= 90 && daysLeft > 0 && (
                                                            <div className="text-[10px] text-orange-600 font-medium mt-1">
                                                                {daysLeft} days left
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                                                            <FiCheckCircle className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <Link
                                                                href={`/company-user/policies/${policy.id}/details`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                                title="View Details"
                                                            >
                                                                <FiEye className="w-4 h-4" />
                                                            </Link>
                                                            <Link
                                                                href={`/company-user/policies/${policy.id}/endorsements`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="View Endorsements"
                                                            >
                                                                <FiFileText className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-12 text-center">
                                                <FiAlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                                <h3 className="text-sm font-medium text-gray-900 mb-1">No policies found</h3>
                                                <p className="text-xs text-gray-500">
                                                    {searchTerm ? 'Try adjusting your search term' : 'No active policies available'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT: 30% - Policy Details Panel */}
                <div className="lg:col-span-3 space-y-4">
                    
                    {/* Selected Policy Card */}
                    {selectedPolicy ? (
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FiFileText className="w-4 h-4" />
                                Policy Details
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Policy Name</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {selectedPolicy.policy_name || selectedPolicy.corporate_policy_name}
                                    </div>
                                </div>
                                
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Policy Number</div>
                                    <div className="text-sm font-medium text-gray-900">{selectedPolicy.policy_number}</div>
                                </div>
                                
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Insurance Company</div>
                                    <div className="text-sm font-medium text-gray-900">{selectedPolicy.insurance_company_name}</div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">TPA</div>
                                    <div className="text-sm font-medium text-gray-900">{selectedPolicy.tpa_name || 'N/A'}</div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Validity Period</div>
                                    <div className="text-xs font-medium text-gray-900">
                                        {formatDate(selectedPolicy.policy_start_date)} - {formatDate(selectedPolicy.policy_end_date)}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                                    <Link
                                        href={`/company-user/policies/${selectedPolicy.id}/details`}
                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1f1f1f] transition-all text-xs font-medium"
                                    >
                                        <FiArrowRight className="w-3.5 h-3.5" />
                                        Details
                                    </Link>
                                    <Link
                                        href={`/company-user/policies/${selectedPolicy.id}/endorsements`}
                                        className="flex items-center justify-center gap-1 px-3 py-2 border-2 border-[#2d2d2d] text-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-white transition-all text-xs font-medium"
                                    >
                                        <FiFileText className="w-3.5 h-3.5" />
                                        Endorsements
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-sm text-center">
                            <FiShield className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No Policy Selected</h3>
                            <p className="text-xs text-gray-500">
                                Click on a policy to view its details
                            </p>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Overview</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FiShield className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Total Policies</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">{stats?.total_policies || 0}</span>
                            </div>
                            
                            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiUsers className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Covered Members</span>
                                </div>
                                <span className="text-lg font-semibold text-blue-600">{stats?.total_members || 0}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Endorsements</span>
                                </div>
                                <span className="text-lg font-semibold text-green-600">{stats?.active_endorsements || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Filter Policies</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Policy Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Policy Type
                                </label>
                                <select
                                    value={filterValues.policy_type}
                                    onChange={(e) => setFilterValues({...filterValues, policy_type: e.target.value})}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                >
                                    <option value="">All Types</option>
                                    <option value="GMC">GMC</option>
                                    <option value="GPA">GPA</option>
                                    <option value="GTL">GTL</option>
                                </select>
                            </div>

                            {/* Insurance Company */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Insurance Company
                                </label>
                                <select
                                    value={filterValues.ins_id}
                                    onChange={(e) => setFilterValues({...filterValues, ins_id: e.target.value})}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                >
                                    <option value="">All Companies</option>
                                    {insuranceCompanies.map(company => (
                                        <option key={company.id} value={company.id}>
                                            {company.insurance_company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={resetFilters}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-all"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2d2d2d] rounded-lg hover:bg-[#1f1f1f] transition-all"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CompanyUserLayout>
    );
}
