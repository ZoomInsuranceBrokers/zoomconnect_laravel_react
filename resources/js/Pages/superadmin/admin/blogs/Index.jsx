import React, { useState, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, Link } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Index({ blogs = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const activeCount = blogs.filter(b => b.is_active).length;
    const inactiveCount = blogs.length - activeCount;

    const filtered = blogs.filter(b => {
        const matchesSearch = !search || (b.blog_title && b.blog_title.toLowerCase().includes(search.toLowerCase())) || (b.blog_author && b.blog_author.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'all' || (filter === 'active' && b.is_active) || (filter === 'inactive' && !b.is_active);
        return matchesSearch && matchesFilter;
    });

    return (
        <SuperAdminLayout>
            <Head title="Admin Blogs" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h1 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Blogs</h1>
                    <Link href={route('superadmin.admin.blogs.create')} className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[14px] flex items-center gap-2">
                        <span className="hidden md:inline">+ Create Blog</span>
                        <span className="md:hidden">+</span>
                    </Link>
                </div>

                <div className={`rounded-lg p-3 mb-4 text-[10px] md:text-xs flex items-center ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M19 3v4M4 7h16M4 11h16M4 15h16M4 19h16" />
                    </svg>
                    <span>Write SEO friendly blogs and manage them here.</span>
                </div>

                <div className="flex flex-row md:justify-between md:items-center gap-3 mb-5">
                    <div className="relative flex items-center w-1/2">
                        <svg className={`absolute left-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21L16.65 16.65" /></svg>
                        <input type="text" placeholder="Search Blogs" value={search} onChange={e => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex items-center gap-2 px-3 h-10 border rounded-lg text-xs md:text-sm font-medium shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                            <span className="whitespace-nowrap">Filter: <span className="font-semibold">{filter}</span></span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                <button onClick={() => { setFilter('all'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                                    <span className="text-xs font-semibold">All</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs">{blogs.length}</span>
                                </button>
                                <button onClick={() => { setFilter('active'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                                    <span className="text-xs font-semibold text-green-600">Active</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">{activeCount}</span>
                                </button>
                                <button onClick={() => { setFilter('inactive'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                                    <span className="text-xs font-semibold text-red-600">Inactive</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">{inactiveCount}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Title</th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Author</th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Date</th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Active</th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filtered.map((b) => (
                                <tr key={b.id} className={darkMode ? 'hover:bg-gray-700 even:bg-gray-800/50' : 'hover:bg-gray-50 even:bg-gray-50/50'}>
                                    <td className={`px-6 py-3 whitespace-nowrap text-[11px] md:text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.blog_title}</td>
                                    <td className={`px-6 py-3 whitespace-nowrap text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{b.blog_author || '-'}</td>
                                    <td className={`px-6 py-3 whitespace-nowrap text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{b.blog_date ? new Date(b.blog_date).toLocaleString() : '-'}</td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-[11px] ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-xs font-medium">
                                        <Link href={route('superadmin.admin.blogs.edit', b.id)} className="text-[#934790] hover:text-[#6A0066] p-1 rounded-md">
                                            <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No blogs found.</div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
