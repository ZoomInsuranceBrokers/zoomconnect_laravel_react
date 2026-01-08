import React, { useState } from 'react';
import axios from 'axios';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Link } from '@inertiajs/react';

export default function Index({ cdAccounts = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [filter, setFilter] = useState(filters.status || "all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [accounts, setAccounts] = useState(cdAccounts);

    // Filter and search logic
    const filteredAccounts = accounts.filter(cd => {
        const matchesSearch = cd.company_name?.toLowerCase().includes(search.toLowerCase()) || cd.cd_ac_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter === "all" || (filter === "active" && cd.status === 1) || (filter === "inactive" && cd.status === 0);
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const currentItems = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Toggle status handler
    const handleToggleStatus = async (cd) => {
        try {
            const response = await axios.put(`/superadmin/policy/cd-accounts/${cd.id}/toggle-active`);
            if (response.data.success) {
                setAccounts(prev => prev.map(item => item.id === cd.id ? { ...item, status: response.data.status } : item));
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    // Filter counts
    const activeCount = accounts.filter(cd => cd.status === 1).length;
    const inactiveCount = accounts.filter(cd => cd.status === 0).length;

    // Dropdown filter state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    React.useEffect(() => {
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

    // Search handler
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };


    return (
        <SuperAdminLayout>
            <div className="p-4 h-full overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/superadmin/policy/cd-accounts/create"
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1 rounded-lg text-[10px] font-medium flex items-center justify-center"
                        >
                            <span className="block md:hidden text-xl leading-none">+</span>
                            <span className="hidden md:inline">+ Add CD Account</span>
                        </Link>
                        <h1 className="text-base md:text-lg font-bold text-gray-900">CD Accounts</h1>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-row md:justify-between md:items-center gap-3 mb-5">
                    <div className="relative flex items-center w-1/2">
                        <svg
                            className="absolute left-3 w-5 h-5 text-gray-500"
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
                            placeholder="Search CD Accounts"
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 h-10 border rounded-lg text-[10px] focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm placeholder:text-[10px] bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 h-10 border rounded-lg text-[10px] font-medium shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#934790] bg-white border-gray-300 text-gray-900 hover:bg-gray-100"
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
                                className="absolute right-0 mt-2 w-40 border rounded-lg shadow-lg z-20 bg-white border-gray-300 text-gray-900"
                            >
                                <button
                                    onClick={() => {
                                        setFilter('all');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold">All</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-xs">{accounts.length}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('active');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold text-green-600">Active</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">{activeCount}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter('inactive');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    <span className="text-xs font-semibold text-red-600">Inactive</span>
                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-xs">{inactiveCount}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table layout for desktop */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                        </svg>
                                        Actions
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Active
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        Corporate
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        CD A/C Name
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        CD A/C No.
                                    </span>
                                </th>
                                <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Insurer
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.length > 0 ? currentItems.map(cd => (
                                <tr key={cd.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                                    <td className="px-6 py-3 whitespace-nowrap text-[10px] font-medium flex justify-center items-center">
                                        <Link href={`/superadmin/policy/cd-accounts/${cd.id}/edit`}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                                            title="Edit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </Link>
                                        <Link href={`/superadmin/policy/cd-accounts/${cd.id}/cd-details`}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100"
                                            title="Manage CD Account">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="3" />
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 11 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                            </svg>
                                        </Link>
                                    </td>

                                    <td className="px-6 py-3 whitespace-nowrap text-[10px]">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={cd.status === 1}
                                                onChange={() => handleToggleStatus(cd)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-10 h-5 rounded-full transition-colors duration-200 ${cd.status === 1 ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}
                                            >
                                                <div
                                                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${cd.status === 1 ? 'translate-x-5' : 'translate-x-0'}`}
                                                ></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-[10px] font-medium text-gray-900">{cd.company_name || '-'}</td>
                                    <td className="px-6 py-3 text-[10px] text-gray-500 max-w-[250px] truncate">{cd.cd_ac_name || '-'}</td>
                                    <td className="px-6 py-3 text-[10px] text-gray-500 max-w-[250px] truncate">{cd.cd_ac_no || '-'}</td>
                                    <td className="px-6 py-3 text-[10px] text-gray-500 max-w-[250px] truncate">{cd.insurance_name || '-'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-[10px] text-gray-500">No CD Accounts found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredAccounts.length > 0 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-4 py-2 text-[10px] font-medium rounded-md ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 text-[10px] font-medium rounded-md ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] text-gray-500">
                                    Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredAccounts.length)}</span> to{' '}
                                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAccounts.length)}</span> of{' '}
                                    <span className="font-medium">{filteredAccounts.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    {/* Previous Page Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white text-[11px] md:text-xs font-medium ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-500 hover:bg-gray-50'
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
                                            className={`relative inline-flex items-center px-4 py-2 border text-[10px] font-medium ${currentPage === i + 1
                                                ? 'bg-[#934790] text-white z-10'
                                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    {/* Next Page Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border bg-white text-[11px] md:text-xs font-medium ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-500 hover:bg-gray-50'
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

                {/* Card layout for mobile */}
                <div className="sm:hidden">
                    {currentItems.length === 0 ? (
                        <div className="text-center py-6 text-xs text-gray-500">No CD Accounts found.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {currentItems.map(cd => (
                                <div
                                    key={cd.id}
                                    className="rounded-xl shadow border px-4 py-3 flex flex-row items-center gap-2 bg-white border-gray-200"
                                >
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={cd.status === 1}
                                            onChange={() => handleToggleStatus(cd)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-7 h-4 rounded-full transition-colors duration-200 ${cd.status === 1 ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center`}
                                        >
                                            <div
                                                className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ${cd.status === 1 ? 'translate-x-4' : 'translate-x-0'}`}
                                            ></div>
                                        </div>
                                    </label>
                                    <span className="flex-1 text-[10px] font-medium text-gray-900">{cd.company_name || '-'}</span>
                                    <div className="flex justify-center items-center w-8">
                                        <Link
                                            href={`/superadmin/policy/cd-accounts/${cd.id}/edit`}
                                            className="text-[#934790] hover:text-[#6A0066] transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 ml-2"
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}