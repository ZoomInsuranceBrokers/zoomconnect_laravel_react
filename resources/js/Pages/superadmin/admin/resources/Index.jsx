import React, { useState, useMemo } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, Link } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Index({ resources = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('heading');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Filtered and sorted
    const filtered = useMemo(() => {
        const q = search ? search.toLowerCase() : '';
        let out = resources.filter(r => {
            if (!q) return true;
            return (r.heading && r.heading.toLowerCase().includes(q)) || (r.tags && r.tags.toLowerCase().includes(q)) || (r.category && r.category.toLowerCase().includes(q)) || (r.author && r.author.toLowerCase().includes(q));
        });

        const compare = (a, b) => {
            const av = a?.[sortKey] ?? '';
            const bv = b?.[sortKey] ?? '';
            // normalize to strings for comparison
            const as = String(av).toLowerCase();
            const bs = String(bv).toLowerCase();
            if (as < bs) return -1;
            if (as > bs) return 1;
            return 0;
        };

        out.sort((a, b) => {
            const res = compare(a, b);
            return sortOrder === 'asc' ? res : -res;
        });

        return out;
    }, [resources, search, sortKey, sortOrder]);

    // Pagination calculations
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    // ensure currentPage in range
    if (currentPage > totalPages) setCurrentPage(totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const paged = filtered.slice(startIndex, startIndex + perPage);

    return (
        <SuperAdminLayout>
            <Head title="Resources" />
            <div className={`p-4 h-full overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Resources</h1>
                        <div className="text-xs text-gray-500">Manage downloadable resources, articles and guides</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('superadmin.admin.resources.create')} className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-2">
                            <span className="text-lg leading-none">+</span>
                            Create
                        </Link>
                        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-[13px]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">Quick Help</span>
                        </button>
                    </div>
                </div>

                {/* Search bar in a card to give breathing room */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search resources"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className={`w-64 pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                            />
                            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21L16.65 16.65" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <label className="text-xs text-gray-500">Per page</label>
                            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 text-sm">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Empty state when no resources at all */}
                {resources.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center bg-white shadow-sm">
                        <div className="mx-auto w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-[#f6e6fb] to-[#f3d9f2] mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#934790]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No resources yet</h2>
                        <p className="text-gray-600 mb-4">Create a resource to share guides, downloads, and helpful materials with your organization.</p>
                        <div className="flex items-center justify-center gap-3">
                            <Link href={route('superadmin.admin.resources.create')} className="bg-[#934790] text-white px-4 py-2 rounded-md">Create your first resource</Link>
                            <Link href={route('superadmin.admin.resources.index')} className="text-sm text-gray-500 underline">Learn how resources work</Link>
                        </div>
                    </div>
                ) : (
                        <div className={`bg-white rounded-lg shadow overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <table className="w-full min-w-max">
                                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Actions</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Heading</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Category</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Tags</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Author</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {paged.map(r => (
                                        <tr key={r.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                                            <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                                <div className="flex items-center gap-1">
                                                    <Link href={route('superadmin.admin.resources.edit', r.id)} className="text-gray-400 hover:text-gray-600">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="text-[10px] font-medium text-gray-900">{r.heading}</div>
                                                <div className="text-[9px] text-gray-400">/{r.slug}</div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">{r.category || '-'}</td>
                                            <td className="px-3 py-2 text-[10px] text-gray-500">
                                                {r.tags ? r.tags.split(',').slice(0,2).map((t, i) => (
                                                    <span key={i} className="inline-flex px-2 py-1 text-[9px] font-semibold rounded bg-gray-100 text-gray-800 mr-1">{t.trim()}</span>
                                                )) : '-'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">{r.author || '-'}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <StatusPill status={r.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {total === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-[11px]">No resources found.</p>
                                </div>
                            )}

                            {/* Pagination controls */}
                            {total > 0 && (
                                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white rounded-b-lg">
                                    <div className="flex items-center text-[10px] text-gray-500">
                                        Showing {Math.min(startIndex+1, total)} to {Math.min(startIndex + perPage, total)} of {total} results
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                                            disabled={currentPage === 1}
                                            className="px-2 py-1 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <PageButtons current={currentPage} total={totalPages} onPage={p => setCurrentPage(p)} />
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                                            disabled={currentPage === totalPages}
                                            className="px-2 py-1 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

function StatusPill({ status }) {
    const statusMap = {
        draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
        published: { bg: 'bg-green-100', text: 'text-green-800' },
        archived: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    };
    const style = statusMap[status] || statusMap.draft;
    return <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${style.bg} ${style.text}`}>{status}</span>;
}

function PageButtons({ current, total, onPage }) {
    const buttons = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) buttons.push(i);

    return (
        <>
            {buttons.map(p => (
                <button
                    key={p}
                    onClick={() => onPage(p)}
                    className={`px-2 py-1 text-[10px] border rounded ${p === current ? 'bg-[#934790] text-white' : 'hover:bg-gray-50'}`}
                >
                    {p}
                </button>
            ))}
        </>
    );
}
