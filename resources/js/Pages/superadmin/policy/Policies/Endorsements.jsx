import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';

export default function Endorsements({ policies, corporates, filters = {} }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCorporate, setSelectedCorporate] = useState(filters.corporate_id || '');

    const handleSearch = (e) => {
        e && e.preventDefault();
        router.get(route('superadmin.policy.endorsements.index'), {
            search: searchTerm,
            corporate_id: selectedCorporate,
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-5">
                {flash?.success && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-green-100 text-green-800 border border-green-200">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-red-100 text-red-800 border border-red-200">
                        ✗ {flash.error}
                    </div>
                )}

                <div className="flex items-center justify-start border-b pb-3 border-gray-200 mt-3">
                    <h2 className="text-sm font-semibold text-gray-900">Policies ({policies.total})</h2>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-center w-full">
                        <select
                            value={selectedCorporate}
                            onChange={(e) => setSelectedCorporate(e.target.value)}
                            className="w-60 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                        >
                            <option value="">All Corporates</option>
                            {corporates.map((c) => (
                                <option key={c.comp_id || c.id} value={c.comp_id || c.id}>{c.comp_name || c.company_name}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by policy name or number..."
                            className="w-60 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                        />

                        <button type="submit" className="px-4 py-2 bg-[#934790] text-white text-xs rounded-lg hover:bg-[#7a3d7a]">Search</button>
                    </form>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mx-4">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">All Policies ({policies.total})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Policy</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Corporate</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {policies.data.length > 0 ? (
                                    policies.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 text-xs text-gray-700 bg-[#FBF7FF]">
                                                        <div className="font-medium">{p.policy_name || p.corporate_policy_name}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Policy No: {p.policy_number || '-'}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap bg-[#F8FAFC]">
                                                        {p.company?.comp_name || p.company?.company_name || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                        {formatDate(p.policy_start_date)} - {formatDate(p.policy_end_date)}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs whitespace-nowrap text-right">
                                                        <Link href={`/superadmin/policy/policies/${p.id}`} className="inline-block px-3 py-1 bg-[#934790] text-white rounded text-sm">View Endorsement</Link>
                                                    </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-xs text-gray-500">No policies found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {policies.links && policies.links.length > 0 && (
                    <div className="flex justify-center items-center mt-4 space-x-1">
                        {policies.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 text-xs border rounded-md ${link.active ? 'bg-[#934790] text-white border-[#934790]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
