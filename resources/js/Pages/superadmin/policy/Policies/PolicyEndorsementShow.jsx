import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout.jsx";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../../Context/ThemeContext";
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

export default function PolicyEndorsementShow({ policy, company, endorsement, additionMembers = [], deletionMembers = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [modalEditMode, setModalEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', email: '', mobile: '', designation: '' });
    // Coverage details modal state
    const [selectedCoverageMember, setSelectedCoverageMember] = useState(null);

    // Switch tab state
    const [activeTable, setActiveTable] = useState('addition');

    const additionTableData = additionMembers.map(m => ({
        code: m.employees_code || m.code || '',
        name: m.insured_name || m.name || m.full_name || '',
        relation: m.relation || '',
        uhid: m.uhid || '',
        gender: m.gender || '',
        dob: m.dob || m.date_of_birth || '',
        base_sum_insured: m.base_sum_insured || 0,
        base_premium_on_company: m.base_premium_on_company || 0,
        base_premium_on_employee: m.base_premium_on_employee || 0,
        topup_sum_insured: m.topup_sum_insured || 0,
        topup_premium_on_company: m.topup_premium_on_company || 0,
        topup_premium_on_employee: m.topup_premium_on_employee || 0,
        parent_sum_insured: m.parent_sum_insured || 0,
        parent_premium_on_company: m.parent_premium_on_company || 0,
        parent_premium_on_employee: m.parent_premium_on_employee || 0,
        joiningDate: m.date_of_joining || m.joiningDate || '',
    }));
    const deletionTableData = deletionMembers.map(m => ({
        code: m.employees_code || m.code || '',
        name: m.insured_name || m.name || m.full_name || '',
        relation: m.relation || '',
        uhid: m.uhid || '',
        gender: m.gender || '',
        dob: m.dob || m.date_of_birth || '',
        refund_base_premium_on_company: m.refund_base_premium_on_company || 0,
        refund_base_premium_on_employee: m.refund_base_premium_on_employee || 0,
        refund_topup_premium_on_company: m.refund_topup_premium_on_company || 0,
        refund_topup_premium_on_employee: m.refund_topup_premium_on_employee || 0,
        refund_parent_premium_on_company: m.refund_parent_premium_on_company || 0,
        refund_parent_premium_on_employee: m.refund_parent_premium_on_employee || 0,
        leavingDate: m.date_of_leaving || m.leavingDate || '',
    }));

    // Pagination for each table (ManageEmployees style)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const filteredAddition = additionTableData.filter(
        m => String(m.code ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.relation ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.uhid ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const filteredDeletion = deletionTableData.filter(
        m => String(m.code ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.relation ?? '').toLowerCase().includes(search.toLowerCase()) ||
            String(m.uhid ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const activeData = activeTable === 'addition' ? filteredAddition : filteredDeletion;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = activeData.slice(indexOfFirstItem, indexOfLastItem);

    // Update total pages when filtered data or itemsPerPage changes
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(activeData.length / itemsPerPage)));
        setCurrentPage(1);
    }, [activeTable, activeData.length, itemsPerPage]);

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
            <Head title={`Endorsement ${endorsement.endorsement_no || endorsement.id}`} />
            <div
                className={`p-4 h-full overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("superadmin.policy.policies.endorsements", policy.id)}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                        >
                            ← Back to Endorsements
                        </Link>
                        <div className="relative group">
                            <Link
                                href={route('superadmin.policy.endorsements.bulk-actions', endorsement.id)}
                                className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                            >
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Manage Data
                            </Link>
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
                            className={`w-48 pl-8 pr-3 py-1.5 border rounded-lg text-[10px] focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode
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
                </div>

                {/* Switch Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold text-xs border-b-2 ${activeTable === 'addition' ? 'border-[#934790] text-[#934790] bg-white' : 'text-gray-500 bg-gray-100'}`}
                        onClick={() => { setActiveTable('addition'); setCurrentPage(1); }}
                    >
                        Member Addition
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold text-xs border-b-2 ${activeTable === 'deletion' ? 'border-[#934790] text-[#934790] bg-white' : 'text-gray-500 bg-gray-100'}`}
                        onClick={() => { setActiveTable('deletion'); setCurrentPage(1); }}
                    >
                        Member Deletion
                    </button>
                </div>
                {/* Table for active tab */}
                <div className={`bg-white rounded-lg shadow overflow-x-auto ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <table className="w-full min-w-max">
                        <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} border-b`}>
                            <tr>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">S.No</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Employee Code</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">UHID</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Insured Name</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Relation</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Gender</th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">DOB</th>
                                {activeTable === 'addition' && <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Date of Joining</th>}
                                {activeTable === 'deletion' && <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Date of Leaving</th>}
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Coverage Details</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                            {currentItems.length > 0 ? currentItems.map((m, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{indexOfFirstItem + idx + 1}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{m.code}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{m.uhid}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{m.name}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{m.relation}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{m.gender}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">{formatDate(m.dob)}</td>
                                    {activeTable === 'addition' && <td className="px-3 py-2 whitespace-nowrap text-[10px]">{formatDate(m.joiningDate)}</td>}
                                    {activeTable === 'deletion' && <td className="px-3 py-2 whitespace-nowrap text-[10px]">{formatDate(m.leavingDate)}</td>}
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex justify-center items-center">
                                            <button className="bg-[#934790] hover:bg-[#6A0066] text-white font-semibold px-4 py-1 rounded text-xs shadow" title="View Details" onClick={() => setSelectedCoverageMember(m)}>
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={activeTable === 'addition' ? 9 : 9} className="text-center py-8 text-gray-500 text-[11px]">No members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls (ManageEmployees style) */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-500">
                        Showing {activeData.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, activeData.length)} of {activeData.length} entries
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {/* Compact pagination logic */}
                        {totalPages <= 7 ? (
                            Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`relative inline-flex items-center px-3 py-1.5 border text-[10px] font-medium ${currentPage === i + 1
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
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 bg-white text-[10px] font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>

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

                {/* Coverage Details Modal Drawer */}
                {selectedCoverageMember && (
                    <div className="fixed inset-0 right-0 z-50 flex items-center justify-end bg-black bg-opacity-30">
                        <div className="bg-white rounded-l-lg shadow-lg w-full max-w-md h-full flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold">Coverage Details</h2>
                                <button onClick={() => setSelectedCoverageMember(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-purple-100 text-[#934790] px-2 py-1 rounded text-xs font-semibold">{selectedCoverageMember.relation || '-'}</span>
                                        <span className="font-semibold">{selectedCoverageMember.name || '-'}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">UHID: {selectedCoverageMember.uhid || '-'}</div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div><span className="font-semibold">Gender</span><br />{selectedCoverageMember.gender || '-'}</div>
                                        <div><span className="font-semibold">DOB</span><br />{formatDate(selectedCoverageMember.dob)}</div>
                                        {activeTable === 'addition' && <>
                                            <div><span className="font-semibold">Base Sum Insured</span><br />{selectedCoverageMember.base_sum_insured?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Base Premium (Company)</span><br />{selectedCoverageMember.base_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Base Premium (Employee)</span><br />{selectedCoverageMember.base_premium_on_employee?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Topup Sum Insured</span><br />{selectedCoverageMember.topup_sum_insured?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Topup Premium (Company)</span><br />{selectedCoverageMember.topup_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Topup Premium (Employee)</span><br />{selectedCoverageMember.topup_premium_on_employee?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Parent Sum Insured</span><br />{selectedCoverageMember.parent_sum_insured?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Parent Premium (Company)</span><br />{selectedCoverageMember.parent_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Parent Premium (Employee)</span><br />{selectedCoverageMember.parent_premium_on_employee?.toLocaleString() || '-'}</div>
                                        </>}
                                        {activeTable === 'deletion' && <>
                                            <div><span className="font-semibold">Refund Base Premium (Company)</span><br />{selectedCoverageMember.refund_base_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Refund Base Premium (Employee)</span><br />{selectedCoverageMember.refund_base_premium_on_employee?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Refund Topup Premium (Company)</span><br />{selectedCoverageMember.refund_topup_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Refund Topup Premium (Employee)</span><br />{selectedCoverageMember.refund_topup_premium_on_employee?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Refund Parent Premium (Company)</span><br />{selectedCoverageMember.refund_parent_premium_on_company?.toLocaleString() || '-'}</div>
                                            <div><span className="font-semibold">Refund Parent Premium (Employee)</span><br />{selectedCoverageMember.refund_parent_premium_on_employee?.toLocaleString() || '-'}</div>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
