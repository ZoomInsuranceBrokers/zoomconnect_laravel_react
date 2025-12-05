import React, { useState } from 'react';
// ...existing code...

const FamilyIcons = {
    self: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/self.png" alt="Self" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Self</span></div>,
    spouse: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/spouse.png" alt="Spouse" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Spouse</span></div>,
    kid: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/kids.png" alt="Kids" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Kids</span></div>,
    parent: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/parents.png" alt="Parents" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Parents</span></div>,
    parent_in_law: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/parents.png" alt="Parent-in-Law" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Parent-in-Law</span></div>,
    sibling: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/siblings.png" alt="Sibling" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Sibling</span></div>,
    partners: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/spouse.png" alt="Partners" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Partners</span></div>,
    others: <div className="flex flex-col items-center"><img src="/assets/images/enrolment/others.png" alt="Others" className="w-16 h-16 object-contain" /><span className="text-xs font-medium text-[#934790] mt-1">Others</span></div>
};

function FeatureModal({ open, onClose, onSave, initial, type }) {
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [icon, setIcon] = useState(initial?.icon || null);
    const [iconPreview, setIconPreview] = useState(initial?.icon || null);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Add {type}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feature Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Enter feature title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feature Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            rows="3"
                            placeholder="Enter feature description"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feature Type</label>
                        <select
                            value={type === 'Inclusion' ? 'inc' : 'exc'}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        >
                            <option value="inc">Inclusion</option>
                            <option value="exc">Exclusion</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onSave({ title, description, icon });
                            setTitle('');
                            setDescription('');
                            setIcon(null);
                            onClose();
                        }}
                        className="px-4 py-2 bg-[#934790] text-white rounded-lg hover:bg-[#6A0066]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function SelectWithSearch({ options = [], value, onChange, placeholder = '', required = false, className = '' }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const normalized = (str) => (str || '').toString().toLowerCase();
    const displayLabel = (opt) => opt?.name || opt?.title || opt?.label || opt?.cd_ac_name || opt?.company_name || '';
    const filtered = options.filter(opt => normalized(displayLabel(opt)).includes(normalized(query)));

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder={`Search ${placeholder}...`}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
            />
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filtered.length > 0 ? (
                            filtered.map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => {
                                        onChange(opt.id);
                                        setQuery(displayLabel(opt));
                                        setIsOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
                                >
                                    {displayLabel(opt)}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                        )}
                    </div>
                </>
            )}
            <input type="hidden" value={value} required={required} />
        </div>
    );
}

import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';
import { useEffect } from 'react';

