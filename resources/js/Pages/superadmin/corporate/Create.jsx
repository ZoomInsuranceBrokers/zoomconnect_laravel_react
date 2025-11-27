import React, { useRef, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";
import { useTheme } from "../../../Context/ThemeContext";

export default function Create({ labels, groups, users }) {
    const { darkMode } = useTheme();
    const salesRms = users;
    const serviceRms = users;

    // Get backend errors from Inertia
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        display_name: "",
        phone: "",
        email: "",
        slug: "",
        referred_by: "",
        source: "",
        group_id: "",
        sales_rm_id: "",
        service_rm_id: "",
        label_id: "",
        members: [{ full_name: "", phone: "", email: "" }],
        logo: null,
        logo_url: "",
        documents: [],
        address_line1: "",
        address_line2: "",
        pincode: "",
        city: "",
        state: "",
    });

    // Only for client-side validation
    const [localErrors, setLocalErrors] = useState({});

    // Logo upload
    const logoInputRef = useRef();
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setData("logo", file);
            setData("logo_url", URL.createObjectURL(file));
        }
    };
    const removeLogo = () => {
        setData("logo", null);
        setData("logo_url", "");
        logoInputRef.current.value = "";
    };

    // Document upload
    const docInputRef = useRef();
    const handleDocumentChange = (e) => {
        const files = Array.from(e.target.files);
        setData("documents", files);
    };
    const removeDocument = (idx) => {
        const newDocs = [...data.documents];
        newDocs.splice(idx, 1);
        setData("documents", newDocs);
    };

    // Member change
    const handleMemberChange = (idx, field, value) => {
        const updated = [...data.members];
        updated[idx][field] = value;
        setData("members", updated);
    };

    // Custom select style for RM dropdowns
    const selectMenuClass = `w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#934790] transition text-sm ${
        darkMode
            ? "border-gray-600 bg-gray-700 text-gray-200"
            : "border-gray-300 bg-white text-gray-900"
    }`;

    // Client-side validation
    const validate = () => {
        const newErrors = {};

        if (!data.display_name) newErrors.display_name = "Display Name is required";
        if (!data.slug) newErrors.slug = "Slug is required";
        if (!data.referred_by) newErrors.referred_by = "POSP/Referred By is required";
        if (!data.sales_rm_id) newErrors.sales_rm_id = "Sales RM is required";
        if (!data.service_rm_id) newErrors.service_rm_id = "Service RM is required";
        if (!data.label_id) newErrors.label_id = "Label is required";
        if (!data.email) newErrors.email = "Email is required";
        if (!data.members[0].full_name) newErrors["members.0.full_name"] = "Full name is required";
        if (!data.members[0].email) newErrors["members.0.email"] = "Email is required";
        if (!data.address_line1) newErrors.address_line1 = "Line 1 is required";
        if (!data.pincode) newErrors.pincode = "Pincode is required";
        if (!data.city) newErrors.city = "City is required";
        if (!data.state) newErrors.state = "State is required";

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Prefer backend error if present
    const getError = (field) => errors[field] || localErrors[field];

    // Show all backend errors (not just field errors)
    const renderAllBackendErrors = () => {
        if (!errors) return null;
        return Object.keys(errors).map((key) =>
            Array.isArray(errors[key])
                ? errors[key].map((msg, i) => (
                      <div key={key + i} className="text-red-600 text-[9px] md:text-xs mb-1 text-center">
                          {msg}
                      </div>
                  ))
                : (
                    <div key={key} className="text-red-600 text-[9px] md:text-xs mb-1 text-center">
                        {errors[key]}
                    </div>
                )
        );
    };

    return (
        <SuperAdminLayout>
            <Head title="Add Customer" />
            <div className={`max-w-6xl mx-auto py-4 md:py-8 px-3 md:px-0 ${
                darkMode ? "text-gray-200" : "text-gray-900"
            }`}>
                {/* Info Alert */}
                <div className={`rounded-lg p-2 md:p-3 mb-4 md:mb-6 flex items-start gap-2 ${
                    darkMode
                        ? "bg-blue-900/20 border border-blue-800"
                        : "bg-blue-50 border border-blue-200"
                }`}>
                    <svg className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 ${
                        darkMode ? "text-blue-400" : "text-blue-400"
                    }`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span className={`text-[10px] md:text-xs ${
                        darkMode ? "text-blue-300" : "text-blue-900"
                    }`}>
                        Please add accurate information so that you can give access to your customers and run campaigns effectively.
                    </span>
                </div>

                {/* Show all backend errors at the top */}
                {renderAllBackendErrors()}

                {/* Step 1 */}
                <h2 className={`text-base md:text-lg font-bold mb-2 md:mb-4 ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                }`}>1. Add customer details</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (!validate()) return;
                        post(route("corporate.store"));
                    }}
                    className={`rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-8 ${
                        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                    }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-[10px] md:text-sm">
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Display Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                value={data.display_name}
                                onChange={e => setData("display_name", e.target.value)}
                            />
                            {getError("display_name") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("display_name")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">Phone</label>
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                value={data.phone}
                                onChange={e => setData("phone", e.target.value)}
                            />
                            {getError("phone") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("phone")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                value={data.email}
                                onChange={e => setData("email", e.target.value)}
                            />
                            {getError("email") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("email")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                value={data.slug}
                                onChange={e => setData("slug", e.target.value)}
                            />
                            {getError("slug") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("slug")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                POSP/Referred By <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                value={data.referred_by}
                                onChange={e => setData("referred_by", e.target.value)}
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>
                            {getError("referred_by") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("referred_by")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">Source</label>
                            <input
                                type="text"
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                }`}
                                value={data.source}
                                onChange={e => setData("source", e.target.value)}
                            />
                            {getError("source") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("source")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Sales RM <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                value={data.sales_rm_id}
                                onChange={e => setData("sales_rm_id", e.target.value)}
                            >
                                <option value="">Select Sales RM</option>
                                {salesRms.map(user => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>
                            {getError("sales_rm_id") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("sales_rm_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Service RM <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                value={data.service_rm_id}
                                onChange={e => setData("service_rm_id", e.target.value)}
                            >
                                <option value="">Select Service RM</option>
                                {serviceRms.map(user => (
                                    <option key={user.user_id} value={user.user_id}>
                                        {user.full_name}
                                    </option>
                                ))}
                            </select>
                            {getError("service_rm_id") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("service_rm_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">
                                Label <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                value={data.label_id}
                                onChange={e => setData("label_id", e.target.value)}
                            >
                                <option value="">Select Label</option>
                                {labels.map(label => (
                                    <option key={label.id} value={label.id}>
                                        {label.label}
                                    </option>
                                ))}
                            </select>
                            {getError("label_id") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("label_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 md:mb-2 font-medium text-[9px] md:text-sm">Customer group</label>
                            <select
                                className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-gray-200"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                value={data.group_id}
                                onChange={e => setData("group_id", e.target.value)}
                            >
                                <option value="">Select Group</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.group_name}
                                    </option>
                                ))}
                            </select>
                            {getError("group_id") && (
                                <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("group_id")}</div>
                            )}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <h2 className={`text-base md:text-lg font-bold mt-6 md:mt-10 mb-2 md:mb-4 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>2. Add customer members</h2>
                    <div className={`rounded-lg md:rounded-xl shadow p-3 md:p-6 mb-6 md:mb-8 ${
                        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                    }`}>
                        <h3 className={`font-semibold text-sm md:text-base mb-3 md:mb-4 ${
                            darkMode ? "text-gray-200" : "text-gray-900"
                        }`}>Member details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-[10px] md:text-sm">
                            <div>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                        darkMode
                                            ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                    }`}
                                    placeholder="Full name*"
                                    value={data.members[0].full_name}
                                    onChange={e => handleMemberChange(0, "full_name", e.target.value)}
                                />
                                {getError("members.0.full_name") && (
                                    <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("members.0.full_name")}</div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                        darkMode
                                            ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                    }`}
                                    placeholder="Phone"
                                    value={data.members[0].phone}
                                    onChange={e => handleMemberChange(0, "phone", e.target.value)}
                                />
                                {getError("members.0.phone") && (
                                    <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("members.0.phone")}</div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    className={`w-full border rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                        darkMode
                                            ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                            : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                    }`}
                                    placeholder="Email*"
                                    value={data.members[0].email}
                                    onChange={e => handleMemberChange(0, "email", e.target.value)}
                                />
                                {getError("members.0.email") && (
                                    <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("members.0.email")}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <h2 className={`text-lg md:text-xl font-bold mt-6 md:mt-10 mb-2 md:mb-4 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>3. Upload customer documents</h2>
                    <div className={`rounded-lg md:rounded-xl shadow p-3 md:p-6 mb-6 md:mb-8 ${
                        darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                    }`}>
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            <div className={`flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 border border-dashed rounded-lg flex-shrink-0 ${
                                darkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"
                            }`}>
                                <svg width="40" height="40" viewBox="0 0 56 56" fill="none" className="md:w-14 md:h-14">
                                    <rect width="56" height="56" rx="12" fill={darkMode ? "#1f2937" : "#F3F4F6"} />
                                    <path d="M28 38V18M28 18L22 24M28 18L34 24" stroke={darkMode ? "#6b7280" : "#A0AEC0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className={`text-[8px] md:text-sm mt-1 md:mt-2 text-center ${
                                    darkMode ? "text-gray-400" : "text-gray-400"
                                }`}>Upload docs</span>
                            </div>
                            <div className="flex-1 w-full">
                                <div className={`font-semibold text-xs md:text-base mb-1 ${
                                    darkMode ? "text-gray-200" : "text-gray-900"
                                }`}>Upload documents</div>
                                <div className={`text-[9px] md:text-sm mb-2 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                    Drop files here or click{" "}
                                    <label className="text-[#934790] underline cursor-pointer">
                                        browse
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            ref={docInputRef}
                                            onChange={handleDocumentChange}
                                        />
                                    </label>{" "}
                                    through your machine
                                </div>
                                <div className={`border border-dashed rounded-lg p-2 md:p-4 ${
                                    darkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"
                                }`}>
                                    {data.documents.length === 0 && (
                                        <span className={`text-[9px] md:text-sm ${
                                            darkMode ? "text-gray-400" : "text-gray-400"
                                        }`}>No files selected</span>
                                    )}
                                    {data.documents.length > 0 && (
                                        <ul>
                                            {data.documents.map((file, idx) => (
                                                <li key={idx} className="flex items-center justify-between py-1">
                                                    <span className={`text-[9px] md:text-sm truncate ${
                                                        darkMode ? "text-gray-200" : "text-gray-700"
                                                    }`}>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500 hover:text-red-700 text-[9px] md:text-sm whitespace-nowrap"
                                                        onClick={() => removeDocument(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <h2 className={`text-lg md:text-xl font-bold mt-6 md:mt-10 mb-2 md:mb-4 ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>4. Company logo</h2>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8 text-[10px] md:text-sm ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                    }`}>
                        <div className={`rounded-lg md:rounded-xl shadow p-3 md:p-6 flex flex-col items-center justify-center ${
                            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                        }`}>
                            {!data.logo_url ? (
                                <label className={`flex flex-col items-center justify-center w-32 h-24 md:w-48 md:h-48 border border-dashed rounded-lg cursor-pointer ${
                                    darkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"
                                }`}>
                                    <svg width="40" height="40" viewBox="0 0 56 56" fill="none" className="md:w-14 md:h-14">
                                        <rect width="56" height="56" rx="12" fill={darkMode ? "#1f2937" : "#F3F4F6"} />
                                        <path d="M28 38V18M28 18L22 24M28 18L34 24" stroke={darkMode ? "#6b7280" : "#A0AEC0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className={`text-[8px] md:text-sm mt-1 md:mt-2 ${
                                        darkMode ? "text-gray-400" : "text-gray-400"
                                    }`}>Upload Logo</span>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        className="hidden"
                                        ref={logoInputRef}
                                        onChange={handleLogoChange}
                                    />
                                </label>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={data.logo_url}
                                        alt="Logo Preview"
                                        className="w-20 h-12 md:w-32 md:h-16 object-contain rounded mb-2 border"
                                    />
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-[8px] md:text-xs"
                                        onClick={removeLogo}
                                    >
                                        Remove Logo
                                    </button>
                                </div>
                            )}
                            <div className={`text-[8px] md:text-xs text-center mt-1 md:mt-2 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                                Allowed *.jpeg, *.jpg, *.png.
                                <br />
                                Max resolution : 145px X 50px
                            </div>
                        </div>
                        <div className={`rounded-lg md:rounded-xl shadow p-3 md:p-6 ${
                            darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                        }`}>
                            <h3 className={`font-semibold text-xs md:text-base mb-2 md:mb-4 ${
                                darkMode ? "text-gray-200" : "text-gray-900"
                            }`}>Address 1</h3>
                            <div className="flex flex-col gap-2 md:gap-3">
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                                darkMode
                                                    ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                            }`}
                                            placeholder="Line 1*"
                                            value={data.address_line1 || ""}
                                            onChange={e => setData("address_line1", e.target.value)}
                                        />
                                        {getError("address_line1") && (
                                            <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("address_line1")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                                darkMode
                                                    ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                            }`}
                                            placeholder="Line 2"
                                            value={data.address_line2 || ""}
                                            onChange={e => setData("address_line2", e.target.value)}
                                        />
                                        {getError("address_line2") && (
                                            <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("address_line2")}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 md:gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                                darkMode
                                                    ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                            }`}
                                            placeholder="Pincode*"
                                            value={data.pincode || ""}
                                            onChange={async (e) => {
                                                setData("pincode", e.target.value);
                                                if (e.target.value.length === 6) {
                                                    try {
                                                        const res = await fetch(
                                                            `https://api.postalpincode.in/pincode/${e.target.value}`
                                                        );
                                                        const json = await res.json();
                                                        if (
                                                            json[0].Status === "Success" &&
                                                            json[0].PostOffice &&
                                                            json[0].PostOffice.length > 0
                                                        ) {
                                                            setData("city", json[0].PostOffice[0].District);
                                                            setData("state", json[0].PostOffice[0].State);
                                                        }
                                                    } catch (err) {
                                                        // Optionally handle error
                                                    }
                                                }
                                            }}
                                            maxLength={6}
                                        />
                                        {getError("pincode") && (
                                            <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("pincode")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                                darkMode
                                                    ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                            }`}
                                            placeholder="City*"
                                            value={data.city || ""}
                                            onChange={e => setData("city", e.target.value)}
                                        />
                                        {getError("city") && (
                                            <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("city")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className={`border rounded-lg px-2 md:px-3 py-1.5 md:py-2 w-full text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] ${
                                                darkMode
                                                    ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                                                    : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                                            }`}
                                            placeholder="State*"
                                            value={data.state || ""}
                                            onChange={e => setData("state", e.target.value)}
                                        />
                                        {getError("state") && (
                                            <div className="text-red-500 text-[9px] md:text-xs mt-1">{getError("state")}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 md:mt-8 flex justify-end px-0 md:px-0">
                        <button
                            type="submit"
                            className="bg-[#934790] text-white px-4 md:px-8 py-1.5 md:py-2 rounded-lg font-semibold hover:bg-[#6A0066] transition text-xs md:text-sm"
                            disabled={processing}
                        >
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
