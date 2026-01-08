import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { Head, Link } from '@inertiajs/react';
import { useTheme } from '../../../../Context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PermissionManagement({ role, roleId }) {
    const { darkMode } = useTheme();
    const [permissions, setPermissions] = useState({});
    const [allRoutes, setAllRoutes] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMethod, setFilterMethod] = useState('ALL');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchPermissions();
    }, [roleId]);

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(route('superadmin.admin.roles.permissions', roleId));
            if (response.data.success) {
                // Convert permissions to route_id based structure
                const permMap = {};
                Object.entries(response.data.permissions).forEach(([module, perms]) => {
                    permMap[module] = perms.map(p => ({
                        route_id: p.route_id,
                        is_allowed: p.is_allowed,
                        route: p.route
                    }));
                });
                
                setPermissions(permMap);
                setAllRoutes(response.data.allRoutes);
                
                // Expand all modules by default
                const expanded = {};
                Object.keys(response.data.allRoutes).forEach(module => {
                    expanded[module] = true;
                });
                setExpandedModules(expanded);
            }
        } catch (error) {
            toast.error('Failed to load permissions');
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (module) => {
        setExpandedModules(prev => ({ ...prev, [module]: !prev[module] }));
    };

    const isRouteAllowed = (routeId) => {
        // Find permission across all modules
        for (const modulePerms of Object.values(permissions)) {
            const found = modulePerms.find(p => p.route_id === routeId);
            if (found) return found.is_allowed === 1;
        }
        return false;
    };

    const togglePermission = (module, routeId) => {
        const currentPermissions = permissions[module] || [];
        const existingIndex = currentPermissions.findIndex(p => p.route_id === routeId);
        
        let updatedModulePermissions;
        if (existingIndex >= 0) {
            updatedModulePermissions = [...currentPermissions];
            updatedModulePermissions[existingIndex] = {
                ...updatedModulePermissions[existingIndex],
                is_allowed: updatedModulePermissions[existingIndex].is_allowed === 1 ? 0 : 1
            };
        } else {
            // Find route info from allRoutes
            const routeInfo = allRoutes[module]?.find(r => r.id === routeId);
            updatedModulePermissions = [
                ...currentPermissions,
                { route_id: routeId, is_allowed: 1, route: routeInfo }
            ];
        }
        
        setPermissions({ ...permissions, [module]: updatedModulePermissions });
        setHasChanges(true);
    };

    const toggleAllModulePermissions = (module, allow) => {
        const routes = allRoutes[module] || [];
        const updatedPermissions = routes.map(route => ({
            route_id: route.id,
            is_allowed: allow ? 1 : 0,
            route: route
        }));
        
        setPermissions({ ...permissions, [module]: updatedPermissions });
        setHasChanges(true);
    };

    const enableAllPermissions = () => {
        const updatedPerms = {};
        Object.entries(allRoutes).forEach(([module, routes]) => {
            updatedPerms[module] = routes.map(route => ({
                route_id: route.id,
                is_allowed: 1,
                route: route
            }));
        });
        setPermissions(updatedPerms);
        setHasChanges(true);
        toast.success('All permissions enabled');
    };

    const disableAllPermissions = () => {
        const updatedPerms = {};
        Object.entries(allRoutes).forEach(([module, routes]) => {
            updatedPerms[module] = routes.map(route => ({
                route_id: route.id,
                is_allowed: 0,
                route: route
            }));
        });
        setPermissions(updatedPerms);
        setHasChanges(true);
        toast.success('All permissions disabled');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const flatPermissions = [];
            Object.values(permissions).forEach((perms) => {
                perms.forEach(p => {
                    flatPermissions.push({
                        route_id: p.route_id,
                        is_allowed: p.is_allowed === 1,
                    });
                });
            });

            const response = await axios.post(
                route('superadmin.admin.roles.permissions.update', roleId),
                { permissions: flatPermissions }
            );

            if (response.data.success) {
                toast.success('Permissions updated successfully');
                setHasChanges(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update permissions');
        } finally {
            setSaving(false);
        }
    };

    const getFilteredModules = () => {
        let filtered = { ...allRoutes };
        
        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = Object.entries(filtered).reduce((acc, [module, routes]) => {
                const filteredRoutes = routes.filter(route => 
                    route.route_name.toLowerCase().includes(query) ||
                    route.action.toLowerCase().includes(query) ||
                    route.description?.toLowerCase().includes(query) ||
                    module.toLowerCase().includes(query)
                );
                if (filteredRoutes.length > 0) {
                    acc[module] = filteredRoutes;
                }
                return acc;
            }, {});
        }

        // Filter by method
        if (filterMethod !== 'ALL') {
            filtered = Object.entries(filtered).reduce((acc, [module, routes]) => {
                const filteredRoutes = routes.filter(route => route.method === filterMethod);
                if (filteredRoutes.length > 0) {
                    acc[module] = filteredRoutes;
                }
                return acc;
            }, {});
        }

        return filtered;
    };

    const getTotalStats = () => {
        let totalRoutes = 0;
        let enabledRoutes = 0;

        Object.entries(allRoutes).forEach(([module, routes]) => {
            routes.forEach(route => {
                totalRoutes++;
                if (isRouteAllowed(route.id)) enabledRoutes++;
            });
        });

        return { totalRoutes, enabledRoutes };
    };

    const getModuleDisplayName = (module) => {
        return module.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getModuleIcon = (module) => {
        const icons = {
            dashboard: '📊',
            companies: '🏢',
            employees: '👥',
            policies: '📋',
            claims: '💰',
            endorsements: '✍️',
            wellness: '❤️',
            wellness_categories: '📂',
            reports: '📈',
            reports_company: '📊',
            reports_employee: '👤',
            reports_claims: '💼',
            reports_policies: '📄',
            admin: '⚙️',
            roles: '🔐',
            permissions: '🔑',
            insurers: '🏥',
            tpas: '🏦',
            cds: '📦',
            vendors: '🛒',
            settings: '⚙️',
            settings_general: '🔧',
            settings_email: '📧',
            settings_notification: '🔔',
            blogs: '📝',
            faqs: '❓',
            resources: '📚',
        };
        return icons[module] || '📌';
    };

    if (loading) {
        return (
            <SuperAdminLayout>
                <Head title="Manage Permissions" />
                <div className={`p-4 h-full flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#934790] border-t-transparent mb-4"></div>
                        <p className="text-gray-500 text-sm">Loading permissions...</p>
                    </div>
                </div>
            </SuperAdminLayout>
        );
    }

    const filteredModules = getFilteredModules();
    const stats = getTotalStats();
    const hasNoPermissions = stats.enabledRoutes === 0;

    return (
        <SuperAdminLayout>
            <Head title={`Manage Permissions - ${role?.role_name || 'Role'}`} />
            <div className={`p-6 h-full overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Header Section */}
                <div className="mb-6">
                    <Link 
                        href={route('superadmin.admin.roles-permissions.index')}
                        className="inline-flex items-center gap-2 text-[#5B6FFF] hover:text-[#4456CC] text-sm font-medium mb-3 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Roles
                    </Link>
                    
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Permissions</h1>
                            <p className="text-sm text-gray-500">
                                Configure access control for <span className="font-semibold text-[#934790]">{role?.role_name || 'this role'}</span>
                            </p>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="flex gap-3">
                            <div className="bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">Total Routes</div>
                                <div className="text-2xl font-bold text-gray-900">{stats.totalRoutes}</div>
                            </div>
                            <div className="bg-gradient-to-br from-[#934790] to-[#6A0066] rounded-lg shadow-sm px-4 py-3 text-white">
                                <div className="text-xs opacity-90 mb-1">Enabled</div>
                                <div className="text-2xl font-bold">{stats.enabledRoutes}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[300px]">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                                <path strokeLinecap="round" d="M21 21l-4.35-4.35" strokeWidth="2"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search routes, modules, actions..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                            />
                        </div>

                        {/* Method Filter */}
                        <select
                            value={filterMethod}
                            onChange={e => setFilterMethod(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                        >
                            <option value="ALL">All Methods</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setExpandedModules(Object.keys(allRoutes).reduce((acc, m) => ({...acc, [m]: true}), {}))}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                title="Expand All"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setExpandedModules({})}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                                title="Collapse All"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </button>
                        </div>

                        <div className="h-6 w-px bg-gray-300"></div>

                        {/* Bulk Actions */}
                        <button
                            onClick={enableAllPermissions}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                            Enable All
                        </button>
                        <button
                            onClick={disableAllPermissions}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Disable All
                        </button>
                    </div>
                </div>

                {/* No Permissions State */}
                {hasNoPermissions && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg p-8 mb-6">
                        <div className="text-center max-w-md mx-auto">
                            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Permissions Assigned</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                This role currently has no permissions. Click "Enable All" to grant full access, or select specific permissions below.
                            </p>
                            <button
                                onClick={enableAllPermissions}
                                className="px-6 py-2.5 bg-[#934790] hover:bg-[#6A0066] text-white rounded-lg font-medium transition-colors"
                            >
                                Grant All Permissions
                            </button>
                        </div>
                    </div>
                )}

                {/* Permissions Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {Object.entries(filteredModules).length === 0 ? (
                        <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-gray-500">No routes found matching your search criteria</p>
                        </div>
                    ) : (
                        Object.entries(filteredModules).map(([module, routes]) => {
                            const isExpanded = expandedModules[module];
                            const totalRoutes = routes.length;
                            const allowedCount = routes.filter(route => isRouteAllowed(route.id)).length;
                            const allAllowed = allowedCount === totalRoutes;
                            const someAllowed = allowedCount > 0 && allowedCount < totalRoutes;
                            const percentage = Math.round((allowedCount / totalRoutes) * 100);

                            return (
                                <div 
                                    key={module}
                                    className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all hover:shadow-md ${
                                        allAllowed ? 'border-green-200' : someAllowed ? 'border-yellow-200' : 'border-gray-200'
                                    }`}
                                >
                                    {/* Module Header */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl">
                                                    {getModuleIcon(module)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-gray-900">
                                                        {getModuleDisplayName(module)}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {allowedCount} of {totalRoutes} routes enabled ({percentage}%)
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                {/* Module Toggle Switch */}
                                                <button
                                                    onClick={() => toggleAllModulePermissions(module, !allAllowed)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                                        allAllowed ? 'bg-green-500' : someAllowed ? 'bg-yellow-400' : 'bg-gray-300'
                                                    } hover:opacity-80`}
                                                    title={allAllowed ? 'Disable all in module' : 'Enable all in module'}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                                                        allAllowed ? 'translate-x-6' : 'translate-x-1'
                                                    }`} />
                                                </button>
                                                
                                                {/* Expand/Collapse Button */}
                                                <button
                                                    onClick={() => toggleModule(module)}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <svg 
                                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    percentage === 100 ? 'bg-green-500' : percentage > 0 ? 'bg-yellow-400' : 'bg-gray-300'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Routes List */}
                                    {isExpanded && (
                                        <div className="p-4">
                                            <div className="space-y-2">
                                                {routes.map(route => {
                                                    const allowed = isRouteAllowed(route.id);
                                                    return (
                                                        <label 
                                                            key={route.id}
                                                            className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group ${
                                                                allowed 
                                                                    ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={allowed}
                                                                onChange={() => togglePermission(module, route.id)}
                                                                className="mt-1 rounded border-gray-300 text-[#934790] focus:ring-[#934790] cursor-pointer w-4 h-4"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                                                                        route.method === 'GET' ? 'bg-green-100 text-green-700' :
                                                                        route.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                                                        route.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                        {route.method}
                                                                    </span>
                                                                    <span className={`text-sm font-semibold capitalize ${
                                                                        allowed ? 'text-green-900' : 'text-gray-700'
                                                                    } group-hover:text-[#934790]`}>
                                                                        {route.action.replace(/_/g, ' ')}
                                                                    </span>
                                                                </div>
                                                                <div className="text-[11px] text-gray-500 font-mono truncate mb-1">
                                                                    {route.route_name}
                                                                </div>
                                                                {route.description && (
                                                                    <div className="text-xs text-gray-600">
                                                                        {route.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {allowed && (
                                                                <div className="flex-shrink-0">
                                                                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Floating Save Button */}
                {hasChanges && (
                    <div className="fixed bottom-8 right-8 z-50">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#934790] hover:bg-[#6A0066] text-white px-8 py-4 rounded-full font-semibold text-base flex items-center gap-3 shadow-2xl disabled:opacity-50 transform hover:scale-105 transition-all"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save All Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
