import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import {
    FiSearch, FiFilter, FiDownload, FiX, FiChevronLeft, FiChevronRight,
    FiUsers, FiUserCheck, FiUserX, FiUserPlus, FiCalendar, FiMail, 
    FiPhone, FiMapPin, FiBriefcase, FiAward
} from 'react-icons/fi';

export default function Employees({ user, employees, stats, filters, currentFilters }) {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [filterValues, setFilterValues] = useState(currentFilters || {});

    const handleFilterChange = (field, value) => {
        setFilterValues(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        router.get('/company-user/employees', filterValues, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setFilterValues({});
        router.get('/company-user/employees', {}, {
            preserveState: true,
            preserveScroll: true,
        });
        setShowFilterModal(false);
    };

    const exportToCSV = () => {
        const csvData = employees.data.map(emp => ({
            'Full Name': emp.full_name,
            'Employee Code': emp.employees_code,
            'Email': emp.email,
            'Location': emp.location?.branch_name || 'N/A',
            'Date of Joining': emp.date_of_joining,
            'Grade': emp.grade || 'N/A',
            'Designation': emp.designation || 'N/A',
            'Status': emp.is_active ? 'Active' : 'Inactive',
        }));

        const headers = Object.keys(csvData[0]);
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const viewEmployeeDetails = (employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
    };

    return (
        <CompanyUserLayout user={user}>
            {/* Mirror Effect Background */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-transparent blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent blur-[100px] rounded-full"></div>
            </div>

       

            {/* 70-30 Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                {/* LEFT: 70% - Employee Table */}
                <div className="lg:col-span-7">
                    {/* Search and Actions Bar */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 mb-4 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                            <div className="flex-1 relative w-full">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or employee code..."
                                    className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 bg-white"
                                    value={filterValues.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setShowFilterModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl hover:bg-gray-50 bg-white transition-all"
                                >
                                    <FiFilter className="w-3.5 h-3.5" />
                                    <span>Filters</span>
                                    {Object.keys(filterValues).filter(k => filterValues[k]).length > 0 && (
                                        <span className="bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                            {Object.keys(filterValues).filter(k => filterValues[k]).length}
                                        </span>
                                    )}
                                </button>
                                <button 
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-[#2d2d2d] text-white rounded-xl hover:bg-[#1f1f1f] transition-all"
                                >
                                    <FiDownload className="w-3.5 h-3.5" />
                                    <span>CSV</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Full Name</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Emp Code</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Location</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">DOJ</th>
                                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Designation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {employees?.data?.length > 0 ? (
                                        employees.data.map((employee) => (
                                            <tr 
                                                key={employee.id} 
                                                onClick={() => viewEmployeeDetails(employee)}
                                                className="hover:bg-purple-50/50 transition-colors cursor-pointer"
                                            >
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                                                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                                                        </div>
                                                        <div className="leading-tight">
                                                            <div className="text-xs font-medium text-gray-900">{employee.full_name}</div>
                                                            <div className="text-[10px] mt-0.5">
                                                                <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                                                                    employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {employee.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700 font-mono">{employee.employees_code || 'N/A'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{employee.email}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{employee.location?.branch_name || 'N/A'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                                                    {employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{employee.designation || 'N/A'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-xs text-gray-500">No employees found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {employees?.data?.length > 0 && (
                            <div className="bg-gray-50/80 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs text-gray-700">
                                            Showing <span className="font-medium">{employees.from}</span> to{' '}
                                            <span className="font-medium">{employees.to}</span> of{' '}
                                            <span className="font-medium">{employees.total}</span> employees
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={() => router.visit(employees.prev_page_url)}
                                                disabled={!employees.prev_page_url}
                                                className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <FiChevronLeft className="h-3 w-3" />
                                            </button>
                                            {employees.links?.filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;').map((link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => router.visit(link.url)}
                                                    className={`relative inline-flex items-center px-3 py-1.5 border text-xs font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                            <button
                                                onClick={() => router.visit(employees.next_page_url)}
                                                disabled={!employees.next_page_url}
                                                className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <FiChevronRight className="h-3 w-3" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: 30% - Stats Cards */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Dark Stats Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#2d2d2d] to-[#1f1f1f] rounded-2xl p-5 shadow-lg">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider">Overview</h3>
                                <FiUsers className="text-white/60 w-4 h-4" />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-3xl font-light text-white mb-1">{stats?.total || 0}</div>
                                    <div className="text-[10px] text-white/60 uppercase tracking-wide">Total Employees</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                                    <div>
                                        <div className="text-xl font-light text-white mb-1">{stats?.active || 0}</div>
                                        <div className="text-[10px] text-green-400 uppercase tracking-wide">Active</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-light text-white mb-1">{stats?.inactive || 0}</div>
                                        <div className="text-[10px] text-red-400 uppercase tracking-wide">Inactive</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Light Stats Card */}
                    <div className="relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-200/30 blur-[50px] rounded-full"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">This Month</h3>
                                <FiUserPlus className="text-gray-400 w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-3xl font-light text-gray-900 mb-1">{stats?.new_this_month || 0}</div>
                                <div className="text-[10px] text-gray-600 uppercase tracking-wide">New Joiners</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-3 shadow-sm">
                            <FiUserCheck className="text-green-500 w-4 h-4 mb-2" />
                            <div className="text-lg font-semibold text-gray-900">{stats?.active || 0}</div>
                            <div className="text-[9px] text-gray-600 uppercase tracking-wide">Active</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-xl p-3 shadow-sm">
                            <FiUserX className="text-red-500 w-4 h-4 mb-2" />
                            <div className="text-lg font-semibold text-gray-900">{stats?.inactive || 0}</div>
                            <div className="text-[9px] text-gray-600 uppercase tracking-wide">Inactive</div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-4">
                        <div className="text-xs text-gray-700 mb-2 font-medium">💡 Quick Tip</div>
                        <div className="text-[10px] text-gray-600 leading-relaxed">
                            Click on any employee row to view detailed information including contact details, enrollment data, and employment history.
                        </div>
                    </div>
                </div>
            </div>

              {showFilterModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-3xl bg-gradient-to-br from-white/80 to-white/70 rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                    <FiFilter className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white text-lg font-semibold">Refine Employees</h3>
                                    <p className="text-white/80 text-xs">Use filters to narrow down employee list</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={resetFilters} className="text-white/90 text-sm px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20">Reset</button>
                                <button onClick={() => setShowFilterModal(false)} className="text-white/90 p-2 rounded-md hover:bg-white/10">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Active chips */}
                        <div className="px-6 py-3 border-b border-white/30 bg-white/60">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(filterValues).filter(([k,v]) => v !== undefined && v !== null && v !== '').map(([k,v]) => (
                                    <div key={k} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                                        <span className="font-medium capitalize">{k.replace('_',' ')}</span>
                                        <span className="opacity-80">{v}</span>
                                        <button onClick={() => handleFilterChange(k, '')} className="ml-1 text-purple-600/80">×</button>
                                    </div>
                                ))}
                                {Object.entries(filterValues).filter(([k,v]) => v !== undefined && v !== null && v !== '').length === 0 && (
                                    <div className="text-xs text-gray-500">No filters selected</div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    placeholder="Name, email, or employee code..."
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.search || ''}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Location</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.location_id || ''}
                                    onChange={(e) => handleFilterChange('location_id', e.target.value)}
                                >
                                    <option value="">All Locations</option>
                                    {filters?.locations?.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.branch_name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Grade */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Grade</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.grade || ''}
                                    onChange={(e) => handleFilterChange('grade', e.target.value)}
                                >
                                    <option value="">All Grades</option>
                                    {filters?.grades?.map((grade, idx) => (
                                        <option key={idx} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Designation */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Designation</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.designation || ''}
                                    onChange={(e) => handleFilterChange('designation', e.target.value)}
                                >
                                    <option value="">All Designations</option>
                                    {filters?.designations?.map((des, idx) => (
                                        <option key={idx} value={des}>{des}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.is_active || ''}
                                    onChange={(e) => handleFilterChange('is_active', e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-2">Gender</label>
                                <select
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 shadow-sm"
                                    value={filterValues.gender || ''}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                >
                                    <option value="">All Genders</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-white/60 flex items-center justify-end gap-3 border-t border-white/30">
                            <button onClick={resetFilters} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">Reset</button>
                            <button onClick={() => setShowFilterModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100">Cancel</button>
                            <button onClick={applyFilters} className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700">Apply Filters</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Employee Detail Modal */}
            {showEmployeeModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-white/30">
                                    {selectedEmployee.first_name?.[0]}{selectedEmployee.last_name?.[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{selectedEmployee.full_name}</h3>
                                    <p className="text-sm text-white/80">{selectedEmployee.designation || 'Employee'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEmployeeModal(false)} className="text-white/80 hover:text-white">
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Basic Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <FiBriefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Employee Code</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.employees_code || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiMail className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Email</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiPhone className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Mobile</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.mobile || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiUsers className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Gender</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.gender || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Date of Birth</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {selectedEmployee.dob ? new Date(selectedEmployee.dob).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">Employment Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Location</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.location?.branch_name || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiBriefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Designation</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.designation || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiAward className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Grade</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.grade || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiCalendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Date of Joining</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {selectedEmployee.date_of_joining ? new Date(selectedEmployee.date_of_joining).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 mt-0.5">
                                                <span className={`inline-block w-3 h-3 rounded-full ${selectedEmployee.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">Status</div>
                                                <div className="text-sm font-medium text-gray-900">{selectedEmployee.is_active ? 'Active' : 'Inactive'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {selectedEmployee.dol && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="text-xs font-semibold text-red-900 mb-1">Date of Leaving</div>
                                    <div className="text-sm text-red-700">{new Date(selectedEmployee.dol).toLocaleDateString()}</div>
                                </div>
                            )}
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
                            <button
                                onClick={() => setShowEmployeeModal(false)}
                                className="px-6 py-2 text-sm font-medium text-white bg-[#2d2d2d] rounded-lg hover:bg-[#1f1f1f]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </CompanyUserLayout>
    );
}
