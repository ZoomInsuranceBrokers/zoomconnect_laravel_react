import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch, FiFilter, FiDownload, FiCalendar, 
    FiCheckCircle, FiXCircle, FiArrowRight, FiX,
    FiClock, FiUsers, FiActivity
} from 'react-icons/fi';

export default function Enrollments({ user, enrollments, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterValues, setFilterValues] = useState({
        status: filters.status !== undefined ? filters.status : ''
    });

    const filteredEnrollments = enrollments?.data?.filter(enrollment => 
        enrollment.enrolment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.corporate_enrolment_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        return status ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <FiXCircle className="w-3 h-3 mr-1" />
                Inactive
            </span>
        );
    };

    const applyFilters = () => {
        router.get('/company-user/enrollments', filterValues, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setFilterValues({ status: '' });
        router.get('/company-user/enrollments', {}, {
            preserveState: true,
            preserveScroll: true
        });
        setShowFilterModal(false);
    };

    const activeFilterCount = Object.values(filterValues).filter(v => v !== '').length;

    // Calculate stats
    const totalEnrollments = enrollments?.total || 0;
    const activeEnrollments = enrollments?.data?.filter(e => e.status === 1).length || 0;
    const inactiveEnrollments = totalEnrollments - activeEnrollments;

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
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Enrollments</p>
                            <p className="text-3xl font-light text-gray-900">{totalEnrollments}</p>
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <FiActivity className="w-3 h-3" />
                                All Records
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Active Enrollments</p>
                            <p className="text-3xl font-light text-gray-900">{activeEnrollments}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <FiCheckCircle className="w-3 h-3" />
                                Currently Active
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Inactive Enrollments</p>
                            <p className="text-3xl font-light text-gray-900">{inactiveEnrollments}</p>
                            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                <FiClock className="w-3 h-3" />
                                Archived
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
                            <FiXCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 70-30 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* LEFT: 70% - Enrollments Table */}
                <div className="lg:col-span-7">
                    {/* Search Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                            <div className="flex-1 relative w-full">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search enrollments by name..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto justify-end">
                                <button 
                                    onClick={() => setShowFilterModal(true)}
                                    className="relative flex items-center gap-2 px-3 py-2 text-xs border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors bg-white"
                                >
                                    <FiFilter className="w-4 h-4" />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enrollments Cards */}
                    <div className="space-y-3">
                        {filteredEnrollments.length > 0 ? (
                            filteredEnrollments.map((enrollment) => (
                                <div
                                    key={enrollment.id}
                                    onClick={() => setSelectedEnrollment(enrollment)}
                                    className={`bg-white/60 backdrop-blur-md border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                        selectedEnrollment?.id === enrollment.id
                                            ? 'border-purple-400 ring-2 ring-purple-200'
                                            : 'border-white/40 hover:border-purple-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                <FiUsers className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {enrollment.corporate_enrolment_name || enrollment.enrolment_name}
                                                </h3>
                                                <p className="text-xs text-gray-500">{enrollment.enrolment_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(enrollment.status)}
                                            <Link
                                                href={`/company-user/enrollments/${enrollment.id}/details`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                            >
                                                <FiArrowRight className="w-4 h-4 text-purple-600" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Policy Period</p>
                                            <p className="text-xs text-gray-700 flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {formatDate(enrollment.policy_start_date)} - {formatDate(enrollment.policy_end_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Company</p>
                                            <p className="text-xs text-gray-700">{enrollment.company?.comp_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 sm:8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">No enrollments found</h3>
                                <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {enrollments?.links && enrollments.links.length > 3 && (
                        <div className="mt-4 flex items-center justify-between bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-gray-600">
                                Showing {enrollments.from} to {enrollments.to} of {enrollments.total} enrollments
                            </div>
                            <div className="flex gap-1">
                                {enrollments.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded-lg text-xs ${
                                            link.active 
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: 30% - Selected Enrollment Details */}
                <div className="lg:col-span-3">
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm sticky top-6">
                        {selectedEnrollment ? (
                            <>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Enrollment Details</h3>
                                    <button
                                        onClick={() => setSelectedEnrollment(null)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Enrollment Name</p>
                                        <p className="text-xs text-gray-900 font-medium">{selectedEnrollment.corporate_enrolment_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Internal Name</p>
                                        <p className="text-xs text-gray-900">{selectedEnrollment.enrolment_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Status</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedEnrollment.status)}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Policy Period</p>
                                        <p className="text-xs text-gray-900">
                                            <span className="block">{formatDate(selectedEnrollment.policy_start_date)}</span>
                                            <span className="text-gray-500">to</span>
                                            <span className="block">{formatDate(selectedEnrollment.policy_end_date)}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Company</p>
                                        <p className="text-xs text-gray-900">{selectedEnrollment.company?.comp_name || 'N/A'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/company-user/enrollments/${selectedEnrollment.id}/details`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            View Enrollment Periods
                                            <FiArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-2 sm:py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">No Enrollment Selected</h3>
                                <p className="text-xs text-gray-500">Click on an enrollment to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Filter Enrollments</h3>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={filterValues.status}
                                    onChange={(e) => setFilterValues({ ...filterValues, status: e.target.value })}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                >
                                    <option value="">All Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetFilters}
                                className="flex-1 px-4 py-2 text-xs border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                className="flex-1 px-4 py-2 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
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