export default function Create({ corporates, insuranceProviders, tpaCompanies, cdAccounts: initialCdAccounts, escalationUsers, userMasterUsers }) {
    // Validation function for each step
    const validateStep = (stepNumber) => {
        const newErrors = {};
        
        if (stepNumber === 1) {
            // Required fields validation for Step 1
            if (!formData.corporate_id) newErrors.corporate_id = 'Corporate is required';
            if (!formData.policy_name) newErrors.policy_name = 'Policy Name is required';
            if (!formData.corporate_policy_name) newErrors.corporate_policy_name = 'Corporate Policy Name is required';
                if (!formData.policy_type) newErrors.policy_type = 'Policy Type is required';
            if (!formData.policy_number) newErrors.policy_number = 'Policy Number is required';
            if (!formData.policy_start_date) newErrors.policy_start_date = 'Policy Start Date is required';
            if (!formData.policy_end_date) newErrors.policy_end_date = 'Policy End Date is required';
            if (!formData.ins_id) newErrors.ins_id = 'Insurance Provider is required';
            if (!formData.tpa_id) newErrors.tpa_id = 'TPA Company is required';
            if (!formData.policy_document) newErrors.policy_document = 'Policy document is required';
            // CD account + users
            if (!formData.cd_ac_id) newErrors.cd_ac_id = 'CD Account is required';
            if (!formData.data_escalation_id) newErrors.data_escalation_id = 'Data Escalation user is required';
            if (!formData.claim_level_1_id) newErrors.claim_level_1_id = 'Claim Level 1 user is required';
            if (!formData.claim_level_2_id) newErrors.claim_level_2_id = 'Claim Level 2 user is required';
        }
        
        if (stepNumber === 3) {
            // At least one inclusion or exclusion required
            const hasInclusions = formData.inclusions && formData.inclusions.length > 0;
            const hasExclusions = formData.exclusions && formData.exclusions.length > 0;
            
            if (!hasInclusions && !hasExclusions) {
                newErrors.policy_features = 'At least one inclusion or exclusion is required';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Add missing handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Validate step 3 before submitting
        if (!validateStep(3)) {
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Add all basic policy fields
            Object.keys(formData).forEach(key => {
                if (key === 'inclusions' || key === 'exclusions') {
                    // Convert features to JSON
                    const features = [
                        ...(formData.inclusions || []).map(f => ({ ...f, feature_type: 'inc' })),
                        ...(formData.exclusions || []).map(f => ({ ...f, feature_type: 'exc' }))
                    ];
                    formDataToSend.append('policy_features', JSON.stringify(features));
                } else if (key === 'family_defination') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (formData[key] !== null && formData[key] !== '') {
                    if (typeof formData[key] === 'object' && formData[key] !== null && !(formData[key] instanceof File)) {
                        formDataToSend.append(key, JSON.stringify(formData[key]));
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            await router.post('/superadmin/policy/policies', formDataToSend, {
                onError: (errors) => {
                    setErrors(errors);
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    router.visit('/superadmin/policy/policies');
                }
            });
        } catch (error) {
            console.error('Form submission error:', error);
            setIsSubmitting(false);
        }
    };
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        corporate_id: '',
        policy_name: '',
        corporate_policy_name: '',
        // corporate_policy_type removed; use `policy_type` instead
        policy_type: '',
        policy_number: '',
        policy_start_date: '',
        policy_end_date: '',
        policy_document: null,
        ins_id: '',
        tpa_id: '',
        cd_ac_id: '',
        is_paperless: 1,
        doc_courier_name: '',
        doc_courier_address: '',
        data_escalation_id: '',
        claim_level_1_id: '',
        claim_level_2_id: '',
        is_twin_allowed: false,
        natural_addition_allowed: true,
        // Step 2: Family Definition
        family_defination: {
            self: "1",
            self_no: "1",
            self_min_age: "18",
            self_max_age: "80",
            self_gender: "both",
            spouse: "0",
            spouse_no: "0",
            spouse_min_age: "18",
            spouse_max_age: "99",
            spouse_gender: "both",
            kid: "0",
            kid_no: "0",
            kid_min_age: "0",
            kid_max_age: "25",
            kid_gender: "both",
            parent: "0",
            parent_no: "0",
            parent_min_age: "30",
            parent_max_age: "99",
            parent_gender: "both",
            parent_in_law: "0",
            parent_in_law_no: "0",
            parent_in_law_min_age: "30",
            parent_in_law_max_age: "99",
            parent_in_law_gender: "both",
            sibling: "0",
            sibling_no: "0",
            sibling_min_age: "18",
            sibling_max_age: "99",
            sibling_gender: "both",
            partners: "0",
            partners_no: "0",
            partners_min_age: "18",
            partners_max_age: "99",
            partners_gender: "both",
            others: "0",
            others_no: "0",
            others_min_age: "18",
            others_max_age: "99",
            others_gender: "both",
            spouse_with_same_gender: "null",
            add_both_parent_n_parent_in_law: "either"
        },
        // Step 3: Policy Features
        policy_features: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cdAccounts, setCdAccounts] = useState(initialCdAccounts || []);

    // Helper to normalize error messages coming from client validation or server (Inertia) responses
    const getError = (key) => {
        const val = errors?.[key];
        if (!val) return null;
        return Array.isArray(val) ? val[0] : val;
    };

    // Fetch CD accounts when corporate_id changes
    useEffect(() => {
        if (formData.corporate_id) {
            console.log('Fetching CD accounts for corporate_id:', formData.corporate_id);
            fetch(`/superadmin/policy/policies/cd-accounts/${encodeURIComponent(formData.corporate_id)}`, {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' }
            })
                .then(async res => {
                    const ct = res.headers.get('content-type') || '';
                    if (!res.ok) {
                        const text = await res.text();
                        console.error('CD accounts fetch returned non-OK status', res.status, text);
                        throw new Error(`HTTP ${res.status}`);
                    }
                    if (!ct.includes('application/json')) {
                        const text = await res.text();
                        console.error('CD accounts fetch returned non-JSON response:', text);
                        throw new Error('Non-JSON response');
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('CD accounts response:', data);
                    setCdAccounts(data);
                    // Reset CD account selection if not in new list
                    if (formData.cd_ac_id && !data.find(cd => cd.id === formData.cd_ac_id)) {
                        setFormData(prev => ({ ...prev, cd_ac_id: '' }));
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch CD accounts:', err);
                    setCdAccounts([]);
                });
        } else {
            setCdAccounts([]);
            setFormData(prev => ({ ...prev, cd_ac_id: '' }));
        }
    }, [formData.corporate_id]);

    // Modal state for add/edit feature dialogs
    // ...existing code...
    const [modalOpen, setModalOpen] = useState(null); // 'add-inclusion', 'edit-inclusion', 'add-exclusion', 'edit-exclusion'
    const [editIndex, setEditIndex] = useState(null);

    // Sample CSV download logic
    const handleSampleDownload = () => {
        const csvContent =
            'S.No,Feature Name,Feature Desc,Feature Type\n' +
            '1,Cashless hospitalization,24x7 cashless facility at network hospitals,inc\n' +
            '2,Pre-existing diseases covered,Coverage for pre-existing conditions after waiting period,inc\n' +
            '3,Maternity coverage,Comprehensive maternity benefits included,inc\n' +
            '4,Cosmetic surgery,Cosmetic procedures not covered,exc\n' +
            '5,War and nuclear risks,Damages due to war or nuclear incidents excluded,exc';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'policy_features_sample.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // CSV upload logic with validation and error messages
    const [csvError, setCsvError] = useState('');
    const handleCsvUpload = (file) => {
        setCsvError('');
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(Boolean);
            if (lines.length < 2) {
                setCsvError('CSV file is empty or missing data rows.');
                return;
            }
            const header = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
            const nameIdx = header.findIndex(h => h.toLowerCase().includes('name'));
            const descIdx = header.findIndex(h => h.toLowerCase().includes('desc'));
            const typeIdx = header.findIndex(h => h.toLowerCase().includes('type'));

            if (nameIdx === -1 || descIdx === -1 || typeIdx === -1) {
                setCsvError('CSV must have columns: Feature Name, Feature Desc, Feature Type.');
                return;
            }
            const inclusions = [];
            const exclusions = [];
            let validRowFound = false;

            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
                const name = cols[nameIdx] || '';
                const desc = cols[descIdx] || '';
                const type = (cols[typeIdx] || '').toLowerCase();

                if (!name && !desc) continue;
                validRowFound = true;

                const feature = {
                    title: name,
                    description: desc,
                    icon: null,
                    feature_type: type === 'exc' ? 'exc' : 'inc'
                };

                if (type === 'exc' || type === 'exclusion') {
                    exclusions.push(feature);
                } else {
                    inclusions.push(feature);
                }
            }

            if (!validRowFound) {
                setCsvError('No valid feature rows found in CSV.');
                return;
            }

            setFormData(prev => ({
                ...prev,
                inclusions: [...(prev.inclusions || []), ...inclusions],
                exclusions: [...(prev.exclusions || []), ...exclusions]
            }));
        };
        reader.onerror = () => setCsvError('Failed to read CSV file.');
        reader.readAsText(file);
    };
    <button type="button" className="px-4 py-2 bg-[#934790] text-white rounded-lg shadow" onClick={handleSampleDownload}>Download Sample CSV</button>

    return (
        <SuperAdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create New Policy</h1>
                            <p className="mt-1 text-sm text-gray-600">Add a new insurance policy to the system.</p>
                        </div>
                        <Link
                            href="/superadmin/policy/policies"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >Back to Policies</Link>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((stepNum) => (
                        <React.Fragment key={stepNum}>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNum ? 'bg-[#934790] text-white' : 'bg-gray-200 text-gray-600'}`}>{stepNum}</div>
                            {stepNum < 3 && (<div className={`w-12 h-1 ${step > stepNum ? 'bg-[#934790]' : 'bg-gray-200'}`} />)}
                        </React.Fragment>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-8">
                                {/* POLICY DETAILS SECTION */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-[#934790] rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#934790]">Policy Details</h3>
                                            <p className="text-xs text-gray-600">Basic policy information and coverage period</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Policy Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.policy_name}
                                                onChange={e => setFormData(prev => ({ ...prev, policy_name: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                                required
                                                placeholder="Enter policy name"
                                            />
                                            {getError('policy_name') && <div className="text-red-500 text-sm mt-1">{getError('policy_name')}</div>}
                                        </div>
                                        {/* Corporate Policy Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Corporate Policy Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.corporate_policy_name}
                                                onChange={e => setFormData(prev => ({ ...prev, corporate_policy_name: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                                required
                                                placeholder="Enter corporate policy name"
                                            />
                                            {getError('corporate_policy_name') && <div className="text-red-500 text-sm mt-1">{getError('corporate_policy_name')}</div>}
                                        </div>
                                        {/* corporate_policy_type removed — use 'Policy Type' select instead */}
                                        {/* Policy Type (GMI / GPA / GTL) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Type <span className="text-red-500">*</span></label>
                                            <select
                                                value={formData.policy_type}
                                                onChange={e => setFormData(prev => ({ ...prev, policy_type: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                            >
                                                <option value="">Select policy type</option>
                                                <option value="gmi">GMI</option>
                                                <option value="gpa">GPA</option>
                                                <option value="gtl">GTL</option>
                                            </select>
                                            {getError('policy_type') && <div className="text-red-500 text-sm mt-1">{getError('policy_type')}</div>}
                                        </div>
                                        {/* Policy Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Number</label>
                                            <input
                                                type="text"
                                                value={formData.policy_number}
                                                onChange={e => setFormData(prev => ({ ...prev, policy_number: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                                placeholder="Enter policy number"
                                            />
                                            {getError('policy_number') && <div className="text-red-500 text-sm mt-1">{getError('policy_number')}</div>}
                                        </div>
                                        {/* Policy Start Date */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Start Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={formData.policy_start_date}
                                                onChange={e => {
                                                    const startDate = e.target.value;
                                                    setFormData(prev => ({ ...prev, policy_start_date: startDate }));
                                                    if (startDate) {
                                                        const startDateObj = new Date(startDate);
                                                        const endDateObj = new Date(startDateObj);
                                                        endDateObj.setFullYear(startDateObj.getFullYear() + 1);
                                                        endDateObj.setDate(endDateObj.getDate() - 1);
                                                        const endDate = endDateObj.toISOString().split('T')[0];
                                                        setFormData(prev => ({ ...prev, policy_end_date: endDate }));
                                                    }
                                                }}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                                required
                                            />
                                            {getError('policy_start_date') && <div className="text-red-500 text-sm mt-1">{getError('policy_start_date')}</div>}
                                        </div>
                                        {/* Policy End Date */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy End Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                value={formData.policy_end_date}
                                                onChange={e => setFormData(prev => ({ ...prev, policy_end_date: e.target.value }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent shadow-sm"
                                                required
                                            />
                                            {getError('policy_end_date') && <div className="text-red-500 text-sm mt-1">{getError('policy_end_date')}</div>}
                                        </div>
                                        {/* Policy Document */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Document</label>
                                            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50 hover:bg-purple-100 transition-colors">
                                                <div className="flex items-center justify-center">
                                                    <label className="cursor-pointer flex flex-col items-center">
                                                        <svg className="w-12 h-12 text-[#934790] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <span className="text-sm font-semibold text-[#934790]">Click to upload policy document</span>
                                                        <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB)</span>
                                                        <input
                                                            type="file"
                                                            onChange={e => setFormData(prev => ({ ...prev, policy_document: e.target.files[0] }))}
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx"
                                                        />
                                                    </label>
                                                </div>
                                                    {getError('policy_document') && <div className="text-red-500 text-sm mt-2">{getError('policy_document')}</div>}
                                                {formData.policy_document && (
                                                    <div className="mt-4 flex items-center justify-between bg-white px-4 py-2 rounded border border-purple-200">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-gray-700">{formData.policy_document.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, policy_document: null }))}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Twin Allowed & Natural Addition */}
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <label className="flex items-center space-x-3 cursor-pointer bg-white px-4 py-3 rounded-lg border border-purple-300 hover:bg-purple-50 transition-colors w-full">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.is_twin_allowed}
                                                        onChange={e => setFormData(prev => ({ ...prev, is_twin_allowed: e.target.checked }))}
                                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700">Twin Members Allowed</span>
                                                </label>
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center space-x-3 cursor-pointer bg-white px-4 py-3 rounded-lg border border-purple-300 hover:bg-purple-50 transition-colors w-full">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.natural_addition_allowed}
                                                        onChange={e => setFormData(prev => ({ ...prev, natural_addition_allowed: e.target.checked }))}
                                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700">Natural Addition Allowed</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* USER DETAILS SECTION */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-blue-700">User Details</h3>
                                            <p className="text-xs text-gray-600">Corporate and escalation user information</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Corporate */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Corporate <span className="text-red-500">*</span></label>
                                            <SelectWithSearch
                                                options={corporates}
                                                value={formData.corporate_id}
                                                onChange={v => setFormData(prev => ({ ...prev, corporate_id: v }))}
                                                placeholder="Corporate"
                                                required
                                            />
                                            {getError('corporate_id') && <div className="text-red-500 text-sm mt-1">{getError('corporate_id')}</div>}
                                        </div>
                                        {/* Data Escalation User */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Data Escalation User</label>
                                            <SelectWithSearch
                                                options={escalationUsers}
                                                value={formData.data_escalation_id}
                                                onChange={v => setFormData(prev => ({ ...prev, data_escalation_id: v }))}
                                                placeholder="Data Escalation User"
                                            />
                                            {getError('data_escalation_id') && <div className="text-red-500 text-sm mt-1">{getError('data_escalation_id')}</div>}
                                        </div>
                                        {/* Claim Level 1 User */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Claim Level 1 User</label>
                                            <SelectWithSearch
                                                options={escalationUsers}
                                                value={formData.claim_level_1_id}
                                                onChange={v => setFormData(prev => ({ ...prev, claim_level_1_id: v }))}
                                                placeholder="Claim Level 1 User"
                                            />
                                            {getError('claim_level_1_id') && <div className="text-red-500 text-sm mt-1">{getError('claim_level_1_id')}</div>}
                                        </div>
                                        {/* Claim Level 2 User */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Claim Level 2 User</label>
                                            <SelectWithSearch
                                                options={escalationUsers}
                                                value={formData.claim_level_2_id}
                                                onChange={v => setFormData(prev => ({ ...prev, claim_level_2_id: v }))}
                                                placeholder="Claim Level 2 User"
                                            />
                                            {getError('claim_level_2_id') && <div className="text-red-500 text-sm mt-1">{getError('claim_level_2_id')}</div>}
                                        </div>
                                        {/* Sales RM / Service RM / Sales Vertical removed per request */}
                                    </div>
                                </div>

                                {/* INSURANCE DETAILS SECTION */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-green-700">Insurance Details</h3>
                                            <p className="text-xs text-gray-600">Insurance provider, TPA, and delivery information</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Insurance Provider */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Provider <span className="text-red-500">*</span></label>
                                            <SelectWithSearch
                                                options={insuranceProviders}
                                                value={formData.ins_id}
                                                onChange={v => setFormData(prev => ({ ...prev, ins_id: v }))}
                                                placeholder="Insurance Provider"
                                                required
                                            />
                                            {getError('ins_id') && <div className="text-red-500 text-sm mt-1">{getError('ins_id')}</div>}
                                        </div>
                                        {/* TPA Company */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">TPA Company</label>
                                            <SelectWithSearch
                                                options={tpaCompanies}
                                                value={formData.tpa_id}
                                                onChange={v => setFormData(prev => ({ ...prev, tpa_id: v }))}
                                                placeholder="TPA Company"
                                            />
                                            {getError('tpa_id') && <div className="text-red-500 text-sm mt-1">{getError('tpa_id')}</div>}
                                        </div>
                                        {/* CD Account */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">CD Account</label>
                                            <SelectWithSearch
                                                options={cdAccounts}
                                                value={formData.cd_ac_id}
                                                onChange={v => setFormData(prev => ({ ...prev, cd_ac_id: v }))}
                                                placeholder="CD Account"
                                            />
                                            {getError('cd_ac_id') && <div className="text-red-500 text-sm mt-1">{getError('cd_ac_id')}</div>}
                                            <p className="text-xs text-gray-500 mt-1">{cdAccounts.length} CD account(s) loaded</p>
                                        </div>
                                        {/* Is Paperless */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Paperless Option</label>
                                            <select
                                                value={formData.is_paperless}
                                                onChange={e => setFormData(prev => ({ ...prev, is_paperless: Number(e.target.value) }))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                                            >
                                                <option value={1}>Paperless</option>
                                                <option value={0}>Paper-based</option>
                                            </select>
                                        </div>
                                        {/* Courier Person - Conditional */}
                                        {formData.is_paperless === 0 && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Courier Person</label>
                                                <input
                                                    type="text"
                                                    value={formData.doc_courier_name}
                                                    onChange={e => setFormData(prev => ({ ...prev, doc_courier_name: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                                                    placeholder="Enter courier person name"
                                                />
                                            </div>
                                        )}
                                        {/* Courier Address - Conditional */}
                                        {formData.is_paperless === 0 && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Courier Address</label>
                                                <input
                                                    type="text"
                                                    value={formData.doc_courier_address}
                                                    onChange={e => setFormData(prev => ({ ...prev, doc_courier_address: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                                                    placeholder="Enter courier delivery address"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-end pt-4">
                                   
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (validateStep(1)) {
                                                setStep(2);
                                            }
                                        }}
                                        className="px-8 py-3 bg-gradient-to-r from-[#934790] to-[#6A0066] text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold flex items-center gap-2"
                                    >
                                        Next: Family Definition
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Family Definition */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Family Definition</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(FamilyIcons).map(([memberType, icon]) => {
                                        const isEnabled = formData.family_defination[memberType] === "1";
                                        const memberTitle = memberType.charAt(0).toUpperCase() + memberType.slice(1).replace(/_/g, ' ');

                                        return (
                                            <div key={memberType} className={`border-2 rounded-lg p-4 transition-all duration-200 ${isEnabled ? 'border-[#934790] bg-purple-50' : 'border-gray-200 bg-white'}`}>
                                                <div className="text-center mb-4">
                                                    {icon}
                                                    <h3 className="text-sm font-medium text-gray-900 mt-2">{memberTitle}</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-center">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isEnabled}
                                                                onChange={e => setFormData(prev => ({
                                                                    ...prev,
                                                                    family_defination: {
                                                                        ...prev.family_defination,
                                                                        [memberType]: e.target.checked ? "1" : "0",
                                                                        [`${memberType}_no`]: e.target.checked ? "1" : "0"
                                                                    }
                                                                }))}
                                                                className="rounded border-gray-300 text-[#934790] focus:ring-[#934790] focus:ring-offset-0"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Include</span>
                                                        </label>
                                                    </div>
                                                    {isEnabled && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="block text-xs text-gray-600 mb-1">Number</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="10"
                                                                    value={formData.family_defination[`${memberType}_no`]}
                                                                    onChange={e => setFormData(prev => ({
                                                                        ...prev,
                                                                        family_defination: {
                                                                            ...prev.family_defination,
                                                                            [`${memberType}_no`]: e.target.value
                                                                        }
                                                                    }))}
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Min Age</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        value={formData.family_defination[`${memberType}_min_age`]}
                                                                        onChange={e => setFormData(prev => ({
                                                                            ...prev,
                                                                            family_defination: {
                                                                                ...prev.family_defination,
                                                                                [`${memberType}_min_age`]: e.target.value
                                                                            }
                                                                        }))}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs text-gray-600 mb-1">Max Age</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        max="100"
                                                                        value={formData.family_defination[`${memberType}_max_age`]}
                                                                        onChange={e => setFormData(prev => ({
                                                                            ...prev,
                                                                            family_defination: {
                                                                                ...prev.family_defination,
                                                                                [`${memberType}_max_age`]: e.target.value
                                                                            }
                                                                        }))}
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs text-gray-600 mb-1">Gender</label>
                                                                <select
                                                                    value={formData.family_defination[`${memberType}_gender`]}
                                                                    onChange={e => setFormData(prev => ({
                                                                        ...prev,
                                                                        family_defination: {
                                                                            ...prev.family_defination,
                                                                            [`${memberType}_gender`]: e.target.value
                                                                        }
                                                                    }))}
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#934790] focus:border-transparent"
                                                                >
                                                                    <option value="both">Both</option>
                                                                    <option value="male">Male</option>
                                                                    <option value="female">Female</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Additional Family Options */}
                                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Additional Options</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Spouse with Same Gender</label>
                                            <select
                                                value={formData.family_defination.spouse_with_same_gender}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    family_defination: {
                                                        ...prev.family_defination,
                                                        spouse_with_same_gender: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            >
                                                <option value="null">Not Allowed</option>
                                                <option value="allowed">Allowed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Parent & Parent-in-Law</label>
                                            <select
                                                value={formData.family_defination.add_both_parent_n_parent_in_law}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    family_defination: {
                                                        ...prev.family_defination,
                                                        add_both_parent_n_parent_in_law: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            >
                                                <option value="either">Either</option>
                                                <option value="both">Both Allowed</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md" onClick={() => setStep(1)}>Back</button>
                                    <button type="button" className="px-4 py-2 bg-[#934790] text-white rounded-md" onClick={() => setStep(3)}>Next</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Policy Features */}
                        {step === 3 && (
                            <>
                                <FeatureModal
                                    open={!!modalOpen}
                                    onClose={() => setModalOpen(null)}
                                    onSave={feature => {
                                        if (modalOpen === 'add-inclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                inclusions: [...(prev.inclusions || []), { ...feature, feature_type: 'inc' }]
                                            }));
                                        } else if (modalOpen === 'edit-inclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                inclusions: prev.inclusions.map((f, i) => i === editIndex ? { ...feature, feature_type: 'inc' } : f)
                                            }));
                                        } else if (modalOpen === 'add-exclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                exclusions: [...(prev.exclusions || []), { ...feature, feature_type: 'exc' }]
                                            }));
                                        } else if (modalOpen === 'edit-exclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                exclusions: prev.exclusions.map((f, i) => i === editIndex ? { ...feature, feature_type: 'exc' } : f)
                                            }));
                                        }
                                    }}
                                    initial={modalOpen?.startsWith('edit-') ? (modalOpen === 'edit-inclusion' ? formData.inclusions?.[editIndex] : formData.exclusions?.[editIndex]) : null}
                                    type={modalOpen?.includes('inclusion') ? 'Inclusion' : 'Exclusion'}
                                />
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Features</h2>

                                    {/* CSV Upload Section */}
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm p-6 border border-purple-200">
                                        <div className="flex items-center gap-3 mb-4">
                                            <svg className="w-6 h-6 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-[#934790]">Bulk Upload Features</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File <span className="text-xs text-red-600">(inc/exc feature types)</span></label>
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={e => {
                                                        const file = e.target.files[0];
                                                        if (file) handleCsvUpload(file);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#934790] file:text-white hover:file:bg-[#6A0066]"
                                                />
                                                {csvError && (
                                                    <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {csvError}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    className="w-full px-4 py-2 bg-white border-2 border-[#934790] text-[#934790] rounded-lg shadow hover:bg-[#934790] hover:text-white transition-colors font-semibold"
                                                    onClick={handleSampleDownload}
                                                >
                                                    Download Sample CSV
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg shadow px-6 py-4 border-l-4 border-green-500">
                                            <div className="text-sm font-medium text-gray-600">Total Inclusions</div>
                                            <div className="text-3xl font-bold text-green-600 mt-1">{formData.inclusions?.length || 0}</div>
                                        </div>
                                        <div className="flex-1 bg-gradient-to-br from-red-50 to-pink-100 rounded-lg shadow px-6 py-4 border-l-4 border-red-500">
                                            <div className="text-sm font-medium text-gray-600">Total Exclusions</div>
                                            <div className="text-3xl font-bold text-red-600 mt-1">{formData.exclusions?.length || 0}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Validation Error for policy features */}
                                    {getError('policy_features') && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-sm font-medium text-red-700">{getError('policy_features')}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Two Column Layout - Exclusions Left, Inclusions Right */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* LEFT SIDE - Policy Exclusions */}
                                        <div className="bg-white rounded-xl shadow-lg border-2 border-red-200">
                                            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-t-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <h3 className="text-lg font-bold">Policy Exclusions</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 bg-white text-red-600 rounded-lg shadow-md hover:bg-red-50 font-semibold text-sm"
                                                        onClick={() => { setModalOpen('add-exclusion'); setEditIndex(null); }}
                                                    >
                                                        + Add Exclusion
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4 max-h-[600px] overflow-y-auto">
                                                {formData.exclusions && formData.exclusions.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {formData.exclusions.map((exc, idx) => (
                                                            <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                                                        <h4 className="font-semibold text-gray-800">{exc.title}</h4>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                                            onClick={() => { setModalOpen('edit-exclusion'); setEditIndex(idx); }}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                                            onClick={() => setFormData(prev => ({ ...prev, exclusions: prev.exclusions.filter((_, i) => i !== idx) }))}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{exc.description}</p>
                                                                <div className="mt-2 text-xs text-gray-500">
                                                                    <span className="bg-red-100 px-2 py-1 rounded">Type: exc</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-gray-400">
                                                        <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="font-medium">No exclusions added yet</p>
                                                        <p className="text-sm">Click "Add Exclusion" to get started</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* RIGHT SIDE - Policy Inclusions */}
                                        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200">
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-t-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <h3 className="text-lg font-bold">Policy Inclusions</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 bg-white text-green-600 rounded-lg shadow-md hover:bg-green-50 font-semibold text-sm"
                                                        onClick={() => { setModalOpen('add-inclusion'); setEditIndex(null); }}
                                                    >
                                                        + Add Inclusion
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4 max-h-[600px] overflow-y-auto">
                                                {formData.inclusions && formData.inclusions.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {formData.inclusions.map((inc, idx) => (
                                                            <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                                                        <h4 className="font-semibold text-gray-800">{inc.title}</h4>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                                            onClick={() => { setModalOpen('edit-inclusion'); setEditIndex(idx); }}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                                            onClick={() => setFormData(prev => ({ ...prev, inclusions: prev.inclusions.filter((_, i) => i !== idx) }))}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600">{inc.description}</p>
                                                                <div className="mt-2 text-xs text-gray-500">
                                                                    <span className="bg-green-100 px-2 py-1 rounded">Type: inc</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-gray-400">
                                                        <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="font-medium">No inclusions added yet</p>
                                                        <p className="text-sm">Click "Add Inclusion" to get started</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
                                        <button
                                            type="button"
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 font-semibold flex items-center gap-2"
                                            onClick={() => setStep(2)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                            </svg>
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 py-3 bg-gradient-to-r from-[#934790] to-[#6A0066] text-white rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Policy...
                                                </>
                                            ) : (
                                                <>
                                                    Create Policy
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
