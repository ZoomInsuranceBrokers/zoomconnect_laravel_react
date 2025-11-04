import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function Index({ policies, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/superadmin/policy/policies', {
            search: searchTerm,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = () => {
        router.get('/superadmin/policy/policies', {
            search: searchTerm,
            status: selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Policies</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage insurance policies and enrollment configurations.
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by policy name, corporate policy name, policy number..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                            />
                        </div>
                        <div className="min-w-[150px]">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleFilterChange();
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#934790] text-white rounded-md hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Policies Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Policies ({policies.total})</h3>
                        <Link
                            href="/superadmin/policy/policies/create"
                            className="px-4 py-2 bg-[#934790] text-white rounded-md hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2"
                        >
                            Create New Policy
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Policy Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Insurance Provider
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Period
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {policies.data.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {policy.policy_name || policy.corporate_policy_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {policy.policy_number && `Policy #: ${policy.policy_number}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {policy.insurance?.insurance_name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {policy.policy_start_date && formatDate(policy.policy_start_date)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {policy.policy_end_date && `to ${formatDate(policy.policy_end_date)}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                policy.is_active === 1
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {policy.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                href={`/superadmin/policy/policies/${policy.id}`}
                                                className="text-[#934790] hover:text-[#7a3d7a]"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/superadmin/policy/policies/${policy.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {policies.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {policies.from} to {policies.to} of {policies.total} results
                            </div>
                            <div className="flex space-x-1">
                                {policies.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-1 text-sm border rounded ${
                                            link.active
                                                ? 'bg-[#934790] text-white border-[#934790]'
                                                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
