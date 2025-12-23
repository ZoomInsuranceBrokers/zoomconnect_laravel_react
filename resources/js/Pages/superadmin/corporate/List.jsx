import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";
import { Link } from "@inertiajs/react";

export default function Index({ companies, labels, groups, users }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [rmFilter, setRmFilter] = useState("");
    const [salesRmFilter, setSalesRmFilter] = useState("");
    const [salesVerticalFilter, setSalesVerticalFilter] = useState("");
    const [labelFilter, setLabelFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const [createdByFilter, setCreatedByFilter] = useState("");
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Get unique values for filters
    const uniqueRms = [
        ...new Set(companies.filter((c) => c.rmUser).map((c) => c.rmUser)),
    ];
    const uniqueSalesRms = [
        ...new Set(
            companies.filter((c) => c.salesRmUser).map((c) => c.salesRmUser)
        ),
    ];
    const uniqueSalesVerticals = [
        ...new Set(
            companies
                .filter((c) => c.salesVerticalUser)
                .map((c) => c.salesVerticalUser)
        ),
    ];
    const uniqueLabels = [
        ...new Set(
            companies
                .filter((c) => c.corporateLabel)
                .map((c) => c.corporateLabel)
        ),
    ];
    const uniqueGroups = [
        ...new Set(
            companies
                .filter((c) => c.corporateGroup)
                .map((c) => c.corporateGroup)
        ),
    ];

    // Filter companies based on search and filters
    const filteredCompanies = companies.filter((company) => {
        const matchesSearch =
            company.comp_name.toLowerCase().includes(search.toLowerCase()) ||
            (company.comp_code &&
                company.comp_code.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && company.status === 1) ||
            (statusFilter === "inactive" && company.status === 0);

        const matchesRm =
            rmFilter === "" ||
            (company.rm_user && company.rm_user.user_id.toString() === rmFilter);

        const matchesSalesRm =
            salesRmFilter === "" ||
            (company.sales_rm_user &&
                company.sales_rm_user.user_id.toString() === salesRmFilter);

        const matchesSalesVertical =
            salesVerticalFilter === "" ||
            (company.sales_vertical_user &&
                company.sales_vertical_user.user_id.toString() ===
                    salesVerticalFilter);

        const matchesLabel =
            labelFilter === "" ||
            (company.corporate_label &&
                company.corporate_label.id.toString() === labelFilter);

        const matchesGroup =
            groupFilter === "" ||
            (company.corporate_group &&
                company.corporate_group.id.toString() === groupFilter);

        const matchesCreatedBy =
            createdByFilter === "" ||
            (company.created_by_user &&
                company.created_by_user.user_id.toString() === createdByFilter);

        return (
            matchesSearch &&
            matchesStatus &&
            matchesRm &&
            matchesSalesRm &&
            matchesSalesVertical &&
            matchesLabel &&
            matchesGroup &&
            matchesCreatedBy
        );
    });

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCompanies.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Update total pages when filtered companies change
    useEffect(() => {
        setTotalPages(
            Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage))
        );
        setCurrentPage(1);
    }, [filteredCompanies.length, itemsPerPage]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (openActionsDropdown) {
                setOpenActionsDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openActionsDropdown]);

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCompanies([]);
        } else {
            setSelectedCompanies(
                currentItems.map((company) => company.comp_id)
            );
        }
        setSelectAll(!selectAll);
    };

    // Handle individual select
    const handleSelectCompany = (compId) => {
        if (selectedCompanies.includes(compId)) {
            setSelectedCompanies(
                selectedCompanies.filter((id) => id !== compId)
            );
        } else {
            setSelectedCompanies([...selectedCompanies, compId]);
        }
    };

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
    const handleToggleStatus = (compId, currentStatus) => {
        if (confirm(`Are you sure you want to ${currentStatus === 1 ? 'deactivate' : 'activate'} this corporate?`)) {
            router.put(route('corporate.toggle-status', compId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenActionsDropdown(null);
                },
            });
        }
    };

    // Handle edit corporate
    const handleEditCorporate = (compId) => {
        router.get(route('corporate.edit', compId));
    };

    return (
        <SuperAdminLayout>
            <Head title="All Customers" />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("corporate.create")}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                        >
                            <span>+</span>
                            Add Customer
                        </Link>
                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-[11px]">
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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

                    {/* RM Name Filter */}
                    <select
                        value={rmFilter}
                        onChange={(e) => setRmFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">RM Name</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.rm_user)
                                    .map((c) => c.rm_user.user_id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((userId) => {
                                const user = companies.find(
                                    (c) => c.rm_user?.user_id === userId
                                )?.rm_user;
                                return (
                                    <option key={userId} value={userId}>
                                        {user?.full_name || user?.user_name || user?.name || "-"}
                                    </option>
                                );
                            })}
                    </select>

                    {/* Sales RM Filter */}
                    <select
                        value={salesRmFilter}
                        onChange={(e) => setSalesRmFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">Sales RM</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.sales_rm_user)
                                    .map((c) => c.sales_rm_user.user_id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((userId) => {
                                const user = companies.find(
                                    (c) => c.sales_rm_user?.user_id === userId
                                )?.sales_rm_user;
                                return (
                                    <option key={userId} value={userId}>
                                        {user?.full_name || user?.user_name || user?.name || "-"}
                                    </option>
                                );
                            })}
                    </select>

                    {/* Sales Vertical Filter */}
                    <select
                        value={salesVerticalFilter}
                        onChange={(e) => setSalesVerticalFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">Sales Vertical</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.sales_vertical_user)
                                    .map((c) => c.sales_vertical_user.user_id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((userId) => {
                                const user = companies.find(
                                    (c) => c.sales_vertical_user?.user_id === userId
                                )?.sales_vertical_user;
                                return (
                                    <option key={userId} value={userId}>
                                        {user?.full_name || user?.user_name || user?.name || "-"}
                                    </option>
                                );
                            })}
                    </select>

                    {/* Labels Filter */}
                    <select
                        value={labelFilter}
                        onChange={(e) => setLabelFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">Labels</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.corporate_label)
                                    .map((c) => c.corporate_label.id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((labelId) => {
                                const label = companies.find(
                                    (c) => c.corporate_label?.id === labelId
                                )?.corporate_label;
                                return (
                                    <option key={labelId} value={labelId}>
                                        {label?.label || "-"}
                                    </option>
                                );
                            })}
                    </select>

                    {/* Groups Filter */}
                    <select
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">Groups</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.corporate_group)
                                    .map((c) => c.corporate_group.id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((groupId) => {
                                const group = companies.find(
                                    (c) => c.corporate_group?.id === groupId
                                )?.corporate_group;
                                return (
                                    <option key={groupId} value={groupId}>
                                        {group?.group_name || "-"}
                                    </option>
                                );
                            })}
                    </select>

                    {/* Created By Filter */}
                    <select
                        value={createdByFilter}
                        onChange={(e) => setCreatedByFilter(e.target.value)}
                        className={`px-2 py-1.5 border rounded-lg text-[10px] w-28 ${
                            darkMode
                                ? "bg-gray-800 border-gray-700 text-white"
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <option value="">Created By</option>
                        {[
                            ...new Set(
                                companies
                                    .filter((c) => c.created_by_user)
                                    .map((c) => c.created_by_user.user_id)
                            ),
                        ]
                            .filter(Boolean)
                            .map((userId) => {
                                const user = companies.find(
                                    (c) => c.created_by_user?.user_id === userId
                                )?.created_by_user;
                                return (
                                    <option key={userId} value={userId}>
                                        {user?.full_name || user?.user_name || user?.name || "-"}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                {/* Table */}
                <div
                    className={`rounded-lg shadow overflow-x-auto ${
                        darkMode ? "bg-gray-900" : "bg-white"
                    }`}
                >
                    <table className="w-full min-w-max">
                        <thead
                            className={`${
                                darkMode ? "bg-black border-gray-700" : "bg-gray-100 border-gray-200"
                            } border-b`}
                        >
                            <tr>
                                <th className="px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                    />
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[80px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Actions
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[150px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    <div className="flex items-center gap-1">
                                        Company Name
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
                                                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                            />
                                        </svg>
                                    </div>
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    RM Name
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Sales RM
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Sales Vertical
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Label
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Group
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Created Date
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Created By
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Last Updated By
                                </th>
                                <th className={`px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] ${
                                    darkMode ? "text-gray-300" : "text-gray-500"
                                }`}>
                                    Updated Date
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                darkMode ? "divide-gray-800 bg-gray-950" : "divide-gray-200 bg-white"
                            }`}
                        >
                            {currentItems.map((company) => (
                                <tr
                                    key={company.comp_id}
                                    className={`${
                                        darkMode
                                            ? "bg-gray-700 hover:bg-gray-600"
                                            : "bg-white hover:bg-gray-50"
                                    } cursor-pointer`}
                                    onClick={() => {
                                        setSelectedCompany(company);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedCompanies.includes(
                                                company.comp_id
                                            )}
                                            onChange={() =>
                                                handleSelectCompany(
                                                    company.comp_id
                                                )
                                            }
                                            className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                        />
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <button className={`${
                                                darkMode
                                                    ? "text-gray-400 hover:text-gray-300"
                                                    : "text-gray-400 hover:text-gray-600"
                                            }`}>
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
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </button>
                                            <button className={`${
                                                darkMode
                                                    ? "text-gray-400 hover:text-gray-300"
                                                    : "text-gray-400 hover:text-gray-600"
                                            }`}>
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
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </button>
                                            <div className="relative">
                                                <button
                                                    className="text-gray-400 hover:text-gray-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenActionsDropdown(
                                                            openActionsDropdown === company.comp_id
                                                                ? null
                                                                : company.comp_id
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
                                                {openActionsDropdown === company.comp_id && (
                                                    <div
                                                        className={`absolute left-0 mt-1 w-48 rounded-md shadow-lg z-50 border ${
                                                            darkMode
                                                                ? "bg-gray-800 border-gray-700"
                                                                : "bg-white border-gray-200"
                                                        }`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditCorporate(company.comp_id);
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-xs ${
                                                                    darkMode
                                                                        ? "text-gray-200 hover:bg-gray-700"
                                                                        : "text-gray-700 hover:bg-gray-100"
                                                                }`}
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
                                                                Edit Corporate
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleStatus(company.comp_id, company.status);
                                                                }}
                                                                className={`block w-full text-left px-4 py-2 text-xs ${
                                                                    darkMode
                                                                        ? "text-gray-200 hover:bg-gray-700"
                                                                        : "text-gray-700 hover:bg-gray-100"
                                                                }`}
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
                                                                {company.status === 1 ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Navigate to manage employees
                                                                        router.get(route('corporate.manage-employees', company.comp_id));
                                                                        setOpenActionsDropdown(null);
                                                                    }}
                                                                    className={`block w-full text-left px-4 py-2 text-xs ${
                                                                        darkMode
                                                                            ? "text-gray-200 hover:bg-gray-700"
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    <svg className="w-3 h-3 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20H4v-2a4 4 0 014-4h1" />
                                                                        <circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
                                                                    </svg>
                                                                    Manage Employees
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Navigate to manage entity
                                                                        router.get(route('corporate.manage-entity', company.comp_id));
                                                                        setOpenActionsDropdown(null);
                                                                    }}
                                                                    className={`block w-full text-left px-4 py-2 text-xs ${
                                                                        darkMode
                                                                            ? "text-gray-200 hover:bg-gray-700"
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    <svg className="w-3 h-3 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                                                                    </svg>
                                                                    Manage Entity
                                                                </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className={`text-[10px] font-medium ${
                                            darkMode ? "text-white" : "text-gray-900"
                                        }`}>
                                            {company.comp_name}
                                        </div>
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {company.rm_user?.full_name ||
                                            company.rm_user?.user_name ||
                                            company.rm_user?.name ||
                                            "-"}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {company.sales_rm_user?.full_name ||
                                            company.sales_rm_user?.user_name ||
                                            company.sales_rm_user?.name ||
                                            "-"}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {company.sales_vertical_user
                                            ?.full_name ||
                                            company.sales_vertical_user
                                                ?.user_name ||
                                            company.sales_vertical_user?.name ||
                                            "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {company.corporate_label ? (
                                            <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                                darkMode
                                                    ? "bg-blue-900 text-blue-200"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}>
                                                {company.corporate_label.label}
                                            </span>
                                        ) : (
                                            <span className={`text-[10px] ${
                                                darkMode ? "text-gray-500" : "text-gray-400"
                                            }`}>
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {company.corporate_group ? (
                                            <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                                darkMode
                                                    ? "bg-green-900 text-green-200"
                                                    : "bg-green-100 text-green-800"
                                            }`}>
                                                {
                                                    company.corporate_group
                                                        .group_name
                                                }
                                            </span>
                                        ) : (
                                            <span className={`text-[10px] ${
                                                darkMode ? "text-gray-500" : "text-gray-400"
                                            }`}>
                                                -
                                            </span>
                                        )}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {formatDate(company.created_date)}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {company.created_by_user
                                            ? company.created_by_user.full_name
                                            : "-"}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {company.updated_by_user
                                            ? company.updated_by_user.full_name
                                            : "-"}
                                    </td>
                                    <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                        darkMode ? "text-gray-300" : "text-gray-500"
                                    }`}>
                                        {formatDate(company.updated_date)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCompanies.length > 0 && (
                    <div className={`flex items-center justify-between px-2 md:px-4 py-2 md:py-3 border-t gap-2 md:gap-0 flex-wrap md:flex-nowrap ${
                        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}>
                        <div className="flex-1 flex justify-between sm:hidden w-full">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 border border-gray-300 text-[9px] md:text-[10px] font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <div className="flex gap-0.5 md:gap-1">
                                {Array.from(
                                    { length: Math.min(4, totalPages) },
                                    (_, i) => {
                                        const pageNum = currentPage <= 2 ? i + 1 : currentPage + i - 2;
                                        if (pageNum > totalPages) return null;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`relative inline-flex items-center px-1.5 md:px-2 py-1 md:py-1.5 border text-[8px] md:text-[10px] font-medium rounded ${
                                                    currentPage === pageNum
                                                        ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                                                        : darkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className={`relative inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 border text-[9px] md:text-[10px] font-medium rounded-md disabled:opacity-50 ${
                                    darkMode
                                        ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                            <div>
                                <p className={`text-[9px] md:text-[10px] ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                    Showing{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            (currentPage - 1) * itemsPerPage +
                                                1,
                                            filteredCompanies.length
                                        )}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredCompanies.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {filteredCompanies.length}
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
                                        className={`relative inline-flex items-center px-2 py-1.5 rounded-l-md border text-[10px] font-medium disabled:opacity-50 ${
                                            darkMode
                                                ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                        <svg
                                            className="h-3 w-3"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() =>
                                                    setCurrentPage(i + 1)
                                                }
                                                className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium ${
                                                    currentPage === i + 1
                                                        ? "z-10 bg-purple-50 border-purple-500 text-purple-600"
                                                        : darkMode
                                                            ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center px-2 py-1.5 rounded-r-md border text-[10px] font-medium disabled:opacity-50 ${
                                            darkMode
                                                ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg
                                            className="h-3 w-3"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                {filteredCompanies.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-[11px]">
                            No companies found.
                        </p>
                    </div>
                )}

                {isModalOpen && selectedCompany && (
                    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black bg-opacity-30">
                        <div className="w-[480px] h-full bg-white shadow-xl p-0 overflow-y-auto relative flex flex-col">
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                onClick={() => setIsModalOpen(false)}
                            >
                                &times;
                            </button>
                            {/* Header */}
                            <div className="px-6 pt-6 pb-2 border-b flex items-center justify-between">
                                <h2 className="text-lg font-bold">
                                    {selectedCompany.comp_name}
                                </h2>
                            </div>
                            {/* Tabs */}
                            <ModalTabs selectedCompany={selectedCompany} />
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

function ModalTabs({ selectedCompany }) {
    const [activeTab, setActiveTab] = useState("policies");

    return (
        <div className="flex flex-col h-full">
            {/* Tab Headers */}
            <div className="flex border-b px-6 pt-2 bg-white">
                <button
                    className={`py-2 px-4 text-sm font-semibold ${
                        activeTab === "policies"
                            ? "border-b-2 border-[#934790] text-[#934790] bg-white"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("policies")}
                >
                    Policies ({selectedCompany.policies.length})
                </button>
                <button
                    className={`py-2 px-4 text-sm font-semibold ${
                        activeTab === "contacts"
                            ? "border-b-2 border-[#934790] text-[#934790] bg-white"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("contacts")}
                >
                    Contacts (3)
                </button>
                <button
                    className={`py-2 px-4 text-sm font-semibold ${
                        activeTab === "details"
                            ? "border-b-2 border-[#934790] text-[#934790] bg-white"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("details")}
                >
                    Details
                </button>
            </div>
            {/* Tab Content */}
            <div className="flex-1 px-6 py-4 bg-white">
                {activeTab === "policies" && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-semibold text-base">
                                Active policies
                            </div>
                            <a
                                href="#"
                                className="text-xs text-[#934790] underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View
                            </a>
                        </div>
                        {selectedCompany.policies.length > 0 && (
                            <div className="bg-white rounded-xl shadow p-4 mb-4 border">
                                {/* Show the first policy */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-purple-100 text-[#934790]">
                                        Group
                                    </span>
                                    <span className="font-semibold text-sm text-gray-800">
                                        {
                                            selectedCompany.policies[0]
                                                .corporate_policy_name
                                        }
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    {new Date(
                                        selectedCompany.policies[0].policy_end_date
                                    ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                                    <div>
                                        <strong>ID</strong>
                                        <br />
                                        {selectedCompany.policies[0].id}
                                    </div>
                                    <div>
                                        <strong>Insurer</strong>
                                        <br />
                                        {selectedCompany.policies[0].insurance
                                            ?.insurance_company_name || "-"}
                                    </div>
                                    <div>
                                        <strong>Policy No.</strong>
                                        <br />
                                        {
                                            selectedCompany.policies[0]
                                                .policy_number
                                        }
                                    </div>
                                    <div>
                                        <strong>Premium</strong>
                                        <br />₹
                                        {selectedCompany.policies[0].premium ||
                                            "N/A"}
                                    </div>
                                    <div>
                                        <strong>Start Date</strong>
                                        <br />
                                        {new Date(
                                            selectedCompany.policies[0].policy_start_date
                                        ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div>
                                        <strong>TPA</strong>
                                        <br />
                                        {selectedCompany.policies[0].tpa ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold text-xs hover:bg-gray-200">
                                        Details
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold text-xs hover:bg-gray-200">
                                        Members
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold text-xs hover:bg-gray-200">
                                        Policy Setup
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Show "+n more" if there are additional policies */}
                        {selectedCompany.policies.length > 1 && (
                            <div className="text-xs text-gray-500">
                                +{selectedCompany.policies.length - 1} more
                                policies
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "contacts" && (
                    <div>
                        <div className="font-semibold text-base mb-4">
                            Contacts
                        </div>
                        {/* Sales RM */}
                        <div className="bg-white rounded-xl shadow p-4 mb-4 border">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-800">
                                    {selectedCompany.sales_rm_user?.full_name ||
                                        "Sales RM"}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (Sales RM)
                                </span>
                            </div>
                            <div className="text-xs text-gray-700 mt-2">
                                <strong>Phone:</strong>{" "}
                                {selectedCompany.sales_rm_user?.phone || "-"}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                                <strong>Email:</strong>{" "}
                                {selectedCompany.sales_rm_user?.email || "-"}
                            </div>
                            <div className="mt-2">
                                <a
                                    href="#"
                                    className="text-xs text-[#934790] underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View more detail
                                </a>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4 mb-4 border">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-800">
                                    {selectedCompany.rm_user?.full_name ||
                                        "Service RM"}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (Service RM)
                                </span>
                            </div>
                            <div className="text-xs text-gray-700 mt-2">
                                <strong>Phone:</strong>{" "}
                                {selectedCompany.rm_user?.phone || "-"}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                                <strong>Email:</strong>{" "}
                                {selectedCompany.rm_user?.email || "-"}
                            </div>
                            <div className="mt-2">
                                <a
                                    href="#"
                                    className="text-xs text-[#934790] underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View more detail
                                </a>
                            </div>
                        </div>
                        {/* Sales Vertical */}
                        <div className="bg-white rounded-xl shadow p-4 mb-4 border">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-800">
                                    {selectedCompany.sales_vertical_user
                                        ?.full_name || "Sales Vertical"}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (Sales Vertical)
                                </span>
                            </div>
                            <div className="text-xs text-gray-700 mt-2">
                                <strong>Phone:</strong>{" "}
                                {selectedCompany.sales_vertical_user?.phone ||
                                    "-"}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                                <strong>Email:</strong>{" "}
                                {selectedCompany.sales_vertical_user?.email ||
                                    "-"}
                            </div>
                            <div className="mt-2">
                                <a
                                    href="#"
                                    className="text-xs text-[#934790] underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View more detail
                                </a>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "details" && (
                    <div>
                        <div className="font-semibold text-base mb-4">
                            Customer Details
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-700 mb-4">
                            <div>
                                <strong>Company Name:</strong>
                                <br />
                                {selectedCompany.comp_name || "-"}
                            </div>
                            <div>
                                <strong>Address:</strong>
                                <br />
                                {selectedCompany.comp_addr || "-"}
                            </div>
                            <div>
                                <strong>City:</strong>
                                <br />
                                {selectedCompany.comp_city || "-"}
                            </div>
                            <div>
                                <strong>State:</strong>
                                <br />
                                {selectedCompany.comp_state || "-"}
                            </div>
                            <div>
                                <strong>Pincode:</strong>
                                <br />
                                {selectedCompany.comp_pincode || "-"}
                            </div>
                            <div>
                                <strong>Company Icon:</strong>
                                <br />
                                {selectedCompany.comp_icon_url ? (
                                    <img
                                        src={selectedCompany.comp_icon_url}
                                        alt="Company Icon"
                                        className="w-8 h-8 rounded"
                                    />
                                ) : (
                                    "-"
                                )}
                            </div>
                            <div>
                                <strong>Label:</strong>
                                <br />
                                {selectedCompany.corporate_label ? (
                                    <span className="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-black text-white">
                                        {selectedCompany.corporate_label.label}
                                    </span>
                                ) : (
                                    "-"
                                )}
                            </div>
                            <div>
                                <strong>Phone:</strong>
                                <br />
                                {selectedCompany.phone || "-"}
                            </div>
                            <div>
                                <strong>Email:</strong>
                                <br />
                                {selectedCompany.email || "-"}
                            </div>
                            <div>
                                <strong>Created by:</strong>
                                <br />
                                {selectedCompany.created_by_user?.full_name ||
                                    "-"}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <strong>Documents:</strong> (0)
                            </div>
                            <a
                                href="#"
                                className="text-xs text-[#934790] underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View
                            </a>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold text-xs hover:bg-gray-200">
                                Edit
                            </button>
                            <button className="bg-red-100 text-red-700 px-3 py-1 rounded font-semibold text-xs hover:bg-red-200">
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
