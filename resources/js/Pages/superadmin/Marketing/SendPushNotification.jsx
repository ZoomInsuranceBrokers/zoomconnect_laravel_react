import React, { useState, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function SendPushNotification({ user, companies }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        body: "",
        notification_type: "general",
        target_type: "all",
        company_ids: [],
    });

    const [selectAll, setSelectAll] = useState(false);

    const toggleCompany = (id) => {
        const arr = new Set(data.company_ids || []);
        if (arr.has(id)) arr.delete(id);
        else arr.add(id);
        setData("company_ids", Array.from(arr));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setData("company_ids", []);
            setSelectAll(false);
        } else {
            setData(
                "company_ids",
                companies.map((c) => c.comp_id)
            );
            setSelectAll(true);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.marketing.push-notifications.store"));
    };

    // local state for searchable company selector
    const [companySearch, setCompanySearch] = useState("");

    const filteredCompanies = (companies || []).filter((c) =>
        c.comp_name.toLowerCase().includes(companySearch.toLowerCase())
    );

    const selectedCompanies = (data.company_ids || [])
        .map((id) => companies.find((c) => c.comp_id === id))
        .filter(Boolean);

    // image picker state
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const handleFilePicked = (file) => {
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        // Optional: store filename or flag in the form data
        setData("image_file_name", file.name);
        // include the actual file in the form data so Inertia can send it if backend supports file uploads
        setData("image_file", file);
    };

    const onFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handleFilePicked(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file =
            e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) handleFilePicked(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const clearSelectedImage = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setData("image_file_name", null);
        setData("image_file", null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    return (
        <SuperAdminLayout user={user}>
            <Head title="Send Push Notification" />

            <div className="p-4 h-full overflow-y-auto bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[14px] font-medium text-gray-900">
                                Create Push Notification
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    form="pushForm"
                                    disabled={processing}
                                    className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium"
                                >
                                    Send Notification
                                </button>
                                <a
                                    href={route(
                                        "superadmin.marketing.push-notifications.index"
                                    )}
                                    className="text-[10px] text-gray-600"
                                >
                                    Cancel
                                </a>
                            </div>
                        </div>

                        <form id="pushForm" onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left: form (occupies 2 cols on md+) */}
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-700">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[12px]"
                                        />
                                        {errors.title && (
                                            <div className="text-red-600 text-[10px] mt-1">
                                                {errors.title}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-700">
                                            Message
                                        </label>
                                        <textarea
                                            value={data.body}
                                            onChange={(e) =>
                                                setData("body", e.target.value)
                                            }
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[12px]"
                                            rows={6}
                                        />
                                        {errors.body && (
                                            <div className="text-red-600 text-[10px] mt-1">
                                                {errors.body}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-medium text-gray-700">
                                                Image (optional)
                                            </label>

                                            {/* Image picker (drag & drop or browse) */}
                                            <div
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onClick={() =>
                                                    fileInputRef.current &&
                                                    fileInputRef.current.click()
                                                }
                                                className="flex items-center justify-between border-2 border-dashed border-gray-200 rounded-md p-3 cursor-pointer hover:border-gray-300 bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg
                                                        className="w-6 h-6 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16v-4a4 4 0 114 4h-1"
                                                        />
                                                    </svg>
                                                    <div className="text-[11px] text-gray-600">
                                                        Drag & drop an image
                                                        here or{" "}
                                                        <span className="text-indigo-600 underline">
                                                            browse
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] text-gray-500">
                                                    {selectedFile
                                                        ? selectedFile.name
                                                        : "No file chosen"}
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={onFileChange}
                                                    className="hidden"
                                                />
                                            </div>

                                            {previewUrl && (
                                                <div className="mt-3 flex items-center gap-3">
                                                    <img
                                                        src={previewUrl}
                                                        alt="preview"
                                                        className="w-28 h-16 object-cover rounded border"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="text-[11px] text-gray-700">
                                                            Selected image
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                clearSelectedImage
                                                            }
                                                            className="text-[11px] text-red-600 mt-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-medium text-gray-700">
                                                Notification Type
                                            </label>
                                            <select
                                                value={data.notification_type}
                                                onChange={(e) =>
                                                    setData(
                                                        "notification_type",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-[12px]"
                                            >
                                                <option value="Home">
                                                    Home
                                                </option>
                                                <option value="Policy">
                                                    Policy
                                                </option>
                                                <option value="Wellnesss">
                                                    Wellness
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-medium text-gray-700">
                                            Target Audience
                                        </label>
                                        <div className="mt-2 space-y-2 text-[12px]">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="target_type"
                                                    value="all"
                                                    checked={
                                                        data.target_type ===
                                                        "all"
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "target_type",
                                                            "all"
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                All companies
                                            </label>
                                            <label className="inline-flex items-center mx-2">
                                                <input
                                                    type="radio"
                                                    name="target_type"
                                                    value="specific"
                                                    checked={
                                                        data.target_type ===
                                                        "specific"
                                                    }
                                                    onChange={() =>
                                                        setData(
                                                            "target_type",
                                                            "specific"
                                                        )
                                                    }
                                                    className="mr-2"
                                                />
                                                Specific companies
                                            </label>
                                        </div>
                                    </div>

                                    {data.target_type === "specific" && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-[10px] font-medium text-gray-700">
                                                    Select companies
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-[11px] text-gray-600">
                                                        {
                                                            selectedCompanies.length
                                                        }{" "}
                                                        selected
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleSelectAll
                                                        }
                                                        className="text-[10px] text-indigo-600"
                                                    >
                                                        {selectAll
                                                            ? "Deselect All"
                                                            : "Select All"}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <input
                                                    placeholder="Search companies..."
                                                    value={companySearch}
                                                    onChange={(e) =>
                                                        setCompanySearch(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border rounded px-2 py-1 text-[11px]"
                                                />
                                            </div>

                                            <div className="mb-2 flex flex-wrap gap-2">
                                                {selectedCompanies.map((c) => (
                                                    <span
                                                        key={c.comp_id}
                                                        className="inline-flex items-center gap-2 bg-gray-100 text-[11px] px-2 py-1 rounded-full"
                                                    >
                                                        <span>
                                                            {c.comp_name}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleCompany(
                                                                    c.comp_id
                                                                )
                                                            }
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="max-h-56 overflow-auto border border-gray-200 rounded-md p-2 bg-white">
                                                {filteredCompanies.length ===
                                                    0 && (
                                                    <div className="text-[11px] text-gray-500">
                                                        No companies found.
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {filteredCompanies.map(
                                                        (c) => (
                                                            <label
                                                                key={c.comp_id}
                                                                className="inline-flex items-center space-x-2 text-[11px]"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={(
                                                                        data.company_ids ||
                                                                        []
                                                                    ).includes(
                                                                        c.comp_id
                                                                    )}
                                                                    onChange={() =>
                                                                        toggleCompany(
                                                                            c.comp_id
                                                                        )
                                                                    }
                                                                />
                                                                <span>
                                                                    {
                                                                        c.comp_name
                                                                    }
                                                                </span>
                                                            </label>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            {errors.company_ids && (
                                                <div className="text-red-600 text-[10px] mt-1">
                                                    {errors.company_ids}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Right: preview / tips (single column) */}
                                <aside className="md:col-span-1 border-l pl-4">
                                    <div className="sticky top-6 space-y-4">
                                        <div className="bg-gray-50 rounded p-3 text-[12px]">
                                            <h3 className="font-semibold text-gray-800 text-[12px]">
                                                Preview
                                            </h3>
                                            <div className="mt-2">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {data.title ||
                                                        "Notification Title"}
                                                </div>
                                                <div className="text-[11px] text-gray-600 mt-1">
                                                    {data.body ||
                                                        "Message preview will appear here."}
                                                </div>
                                                {previewUrl && (
                                                    <img
                                                        src={previewUrl}
                                                        alt="preview"
                                                        className="mt-2 w-full h-28 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded p-3 border text-[11px]">
                                            <h4 className="font-semibold mb-2">
                                                Tips
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                                <li>
                                                    Keep title short (30 chars).
                                                </li>
                                                <li>
                                                    Message should be concise
                                                    and action-oriented.
                                                </li>
                                                <li>
                                                    Use images to add visual
                                                    context.
                                                </li>
                                                <li>
                                                    Preview updates live as you
                                                    type.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
