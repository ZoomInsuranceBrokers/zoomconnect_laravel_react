import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function EnrollmentLists({ enrollments, filters, message, messageType }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [showMessage, setShowMessage] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // New message state

    // Handle success/error messages from redirects
    useEffect(() => {
        if (message) {
            setShowMessage({ type: messageType || 'success', text: message });

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setShowMessage(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message, messageType]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("superadmin.policy.enrollment-lists.index"),
            {
                search: searchQuery,
                status: statusFilter,
            },
            {
                preserveState: false,
                replace: false,
            }
        );
    };

    // Handle real-time filtering when status changes
    const handleStatusFilterChange = (e) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);

        // Auto-submit the filter
        router.get(
            route("superadmin.policy.enrollment-lists.index"),
            {
                search: searchQuery,
                status: newStatus,
            },
            {
                preserveState: false,
                replace: false,
            }
        );
    };

    const handleStatusToggle = (enrollmentId) => {
        if (confirm("Are you sure you want to toggle the status of this enrollment?")) {
            router.put(
                route("superadmin.policy.enrollment-lists.toggle-status", enrollmentId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setErrorMessage({ type: 'success', text: 'Enrollment status updated successfully' });
                    },
                    onError: () => {
                        setErrorMessage({ type: 'error', text: 'An error occurred while updating the enrollment status' });
                    }
                }
            );
        }
        setOpenDropdown(null); // Close dropdown after action
    };

    const handleMakeActive = (enrollmentId) => {
        setShowConfirmModal({
            type: 'activate',
            enrollmentId: enrollmentId,
            title: 'Activate Enrollment',
            message: 'Are you sure you want to activate this enrollment?',
            confirmText: 'Activate',
            confirmClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        });
        setOpenDropdown(null); // Close dropdown
    };

    const handleMakeInactive = (enrollmentId) => {
        setShowConfirmModal({
            type: 'deactivate',
            enrollmentId: enrollmentId,
            title: 'Deactivate Enrollment',
            message: 'Are you sure you want to deactivate this enrollment?',
            confirmText: 'Deactivate',
            confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        });
        setOpenDropdown(null); // Close dropdown
    };

    const handleConfirmAction = () => {
        const { type, enrollmentId } = showConfirmModal;

        if (type === 'activate') {
            router.put(
                route("superadmin.policy.enrollment-lists.make-active", enrollmentId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setErrorMessage({ type: 'success', text: 'Enrollment activated successfully' });
                    },
                    onError: () => {
                        setErrorMessage({ type: 'error', text: 'An error occurred while activating the enrollment' });
                    }
                }
            );
        } else if (type === 'deactivate') {
            router.put(
                route("superadmin.policy.enrollment-lists.make-inactive", enrollmentId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setErrorMessage({ type: 'success', text: 'Enrollment deactivated successfully' });
                    },
                    onError: () => {
                        setErrorMessage({ type: 'error', text: 'An error occurred while deactivating the enrollment' });
                    }
                }
            );
        }

        setShowConfirmModal(null);
    };

    const toggleDropdown = (enrollmentId) => {
        setOpenDropdown(openDropdown === enrollmentId ? null : enrollmentId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        router.get(route("superadmin.policy.enrollment-lists.index"));
    };

    // Close error message
    const closeErrorMessage = () => {
        setErrorMessage(null);
    };

    return (
        <SuperAdminLayout>
            <Head title="Enrollment Lists - Policy Management" />

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-montserrat">
                            Enrollment Lists
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Manage policy enrollments and their configurations
                        </p>
                    </div>
                    <Link
                        href={route("superadmin.policy.enrollment-lists.create")}
                        className="bg-[#934790] hover:bg-[#7a3d7a] text-white px-4 py-2 rounded-lg font-montserrat font-medium text-sm transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create New Enrollment
                    </Link>
                </div>

                {/* Success/Error Messages */}
                {showMessage && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                        showMessage.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${
                                showMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                                {showMessage.type === 'success' ? (
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    {showMessage.text}
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setShowMessage(null)}
                                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        showMessage.type === 'success'
                                            ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                                            : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                                    }`}
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by enrollment name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent text-sm"
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-[#934790] hover:bg-[#7a3d7a] text-white px-4 py-2 rounded-lg font-montserrat text-sm transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-montserrat text-sm transition-colors duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear
                            </button>
                        </div>
                    </form>
                </div>

                {/* Enrollments Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {enrollments.data && enrollments.data.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Enrollment Name
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Policy Period
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {enrollments.data.map((enrollment) => (
                                            <tr
                                                key={enrollment.id}
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="px-3 py-3">
                                                    <div>
                                                        <div className="text-xs font-medium text-gray-900">
                                                            {enrollment.enrolment_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {enrollment.corporate_enrolment_name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-xs text-gray-900">
                                                        {enrollment.company ? enrollment.company.comp_name : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="text-xs text-gray-900">
                                                        {new Date(enrollment.policy_start_date).toLocaleDateString()} - {new Date(enrollment.policy_end_date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <button
                                                        onClick={() => handleStatusToggle(enrollment.id)}
                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                                                            enrollment.status
                                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                                        }`}
                                                    >
                                                        <svg className={`w-3 h-3 mr-1 ${enrollment.status ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            {enrollment.status ? (
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            ) : (
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            )}
                                                        </svg>
                                                        {enrollment.status ? "Active" : "Inactive"}
                                                    </button>
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route("superadmin.policy.enrollment-lists.edit", enrollment.id)}
                                                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1"
                                                            title="Edit"
                                                        >
                                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </Link>

                                                        {/* Three dots dropdown menu */}
                                                        <div className="relative">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleDropdown(enrollment.id);
                                                                }}
                                                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                                                                title="More options"
                                                            >
                                                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                                </svg>
                                                            </button>

                                                            {/* Dropdown menu */}
                                                            {openDropdown === enrollment.id && (
                                                                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                                                                    <div className="py-1">

                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setOpenDropdown(null);
                                                                                console.log('Navigating to enrollment details for ID:', enrollment.id);
                                                                                // Direct URL navigation
                                                                                router.visit(`/superadmin/policy/enrollment-details/${enrollment.id}`);
                                                                            }}
                                                                            className="w-full block text-left px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                                                </svg>
                                                                                View Details
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => enrollment.status ? handleMakeInactive(enrollment.id) : handleMakeActive(enrollment.id)}
                                                                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center"
                                                                        >
                                                                            {enrollment.status
                                                                                ? (
                                                                                    <>
                                                                                        <svg className="w-3 h-3 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                                        </svg>
                                                                                        <span className="text-red-700">Make Inactive</span>
                                                                                    </>
                                                                                )
                                                                                : (
                                                                                    <>
                                                                                        <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                        <span className="text-green-700">Make Active</span>
                                                                                    </>
                                                                                )
                                                                            }
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {enrollments.links && enrollments.links.length > 3 && (
                                <div className="bg-white px-3 py-2 border-t border-gray-200 sm:px-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {enrollments.prev_page_url && (
                                                <Link
                                                    href={enrollments.prev_page_url}
                                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Previous
                                                </Link>
                                            )}
                                            {enrollments.next_page_url && (
                                                <Link
                                                    href={enrollments.next_page_url}
                                                    className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Next
                                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs text-gray-600">
                                                    Showing{" "}
                                                    <span className="font-semibold text-gray-900">{enrollments.from}</span> to{" "}
                                                    <span className="font-semibold text-gray-900">{enrollments.to}</span> of{" "}
                                                    <span className="font-semibold text-gray-900">{enrollments.total}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {enrollments.links.map((link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={link.url || "#"}
                                                            className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium transition-colors duration-200 ${
                                                                link.active
                                                                    ? "z-10 bg-[#934790] border-[#934790] text-white"
                                                                    : link.url
                                                                    ? "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                                    : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                                            } ${
                                                                index === 0 ? "rounded-l-md" : ""
                                                            } ${
                                                                index === enrollments.links.length - 1 ? "rounded-r-md" : ""
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ))}
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No enrollments found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new enrollment.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route("superadmin.policy.enrollment-lists.create")}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create New Enrollment
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => setShowConfirmModal(null)}
                        ></div>

                        {/* Modal positioning */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="sm:flex sm:items-start">
                                <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                                    showConfirmModal.type === 'activate'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                }`}>
                                    {showConfirmModal.type === 'activate' ? (
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        {showConfirmModal.title}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {showConfirmModal.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${showConfirmModal.confirmClass}`}
                                    onClick={handleConfirmAction}
                                >
                                    {showConfirmModal.confirmText}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setShowConfirmModal(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            {
                errorMessage && (
                    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-xs ${errorMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            {errorMessage.type === 'success' ? (
                                <path d="M9 12l2 2l4-4" />
                            ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                            )}
                        </svg>
                        <span>{errorMessage.text}</span>
                        <button
                            onClick={closeErrorMessage}
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
