import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function PushNotifications({ user, notifications }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = (notifications || []).filter((n) => {
        if (!searchTerm) return true;
        return (
            (n.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.body || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
        setCurrentPage(1);
    }, [filtered.length, itemsPerPage]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    return (
        <SuperAdminLayout user={user}>
            <Head title="Push Notifications" />

            <div className="p-4 h-full overflow-y-auto bg-gray-50">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-base font-semibold text-gray-900">Push Notifications</h1>
                        <p className="text-[11px] text-gray-500">Create and monitor notifications sent to employees.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-64">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Notifications"
                                    className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-[11px] bg-white border-gray-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="absolute left-2.5 top-2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21L16.65 16.65" />
                                </svg>
                            </div>
                        </div>

                        <Link
                            href={route('superadmin.marketing.push-notifications.create')}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[10px] font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                            New Notification
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden border">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Notification</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Recipients</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {currentItems.map((n, idx) => (
                                    <tr key={n.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                                        <td className="px-4 py-3 align-top">
                                            <div className="text-sm font-medium text-gray-900">{n.title}</div>
                                            <div className="text-[11px] text-gray-500 mt-1 max-w-xl truncate">{n.body || '-'}</div>

                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">{n.sent_count || 0} sent</span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">{n.failed_count || 0} failed</span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">{n.total_recipients || 0} total</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 align-top">
                                            <div>
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold ${n.status === 'completed' ? 'bg-green-50 text-green-800' : n.status === 'processing' ? 'bg-yellow-50 text-yellow-800' : 'bg-gray-50 text-gray-700'}`}>
                                                    {n.status === 'completed' ? (
                                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd"/></svg>
                                                    ) : null}
                                                    <span>{n.status || 'pending'}</span>
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 align-top text-[11px] text-gray-500">{new Date(n.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination controls and per-page selector */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                        <div className="flex items-center gap-3 text-[11px] text-gray-700">
                            <span>Show</span>
                            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="border rounded px-2 py-1 text-[11px]">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>entries</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-2 py-1 border rounded text-[11px] bg-white">First</button>
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-2 py-1 border rounded text-[11px] bg-white">Prev</button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((_, i) => {
                                    const page = i + Math.max(1, currentPage - 2);
                                    return (
                                        <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded ${page === currentPage ? 'bg-[#934790] text-white' : 'bg-white text-gray-700 border'}`}>{page}</button>
                                    );
                                })}
                            </div>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-2 py-1 border rounded text-[11px] bg-white">Next</button>
                            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded text-[11px] bg-white">Last</button>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
