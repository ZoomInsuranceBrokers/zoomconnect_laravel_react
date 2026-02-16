import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch, FiArrowLeft, FiCalendar, FiCheckCircle, FiClock,
    FiUsers, FiArrowRight, FiX, FiActivity
} from 'react-icons/fi';

export default function EnrollmentDetails({ user, enrollmentDetail, enrollmentPeriods }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    const filteredPeriods = enrollmentPeriods?.filter(period =>
        period.enrolment_portal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        period.corporate_enrolment_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (creation_status) => {
        return creation_status >= 2 ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                Live
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <FiClock className="w-3 h-3 mr-1" />
                Setting Up
            </span>
        );
    };

    const getDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Calculate stats
    const totalPeriods = enrollmentPeriods?.length || 0;
    const livePeriods = enrollmentPeriods?.filter(p => p.creation_status >= 2).length || 0;
    const setupPeriods = totalPeriods - livePeriods;

    return (
        <CompanyUserLayout user={user}>
            {/* Background Effects */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent blur-[100px] rounded-full"></div>
            </div>

            {/* Header with Back Button */}
            <div className="mb-6">
                <Link
                    href="/company-user/enrollments"
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-purple-600 transition-colors mb-4"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Enrollments
                </Link>
                
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiUsers className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{enrollmentDetail.corporate_enrolment_name}</h1>
                                <p className="text-xs text-gray-500 mt-1">{enrollmentDetail.enrolment_name}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                        <FiCalendar className="w-3 h-3" />
                                        {formatDate(enrollmentDetail.policy_start_date)} - {formatDate(enrollmentDetail.policy_end_date)}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                        {enrollmentDetail.company?.comp_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {enrollmentDetail.status ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                                Active
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Periods</p>
                            <p className="text-3xl font-light text-gray-900">{totalPeriods}</p>
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <FiActivity className="w-3 h-3" />
                                All Portals
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <FiCalendar className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Live Periods</p>
                            <p className="text-3xl font-light text-gray-900">{livePeriods}</p>
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
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">In Setup</p>
                            <p className="text-3xl font-light text-gray-900">{setupPeriods}</p>
                            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                                <FiClock className="w-3 h-3" />
                                Pending
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <FiClock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 70-30 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* LEFT: 70% - Enrollment Periods */}
                <div className="lg:col-span-7">
                    {/* Search Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search enrollment periods..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Periods Cards */}
                    <div className="space-y-3">
                        {filteredPeriods.length > 0 ? (
                            filteredPeriods.map((period) => {
                                const daysRemaining = getDaysRemaining(period.portal_end_date);
                                return (
                                    <div
                                        key={period.id}
                                        onClick={() => setSelectedPeriod(period)}
                                        className={`bg-white/60 backdrop-blur-md border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                            selectedPeriod?.id === period.id
                                                ? 'border-purple-400 ring-2 ring-purple-200'
                                                : 'border-white/40 hover:border-purple-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                    <FiCalendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        {period.enrolment_portal_name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{period.corporate_enrolment_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(period.creation_status)}
                                                <Link
                                                    href={`/company-user/enrollments/portal/${period.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <FiArrowRight className="w-4 h-4 text-purple-600" />
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Portal Period</p>
                                                <p className="text-xs text-gray-700">
                                                    {formatDate(period.portal_start_date)} - {formatDate(period.portal_end_date)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Days Remaining</p>
                                                <p className={`text-xs font-semibold ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                    {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Status</p>
                                                <p className="text-xs text-gray-700">
                                                    {period.creation_status >= 2 ? 'Live' : 'Setting Up'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCalendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1">No enrollment periods found</h3>
                                <p className="text-xs text-gray-500">No portals have been created for this enrollment yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: 30% - Selected Period Details */}
                <div className="lg:col-span-3">
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm sticky top-6">
                        {selectedPeriod ? (
                            <>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Period Details</h3>
                                    <button
                                        onClick={() => setSelectedPeriod(null)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Portal Name</p>
                                        <p className="text-xs text-gray-900 font-medium">{selectedPeriod.enrolment_portal_name}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Portal Period</p>
                                        <p className="text-xs text-gray-900">
                                            <span className="block">{formatDate(selectedPeriod.portal_start_date)}</span>
                                            <span className="text-gray-500">to</span>
                                            <span className="block">{formatDate(selectedPeriod.portal_end_date)}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Status</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedPeriod.creation_status)}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Days Remaining</p>
                                        <p className={`text-xs font-semibold ${getDaysRemaining(selectedPeriod.portal_end_date) < 0 ? 'text-red-600' : getDaysRemaining(selectedPeriod.portal_end_date) < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {getDaysRemaining(selectedPeriod.portal_end_date) < 0 
                                                ? 'Expired' 
                                                : `${getDaysRemaining(selectedPeriod.portal_end_date)} days left`}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/company-user/enrollments/portal/${selectedPeriod.id}`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            View Enrolled Employees
                                            <FiArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCalendar className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">No Period Selected</h3>
                                <p className="text-xs text-gray-500">Click on a period to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CompanyUserLayout>
    );
}
