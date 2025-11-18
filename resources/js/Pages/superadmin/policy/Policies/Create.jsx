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
}

import { Link, router } from '@inertiajs/react';
import SuperAdminLayout from '../../../../Layouts/SuperAdmin/Layout';

export default function Create({ insuranceProviders, escalationUsers }) {
    // Add missing handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
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
        corporate_policy_type: '',
        policy_number: '',
        policy_start_date: '',
        policy_end_date: '',
        policy_document: null,
        ins_id: '',
        tpa_id: '',
        cd_ac_id: '',
        is_paperless: 'yes',
        claim_document_courier_person: '',
        claim_document_courier_address: '',
        data_escalation_id: '',
        claim_level_1_id: '',
        claim_level_2_id: '',
        is_twin_allowed: false,
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
    const [corporates, setCorporates] = useState([]);
    const [tpaCompanies, setTpaCompanies] = useState([]);
    const [cdAccounts, setCdAccounts] = useState([]);
    // Modal state for add/edit feature dialogs
    // ...existing code...
    const [modalOpen, setModalOpen] = useState(null); // 'add-inclusion', 'edit-inclusion', 'add-exclusion', 'edit-exclusion'
    const [editIndex, setEditIndex] = useState(null);

    // Sample CSV download logic
    const handleSampleDownload = () => {
        const csvContent =
            'S.No,Feature Name,Feature Desc,Feature Type\n' +
            ',,,\n'.repeat(9); // 10 rows total, first is header
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
            const header = lines[0].split(',');
            const nameIdx = header.findIndex(h => h.trim().toLowerCase().includes('name'));
            const descIdx = header.findIndex(h => h.trim().toLowerCase().includes('desc'));
            const typeIdx = header.findIndex(h => h.trim().toLowerCase().includes('type'));
            const iconIdx = header.findIndex(h => h.trim().toLowerCase().includes('icon'));
            if (nameIdx === -1 || descIdx === -1 || typeIdx === -1) {
                setCsvError('CSV must have columns: Feature Name, Feature Desc, Feature Type.');
                return;
            }
            const inclusions = [];
            const exclusions = [];
            let validRowFound = false;
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(',');
                if (!cols[nameIdx] && !cols[descIdx]) continue;
                validRowFound = true;
                const feature = {
                    title: cols[nameIdx] || '',
                    description: cols[descIdx] || '',
                    icon: iconIdx !== -1 ? (cols[iconIdx] || null) : null
                };
                const type = (cols[typeIdx] || '').toLowerCase();
                if (type === 'exclusion') {
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
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Corporate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Corporate *</label>
                                        <select
                                            value={formData.corporate_id}
                                            onChange={e => setFormData(prev => ({ ...prev, corporate_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Corporate</option>
                                            {corporates.map(corp => (
                                                <option key={corp.id} value={corp.id}>{corp.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Policy Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
                                        <input
                                            type="text"
                                            value={formData.policy_name}
                                            onChange={e => setFormData(prev => ({ ...prev, policy_name: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                            placeholder="Enter policy name"
                                        />
                                    </div>
                                    {/* Corporate Policy Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Corporate Policy Name *</label>
                                        <input
                                            type="text"
                                            value={formData.corporate_policy_name}
                                            onChange={e => setFormData(prev => ({ ...prev, corporate_policy_name: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                            placeholder="Enter corporate policy name"
                                        />
                                    </div>
                                    {/* Corporate Policy Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Corporate Policy Type</label>
                                        <input
                                            type="text"
                                            value={formData.corporate_policy_type}
                                            onChange={e => setFormData(prev => ({ ...prev, corporate_policy_type: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            placeholder="Enter corporate policy type"
                                        />
                                    </div>
                                    {/* Policy Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                                        <input
                                            type="text"
                                            value={formData.policy_number}
                                            onChange={e => setFormData(prev => ({ ...prev, policy_number: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            placeholder="Enter policy number"
                                        />
                                    </div>
                                    {/* Policy Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy Start Date *</label>
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    {/* Policy End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy End Date *</label>
                                        <input
                                            type="date"
                                            value={formData.policy_end_date}
                                            onChange={e => setFormData(prev => ({ ...prev, policy_end_date: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    {/* Insurance Provider */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider *</label>
                                        <select
                                            value={formData.ins_id}
                                            onChange={e => setFormData(prev => ({ ...prev, ins_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Provider</option>
                                            {insuranceProviders.map(provider => (
                                                <option key={provider.id} value={provider.id}>{provider.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* TPA Company */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">TPA Company</label>
                                        <select
                                            value={formData.tpa_id}
                                            onChange={e => setFormData(prev => ({ ...prev, tpa_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="">Select TPA</option>
                                            {tpaCompanies.map(tpa => (
                                                <option key={tpa.id} value={tpa.id}>{tpa.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* CD Account */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CD Account</label>
                                        <select
                                            value={formData.cd_ac_id}
                                            onChange={e => setFormData(prev => ({ ...prev, cd_ac_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="">Select Account</option>
                                            {cdAccounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Data Escalation User */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Escalation User</label>
                                        <select
                                            value={formData.data_escalation_id}
                                            onChange={e => setFormData(prev => ({ ...prev, data_escalation_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="">Select User</option>
                                            {escalationUsers.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Claim Level 1 User */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Claim Level 1 User</label>
                                        <select
                                            value={formData.claim_level_1_id}
                                            onChange={e => setFormData(prev => ({ ...prev, claim_level_1_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="">Select User</option>
                                            {escalationUsers.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Claim Level 2 User */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Claim Level 2 User</label>
                                        <select
                                            value={formData.claim_level_2_id}
                                            onChange={e => setFormData(prev => ({ ...prev, claim_level_2_id: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="">Select User</option>
                                            {escalationUsers.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Policy Document */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Policy Document</label>
                                        <input
                                            type="file"
                                            onChange={e => setFormData(prev => ({ ...prev, policy_document: e.target.files[0] }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        />
                                    </div>
                                    {/* Paperless Option */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Is Paperless?</label>
                                        <select
                                            value={formData.is_paperless}
                                            onChange={e => setFormData(prev => ({ ...prev, is_paperless: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                    {/* Claim Document Courier Person */}
                                    {formData.is_paperless === 'no' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Document Courier Person</label>
                                            <input
                                                type="text"
                                                value={formData.claim_document_courier_person}
                                                onChange={e => setFormData(prev => ({ ...prev, claim_document_courier_person: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                placeholder="Enter courier person name"
                                            />
                                        </div>
                                    )}
                                    {/* Claim Document Courier Address */}
                                    {formData.is_paperless === 'no' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Claim Document Courier Address</label>
                                            <input
                                                type="text"
                                                value={formData.claim_document_courier_address}
                                                onChange={e => setFormData(prev => ({ ...prev, claim_document_courier_address: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent"
                                                placeholder="Enter courier address"
                                            />
                                        </div>
                                    )}
                                    {/* Twin Allowed */}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_twin_allowed}
                                            onChange={e => setFormData(prev => ({ ...prev, is_twin_allowed: e.target.checked }))}
                                            className="mr-2 rounded border-gray-300 text-[#934790] focus:ring-[#934790]"
                                        />
                                        <label className="text-sm font-medium text-gray-700">Twin Allowed</label>
                                    </div>
                                </div>
                                {/* Next Button */}
                                <div className="flex justify-end">
                                    <button type="button" className="px-4 py-2 bg-[#934790] text-white rounded-md" onClick={() => setStep(2)}>Next</button>
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
                                                inclusions: [...(prev.inclusions || []), feature]
                                            }));
                                        } else if (modalOpen === 'edit-inclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                inclusions: prev.inclusions.map((f, i) => i === editIndex ? feature : f)
                                            }));
                                        } else if (modalOpen === 'add-exclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                exclusions: [...(prev.exclusions || []), feature]
                                            }));
                                        } else if (modalOpen === 'edit-exclusion') {
                                            setFormData(prev => ({
                                                ...prev,
                                                exclusions: prev.exclusions.map((f, i) => i === editIndex ? feature : f)
                                            }));
                                        }
                                    }}
                                    initial={modalOpen?.startsWith('edit-') ? (modalOpen === 'edit-inclusion' ? formData.inclusions?.[editIndex] : formData.exclusions?.[editIndex]) : null}
                                    type={modalOpen?.includes('inclusion') ? 'Inclusion' : 'Exclusion'}
                                />
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Policy Features</h2>
                                    {/* ...existing code for upload and counts... */}
                                    <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-4 flex flex-col md:flex-row md:items-end gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Features <span className="text-xs text-red-600">(CSV only)</span></label>
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={e => {
                                                    const file = e.target.files[0];
                                                    setFormData(prev => ({ ...prev, featuresFile: file }));
                                                    handleCsvUpload(file);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#934790] focus:border-transparent bg-white"
                                            />
                                            {csvError && (
                                                <div className="mt-2 text-sm text-red-600">{csvError}</div>
                                            )}
                                        </div>
                                        <button type="button" className="px-4 py-2 bg-[#934790] text-white rounded-lg shadow" onClick={() => {/* handle sample download */ }}>Download Sample CSV</button>
                                        <button type="button" className="px-4 py-2 bg-[#2d3748] text-white rounded-lg shadow" onClick={() => {/* handle file upload */ }}>Upload</button>
                                    </div>
                                    <div className="flex gap-8 mb-2">
                                        <div className="bg-white rounded-lg shadow px-4 py-2 text-sm font-semibold text-gray-700">Total Inclusions: <span className="text-[#934790]">{formData.inclusions?.length || 0}</span></div>
                                        <div className="bg-white rounded-lg shadow px-4 py-2 text-sm font-semibold text-gray-700">Total Exclusions: <span className="text-[#ef4444]">{formData.exclusions?.length || 0}</span></div>
                                    </div>
                                    {/* Policy Inclusions Card */}
                                    <div className="bg-white rounded-xl shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-[#3b82f6]">Policy Inclusions</h3>
                                            <button type="button" className="px-4 py-2 bg-[#10b981] text-white rounded-lg shadow" onClick={() => { setModalOpen('add-inclusion'); setEditIndex(null); }}>+ Add Inclusion</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-blue-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">SR NO.</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Feature Title</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Feature Description</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Edit</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.inclusions && formData.inclusions.length > 0 ? (
                                                        formData.inclusions.map((inc, idx) => (
                                                            <tr key={idx} className="border-t">
                                                                <td className="px-3 py-2">{idx + 1}</td>
                                                                <td className="px-3 py-2">{inc.title}</td>
                                                                <td className="px-3 py-2">{inc.description}</td>
                                                                <td className="px-3 py-2">{inc.icon ? <img src={inc.icon} alt="icon" className="w-6 h-6 rounded" /> : <span className="text-gray-400">-</span>}</td>
                                                                <td className="px-3 py-2">
                                                                    <button type="button" className="text-[#934790] hover:underline font-medium" onClick={() => { setModalOpen('edit-inclusion'); setEditIndex(idx); }}>Edit</button>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <button type="button" className="text-red-600 hover:underline font-medium" onClick={() => setFormData(prev => ({ ...prev, inclusions: prev.inclusions.filter((_, i) => i !== idx) }))}>Remove</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6} className="text-center py-4 text-gray-400">No data found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Policy Exclusions Card */}
                                    <div className="bg-white rounded-xl shadow p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-[#ef4444]">Policy Exclusions</h3>
                                            <button type="button" className="px-4 py-2 bg-[#f59e42] text-white rounded-lg shadow" onClick={() => { setModalOpen('add-exclusion'); setEditIndex(null); }}>+ Add Exclusion</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-red-50">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">SR NO.</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Feature Title</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Feature Description</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Edit</th>
                                                        <th className="px-3 py-2 text-left font-medium text-gray-700">Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.exclusions && formData.exclusions.length > 0 ? (
                                                        formData.exclusions.map((exc, idx) => (
                                                            <tr key={idx} className="border-t">
                                                                <td className="px-3 py-2">{idx + 1}</td>
                                                                <td className="px-3 py-2">{exc.title}</td>
                                                                <td className="px-3 py-2">{exc.description}</td>
                                                                <td className="px-3 py-2">{exc.icon ? <img src={exc.icon} alt="icon" className="w-6 h-6 rounded" /> : <span className="text-gray-400">-</span>}</td>
                                                                <td className="px-3 py-2">
                                                                    <button type="button" className="text-[#934790] hover:underline font-medium" onClick={() => { setModalOpen('edit-exclusion'); setEditIndex(idx); }}>Edit</button>
                                                                </td>
                                                                <td className="px-3 py-2">
                                                                    <button type="button" className="text-red-600 hover:underline font-medium" onClick={() => setFormData(prev => ({ ...prev, exclusions: prev.exclusions.filter((_, i) => i !== idx) }))}>Remove</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6} className="text-center py-4 text-gray-400">No data found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-8">
                                        <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow" onClick={() => setStep(2)}>Back</button>
                                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#934790] text-white rounded-lg shadow">{isSubmitting ? 'Creating...' : 'Create Policy'}</button>
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
