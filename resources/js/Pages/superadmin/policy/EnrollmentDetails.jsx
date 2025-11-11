import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function EnrollmentDetails({ enrollmentDetail, enrollmentPeriods }) {
    const [selectedPeriods, setSelectedPeriods] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [message, setMessage] = useState(null); // New message state
    const itemsPerPage = 10;

    // Filter and paginate periods
    const filteredPeriods = useMemo(() => {
        return enrollmentPeriods.filter(period =>
            period.enrolment_portal_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            period.corporate_enrolment_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [enrollmentPeriods, searchQuery]);

    const totalPages = Math.ceil(filteredPeriods.length / itemsPerPage);
    const paginatedPeriods = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPeriods.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPeriods, currentPage]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPeriods(paginatedPeriods.map(period => period.id));
        } else {
            setSelectedPeriods([]);
        }
    };

    const handleSelectPeriod = (periodId) => {
        if (selectedPeriods.includes(periodId)) {
            setSelectedPeriods(selectedPeriods.filter(id => id !== periodId));
        } else {
            setSelectedPeriods([...selectedPeriods, periodId]);
        }
    };

    const handleOpenEnrollment = () => {
        if (selectedPeriods.length === 0) {
            setMessage({ type: 'error', text: 'Please select at least one enrollment period to open.' });
            return;
        }
        try {
            // Handle open enrollment logic here
            console.log('Opening enrollment for periods:', selectedPeriods);
            setMessage({ type: 'success', text: 'Enrollment periods opened successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while opening enrollment periods' });
        }
    };

    const handleOpenNewEnrollmentPortal = () => {
        try {
            // Navigate to the new enrollment portal route
            router.visit(`/superadmin/policy/open-enrollment-portal/${enrollmentDetail.id}`);
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while opening enrollment portal' });
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Close message
    const closeMessage = () => {
        setMessage(null);
    };

    return (
        <SuperAdminLayout>
            <Head title={`Enrollment Details - ${enrollmentDetail.corporate_enrolment_name}`} />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <Link
                                href={route('superadmin.policy.enrollment-lists.index')}
                                className="mr-5 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Enrollment Details
                                </h1>
                                <p className="mt-1 text-xs text-gray-600">
                                    Manage enrollment periods for {enrollmentDetail.corporate_enrolment_name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enrollment Summary Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-4 py-4">
                            <h3 className="text-sm leading-5 font-medium text-gray-900">
                                Enrollment Summary
                            </h3>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="bg-gray-50 overflow-hidden rounded-lg">
                                    <div className="p-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-xs font-medium text-gray-500 truncate">
                                                        Company
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        {enrollmentDetail.company?.comp_name || 'N/A'}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 overflow-hidden rounded-lg">
                                    <div className="p-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-xs font-medium text-gray-500 truncate">
                                                        Enrollment Name
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        {enrollmentDetail.enrolment_name}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 overflow-hidden rounded-lg">
                                    <div className="p-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-xs font-medium text-gray-500 truncate">
                                                        Policy Period
                                                    </dt>
                                                    <dd className="text-sm font-medium text-gray-900">
                                                        {formatDate(enrollmentDetail.policy_start_date)} - {formatDate(enrollmentDetail.policy_end_date)}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 overflow-hidden rounded-lg">
                                    <div className="p-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {enrollmentDetail.status ? (
                                                    <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="ml-3 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-xs font-medium text-gray-500 truncate">
                                                        Status
                                                    </dt>
                                                    <dd className={`text-sm font-medium ${enrollmentDetail.status ? 'text-green-600' : 'text-red-600'}`}>
                                                        {enrollmentDetail.status ? 'Active' : 'Inactive'}
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and New Portal Section */}
                    <div className="mb-4 bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search enrollment periods..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                                    />
                                </div>
                            </div>
                            {enrollmentDetail.status && (
                                <button
                                    onClick={handleOpenNewEnrollmentPortal}
                                    className="inline-flex items-center px-4 py-2 bg-[#934790] border border-transparent rounded-lg text-xs font-medium text-white hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] transition-colors duration-200"
                                >
                                    <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Open New Enrollment Portal
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mb-4 bg-white p-3 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-sm font-medium text-gray-900">
                                    Enrollment Periods ({filteredPeriods.length})
                                </h3>
                                {selectedPeriods.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#934790] bg-opacity-10 text-[#934790]">
                                        {selectedPeriods.length} selected
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleOpenEnrollment}
                                disabled={selectedPeriods.length === 0}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                                    selectedPeriods.length > 0
                                        ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                            >
                                <svg className="-ml-1 mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                Open Enrollment
                            </button>
                        </div>
                    </div>

                    {/* Enrollment Periods Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={selectedPeriods.length === paginatedPeriods.length && paginatedPeriods.length > 0}
                                                onChange={handleSelectAll}
                                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Portal Name
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Portal Start Date
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Portal End Date
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedPeriods.length > 0 ? (
                                        paginatedPeriods.map((period) => (
                                            <tr key={period.id} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPeriods.includes(period.id)}
                                                        onChange={() => handleSelectPeriod(period.id)}
                                                        className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                                    {period.enrolment_portal_name || period.corporate_enrolment_name || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                                    {formatDate(period.portal_start_date)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                                    {formatDate(period.portal_end_date)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    <a
                                                        href={`/superadmin/view-enrollment-period-details/${period.id}`}
                                                        className="inline-block bg-[#934790] hover:bg-[#7a3d7a] text-white text-xs px-2 py-1 rounded-lg transition-colors duration-200"
                                                    >
                                                        View Details
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-3 py-4 text-center text-xs text-gray-500">
                                                <div className="flex flex-col items-center justify-center py-6">
                                                    <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <h3 className="text-xs font-medium text-gray-900 mb-1">No enrollment periods found</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {searchQuery ? 'No enrollment periods match your search criteria.' : 'No enrollment periods have been created for this enrollment yet.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredPeriods.length > itemsPerPage && (
                            <div className="bg-white px-3 py-2 flex items-center justify-between border-t border-gray-200">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`ml-2 relative inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                                            {' '}to{' '}
                                            <span className="font-medium">
                                                {Math.min(currentPage * itemsPerPage, filteredPeriods.length)}
                                            </span>
                                            {' '}of{' '}
                                            <span className="font-medium">{filteredPeriods.length}</span>
                                            {' '}results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`relative inline-flex items-center px-1.5 py-1.5 rounded-l-md border text-xs font-medium ${
                                                    currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`relative inline-flex items-center px-2 py-1.5 border text-xs font-medium ${
                                                            currentPage === pageNum
                                                                ? 'z-10 bg-[#934790] border-[#934790] text-white'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`relative inline-flex items-center px-1.5 py-1.5 rounded-r-md border text-xs font-medium ${
                                                    currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success/Error Message */}
            {
                message && (
                    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-xs ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            {message.type === 'success' ? (
                                <path d="M9 12l2 2l4-4" />
                            ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                            )}
                        </svg>
                        <span>{message.text}</span>
                        <button
                            onClick={closeMessage}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>
                )
            }
        </SuperAdminLayout>
    );
}
