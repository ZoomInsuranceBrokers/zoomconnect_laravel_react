import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch as Search,
    FiFilter as Filter,
    FiDownload as Download,
} from 'react-icons/fi';

export default function Enrollments({ user, enrollments }) {
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <CompanyUserLayout user={user} pageTitle="Enrollments">
            {/* Search and Actions */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search enrollments..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Policy
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Enrollment Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Premium
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {enrollments?.data?.length > 0 ? (
                                enrollments.data.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                                    {enrollment.employee?.first_name?.[0]}{enrollment.employee?.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {enrollment.employee?.first_name} {enrollment.employee?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{enrollment.employee?.employee_code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {enrollment.policy?.policy_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {enrollment.enrollment_date || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            ₹{enrollment.premium_amount || '0'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                                                {enrollment.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-[#2e2838] hover:text-[#4d4355] font-medium">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No enrollments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {enrollments?.data?.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {enrollments.from} to {enrollments.to} of {enrollments.total} enrollments
                        </div>
                        <div className="flex gap-2">
                            {enrollments.links?.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-lg text-sm ${
                                        link.active 
                                            ? 'bg-[#2e2838] text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CompanyUserLayout>
    );
}
