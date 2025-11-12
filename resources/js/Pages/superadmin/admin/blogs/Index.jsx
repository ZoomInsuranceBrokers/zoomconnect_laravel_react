import React, { useState, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Index({ blogs = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ show: false, blog: null });
    const dropdownRef = useRef(null);

    const activeCount = blogs.filter(b => b.is_active).length;
    const inactiveCount = blogs.length - activeCount;

    const filtered = blogs.filter(b => {
        const matchesSearch = !search || (b.blog_title && b.blog_title.toLowerCase().includes(search.toLowerCase())) || (b.blog_author && b.blog_author.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === 'all' || (filter === 'active' && b.is_active) || (filter === 'inactive' && !b.is_active);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = (blog) => {
        setDeleteModal({ show: true, blog });
    };

    const confirmDelete = () => {
        if (deleteModal.blog) {
            router.delete(route('superadmin.admin.blogs.destroy', deleteModal.blog.id), {
                onSuccess: () => {
                    setDeleteModal({ show: false, blog: null });
                }
            });
        }
    };

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

                <div className={`bg-white rounded-lg shadow overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <table className="w-full min-w-max">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Actions</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Title</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Author</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Date</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Status</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filtered.map((b) => (
                                <tr key={b.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <Link href={route('superadmin.admin.blogs.edit', b.id)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(b)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="text-[10px] font-medium text-gray-900">{b.blog_title}</div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">{b.blog_author || '-'}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">{b.blog_date ? new Date(b.blog_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {b.is_active ? (
                                            <span className="inline-flex px-2 py-1 text-[9px] font-semibold rounded bg-green-100 text-green-800">Active</span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-[9px] font-semibold rounded bg-red-100 text-red-800">Inactive</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-[11px]">No blogs found.</p>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                            <h3 className="text-lg font-semibold mb-4">Delete Blog</h3>
                            <p className="text-sm mb-6">
                                Are you sure you want to delete "<strong>{deleteModal.blog?.blog_title}</strong>"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteModal({ show: false, blog: null })}
                                    className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
