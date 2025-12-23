import React, { useState, useMemo } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';
import { usePermissions } from '../../../../Hooks/usePermissions';
import CanAccess from '../../../../Components/CanAccess';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Index({ roles = [] }) {
    const { darkMode } = useTheme();
    const { hasRoute } = usePermissions();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ role_name: '', role_desc: '', is_active: true });
    const [loading, setLoading] = useState(false);

    // Filtered roles
    const filtered = useMemo(() => {
        const q = search ? search.toLowerCase() : '';
        return roles.filter(r => {
            if (!q) return true;
            return (r.role_name && r.role_name.toLowerCase().includes(q)) || 
                   (r.role_desc && r.role_desc.toLowerCase().includes(q));
        });
    }, [roles, search]);

    // Pagination
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const paged = filtered.slice(startIndex, startIndex + perPage);

    const handleCreateRole = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(route('superadmin.admin.roles.create'), formData);
            if (response.data.success) {
                toast.success('Role created successfully');
                setShowCreateModal(false);
                setFormData({ role_name: '', role_desc: '', is_active: true });
                router.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRole = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(route('superadmin.admin.roles.update', selectedRole.id), formData);
            if (response.data.success) {
                toast.success('Role updated successfully');
                setShowEditModal(false);
                setSelectedRole(null);
                router.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (!confirm('Are you sure you want to delete this role?')) return;
        
        try {
            const response = await axios.delete(route('superadmin.admin.roles.delete', roleId));
            if (response.data.success) {
                toast.success('Role deleted successfully');
                router.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete role');
        }
    };

    const openEditModal = (role) => {
        setSelectedRole(role);
        setFormData({
            role_name: role.role_name,
            role_desc: role.role_desc || '',
            is_active: role.is_active === 1,
        });
        setShowEditModal(true);
    };

    const handleManagePermissions = (id) => {
        // Use Laravel named route helper to build URL with the correct parameter
        router.visit(route('superadmin.admin.roles.permissions.manage', id));
    };

    return (
        <SuperAdminLayout>
            <Head title="Users & Permissions" />
            <div className={`p-4 h-full overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-semibold">Users & Permissions</h1>
                        <div className="text-xs text-gray-500">Manage roles and assign permissions for access control</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <CanAccess route="superadmin.admin.roles.create">
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[#934790] hover:bg-[#6A0066] text-white px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-2"
                            >
                                <span className="text-lg leading-none">+</span>
                                Create Role
                            </button>
                        </CanAccess>
                    </div>
                </div>

                {/* Search bar */}
                <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className={`w-64 pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                            />
                            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21L16.65 16.65" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <label className="text-xs text-gray-500">Per page</label>
                            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded px-2 py-1 text-sm">
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Roles Table */}
                {roles.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center bg-white shadow-sm">
                        <div className="mx-auto w-36 h-36 flex items-center justify-center rounded-full bg-gradient-to-br from-[#f6e6fb] to-[#f3d9f2] mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#934790]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No roles yet</h2>
                        <p className="text-gray-600 mb-4">Create roles to manage user permissions and access control.</p>
                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#934790] text-white px-4 py-2 rounded-md"
                        >
                            Create your first role
                        </button>
                    </div>
                ) : (
                    <div className={`bg-white rounded-lg shadow overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <table className="w-full min-w-max">
                            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b`}>
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Role Name</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">Description</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Status</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {paged.map(role => (
                                    <tr key={role.role_id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <div className="text-[11px] font-medium text-gray-900">{role.role_name}</div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="text-[10px] text-gray-500">{role.role_desc || '-'}</div>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-[9px] font-semibold rounded-full ${role.is_active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {role.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-[10px]">
                                            <div className="flex items-center gap-2">
                                                <CanAccess route="superadmin.admin.roles-permissions.index">
                                                    <button 
                                                        onClick={() => handleManagePermissions(role.id)}
                                                        className="text-[#5B6FFF] hover:text-[#4456CC] font-medium"
                                                    >
                                                        Manage Permissions
                                                    </button>
                                                </CanAccess>
                                                <CanAccess route="superadmin.admin.roles.update">
                                                    <button 
                                                        onClick={() => openEditModal(role)}
                                                        className="text-gray-500 hover:text-gray-700"
                                                        title="Edit Role"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </CanAccess>
                                                <CanAccess route="superadmin.admin.roles.destroy">
                                                    <button 
                                                        onClick={() => handleDeleteRole(role.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete Role"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </CanAccess>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 border-t flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    Showing {startIndex + 1} to {Math.min(startIndex + perPage, total)} of {total} roles
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-1 text-xs border rounded ${currentPage === i + 1 ? 'bg-[#934790] text-white' : 'hover:bg-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button 
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-xs border rounded disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Role Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
                        <form onSubmit={handleCreateRole}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role_name}
                                    onChange={e => setFormData({ ...formData, role_name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                    placeholder="e.g., Manager"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.role_desc}
                                    onChange={e => setFormData({ ...formData, role_desc: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                    placeholder="Brief description of this role"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#6A0066] disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Edit Role</h2>
                        <form onSubmit={handleEditRole}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role_name}
                                    onChange={e => setFormData({ ...formData, role_name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.role_desc}
                                    onChange={e => setFormData({ ...formData, role_desc: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                    rows={3}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-gray-300 text-[#934790] focus:ring-[#934790]"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#6A0066] disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
