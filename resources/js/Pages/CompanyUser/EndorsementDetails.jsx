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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Pagination logic
    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const getTotalPages = (data) => {
        return Math.ceil(data.length / itemsPerPage);
    };

    const paginatedAdditions = getPaginatedData(filteredAdditions);
    const paginatedDeletions = getPaginatedData(filteredDeletions);
    const totalAdditionPages = getTotalPages(filteredAdditions);
    const totalDeletionPages = getTotalPages(filteredDeletions);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <CompanyUserLayout user={user}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent blur-[100px] rounded-full"></div>
            </div>

            {/* Back Button & Header */}
            <div className="mb-4 sm:mb-6">
                <Link 
                    href={`/company-user/policies/${policy?.id}/endorsements`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors font-semibold"
                >
                    <div className="rounded-full bg-white p-1">
                        <FiArrowLeft className="w-4 h-4" />
                    </div>
                    <span>Back to Endorsements</span>
                </Link>

                <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1f1f1f] mb-2 sm:mb-3">
                            Endorsement Details
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-2">
                                <FiFileText className="w-4 h-4" />
                                <span className="font-medium">{endorsement?.endorsement_no || 'N/A'}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4" />
                                    <span>{formatDate(endorsement?.endorsement_date)}</span>
                                </div>
                                <span className="hidden sm:inline">•</span>
                                {getStatusBadge(endorsement?.status)}
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                            {policy?.insurance?.insurance_comp_icon_url ? (
                                <img 
                                    src={policy.insurance.insurance_comp_icon_url} 
                                    alt={policy.insurance.insurance_company_name}
                                    className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                                />
                            ) : (
                                <FiShield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Policy Info Card */}
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm mb-4 sm:mb-6 overflow-x-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 min-w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="min-w-0">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Policy Name</div>
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
                                    {policy?.policy_name || policy?.corporate_policy_name || 'N/A'}
                                </div>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
                            <div className="min-w-0">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Policy No</div>
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{policy?.policy_number || 'N/A'}</div>
                            </div>
                            <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
                            <div className="min-w-0">
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Insurer</div>
                                <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{policy?.insurance?.insurance_company_name || 'N/A'}</div>
                            </div>
                        </div>
                        {endorsement?.endorsement_copy && (
                            <a
                                href={`/${endorsement.endorsement_copy.replace(/^\/+/, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#2d2d2d] text-white rounded-lg sm:rounded-xl hover:bg-[#1f1f1f] transition-all text-xs font-medium whitespace-nowrap flex-shrink-0"
                            >
                                <FiDownload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="hidden sm:inline">Download</span>
                                <FiExternalLink className=" hidden sm:inline w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-white/60 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Total Members</p>
                                <p className="text-2xl sm:text-3xl font-light text-gray-900">{additionMembers.length + deletionMembers.length}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-white/60 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Additions</p>
                                <p className="text-2xl sm:text-3xl font-light text-green-600">{additionMembers.length}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FiUserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-white/60 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Deletions</p>
                                <p className="text-2xl sm:text-3xl font-light text-red-600">{deletionMembers.length}</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <FiUserMinus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
                
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('additions')}
                        className={`flex-1 sm:flex-initial px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                            activeTab === 'additions'
                                ? 'text-green-600 border-b-2 border-green-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <FiUserPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Member</span>
                            <span className="sm:hidden">Add</span> Additions
                            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                                activeTab === 'additions' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {additionMembers.length}
                            </span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('deletions')}
                        className={`flex-1 sm:flex-initial px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                            activeTab === 'deletions'
                                ? 'text-red-600 border-b-2 border-red-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                            <FiUserMinus className="w-4 h-4" />
                            <span className="hidden sm:inline">Member</span>
                            <span className="sm:hidden">Del</span> Deletions
                            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                                activeTab === 'deletions' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {deletionMembers.length}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-3 sm:p-4 bg-gray-50/50 border-b border-gray-200">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by code, name, relation or UHID..."
                            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {activeTab === 'additions' && (
                        filteredAdditions.length > 0 ? (
                            <table className="w-full text-xs sm:text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Employee Code</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">UHID</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Relation</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">DOB</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Joining Date</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Coverage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedAdditions.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700 font-medium">{idx + 1}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-gray-900">{member.employees_code || member.code || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.uhid || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-gray-900">{member.full_name || member.insured_name || member.name || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.relation || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.gender || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{formatDate(member.dob || member.date_of_birth)}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{formatDate(member.date_of_joining || member.joiningDate)}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">
                                                <div className="space-y-1 text-[10px]">
                                                    {member.base_sum_insured && (
                                                        <div>
                                                            <span className="font-semibold">Base:</span> ₹{Number(member.base_sum_insured).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {member.topup_sum_insured && (
                                                        <div>
                                                            <span className="font-semibold">Topup:</span> ₹{Number(member.topup_sum_insured).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <FiUserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {searchTerm ? 'No members found matching your search' : 'No member additions in this endorsement'}
                                </p>
                            </div>
                        )
                    )}

                    {activeTab === 'deletions' && (
                        filteredDeletions.length > 0 ? (
                            <table className="w-full text-xs sm:text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Employee Code</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">UHID</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Relation</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Gender</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">DOB</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Leaving Date</th>
                                        <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Refund</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedDeletions.map((member, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700 font-medium">{idx + 1}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-gray-900">{member.employees_code || member.code || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.uhid || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-gray-900">{member.full_name || member.insured_name || member.name || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.relation || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{member.gender || '-'}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{formatDate(member.dob || member.date_of_birth)}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">{formatDate(member.date_of_leaving || member.leavingDate)}</td>
                                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs text-gray-700">
                                                <div className="space-y-1 text-[10px]">
                                                    {(member.refund_base_premium_on_company !== null && member.refund_base_premium_on_company !== undefined) && (
                                                        <div>
                                                            <span className="font-semibold">Base(Co):</span> ₹{Number(member.refund_base_premium_on_company).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                    {(member.refund_topup_premium_on_company !== null && member.refund_topup_premium_on_company !== undefined) && (
                                                        <div>
                                                            <span className="font-semibold">Topup(Co):</span> ₹{Number(member.refund_topup_premium_on_company).toLocaleString('en-IN')}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <FiUserMinus className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {searchTerm ? 'No members found matching your search' : 'No member deletions in this endorsement'}
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/* Pagination Controls */}
                {activeTab === 'additions' && filteredAdditions.length > 0 && (
                    <div className="flex items-center justify-center p-3 sm:p-4 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 border rounded-lg transition-colors ${
                                    currentPage === 1 
                                        ? 'text-gray-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                        : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg bg-white text-center min-w-24">
                                <span className="text-xs sm:text-sm font-semibold text-purple-600">{currentPage} OF {totalAdditionPages}</span>
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalAdditionPages}
                                className={`p-2 border rounded-lg transition-colors ${
                                    currentPage === totalAdditionPages 
                                        ? 'text-gray-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                        : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'deletions' && filteredDeletions.length > 0 && (
                    <div className="flex items-center justify-center p-3 sm:p-4 border-t border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 border rounded-lg transition-colors ${
                                    currentPage === 1 
                                        ? 'text-gray-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                        : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg bg-white text-center min-w-24">
                                <span className="text-xs sm:text-sm font-semibold text-purple-600">{currentPage} OF {totalDeletionPages}</span>
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalDeletionPages}
                                className={`p-2 border rounded-lg transition-colors ${
                                    currentPage === totalDeletionPages 
                                        ? 'text-gray-400 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed' 
                                        : 'text-purple-600 border-purple-300 hover:bg-purple-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </CompanyUserLayout>
    );
}
