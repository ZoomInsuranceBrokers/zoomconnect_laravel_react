import React, { useRef, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import SuperAdminLayout from "../../../../Layouts/SuperAdmin/Layout";

export default function Create() {
    const { errors } = usePage().props;
    const [lookingUpPincode, setLookingUpPincode] = useState(false);

    const { data, setData, post, processing } = useForm({
        insurance_company_name: "",
        address: "",
        state_name: "",
        city_name: "",
        pincode: "",
        icon: null,
        icon_url: "",
    });

    const [localErrors, setLocalErrors] = useState({});

    // Icon upload
    const iconInputRef = useRef();
    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setData("icon", file);
            setData("icon_url", URL.createObjectURL(file));
        }
    };
    const removeIcon = () => {
        setData("icon", null);
        setData("icon_url", "");
        iconInputRef.current.value = "";
    };

    // Pincode auto-fill
    const handlePincodeChange = async (e) => {
        const pincode = e.target.value;
        setData('pincode', pincode);

        if (pincode.length === 6) {
            setLookingUpPincode(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const result = await response.json();

                if (result && result[0]?.Status === 'Success' && result[0]?.PostOffice?.length > 0) {
                    const postOffice = result[0].PostOffice[0];
                    setData(data => ({
                        ...data,
                        state_name: postOffice.State || '',
                        city_name: postOffice.District || postOffice.Region || '',
                    }));
                } else {
                    setData(data => ({
                        ...data,
                        state_name: '',
                        city_name: '',
                    }));
                }
            } catch (error) {
                console.error('Error fetching pincode data:', error);
            } finally {
                setLookingUpPincode(false);
            }
        }
    };

    // Client-side validation
    const validate = () => {
        const newErrors = {};

        if (!data.insurance_company_name) newErrors.insurance_company_name = "Insurance Company Name is required";
        if (!data.address) newErrors.address = "Address is required";
        if (!data.pincode) newErrors.pincode = "Pincode is required";
        if (!data.city_name) newErrors.city_name = "City is required";
        if (!data.state_name) newErrors.state_name = "State is required";

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getError = (field) => errors[field] || localErrors[field];

    const inputClass = (field) =>
        `w-full border ${getError(field) ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#934790] transition text-sm`;

    return (
        <SuperAdminLayout>
            <Head title="Add Insurance Company" />
            <div className="w-full py-6 px-4">
                <h2 className="text-xl font-bold mb-4">Add Insurance Company</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT FORM AREA (scrollable) */}
                    <div
                        className="lg:col-span-2 bg-white shadow-xl rounded-2xl border border-gray-100 p-6"
                        style={{ maxHeight: "78vh", overflowY: "auto" }}
                    >
                        {/* FORM START */}
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                if (!validate()) return;
                                post(route("superadmin.policy.insurance.store"));
                            }}
                            className="text-sm space-y-6"
                        >
                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <span className="text-xs text-blue-900">
                                    Please enter correct insurance company details.
                                </span>
                            </div>

                            {/* INPUTS */}
                            <div>
                                <label className="block mb-1 font-medium">
                                    Insurance Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={inputClass("insurance_company_name")}
                                    value={data.insurance_company_name}
                                    onChange={e => setData("insurance_company_name", e.target.value)}
                                />
                                {getError("insurance_company_name") && (
                                    <p className="text-red-500 text-xs mt-1">{getError("insurance_company_name")}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows="3"
                                    className={inputClass("address")}
                                    value={data.address}
                                    onChange={e => setData("address", e.target.value)}
                                />
                                {getError("address") && (
                                    <p className="text-red-500 text-xs mt-1">{getError("address")}</p>
                                )}
                            </div>

                            {/* GRID FIELDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        className={inputClass("pincode")}
                                        value={data.pincode}
                                        placeholder="Enter 6-digit pincode"
                                        onChange={handlePincodeChange}
                                    />
                                    {lookingUpPincode && (
                                        <div className="text-xs text-blue-600 mt-1">Fetching city & state…</div>
                                    )}
                                    {getError("pincode") && (
                                        <p className="text-red-500 text-xs mt-1">{getError("pincode")}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClass("city_name")}
                                        value={data.city_name}
                                        onChange={e => setData("city_name", e.target.value)}
                                    />
                                    {getError("city_name") && (
                                        <p className="text-red-500 text-xs mt-1">{getError("city_name")}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClass("state_name")}
                                        value={data.state_name}
                                        onChange={e => setData("state_name", e.target.value)}
                                    />
                                    {getError("state_name") && (
                                        <p className="text-red-500 text-xs mt-1">{getError("state_name")}</p>
                                    )}
                                </div>
                            </div>

                            {/* ICON */}
                            <div>
                                <label className="block mb-1 font-medium">Company Icon</label>
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={iconInputRef}
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleIconChange}
                                />

                                <button
                                    type="button"
                                    onClick={() => iconInputRef.current.click()}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                                >
                                    Choose Icon
                                </button>

                                {data.icon_url && (
                                    <div className="flex items-center gap-3 mt-2">
                                        <img src={data.icon_url} className="w-12 h-12 rounded border" />
                                        <button
                                            type="button"
                                            className="text-red-600 text-xs"
                                            onClick={removeIcon}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Accepted: JPG, JPEG, PNG</p>
                            </div>

                            {/* BUTTONS INSIDE SCROLL */}
                            <div className="pt-4 pb-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-[#934790] hover:bg-[#6A0066] text-white rounded-lg font-medium disabled:opacity-50"
                                >
                                    {processing ? "Saving..." : "Save Insurance Company"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT SIDE INSTRUCTIONS */}
                    <div className="bg-gradient-to-b from-[#faf5ff] to-white shadow-md border border-[#ecd9f1] rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-[#934790] mb-3">Instructions</h3>

                        <ul className="text-sm text-gray-700 space-y-3">
                            <li>• Enter the official <b>insurance company name</b>.</li>
                            <li>• Make sure the <b>address</b> is complete.</li>
                            <li>• Pincode will <b>auto-fill city & state</b>.</li>
                            <li>• Toggle <b>Black Hospital</b> if needed.</li>
                            <li>• Upload a clear <b>company icon</b>.</li>
                            <li>• All fields with <span className="text-red-500">*</span> are mandatory.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
