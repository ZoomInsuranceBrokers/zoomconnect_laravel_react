import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";
import { Link } from "@inertiajs/react";

// Modal Tabs Component
function ModalTabs({ selectedEmployee, formatDate, editMode, editForm, setEditForm, onSaveEdit, onCancelEdit }) {
    const [activeTab, setActiveTab] = useState("personal");
    const [policies, setPolicies] = useState([]);
    const [loadingPolicies, setLoadingPolicies] = useState(false);

    useEffect(() => {
        if (activeTab === "policy" && selectedEmployee?.id) {
            setLoadingPolicies(true);
            fetch(`/superadmin/employee/${selectedEmployee.id}/policies`)
                .then((res) => res.json())
                .then((data) => {
                    setPolicies(data.policies || []);
                    setLoadingPolicies(false);
                })
                .catch(() => setLoadingPolicies(false));
        }
    }, [activeTab, selectedEmployee]);

    return (
        <div className="flex flex-col h-full">
            {/* Tab Headers */}
            <div className="flex border-b px-6 pt-2 bg-white">
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === "personal" ? "border-b-2 border-[#934790] text-[#934790] bg-white" : "text-gray-500"}`}
                    onClick={() => setActiveTab("personal")}
                >
                    Personal Details
                </button>
                <button
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === "policy" ? "border-b-2 border-[#934790] text-[#934790] bg-white" : "text-gray-500"}`}
                    onClick={() => setActiveTab("policy")}
                >
                    Policy Details
                </button>
            </div>
            {/* Tab Content */}
            <div className="flex-1 px-6 py-4 bg-white">
                {activeTab === "personal" && (
                    <div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-700 mb-4">
                            <div>
                                <strong>Email:</strong>
                                <br />
                                {selectedEmployee.email || "-"}
                            </div>
                            <div>
                                <strong>Phone:</strong>
                                <br />
                                {selectedEmployee.mobile || "-"}
                            </div>
                            <div>
                                <strong>Designation:</strong>
                                <br />
                                {selectedEmployee.designation || "-"}
                            </div>
                            <div>
                                <strong>Branch:</strong>
                                <br />
                                {selectedEmployee.branch_name || "-"}
                            </div>
                            <div>
                                <strong>Status:</strong>
                                <br />
                                <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${selectedEmployee.is_active === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {selectedEmployee.is_active === 1 ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div>
                                <strong>Created Date:</strong>
                                <br />
                                {formatDate(selectedEmployee.created_on)}
                            </div>
                            <div>
                                <strong>Updated Date:</strong>
                                <br />
                                {formatDate(selectedEmployee.updated_on)}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "policy" && (
                    <div>
                        <div className="font-semibold text-base mb-4">Policies</div>
                        {loadingPolicies ? (
                            <div className="text-center py-8 text-gray-500 text-[11px]">Loading policies...</div>
                        ) : policies.length > 0 ? (
                            policies.map((policy, idx) => (
                                <div key={policy.id || idx} className="bg-white rounded-xl shadow p-4 mb-4 border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex px-2 py-1 text-[10px] font-semibold rounded bg-purple-100 text-[#934790]">
                                            {policy.tpa_company_name || "TPA"}
                                        </span>
                                        <span className="font-semibold text-sm text-gray-800">
                                            {policy.corporate_policy_name || policy.policy_number || "Policy"}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        {policy.policy_end_date ? new Date(policy.policy_end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                                        <div>
                                            <strong>ID</strong>
                                            <br />
                                            {policy.id}
                                        </div>
                                        <div>
                                            <strong>Insurer</strong>
                                            <br />
                                            {policy.insurance_company_name || "-"}
                                        </div>
                                        <div>
                                            <strong>Policy No.</strong>
                                            <br />
                                            {policy.policy_number}
                                        </div>
                                        <div>
                                            <strong>TPA</strong>
                                            <br />
                                            {policy.tpa_company_name || "-"}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-[11px]">No policies found.</p>
                            </div>
                        )}
                    </div>
                )}
                {/* Edit form shown below when editMode is true */}
                {editMode && (
                    <div className="border-t mt-4 pt-4">
                        <div className="px-6">
                            <h3 className="text-sm font-semibold mb-2">Edit Employee</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.full_name}
                                        onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium">Phone</label>
                                        <input
                                            type="text"
                                            value={editForm.mobile}
                                            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">Designation</label>
                                        <input
                                            type="text"
                                            value={editForm.designation}
                                            onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border rounded text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onSaveEdit}
                                        className="bg-[#934790] text-white px-3 py-1 rounded text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={onCancelEdit}
                                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ManageEmployees({ company, employees }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [branchFilter, setBranchFilter] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalEditMode, setModalEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', email: '', mobile: '', designation: '' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Get unique branches for filter
    const uniqueBranches = [
        ...new Set(
            employees
                .filter((e) => e.branch_name)
                .map((e) => e.branch_name)
        ),
    ];

    // Filter employees based on search and filters
    const filteredEmployees = employees.filter((employee) => {
        const matchesSearch =
            employee.full_name.toLowerCase().includes(search.toLowerCase()) ||
            (employee.email &&
                employee.email.toLowerCase().includes(search.toLowerCase())) ||
            (employee.mobile &&
                employee.mobile.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && employee.is_active === 1) ||
            (statusFilter === "inactive" && employee.is_active === 0);

        const matchesBranch =
            branchFilter === "" ||
            (employee.branch_name &&
                employee.branch_name === branchFilter);

        return matchesSearch && matchesStatus && matchesBranch;
    });

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployees.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Update total pages when filtered employees change
    useEffect(() => {
        setTotalPages(
            Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage))
        );
        setCurrentPage(1);
    }, [filteredEmployees.length, itemsPerPage]);

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

    // Modal actions: toggle status, edit
    const handleStartEdit = () => {
        setModalEditMode(true);
    };

    const handleCancelEdit = () => {
        setModalEditMode(false);
        if (selectedEmployee) {
            setEditForm({ full_name: selectedEmployee.full_name || '', email: selectedEmployee.email || '', mobile: selectedEmployee.mobile || '', designation: selectedEmployee.designation || '' });
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedEmployee) return;
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const res = await fetch(`/superadmin/employee/${selectedEmployee.id}/toggle-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.success) {
                // update local state and reload list
                setSelectedEmployee({ ...selectedEmployee, is_active: data.is_active });
                router.reload();
            } else {
                alert(data.message || 'Failed to toggle status');
            }
        } catch (err) {
            console.error(err);
            alert('Error toggling status');
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedEmployee) return;
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const res = await fetch(`/superadmin/employee/${selectedEmployee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                setSelectedEmployee(data.employee);
                setModalEditMode(false);
                router.reload();
            } else {
                alert(data.message || 'Failed to update employee');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating employee');
        }
    };

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(
                currentItems.map((emp) => emp.id)
            );
        }
        setSelectAll(!selectAll);
    };

    // Handle individual select
    const handleSelectEmployee = (empId) => {
        if (selectedEmployees.includes(empId)) {
            setSelectedEmployees(
                selectedEmployees.filter((id) => id !== empId)
            );
        } else {
            setSelectedEmployees([...selectedEmployees, empId]);
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

    return (
        <SuperAdminLayout>
            <Head title={`Manage Employees - ${company?.comp_name || 'Company'}`} />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("corporate.list.index")}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                        >
                            ← Back to Corporates
                        </Link>
                        <div className="relative group">
                            <button className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Employee
                            </button>
                                    <div
                                        className="absolute right-0 hidden group-hover:block bg-white rounded-md shadow-lg border w-56 z-50"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="add-employee-menu"
                                    >
                                        <div className="py-2">
                                            <div className="px-4 py-2 border-b text-sm font-semibold text-gray-700">Add Employee</div>

                                            <Link
                                                href={route('corporate.employee.create', company.comp_id)}
                                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                                                role="menuitem"
                                            >
                                                <svg className="w-5 h-5 text-[#934790] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.6 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm text-gray-800">Single Entry</div>
                                                    <div className="text-[11px] text-gray-500">Add one employee manually</div>
                                                </div>
                                            </Link>

                                            <Link
                                                href={route('corporate.bulk-employee-actions', company.comp_id)}
                                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
                                                role="menuitem"
                                            >
                                                <svg className="w-5 h-5 text-[#934790] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
                                                </svg>
                                                <div>
                                                    <div className="text-sm text-gray-800">Bulk Upload</div>
                                                    <div className="text-[11px] text-gray-500">Upload CSV to add or remove employees</div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                        </div>
                    </div>
                    <div className="text-lg font-bold">{company?.comp_name}</div>
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

                    {/* Branch Filter */}
                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="px-2 py-1.5 border rounded-lg text-[10px] bg-white border-gray-300"
                    >
                        <option value="">Branch</option>
                        {uniqueBranches.map((branch) => (
                            <option key={branch} value={branch}>
                                {branch}
                            </option>
                        ))}
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
                                <th className="px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                    />
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    Actions
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    <div className="flex items-center gap-1">
                                        Full Name
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
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                    Email
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">
                                    Phone
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Designation
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                    Branch
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Created Date
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                    Updated Date
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
                        >
                            {currentItems.map((emp) => (
                                <tr
                                    key={emp.id}
                                    className={`${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} cursor-pointer`}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(emp.id)}
                                            onChange={() => handleSelectEmployee(emp.id)}
                                            className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                        />
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <button
                                                className="text-gray-400 hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEmployee(emp);
                                                    setEditForm({ full_name: emp.full_name || '', email: emp.email || '', mobile: emp.mobile || '', designation: emp.designation || '' });
                                                    setModalEditMode(false);
                                                    setIsModalOpen(true);
                                                }}
                                                title="View Details"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button className="text-gray-400 hover:text-gray-600">
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
                                                            openActionsDropdown === emp.id
                                                                ? null
                                                                : emp.id
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
                                                {openActionsDropdown === emp.id && (
                                                    <div
                                                        className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="py-1">
                                                            <Link
                                                                href={route('corporate.employee.edit', [company.comp_id, emp.id])}
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
                                                                Edit Employee
                                                            </Link>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Toggle status action
                                                                    setOpenActionsDropdown(null);
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
                                                                {emp.is_active === 1 ? 'Deactivate' : 'Activate'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="text-[10px] font-medium text-gray-900">
                                            {emp.full_name}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {emp.email || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {emp.mobile || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {emp.designation || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {emp.branch_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded ${
                                            emp.is_active === 1
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {emp.is_active === 1 ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(emp.created_on)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(emp.updated_on)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredEmployees.length > 0 && (
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
                                            filteredEmployees.length
                                        )}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredEmployees.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {filteredEmployees.length}
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
                                        className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
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
                                    {/* Compact pagination logic */}
                                    {totalPages <= 7 ? (
                                        Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium ${
                                                    currentPage === i + 1
                                                        ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))
                                    ) : (
                                        <>
                                            {/* First page */}
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium ${currentPage === 1 ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                1
                                            </button>
                                            {/* Ellipsis before current page */}
                                            {currentPage > 3 && <span className="px-2 py-1.5">...</span>}
                                            {/* Previous page (if not near start) */}
                                            {currentPage > 2 && currentPage < totalPages - 1 && (
                                                <button
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    className="relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                >
                                                    {currentPage - 1}
                                                </button>
                                            )}
                                            {/* Current page */}
                                            {currentPage !== 1 && currentPage !== totalPages && (
                                                <button
                                                    onClick={() => setCurrentPage(currentPage)}
                                                    className="relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium z-10 bg-purple-50 border-purple-500 text-purple-600"
                                                >
                                                    {currentPage}
                                                </button>
                                            )}
                                            {/* Next page (if not near end) */}
                                            {currentPage < totalPages - 1 && currentPage > 1 && (
                                                <button
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    className="relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                                >
                                                    {currentPage + 1}
                                                </button>
                                            )}
                                            {/* Ellipsis after current page */}
                                            {currentPage < totalPages - 2 && <span className="px-2 py-1.5">...</span>}
                                            {/* Last page */}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium ${currentPage === totalPages ? 'z-10 bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
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

                {filteredEmployees.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-[11px]">
                            No employees found.
                        </p>
                    </div>
                )}

                {/* Employee Details Modal */}
                {isModalOpen && selectedEmployee && (
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
                                <div>
                                    <h2 className="text-lg font-bold">{selectedEmployee.full_name}</h2>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            onClick={handleToggleStatus}
                                            className={`px-3 py-1 text-sm rounded ${selectedEmployee.is_active === 1 ? 'bg-red-100 text-red-800' : 'bg-green-600 text-white'}`}
                                        >
                                            {selectedEmployee.is_active === 1 ? 'Make Inactive' : 'Make Active'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Tabs */}
                            <ModalTabs
                                selectedEmployee={selectedEmployee}
                                formatDate={formatDate}
                                editMode={modalEditMode}
                                editForm={editForm}
                                setEditForm={setEditForm}
                                onSaveEdit={handleSaveEdit}
                                onCancelEdit={handleCancelEdit}
                            />
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
