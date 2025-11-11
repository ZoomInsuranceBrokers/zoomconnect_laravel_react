import React, { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';

// Virtualized Table Component
const VirtualizedTable = ({
    employees,
    selectedEmployees,
    onSelectEmployee,
    onSelectAll,
    searchQuery
}) => {
    const [scrollTop, setScrollTop] = useState(0);
    const rowHeight = 40; // Height of each row in pixels
    const containerHeight = 600; // Height of the table container
    const visibleRows = Math.ceil(containerHeight / rowHeight);
    const bufferSize = 5; // Extra rows to render for smooth scrolling

    // Calculate which rows to render
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - bufferSize);
    const endIndex = Math.min(employees.length, startIndex + visibleRows + bufferSize * 2);
    const visibleEmployees = employees.slice(startIndex, endIndex);

    const totalHeight = employees.length * rowHeight;
    const offsetY = startIndex * rowHeight;

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    return (
        <div className="bg-white shadow overflow-hidden rounded-lg">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-7 gap-2 px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="text-center border-r">
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="checkbox"
                                id="checkboxOg"
                                checked={selectedEmployees.length === employees.length && employees.length > 0}
                                onChange={onSelectAll}
                                className="h-3.5 w-3.5 text-[#934790] focus:ring-[#934790] border-gray-300 rounded"
                            />
                            <label htmlFor="checkboxOg" className="text-xs font-bold">
                                Select All
                            </label>
                        </div>
                    </div>
                    <div className="px-3 border-r">Employee Code</div>
                    <div className="px-3 border-r">Name</div>
                    <div className="px-3 border-r">Email</div>
                    <div className="px-3 border-r">Gender</div>
                    <div className="px-3 border-r">Designation</div>
                    <div className="px-3">Grade</div>
                </div>
            </div>

            {/* Virtualized Table Body */}
            <div
                className="overflow-auto relative"
                style={{ height: containerHeight }}
                onScroll={handleScroll}
            >
                <div style={{ height: totalHeight, position: 'relative' }}>
                    <div style={{ transform: `translateY(${offsetY}px)` }}>
                        {visibleEmployees.map((employee, index) => {
                            const actualIndex = startIndex + index;
                            return (
                                <div
                                    key={employee.id}
                                    className="grid grid-cols-7 gap-2 px-2 py-2 border-b border-gray-200 hover:bg-gray-50"
                                    style={{ height: rowHeight }}
                                >
                                    <div className="text-center border-r flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            id={`checkbox${actualIndex}`}
                                            checked={selectedEmployees.includes(employee.id)}
                                            onChange={() => onSelectEmployee(employee.id)}
                                            value={employee.id}
                                            name="office[]"
                                            className="h-3.5 w-3.5 text-[#934790] focus:ring-[#934790] border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="px-3 border-r flex items-center text-xs text-gray-900 truncate">
                                        {employee.employees_code || 'N/A'}
                                    </div>
                                    <div className="px-3 border-r flex items-center text-xs text-gray-900 truncate">
                                        {employee.full_name || 'N/A'}
                                    </div>
                                    <div className="px-3 border-r flex items-center text-xs text-gray-900 truncate">
                                        {employee.email || 'N/A'}
                                    </div>
                                    <div className="px-3 border-r flex items-center text-xs text-gray-900 truncate">
                                        {employee.gender ? employee.gender.toUpperCase() : 'N/A'}
                                    </div>
                                    <div className="px-3 border-r flex items-center text-xs text-gray-900 truncate">
                                        {employee.designation || 'N/A'}
                                    </div>
                                    <div className="px-3 flex items-center text-xs text-gray-900 truncate">
                                        {employee.grade ? `${employee.grade}` : 'N/A'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* No results message */}
                {employees.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xs font-medium text-gray-900 mb-1">No employees found</h3>
                        <p className="text-xs text-gray-500">
                            {searchQuery ? 'No employees match your search criteria.' : 'No eligible employees available for this enrollment period.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function SelectEmployeesForPortal({
    enrollmentPeriod,
    unmappedEmployees,
    mappedEmployeeIds,
    familyDefinition,
    gradeExclusions
}) {
    // Initialize selected employees based on mapped employees for creation_status = 2
    const [selectedEmployees, setSelectedEmployees] = useState(
        enrollmentPeriod.creation_status === 2 ? (mappedEmployeeIds || []) : []
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [processing, setProcessing] = useState(false);

    // Add safety check for unmappedEmployees
    if (!unmappedEmployees) {
        return (
            <SuperAdminLayout>
                <div className="min-h-screen bg-gray-50 py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-lg font-medium text-gray-900">Loading...</h2>
                            <p className="text-gray-600">Please wait while we load the employee data.</p>
                        </div>
                    </div>
                </div>
            </SuperAdminLayout>
        );
    }

    // Ensure unmappedEmployees is an array
    const employeesList = Array.isArray(unmappedEmployees) ? unmappedEmployees : [];

    // Memoized filtering for better performance
    const filteredEmployees = useMemo(() => {
        if (!searchQuery.trim()) return employeesList;

        const query = searchQuery.toLowerCase();
        return employeesList.filter(employee => {
            return (employee.full_name?.toLowerCase() || '').includes(query) ||
                   (employee.employees_code?.toLowerCase() || '').includes(query) ||
                   (employee.email?.toLowerCase() || '').includes(query) ||
                   (employee.grade?.toLowerCase() || '').includes(query) ||
                   (employee.designation?.toLowerCase() || '').includes(query);
        });
    }, [employeesList, searchQuery]);

    // Event handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmployees(filteredEmployees.map(emp => emp.id));
        } else {
            setSelectedEmployees([]);
        }
    };

    const handleSelectEmployee = (empId) => {
        setSelectedEmployees(prev => {
            if (prev.includes(empId)) {
                return prev.filter(id => id !== empId);
            } else {
                return [...prev, empId];
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAssignEmployees = (e) => {
        e.preventDefault();
        if (selectedEmployees.length === 0) {
            alert('Please select at least one employee to assign.');
            return;
        }

        setProcessing(true);

        const formData = {
            office: selectedEmployees,
            portal_id: enrollmentPeriod.id,
            enrolment_id: enrollmentPeriod.enrolment_id
        };

        console.log('Submitting form data:', formData);
        console.log('Route URL:', route('superadmin.policy.employee-mapping'));

        router.post(route('superadmin.policy.employee-mapping'), formData, {
            preserveState: false,
            onFinish: () => setProcessing(false),
            onSuccess: (page) => {
                console.log('Success response:', page);
            },
            onError: (errors) => {
                console.error('Assignment failed:', errors);
                setProcessing(false);
            }
        });
    };

    return (
        <SuperAdminLayout>
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Link
                                    href={`/superadmin/policy/enrollment-details/${enrollmentPeriod.enrolment_id}`}
                                    className="mr-4 p-2 bg-[#934790] hover:bg-[#7a3d7a] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#934790]"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <div className="ml-2">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        {enrollmentPeriod.creation_status === 2 ? 'Edit Employee Selection' : 'Select Employees for Portal'}
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {enrollmentPeriod.creation_status === 2
                                            ? `Modify employee selection for ${enrollmentPeriod.enrolment_portal_name}. Currently selected employees are checked.`
                                            : `Select employees for ${enrollmentPeriod.enrolment_portal_name}`
                                        }
                                    </p>
                                </div>
                            </div>
                            {/* Go to Live Portal Button */}
                            <div className="flex space-x-3">
                                <Link
                                    href={`/superadmin/view-live-portal/${enrollmentPeriod.id}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Go to Live Portal
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner for Edit Mode */}
                    {enrollmentPeriod.creation_status === 2 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Edit Mode - Employee Selection
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <p>
                                            • Previously selected employees are already checked<br/>
                                            • You can uncheck employees to remove them from the portal<br/>
                                            • You can check additional employees to add them to the portal<br/>
                                            • Use the search function to find specific employees
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Employee Count */}
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-red-600">
                            Total No. of Employees Selected: {selectedEmployees.length}
                        </h4>
                    </div>                    {/* Search and Actions */}
                    <div className="bg-white shadow rounded-lg mb-6 p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#934790] focus:border-[#934790]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Virtualized Employees Table */}
                    <form onSubmit={handleAssignEmployees}>
                        <VirtualizedTable
                            employees={filteredEmployees}
                            selectedEmployees={selectedEmployees}
                            onSelectEmployee={handleSelectEmployee}
                            onSelectAll={handleSelectAll}
                            searchQuery={searchQuery}
                        />

                        {/* Submit Button */}
                        <div className="bg-white px-6 py-4 text-center border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={selectedEmployees.length === 0 || processing}
                                className={`w-60 py-2 px-4 rounded-md text-xs font-medium transition-colors duration-200 ${
                                    selectedEmployees.length > 0 && !processing
                                        ? 'text-white bg-[#934790] hover:bg-[#7a3d7a] focus:ring-[#934790] focus:outline-none focus:ring-2 focus:ring-offset-2'
                                        : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white inline" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    enrollmentPeriod.creation_status === 2
                                        ? 'Update Employee Selection'
                                        : 'Select For Enrolment Portal'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Summary */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-600">
                            Total: {filteredEmployees.length} eligible employees
                            {searchQuery && (
                                <span> (filtered from {employeesList.length} total)</span>
                            )}
                            {gradeExclusions && gradeExclusions.length > 0 && (
                                <span> • Excluding grades: {gradeExclusions.join(', ')}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
