import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../../Layouts/SuperAdmin/Layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function CreateWelcomeMailer({ companies = [], templates = [], user = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        cmp_id: '',
        policy_id: '',
        endorsement_id: '',
        template_id: '',
        subject: '',
        body: ''
    });

    const [search, setSearch] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState(companies);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [selectedTemplatePreview, setSelectedTemplatePreview] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [endorsements, setEndorsements] = useState([]);

    useEffect(() => {
        setFilteredCompanies(
            companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, companies]);

    useEffect(() => {
        if (data.template_id) {
            const t = templates.find((x) => x.id === parseInt(data.template_id));
            setSelectedTemplatePreview(t || null);
            if (t) {
                // Auto-fill subject and body from template when a template is selected
                setData('subject', t.subject || '');
                setData('body', t.body || '');
            }
        } else {
            setSelectedTemplatePreview(null);
        }
    }, [data.template_id, templates]);

    useEffect(() => {
        if (data.policy_id) {
            fetchEndorsements(data.policy_id);
        } else {
            setEndorsements([]);
            setData('endorsement_id', '');
        }
    }, [data.policy_id]);

    const selectCompany = async (company) => {
        setSelectedCompany(company);
        setData('cmp_id', company.id);
        setSearch(company.name);
        // fetch policies for company
        try {
            const res = await axios.get(`/superadmin/marketing/welcome-mailer/company/${company.id}/policies`);
            setPolicies(res.data.policies || []);
        } catch (e) {
            console.error('Failed to load policies', e);
            setPolicies([]);
        }
    };

    const fetchEndorsements = async (policyId) => {
        if (!policyId) {
            setEndorsements([]);
            setData('endorsement_id', '');
            return;
        }

        try {
            const res = await axios.get(`/superadmin/marketing/welcome-mailer/policy/${policyId}/endorsements`);
            const eds = res.data.endorsements || [];
            setEndorsements(eds);
            // Auto-select the first endorsement if available
            if (eds.length > 0) {
                // ensure we set a string (select value) for consistency
                setData('endorsement_id', String(eds[0].id));
            } else {
                setData('endorsement_id', '');
            }
        } catch (e) {
            console.error('Failed to load endorsements', e);
            setEndorsements([]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/superadmin/marketing/welcome-mailer');
    };

    const openPreview = () => {
        if (selectedTemplatePreview) {
            setShowPreviewModal(true);
        }
    };

    return (
        <SuperAdminLayout>
            <Head title="Create Welcome Mailer" />

            <div className="p-4 h-full overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-lg font-semibold mb-4">Create Welcome Mailer</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <form onSubmit={submit} className="lg:col-span-2 space-y-4 bg-white p-6 rounded-lg shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Search Company</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedCompany(null);
                                    setData('cmp_id', '');
                                    setPolicies([]);
                                }}
                                placeholder="Type to search companies..."
                                className="mt-1 block w-full border rounded-md p-2"
                            />

                            {search && filteredCompanies.length > 0 && (
                                <ul className="border rounded-md mt-2 max-h-40 overflow-auto bg-white">
                                    {filteredCompanies.map((c) => (
                                        <li
                                            key={c.id}
                                            onClick={() => selectCompany(c)}
                                            className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                                        >
                                            {c.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Policy</label>
                            <select
                                value={data.policy_id}
                                onChange={(e) => setData('policy_id', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                                disabled={!selectedCompany}
                            >
                                <option value="">-- Select Policy --</option>
                                {policies.map((p) => (
                                    <option key={p.id} value={p.id}>{p.policy_name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Endorsement</label>
                            <select
                                value={data.endorsement_id}
                                onChange={(e) => setData('endorsement_id', e.target.value)}
                                className="mt-1 block w-full border rounded-md p-2"
                                disabled={endorsements.length === 0}
                            >
                                <option value="">-- Select Endorsement --</option>
                                {endorsements.map((ed) => (
                                    <option key={ed.id} value={ed.id}>{ed.endorsement_no}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Template</label>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={data.template_id}
                                    onChange={(e) => setData('template_id', e.target.value)}
                                    className="mt-1 block w-full border rounded-md p-2 focus:ring-2 focus:ring-[#934790]"
                                >
                                    <option value="">-- Select Template --</option>
                                    {templates.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <button type="button" onClick={openPreview} className="mt-1 px-3 py-2 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200">Preview</button>
                            </div>

                            {selectedTemplatePreview && (
                                <div className="border p-3 rounded mt-2 bg-gray-50">
                                    <h4 className="font-medium">Template Preview</h4>
                                    <div className="text-sm text-gray-700 mt-1"><strong>Subject:</strong> {selectedTemplatePreview.subject}</div>
                                    <div className="mt-2 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: selectedTemplatePreview.body }} />
                                </div>
                            )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                placeholder="Subject line for this welcome mailer"
                                className="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#934790] focus:border-[#934790]"
                            />
                            {errors.subject && (
                                <div className="text-red-600 text-sm mt-1">{errors.subject}</div>
                            )}
                        </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#934790] hover:bg-[#6A0066] text-white px-4 py-2 rounded-md"
                            >
                                Create
                            </button>
                        </div>

                        {errors && Object.keys(errors).length > 0 && (
                            <div className="text-sm text-red-600">
                                {Object.values(errors).map((err, idx) => (
                                    <div key={idx}>{err}</div>
                                ))}
                            </div>
                        )}
                        </form>
                        {/* Preview column */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-700">Selected Company</h3>
                                    <div className="mt-2 text-sm text-gray-800">{selectedCompany ? selectedCompany.name : 'No company selected'}</div>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-700">Mailer Preview</h3>
                                    {selectedTemplatePreview ? (
                                        <div className="mt-2 text-sm text-gray-800">
                                            <div className="font-semibold">{selectedTemplatePreview.name}</div>
                                            <div className="text-gray-600 text-sm mt-1"><strong>Subject:</strong> {selectedTemplatePreview.subject}</div>
                                            <div className="mt-3 border p-3 rounded bg-gray-50 max-h-64 overflow-auto" dangerouslySetInnerHTML={{ __html: selectedTemplatePreview.body }} />
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm text-gray-500">Select a template to preview the mailer.</div>
                                    )}
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-700">Available Endorsements</h3>
                                    {endorsements.length > 0 ? (
                                        <ul className="mt-2 text-sm text-gray-800 list-disc pl-5 max-h-40 overflow-auto">
                                            {endorsements.map((ed) => (
                                                <li key={ed.id} className="py-1">{ed.endorsement_no}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="mt-2 text-sm text-gray-500">No endorsements available for selected policy.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal (full) */}
            {showPreviewModal && selectedTemplatePreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Template Preview: {selectedTemplatePreview.name}</h3>
                            <button type="button" onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="mb-4">
                                <div className="grid grid-cols-1 gap-4 mb-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Subject:</span>
                                        <div className="mt-1 text-gray-900">{selectedTemplatePreview.subject}</div>
                                    </div>
                                </div>
                                <div className="border p-4 rounded bg-white" dangerouslySetInnerHTML={{ __html: selectedTemplatePreview.body }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
