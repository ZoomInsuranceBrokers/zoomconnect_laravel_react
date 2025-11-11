import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import SuperAdminLayout from "../../../Layouts/SuperAdmin/Layout";

export default function EditEnrollmentPeriod({ enrollmentPeriod, enrollmentDetail }) {
    // Helper function to format date for HTML date input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        // Handle different date formats
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        // Return in YYYY-MM-DD format
        return date.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        enrolment_portal_name: enrollmentPeriod?.enrolment_portal_name || '',
        portal_start_date: formatDateForInput(enrollmentPeriod?.portal_start_date),
        portal_end_date: formatDateForInput(enrollmentPeriod?.portal_end_date)
    });

    // Debug log to check what data we're receiving
    console.log('Enrollment Period Data:', enrollmentPeriod);
    console.log('Formatted Form Data:', formData);

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

        router.put(`/superadmin/update-enrollment-period/${enrollmentPeriod.id}`, formData, {
            onSuccess: (page) => {
                // Redirect back to live portal
                router.visit(`/superadmin/view-live-portal/${enrollmentPeriod.id}`);
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
        router.visit(`/superadmin/view-live-portal/${enrollmentPeriod.id}`);
    };

    return (
        <SuperAdminLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center">
                            <Link
                                href={`/superadmin/view-live-portal/${enrollmentPeriod.id}`}
                                className="mr-4 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] shadow-lg"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <div className="ml-2">
                                <h1 className="text-xl font-bold text-gray-900">
                                    Update Enrollment Portal Period
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Modify enrollment period details for <span className="font-medium text-[#934790]">{enrollmentPeriod?.enrolment_portal_name}</span>
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
                                    <h3 className="text-sm font-semibold text-gray-900 ml-2">Current Portal Information</h3>
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Company:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{enrollmentDetail?.company?.comp_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Enrollment:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{enrollmentDetail?.enrolment_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Current Portal Name:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">{enrollmentPeriod?.enrolment_portal_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Current Start Date:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">
                                            {enrollmentPeriod?.portal_start_date ? new Date(enrollmentPeriod.portal_start_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Current End Date:</span>
                                        <span className="font-medium text-gray-900 text-right max-w-[60%]">
                                            {enrollmentPeriod?.portal_end_date ? new Date(enrollmentPeriod.portal_end_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600 font-medium">Status:</span>
                                        <span className={`font-medium text-right max-w-[60%] ${enrollmentPeriod?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {enrollmentPeriod?.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-xs text-blue-800">
                                            <p className="font-semibold mb-1">Important Notes:</p>
                                            <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                                                <li>Changing dates may affect employee access</li>
                                                <li>Portal name will be visible to employees</li>
                                                <li>Changes take effect immediately</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 ml-2">Update Portal Details</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Portal Name */}
                                    <div>
                                        <label htmlFor="enrolment_portal_name" className="block text-xs font-medium text-gray-700 mb-1">
                                            Portal Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="enrolment_portal_name"
                                            name="enrolment_portal_name"
                                            value={formData.enrolment_portal_name}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent transition-colors ${
                                                errors.enrolment_portal_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter portal name"
                                        />
                                        {errors.enrolment_portal_name && (
                                            <p className="mt-1 text-xs text-red-600">{errors.enrolment_portal_name}</p>
                                        )}
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label htmlFor="portal_start_date" className="block text-xs font-medium text-gray-700 mb-1">
                                            Portal Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="portal_start_date"
                                            name="portal_start_date"
                                            value={formData.portal_start_date}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent transition-colors ${
                                                errors.portal_start_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.portal_start_date && (
                                            <p className="mt-1 text-xs text-red-600">{errors.portal_start_date}</p>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label htmlFor="portal_end_date" className="block text-xs font-medium text-gray-700 mb-1">
                                            Portal End Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="portal_end_date"
                                            name="portal_end_date"
                                            value={formData.portal_end_date}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent transition-colors ${
                                                errors.portal_end_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.portal_end_date && (
                                            <p className="mt-1 text-xs text-red-600">{errors.portal_end_date}</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-xs font-medium text-white transition-colors ${
                                                processing
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-[#934790] hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]'
                                            }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Update Portal Period
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790] transition-colors"
                                        >
                                            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </SuperAdminLayout>
    );
}
