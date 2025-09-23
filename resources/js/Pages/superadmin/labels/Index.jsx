import React, { useState, useEffect, useRef } from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../Context/ThemeContext';

export default function Index({ labels }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ label: '', remark: '', is_active: true });
    const [isEditMode, setIsEditMode] = useState(false);
    const [message, setMessage] = useState(null); // State for success/error messages
    const dropdownRef = useRef(null);

    // Calculate counts for filters
    const activeCount = labels.filter(label => label.is_active).length;
    const inactiveCount = labels.filter(label => !label.is_active).length;

    // Filter labels based on search and filter
    const filteredLabels = labels.filter(label => {
        const matchesSearch =
            label.label.toLowerCase().includes(search.toLowerCase()) ||
            (label.remark && label.remark.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter =
            filter === 'all' ||
            (filter === 'active' && label.is_active) ||
            (filter === 'inactive' && !label.is_active);
        return matchesSearch && matchesFilter;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Open modal for creating a new label
    const openCreateModal = () => {
        setModalData({ label: '', remark: '', is_active: true });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // Open modal for editing an existing label
    const openEditModal = (label) => {
        setModalData({ id: label.id, label: label.label, remark: label.remark });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // Handle modal form submission
    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                // Update label
                await router.put(route('corporate.labels.update', modalData.id), modalData);
                setMessage({ type: 'success', text: 'Client Label updated successfully' });
            } else {
                // Create new label
                await router.post(route('corporate.labels.store'), modalData);
                setMessage({ type: 'success', text: 'Client Label created successfully' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while saving the label' });
        }
        setIsModalOpen(false);
    };

    // Close message
    const closeMessage = () => {
        setMessage(null);
    };

    // Toggle active/inactive status
    const toggleStatus = async (label) => {
        try {
            await router.put(route('corporate.labels.update', label.id), {
                ...label,
                is_active: !label.is_active,
            });
            setMessage({ type: 'success', text: `Label ${label.is_active ? 'deactivated' : 'activated'} successfully` });
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while updating the label status' });
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Customer Labels" />
            <div className={`p-6 ${isModalOpen ? 'blur-sm' : ''}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Customer Labels
                    </h1>
                    <button
                        onClick={openCreateModal}
                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                    >
                        + Create Label
                    </button>
                </div>

                {/* Info Banner */}
                <div className={`rounded-lg p-3 mb-6 text-sm ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    Labels can be assigned to the client for better tagging.
                </div>

                {/* Search and Filter */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Records"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-4 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                darkMode
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                        <svg
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8"/>
                            <path d="M21 21L16.65 16.65"/>
                        </svg>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 ${
                                darkMode
                                    ? 'bg-gray-800 border-gray-700 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            Filter By: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div
                                className={`absolute mt-2 w-40 bg-white border rounded-lg shadow-lg ${
                                    darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                <button
                                    onClick={() => {
                                        setFilter('all');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold">All</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs">
                                        {labels.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('active');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold text-green-600">Active</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">
                                        {activeCount}
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('inactive');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold text-red-600">Inactive</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">
                                        {inactiveCount}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Labels Table */}
                <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Actions
                                </th>
                                <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Active
                                </th>
                                <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Label
                                </th>
                                <th className={`px-6 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Remark
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredLabels.map((label) => (
                                <tr key={label.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <td className="px-6 py-3 whitespace-nowrap text-xs font-medium">
                                        <button
                                            onClick={() => openEditModal(label)}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-4 h-4" // Reduced size
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={label.is_active}
                                                onChange={() => toggleStatus(label)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-10 h-5 rounded-full transition-colors duration-200 ${
                                                    label.is_active ? 'bg-[#934790]' : 'bg-gray-300'
                                                } flex items-center`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                                                        label.is_active ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className={`px-6 py-3 whitespace-nowrap text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {label.label}
                                    </td>
                                    <td className={`px-6 py-3 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {label.remark || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLabels.length === 0 && (
                        <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No labels found.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
                    <div className={`rounded-lg shadow-lg p-6 w-[600px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold">{isEditMode ? 'Edit Customer Label' : 'New Customer Label'}</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleModalSubmit}>
                            <div className="mb-4">
                                <label className="block text-xs font-medium mb-2">Label Name *</label>
                                <input
                                    type="text"
                                    value={modalData.label}
                                    onChange={(e) => setModalData({ ...modalData, label: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-medium mb-2">Remark</label>
                                <textarea
                                    value={modalData.remark}
                                    onChange={(e) => setModalData({ ...modalData, remark: e.target.value })}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                                />
                            </div>
                            {!isEditMode && (
                                <div className="mb-4">
                                    <label className="block text-xs font-medium mb-2">Status</label>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={modalData.is_active}
                                            onChange={(e) => setModalData({ ...modalData, is_active: e.target.checked })}
                                            className="h-4 w-4 text-[#934790] focus:ring-[#934790] border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-xs">{modalData.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-[#934790] hover:bg-[#6A0066] text-white px-4 py-2 rounded-lg transition-colors duration-200 text-xs"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success/Error Message */}
            {message && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {message.type === 'success' ? (
                            <path d="M9 12l2 2l4-4" />
                        ) : (
                            <path d="M18 6L6 18M6 6l12 12" />
                        )}
                    </svg>
                    <span>{message.text}</span>
                    <button
                        onClick={closeMessage}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>
            )}
        </SuperAdminLayout>
    );
}
