import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiArrowLeft, FiShield, FiFileText, FiCalendar, FiCheckCircle, 
    FiClock, FiDownload, FiExternalLink, FiSearch, FiUserPlus, 
    FiUserMinus, FiUsers, FiAlertCircle
} from 'react-icons/fi';

export default function EndorsementDetails({ user, policy, endorsement, additionMembers = [], deletionMembers = [] }) {
    const [activeTab, setActiveTab] = useState('additions');
    const [searchTerm, setSearchTerm] = useState('');

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch(parseInt(status)) {
            case 1:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                        <FiCheckCircle className="w-3 h-3" />
                        Completed
                    </span>
                );
            case 0:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
                        <FiClock className="w-3 h-3" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-800 w-fit">
                        Unknown
                    </span>
                );
        }
    };

    // Filter members based on search
    const filteredAdditions = additionMembers.filter(m => 
        String(m.employees_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.full_name || m.insured_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.relation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.uhid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDeletions = deletionMembers.filter(m => 
        String(m.employees_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.full_name || m.insured_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.relation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(m.uhid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CompanyUserLayout user={user}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent blur-[100px] rounded-full"></div>
            </div>

            {/* Back Button & Header */}
            <div className="mb-6">
                <Link 
                    href={`/company-user/policies/${policy?.id}/endorsements`}
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Endorsements</span>
                </Link>

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-light text-[#1f1f1f] mb-3">
                            Endorsement Member Details
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <FiFileText className="w-4 h-4" />
                                <span className="font-medium">{endorsement?.endorsement_no || 'N/A'}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                <span>{formatDate(endorsement?.endorsement_date)}</span>
                            </div>
                            <span>•</span>
                            {getStatusBadge(endorsement?.status)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            {policy?.insurance?.insurance_comp_icon_url ? (
                                <img 
                                    src={policy.insurance.insurance_comp_icon_url} 
                                    alt={policy.insurance.insurance_company_name}
                                    className="w-9 h-9 object-contain"
                                />
                            ) : (
                                <FiShield className="w-7 h-7 text-white" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Policy Info Card */}
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Policy Name</div>
                                <div className="text-sm font-semibold text-gray-900">
                                    {policy?.policy_name || policy?.corporate_policy_name || 'N/A'}
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Policy Number</div>
                                <div className="text-sm font-medium text-gray-900">{policy?.policy_number || 'N/A'}</div>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Insurance Company</div>
                                <div className="text-sm font-medium text-gray-900">{policy?.insurance?.insurance_company_name || 'N/A'}</div>
                            </div>
                        </div>
                        {endorsement?.endorsement_copy && (
                            <a
                                href={`/${endorsement.endorsement_copy.replace(/^\/+/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-xl hover:bg-[#1f1f1f] transition-all text-xs font-medium"
                            >
                                <FiDownload className="w-3.5 h-3.5" />
                                Download Copy
                                <FiExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Members</p>
                                <p className="text-3xl font-light text-gray-900">{additionMembers.length + deletionMembers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiUsers className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Additions</p>
                                <p className="text-3xl font-light text-green-600">{additionMembers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <FiUserPlus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Deletions</p>
                                <p className="text-3xl font-light text-red-600">{deletionMembers.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiUserMinus className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
                
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('additions')}
                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                            activeTab === 'additions'
                                ? 'text-green-600 border-b-2 border-green-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FiUserPlus className="w-4 h-4" />
                            <span>Member Additions</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                activeTab === 'additions' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {additionMembers.length}
                            </span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('deletions')}
                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                            activeTab === 'deletions'
                                ? 'text-red-600 border-b-2 border-red-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <FiUserMinus className="w-4 h-4" />
                            <span>Member Deletions</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                activeTab === 'deletions' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {deletionMembers.length}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-gray-50/50 border-b border-gray-200">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by employee code, name, relation or UHID..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {activeTab === 'additions' && (
                        filteredAdditions.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Employee Code</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">UHID</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Insured Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Relation</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">DOB</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Date of Joining</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Coverage Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAdditions.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-xs text-gray-700">{idx + 1}</td>
                                            <td className="px-4 py-3 text-xs font-medium text-gray-900">{member.employees_code || member.code || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.uhid || '-'}</td>
                                            <td className="px-4 py-3 text-xs font-medium text-gray-900">{member.full_name || member.insured_name || member.name || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.relation || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.gender || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{formatDate(member.dob || member.date_of_birth)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{formatDate(member.date_of_joining || member.joiningDate)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">
                                                <div className="space-y-1">
                                                    {member.base_sum_insured && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Base SI:</span> ₹{Number(member.base_sum_insured).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {member.topup_sum_insured && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Topup SI:</span> ₹{Number(member.topup_sum_insured).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {member.parent_sum_insured && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Parent SI:</span> ₹{Number(member.parent_sum_insured).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <FiUserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">
                                    {searchTerm ? 'No members found matching your search' : 'No member additions in this endorsement'}
                                </p>
                            </div>
                        )
                    )}

                    {activeTab === 'deletions' && (
                        filteredDeletions.length > 0 ? (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Employee Code</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">UHID</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Insured Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Relation</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">DOB</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Leaving Date</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Refund Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDeletions.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-xs text-gray-700">{idx + 1}</td>
                                            <td className="px-4 py-3 text-xs font-medium text-gray-900">{member.employees_code || member.code || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.uhid || '-'}</td>
                                            <td className="px-4 py-3 text-xs font-medium text-gray-900">{member.full_name || member.insured_name || member.name || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.relation || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{member.gender || '-'}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{formatDate(member.dob || member.date_of_birth)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">{formatDate(member.date_of_leaving || member.leavingDate)}</td>
                                            <td className="px-4 py-3 text-xs text-gray-700">
                                                <div className="space-y-1">
                                                    {(member.refund_base_premium_on_company !== null && member.refund_base_premium_on_company !== undefined) && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Base (Co):</span> ₹{Number(member.refund_base_premium_on_company).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {(member.refund_base_premium_on_employee !== null && member.refund_base_premium_on_employee !== undefined) && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Base (Emp):</span> ₹{Number(member.refund_base_premium_on_employee).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {(member.refund_topup_premium_on_company !== null && member.refund_topup_premium_on_company !== undefined) && (
                                                        <div className="text-[10px]">
                                                            <span className="font-semibold">Topup (Co):</span> ₹{Number(member.refund_topup_premium_on_company).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <FiUserMinus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">
                                    {searchTerm ? 'No members found matching your search' : 'No member deletions in this endorsement'}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </CompanyUserLayout>
    );
}
