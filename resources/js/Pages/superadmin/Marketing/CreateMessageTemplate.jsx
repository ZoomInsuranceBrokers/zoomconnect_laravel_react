import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function CreateMessageTemplate({
    auth,
    user,
    template = null,
    categories = {}
}) {
    const isEditing = template !== null;
    const [selectedTab, setSelectedTab] = useState("Rich Text");
    const [preview, setPreview] = useState("");

    const [richTextContent, setRichTextContent] = useState(template?.body || "");
    const [htmlContent, setHtmlContent] = useState(template?.body || "");
    const [bannerPreview, setBannerPreview] = useState(template?.banner_image_url || null);
    const [hasNewBanner, setHasNewBanner] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: template?.name || "",
        category: template?.category || "",
        subject: template?.subject || "",
        body: template?.body || "",
        is_logo_sent: template?.is_logo_sent || false,
        logo_position: template?.logo_position || "right",
        is_company_logo_sent: template?.is_company_logo_sent || false,
        company_logo_position: template?.company_logo_position || "left",
        banner_image: null,
        attachment: null,
        status: template?.status !== undefined ? template.status : true,
    });

    // Auto-set company logo position opposite to logo position when both are enabled
    useEffect(() => {
        if (data.is_logo_sent && data.is_company_logo_sent) {
            const oppositePosition = data.logo_position === "right" ? "left" : "right";
            if (data.company_logo_position !== oppositePosition) {
                setData("company_logo_position", oppositePosition);
            }
        }
    }, [data.logo_position, data.is_logo_sent, data.is_company_logo_sent]);

    // When company logo is enabled first, set logo position to opposite
    useEffect(() => {
        if (data.is_company_logo_sent && data.is_logo_sent) {
            const oppositePosition = data.company_logo_position === "right" ? "left" : "right";
            if (data.logo_position !== oppositePosition) {
                setData("logo_position", oppositePosition);
            }
        }
    }, [data.company_logo_position, data.is_logo_sent, data.is_company_logo_sent]);

    // Update preview when body content or settings change - always show HTML rendered
    useEffect(() => {
        const currentContent = selectedTab === "HTML" ? htmlContent : richTextContent;
        setPreview(currentContent);
    }, [htmlContent, richTextContent, selectedTab, data.is_logo_sent, data.is_company_logo_sent, data.logo_position, data.company_logo_position, bannerPreview, hasNewBanner]);

    // Set content in Rich Text editor when content changes
    useEffect(() => {
        const editor = document.getElementById('richTextEditor');
        if (editor && selectedTab === "Rich Text") {
            // Use setTimeout to ensure the editor is properly rendered
            setTimeout(() => {
                if (editor.innerHTML !== richTextContent) {
                    editor.innerHTML = richTextContent || '';
                    // Force LTR direction
                    editor.style.direction = 'ltr';
                    editor.style.textAlign = 'left';
                    editor.setAttribute('dir', 'ltr');
                }
            }, 0);
        }
    }, [richTextContent, selectedTab]);

    // Initialize content properly when component mounts
    useEffect(() => {
        if (template?.body) {
            // If we have template body content (HTML), set both states
            setRichTextContent(template.body);
            setHtmlContent(template.body);
        }
    }, [template]);

    // Since both modes now work with HTML content, we don't need conversion functions
    // Rich Text mode displays HTML visually while HTML mode shows the code

    const submit = (e) => {
        e.preventDefault();

        // Use the current editor content - both modes now store HTML
        const bodyContent = selectedTab === "HTML" ? htmlContent : richTextContent;

        // Prepare form data with current body content
        const formData = {
            name: data.name,
            category: data.category,
            subject: data.subject,
            body: bodyContent,
            is_logo_sent: data.is_logo_sent,
            logo_position: data.logo_position,
            is_company_logo_sent: data.is_company_logo_sent,
            company_logo_position: data.company_logo_position,
            status: data.status,
        };

        // Add files only if they were selected
        if (data.banner_image) {
            formData.banner_image = data.banner_image;
        }
        if (data.attachment) {
            formData.attachment = data.attachment;
        }

        console.log('Submitting form data:', formData);
        console.log('Has banner_image:', !!data.banner_image);
        console.log('Has attachment:', !!data.attachment);

        if (isEditing) {
            put(route("superadmin.marketing.message-template.update", template.id), formData);
        } else {
            post(route("superadmin.marketing.message-template.store"), formData);
        }
    };

    const handleTabChange = (tab) => {
        if (tab === "HTML" && selectedTab === "Rich Text") {
            // Converting from Rich Text to HTML - content is already in HTML format
            setHtmlContent(richTextContent);
        } else if (tab === "Rich Text" && selectedTab === "HTML") {
            // Converting from HTML to Rich Text - preserve HTML for visual editing
            setRichTextContent(htmlContent);
        }
        setSelectedTab(tab);
    };

    const handleContentChange = (value) => {
        if (selectedTab === "HTML") {
            setHtmlContent(value);
            // Also update the data.body with HTML content
            setData("body", value);
        } else {
            setRichTextContent(value);
            // For Rich Text, store the HTML content in data.body
            setData("body", value);
        }
    };

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("banner_image", file);
            setHasNewBanner(true);
            const reader = new FileReader();
            reader.onload = (e) => setBannerPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const formatRichText = (command, value = null) => {
        // Focus the editor first to ensure proper command execution
        const editor = document.getElementById('richTextEditor');
        if (editor) {
            editor.focus();

            // Force LTR direction before executing any command
            editor.style.direction = 'ltr';
            editor.style.textAlign = 'left';
            editor.setAttribute('dir', 'ltr');

            // Execute the command
            document.execCommand(command, false, value);

            // Ensure text direction is always left-to-right after command
            editor.style.direction = 'ltr';
            editor.setAttribute('dir', 'ltr');

            // Handle specific alignment commands
            if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
                editor.style.textAlign = command === 'justifyLeft' ? 'left' :
                                       command === 'justifyCenter' ? 'center' : 'right';
            } else {
                editor.style.textAlign = 'left';
            }

            // Update content
            const content = editor.innerHTML;
            setRichTextContent(content);
            setData("body", content);
        }
    };

    return (
        <SuperAdminLayout user={user}>
            <Head title={isEditing ? "Edit Template" : "Create Template"} />

            {/* Custom CSS for the editor */}
            <style>{`
                #richTextEditor {
                    direction: ltr !important;
                    text-align: left !important;
                    unicode-bidi: embed !important;
                    writing-mode: lr-tb !important;
                }
                #richTextEditor:empty:before {
                    content: attr(data-placeholder);
                    color: #9CA3AF;
                    font-style: italic;
                }
                #richTextEditor * {
                    direction: ltr !important;
                    text-align: inherit !important;
                }
                /* Ensure HTML elements in Rich Text editor display properly */
                #richTextEditor table {
                    border-collapse: collapse;
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                }
                #richTextEditor td {
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                }
                #richTextEditor img {
                    max-width: 100%;
                    height: auto;
                }
                #richTextEditor h1, #richTextEditor h2, #richTextEditor h3 {
                    margin: 16px 0 8px 0;
                }
                #richTextEditor p {
                    margin: 8px 0;
                }
            `}</style>

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <Link
                            href={route("superadmin.marketing.message-template.index")}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? "Edit template message" : "Create template message"}
                        </h1>
                        <div className="ml-auto text-sm text-gray-500">
                            Created on: {new Date().toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Channel Type */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            Email
                                        </h3>
                                    </div>

                                    {/* Basic Details */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium text-gray-900 mb-4">
                                            Basic details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData("name", e.target.value)
                                                    }
                                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Enter template name"
                                                />
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {data.name.length}/30
                                                </div>
                                                {errors.name && (
                                                    <div className="text-red-600 text-sm mt-1">
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="category"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Category
                                                </label>
                                                <select
                                                    id="category"
                                                    value={data.category}
                                                    onChange={(e) =>
                                                        setData("category", e.target.value)
                                                    }
                                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="">Select Category</option>
                                                    {Object.entries(categories).map(
                                                        ([key, value]) => (
                                                            <option key={key} value={key}>
                                                                {value}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {errors.category && (
                                                    <div className="text-red-600 text-sm mt-1">
                                                        {errors.category}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="mb-6">
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData("subject", e.target.value)
                                            }
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#934790] focus:border-[#934790]"
                                            placeholder="Subject line"
                                        />
                                        {errors.subject && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.subject}
                                            </div>
                                        )}
                                    </div>

                                    {/* Logo Settings - Moved below subject */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium text-gray-900 mb-4">
                                            Logo Settings
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_logo_sent}
                                                        onChange={(e) =>
                                                            setData("is_logo_sent", e.target.checked)
                                                        }
                                                        className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-[#934790] focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        Include Logo
                                                    </span>
                                                </label>
                                                {data.is_logo_sent && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500">Position:</span>
                                                        <div className="flex space-x-2">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="logo_position"
                                                                    value="right"
                                                                    checked={data.logo_position === "right"}
                                                                    onChange={(e) =>
                                                                        setData("logo_position", e.target.value)
                                                                    }
                                                                    className="text-[#934790] focus:ring-[#934790]"
                                                                />
                                                                <span className="ml-1 text-xs">Right</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="logo_position"
                                                                    value="left"
                                                                    checked={data.logo_position === "left"}
                                                                    onChange={(e) =>
                                                                        setData("logo_position", e.target.value)
                                                                    }
                                                                    className="text-[#934790] focus:ring-[#934790]"
                                                                />
                                                                <span className="ml-1 text-xs">Left</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_company_logo_sent}
                                                        onChange={(e) =>
                                                            setData("is_company_logo_sent", e.target.checked)
                                                        }
                                                        className="rounded border-gray-300 text-[#934790] shadow-sm focus:border-[#934790] focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        Include Company Logo
                                                    </span>
                                                </label>
                                                {data.is_company_logo_sent && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500">Position:</span>
                                                        <div className="flex space-x-2">
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="company_logo_position"
                                                                    value="right"
                                                                    checked={data.company_logo_position === "right"}
                                                                    onChange={(e) =>
                                                                        setData("company_logo_position", e.target.value)
                                                                    }
                                                                    className="text-[#934790] focus:ring-[#934790]"
                                                                />
                                                                <span className="ml-1 text-xs">Right</span>
                                                            </label>
                                                            <label className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="company_logo_position"
                                                                    value="left"
                                                                    checked={data.company_logo_position === "left"}
                                                                    onChange={(e) =>
                                                                        setData("company_logo_position", e.target.value)
                                                                    }
                                                                    className="text-[#934790] focus:ring-[#934790]"
                                                                />
                                                                <span className="ml-1 text-xs">Left</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Banner Image */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Banner Image
                                        </label>
                                        {isEditing && template?.banner_image && !hasNewBanner && (
                                            <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                                                <div className="text-sm text-gray-600 mb-2">Current Banner:</div>
                                                <img
                                                    src={`/storage/${template.banner_image}`}
                                                    alt="Current Banner"
                                                    className="w-full h-32 object-cover rounded border"
                                                    onError={(e) => {
                                                        console.error('Banner image failed to load:', template.banner_image);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Debug: {template.banner_image}
                                                </div>
                                            </div>
                                        )}
                                        {isEditing && !template?.banner_image && (
                                            <div className="mb-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                                                <div className="text-sm text-yellow-600">No banner image found for this template</div>
                                            </div>
                                        )}
                                        {hasNewBanner && bannerPreview && (
                                            <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                                                <div className="text-sm text-blue-600 mb-2">New Banner Preview:</div>
                                                <img
                                                    src={bannerPreview}
                                                    alt="New Banner Preview"
                                                    className="w-full h-32 object-cover rounded border"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerImageChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#934790] file:text-white hover:file:bg-[#6A0066]"
                                        />
                                        {errors.banner_image && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.banner_image}
                                            </div>
                                        )}
                                        {isEditing && template?.banner_image && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Leave empty to keep current banner, or select a new image to replace it.
                                            </div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Body
                                            </label>
                                            <div className="text-xs text-gray-500">
                                                Use "# "(Hash) to add variables in your body text.
                                            </div>
                                        </div>

                                        {/* Tab Selector */}
                                        <div className="flex border-b border-gray-200 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => handleTabChange("HTML")}
                                                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                                                    selectedTab === "HTML"
                                                        ? "border-[#934790] text-[#934790]"
                                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                <span className="flex items-center">
                                                    <span className={`w-3 h-3 rounded-full mr-2 ${
                                                        selectedTab === "HTML" ? "bg-[#934790]" : "border-2 border-gray-400"
                                                    }`}></span>
                                                    HTML
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleTabChange("Rich Text")}
                                                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                                                    selectedTab === "Rich Text"
                                                        ? "border-[#934790] text-[#934790]"
                                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                                }`}
                                            >
                                                <span className="flex items-center">
                                                    <span className={`w-3 h-3 rounded-full mr-2 ${
                                                        selectedTab === "Rich Text" ? "bg-[#934790]" : "border-2 border-gray-400"
                                                    }`}></span>
                                                    Rich Text
                                                </span>
                                            </button>
                                        </div>

                                        {/* Rich Text Toolbar */}
                                        {selectedTab === "Rich Text" && (
                                            <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex items-center space-x-2 flex-wrap gap-2">
                                                {/* Font Family */}
                                                <select
                                                    onChange={(e) => formatRichText('fontName', e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    title="Font Family"
                                                >
                                                    <option value="">Font Family</option>
                                                    <option value="Arial">Arial</option>
                                                    <option value="Helvetica">Helvetica</option>
                                                    <option value="Times New Roman">Times New Roman</option>
                                                    <option value="Georgia">Georgia</option>
                                                    <option value="Verdana">Verdana</option>
                                                    <option value="Courier New">Courier New</option>
                                                    <option value="Trebuchet MS">Trebuchet MS</option>
                                                    <option value="Arial Black">Arial Black</option>
                                                </select>

                                                {/* Font Size */}
                                                <select
                                                    onChange={(e) => formatRichText('fontSize', e.target.value)}
                                                    className="text-xs border border-gray-300 rounded px-2 py-1"
                                                    title="Font Size"
                                                >
                                                    <option value="">Size</option>
                                                    <option value="1">8pt</option>
                                                    <option value="2">10pt</option>
                                                    <option value="3">12pt</option>
                                                    <option value="4">14pt</option>
                                                    <option value="5">18pt</option>
                                                    <option value="6">24pt</option>
                                                    <option value="7">36pt</option>
                                                </select>

                                                <div className="w-px h-4 bg-gray-300"></div>

                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('bold')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Bold"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 4a1 1 0 011-1h3a4 4 0 014 4 4 4 0 01-1.707 3.293A4 4 0 0115 14a4 4 0 01-4 4H6a1 1 0 01-1-1V4zm2 2v3h3a2 2 0 100-4H7zm0 5v3h4a2 2 0 100-4H7z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('italic')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Italic"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8 1a1 1 0 011 1v1h2V2a1 1 0 112 0v1h1a1 1 0 110 2h-1v10h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H6a1 1 0 110-2h1V5H6a1 1 0 110-2h1V2a1 1 0 011-1zm1 4v10h2V5H9z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('underline')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Underline"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 18a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 7a1 1 0 011-1h2a1 1 0 110 2H5v2a5 5 0 0010 0V8h-1a1 1 0 110-2h2a1 1 0 011 1v2a7 7 0 11-14 0V7z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                <div className="w-px h-4 bg-gray-300"></div>

                                                {/* Text Color */}
                                                <input
                                                    type="color"
                                                    onChange={(e) => formatRichText('foreColor', e.target.value)}
                                                    className="w-8 h-6 rounded border border-gray-300 cursor-pointer"
                                                    title="Text Color"
                                                />

                                                <div className="w-px h-4 bg-gray-300"></div>

                                                {/* Text Alignment */}
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('justifyLeft')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Align Left"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('justifyCenter')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Align Center"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm2 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('justifyRight')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Align Right"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm7 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-7 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                <div className="w-px h-4 bg-gray-300"></div>

                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('insertUnorderedList')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Bullet List"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formatRichText('insertOrderedList')}
                                                    className="p-1 rounded hover:bg-gray-200"
                                                    title="Numbered List"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {/* Editor */}
                                        <div className={`border border-gray-300 ${selectedTab === "Rich Text" ? "rounded-b-md" : "rounded-md"}`}>
                                            {selectedTab === "Rich Text" ? (
                                                <div
                                                    id="richTextEditor"
                                                    contentEditable
                                                    className="block w-full min-h-[250px] border-0 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#934790]"
                                                    onInput={(e) => {
                                                        // Ensure text direction remains left-to-right
                                                        e.target.style.direction = 'ltr';
                                                        e.target.style.textAlign = 'left';
                                                        e.target.setAttribute('dir', 'ltr');
                                                        handleContentChange(e.target.innerHTML);
                                                    }}
                                                    onFocus={(e) => {
                                                        // Set text direction when focused
                                                        e.target.style.direction = 'ltr';
                                                        e.target.style.textAlign = 'left';
                                                        e.target.setAttribute('dir', 'ltr');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Ensure proper text direction on key events
                                                        e.target.style.direction = 'ltr';
                                                        e.target.style.textAlign = 'left';
                                                        e.target.setAttribute('dir', 'ltr');
                                                    }}
                                                    onPaste={(e) => {
                                                        // Handle paste events to maintain direction
                                                        setTimeout(() => {
                                                            e.target.style.direction = 'ltr';
                                                            e.target.style.textAlign = 'left';
                                                            e.target.setAttribute('dir', 'ltr');
                                                        }, 0);
                                                    }}
                                                    suppressContentEditableWarning={true}
                                                    dir="ltr"
                                                    data-placeholder="Start typing your message..."
                                                    style={{
                                                        minHeight: '250px',
                                                        direction: 'ltr !important',
                                                        textAlign: 'left !important',
                                                        unicodeBidi: 'embed',
                                                        writingMode: 'lr-tb'
                                                    }}
                                                />
                                            ) : (
                                                <textarea
                                                    rows={10}
                                                    value={htmlContent}
                                                    onChange={(e) => handleContentChange(e.target.value)}
                                                    className="block w-full border-0 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#934790]"
                                                    placeholder="Write HTML code here..."
                                                    style={{
                                                        direction: 'ltr',
                                                        textAlign: 'left'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {errors.body && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.body}
                                            </div>
                                        )}
                                    </div>

                                    {/* Attachment */}
                                    <div className="mb-6">
                                        <h4 className="text-base font-medium text-gray-900 mb-4">
                                            Attachments
                                        </h4>
                                        {isEditing && template?.attachment && (
                                            <div className="mb-3 p-3 bg-gray-50 rounded-md border">
                                                <div className="text-sm text-gray-600 mb-2">Current Attachment:</div>
                                                <a
                                                    href={template.attachment_url || `/storage/${template.attachment}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#934790] hover:text-[#6A0066] text-sm underline"
                                                    onClick={(e) => {
                                                        const url = template.attachment_url || `/storage/${template.attachment}`;
                                                        console.log('Opening attachment URL:', url);
                                                        if (!url || url === '/storage/') {
                                                            e.preventDefault();
                                                            alert('Attachment URL is not available');
                                                        }
                                                    }}
                                                >
                                                    📎 Download Current Attachment
                                                </a>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Debug: {template.attachment} | URL: {template.attachment_url}
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setData("attachment", e.target.files[0])
                                            }
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#934790] file:text-white hover:file:bg-[#6A0066]"
                                        />
                                        {errors.attachment && (
                                            <div className="text-red-600 text-sm mt-1">
                                                {errors.attachment}
                                            </div>
                                        )}
                                        {isEditing && template?.attachment && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Leave empty to keep current attachment, or select a new file to replace it.
                                            </div>
                                        )}
                                    </div>


                                    {/* Submit Buttons */}
                                    <div className="flex items-center justify-end space-x-4">
                                        <Link
                                            href={route("superadmin.marketing.message-template.index")}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-[#934790] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#6A0066] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] disabled:opacity-50"
                                        >
                                            {processing
                                                ? "Saving..."
                                                : isEditing
                                                ? "Update Template"
                                                : "Create Template"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Enhanced Preview Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Message preview
                                </h3>
                                <div className="border border-gray-200 rounded-lg p-4 min-h-[400px] bg-gray-50 overflow-auto">
                                    {/* Logos Preview - Show both in same row when both are enabled */}
                                    {(data.is_logo_sent || data.is_company_logo_sent) && (
                                        <div className="flex justify-between items-center mb-4">
                                            {/* Left side logo */}
                                            <div className="flex-1">
                                                {((data.is_logo_sent && data.logo_position === 'left') ||
                                                  (data.is_company_logo_sent && data.company_logo_position === 'left')) && (
                                                    <div className="flex justify-start">
                                                        {data.is_logo_sent && data.logo_position === 'left' && (
                                                            <img
                                                                src="/assets/logo/zoom_connect_logo.png"
                                                                alt="Logo"
                                                                className="h-12 w-auto mr-4"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        )}
                                                        {data.is_logo_sent && data.logo_position === 'left' && (
                                                            <div className="hidden text-xs text-gray-500 p-2 border rounded mr-4">Logo will display here</div>
                                                        )}
                                                        {data.is_company_logo_sent && data.company_logo_position === 'left' && (
                                                            <div className="text-xs text-gray-500 p-2 border rounded bg-gray-100">
                                                                Company logo
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side logo */}
                                            <div className="flex-1">
                                                {((data.is_logo_sent && data.logo_position === 'right') ||
                                                  (data.is_company_logo_sent && data.company_logo_position === 'right')) && (
                                                    <div className="flex justify-end">
                                                        {data.is_company_logo_sent && data.company_logo_position === 'right' && (
                                                            <div className="text-xs text-gray-500 p-2 border rounded bg-gray-100 mr-4">
                                                                Company logo
                                                            </div>
                                                        )}
                                                        {data.is_logo_sent && data.logo_position === 'right' && (
                                                            <img
                                                                src="/assets/logo/zoom_connect_logo.png"
                                                                alt="Logo"
                                                                className="h-12 w-auto"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'block';
                                                                }}
                                                            />
                                                        )}
                                                        {data.is_logo_sent && data.logo_position === 'right' && (
                                                            <div className="hidden text-xs text-gray-500 p-2 border rounded">Logo will display here</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Banner Image Preview */}
                                    {(bannerPreview || (isEditing && template?.banner_image)) && (
                                        <div className="mb-4">
                                            <img
                                                src={bannerPreview || (isEditing && template?.banner_image ? `/storage/${template.banner_image}` : '')}
                                                alt="Banner"
                                                className="w-full h-32 object-cover rounded border"
                                            />
                                        </div>
                                    )}

                                    {/* Body Content Preview */}
                                    <div className="mt-4">
                                        {preview ? (
                                            <div
                                                className="prose prose-sm max-w-none text-sm"
                                                dangerouslySetInnerHTML={{ __html: preview }}
                                                style={{
                                                    maxWidth: '100%',
                                                    fontSize: '14px',
                                                    lineHeight: '1.5'
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center text-gray-500 py-12">
                                                <div className="text-sm">
                                                    Your message will appear here
                                                </div>
                                                <div className="text-xs mt-1">
                                                    Start writing your message
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
