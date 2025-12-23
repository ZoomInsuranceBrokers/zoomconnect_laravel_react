import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";

export default function Index({ policies, filters }) {
    const { flash } = usePage().props;
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
                {/* Flash Message */}
                {flash?.success && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-green-100 text-green-800 border border-green-200">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-red-100 text-red-800 border border-red-200">
                        ✗ {flash.error}
                    </div>
                )}
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
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3 dark:bg-gray-800 dark:border-gray-700">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-wrap gap-3 items-center w-full"
                    >
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by policy name, corporate policy name, or number..."
                            className="w-60 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#934790] focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-xs dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#934790] text-white text-xs rounded-lg hover:bg-[#7a3d7a] dark:bg-[#7a3d7a] dark:hover:bg-[#934790] dark:text-white"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Policies Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            All Policies ({policies.total})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Actions
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Corporate
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Policy Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Insurer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        TPA
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase dark:text-gray-300">
                                        Period
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {policies.data.length > 0 ? (
                                    policies.data.map((policy) => (
                                        <tr
                                            key={policy.id}
                                            className="hover:bg-gray-50 transition dark:hover:bg-gray-900"
                                        >
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 rounded-full font-semibold ${
                                                        policy.is_active === 1
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
                                                    className="text-[#934790] hover:text-[#7a3d7a] focus:outline-none dark:text-[#e9c6e8] dark:hover:text-[#934790]"
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
                                                    className="text-[#934790] hover:text-[#7a3d7a] dark:text-[#e9c6e8] dark:hover:text-[#934790]"
                                                    title="Edit"
                                                >
                                                    {/* Pencil SVG */}
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
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                                                    </svg>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap dark:text-gray-200">
                                                {policy.company?.comp_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap dark:text-gray-200">
                                                {policy.policy_name ||
                                                    policy.corporate_policy_name}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap dark:text-gray-200">
                                                {policy.insurance
                                                    ?.insurance_company_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap dark:text-gray-200">
                                                {policy.tpa?.tpa_company_name ||
                                                    "-"}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap dark:text-gray-200">
                                                {formatDate(
                                                    policy.policy_start_date
                                                )} {" "}
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
                                            className="text-center py-4 text-xs text-gray-500 dark:text-gray-400"
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
                                        ? "bg-[#934790] text-white border-[#934790] dark:bg-[#7a3d7a] dark:border-[#934790]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
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
                    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-40 dark:bg-opacity-70">
                        <div className="bg-white rounded-l-lg shadow-lg w-full max-w-md h-full overflow-auto relative animate-slideInRight dark:bg-gray-800 dark:text-white">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold dark:text-gray-300 dark:hover:text-white"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                            <div className="px-6 pt-6 pb-3 border-b dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {selectedPolicy.company?.comp_name || "-"}
                                </h2>
                            </div>
                            <div className="px-6 pt-4 pb-6">
                                <div className="flex border-b mb-4 dark:border-gray-700">
                                    <button
                                        className={`py-2 px-4 text-base font-semibold ${
                                            activeTab === "details"
                                                ? "border-b-2 border-[#934790] text-[#934790] dark:border-[#e9c6e8] dark:text-[#e9c6e8]"
                                                : "text-gray-600 dark:text-gray-300"
                                        }`}
                                        onClick={() => setActiveTab("details")}
                                    >
                                        Policy Details
                                    </button>
                                    <button
                                        className={`py-2 px-4 text-base font-semibold ${
                                            activeTab === "family"
                                                ? "border-b-2 border-[#934790] text-[#934790] dark:border-[#e9c6e8] dark:text-[#e9c6e8]"
                                                : "text-gray-600 dark:text-gray-300"
                                        }`}
                                        onClick={() => setActiveTab("family")}
                                    >
                                        Family Definition
                                    </button>
                                </div>

                                {activeTab === "details" && (
                                    <div className="text-sm space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    Policy Name
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {selectedPolicy.policy_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    Policy Number
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {selectedPolicy.policy_number ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    Insurer
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {selectedPolicy.insurance
                                                        ?.insurance_company_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    TPA
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {selectedPolicy.tpa
                                                        ?.tpa_company_name ||
                                                        "-"}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    Start Date
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {formatDate(
                                                        selectedPolicy.policy_start_date
                                                    )}
                                                </p>
                                            </div>

                                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 dark:text-gray-400">
                                                    End Date
                                                </p>
                                                <p className="text-gray-800 font-medium dark:text-white">
                                                    {formatDate(
                                                        selectedPolicy.policy_end_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-[#f9f5fa] border border-[#e6d8eb] rounded-lg text-center text-xs text-[#934790] font-semibold dark:bg-[#2d1e2d] dark:border-[#7a3d7a] dark:text-[#e9c6e8]">
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
                                                                            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 hover:shadow-md transition dark:bg-gray-900 dark:border-gray-700"
                                                                        >
                                                                            <h4 className="text-sm font-semibold text-[#934790] capitalize border-b pb-1 mb-2 dark:text-[#e9c6e8] dark:border-gray-700">
                                                                                {member.replace(
                                                                                    /_/g,
                                                                                    " "
                                                                                )}
                                                                            </h4>
                                                                            <ul className="text-xs text-gray-700 space-y-1 dark:text-gray-200">
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
                                                                                                <span className="capitalize text-gray-600 dark:text-gray-300">
                                                                                                    {key.replace(
                                                                                                        /_/g,
                                                                                                        " "
                                                                                                    )}

                                                                                                    :
                                                                                                </span>
                                                                                                <span className="font-medium text-gray-900 dark:text-gray-100">
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
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            Invalid family
                                                            definition format.
                                                        </span>
                                                    );
                                                }
                                            })()
                                        ) : (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
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
