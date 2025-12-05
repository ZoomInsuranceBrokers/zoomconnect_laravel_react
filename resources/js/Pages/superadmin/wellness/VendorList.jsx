import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";
import { Link } from "@inertiajs/react";

export default function VendorList({ vendors = [] }) {

    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [modalType, setModalType] = useState("create"); // "create" or "edit"

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Filter vendors based on search and status
    const filteredVendors = vendors.filter((vendor) => {
        const matchesSearch =
            !search ||
            vendor.vendor_name?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
                (vendor.is_active === 1 || vendor.is_active === true)) ||
            (statusFilter === "inactive" &&
                (vendor.is_active === 0 || vendor.is_active === false));

        return matchesSearch && matchesStatus;
    });

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVendors.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    // Update total pages when filtered vendors change
    useEffect(() => {
        setTotalPages(
            Math.max(1, Math.ceil(filteredVendors.length / itemsPerPage))
        );
        setCurrentPage(1);
    }, [filteredVendors.length, itemsPerPage]);

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedVendors([]);
        } else {
            setSelectedVendors(currentItems.map((vendor) => vendor.id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual select
    const handleSelectVendor = (vendorId) => {
        if (selectedVendors.includes(vendorId)) {
            setSelectedVendors(selectedVendors.filter((id) => id !== vendorId));
        } else {
            setSelectedVendors([...selectedVendors, vendorId]);
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

    // Handle create vendor
    const handleCreate = () => {
        setSelectedVendor(null);
        setModalType("create");
        setIsModalOpen(true);
    };

    // Handle edit vendor
    const handleEdit = (vendor) => {
        setSelectedVendor(vendor);
        setModalType("edit");
        setIsModalOpen(true);
    };

    // Handle delete vendor
    // const handleDelete = (vendorId) => {
    //     if (confirm("Are you sure you want to delete this vendor?")) {
    //         router.delete(route("wellness.vendor.destroy", vendorId));
    //     }
    // };

    // Handle toggle status
    const handleToggleStatus = (vendorId, currentStatus) => {
        // Convert boolean to integer for the API call
        const newStatus = (currentStatus === 1 || currentStatus === true) ? 0 : 1;

        router.put(route("wellness.vendor.toggle-status", vendorId), {
            is_active: newStatus,
        });
    };

    return (
        <SuperAdminLayout>
            <Head title="Vendor List" />
            <div
                className={`p-4 h-full overflow-y-auto ${
                    darkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCreate}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1"
                        >
                            <span>+</span>
                            Add Vendor
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-[12px] md:text-[13px] font-medium">
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5"
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
                            placeholder="Search Vendors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`w-48 pl-9 pr-3 py-1.5 border rounded-lg text-[10px] focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                darkMode
                                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                            }`}
                        />
                        <svg
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                                <th className="px-3 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                    />
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Logo
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Vendor Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Created Date
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                        >
                            {currentItems.map((vendor) => (
                                <tr
                                    key={vendor.id}
                                    className={`${
                                        darkMode
                                            ? "hover:bg-gray-700"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedVendors.includes(
                                                vendor.id
                                            )}
                                            onChange={() =>
                                                handleSelectVendor(vendor.id)
                                            }
                                            className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                        />
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(vendor)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                                                    <path d="M18.5 2.5a2 2 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        {vendor.logo_url ? (
                                            <img
                                                src={vendor.logo_url}
                                                alt={vendor.vendor_name}
                                                className="w-8 h-8 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-900">
                                        {vendor.vendor_name || "-"}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(
                                                    vendor.id,
                                                    vendor.is_active
                                                )
                                            }
                                            className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2 ${
                                                vendor.is_active === 1 || vendor.is_active === true
                                                    ? "bg-[#934790]"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            <span className="sr-only">
                                                Toggle status
                                            </span>
                                            <span
                                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    vendor.is_active === 1 || vendor.is_active === true
                                                        ? "translate-x-4"
                                                        : "translate-x-0"
                                                }`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                        {formatDate(vendor.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={`flex items-center justify-between px-4 py-3 border-t ${
                    darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                            Showing {indexOfFirstItem + 1} to{" "}
                            {Math.min(indexOfLastItem, filteredVendors.length)}{" "}
                            of {filteredVendors.length} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className={`px-2 py-1 text-[10px] rounded disabled:opacity-50 ${
                                darkMode
                                    ? "bg-gray-700 text-gray-300 border border-gray-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            Previous
                        </button>
                        <span className={`text-[10px] ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className={`px-2 py-1 text-[10px] rounded disabled:opacity-50 ${
                                darkMode
                                    ? "bg-gray-700 text-gray-300 border border-gray-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <VendorModal
                    vendor={selectedVendor}
                    modalType={modalType}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </SuperAdminLayout>
    );
}

// Vendor Modal Component
function VendorModal({ vendor, modalType, onClose }) {
    const [formData, setFormData] = useState({
        vendor_name: vendor?.vendor_name || "",
        logo_url: vendor?.logo_url || "",
        is_active: vendor?.is_active || 1,
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(vendor?.logo_url || "");
    const [errors, setErrors] = useState({});

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setErrors({ ...errors, logo: "" });

        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                setErrors({
                    ...errors,
                    logo: "Please select only JPEG, PNG, or JPG files.",
                });
                e.target.value = "";
                return;
            }

            if (file.size > 2048 * 1024) {
                setErrors({
                    ...errors,
                    logo: "File size must not exceed 2MB.",
                });
                e.target.value = "";
                return;
            }

            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        if (!formData.vendor_name.trim()) {
            setErrors({ vendor_name: "Vendor name is required." });
            return;
        }

        const submitData = new FormData();
        submitData.append("vendor_name", formData.vendor_name);

        if (logoFile) {
            submitData.append("logo", logoFile);
        }

        if (modalType === "create") {
            router.post(route("superadmin.wellness.vendor.store"), submitData, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
            });
        } else {
            submitData.append("_method", "PUT");
            router.post(
                route("superadmin.wellness.vendor.update", vendor.id),
                submitData,
                {
                    onSuccess: () => {
                        onClose();
                    },
                    onError: (errors) => {
                        setErrors(errors);
                    },
                }
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {modalType === "create" ? "Add Vendor" : "Edit Vendor"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            Vendor Name *
                        </label>
                        <input
                            type="text"
                            value={formData.vendor_name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    vendor_name: e.target.value,
                                });
                                setErrors({ ...errors, vendor_name: "" });
                            }}
                            className={`w-full px-4 py-3 border rounded-lg text-base focus:ring-2 focus:ring-[#934790] focus:border-transparent transition ${
                                errors.vendor_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.vendor_name && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.vendor_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            Logo
                        </label>
                        <div className="flex items-start gap-6">
                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 flex-shrink-0"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,.jpeg,.jpg,.png"
                                    onChange={handleLogoChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent text-base transition ${
                                        errors.logo
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                <p className="text-xs text-gray-600 mt-2">
                                    Upload JPEG, PNG, or JPG files only. Max file size: 2MB
                                </p>
                                {errors.logo && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                        <button
                            type="submit"
                            className="flex-1 bg-[#934790] hover:bg-[#6A0066] text-white py-2 px-4 rounded-lg font-semibold text-sm transition duration-200"
                        >
                            {modalType === "create" ? "Create Vendor" : "Update Vendor"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold text-sm transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
