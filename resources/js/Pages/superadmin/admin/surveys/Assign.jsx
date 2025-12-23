import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Assign({ survey, companies, assignments }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalData, setModalData] = useState({ comp_id: '', name: '', survey_start_date: '', survey_end_date: '', is_active: true });
    const [deleting, setDeleting] = useState(null);
    const dropdownRef = useRef(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Filtered assignments
    const filtered = (assignments || []).filter(a => {
        const text = (a.name || '') + ' ' + (a.company?.comp_name || '');
        return text.toLowerCase().includes(search.toLowerCase());
    });

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    }, [filtered.length, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    // Open create modal
    const openCreateModal = () => {
        setModalData({ comp_id: '', name: '', survey_start_date: '', survey_end_date: '', is_active: true });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Open edit modal
    const openEditModal = (assignment) => {
        setModalData({
            id: assignment.id,
            comp_id: assignment.company?.comp_id || '',
            name: assignment.name || '',
            survey_start_date: assignment.survey_start_date ? assignment.survey_start_date.split('T')[0] : '',
            survey_end_date: assignment.survey_end_date ? assignment.survey_end_date.split('T')[0] : '',
            is_active: !!assignment.is_active,
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Submit create
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await router.post(route('superadmin.admin.surveys.assign.store', survey.id), modalData);
            setIsModalOpen(false);
        } catch (err) {
            // handle errors if needed
        }
    };

    // Submit update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await router.put(route('superadmin.admin.surveys.assignment.update', modalData.id), modalData);
            setIsModalOpen(false);
        } catch (err) {
            // handle errors if needed
        }
    };

    const handleDelete = (assignmentId) => {
        if (confirm('Are you sure you want to remove this assignment?')) {
            setDeleting(assignmentId);
            router.delete(route('superadmin.admin.surveys.assignment.delete', assignmentId), {
                onFinish: () => setDeleting(null),
            });
        }
    };

    return (
        <SuperAdminLayout>
            <Head title={`Assign Companies - ${survey.name}`} />

            <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <Link href={route('superadmin.admin.surveys.index')} className="text-xs text-[#934790] hover:underline mb-2 inline-block font-medium">← Back to Surveys</Link>
                            <h1 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Assigned Surveys</h1>
                            <p className="text-xs text-gray-500 mt-1">All assignments for <span className="font-semibold">{survey.name}</span></p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={openCreateModal} className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[14px] md:text-sm transition-colors">
                                <span className="hidden md:inline">+ Create Assignment</span>
                                <span className="md:hidden">+</span>
                            </button>
                        </div>
                    </div>

                    {/* Search + rows selector */}
                    <div className="flex justify-between items-center gap-3 mb-5">
                        <div className="relative w-1/2">
                            <svg className={`absolute left-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ top: '50%', transform: 'translateY(-50%)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21L16.65 16.65" /></svg>
                            <input type="text" placeholder="Search assignments" value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-[10px] text-gray-500">Rows:</label>
                            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="text-xs rounded border-gray-300 px-2 py-1">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow">
                        <table className="w-full min-w-[600px] border-collapse">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <tr>
                                    <th className={`px-6 py-3 text-left text-[11px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Actions</th>
                                    <th className={`px-6 py-3 text-left text-[11px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Company</th>
                                    <th className={`px-6 py-3 text-left text-[11px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Assignment</th>
                                    <th className={`px-6 py-3 text-left text-[11px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Dates</th>
                                    <th className={`px-6 py-3 text-left text-[11px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>Status</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {currentItems.map((assignment) => (
                                    <tr key={assignment.id} className={darkMode ? 'hover:bg-gray-700 even:bg-gray-800/50' : 'hover:bg-gray-50 even:bg-gray-50/50'}>
                                        <td className="px-6 py-3 whitespace-nowrap text-xs font-medium">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEditModal(assignment)} className="text-[#934790] hover:text-[#6A0066] p-1 rounded-md transition-colors" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <Link href={route('superadmin.admin.surveys.reports') + '?assignment=' + assignment.id} className="text-blue-600 hover:text-blue-800 p-1 rounded-md transition-colors" title="Reports">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(assignment.id)} disabled={deleting === assignment.id} className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1 rounded-md transition-colors" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-3 whitespace-nowrap text-[11px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>{assignment.company?.comp_name || 'Unknown Company'}</td>
                                        <td className={`px-6 py-3 whitespace-nowrap text-[11px] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{assignment.name}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-[11px] text-gray-500">
                                            {new Date(assignment.survey_start_date).toLocaleDateString()} → {new Date(assignment.survey_end_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{assignment.is_active ? 'Active' : 'Inactive'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No assignments found.</div>
                        )}
                    </div>

                    {/* Mobile cards */}
                    <div className="block sm:hidden mt-4">
                        {currentItems.length === 0 ? (
                            <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No assignments found.</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {currentItems.map((assignment) => (
                                    <div key={assignment.id} className={`rounded-xl shadow border px-4 py-3 flex flex-row items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{assignment.company?.comp_name || 'Unknown Company'}</div>
                                                    <div className="text-xs text-gray-500">{assignment.name}</div>
                                                    <div className="text-[10px] text-gray-500 mt-2">{new Date(assignment.survey_start_date).toLocaleDateString()} → {new Date(assignment.survey_end_date).toLocaleDateString()}</div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-semibold ${assignment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{assignment.is_active ? 'Active' : 'Inactive'}</div>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => openEditModal(assignment)} className="text-[#934790] hover:text-[#6A0066] p-1" title="Edit">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <Link href={route('superadmin.admin.surveys.reports') + '?assignment=' + assignment.id} className="text-blue-600 hover:text-blue-800 p-1" title="Reports">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                        </Link>
                                                        <button onClick={() => handleDelete(assignment.id)} disabled={deleting === assignment.id} className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1" title="Delete">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between text-xs">
                        <div className="text-gray-600">Showing page {Math.min(currentPage, Math.max(1, Math.ceil(filtered.length / itemsPerPage)))} </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-2 py-1 bg-gray-100 rounded text-[10px]">Prev</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 bg-gray-100 rounded text-[10px]">Next</button>
                        </div>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? 'Edit Assignment' : 'Create Assignment'}</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500">&times;</button>
                                </div>
                                <form onSubmit={isEditMode ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Company <span className="text-red-500">*</span></label>
                                        <select value={modalData.comp_id} onChange={(e) => setModalData(d => ({ ...d, comp_id: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm">
                                            <option value="">Select a company</option>
                                            {companies.map(c => <option key={c.comp_id} value={c.comp_id}>{c.comp_name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Assignment Name</label>
                                        <input type="text" value={modalData.name} onChange={(e) => setModalData(d => ({ ...d, name: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Start Date</label>
                                        <input type="date" value={modalData.survey_start_date} onChange={(e) => setModalData(d => ({ ...d, survey_start_date: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">End Date</label>
                                        <input type="date" value={modalData.survey_end_date} onChange={(e) => setModalData(d => ({ ...d, survey_end_date: e.target.value }))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                                    </div>
                                    <div className="flex items-center gap-2 md:col-span-2">
                                        <input type="checkbox" checked={modalData.is_active} onChange={(e) => setModalData(d => ({ ...d, is_active: e.target.checked }))} className="h-4 w-4 text-[#934790]" />
                                        <label className="text-sm">Active</label>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-2 border rounded text-sm">Cancel</button>
                                        <button type="submit" className="px-3 py-2 bg-[#934790] text-white rounded text-sm">{isEditMode ? 'Update' : 'Create'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
