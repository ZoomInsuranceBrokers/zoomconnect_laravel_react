import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router, Link, usePage } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";

export default function ManageEntity({ company, entities = [] }) {
    const { darkMode } = useTheme();
    const { flash } = usePage().props;
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);

    // Filter entities based on search and status
    const filteredEntities = entities.filter((entity) => {
        const matchesSearch =
            entity.branch_name?.toLowerCase().includes(search.toLowerCase()) ||
            entity.city?.toLowerCase().includes(search.toLowerCase()) ||
            entity.state_name?.toLowerCase().includes(search.toLowerCase()) ||
            entity.pincode?.toString().includes(search);

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && entity.status === 1) ||
            (statusFilter === "inactive" && entity.status === 0);

        return matchesSearch && matchesStatus;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (openActionsDropdown) {
                setOpenActionsDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openActionsDropdown]);

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Handle toggle status
    const handleToggleStatus = (entityId, currentStatus) => {
        if (
            confirm(
                `Are you sure you want to ${
                    currentStatus === 1 ? "deactivate" : "activate"
                } this entity?`
            )
        ) {
            router.put(
                route("entity.toggle-status", entityId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setOpenActionsDropdown(null);
                    },
                }
            );
        }
    };

    // Handle edit entity
    const handleEditEntity = (entityId) => {
        router.get(route("corporate.entity.edit", [company.comp_id, entityId]));
    };

    return (
        <SuperAdminLayout>
            <Head title={`Manage Entities - ${company?.comp_name || "Company"}`} />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold text-gray-800">
                            Manage Entities - {company?.comp_name}
                        </h1>
                    </div>
                    <Link
                        href={route("corporate.list.index")}
                        className="text-sm text-[#934790] hover:underline transition"
                    >
                        ← Back to Companies
                    </Link>
                </div>

                {/* Success/Error Messages */}
                {flash?.message && (
                    <div
                        className={`mb-4 p-3 rounded-md text-sm ${
                            flash.messageType === "success"
                                ? "bg-green-100 border border-green-400 text-green-700"
                                : "bg-red-100 border border-red-400 text-red-700"
                        }`}
                    >
                        {flash.message}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mb-4">
                    <Link
                        href={route("corporate.entity.create", company.comp_id)}
                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                    >
                        <span>+</span>
                        Add Entity
                    </Link>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Entities"
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
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Location ID
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                    Entity Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                                    Address
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    State
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    City
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Pincode
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                            {filteredEntities.map((entity) => (
                                <tr
                                    key={entity.id}
                                    className={`${
                                        darkMode
                                            ? "hover:bg-gray-700"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="relative">
                                            <button
                                                className="text-gray-400 hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionsDropdown(
                                                        openActionsDropdown === entity.id
                                                            ? null
                                                            : entity.id
                                                    );
                                                }}
                                            >
                                                <svg
                                                    className="w-4 h-4"
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
                                            {openActionsDropdown === entity.id && (
                                                <div
                                                    className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="py-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditEntity(entity.id);
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
                                                            Edit Entity
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleToggleStatus(
                                                                    entity.id,
                                                                    entity.status
                                                                );
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
                                                            {entity.status === 1
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-900 font-medium">
                                        {entity.location_id || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-900 font-medium">
                                        {entity.branch_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 text-[10px] text-gray-500">
                                        {entity.address || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {entity.state_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {entity.city || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {entity.pincode || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                                entity.status === 1
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {entity.status === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(entity.created_on)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredEntities.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-[11px]">
                                No entities found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
