import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";

export default function Index({ policies, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");

    // 🔹 Modal States
    const [showModal, setShowModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    // 🔹 Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route("superadmin.policy.policies.index"), {
            search: searchTerm,
            status: selectedStatus,
        });
    };

    // 🔹 Format Date
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // 🔹 Handle Modal Open
    const handleView = (policy) => {
        setSelectedPolicy(policy);
        setShowModal(true);
        setActiveTab("details");
    };

    // 🔹 Handle Modal Close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPolicy(null);
    };

    // 🔹 Parse Family Definition JSON
    const renderFamilyDefinition = (jsonStr) => {
        try {
            const def = JSON.parse(jsonStr);
            const entries = Object.entries(def).filter(
                ([key, val]) => val && val !== "0" && val !== "null"
            );
            return (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {entries.map(([key, val]) => (
                        <div key={key}>
                            <span className="font-semibold text-gray-700 capitalize">
                                {key.replace(/_/g, " ")}:
                            </span>{" "}
                            <span className="text-gray-600">{val}</span>
                        </div>
                    ))}
                </div>
            );
        } catch (err) {
            return (
                <span className="text-xs text-gray-500">
                    Invalid JSON format.
                </span>
            );
        }
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-start border-b pb-3 border-gray-200 mt-3">
                    <Link
                        href="/superadmin/policy/policies/create"
                        className="px-4 py-2 bg-[#934790] text-white text-xs rounded-lg hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-[#934790]"
                    >
                        + Create New Policy
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-wrap gap-3 items-center w-full"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by policy name, corporate policy name, or number..."
                            className="w-60 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                        />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#934790] text-white text-xs rounded-lg hover:bg-[#7a3d7a]"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Policies Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">
                            All Policies ({policies.total})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Actions
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Corporate
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Policy Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Insurer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        TPA
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Period
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {policies.data.length > 0 ? (
                                    policies.data.map((policy) => (
                                        <tr
                                            key={policy.id}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 rounded-full font-semibold ${
                                                        policy.is_active === 1
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {policy.is_active === 1
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleView(policy)
                                                    }
                                                    className="text-[#934790] hover:text-[#7a3d7a] focus:outline-none"
                                                    title="View"
                                                >
                                                    {/* Eye SVG */}
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#934790"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="inline"
                                                    >
                                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>
                                                </button>
                                                <Link
                                                    href={`/superadmin/policy/policies/${policy.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    {/* Pencil SVG */}
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#2563eb"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="inline"
                                                    >
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                                                    </svg>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                {policy.company?.comp_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                {policy.policy_name ||
                                                    policy.corporate_policy_name}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                {policy.insurance
                                                    ?.insurance_company_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                {policy.tpa?.tpa_company_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                                {formatDate(
                                                    policy.policy_start_date
                                                )}{" "}
                                                -{" "}
                                                {formatDate(
                                                    policy.policy_end_date
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-4 text-xs text-gray-500"
                                        >
                                            No policies found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {policies.links && policies.links.length > 0 && (
                    <div className="flex justify-center items-center mt-4 space-x-1">
                        {policies.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 text-xs border rounded-md ${
                                    link.active
                                        ? "bg-[#934790] text-white border-[#934790]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                } ${
                                    !link.url
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                }`}
                            />
                        ))}
                    </div>
                )}
                {/* 🔹 Modal Drawer */}
                {showModal && selectedPolicy && (
                    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-40">
                        <div className="bg-white rounded-l-lg shadow-lg w-full max-w-md h-full overflow-auto relative animate-slideInRight">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <div className="px-6 pt-6 pb-3 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedPolicy.company?.comp_name || "-"}
                                </h2>
                            </div>
                            <div className="px-6 pt-4 pb-6">
                                <div className="flex border-b mb-4">
                                    <button
                                        className={`py-2 px-4 text-base font-semibold ${
                                            activeTab === "details"
                                                ? "border-b-2 border-[#934790] text-[#934790]"
                                                : "text-gray-600"
                                        }`}
                                        onClick={() => setActiveTab("details")}
                                    >
                                        Policy Details
                                    </button>
                                    <button
                                        className={`py-2 px-4 text-base font-semibold ${
                                            activeTab === "family"
                                                ? "border-b-2 border-[#934790] text-[#934790]"
                                                : "text-gray-600"
                                        }`}
                                        onClick={() => setActiveTab("family")}
                                    >
                                        Family Definition
                                    </button>
                                </div>

                                {activeTab === "details" && (
                                    <div className="text-sm space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    Policy Name
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {selectedPolicy.policy_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    Policy Number
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {selectedPolicy.policy_number ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    Insurer
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {selectedPolicy.insurance
                                                        ?.insurance_company_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    TPA
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {selectedPolicy.tpa
                                                        ?.tpa_company_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    Start Date
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {formatDate(
                                                        selectedPolicy.policy_start_date
                                                    )}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                                    End Date
                                                </p>
                                                <p className="text-gray-800 font-medium">
                                                    {formatDate(
                                                        selectedPolicy.policy_end_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-[#f9f5fa] border border-[#e6d8eb] rounded-lg text-center text-xs text-[#934790] font-semibold">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="#934790"
                                                className="w-4 h-4 inline mr-1"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                                                />
                                            </svg>
                                            Policy period:{" "}
                                            {formatDate(
                                                selectedPolicy.policy_start_date
                                            )}{" "}
                                            —{" "}
                                            {formatDate(
                                                selectedPolicy.policy_end_date
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "family" && (
                                    <div className="text-sm">
                                        {selectedPolicy.family_defination ? (
                                            (() => {
                                                try {
                                                    const def = JSON.parse(
                                                        selectedPolicy.family_defination
                                                    );

                                                    // Group related fields (like self_no, self_min_age, etc.)
                                                    const members = {};
                                                    Object.keys(def).forEach(
                                                        (key) => {
                                                            const [
                                                                member,
                                                                field,
                                                            ] = key.split("_");
                                                            if (
                                                                !members[member]
                                                            )
                                                                members[
                                                                    member
                                                                ] = {};
                                                            members[member][
                                                                field ||
                                                                    "status"
                                                            ] = def[key];
                                                        }
                                                    );

                                                    return (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {Object.entries(
                                                                members
                                                            ).map(
                                                                ([
                                                                    member,
                                                                    details,
                                                                ]) => {
                                                                    // Skip if not included
                                                                    if (
                                                                        !details.status ||
                                                                        details.status ===
                                                                            "0" ||
                                                                        details.status ===
                                                                            "null"
                                                                    )
                                                                        return null;

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                member
                                                                            }
                                                                            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 hover:shadow-md transition"
                                                                        >
                                                                            <h4 className="text-sm font-semibold text-[#934790] capitalize border-b pb-1 mb-2">
                                                                                {member.replace(
                                                                                    /_/g,
                                                                                    " "
                                                                                )}
                                                                            </h4>
                                                                            <ul className="text-xs text-gray-700 space-y-1">
                                                                                {Object.entries(
                                                                                    details
                                                                                ).map(
                                                                                    ([
                                                                                        key,
                                                                                        val,
                                                                                    ]) => {
                                                                                        if (
                                                                                            key ===
                                                                                                "status" ||
                                                                                            val ===
                                                                                                "null"
                                                                                        )
                                                                                            return null;
                                                                                        return (
                                                                                            <li
                                                                                                key={
                                                                                                    key
                                                                                                }
                                                                                                className="flex justify-between"
                                                                                            >
                                                                                                <span className="capitalize text-gray-600">
                                                                                                    {key.replace(
                                                                                                        /_/g,
                                                                                                        " "
                                                                                                    )}

                                                                                                    :
                                                                                                </span>
                                                                                                <span className="font-medium text-gray-900">
                                                                                                    {
                                                                                                        val
                                                                                                    }
                                                                                                </span>
                                                                                            </li>
                                                                                        );
                                                                                    }
                                                                                )}
                                                                            </ul>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    );
                                                } catch (err) {
                                                    return (
                                                        <span className="text-xs text-gray-500">
                                                            Invalid family
                                                            definition format.
                                                        </span>
                                                    );
                                                }
                                            })()
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                No data available.
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
