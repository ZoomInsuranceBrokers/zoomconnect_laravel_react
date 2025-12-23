import React from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';

export default function EditEmployee({ company, employee, locations = [] }) {
    const { errors, flash } = usePage().props;

    // Split full_name into first and last if needed
    const nameParts = employee.full_name ? employee.full_name.split(' ') : ['', ''];
    const defaultFirstName = employee.first_name || nameParts[0] || '';
    const defaultLastName = employee.last_name || nameParts.slice(1).join(' ') || '';

    // Use same form structure as AddSingleEmployee (use 'doj' for date of joining)
    const { data, setData, put, processing, errors: formErrors, reset } = useForm({
        first_name: defaultFirstName,
        last_name: defaultLastName,
        employee_code: employee.employees_code || '',
        designation: employee.designation || '',
        email: employee.email || '',
        dob: employee.dob ? employee.dob.split(' ')[0] : '',
        doj: employee.date_of_joining ? employee.date_of_joining.split(' ')[0] : '',
        gender: employee.gender || '',
        grade: employee.grade || '',
        location_id: employee.location_id || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('corporate.employee.update', [company.comp_id, employee.id]), {
            preserveScroll: true,
        });
    };

    const inputClass = (fieldName) =>
        `w-full mt-1 px-2 py-1.5 border ${formErrors[fieldName] || errors[fieldName] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#934790]/60 focus:border-[#934790] transition-all duration-150 placeholder-gray-400`;

    const labelClass = "text-xs font-semibold text-gray-700";

    return (
        <SuperAdminLayout>
            <Head title={`Edit Employee - ${employee.full_name || 'Employee'}`} />
            <div className="p-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-semibold text-gray-800">Edit Employee</h1>
                    <Link
                        href={route('corporate.manage-employees', company.comp_id)}
                        className="text-sm text-[#934790] hover:underline transition"
                    >
                        ← Back to Employees
                    </Link>
                </div>

                {/* Success Message */}
                {flash?.message && flash?.messageType === 'success' && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">
                        {flash.message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow-md text-sm"
                >
                    <div>
                        <label className={labelClass}>First Name <span className="text-red-500">*</span></label>
                        <input
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            className={inputClass('first_name')}
                            placeholder="Enter first name"
                        />
                        {(formErrors.first_name || errors.first_name) && <p className="text-red-500 text-xs mt-1">{formErrors.first_name || errors.first_name}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Last Name <span className="text-red-500">*</span></label>
                        <input
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            className={inputClass('last_name')}
                            placeholder="Enter last name"
                        />
                        {(formErrors.last_name || errors.last_name) && <p className="text-red-500 text-xs mt-1">{formErrors.last_name || errors.last_name}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Employee Code <span className="text-red-500">*</span></label>
                        <input
                            value={data.employee_code}
                            onChange={(e) => setData('employee_code', e.target.value)}
                            className={inputClass('employee_code')}
                            placeholder="e.g. EMP123"
                        />
                        {(formErrors.employee_code || errors.employee_code) && <p className="text-red-500 text-xs mt-1">{formErrors.employee_code || errors.employee_code}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Designation <span className="text-red-500">*</span></label>
                        <input
                            value={data.designation}
                            onChange={(e) => setData('designation', e.target.value)}
                            className={inputClass('designation')}
                            placeholder="e.g. Manager"
                        />
                        {(formErrors.designation || errors.designation) && <p className="text-red-500 text-xs mt-1">{formErrors.designation || errors.designation}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClass('email')}
                            placeholder="Enter email address"
                        />
                        {(formErrors.email || errors.email) && <p className="text-red-500 text-xs mt-1">{formErrors.email || errors.email}</p>}
                    </div>

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
                        {(formErrors.location_id || errors.location_id) && <p className="text-red-500 text-xs mt-1">{formErrors.location_id || errors.location_id}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                            className={inputClass('dob')}
                        />
                        {(formErrors.dob || errors.dob) && <p className="text-red-500 text-xs mt-1">{formErrors.dob || errors.dob}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Date of Joining <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            value={data.doj}
                            onChange={(e) => setData('doj', e.target.value)}
                            className={inputClass('doj')}
                        />
                        {(formErrors.doj || errors.doj) && <p className="text-red-500 text-xs mt-1">{formErrors.doj || errors.doj}</p>}
                    </div>

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
                        {(formErrors.gender || errors.gender) && <p className="text-red-500 text-xs mt-1">{formErrors.gender || errors.gender}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Grade <span className="text-red-500">*</span></label>
                        <input
                            value={data.grade}
                            onChange={(e) => setData('grade', e.target.value)}
                            className={inputClass('grade')}
                            placeholder="Enter grade"
                        />
                        {(formErrors.grade || errors.grade) && <p className="text-red-500 text-xs mt-1">{formErrors.grade || errors.grade}</p>}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
                        <Link
                            href={route('corporate.manage-employees', company.comp_id)}
                            className="px-4 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className={`px-4 py-1.5 rounded-md text-sm text-white shadow-sm transition-all duration-150 ${processing ? 'bg-[#934790]/60 cursor-not-allowed' : 'bg-[#934790] hover:bg-[#7e3d7c]'}`}
                        >
                            {processing ? 'Saving...' : 'Update Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
