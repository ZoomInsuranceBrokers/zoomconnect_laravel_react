import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch, FiArrowLeft, FiCalendar, FiCheckCircle, FiXCircle,
    FiUsers, FiMail, FiPhone, FiX, FiActivity, FiEye
} from 'react-icons/fi';

export default function EnrollmentPortal({ user, enrollmentPeriod, enrollmentDetail, totalSelectedEmployees, totalEnrolledEmployees, employees }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredEmployees = employees?.filter(emp =>
        emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employees_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ENROLLED':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FiCheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                    </span>
                );
            case 'VISITED':
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiEye className="w-3 h-3 mr-1" />
                        Visited
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FiXCircle className="w-3 h-3 mr-1" />
                        Not Visited
                    </span>
                );
        }
    };

    const completionRate = totalSelectedEmployees > 0 
        ? Math.round((totalEnrolledEmployees / totalSelectedEmployees) * 100) 
        : 0;

    const visitedEmployees = employees?.filter(e => e.status === 'VISITED').length || 0;
    const notVisitedEmployees = totalSelectedEmployees - totalEnrolledEmployees - visitedEmployees;

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
                    href={`/company-user/enrollments/${enrollmentPeriod.enrolment_id}/details`}
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-purple-600 transition-colors mb-4"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Enrollment Details
                </Link>
                
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiCalendar className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{enrollmentPeriod.enrolment_portal_name}</h1>
                                <p className="text-xs text-gray-500 mt-1">{enrollmentDetail.corporate_enrolment_name}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                        <FiCalendar className="w-3 h-3" />
                                        {formatDate(enrollmentPeriod.portal_start_date)} - {formatDate(enrollmentPeriod.portal_end_date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {enrollmentPeriod.creation_status >= 2 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                                Live
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Setting Up
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Selected</p>
                            <p className="text-3xl font-light text-gray-900">{totalSelectedEmployees}</p>
                            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <FiActivity className="w-3 h-3" />
                                Employees
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
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Enrolled</p>
                            <p className="text-3xl font-light text-gray-900">{totalEnrolledEmployees}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                <FiCheckCircle className="w-3 h-3" />
                                Completed
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
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Visited</p>
                            <p className="text-3xl font-light text-gray-900">{visitedEmployees}</p>
                            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                                <FiEye className="w-3 h-3" />
                                In Progress
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <FiEye className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Completion</p>
                            <p className="text-3xl font-light text-gray-900">{completionRate}%</p>
                            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                                <FiActivity className="w-3 h-3" />
                                Success Rate
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <FiActivity className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 70-30 Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                
                {/* LEFT: 70% - Employees Table */}
                <div className="lg:col-span-7">
                    {/* Search Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search employees by name, code, or email..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedEmployees.length > 0 ? (
                                        paginatedEmployees.map((employee) => (
                                            <tr
                                                key={employee.id}
                                                onClick={() => setSelectedEmployee(employee)}
                                                className={`hover:bg-purple-50/50 transition-colors cursor-pointer ${
                                                    selectedEmployee?.id === employee.id ? 'bg-purple-50/70' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                                                            {employee.full_name?.charAt(0)?.toUpperCase() || 'E'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-900">{employee.full_name || 'N/A'}</p>
                                                            <p className="text-[10px] text-gray-500">{employee.designation || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-700">
                                                    {employee.employees_code || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        <p className="text-gray-700 text-[11px] flex items-center gap-1">
                                                            <FiMail className="w-3 h-3" />
                                                            {employee.email || 'N/A'}
                                                        </p>
                                                        <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5">
                                                            <FiPhone className="w-3 h-3" />
                                                            {employee.contact_number || 'N/A'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(employee.status)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-12 text-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <FiUsers className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 mb-1">No employees found</p>
                                                <p className="text-xs text-gray-500">Try adjusting your search</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="text-xs text-gray-600">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, idx) => (
                                        <button
                                            key={idx + 1}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={`px-3 py-1 text-xs rounded-lg ${
                                                currentPage === idx + 1
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                                    : 'border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: 30% - Selected Employee Details */}
                <div className="lg:col-span-3">
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm sticky top-6">
                        {selectedEmployee ? (
                            <>
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Employee Details</h3>
                                    <button
                                        onClick={() => setSelectedEmployee(null)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                        {selectedEmployee.full_name?.charAt(0)?.toUpperCase() || 'E'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{selectedEmployee.full_name}</p>
                                        <p className="text-xs text-gray-500">{selectedEmployee.employees_code}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Email</p>
                                        <p className="text-xs text-gray-900">{selectedEmployee.email || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Phone</p>
                                        <p className="text-xs text-gray-900">{selectedEmployee.contact_number || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Designation</p>
                                        <p className="text-xs text-gray-900">{selectedEmployee.designation || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Grade</p>
                                        <p className="text-xs text-gray-900">{selectedEmployee.grade || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Gender</p>
                                        <p className="text-xs text-gray-900">{selectedEmployee.gender || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Enrollment Status</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedEmployee.status)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiUsers className="w-8 h-8 text-purple-500" />
                                </div>
                                <h3 className="text-xs font-semibold text-gray-900 mb-1">No Employee Selected</h3>
                                <p className="text-xs text-gray-500">Click on an employee to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CompanyUserLayout>
    );
}
