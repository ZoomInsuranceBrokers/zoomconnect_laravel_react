import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function ViewLivePortal({
    enrollmentPeriod,
    enrollmentDetail,
    enrollmentConfig,
    totalSelectedEmployees,
    totalEnrolledEmployees,
    employees,
    message,
    messageType
}) {
    const [showMessage, setShowMessage] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Close message
    const closeMessage = () => {
        setShowMessage(null);
    };

    const toggleDropdown = (employeeId) => {
        setOpenDropdown(openDropdown === employeeId ? null : employeeId);
    };

    const handleEditEnrolment = (employee) => {
        // Handle edit enrolment action
        console.log('Edit enrolment for:', employee);
        setOpenDropdown(null);
    };

    // Filter employees based on search term
    const filteredEmployees = employees ? employees.filter(employee => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (employee.full_name && employee.full_name.toLowerCase().includes(searchLower)) ||
            (employee.employees_code && employee.employees_code.toLowerCase().includes(searchLower)) ||
            (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
            (employee.designation && employee.designation.toLowerCase().includes(searchLower)) ||
            (employee.grade && employee.grade.toLowerCase().includes(searchLower)) ||
            (employee.gender && employee.gender.toLowerCase().includes(searchLower))
        );
    }) : [];

    // Pagination calculations
    const totalItems = filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ENROLLED':
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">ENROLLED</span>;
            case 'VISITED':
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">VISITED</span>;
            default:
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">NOT VISITED</span>;
        }
    };

    return (
        <SuperAdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Link
                                    href={`/superadmin/policy/enrollment-details/${enrollmentPeriod.enrolment_id}`}
                                    className="mr-4 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] shadow-lg"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <div className="ml-2">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Enrollment Portal Live
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium text-[#934790]">{enrollmentPeriod.enrolment_portal_name}</span> ({enrollmentDetail.corporate_enrolment_name})
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={`/superadmin/select-employees-for-portal/${enrollmentPeriod.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Go to Selected Employees
                                </Link>
                                <Link
                                    href={`/superadmin/policy/edit-enrollment-period/${enrollmentPeriod.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Update Portal Period
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-medium text-gray-500 truncate">Total Selected Employees</dt>
                                            <dd className="text-sm font-medium text-gray-900">{totalSelectedEmployees}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-medium text-gray-500 truncate">Employees Enrolled</dt>
                                            <dd className="text-sm font-medium text-gray-900">{totalEnrolledEmployees}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-3 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-medium text-gray-500 truncate">Enrollment Rate</dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {totalSelectedEmployees > 0 ? Math.round((totalEnrolledEmployees / totalSelectedEmployees) * 100) : 0}%
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portal Information */}
                    <div className="bg-white shadow rounded-lg mb-6">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h2 className="text-sm font-medium text-gray-900">Portal Information</h2>
                        </div>
                        <div className="px-4 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Portal Name</dt>
                                    <dd className="mt-1 text-xs text-gray-900">{enrollmentPeriod.enrolment_portal_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Portal Period</dt>
                                    <dd className="mt-1 text-xs text-gray-900">
                                        {formatDate(enrollmentPeriod.portal_start_date)} - {formatDate(enrollmentPeriod.portal_end_date)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Policy Period</dt>
                                    <dd className="mt-1 text-xs text-gray-900">
                                        {formatDate(enrollmentDetail.policy_start_date)} - {formatDate(enrollmentDetail.policy_end_date)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            enrollmentPeriod.creation_status >= 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {enrollmentPeriod.creation_status >= 2 ? 'Live' : 'Setting Up'}
                                        </span>
                                    </dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employee List */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <h2 className="text-sm font-medium text-gray-900">Selected Employees</h2>
                            <p className="mt-1 text-xs text-gray-600">
                                Employees selected for this enrollment portal and their current status
                            </p>
                        </div>

                        {/* Search and Controls */}
                        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                                            placeholder="Search employees..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label className="text-xs text-gray-700">Show:</label>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                            className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                        <span className="text-xs text-gray-700">entries</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-700">
                                    Showing {currentEmployees.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                                    {searchTerm && (
                                        <span className="ml-2 text-indigo-600">
                                            (filtered from {employees?.length || 0} total entries)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Gender
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Designation
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Grade
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentEmployees && currentEmployees.length > 0 ? (
                                        currentEmployees.map((employee, index) => (
                                            <tr key={employee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                                                    {employee.full_name || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {employee.employees_code || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {employee.email || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {employee.gender ? employee.gender.toUpperCase() : 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {employee.designation || 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                                    {employee.grade ? employee.grade.replace(' BAND', '') : 'N/A'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {getStatusBadge(employee.status)}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleDropdown(employee.id);
                                                            }}
                                                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                                                            title="More options"
                                                        >
                                                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                            </svg>
                                                        </button>

                                                        {/* Dropdown menu */}
                                                        {openDropdown === employee.id && (
                                                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                                                                <div className="py-1">
                                                                    <Link
                                                                        href={`/superadmin/fill-enrollment/${enrollmentPeriod.id}/employee/${employee.id}`}
                                                                        className="w-full block text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                                        onClick={() => setOpenDropdown(null)}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            Fill Enrolment
                                                                        </div>
                                                                    </Link>
                                                                    {employee.submit_status == 1 && (
                                                                        <button
                                                                            onClick={() => handleEditEnrolment(employee)}
                                                                            className="w-full block text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <svg className="w-3 h-3 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Edit Enrolment
                                                                            </div>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-xs text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {searchTerm ? (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        ) : (
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        )}
                                                    </svg>
                                                    <h3 className="text-xs font-medium text-gray-900 mb-1">
                                                        {searchTerm ? 'No employees found' : 'No employees selected'}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {searchTerm
                                                            ? `No employees match your search "${searchTerm}". Try adjusting your search terms.`
                                                            : 'No employees have been selected for this enrollment portal yet.'
                                                        }
                                                    </p>
                                                    {searchTerm && (
                                                        <button
                                                            onClick={() => setSearchTerm('')}
                                                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-500"
                                                        >
                                                            Clear search
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs text-gray-700">
                                                Page <span className="font-medium">{currentPage}</span> of{' '}
                                                <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {/* Page Numbers */}
                                                {(() => {
                                                    const pages = [];
                                                    const showPages = 5; // Show 5 page numbers max
                                                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                                                    let endPage = Math.min(totalPages, startPage + showPages - 1);

                                                    if (endPage - startPage + 1 < showPages) {
                                                        startPage = Math.max(1, endPage - showPages + 1);
                                                    }

                                                    for (let i = startPage; i <= endPage; i++) {
                                                        pages.push(
                                                            <button
                                                                key={i}
                                                                onClick={() => handlePageChange(i)}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-xs font-medium ${
                                                                    i === currentPage
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {i}
                                                            </button>
                                                        );
                                                    }
                                                    return pages;
                                                })()}

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success/Error Message */}
            {
                showMessage && (
                    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-xs ${showMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            {showMessage.type === 'success' ? (
                                <path d="M9 12l2 2l4-4" />
                            ) : (
                                <path d="M18 6L6 18M6 6l12 12" />
                            )}
                        </svg>
                        <span>{showMessage.text}</span>
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
