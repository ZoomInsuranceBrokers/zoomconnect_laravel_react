import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function ShowMessageTemplate({ auth, user, template }) {
    const handleStatusToggle = () => {
        router.put(route('marketing.message-template.update', template.id), {
            name: template.name,
            category: template.category,
            subject: template.subject,
            body: template.body,
            status: !template.status,
            is_logo_sent: template.is_logo_sent,
            logo_position: template.logo_position,
            is_company_logo_sent: template.is_company_logo_sent,
            company_logo_position: template.company_logo_position,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally add success message
            },
        });
    };
    return (
        <SuperAdminLayout user={user}>
            <Head title={`Template: ${template.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
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
                                {template.name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleStatusToggle}
                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring ring-opacity-50 disabled:opacity-25 transition ease-in-out duration-150 ${
                                    template.status
                                        ? "bg-red-600 hover:bg-red-700 focus:border-red-900 focus:ring-red-300"
                                        : "bg-green-600 hover:bg-green-700 focus:border-green-900 focus:ring-green-300"
                                }`}
                            >
                                {template.status ? "Mark Inactive" : "Mark Active"}
                            </button>
                            <Link
                                href={route("superadmin.marketing.message-template.edit", template.id)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                            >
                                Edit Template
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Template Details */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900 capitalize">{template.category}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Subject</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{template.subject}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                template.status
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {template.status ? "Active" : "Inactive"}
                                        </span>
                                    </dd>
                                </div>
                            </div>
                        </div>

                        {/* Logo Settings */}
                        {(template.is_logo_sent || template.is_company_logo_sent) && (
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {template.is_logo_sent && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Logo</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                Enabled - Position: {template.logo_position}
                                            </dd>
                                        </div>
                                    )}
                                    {template.is_company_logo_sent && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Company Logo</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                Enabled - Position: {template.company_logo_position}
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Attachments */}
                        {(template.banner_image || template.attachment) && (
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {template.banner_image && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Banner Image</dt>
                                            <dd className="mt-1">
                                                <img
                                                    src={template.banner_image_url}
                                                    alt="Banner"
                                                    className="h-32 w-full object-cover rounded-lg border"
                                                />
                                            </dd>
                                        </div>
                                    )}
                                    {template.attachment && (
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                                            <dd className="mt-1">
                                                <a
                                                    href={template.attachment_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-500"
                                                >
                                                    Download Attachment
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Template Body */}
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Template Body</h3>
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: template.body }}
                                />
                            </div>
                        </div>

                        {/* Template Meta */}
                        <div className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                                <div>
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(template.created_at).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated:</span>{" "}
                                    {new Date(template.updated_at).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
