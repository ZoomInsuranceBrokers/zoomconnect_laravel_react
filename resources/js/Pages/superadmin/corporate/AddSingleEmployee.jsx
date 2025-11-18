import React from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function AddSingleEmployee({ company, locations = [] }) {
    const { flash } = usePage().props;

    // ✅ useForm automatically manages data, errors & post state
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        employee_code: '',
        designation: '',
        email: '',
        dob: '',
        doj: '',
        gender: '',
        grade: '',
        location_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('corporate.employee.store', company.comp_id), {
            preserveScroll: true,
            onSuccess: () => reset(), // clear form on success
        });
    };

    const inputClass = (field) =>
        `w-full mt-1 px-2 py-1.5 border ${errors[field] ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#934790]/60 focus:border-[#934790] transition-all duration-150`;

    const labelClass = "text-xs font-semibold text-gray-700";

    return (
        <SuperAdminLayout>
            <Head title={`Add Employee - ${company?.comp_name || 'Company'}`} />

            <div className="p-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-semibold text-gray-800">Add Employee (Single Entry)</h1>
                    <Link
                        href={route('corporate.manage-employees', company.comp_id)}
                        className="text-sm text-[#934790] hover:underline transition"
                    >
                        ← Back to Employees
                    </Link>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-md text-sm"
                >
                    {/* First Name */}
                    <div>
                        <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                        <input
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className={inputClass('first_name')}
                            placeholder="Enter first name"
                        />
                        {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                        <input
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className={inputClass('last_name')}
                            placeholder="Enter last name"
                        />
                        {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                    </div>

                    {/* Employee Code */}
                    <div>
                        <label className={labelClass}>Employee Code <span className="text-red-500">*</span></label>
                        <input
                            value={data.employee_code}
                            onChange={(e) => setData('employee_code', e.target.value)}
                            className={inputClass('employee_code')}
                            placeholder="e.g. EMP123"
                        />
                        {errors.employee_code && <p className="text-red-500 text-xs mt-1">{errors.employee_code}</p>}
                    </div>

                    {/* Designation */}
                    <div>
                        <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                        <input
                            value={data.designation}
                            onChange={(e) => setData('designation', e.target.value)}
                            className={inputClass('designation')}
                            placeholder="e.g. Manager"
                        />
                        {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClass('email')}
                            placeholder="Enter email address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                        <select
                            value={data.location_id}
                            onChange={(e) => setData('location_id', e.target.value)}
                            className={inputClass('location_id')}
                        >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.branch_name}
                                </option>
                            ))}
                        </select>
                        {errors.location_id && <p className="text-red-500 text-xs mt-1">{errors.location_id}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                            className={inputClass('dob')}
                        />
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                    </div>

                    {/* Date of Joining */}
                    <div>
                        <label className={labelClass}>Date of Joining <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={data.doj}
                            onChange={(e) => setData('doj', e.target.value)}
                            className={inputClass('doj')}
                        />
                        {errors.doj && <p className="text-red-500 text-xs mt-1">{errors.doj}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            {['male', 'female', 'other'].map((g) => (
                                <label key={g} className="flex items-center text-gray-700 capitalize">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={data.gender === g}
                                        onChange={(e) => setData('gender', e.target.value)}
                                        className="mr-2 accent-[#934790]"
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    {/* Grade */}
                    <div>
                        <label className={labelClass}>Grade <span className="text-red-500">*</span></label>
                        <input
                            value={data.grade}
                            onChange={(e) => setData('grade', e.target.value)}
                            className={inputClass('grade')}
                            placeholder="Enter grade"
                        />
                        {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
                        <Link
                            href={route('corporate.manage-employees', company.comp_id)}
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
                            {processing ? 'Saving...' : 'Save Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
