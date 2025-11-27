import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { Head, router } from "@inertiajs/react";
import { useTheme } from "../../../Context/ThemeContext";

export default function CategoryList({ categories = [] }) {
    const { darkMode } = useTheme();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalType, setModalType] = useState("create");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Filter categories based on search and status
    const filteredCategories = categories.filter((category) => {
        const matchesSearch = !search ||
            category.category_name?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && (category.status === 1 || category.status === true)) ||
            (statusFilter === "inactive" && (category.status === 0 || category.status === false));

        return matchesSearch && matchesStatus;
    });

    // Calculate pagination data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    // Update total pages when filtered categories change
    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredCategories.length / itemsPerPage)));
        setCurrentPage(1);
    }, [filteredCategories.length, itemsPerPage]);

    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(currentItems.map((category) => category.id));
        }
        setSelectAll(!selectAll);
    };

    // Handle individual select
    const handleSelectCategory = (categoryId) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
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

    // Handle create category
    const handleCreate = () => {
        setSelectedCategory(null);
        setModalType("create");
        setIsModalOpen(true);
    };

    // Handle edit category
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setModalType("edit");
        setIsModalOpen(true);
    };

    // Handle toggle status
    const handleToggleStatus = (categoryId, currentStatus) => {
        const newStatus = (currentStatus === 1 || currentStatus === true) ? 0 : 1;

        router.put(route("superadmin.wellness.category.toggle-status", categoryId), {
            status: newStatus,
        });
    };

    return (
        <SuperAdminLayout>
            <Head title="Category List" />
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
                            Add Category
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
                            placeholder="Search Categories"
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
                                darkMode ? "bg-gray-800" : "bg-gray-200"
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
                                    Category Name
                                </th>
                                <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                    Description
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
                                currentItems.map((category) => (
                                    <tr
                                        key={category.id}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-800 hover:bg-gray-700"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    >
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                                className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200"
                                            />
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-[10px]">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleEdit(category)}
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
                                            {category.icon_url ? (
                                                <img
                                                    src={category.icon_url}
                                                    alt={category.category_name}
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
                                        <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                            darkMode ? "text-gray-200" : "text-gray-900"
                                        }`}>
                                            {category.category_name || "-"}
                                        </td>
                                        <td className={`px-3 py-2 text-[10px] max-w-xs ${
                                            darkMode ? "text-gray-400" : "text-gray-500"
                                        }`}>
                                            <div className="truncate" title={category.description}>
                                                {category.description || "-"}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(category.id, category.status)}
                                                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2 ${
                                                    category.status === 1 || category.status === true
                                                        ? "bg-[#934790]"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                <span className="sr-only">Toggle status</span>
                                                <span
                                                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        category.status === 1 || category.status === true
                                                            ? "translate-x-4"
                                                            : "translate-x-0"
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className={`px-3 py-2 whitespace-nowrap text-[10px] ${
                                            darkMode ? "text-gray-400" : "text-gray-500"
                                        }`}>
                                            {formatDate(category.created_at)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className={`px-3 py-8 text-center ${
                                        darkMode ? "text-gray-400 bg-gray-800" : "text-gray-500"
                                    }`}>
                                        {categories.length === 0
                                            ? "No categories found"
                                            : "No categories match your current filters"
                                        }
                                    </td>
                                </tr>
                            )}
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
                            {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
                            {filteredCategories.length} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
                <CategoryModal
                    category={selectedCategory}
                    modalType={modalType}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </SuperAdminLayout>
    );
}

// Category Modal Component
function CategoryModal({ category, modalType, onClose }) {
    const [formData, setFormData] = useState({
        category_name: category?.category_name || "",
        icon_url: category?.icon_url || "",
        description: category?.description || "",
        status: category?.status || 1,
    });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(category?.icon_url || "");
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

        if (!formData.category_name.trim()) {
            setErrors({ category_name: "Category name is required." });
            return;
        }

        const submitData = new FormData();
        submitData.append("category_name", formData.category_name);
        submitData.append("description", formData.description || "");

        if (iconFile) {
            submitData.append("icon", iconFile);
        }

        if (modalType === "create") {
            router.post(route("superadmin.wellness.category.store"), submitData, {
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
                route("superadmin.wellness.category.update", category.id),
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {modalType === "create" ? "Add Category" : "Edit Category"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg
                            className="w-5 h-5"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            value={formData.category_name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    category_name: e.target.value,
                                });
                                setErrors({ ...errors, category_name: "" });
                            }}
                            className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:ring-2 focus:ring-[#934790] focus:border-transparent transition ${
                                errors.category_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                        {errors.category_name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Icon
                        </label>
                        <div className="flex items-start gap-3">
                            {iconPreview && (
                                <img
                                    src={iconPreview}
                                    alt="Icon preview"
                                    className="w-12 h-12 rounded-lg object-cover border flex-shrink-0"
                                />
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,.jpeg,.jpg,.png"
                                    onChange={handleIconChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent text-[12px] transition ${
                                        errors.icon
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    JPEG, PNG or JPG. Max 2MB
                                </p>
                                {errors.icon && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.icon}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                            className={`w-full px-3 py-2 border rounded-lg text-[13px] focus:ring-2 focus:ring-[#934790] focus:border-transparent transition ${
                                errors.description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            rows="2"
                            maxLength="1000"
                            placeholder="Optional description..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.description.length}/1000
                        </p>
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                        <button
                            type="submit"
                            className="flex-1 bg-[#934790] hover:bg-[#6A0066] text-white py-2 px-4 rounded-lg font-medium text-sm transition duration-200"
                        >
                            {modalType === "create" ? "Create" : "Update"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
