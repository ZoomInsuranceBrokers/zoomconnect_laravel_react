import React, { useState } from 'react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';

export default function PolicyEndorsements({ policy, endorsements, filters = {} }) {
    const [detailsTab, setDetailsTab] = useState('Details');
    const [selectedEndorsement, setSelectedEndorsement] = useState(null);
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [openActionsDropdown, setOpenActionsDropdown] = useState(null);

    const form = useForm({
        endorsement_no: '',
        endorsement_date: '',
        endorsement_copy: null,
    });
    const [clientErrors, setClientErrors] = useState({});
    const formatDateForInput = (value) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d)) return '';
        return d.toISOString().slice(0, 10);
    };

    const submit = (e) => {
        e.preventDefault();
        setClientErrors({});

        // client-side required validation
        const errs = {};
        if (!form.data.endorsement_no || form.data.endorsement_no.trim() === '') errs.endorsement_no = 'Endorsement number is required';
        if (!form.data.endorsement_date) errs.endorsement_date = 'Endorsement date is required';
        // For edit mode, allow keeping the existing file (currentFile).
        if (!form.data.endorsement_copy) {
            if (!(editMode && currentFile)) {
                errs.endorsement_copy = 'Endorsement document is required';
            }
        }

        if (Object.keys(errs).length > 0) {
            setClientErrors(errs);
            return;
        }

        if (editMode && editingId) {
            form.put(route('superadmin.policy.endorsements.update', editingId), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditMode(false);
                    setEditingId(null);
                    form.reset();
                },
            });
        } else {
            form.post(route('superadmin.policy.policies.endorsements.store', policy.id), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    form.reset();
                },
            });
        }
    };

    const handleFile = (e) => {
        form.setData('endorsement_copy', e.target.files[0]);
    };

    const handleSearch = (e) => {
        e && e.preventDefault();
        router.get(route('superadmin.policy.policies.endorsements', policy.id), { search: searchTerm });
    };

    return (
        <SuperAdminLayout>
            <div className="space-y-5">
                {flash?.success && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-green-100 text-green-800 border border-green-200">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-2 p-3 rounded text-sm text-center bg-red-100 text-red-800 border border-red-200">
                        ✗ {flash.error}
                    </div>
                )}

                <div className="flex items-center justify-between border-b pb-3 border-gray-200 mt-3">
                    <h2 className="text-sm font-semibold text-gray-900">Endorsements for {policy.policy_name || policy.corporate_policy_name}</h2>
                    <div className="flex items-center gap-2">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search endorsement number..." className="px-3 py-2 border border-gray-300 rounded text-xs" />
                            <button className="px-3 py-2 bg-[#934790] text-white text-xs rounded">Search</button>
                        </form>
                        <button onClick={() => { form.clearErrors(); setClientErrors({}); setModalOpen(true); setEditMode(false); setEditingId(null); form.reset(); setCurrentFile(null); }} className="px-3 py-2 bg-[#934790] hover:bg-[#6A0066] text-white text-xs rounded">Create New Endorsement</button>
                    </div>
                </div>

                <div className="flex">
                    <div className="rounded-lg shadow overflow-x-auto bg-white border border-gray-200 w-full">
                        <table className="w-full min-w-max">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[60px] text-gray-500">S.No</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] text-gray-500">Actions</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[120px] text-gray-500">Endorsement No</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] text-gray-500">Date</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider min-w-[100px] text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {endorsements.data.length > 0 ? (
                                    endorsements.data.map((e, idx) => (
                                        <tr
                                            key={e.id}
                                            className={
                                                (selectedEndorsement && selectedEndorsement.id === e.id ? 'bg-purple-50' : (idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'))
                                            }
                                            onClick={() => setSelectedEndorsement(e)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="px-3 py-2 text-[10px] text-gray-700">{(endorsements.current_page - 1) * endorsements.per_page + idx + 1}</td>
                                            <td className="px-3 py-2 text-[10px] text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <button className="text-gray-400 hover:text-gray-600" title="View Detail">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <a
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Download Copy"
                                                        href={'/' + e.endorsement_copy?.replace(/^\/+/, '')}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </a>
                                                    <div className="relative">
                                                        <button
                                                            className="text-gray-400 hover:text-gray-600"
                                                            title="More Actions"
                                                            onClick={ev => {
                                                                ev.stopPropagation();
                                                                setOpenActionsDropdown(openActionsDropdown === e.id ? null : e.id);
                                                            }}
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                        {openActionsDropdown === e.id && (
                                                            <div className="absolute left-0 mt-1 w-40 rounded-md shadow-lg z-50 border bg-white border-gray-200" onClick={ev => ev.stopPropagation()}>
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={ev => {
                                                                            ev.stopPropagation();
                                                                            form.clearErrors(); setClientErrors({}); setModalOpen(true); setEditMode(true); setEditingId(e.id); form.setData('endorsement_no', e.endorsement_no); form.setData('endorsement_date', formatDateForInput(e.endorsement_date)); setCurrentFile(e.endorsement_copy || null); setOpenActionsDropdown(null);
                                                                        }}
                                                                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        <svg className="w-3 h-3 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        Edit Endo. Details
                                                                    </button>
                                                                    <a href={route('superadmin.policy.endorsements.show', e.id)}
                                                                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        onClick={() => setOpenActionsDropdown(null)}>
                                                                        <svg className="w-3 h-3 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20H4v-2a4 4 0 014-4h1" />
                                                                            <circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
                                                                        </svg>
                                                                        Manage Data
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-[10px] text-gray-900 font-medium">{e.endorsement_no}</td>
                                            <td className="px-3 py-2 text-[10px] text-gray-700">{e.endorsement_date ? new Date(e.endorsement_date).toLocaleDateString('en-GB') : '-'}</td>
                                            <td className="px-3 py-2 text-[10px] text-gray-700">{e.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-xs text-gray-500">No endorsements found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Modal Drawer for Details */}
                    {selectedEndorsement && (
                        <div className="fixed inset-0 right-0 z-50 flex items-center justify-end bg-black bg-opacity-30">
                            <div className="bg-white rounded-l-lg shadow-lg w-full max-w-md h-full flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b">
                                    <h2 className="text-lg font-semibold">Endorsement Details</h2>
                                    <button onClick={() => setSelectedEndorsement(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                                </div>
                                <div className="flex border-b px-6 pt-4 pb-2 gap-6">
                                    {['Details'].map(tab => (
                                        <button
                                            key={tab}
                                            className={`pb-2 text-sm font-medium border-b-2 ${detailsTab === tab ? 'border-[#934790] text-[#934790]' : 'border-transparent text-gray-500'}`}
                                            onClick={() => setDetailsTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-auto p-6">
                                    {detailsTab === 'Details' && (
                                        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-purple-100 text-[#934790] px-2 py-1 rounded text-xs font-semibold">Group</span>
                                                <span className="font-semibold">{policy.policy_name || policy.corporate_policy_name}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mb-2">{selectedEndorsement.id}</div>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div><span className="font-semibold">Endo. Date</span><br />{selectedEndorsement.endorsement_date ? new Date(selectedEndorsement.endorsement_date).toLocaleDateString('en-GB') : '-'}</div>
                                                <div><span className="font-semibold">Endo. No</span><br />{selectedEndorsement.endorsement_no}</div>
                                                <div><span className="font-semibold">Status</span><br />{selectedEndorsement.status}</div>
                                                <div><span className="font-semibold">Policy No.</span><br />{policy.policy_number}</div>
                                            </div>
                                            {selectedEndorsement.endorsement_copy && (
                                                <div className="mb-2 text-sm"><span className="font-semibold">Document:</span> <a href={'/' + selectedEndorsement.endorsement_copy.replace(/^\/+/, '')} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{selectedEndorsement.endorsement_copy.split('/').pop()}</a></div>
                                            )}
                                            {/* <div className="flex gap-2 mt-4">
                                                <button className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Details</button>
                                                <button className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Members</button>
                                                <button className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">Policy Setup</button>
                                            </div> */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {endorsements.links && endorsements.links.length > 0 && (
                    <div className="flex justify-center items-center mt-4 space-x-1">
                        {endorsements.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 text-xs border rounded-md ${link.active ? 'bg-[#934790] text-white border-[#934790]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            />
                        ))}
                    </div>
                )}

                {/* Modal for creating endorsement */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-0 w-full max-w-lg shadow-lg overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 bg-[#934790] text-white">
                                <h3 className="text-lg font-semibold">{editMode ? 'Edit Endorsement' : 'Create Endorsement'}</h3>
                                <button onClick={() => { form.clearErrors(); setClientErrors({}); setModalOpen(false); setEditMode(false); setEditingId(null); setCurrentFile(null); }} className="text-white opacity-90 hover:opacity-100">✕</button>
                            </div>
                            <div className="p-5">
                                <form onSubmit={submit} encType="multipart/form-data">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium mb-1">Endorsement No <span className="text-red-500">*</span></label>
                                            <input type="text" value={form.data.endorsement_no} onChange={e => form.setData('endorsement_no', e.target.value)} className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#934790] focus:border-transparent ${(form.errors?.endorsement_no || clientErrors.endorsement_no) ? 'border-red-400' : 'border-gray-300'}`} placeholder="Enter endorsement number" />
                                            {(clientErrors.endorsement_no || form.errors?.endorsement_no) && <div className="text-red-500 text-xs mt-1">{clientErrors.endorsement_no || form.errors.endorsement_no}</div>}
                                        </div>

                                        {/* endorsement_type removed from form - determined server-side */}

                                        <div>
                                            <label className="block text-xs font-medium mb-1">Endorsement Date <span className="text-red-500">*</span></label>
                                            <input type="date" value={form.data.endorsement_date} onChange={e => form.setData('endorsement_date', e.target.value)} className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#934790] focus:border-transparent ${(form.errors?.endorsement_date || clientErrors.endorsement_date) ? 'border-red-400' : 'border-gray-300'}`} />
                                            {(clientErrors.endorsement_date || form.errors?.endorsement_date) && <div className="text-red-500 text-xs mt-1">{clientErrors.endorsement_date || form.errors.endorsement_date}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium mb-1">Endorsement Document <span className="text-red-500">*</span></label>
                                            <div className={`flex items-center gap-3 p-3 border rounded ${(form.errors?.endorsement_copy || clientErrors.endorsement_copy) ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'}`}>
                                                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition">
                                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    <input type="file" onChange={handleFile} className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                                    Choose File
                                                </label>
                                                <div className="text-sm text-gray-600 truncate">{form.data.endorsement_copy ? form.data.endorsement_copy.name : (currentFile ? currentFile.split('/').pop() : 'No file selected')}</div>
                                            </div>
                                            {(clientErrors.endorsement_copy || form.errors?.endorsement_copy) && <div className="text-red-500 text-xs mt-1">{clientErrors.endorsement_copy || form.errors.endorsement_copy}</div>}
                                            {editMode && currentFile && !form.data.endorsement_copy && (
                                                <div className="mt-2 text-sm">
                                                    Current file: <a href={'/' + currentFile.replace(/^\/+/, '')} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{currentFile.split('/').pop()}</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-6">
                                        <button type="button" onClick={() => { form.clearErrors(); setClientErrors({}); setModalOpen(false); setEditMode(false); setEditingId(null); setCurrentFile(null); }} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition">Cancel</button>
                                        <button type="submit" disabled={form.processing} className={`px-4 py-2 bg-[#934790] hover:bg-[#6A0066] text-white rounded text-sm transition flex items-center gap-2 ${form.processing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                            {form.processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                            {form.processing ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Endorsement' : 'Create Endorsement')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}
