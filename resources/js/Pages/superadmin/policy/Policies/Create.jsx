import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

export default function Create({ insuranceProviders, escalationUsers }) {
    const [formData, setFormData] = useState({
        policy_name: '',
        corporate_policy_name: '',
        policy_number: '',
        family_defination: '',
        policy_type: '',
        policy_type_definition: '',
        policy_start_date: '',
        policy_end_date: '',
        policy_document: null,
        policy_directory_name: '',
        ins_id: '',
        tpa_id: '',
        cd_ac_id: '',
        data_escalation_id: '',
        claim_level_1_id: '',
        claim_level_2_id: '',
        is_active: 1,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();

            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await router.post('/superadmin/policy/policies', formDataToSend, {
                onError: (errors) => {
                    setErrors(errors);
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    router.visit('/superadmin/policy/policies');
                }
            });
        } catch (error) {
            console.error('Form submission error:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Policy</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Add a new insurance policy to the system.
                            </p>
                        </div>
                        <Link
                            href="/superadmin/policy/policies"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Back to Policies
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="policy_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Name *
                                </label>
                                <input
                                    type="text"
                                    id="policy_name"
                                    name="policy_name"
                                    value={formData.policy_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                    required
                                />
                                {errors.policy_name && <p className="mt-1 text-sm text-red-600">{errors.policy_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="corporate_policy_name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Corporate Policy Name
                                </label>
                                <input
                                    type="text"
                                    id="corporate_policy_name"
                                    name="corporate_policy_name"
                                    value={formData.corporate_policy_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.corporate_policy_name && <p className="mt-1 text-sm text-red-600">{errors.corporate_policy_name}</p>}
                            </div>

                            <div>
                                <label htmlFor="policy_number" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Number
                                </label>
                                <input
                                    type="text"
                                    id="policy_number"
                                    name="policy_number"
                                    value={formData.policy_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.policy_number && <p className="mt-1 text-sm text-red-600">{errors.policy_number}</p>}
                            </div>

                            <div>
                                <label htmlFor="family_defination" className="block text-sm font-medium text-gray-700 mb-1">
                                    Family Definition
                                </label>
                                <select
                                    id="family_defination"
                                    name="family_defination"
                                    value={formData.family_defination}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                >
                                    <option value="">Select Family Definition</option>
                                    <option value="self">Self</option>
                                    <option value="self_spouse">Self + Spouse</option>
                                    <option value="self_spouse_children">Self + Spouse + Children</option>
                                    <option value="self_children">Self + Children</option>
                                </select>
                                {errors.family_defination && <p className="mt-1 text-sm text-red-600">{errors.family_defination}</p>}
                            </div>
                        </div>

                        {/* Policy Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="policy_type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Type
                                </label>
                                <select
                                    id="policy_type"
                                    name="policy_type"
                                    value={formData.policy_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                >
                                    <option value="">Select Policy Type</option>
                                    <option value="health">Health Insurance</option>
                                    <option value="life">Life Insurance</option>
                                    <option value="accident">Accident Insurance</option>
                                    <option value="critical_illness">Critical Illness</option>
                                </select>
                                {errors.policy_type && <p className="mt-1 text-sm text-red-600">{errors.policy_type}</p>}
                            </div>

                            <div>
                                <label htmlFor="policy_type_definition" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Type Definition
                                </label>
                                <input
                                    type="text"
                                    id="policy_type_definition"
                                    name="policy_type_definition"
                                    value={formData.policy_type_definition}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.policy_type_definition && <p className="mt-1 text-sm text-red-600">{errors.policy_type_definition}</p>}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="policy_start_date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy Start Date
                                </label>
                                <input
                                    type="date"
                                    id="policy_start_date"
                                    name="policy_start_date"
                                    value={formData.policy_start_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.policy_start_date && <p className="mt-1 text-sm text-red-600">{errors.policy_start_date}</p>}
                            </div>

                            <div>
                                <label htmlFor="policy_end_date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Policy End Date
                                </label>
                                <input
                                    type="date"
                                    id="policy_end_date"
                                    name="policy_end_date"
                                    value={formData.policy_end_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.policy_end_date && <p className="mt-1 text-sm text-red-600">{errors.policy_end_date}</p>}
                            </div>
                        </div>

                        {/* Providers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="ins_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Insurance Provider *
                                </label>
                                <select
                                    id="ins_id"
                                    name="ins_id"
                                    value={formData.ins_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Insurance Provider</option>
                                    {insuranceProviders.map(provider => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.insurance_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ins_id && <p className="mt-1 text-sm text-red-600">{errors.ins_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="tpa_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    TPA ID
                                </label>
                                <input
                                    type="text"
                                    id="tpa_id"
                                    name="tpa_id"
                                    value={formData.tpa_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.tpa_id && <p className="mt-1 text-sm text-red-600">{errors.tpa_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="cd_ac_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    CD Account ID
                                </label>
                                <input
                                    type="text"
                                    id="cd_ac_id"
                                    name="cd_ac_id"
                                    value={formData.cd_ac_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                                {errors.cd_ac_id && <p className="mt-1 text-sm text-red-600">{errors.cd_ac_id}</p>}
                            </div>
                        </div>

                        {/* Escalation Users */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="data_escalation_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data Escalation User
                                </label>
                                <select
                                    id="data_escalation_id"
                                    name="data_escalation_id"
                                    value={formData.data_escalation_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                >
                                    <option value="">Select User</option>
                                    {escalationUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.designation}
                                        </option>
                                    ))}
                                </select>
                                {errors.data_escalation_id && <p className="mt-1 text-sm text-red-600">{errors.data_escalation_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="claim_level_1_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Claim Level 1 User
                                </label>
                                <select
                                    id="claim_level_1_id"
                                    name="claim_level_1_id"
                                    value={formData.claim_level_1_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                >
                                    <option value="">Select User</option>
                                    {escalationUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.designation}
                                        </option>
                                    ))}
                                </select>
                                {errors.claim_level_1_id && <p className="mt-1 text-sm text-red-600">{errors.claim_level_1_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="claim_level_2_id" className="block text-sm font-medium text-gray-700 mb-1">
                                    Claim Level 2 User
                                </label>
                                <select
                                    id="claim_level_2_id"
                                    name="claim_level_2_id"
                                    value={formData.claim_level_2_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                >
                                    <option value="">Select User</option>
                                    {escalationUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} - {user.designation}
                                        </option>
                                    ))}
                                </select>
                                {errors.claim_level_2_id && <p className="mt-1 text-sm text-red-600">{errors.claim_level_2_id}</p>}
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div>
                            <label htmlFor="policy_document" className="block text-sm font-medium text-gray-700 mb-1">
                                Policy Document
                            </label>
                            <input
                                type="file"
                                id="policy_document"
                                name="policy_document"
                                onChange={handleInputChange}
                                accept=".pdf,.doc,.docx"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                            />
                            {errors.policy_document && <p className="mt-1 text-sm text-red-600">{errors.policy_document}</p>}
                        </div>

                        {/* Directory Name */}
                        <div>
                            <label htmlFor="policy_directory_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Policy Directory Name
                            </label>
                            <input
                                type="text"
                                id="policy_directory_name"
                                name="policy_directory_name"
                                value={formData.policy_directory_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                            />
                            {errors.policy_directory_name && <p className="mt-1 text-sm text-red-600">{errors.policy_directory_name}</p>}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-[#934790] focus:ring-[#934790] border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Active Policy
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                href="/superadmin/policy/policies"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#934790] text-white rounded-md hover:bg-[#7a3d7a] focus:outline-none focus:ring-2 focus:ring-[#934790] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Policy'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
