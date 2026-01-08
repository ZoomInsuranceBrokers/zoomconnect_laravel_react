import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../../Context/ThemeContext";
import { Link } from "@inertiajs/react";

export default function Index({ tpas }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Filter TPAs based on search and filters
    const filteredTpas = tpas.filter((tpa) => {
        const matchesSearch =
            tpa.tpa_company_name.toLowerCase().includes(search.toLowerCase()) ||
            (tpa.city_name &&
                tpa.city_name.toLowerCase().includes(search.toLowerCase())) ||
            (tpa.state_name &&
                tpa.state_name.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && tpa.status === 1) ||
            (statusFilter === "inactive" && tpa.status === 0);

        return matchesSearch && matchesStatus;
    });

    // Calculate pagination
    useEffect(() => {
        const pages = Math.ceil(filteredTpas.length / itemsPerPage);
        setTotalPages(pages);
        if (currentPage > pages && pages > 0) {
            setCurrentPage(pages);
        }
    }, [filteredTpas.length, itemsPerPage, currentPage]);

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTpas.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleToggleStatus = (id, currentStatus) => {
        if (confirm(`Are you sure you want to ${currentStatus === 1 ? 'deactivate' : 'activate'} this TPA company?`)) {
            router.put(route('superadmin.policy.tpa.toggle-status', id), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenActionsDropdown(null);
                },
            });
        }
    };

    const handleEdit = (id) => {
        router.get(route('superadmin.policy.tpa.edit', id));
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this TPA company?')) {
            router.delete(route('superadmin.policy.tpa.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenActionsDropdown(null);
                },
            });
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="TPA Companies" />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("superadmin.policy.tpa.create")}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                        >
                            <span>+</span>
                            Add TPA Company
                        </Link>
                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-[11px]">
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Quick Help
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Records"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-48 pl-8 pr-3 py-1.5 border rounded-lg text-[10px] focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                darkMode
                                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            }`}
                        />
                        <svg
                            className="absolute left-2.5 top-2 w-3 h-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21L16.65 16.65" />
                        </svg>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] ${
                            statusFilter === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="all">All Status</option>
                    </select>
                </div>

                {/* Table */}
                <div
                    className={`bg-white rounded-lg shadow overflow-x-auto ${
                        darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                    <table className="w-full min-w-max">
                        <thead
                            className={`${
                                darkMode ? "bg-gray-700" : "bg-gray-50"
                            } border-b`}
                        >
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Actions
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    TPA Company Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                    Address
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    City
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    State
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Pincode
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Table Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                            {currentItems.map((tpa) => (
                                <tr
                                    key={tpa.id}
                                    className={`${
                                        darkMode
                                            ? "hover:bg-gray-700"
                                            : "hover:bg-gray-50"
                                    } cursor-pointer`}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <div className="relative">
                                                <button
                                                    className="text-gray-400 hover:text-gray-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionsDropdown(
                                                            openActionsDropdown === tpa.id
                                                                ? null
                                                                : tpa.id
                                                        );
                                                    }}
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                        />
                                                    </svg>
                                                </button>
                                                {openActionsDropdown === tpa.id && (
                                                    <div
                                                        className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(tpa.id);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3 inline-block mr-2"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                    />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStatus(tpa.id, tpa.status);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3 inline-block mr-2"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                                                    />
                                                                </svg>
                                                                {tpa.status === 1 ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(tpa.id);
                                                                }}
                                                                className="block w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50"
                                                            >
                                                                <svg
                                                                    className="w-3 h-3 inline-block mr-2"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {tpa.tpa_comp_icon_url && (
                                                <img
                                                    src={`/${tpa.tpa_comp_icon_url}`}
                                                    alt={tpa.tpa_company_name}
                                                    className="w-6 h-6 rounded object-cover"
                                                />
                                            )}
                                            <div className="text-[10px] font-medium text-gray-900">
                                                {tpa.tpa_company_name}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-[10px] text-gray-500">
                                        {tpa.address}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {tpa.city_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {tpa.state_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {tpa.pincode || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {tpa.tpa_table_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                            tpa.status === 1
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {tpa.status === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(tpa.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredTpas.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-2 bg-white border-t">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-[10px] font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-[10px] font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            (currentPage - 1) * itemsPerPage +
                                                1,
                                            filteredTpas.length
                                        )}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredTpas.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {filteredTpas.length}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav
                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
