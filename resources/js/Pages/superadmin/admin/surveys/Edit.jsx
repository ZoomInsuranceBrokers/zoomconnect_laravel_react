import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useTheme } from '../../../../Context/ThemeContext';

export default function Edit({ survey }) {
    const { data, setData, post, processing, errors } = useForm({
        name: survey.name || '',
        description: survey.description || '',
        logo: null,
        _method: 'PUT',
    });

    const [logoPreview, setLogoPreview] = useState(survey.logo ? `/${survey.logo}` : null);
    const { darkMode } = useTheme();

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('superadmin.admin.surveys.update', survey.id));
    };

    return (
        <SuperAdminLayout>
            <Head title="Edit Survey" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={route('superadmin.admin.surveys.index')}
                            className="text-xs text-[#934790] hover:underline mb-2 inline-block font-medium"
                        >
                            ← Back to Surveys
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900">Edit Survey</h1>
                    </div>

                    {/* Form */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-gray-700">
                                    Survey Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] text-sm"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description || ''}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#934790] focus:ring-[#934790] text-sm"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Logo */}
                            <div>
                                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                                    Survey Logo
                                </label>
                                <div className="mt-1 flex items-center space-x-4">
                                    {logoPreview && (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    )}
                                    <input
                                        type="file"
                                        id="logo"
                                        accept="image/jpeg,image/png,image/jpg,image/svg+xml"
                                        onChange={handleLogoChange}
                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-[#934790] hover:file:bg-purple-100"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Accepted formats: JPEG, PNG, JPG, SVG. Max size: 2MB
                                </p>
                                {errors.logo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('superadmin.admin.surveys.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#934790] hover:bg-[#7a3a77] disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
