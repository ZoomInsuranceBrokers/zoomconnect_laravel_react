import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import axios from 'axios';
import {
    FiArrowLeft, FiShield, FiFileText, FiCalendar, FiCheckCircle,
    FiClock, FiDownload, FiExternalLink, FiSearch, FiEye, FiAlertCircle,
    FiFilter, FiX, FiUserPlus, FiUserMinus, FiUser, FiMail, FiHash
} from 'react-icons/fi';

export default function PolicyEndorsements({ user, policy, endorsements, filters = {} }) {
    const [selectedEndorsement, setSelectedEndorsement] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [memberData, setMemberData] = useState(null);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [activeTab, setActiveTab] = useState('additions');
    const [filterValues, setFilterValues] = useState({
        search: filters.search || '',
        status: filters.status || ''
    });

    // Fetch member data when endorsement selected
    useEffect(() => {
        if (selectedEndorsement?.id) {
            setLoadingMembers(true);
            setMemberData(null);

            axios.get(`/company-user/api/endorsements/${selectedEndorsement.id}/details`)
                .then(response => {
                    setMemberData(response.data);
                    setLoadingMembers(false);
                })
                .catch(error => {
                    console.error('Error fetching member data:', error);
                    setLoadingMembers(false);
                });
        } else {
            setMemberData(null);
        }
    }, [selectedEndorsement]);

    const applyFilters = () => {
        router.get(`/company-user/policies/${policy.id}/endorsements`, filterValues, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setFilterValues({ search: '', status: '' });
        router.get(`/company-user/policies/${policy.id}/endorsements`, {}, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const activeFilterCount = Object.values(filterValues).filter(v => v).length;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (parseInt(status)) {
            case 1:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <FiCheckCircle className="w-3 h-3" />
                        Completed
                    </span>
                );
            case 0:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-orange-100 text-orange-800 flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-gray-100 text-gray-800">
                        Unknown
                    </span>
                );
        }
    };

    const filteredEndorsements = endorsements?.data?.filter(endo =>
        endo.endorsement_no?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
                    href="/company-user/policies"
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 mb-4 transition-colors font-semibold"
                >
                    <div className="rounded-full bg-white p-1 w-fit">
                        <FiArrowLeft className="w-4 h-4" />
                    </div>                    <span>Back to Policies</span>
                </Link>

                <div className="flex items-center justify-between">
                    <div>

                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mt-3">
                            Policy Endorsements
                        </h1>
                        <p className="text-sm text-gray-500">
                            {policy?.policy_name || policy?.corporate_policy_name}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            {policy?.insurance?.insurance_comp_icon_url ? (
                                <img
                                    src={policy.insurance.insurance_comp_icon_url}
                                    alt={policy.insurance.insurance_company_name}
                                    className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <FiShield className="w-6 h-6 text-white" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 70-30 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                {/* LEFT: 70% - Endorsements Table */}
                <div className="lg:col-span-7">

                    {/* Search Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex gap-3 items-start sm:flex-row flex-col">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search endorsements by number..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3">
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
                                <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#2d2d2d] text-white rounded-xl hover:bg-[#1f1f1f] transition-all">
                                    <FiDownload className="w-3.5 h-3.5" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Endorsements Table */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">S.No</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Endorsement No</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEndorsements.length > 0 ? (
                                        filteredEndorsements.map((endorsement, idx) => (
                                            <tr
                                                key={endorsement.id}
                                                className={`hover:bg-purple-50/50 transition-colors cursor-pointer ${selectedEndorsement?.id === endorsement.id ? 'bg-purple-50/50' : ''
                                                    }`}
                                                onClick={() => setSelectedEndorsement(endorsement)}
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className="text-xs text-gray-700">
                                                        {(endorsements.current_page - 1) * endorsements.per_page + idx + 1}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                                            <FiFileText className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-900">
                                                            {endorsement.endorsement_no}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                        <FiCalendar className="w-3 h-3" />
                                                        {formatDate(endorsement.endorsement_date)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {getStatusBadge(endorsement.status)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedEndorsement(endorsement);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                                            title="Quick View"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                        </button>
                                                        <Link
                                                            href={`/company-user/endorsements/${endorsement.id}/details`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                            title="View Full Details"
                                                        >
                                                            <FiFileText className="w-4 h-4" />
                                                        </Link>
                                                        {endorsement.endorsement_copy && (
                                                            <a
                                                                href={`/${endorsement.endorsement_copy.replace(/^\/+/, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Download Copy"
                                                            >
                                                                <FiDownload className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-12 text-center">
                                                <FiAlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500">
                                                    {searchTerm ? 'No endorsements found matching your search' : 'No endorsements available'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {endorsements?.last_page > 1 && (
                            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-600">
                                        Showing {endorsements.from} to {endorsements.to} of {endorsements.total} entries
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {endorsements.links.map((link, idx) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 text-xs rounded-lg transition-all ${link.active
                                                        ? 'bg-[#2d2d2d] text-white'
                                                        : link.url
                                                            ? 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: 30% - Details Panel */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Selected Endorsement Details */}
                    {selectedEndorsement ? (
                        <>
                            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FiFileText className="w-4 h-4" />
                                    Endorsement Details
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Endorsement Number</div>
                                        <div className="text-sm font-semibold text-gray-900">{selectedEndorsement.endorsement_no}</div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Date</div>
                                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                            <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                                            {formatDate(selectedEndorsement.endorsement_date)}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Status</div>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedEndorsement.status)}
                                        </div>
                                    </div>

                                    {selectedEndorsement.endorsement_type && (
                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider">Type</div>
                                            <div className="text-sm font-medium text-gray-900 capitalize">
                                                {selectedEndorsement.endorsement_type}
                                            </div>
                                        </div>
                                    )}

                                    {selectedEndorsement.endorsement_copy && (
                                        <div className="pt-3 border-t border-gray-100">
                                            <a
                                                href={`/${selectedEndorsement.endorsement_copy.replace(/^\/+/, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#2d2d2d] text-white rounded-xl hover:bg-[#1f1f1f] transition-all text-xs font-medium"
                                            >
                                                <FiDownload className="w-3.5 h-3.5" />
                                                Download Copy
                                                <FiExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-gray-100">
                                        <Link
                                            href={`/company-user/endorsements/${selectedEndorsement.id}/details`}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all text-xs font-medium"
                                        >
                                            <FiFileText className="w-3.5 h-3.5" />
                                            View Full Member Details
                                            <FiExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Members List */}
                            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-200">
                                    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                        <FiUser className="w-4 h-4" />
                                        Members
                                    </h3>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-200 bg-gray-50/50">
                                    <button
                                        onClick={() => setActiveTab('additions')}
                                        className={`flex-1 px-4 py-3 text-xs font-semibold transition-all ${activeTab === 'additions'
                                                ? 'text-green-600 border-b-2 border-green-600 bg-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FiUserPlus className="w-3.5 h-3.5" />
                                            <span>Additions</span>
                                            {memberData && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'additions' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {memberData.additionMembers?.length || 0}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('deletions')}
                                        className={`flex-1 px-4 py-3 text-xs font-semibold transition-all ${activeTab === 'deletions'
                                                ? 'text-red-600 border-b-2 border-red-600 bg-white'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FiUserMinus className="w-3.5 h-3.5" />
                                            <span>Deletions</span>
                                            {memberData && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'deletions' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                    {memberData.deletionMembers?.length || 0}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Member List Content: render additions/deletions in tables */}
                                <div className="p-4 max-h-[520px] overflow-y-auto">
                                    {loadingMembers ? (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
                                            <p className="text-xs text-gray-500">Loading members...</p>
                                        </div>
                                    ) : memberData ? (
                                        <div>
                                            {/* Member search */}
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Search members by code, name, relation or uhid"
                                                    onChange={(e) => { /* local filtering handled below */ e.target.closest('.member-panel')?.querySelectorAll('input') }}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                                    id="member-search-input"
                                                />
                                            </div>

                                            {activeTab === 'additions' && memberData.additionMembers?.length > 0 && (
                                                <div className="overflow-x-auto bg-white rounded-lg border">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-gray-50 text-xs text-gray-600">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left">S.No</th>
                                                                <th className="px-3 py-2 text-left">Emp Code</th>
                                                                <th className="px-3 py-2 text-left">Name</th>
                                                                <th className="px-3 py-2 text-left">Relation</th>
                                                                <th className="px-3 py-2 text-left">DOB</th>
                                                                <th className="px-3 py-2 text-left">Gender</th>
                                                                <th className="px-3 py-2 text-left">UHID</th>
                                                                <th className="px-3 py-2 text-left">Joining Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {memberData.additionMembers.map((m, idx) => (
                                                                <tr key={idx} className="border-t hover:bg-gray-50">
                                                                    <td className="px-3 py-2">{idx + 1}</td>
                                                                    <td className="px-3 py-2">{m.employees_code || m.code || ''}</td>
                                                                    <td className="px-3 py-2">{m.insured_name || m.name || m.full_name || ''}</td>
                                                                    <td className="px-3 py-2">{m.relation || ''}</td>
                                                                    <td className="px-3 py-2">{m.dob || m.date_of_birth || ''}</td>
                                                                    <td className="px-3 py-2">{m.gender || ''}</td>
                                                                    <td className="px-3 py-2">{m.uhid || ''}</td>
                                                                    <td className="px-3 py-2">{m.date_of_joining || m.joiningDate || ''}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {activeTab === 'additions' && (!memberData.additionMembers || memberData.additionMembers.length === 0) && (
                                                <div className="text-center py-8">
                                                    <FiUserPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-500">No additions</p>
                                                </div>
                                            )}

                                            {activeTab === 'deletions' && memberData.deletionMembers?.length > 0 && (
                                                <div className="overflow-x-auto bg-white rounded-lg border">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-gray-50 text-xs text-gray-600">
                                                            <tr>
                                                                <th className="px-3 py-2 text-left">S.No</th>
                                                                <th className="px-3 py-2 text-left">Emp Code</th>
                                                                <th className="px-3 py-2 text-left">Name</th>
                                                                <th className="px-3 py-2 text-left">Relation</th>
                                                                <th className="px-3 py-2 text-left">Leaving Date</th>
                                                                <th className="px-3 py-2 text-left">Refund Base (Company)</th>
                                                                <th className="px-3 py-2 text-left">Refund Base (Employee)</th>
                                                                <th className="px-3 py-2 text-left">UHID</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {memberData.deletionMembers.map((m, idx) => (
                                                                <tr key={idx} className="border-t hover:bg-gray-50">
                                                                    <td className="px-3 py-2">{idx + 1}</td>
                                                                    <td className="px-3 py-2">{m.employees_code || m.code || ''}</td>
                                                                    <td className="px-3 py-2">{m.insured_name || m.name || m.full_name || ''}</td>
                                                                    <td className="px-3 py-2">{m.relation || ''}</td>
                                                                    <td className="px-3 py-2">{m.date_of_leaving || m.leavingDate || ''}</td>
                                                                    <td className="px-3 py-2">{m.refund_base_premium_on_company || m.refund_base_premium_on_company === 0 ? m.refund_base_premium_on_company : ''}</td>
                                                                    <td className="px-3 py-2">{m.refund_base_premium_on_employee || m.refund_base_premium_on_employee === 0 ? m.refund_base_premium_on_employee : ''}</td>
                                                                    <td className="px-3 py-2">{m.uhid || ''}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {activeTab === 'deletions' && (!memberData.deletionMembers || memberData.deletionMembers.length === 0) && (
                                                <div className="text-center py-8">
                                                    <FiUserMinus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-500">No deletions</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FiAlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">No member data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-sm text-center">
                            <FiEye className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-gray-900 mb-1">No Endorsement Selected</h3>
                            <p className="text-xs text-gray-500">
                                Click on an endorsement to view its details
                            </p>
                        </div>
                    )}

                    {/* Policy Info */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Policy Info</h3>

                        <div className="space-y-3">
                            <div>
                                <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Policy Name</div>
                                <div className="text-xs font-medium text-gray-900">
                                    {policy?.policy_name || policy?.corporate_policy_name}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Policy Number</div>
                                <div className="text-xs font-medium text-gray-900">{policy?.policy_number}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Insurance</div>
                                <div className="text-xs font-medium text-gray-900">
                                    {policy?.insurance?.insurance_company_name}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Statistics</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Total Endorsements</span>
                                <span className="text-base font-semibold text-gray-900">{endorsements?.total || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Completed</span>
                                <span className="text-base font-semibold text-green-600">
                                    {endorsements?.data?.filter(e => e.status == 1).length || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Pending</span>
                                <span className="text-base font-semibold text-orange-600">
                                    {endorsements?.data?.filter(e => e.status == 0).length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Help Card */}

                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Filter Endorsements</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by endorsement number..."
                                    value={filterValues.search}
                                    onChange={(e) => setFilterValues({ ...filterValues, search: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterValues.status}
                                    onChange={(e) => setFilterValues({ ...filterValues, status: e.target.value })}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                >
                                    <option value="">All Status</option>
                                    <option value="0">Pending</option>
                                    <option value="1">Completed</option>
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
