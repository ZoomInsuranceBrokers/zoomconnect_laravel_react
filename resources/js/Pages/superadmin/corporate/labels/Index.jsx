import React, { useState, useEffect, useRef } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLabels.slice(indexOfFirstItem, indexOfLastItem);


    // Update total pages when filtered labels or itemsPerPage change
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredLabels.length / itemsPerPage)));
    }, [filteredLabels.length, itemsPerPage]);

    // Only reset currentPage when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter]);


    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredLabels.length / itemsPerPage)));
    }, [filteredLabels.length, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter]);

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
            <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isModalOpen ? 'blur-sm' : ''}`}> 
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h1 className={`text-base md:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Customer Labels
                    </h1>
                    <button
                        onClick={openCreateModal}
                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[16px] md:text-sm transition-colors duration-200 flex items-center justify-center"
                        aria-label="Create Label"
                    >
                        <span className="block md:hidden text-xl leading-none">+</span>
                        <span className="hidden md:inline">+ Create Label</span>
                    </button>
                </div>

                {/* Info Banner */}
                <div className={`rounded-lg p-3 mb-4 text-[10px] md:text-xs flex items-center ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Labels can be assigned to the client for better tagging.</span>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-row md:justify-between md:items-center gap-3 mb-5">

                    <div className="relative flex items-center w-1/2">
                        <svg
                            className={`absolute left-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            style={{ top: '50%', transform: 'translateY(-50%)' }}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21L16.65 16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search Records"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm placeholder:text-xs md:placeholder:text-sm ${darkMode
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                        />
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2 px-3 h-10 border rounded-lg text-xs md:text-sm font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#934790] ${darkMode
                                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <span className="whitespace-nowrap">Filter By: <span className="font-semibold">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span></span>
                            <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div
                                className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
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

                {/* Table for desktop, cards for mobile */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                        Actions
                                    </span>
                                </th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Active
                                    </span>
                                </th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                        </svg>
                                        Label
                                    </span>
                                </th>
                                <th className={`px-6 py-3 text-left text-[11px] md:text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300 border-b border-gray-600' : 'text-gray-500 border-b border-gray-200'}`}>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Remark
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {currentItems.map((label) => (
                                <tr key={label.id} className={darkMode ? 'hover:bg-gray-700 even:bg-gray-800/50' : 'hover:bg-gray-50 even:bg-gray-50/50'}>
                                    <td className="px-6 py-3 whitespace-nowrap text-xs font-medium">
                                        <button
                                            onClick={() => openEditModal(label)}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <svg
                                                className="w-4 h-4"
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
                                                className={`w-10 h-5 rounded-full transition-colors duration-200 ${label.is_active ? 'bg-[#934790]' : 'bg-gray-300'
                                                    } flex items-center`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${label.is_active ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className={`px-6 py-3 whitespace-nowrap text-[11px] md:text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {label.label}
                                    </td>
                                    <td className={`px-6 py-3 text-[11px] md:text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} max-w-[250px] truncate`}>
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

                {/* Card layout for mobile */}
                <div className="block sm:hidden">
                    {currentItems.length === 0 ? (
                        <div className={`text-center py-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No labels found.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {currentItems.map((label) => (
                                <div
                                    key={label.id}
                                    className={`rounded-xl shadow border px-4 py-3 flex flex-row items-center gap-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                                >
                                    {/* Active toggle */}
                                    <div className="flex items-center gap-2">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={label.is_active}
                                                onChange={() => toggleStatus(label)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-7 h-4 rounded-full transition-colors duration-200 ${label.is_active ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}
                                            >
                                                <div
                                                    className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ${label.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                                ></div>
                                            </div>
                                        </label>
                                    </div>
                                    {/* Label name */}
                                    <div className="flex-1 flex items-center gap-2">
                                        <span className={`text-[12px] font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{label.label}</span>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center justify-end ml-auto">
                                        <button
                                            onClick={() => openEditModal(label)}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                            aria-label="Edit Label"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {filteredLabels.length > 0 && (
                    <div className={`px-6 py-3 flex items-center justify-between  ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => {
                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                }}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 text-[11px] md:text-xs font-medium rounded-md ${currentPage === 1
                                    ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]`
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 text-[11px] md:text-xs font-medium rounded-md ${currentPage === totalPages
                                    ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]`
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredLabels.length)}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredLabels.length)}</span> of{' '}
                                    <span className="font-medium">{filteredLabels.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {/* Previous Page Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
                                            } text-[11px] md:text-xs font-medium ${currentPage === 1
                                                ? `${darkMode ? 'text-gray-500' : 'text-gray-400'} cursor-not-allowed`
                                                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'}`
                                            }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border ${darkMode ? 'border-gray-700' : 'border-gray-300'
                                                } text-[11px] md:text-xs font-medium ${currentPage === i + 1
                                                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-[#934790] text-white'} z-10`
                                                    : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    {/* Next Page Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
                                            } text-[11px] md:text-xs font-medium ${currentPage === totalPages
                                                ? `${darkMode ? 'text-gray-500' : 'text-gray-400'} cursor-not-allowed`
                                                : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-50'}`
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal rendered outside main content */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-gray-900">
                        <div className={`rounded-2xl shadow-xl p-6 max-w-md w-[90%] sm:w-[500px] ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xs md:text-sm font-bold">{isEditMode ? 'Edit Customer Label' : 'New Customer Label'}</h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700 text-[20px] font-bold focus:outline-none"
                                    >
                                        &times;
                                    </button>
                                </div>
                                {/* <div className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}></div> */}
                            </div>


                            {/* Pro Tip Box */}
                            <div className={`my-3 p-2 rounded-xl text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <div className="flex items-center gap-2 w-full flex-wrap whitespace-normal break-words">
                                    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" className="text-yellow-400" />
                                        <path strokeLinecap="round" d="M12 2v2m0 16v2m10-8h-2M4 12H2m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
                                    </svg>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-1">
                                        <span className="font-semibold text-gray-700 dark:text-gray-200 mr-1">Pro tip:</span>
                                        <span className="text-gray-500 font-normal">Press Tab to move to next field</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleModalSubmit}>
                                <div className="mb-4">
                                    <label className="block text-[10px] md:text-xs font-medium mb-2">Label Name *</label>
                                    <input
                                        type="text"
                                        value={modalData.label}
                                        onChange={(e) => setModalData({ ...modalData, label: e.target.value })}
                                        className={`w-full px-3 py-2 border text-sm rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[10px] md:text-xs font-medium mb-2">Remark</label>
                                    <textarea
                                        value={modalData.remark}
                                        onChange={(e) => setModalData({ ...modalData, remark: e.target.value })}
                                        rows={2}
                                        className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-5 py-2 rounded-lg transition-colors duration-200 text-[10px] md:text-xs font-medium"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Success/Error Message */}
            {
                message && (
                    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 text-[10px] md:text-xs ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                )
            }
        </SuperAdminLayout >
    );
}
