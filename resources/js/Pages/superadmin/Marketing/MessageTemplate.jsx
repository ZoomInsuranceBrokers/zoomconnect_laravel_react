import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../Context/ThemeContext';

export default function MessageTemplate({ auth, user, templates, categories }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("All");
    const { delete: destroy } = useForm();
    const { darkMode } = useTheme();

    // Filter templates based on search and filter
    const filteredTemplates = templates.filter((template) => {
        const matchesSearch = template.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterBy === "All" || template.category === filterBy;
        return matchesSearch && matchesFilter;
    });

    const handleDelete = (templateId) => {
        if (confirm("Are you sure you want to delete this template?")) {
            destroy(
                route("superadmin.marketing.message-template.destroy", templateId)
            );
        }
    };

    const toggleStatus = (templateId, currentStatus) => {
        // You can implement status toggle here
        console.log("Toggle status for template:", templateId, !currentStatus);
    };

    return (
        <SuperAdminLayout user={user}>
            <Head title="Message Templates" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Messaging templates
                            </h1>
                            <div className="flex justify-end w-full sm:w-auto">
                                <Link
                                    href={route("superadmin.marketing.message-template.create")}
                                    className="inline-flex items-center px-4 py-2 bg-[#934790] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#6A0066] active:bg-[#6A0066] focus:outline-none focus:border-[#934790] focus:ring ring-purple-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    New Message
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    Create message templates for different media
                                    channels. Will be used for campaigns.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className={`rounded-2xl ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 shadow-lg'} text-xs sm:text-sm overflow-x-auto`}> 
                        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}> 
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                <div className="flex-1 max-w-lg">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search Records"
                                            className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#934790] focus:border-[#934790] sm:text-sm ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-400' : 'border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            FILTER BY:
                                        </span>
                                        <select
                                            className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border border-gray-300 bg-gray-100 text-gray-900'}`}
                                            value={filterBy}
                                            onChange={(e) =>
                                                setFilterBy(e.target.value)
                                            }
                                        >
                                            <option value="All">All</option>
                                            {Object.entries(categories || {}).map(
                                                ([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="w-full min-w-[340px] my-3 sm:my-4">
                            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} text-xs sm:text-sm`}>
                                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Active
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                Created on
                                                <svg
                                                    className="ml-1 h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                                                    />
                                                </svg>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${darkMode ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-100'}`}>
                                    {filteredTemplates.map((template) => (
                                        <tr key={template.id} className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}> 
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                route(
                                                                    "superadmin.marketing.message-template.show",
                                                                    template.id
                                                                ),
                                                                "_blank"
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="View"
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <Link
                                                        href={route(
                                                            "superadmin.marketing.message-template.edit",
                                                            template.id
                                                        )}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Edit"
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        toggleStatus(
                                                            template.id,
                                                            template.status
                                                        )
                                                    }
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                                        template.status
                                                            ? "bg-indigo-600"
                                                            : "bg-gray-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            template.status
                                                                ? "translate-x-5"
                                                                : "translate-x-0"
                                                        }`}
                                                    />
                                                </button>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {template.name}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(
                                                    template.created_at
                                                ).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTemplates.length === 0 && (
                            <div className={`text-center py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No message templates found.
                                </div>
                                <Link
                                    href={route("superadmin.marketing.message-template.create")}
                                    className={`mt-4 inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${darkMode ? 'text-indigo-200 bg-gray-800 border-gray-700 hover:bg-gray-700' : 'text-indigo-700 bg-indigo-100 border-transparent hover:bg-indigo-200'}`}
                                >
                                    Create your first template
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
