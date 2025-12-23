import React, { useState } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";

export default function BulkEmployeeActions({ company, actions = [] }) {
    const { darkMode } = useTheme();
    const { flash } = usePage().props;
    const [filter, setFilter] = useState("all");

    // Filter actions
    const filteredActions = actions.filter((action) => {
        if (filter === "all") return true;
        if (filter === "bulk_add") return action.action_type === "bulk_add";
        if (filter === "bulk_remove") return action.action_type === "bulk_remove";
        return true;
    });

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const badges = {
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
        };
        return badges[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <SuperAdminLayout>
            <Head title={`Bulk Employee Actions - ${company?.comp_name || "Company"}`} />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-semibold text-gray-800">
                            Bulk Employee Actions - {company?.comp_name}
                        </h1>
                    </div>
                    <Link
                        href={route("corporate.manage-employees", company.comp_id)}
                        className="text-sm text-[#934790] hover:underline transition"
                    >
                        ← Back to Employees
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
                        href={route("corporate.bulk-upload-employee", company.comp_id)}
                        className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                    >
                        <span>+</span>
                        Bulk Add Employees
                    </Link>

                    <Link
                        href={route("corporate.bulk-remove-employee", company.comp_id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                    >
                        <span>−</span>
                        Bulk Remove Employees
                    </Link>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-2 py-1.5 border rounded-lg text-[10px] bg-white border-gray-300 ml-auto"
                    >
                        <option value="all">All Actions</option>
                        <option value="bulk_add">Bulk Add Only</option>
                        <option value="bulk_remove">Bulk Remove Only</option>
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
                                    ID
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Action Type
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Total Records
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Inserted
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Failed
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    Created By
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    Created Date
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                            {filteredActions.map((action) => (
                                <tr
                                    key={action.id}
                                    className={`${
                                        darkMode
                                            ? "hover:bg-gray-700"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-900 font-medium">
                                        #{action.id}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                                action.action_type === "bulk_add"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {action.action_type === "bulk_add"
                                                ? "Bulk Add"
                                                : "Bulk Remove"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {action.total_records || 0}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-green-600 font-medium">
                                        {action.inserted_count || 0}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-red-600 font-medium">
                                        {action.failed_count || 0}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${getStatusBadge(
                                                action.status
                                            )}`}
                                        >
                                            {action.status.charAt(0).toUpperCase() +
                                                action.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {action.creator?.full_name ||
                                            action.creator?.user_name ||
                                            "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(action.created_at)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-2">
                                            {action.uploaded_file && (
                                                <a
                                                    href={route("bulk-action.download-file", [
                                                        action.id,
                                                        "uploaded",
                                                    ])}
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                    title="Download Uploaded File"
                                                >
                                                    Original
                                                </a>
                                            )}
                                            {action.inserted_data_file && (
                                                <a
                                                    href={route("bulk-action.download-file", [
                                                        action.id,
                                                        "inserted",
                                                    ])}
                                                    className="text-green-600 hover:text-green-800 underline"
                                                    title="Download Inserted Records"
                                                >
                                                    Success
                                                </a>
                                            )}
                                            {action.not_inserted_data_file && (
                                                <a
                                                    href={route("bulk-action.download-file", [
                                                        action.id,
                                                        "failed",
                                                    ])}
                                                    className="text-red-600 hover:text-red-800 underline"
                                                    title="Download Failed Records"
                                                >
                                                    Failed
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredActions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-[11px]">
                                No bulk actions found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
