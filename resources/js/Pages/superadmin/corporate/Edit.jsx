import React, { useRef, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function Edit({ company, labels, groups, users }) {
    const salesRms = users;
    const serviceRms = users;
    const { errors } = usePage().props;

    // Prefill form with company data
    const { data, setData, post, processing } = useForm({
        display_name: company?.display_name || "",
        phone: company?.phone || "",
        email: company?.email || "",
        slug: company?.slug || "",
        referred_by: company?.referred_by || "",
        source: company?.source || "",
        group_id: company?.group_id || "",
        sales_rm_id: company?.sales_rm_id || "",
        service_rm_id: company?.service_rm_id || "",
        label_id: company?.label_id || "",
        members: company?.members || [{ full_name: "", phone: "", email: "" }],
        logo: null,
        logo_url: company?.logo_url || "",
        documents: [],
        address_line1: company?.address_line1 || "",
        address_line2: company?.address_line2 || "",
        pincode: company?.pincode || "",
        city: company?.city || "",
        state: company?.state || "",
        _method: 'PUT', // Laravel method spoofing for file uploads
    });

    const [localErrors, setLocalErrors] = useState({});
    const logoInputRef = useRef();
    const docInputRef = useRef();

    // Logo upload
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

    // Validation and error helpers
    const selectMenuClass =
        "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#934790] transition text-sm bg-white";
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
    const getError = (field) => errors[field] || localErrors[field];
    const renderAllBackendErrors = () => {
        if (!errors) return null;
        return Object.keys(errors).map((key) =>
            Array.isArray(errors[key])
                ? errors[key].map((msg, i) => (
                      <div key={key + i} className="text-red-600 text-sm mb-1 text-center">
                          {msg}
                      </div>
                  ))
                : (
                    <div key={key} className="text-red-600 text-sm mb-1 text-center">
                        {errors[key]}
                    </div>
                )
        );
    };

    // Main render
    return (
        <SuperAdminLayout>
            <Head title="Edit Customer" />
            <div className="max-w-6xl mx-auto py-8">
                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    <span className="text-xs text-blue-900">
                        Please update accurate information so that you can give access to your customers and run campaigns effectively.
                    </span>
                </div>
                {renderAllBackendErrors()}
                {/* Step 1 */}
                <h2 className="text-xl font-bold mb-2">1. Edit customer details</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (!validate()) return;
                        // Use post() with _method: PUT for file uploads
                        post(route("corporate.update", company.id));
                    }}
                    className="bg-white rounded-2xl shadow-lg p-8 mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <label className="block mb-1">
                                Display Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.display_name}
                                onChange={e => setData("display_name", e.target.value)}
                            />
                            {getError("display_name") && (
                                <div className="text-red-500 text-xs mt-1">{getError("display_name")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">Phone</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.phone}
                                onChange={e => setData("phone", e.target.value)}
                            />
                            {getError("phone") && (
                                <div className="text-red-500 text-xs mt-1">{getError("phone")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.email}
                                onChange={e => setData("email", e.target.value)}
                            />
                            {getError("email") && (
                                <div className="text-red-500 text-xs mt-1">{getError("email")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.slug}
                                onChange={e => setData("slug", e.target.value)}
                            />
                            {getError("slug") && (
                                <div className="text-red-500 text-xs mt-1">{getError("slug")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                POSP/Referred By <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={selectMenuClass}
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
                                <div className="text-red-500 text-xs mt-1">{getError("referred_by")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">Source</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                value={data.source}
                                onChange={e => setData("source", e.target.value)}
                            />
                            {getError("source") && (
                                <div className="text-red-500 text-xs mt-1">{getError("source")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Sales RM <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={selectMenuClass}
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
                                <div className="text-red-500 text-xs mt-1">{getError("sales_rm_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Service RM <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={selectMenuClass}
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
                                <div className="text-red-500 text-xs mt-1">{getError("service_rm_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Label <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={selectMenuClass}
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
                                <div className="text-red-500 text-xs mt-1">{getError("label_id")}</div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">Customer group</label>
                            <select
                                className={selectMenuClass}
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
                                <div className="text-red-500 text-xs mt-1">{getError("group_id")}</div>
                            )}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <h2 className="text-xl font-bold mt-10 mb-2">2. Add customer members</h2>
                    <div className="bg-white rounded-xl shadow p-6 mb-8">
                        <h3 className="font-semibold text-base mb-4">Member details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Full name*"
                                    value={data.members[0].full_name}
                                    onChange={e => handleMemberChange(0, "full_name", e.target.value)}
                                />
                                {getError("members.0.full_name") && (
                                    <div className="text-red-500 text-xs mt-1">{getError("members.0.full_name")}</div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Phone"
                                    value={data.members[0].phone}
                                    onChange={e => handleMemberChange(0, "phone", e.target.value)}
                                />
                                {getError("members.0.phone") && (
                                    <div className="text-red-500 text-xs mt-1">{getError("members.0.phone")}</div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Email*"
                                    value={data.members[0].email}
                                    onChange={e => handleMemberChange(0, "email", e.target.value)}
                                />
                                {getError("members.0.email") && (
                                    <div className="text-red-500 text-xs mt-1">{getError("members.0.email")}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <h2 className="text-xl font-bold mt-10 mb-2">3. Upload customer documents</h2>
                    <div className="bg-white rounded-xl shadow p-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center w-32 h-32 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                                    <rect width="56" height="56" rx="12" fill="#F3F4F6" />
                                    <path d="M28 38V18M28 18L22 24M28 18L34 24" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-gray-400 text-sm mt-2 text-center">Upload documents</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-base mb-1">Upload documents</div>
                                <div className="text-sm text-gray-500 mb-2">
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
                                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    {data.documents.length === 0 && (
                                        <span className="text-gray-400 text-sm">No files selected</span>
                                    )}
                                    {data.documents.length > 0 && (
                                        <ul>
                                            {data.documents.map((file, idx) => (
                                                <li key={idx} className="flex items-center justify-between py-1">
                                                    <span className="text-gray-700 text-sm">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500 hover:text-red-700"
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
                    <h2 className="text-xl font-bold mt-10 mb-2">4. Company logo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                            {!data.logo_url ? (
                                <label className="flex flex-col items-center justify-center w-48 h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer">
                                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                                        <rect width="56" height="56" rx="12" fill="#F3F4F6" />
                                        <path d="M28 38V18M28 18L22 24M28 18L34 24" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="text-gray-400 text-sm mt-2">Upload Logo</span>
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
                                        className="w-32 h-16 object-contain rounded mb-2 border"
                                    />
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-xs"
                                        onClick={removeLogo}
                                    >
                                        Remove Logo
                                    </button>
                                </div>
                            )}
                            <div className="text-xs text-gray-500 text-center mt-2">
                                Allowed *.jpeg, *.jpg, *.png.
                                <br />
                                Max resolution : 145px X 50px
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6">
                            <h3 className="font-semibold text-base mb-4">Address 1</h3>
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                                            placeholder="Line 1*"
                                            value={data.address_line1 || ""}
                                            onChange={e => setData("address_line1", e.target.value)}
                                        />
                                        {getError("address_line1") && (
                                            <div className="text-red-500 text-xs mt-1">{getError("address_line1")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                                            placeholder="Line 2"
                                            value={data.address_line2 || ""}
                                            onChange={e => setData("address_line2", e.target.value)}
                                        />
                                        {getError("address_line2") && (
                                            <div className="text-red-500 text-xs mt-1">{getError("address_line2")}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
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
                                            <div className="text-red-500 text-xs mt-1">{getError("pincode")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                                            placeholder="City*"
                                            value={data.city || ""}
                                            onChange={e => setData("city", e.target.value)}
                                        />
                                        {getError("city") && (
                                            <div className="text-red-500 text-xs mt-1">{getError("city")}</div>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                                            placeholder="State*"
                                            value={data.state || ""}
                                            onChange={e => setData("state", e.target.value)}
                                        />
                                        {getError("state") && (
                                            <div className="text-red-500 text-xs mt-1">{getError("state")}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#934790] text-white px-8 py-2 rounded-lg font-semibold hover:bg-[#6A0066] transition"
                            disabled={processing}
                        >
                            Update Customer
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
