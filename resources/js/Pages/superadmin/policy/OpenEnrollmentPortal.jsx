import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function OpenEnrollmentPortal({ enrollmentDetail }) {
    const [formData, setFormData] = useState({
        enrolment_portal_name: '',
        portal_start_date: '',
        portal_end_date: ''
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/superadmin/create-enrollment-period/${enrollmentDetail.id}`, formData, {
            onSuccess: (page) => {
                // Redirect will be handled by the backend
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleCancel = () => {
        router.visit(`/superadmin/policy/enrollment-details/${enrollmentDetail.id}`);
    };

    return (
        <SuperAdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <Link
                                href={`/superadmin/policy/enrollment-details/${enrollmentDetail.id}`}
                                className="mr-4 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] shadow-lg"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div className="ml-2">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Open New Enrollment Portal
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Create a new enrollment period for <span className="font-medium text-[#934790]">{enrollmentDetail.corporate_enrolment_name}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Info Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 bg-[#934790] bg-opacity-10 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 ml-2">Portal Information</h3>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Company:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{enrollmentDetail.company?.comp_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Enrollment:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{enrollmentDetail.enrolment_name}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Policy Period:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">
                                            {new Date(enrollmentDetail.policy_start_date).toLocaleDateString()} - {new Date(enrollmentDetail.policy_end_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                            enrollmentDetail.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {enrollmentDetail.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-2">
                                            <h4 className="text-xs font-medium text-blue-800">Important Note</h4>
                                            <p className="text-xs text-blue-700 mt-1">
                                                This will create a new enrollment portal that employees can use to enroll in benefits during the specified period.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-lg rounded-lg border border-gray-200">
                                {/* Form Header */}
                                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-[#934790] to-[#7a3d7a] rounded-t-lg">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <h2 className="text-sm font-semibold text-white ml-2">Create Enrollment Portal</h2>
                                    </div>
                                    <p className="text-purple-100 mt-1 text-xs">Fill in the details below to set up your new enrollment portal</p>
                                </div>

                                {/* Form Content */}
                                <div className="px-4 py-4">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Portal Name */}
                                        <div>
                                            <label htmlFor="enrolment_portal_name" className="flex items-center text-xs font-medium text-gray-700 mb-2">
                                                <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                                                </svg>
                                                Enrollment Portal Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="enrolment_portal_name"
                                                    name="enrolment_portal_name"
                                                    value={formData.enrolment_portal_name}
                                                    onChange={handleInputChange}
                                                    className={`block w-full text-xs border rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors duration-200 ${
                                                        errors.enrolment_portal_name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                    placeholder="e.g., Annual Benefits Enrollment 2025"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                    <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.enrolment_portal_name && (
                                                <p className="mt-1 flex items-center text-xs text-red-600">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {errors.enrolment_portal_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Date Fields */}
                                        <div className="space-y-4">
                                            {/* Portal Start Date */}
                                            <div>
                                                <label htmlFor="portal_start_date" className="flex items-center text-xs font-medium text-gray-700 mb-2">
                                                    <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Portal Start Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        id="portal_start_date"
                                                        name="portal_start_date"
                                                        value={formData.portal_start_date}
                                                        onChange={handleInputChange}
                                                        className={`block w-full text-xs border rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors duration-200 ${
                                                            errors.portal_start_date ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                        <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.portal_start_date && (
                                                    <p className="mt-1 flex items-center text-xs text-red-600">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {errors.portal_start_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Portal End Date */}
                                            <div>
                                                <label htmlFor="portal_end_date" className="flex items-center text-xs font-medium text-gray-700 mb-2">
                                                    <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Portal End Date <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        id="portal_end_date"
                                                        name="portal_end_date"
                                                        value={formData.portal_end_date}
                                                        onChange={handleInputChange}
                                                        className={`block w-full text-xs border rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors duration-200 ${
                                                            errors.portal_end_date ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                                        <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {errors.portal_end_date && (
                                                    <p className="mt-1 flex items-center text-xs text-red-600">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {errors.portal_end_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-xs font-medium text-white bg-gradient-to-r from-[#934790] to-[#7a3d7a] hover:from-[#7a3d7a] hover:to-[#934790] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Creating Portal...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        Create Portal
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] transition-colors duration-200"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
