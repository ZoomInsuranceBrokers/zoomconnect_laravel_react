import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";

export default function ServicesList({ services = [], vendors = [], categories = [], companies = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [vendorFilter, setVendorFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [modalType, setModalType] = useState("create");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Filter services based on search and filters
    const filteredServices = services.filter((service) => {
        const matchesSearch = !search ||
            service.wellness_name?.toLowerCase().includes(search.toLowerCase()) ||
            service.heading?.toLowerCase().includes(search.toLowerCase()) ||
            service.vendor?.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
            service.category?.category_name?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && (service.status === 1 || service.status === true)) ||
            (statusFilter === "inactive" && (service.status === 0 || service.status === false));

        const matchesVendor = vendorFilter === "all" || service.vendor_id == vendorFilter;
        const matchesCategory = categoryFilter === "all" || service.category_id == categoryFilter;

        return matchesSearch && matchesStatus && matchesVendor && matchesCategory;
    });

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    // Update total pages when filtered services change
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredServices.length / itemsPerPage)));
        setCurrentPage(1);
    }, [filteredServices.length, itemsPerPage]);

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedServices([]);
        } else {
            setSelectedServices(currentItems.map((service) => service.id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual select
    const handleSelectService = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter((id) => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
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

    // Handle create service
    const handleCreate = () => {
        setSelectedService(null);
        setModalType("create");
        setIsModalOpen(true);
    };

    // Handle edit service
    const handleEdit = (service) => {
        setSelectedService(service);
        setModalType("edit");
        setIsModalOpen(true);
    };

    // Handle toggle status
    const handleToggleStatus = (serviceId, currentStatus) => {
        const newStatus = (currentStatus === 1 || currentStatus === true) ? 0 : 1;

        router.put(route("superadmin.wellness.services.toggle-status", serviceId), {
            status: newStatus,
        });
    };

    return (
        <SuperAdminLayout>
            <Head title="Wellness Services" />
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
                            Add Service
                        </button>
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
                            placeholder="Search Services"
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
                        className="px-2 py-1.5 border rounded-lg text-[10px] bg-white border-gray-300"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="all">All Status</option>
                    </select>

                    {/* Vendor Filter */}
                    <select
                        value={vendorFilter}
                        onChange={(e) => setVendorFilter(e.target.value)}
                        className="px-2 py-1.5 border rounded-lg text-[10px] bg-white border-gray-300"
                    >
                        <option value="all">All Vendors</option>
                        {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.vendor_name}
                            </option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-2 py-1.5 border rounded-lg text-[10px] bg-white border-gray-300"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
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
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Heading
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
                            {currentItems.length > 0 ? (
                                currentItems.map((service) => (
                                    <tr
                                        key={service.id}
                                        className={`${
                                            darkMode
                                                ? "hover:bg-gray-700"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedServices.includes(service.id)}
                                                onChange={() => handleSelectService(service.id)}
                                                className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                            />
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(service)}
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
                                            {service.icon_url ? (
                                                <img
                                                    src={service.icon_url}
                                                    alt={service.wellness_name}
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
                                            <div className="font-medium">{service.wellness_name || "-"}</div>
                                            {service.link && (
                                                <a
                                                    href={service.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                                >
                                                    View Link →
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                            {service.vendor?.vendor_name || "-"}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                            {service.category?.category_name || "-"}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                            {service.company_id === 0 ? "All Companies" : service.company?.comp_name || "-"}
                                        </td>
                                        <td className="px-3 py-2 text-[10px] text-gray-500 max-w-xs">
                                            <div className="truncate" title={service.heading}>
                                                {service.heading || "-"}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(service.id, service.status)}
                                                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2 ${
                                                    service.status === 1 || service.status === true
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                <span className="sr-only">Toggle status</span>
                                                <span
                                                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        service.status === 1 || service.status === true
                                                            ? "translate-x-4"
                                                            : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px] text-gray-500">
                                            {formatDate(service.created_at)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-3 py-8 text-center text-gray-500">
                                        {services.length === 0
                                            ? "No services found"
                                            : "No services match your current filters"
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-700">
                            Showing {indexOfFirstItem + 1} to{" "}
                            {Math.min(indexOfLastItem, filteredServices.length)} of{" "}
                            {filteredServices.length} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-[10px] text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <ServiceModal
                    service={selectedService}
                    modalType={modalType}
                    vendors={vendors}
                    categories={categories}
                    companies={companies}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </SuperAdminLayout>
    );
}

// Service Modal Component
function ServiceModal({ service, modalType, vendors, categories, companies, onClose }) {
    const [formData, setFormData] = useState({
        vendor_id: service?.vendor_id || "",
        category_id: service?.category_id || "",
        company_id: service?.company_id || 0,
        wellness_name: service?.wellness_name || "",
        icon_url: service?.icon_url || "",
        link: service?.link || "",
        heading: service?.heading || "",
        description: service?.description || "",
        status: service?.status || 1,
    });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(service?.icon_url || "");
    const [errors, setErrors] = useState({});

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        setErrors({ ...errors, icon: "" });

        if (file) {
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                setErrors({
                    ...errors,
                    icon: "Please select only JPEG, PNG, or JPG files.",
                });
                e.target.value = "";
                return;
            }

            if (file.size > 2048 * 1024) {
                setErrors({
                    ...errors,
                    icon: "File size must not exceed 2MB.",
                });
                e.target.value = "";
                return;
            }

            setIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        // Basic validation
        if (!formData.vendor_id) {
            setErrors({ ...errors, vendor_id: "Vendor is required." });
            return;
        }
        if (!formData.category_id) {
            setErrors({ ...errors, category_id: "Category is required." });
            return;
        }
        if (!formData.wellness_name.trim()) {
            setErrors({ ...errors, wellness_name: "Wellness name is required." });
            return;
        }
        if (!formData.heading.trim()) {
            setErrors({ ...errors, heading: "Heading is required." });
            return;
        }

        const submitData = new FormData();
        submitData.append("vendor_id", formData.vendor_id);
        submitData.append("category_id", formData.category_id);
        submitData.append("company_id", formData.company_id || 0);
        submitData.append("wellness_name", formData.wellness_name);
        submitData.append("link", formData.link || "");
        submitData.append("heading", formData.heading);
        submitData.append("description", formData.description || "");

        if (iconFile) {
            submitData.append("icon", iconFile);
        }

        if (modalType === "create") {
            router.post(route("superadmin.wellness.services.store"), submitData, {
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
                route("superadmin.wellness.services.update", service.id),
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {modalType === "create" ? "Add Service" : "Edit Service"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg
                            className="w-6 h-6"
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Vendor and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vendor *
                            </label>
                            <select
                                value={formData.vendor_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        vendor_id: e.target.value,
                                    });
                                    setErrors({ ...errors, vendor_id: "" });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                    errors.vendor_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            >
                                <option value="">Select Vendor</option>
                                {vendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.vendor_name}
                                    </option>
                                ))}
                            </select>
                            {errors.vendor_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.vendor_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        category_id: e.target.value,
                                    });
                                    setErrors({ ...errors, category_id: "" });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                    errors.category_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Company and Wellness Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                            </label>
                            <select
                                value={formData.company_id}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        company_id: e.target.value,
                                    });
                                }}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent border-gray-300"
                            >
                                <option value={0}>All Companies</option>
                                {companies.map((company) => (
                                    <option key={company.comp_id} value={company.comp_id}>
                                        {company.comp_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Wellness Name *
                            </label>
                            <input
                                type="text"
                                value={formData.wellness_name}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        wellness_name: e.target.value,
                                    });
                                    setErrors({ ...errors, wellness_name: "" });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                    errors.wellness_name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                            {errors.wellness_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.wellness_name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Icon and Link */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon
                            </label>
                            <div className="flex items-center gap-4">
                                {iconPreview && (
                                    <img
                                        src={iconPreview}
                                        alt="Icon preview"
                                        className="w-12 h-12 rounded-lg object-cover border"
                                    />
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,.jpeg,.jpg,.png"
                                        onChange={handleIconChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent text-sm ${
                                            errors.icon
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.icon && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.icon}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Link
                            </label>
                            <input
                                type="url"
                                value={formData.link}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        link: e.target.value,
                                    });
                                    setErrors({ ...errors, link: "" });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                    errors.link
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="https://example.com"
                            />
                            {errors.link && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.link}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Heading */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heading *
                        </label>
                        <input
                            type="text"
                            value={formData.heading}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    heading: e.target.value,
                                });
                                setErrors({ ...errors, heading: "" });
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                errors.heading
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.heading && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.heading}
                            </p>
                        )}
                    </div>

                    {/* Row 5: Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                });
                                setErrors({ ...errors, description: "" });
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent ${
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            rows="3"
                            maxLength="1000"
                            placeholder="Optional description for the service..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.description.length}/1000 characters
                        </p>
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-[#934790] hover:bg-[#6A0066] text-white py-2 px-4 rounded-lg font-medium"
                        >
                            {modalType === "create" ? "Create Service" : "Update Service"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
