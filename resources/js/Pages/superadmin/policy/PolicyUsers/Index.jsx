import React, { useState, useEffect, useRef, useMemo } from 'react';
import { router, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';

export default function PolicyUsers({ policyUsers, filters, escalationUsers = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        email: '',
        mobile: '',
    });

    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [pendingDeactivateUser, setPendingDeactivateUser] = useState(null);
    const [selectedReplacement, setSelectedReplacement] = useState('');

    const toggleStatus = async (user) => {
        // prevent double toggles per row
        if (togglingId === user.id) return;
        setTogglingId(user.id);
        try {
            // if user is currently active and we're turning them inactive, open assign modal
            if (user.is_active) {
                setPendingDeactivateUser(user);
                setShowAssignModal(true);
                setTogglingId(null);
                return;
            }

            const url = route('superadmin.policy-users.toggle', user.id);
            if (!url) return console.error('route superadmin.policy-users.toggle not found');
            // call toggle endpoint using fetch so Inertia doesn't expect an Inertia response
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ is_active: !user.is_active }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.message || 'Toggle failed');
            }
            setMessage({ type: 'success', text: `User ${user.is_active ? 'deactivated' : 'activated'} successfully` });
            setShowMessage(true);
            // auto-close message then refresh list
            setTimeout(() => {
                setShowMessage(false);
                router.reload();
            }, 1200);
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while updating the user status' });
            setShowMessage(true);
            // auto-hide error after a short delay (no reload)
            setTimeout(() => setShowMessage(false), 2000);
            console.error(error);
        } finally {
            setTogglingId(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        try {
            const url = route('superadmin.policy.policy-users.index');
            if (!url) return console.error('route superadmin.policy.policy-users.index not found');
            router.get(url, { search, status }, { preserveState: true });
        } catch (err) {
            console.error('Error calling route for search', err);
        }
    };

    const applyFilters = () => {
        try {
            const url = route('superadmin.policy.policy-users.index');
            if (!url) return console.error('route superadmin.policy.policy-users.index not found');
            router.get(url, { search, status }, { preserveState: true });
        } catch (err) {
            console.error('Error applying filters', err);
        }
    };

    const handlePage = (linkUrl) => {
        if (!linkUrl) return;
        try {
            // Use Inertia visit so Inertia handles the request but preserve state
            router.visit(linkUrl, { preserveState: true });
        } catch (err) {
            // Fallback: navigate directly
            window.location.href = linkUrl;
        }
    };

    const confirmDeactivateAssign = async () => {
        if (!pendingDeactivateUser || !selectedReplacement) return;
        setTogglingId(pendingDeactivateUser.id);
        try {
            const url = route('superadmin.policy-users.deactivate-assign', pendingDeactivateUser.id);
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ replacement_user_id: selectedReplacement }),
            });
            const json = await res.json().catch(() => null);
            if (res.ok && json?.success) {
                setMessage({ type: 'success', text: json.message || 'Replacement job queued' });
                setShowMessage(true);
                setShowAssignModal(false);
                setPendingDeactivateUser(null);
                setSelectedReplacement('');
                setTimeout(() => {
                    setShowMessage(false);
                    router.reload();
                }, 1200);
            } else {
                setMessage({ type: 'error', text: json?.message || 'Failed to queue replacement job' });
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 2000);
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Server error while queuing job' });
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        } finally {
            setTogglingId(null);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Use fetch for update so we can handle plain JSON responses and avoid Inertia's plain-JSON error modal
                const url = route('superadmin.policy-users.update', editingUser.id);
                if (!url) return console.error('route superadmin.policy-users.update not found');
                setIsSubmitting(true);
                const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': token || '',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ name: data.name, email: data.email, mobile: data.mobile }),
                });
                const json = await res.json().catch(() => null);
                if (res.ok) {
                    setMessage({ type: 'success', text: 'Policy User updated successfully.' });
                    setShowMessage(true);
                    closeModal();
                    setTimeout(() => {
                        setShowMessage(false);
                        router.reload();
                    }, 1200);
                } else {
                    setMessage({ type: 'error', text: json?.message || 'Failed to update Policy User.' });
                    setShowMessage(true);
                    setTimeout(() => setShowMessage(false), 2000);
                }
                setIsSubmitting(false);
            } else {
                const url = route('superadmin.policy-users.store');
                if (!url) return console.error('route superadmin.policy-users.store not found');
                // use Inertia post for create (server will redirect/back)
                post(url, { onSuccess: () => { closeModal(); router.reload(); } });
            }
        } catch (err) {
            console.error('Error submitting policy user form', err);
            setIsSubmitting(false);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 2000);
        }
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setData({ name: user.name, email: user.email, mobile: user.mobile });
        } else {
            reset();
            setEditingUser(null);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        reset();
    };

    // Status toggle removed per request — status is now display-only

    return (
        <SuperAdminLayout>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Policy Users</h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-[#934790] text-white px-4 py-2 rounded-md hover:bg-[#7a3d7a]"
                    >
                        + Add User
                    </button>
                </div>

                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 bg-white p-4 border rounded-lg">
                    <input
                        type="text"
                        placeholder="Search by name, email, or mobile"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md w-64"
                    />
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            // apply filters immediately when status changes
                            setTimeout(() => applyFilters(), 0);
                        }}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button type="submit" className="bg-[#934790] text-white px-4 py-2 rounded-md hover:bg-[#7a3d7a]">
                        Search
                    </button>
                </form>

                <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Phone</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {useMemo(() => {
                                const q = (search || '').toLowerCase().trim();
                                if (!q) return policyUsers.data;
                                return policyUsers.data.filter((user) => {
                                    return (
                                        (user.name || '').toLowerCase().includes(q) ||
                                        (user.email || '').toLowerCase().includes(q) ||
                                        (user.mobile || user.phone || '').toLowerCase().includes(q)
                                    );
                                });
                            }, [search, policyUsers.data]).map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email || '-'}</td>
                                    <td className="px-4 py-2">{user.mobile || '-'}</td>
                                    <td className="px-4 py-2">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={user.is_active}
                                                onChange={() => toggleStatus(user)}
                                                className="sr-only"
                                                disabled={togglingId === user.id}
                                            />
                                            <div
                                                className={`w-7 h-4 rounded-full transition-colors duration-200 ${user.is_active ? 'bg-[#934790]' : 'bg-gray-300'} flex items-center ${togglingId === user.id ? 'opacity-60' : ''}`}
                                            >
                                                <div
                                                    className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ${user.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                                ></div>
                                            </div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => openModal(user)}
                                            className="text-[#934790] hover:text-[#7a3d7a]"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {policyUsers.last_page > 1 && (
                        <div className="flex justify-between items-center p-4 border-t text-sm">
                            <span>
                                Showing {policyUsers.from} to {policyUsers.to} of {policyUsers.total} results
                            </span>
                            <div className="flex gap-1">
                                {policyUsers.links.map((link, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handlePage(link.url)}
                                        className={`px-3 py-1 rounded border text-sm ${
                                            link.active
                                                ? 'bg-[#934790] text-white border-[#934790]'
                                                : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-lg font-semibold mb-4">
                                {editingUser ? 'Edit Policy User' : 'Add Policy User'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    className="border px-3 py-2 rounded-md w-full"
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={closeModal} className="px-3 py-2 border rounded-md">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#934790] text-white rounded-md hover:bg-[#7a3d7a]"
                                    >
                                        {editingUser ? 'Update' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Assign replacement modal when deactivating a user */}
                {showAssignModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-96">
                            <h2 className="text-lg font-semibold mb-4">Replace Escalation User</h2>
                            <p className="text-sm text-gray-600 mb-4">You're deactivating <strong>{pendingDeactivateUser?.name}</strong>. Choose another escalation user to reassign any policy responsibilities to.</p>
                            <div>
                                <select
                                    value={selectedReplacement}
                                    onChange={(e) => setSelectedReplacement(e.target.value)}
                                    className="border px-3 py-2 rounded-md w-full mb-4"
                                >
                                    <option value="">-- Select replacement user --</option>
                                    {escalationUsers.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => { setShowAssignModal(false); setPendingDeactivateUser(null); setSelectedReplacement(''); }} className="px-3 py-2 border rounded-md">Cancel</button>
                                <button type="button" onClick={confirmDeactivateAssign} disabled={!selectedReplacement} className="px-4 py-2 bg-[#934790] text-white rounded-md hover:bg-[#7a3d7a]">Proceed</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success / Error message modal */}
                {showMessage && message && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {message.type === 'success' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{message.type === 'success' ? 'Success' : 'Error'}</div>
                                    <div className="text-sm text-gray-600">{message.text}</div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setShowMessage(false);
                                            // If it was a success, also reload to reflect change immediately
                                            if (message.type === 'success') router.reload();
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                        aria-label="Close"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
