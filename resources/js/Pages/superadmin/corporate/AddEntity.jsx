import React, { useState } from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

// Indian states
const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function AddEntity({ company }) {
    const { flash } = usePage().props;
    const [lookingUpPincode, setLookingUpPincode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        branch_name: '',
        address: '',
        state_name: '',
        city: '',
        pincode: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('corporate.entity.store', company.comp_id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    // Fetch city and state from pincode API
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
                        city: postOffice.District || postOffice.Region || '',
                    }));
                } else {
                    // Pincode not found, clear fields
                    setData(data => ({
                        ...data,
                        state_name: '',
                        city: '',
                    }));
                }
            } catch (error) {
                console.error('Error fetching pincode data:', error);
            } finally {
                setLookingUpPincode(false);
            }
        }
    };

    const inputClass = (field) =>
        `w-full mt-1 px-2 py-1.5 border ${errors[field] ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#934790]/60 focus:border-[#934790] transition-all duration-150`;

    const labelClass = "text-xs font-semibold text-gray-700";

    return (
        <SuperAdminLayout>
            <Head title={`Add Entity - ${company?.comp_name || 'Company'}`} />

            <div className="p-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-semibold text-gray-800">Add Entity</h1>
                    <Link
                        href={route('corporate.manage-entity', company.comp_id)}
                        className="text-sm text-[#934790] hover:underline transition"
                    >
                        ← Back to Entities
                    </Link>
                </div>

                {/* Success Message */}
                {flash?.message && flash?.messageType === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                        {flash.message}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-md text-sm"
                >
                    {/* Entity Name */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Entity Name <span className="text-red-500">*</span></label>
                        <input
                            value={data.branch_name}
                            onChange={(e) => setData('branch_name', e.target.value)}
                            className={inputClass('branch_name')}
                            placeholder="Enter entity/branch name"
                        />
                        {errors.branch_name && <p className="text-red-500 text-xs mt-1">{errors.branch_name}</p>}
                    </div>

                    {/* Entity Address */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Entity Address <span className="text-red-500">*</span></label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className={inputClass('address')}
                            placeholder="Enter complete address"
                            rows="3"
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className={labelClass}>Pincode <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            maxLength="6"
                            value={data.pincode}
                            onChange={handlePincodeChange}
                            className={inputClass('pincode')}
                            placeholder="Enter 6-digit pincode"
                        />
                        {lookingUpPincode && <p className="text-blue-500 text-xs mt-1">Looking up pincode...</p>}
                        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label className={labelClass}>City <span className="text-red-500">*</span></label>
                        <input
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            className={inputClass('city')}
                            placeholder="City (auto-filled from pincode)"
                            readOnly={lookingUpPincode}
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* State */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>State <span className="text-red-500">*</span></label>
                        <select
                            value={data.state_name}
                            onChange={(e) => setData('state_name', e.target.value)}
                            className={inputClass('state_name')}
                        >
                            <option value="">Select State</option>
                            {indianStates.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                        {errors.state_name && <p className="text-red-500 text-xs mt-1">{errors.state_name}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
                        <Link
                            href={route('corporate.manage-entity', company.comp_id)}
                            className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-4 py-1.5 rounded-md text-sm text-white shadow-sm transition-all duration-150 ${processing
                                ? 'bg-[#934790]/60 cursor-not-allowed'
                                : 'bg-[#934790] hover:bg-[#7e3d7c]'
                                }`}
                        >
                            {processing ? 'Saving...' : 'Save Entity'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
