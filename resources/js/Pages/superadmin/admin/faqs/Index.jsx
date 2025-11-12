import React, { useState, useEffect, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Index({ faqs = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ faq_title: '', faq_description: '', is_active: true });
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState(null);
    const dropdownRef = useRef(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Counts
    const activeCount = faqs.filter(f => f.is_active).length;
    const inactiveCount = faqs.filter(f => !f.is_active).length;

    const filteredFaqs = faqs.filter(f => {
        const matchesSearch =
            f.faq_title.toLowerCase().includes(search.toLowerCase()) ||
            (f.faq_description && f.faq_description.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && f.is_active) ||
            (filter === 'inactive' && !f.is_active);
        return matchesSearch && matchesFilter;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredFaqs.length / itemsPerPage)));
        setCurrentPage(1);
    }, [filteredFaqs.length, itemsPerPage, search, filter]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openCreateModal = () => {
        setModalData({ faq_title: '', faq_description: '', is_active: true });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (faq) => {
        setModalData({ id: faq.id, faq_title: faq.faq_title, faq_description: faq.faq_description, is_active: faq.is_active });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await router.put(route('superadmin.admin.faqs.update', modalData.id), modalData);
                setMessage({ type: 'success', text: 'FAQ updated successfully' });
            } else {
                await router.post(route('superadmin.admin.faqs.store'), modalData);
                setMessage({ type: 'success', text: 'FAQ created successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving the FAQ' });
        }
        setIsModalOpen(false);
    };

    const toggleStatus = async (faq) => {
        try {
            await router.put(route('superadmin.admin.faqs.update', faq.id), { ...faq, is_active: !faq.is_active });
            setMessage({ type: 'success', text: `FAQ ${faq.is_active ? 'deactivated' : 'activated'} successfully` });
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while updating the FAQ status' });
        }
    };

    const handleDelete = async (faq) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await router.delete(route('superadmin.admin.faqs.destroy', faq.id));
            setMessage({ type: 'success', text: 'FAQ deleted successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while deleting the FAQ' });
        }
    };

    const closeMessage = () => setMessage(null);

    return (
        <SuperAdminLayout>
            <Head title="Admin FAQs" />
            <div className={`p-4 ${isModalOpen ? 'blur-sm' : ''}`}>
                <div className="flex justify-between items-center mb-3">
                    <h1 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>FAQs</h1>
                    <button
                        onClick={openCreateModal}
                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[16px] md:text-sm transition-colors duration-200 flex items-center justify-center"
                        aria-label="Create FAQ"
                    >
                        <span className="block md:hidden text-xl leading-none">+</span>
                        <span className="hidden md:inline">+ Create FAQ</span>
                    </button>
                </div>

                <div className={`rounded-lg p-3 mb-4 text-[10px] md:text-xs flex items-center ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Manage frequently asked questions shown in the app.</span>
                </div>

                <div className="flex flex-row md:justify-between md:items-center gap-3 mb-5">
                    <div className="relative flex items-center w-1/2">
                        <svg className={`absolute left-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21L16.65 16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Records"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm placeholder:text-xs md:placeholder:text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2 px-3 h-10 border rounded-lg text-xs md:text-sm font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#934790] ${darkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                        >
                            <span className="whitespace-nowrap">Filter By: <span className="font-semibold">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span></span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                <button onClick={() => { setFilter('all'); setIsDropdownOpen(false); }} className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                                    <span className="text-xs font-semibold">All</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs">{faqs.length}</span>
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
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Status</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Question</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">Answer</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {currentItems.map((faq) => (
                                <tr key={faq.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => openEditModal(faq)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(faq)} className="text-gray-400 hover:text-red-600">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {faq.is_active ? (
                                            <span className="inline-flex px-2 py-1 text-[9px] font-semibold rounded bg-green-100 text-green-800">Active</span>
                                        ) : (
                                            <span className="inline-flex px-2 py-1 text-[9px] font-semibold rounded bg-red-100 text-red-800">Inactive</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="text-[10px] font-medium text-gray-900">{faq.faq_title}</div>
                                    </td>
                                    <td className="px-3 py-2 text-[10px] text-gray-500 max-w-[250px] truncate">{faq.faq_description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredFaqs.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-[11px]">No FAQs found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination controls */}
                {filteredFaqs.length > 0 && (
                    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex items-center text-[10px] text-gray-500">
                            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredFaqs.length)} to {Math.min(currentPage * itemsPerPage, filteredFaqs.length)} of {filteredFaqs.length} results
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-2 py-1 text-[10px] border rounded ${currentPage === i + 1 ? 'bg-[#934790] text-white' : 'hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-[10px] border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-gray-900">
                    <div className={`rounded-2xl shadow-xl p-6 max-w-md w-[90%] sm:w-[500px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xs md:text-sm font-bold">{isEditMode ? 'Edit FAQ' : 'New FAQ'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-[20px] font-bold">&times;</button>
                        </div>
                        <form onSubmit={handleModalSubmit}>
                            <div className="mb-4">
                                <label className="block text-[10px] md:text-xs font-medium mb-2">Question *</label>
                                <input type="text" value={modalData.faq_title} onChange={(e) => setModalData({ ...modalData, faq_title: e.target.value })} className={`w-full px-3 py-2 border text-sm rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-[10px] md:text-xs font-medium mb-2">Answer</label>
                                <textarea value={modalData.faq_description} onChange={(e) => setModalData({ ...modalData, faq_description: e.target.value })} rows={4} className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={modalData.is_active} onChange={(e) => setModalData({ ...modalData, is_active: e.target.checked })} className="sr-only" />
                                    <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${modalData.is_active ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${modalData.is_active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>
                                <span className="text-xs">Active</span>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-[#934790] hover:bg-[#6A0066] text-white px-5 py-2 rounded-lg transition-colors duration-200 text-[10px] md:text-xs font-medium">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Message */}
            {message && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-[10px] md:text-xs ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{message.type === 'success' ? <path d="M9 12l2 2l4-4" /> : <path d="M18 6L6 18M6 6l12 12" />}</svg>
                    <span>{message.text}</span>
                    <button onClick={closeMessage} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
            )}
        </SuperAdminLayout>
    );
}
