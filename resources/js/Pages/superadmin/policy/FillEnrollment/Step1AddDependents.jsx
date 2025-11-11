import React, { useState, useEffect } from 'react';

// Family member icons for different relationships
const FamilyIcons = {
    SELF: '/assets/images/enrolment/self.png',
    SPOUSE: '/assets/images/enrolment/spouse.png',
    SON: '/assets/images/enrolment/kids.png',
    DAUGHTER: '/assets/images/enrolment/kids.png',
    FATHER: '/assets/images/enrolment/parents.png',
    MOTHER: '/assets/images/enrolment/parents.png',
    FATHER_IN_LAW: '/assets/images/enrolment/parents.png',
    MOTHER_IN_LAW: '/assets/images/enrolment/parents.png',
    SIBLING: '/assets/images/enrolment/siblings.png',
    PARTNERS: '/assets/images/enrolment/spouse.png',
    OTHERS: '/assets/images/enrolment/others.png'
};

// Top-level helpers used by the modal and main component
function getRelationAgeLimits(relation, fam = {}) {
    if (!relation) return null;
    if (relation === 'SON' || relation === 'DAUGHTER') return { min: fam.kids?.min_age ?? null, max: fam.kids?.max_age ?? null };
    if (relation === 'FATHER' || relation === 'MOTHER') return { min: fam.parent?.min_age ?? null, max: fam.parent?.max_age ?? null };
    if (relation === 'FATHER_IN_LAW' || relation === 'MOTHER_IN_LAW') return { min: fam.parent_in_law?.min_age ?? null, max: fam.parent_in_law?.max_age ?? null };
    if (relation === 'SPOUSE') return { min: fam.spouse?.min_age ?? null, max: fam.spouse?.max_age ?? null };
    if (relation === 'SIBLING') return { min: fam.sibling?.min_age ?? null, max: fam.sibling?.max_age ?? null };
    if (relation === 'PARTNERS') return { min: fam.partners?.min_age ?? null, max: fam.partners?.max_age ?? null };
    if (relation === 'OTHERS') return { min: fam.others?.min_age ?? null, max: fam.others?.max_age ?? null };
    if (relation === 'SELF') return { min: fam.self?.min_age ?? null, max: fam.self?.max_age ?? null };
    return null;
}

function checkParentCombination(candidate, currentDependents, fam = {}, editingId = null) {
    const rule = fam.add_both_parent_n_parent_in_law || 'both';
    if (rule === 'both') return null;
    const would = currentDependents.filter(d => (editingId ? d.id !== editingId : true)).map(d => d.relation);
    if (candidate && candidate.relation) would.push(candidate.relation);
    const hasParent = would.some(r => r === 'FATHER' || r === 'MOTHER');
    const hasParentInLaw = would.some(r => r === 'FATHER_IN_LAW' || r === 'MOTHER_IN_LAW');
    if (rule === 'either' && hasParent && hasParentInLaw) return 'Policy allows either parent or parent-in-law, not both.';
    return null;
}

// Modal for adding new dependent
function AddDependentModal({ isOpen, onClose, onSave, relationOptions, familyDefNormalized, dependents, initialData }) {
    const [formData, setFormData] = useState({
        insured_name: '',
        relation: '',
        detailed_relation: '',
        gender: '',
        dob: '',
        age: ''
    });
    const [errors, setErrors] = useState({});

    const isEdit = !!initialData;

    useEffect(() => {
        if (isOpen) {
            if (isEdit) {
                setFormData({
                    insured_name: initialData.insured_name || '',
                    relation: initialData.relation || '',
                    detailed_relation: initialData.detailed_relation || '',
                    gender: initialData.gender || '',
                    dob: initialData.dob || '',
                    age: initialData.age || ''
                });
            } else {
                setFormData({ insured_name: '', relation: '', detailed_relation: '', gender: '', dob: '', age: '' });
            }
            setErrors({});
        }
    }, [isOpen, isEdit, initialData]);

    const calcAge = (value) => {
        if (!value) return '';
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const updateFormData = (field, value) => {
        console.log('Updating formData:', field, value);
        const updated = { ...formData, [field]: value };
        if (field === 'dob') {
            updated.age = calcAge(value);
        }
        setFormData(updated);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.insured_name.trim()) newErrors.insured_name = 'Name is required';
        if (!formData.relation) newErrors.relation = 'Relationship is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';

        // Age validation against family definition
        if (formData.dob && formData.relation) {
            const limits = getRelationAgeLimits(formData.relation, familyDefNormalized);
            if (limits) {
                const age = calcAge(formData.dob);
                if (typeof limits.min === 'number' && age < limits.min) newErrors.dob = `Minimum age for ${formData.relation} is ${limits.min}`;
                if (typeof limits.max === 'number' && age > limits.max) newErrors.dob = `Maximum age for ${formData.relation} is ${limits.max}`;
            }
        }

        // Count validation for add (if adding new and limit reached)
        if (!isEdit && formData.relation) {
            const relationMeta = relationOptions.find(r => r.value === formData.relation);
            if (relationMeta) {
                const currentCount = dependents.filter(d => d.relation === formData.relation).length;
                if (currentCount >= relationMeta.maxCount) newErrors.relation = `${relationMeta.label} limit reached`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const payload = {
            ...formData,
            id: isEdit ? initialData.id : Date.now(),
            detailed_relation: formData.detailed_relation || relationOptions.find(r => r.value === formData.relation)?.label || ''
        };

        // Combination rule: parent vs parent_in_law
        const comboError = checkParentCombination(payload, dependents, familyDefNormalized, isEdit ? initialData.id : null);
        if (comboError) {
            setErrors(prev => ({ ...prev, relation: comboError }));
            return;
        }

        onSave(payload);
        onClose();
    };

    if (!isOpen) return null;

    // If no relation options, show a message instead of the form
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#934790] to-[#7a3d7a] px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Family Member' : 'Add Family Member'}</h3>
                                <p className="text-white/80 text-sm">Add or update a dependent for this insurance policy</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Family Definition Statement */}
                <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 mb-2">Who can you add to this policy?</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                {relationOptions.length === 0 ? (
                                    <div className="text-rose-600">No relations are available to add. Please contact your administrator.</div>
                                ) : (
                                    relationOptions.map((relation) => {
                                        const currentCount = dependents.filter(d => d.relation === relation.value).length;
                                        const disabled = currentCount >= relation.maxCount;
                                        return (
                                            <div key={relation.value} className="flex items-center gap-2">
                                                <img src={FamilyIcons[relation.value]} alt={relation.label} className="w-5 h-5 object-contain" />
                                                <span>{relation.label} (Max: {relation.maxCount})</span>
                                                <span className="text-xs text-gray-500"> — {currentCount} added</span>
                                                {disabled && <span className="ml-2 text-xs text-rose-600">(limit reached)</span>}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {relationOptions.length === 0 ? (
                    <div className="p-8 text-center text-rose-600 text-lg">No relations are available to add. Please contact your administrator.</div>
                ) : (
                    <>
                        {/* Form Fields */}
                        <div className="p-6 space-y-6">
                            {/* Name and Relationship Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={formData.insured_name} onChange={(e) => updateFormData('insured_name', e.target.value)} className={`block w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.insured_name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Enter full name" />
                                    {errors.insured_name && <p className="text-xs text-red-600 mt-1">{errors.insured_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship <span className="text-red-500">*</span></label>
                                    <select
                                      value={formData.relation}
                                      onChange={e => {
                                        const relation = e.target.value;
                                        const detailed_relation = e.target.options[e.target.selectedIndex].text;
                                        // Update both fields properly using the modal's updateFormData function
                                        setFormData(prev => ({ ...prev, relation, detailed_relation }));
                                      }}
                                      className={`block w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.relation ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                    >
                                      <option value="">Select relationship</option>
                                      {relationOptions.map(opt => {
                                        const currentCount = dependents.filter(d => d.relation === opt.value).length;
                                        const isCurrent = isEdit && initialData && initialData.relation === opt.value;
                                        // Only disable if at max count and not editing this relation
                                        let shouldDisable = false;
                                        if (isEdit) {
                                          shouldDisable = !isCurrent && currentCount >= opt.maxCount;
                                        } else {
                                          shouldDisable = opt.maxCount === 0 || currentCount >= opt.maxCount;
                                        }
                                        // Defensive: never disable if maxCount is undefined/null/0 (should be filtered out already)
                                        return (
                                          <option key={opt.value} value={opt.value} disabled={shouldDisable ? true : undefined}>
                                            {opt.label}{shouldDisable ? ' (full)' : ''}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    {errors.relation && <p className="text-xs text-red-600 mt-1">{errors.relation}</p>}
                                </div>
                            </div>

                            {/* Gender and DOB Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                                    <select value={formData.gender} onChange={(e) => updateFormData('gender', e.target.value)} className={`block w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                                        <option value="">Select gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                                    <input type="date" value={formData.dob} onChange={(e) => updateFormData('dob', e.target.value)} max={new Date().toISOString().split('T')[0]} className={`block w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#934790] focus:border-[#934790] transition-colors ${errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
                                    {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
                                </div>
                            </div>

                            {/* Age Display */}
                            {formData.age !== '' && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#934790] rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{formData.age}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">years old</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
                            <div className="flex items-center justify-end gap-3">
                                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">Cancel</button>
                                <button onClick={handleSubmit} className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#934790] to-[#7a3d7a] rounded-lg hover:from-[#7a3d7a] hover:to-[#934790] focus:outline-none focus:ring-2 focus:ring-[#934790] transition-all">{isEdit ? 'Save Changes' : 'Add Member'}</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function Step1AddDependents({ employee, enrollmentDetail, familyDefinition, formData, updateFormData, onNext }) {
    const [dependents, setDependents] = useState(formData.dependents || []);
    const [errors, setErrors] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [editInitialData, setEditInitialData] = useState(null);

    // Helpers
    function parseFamilyDefinition(fd) {
        if (!fd) return {};
        let obj = fd;
        if (typeof fd === 'string') {
            try { obj = JSON.parse(fd); } catch (e) { obj = {}; }
        }
        return obj;
    }

    function normalizeFamilyDefinition(fdRaw) {
        const fd = parseFamilyDefinition(fdRaw) || {};
        const get = (k) => fd[k];
        const parseBool = (v) => v === '1' || v === 1 || v === true || v === 'true';
        const toInt = (v, fallback = 0) => { const n = parseInt(v); return Number.isNaN(n) ? fallback : n; };

        // Helper to extract relation config
        function extractRelation(key, fallbackKeys = []) {
            const rel = fd[key] || fallbackKeys.map(k => fd[k]).find(Boolean) || {};
            return {
                enabled: parseBool(rel.enabled),
                no: toInt(rel.no, 0),
                min_age: toInt(rel.min_age, null),
                max_age: toInt(rel.max_age, null),
                gender: rel.gender || null
            };
        }

        const normalized = {
            self: extractRelation('self'),
            spouse: extractRelation('spouse'),
            kids: extractRelation('kids', ['kid', 'children']),
            parent: extractRelation('parent'),
            parent_in_law: extractRelation('parent_in_law'),
            sibling: extractRelation('sibling'),
            partners: extractRelation('partners'),
            others: extractRelation('others'),
            add_both_parent_n_parent_in_law: fd.add_both_parent_n_parent_in_law || 'both',
            spouse_with_same_gender: fd.spouse_with_same_gender || null
        };
        return normalized;
    }

    const familyDefNormalized = normalizeFamilyDefinition(familyDefinition || {});

    // Initialize dependents from formData when component mounts
    useEffect(() => {
        if (formData.dependents && formData.dependents.length) {
            setDependents(formData.dependents);
            return;
        }

        const isSelfDefault = enrollmentDetail?.is_self_allowed_by_default === 1 || enrollmentDetail?.is_self_allowed_by_default === '1';
        if (isSelfDefault) {
            const selfDependent = {
                id: 'self',
                insured_name: employee.full_name || '',
                relation: 'SELF',
                detailed_relation: 'Self',
                gender: employee.gender || '',
                dob: employee.date_of_birth || employee.dob || '',
                age: employee.age || '',
                is_self: true
            };
            setDependents([selfDependent]);
            updateFormData({ dependents: [selfDependent] });
            return;
        }

        setDependents(formData.dependents || []);
    }, [formData.dependents, enrollmentDetail, employee, updateFormData]);

    // Build relationship types from normalized family def
    const relationshipTypes = [];
    if (familyDefNormalized.self?.enabled) relationshipTypes.push({ value: 'SELF', label: 'Self', maxCount: familyDefNormalized.self.no || 1 });
    if (familyDefNormalized.spouse?.enabled) relationshipTypes.push({ value: 'SPOUSE', label: 'Spouse', maxCount: familyDefNormalized.spouse.no || 1 });
    if (familyDefNormalized.kids?.enabled) { relationshipTypes.push({ value: 'SON', label: 'Son', maxCount: familyDefNormalized.kids.no || 0 }); relationshipTypes.push({ value: 'DAUGHTER', label: 'Daughter', maxCount: familyDefNormalized.kids.no || 0 }); }
    if (familyDefNormalized.parent?.enabled) { relationshipTypes.push({ value: 'FATHER', label: 'Father', maxCount: familyDefNormalized.parent.no || 0 }); relationshipTypes.push({ value: 'MOTHER', label: 'Mother', maxCount: familyDefNormalized.parent.no || 0 }); }
    if (familyDefNormalized.parent_in_law?.enabled) { relationshipTypes.push({ value: 'FATHER_IN_LAW', label: 'Father-in-law', maxCount: familyDefNormalized.parent_in_law.no || 0 }); relationshipTypes.push({ value: 'MOTHER_IN_LAW', label: 'Mother-in-law', maxCount: familyDefNormalized.parent_in_law.no || 0 }); }
    if (familyDefNormalized.sibling?.enabled) relationshipTypes.push({ value: 'SIBLING', label: 'Sibling', maxCount: familyDefNormalized.sibling.no || 0 });
    if (familyDefNormalized.partners?.enabled) relationshipTypes.push({ value: 'PARTNERS', label: 'Partners', maxCount: familyDefNormalized.partners.no || 0 });
    if (familyDefNormalized.others?.enabled) relationshipTypes.push({ value: 'OTHERS', label: 'Others', maxCount: familyDefNormalized.others.no || 0 });

    const getRelationshipCount = (relation) => dependents.filter(dep => dep.relation === relation).length;

    // Filter out 'SELF' from dropdown options (should never be selectable)
    const relationOptions = relationshipTypes.filter(opt => opt.value !== 'SELF');
    const availableRelationsForAdd = relationOptions.filter(opt => getRelationshipCount(opt.value) < opt.maxCount);

    // Age limits lookup for a relation value
    function getRelationAgeLimits(relation, fam = familyDefNormalized) {
        if (!relation) return null;
        if (relation === 'SON' || relation === 'DAUGHTER') return { min: fam.kids?.min_age ?? null, max: fam.kids?.max_age ?? null };
        if (relation === 'FATHER' || relation === 'MOTHER') return { min: fam.parent?.min_age ?? null, max: fam.parent?.max_age ?? null };
        if (relation === 'FATHER_IN_LAW' || relation === 'MOTHER_IN_LAW') return { min: fam.parent_in_law?.min_age ?? null, max: fam.parent_in_law?.max_age ?? null };
        if (relation === 'SPOUSE') return { min: fam.spouse?.min_age ?? null, max: fam.spouse?.max_age ?? null };
        if (relation === 'SIBLING') return { min: fam.sibling?.min_age ?? null, max: fam.sibling?.max_age ?? null };
        if (relation === 'PARTNERS') return { min: fam.partners?.min_age ?? null, max: fam.partners?.max_age ?? null };
        if (relation === 'OTHERS') return { min: fam.others?.min_age ?? null, max: fam.others?.max_age ?? null };
        if (relation === 'SELF') return { min: fam.self?.min_age ?? null, max: fam.self?.max_age ?? null };
        return null;
    }

    // Check parent vs parent_in_law combination rule
    function checkParentCombination(candidate, currentDependents, fam = familyDefNormalized, editingId = null) {
        const rule = fam.add_both_parent_n_parent_in_law || 'both';
        if (rule === 'both') return null;
        const would = currentDependents.filter(d => (editingId ? d.id !== editingId : true)).map(d => d.relation);
        if (candidate && candidate.relation) would.push(candidate.relation);
        const hasParent = would.some(r => r === 'FATHER' || r === 'MOTHER');
        const hasParentInLaw = would.some(r => r === 'FATHER_IN_LAW' || r === 'MOTHER_IN_LAW');
        if (rule === 'either' && hasParent && hasParentInLaw) return 'Policy allows either parent or parent-in-law, not both.';
        return null;
    }

    const handleSaveDependent = (payload) => {
        const exists = dependents.find(d => d.id === payload.id);
        let updated;
        if (exists) updated = dependents.map(d => d.id === payload.id ? payload : d);
        else updated = [...dependents, payload];
        setDependents(updated);
        updateFormData({ dependents: updated });
    };

    const removeDependent = (id) => {
        const depToRemove = dependents.find(d => d.id === id);
        if (!depToRemove) return;
        if (depToRemove?.is_self && depToRemove.id === 'self') return; // prevent deleting auto-self
        if (!window.confirm('Remove this dependent?')) return;
        const updatedDependents = dependents.filter(dep => dep.id !== id);
        setDependents(updatedDependents);
        updateFormData({ dependents: updatedDependents });
    };

    const openAddModal = () => {
        setEditInitialData(null);
        // Reset relation field so dropdown is always enabled and selectable
        if (typeof updateFormData === 'function') updateFormData({ ...formData, relation: '' });
        setShowAddModal(true);
    };
    const openEditModal = (dep) => { setEditInitialData(dep); setShowAddModal(true); };

    const validateForm = () => {
        const newErrors = {};
        dependents.forEach((dep) => {
            if (!dep.insured_name || !dep.insured_name.trim()) newErrors[`${dep.id}_name`] = 'Name is required';
            if (!dep.relation) newErrors[`${dep.id}_relation`] = 'Relationship is required';
            if (!dep.gender) newErrors[`${dep.id}_gender`] = 'Gender is required';
            if (!dep.dob) newErrors[`${dep.id}_dob`] = 'Date of birth is required';
            if (dep.dob && dep.relation) {
                const limits = getRelationAgeLimits(dep.relation);
                if (limits) {
                    const age = (function(v){ const t=new Date(); const b=new Date(v); let a=t.getFullYear()-b.getFullYear(); const m=t.getMonth()-b.getMonth(); if (m<0 || (m===0 && t.getDate()<b.getDate())) a--; return a; })(dep.dob);
                    if (typeof limits.min === 'number' && age < limits.min) newErrors[`${dep.id}_dob`] = `Min age for ${dep.relation} is ${limits.min}`;
                    if (typeof limits.max === 'number' && age > limits.max) newErrors[`${dep.id}_dob`] = `Max age for ${dep.relation} is ${limits.max}`;
                }
            }
        });
        relationOptions.forEach(opt => { const count = getRelationshipCount(opt.value); if (count > opt.maxCount) newErrors['_counts'] = `Too many ${opt.label} added (max ${opt.maxCount})`; });
        const comboErr = checkParentCombination(null, dependents, familyDefNormalized, null);
        if (comboErr) newErrors['_combo'] = comboErr;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => { if (validateForm()) onNext(); };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Family Members</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">Add your family members who will be covered under this insurance policy. You can add up to <span className="font-semibold text-[#934790]">{familyDefinition?.max_family_size || 6} total members</span> including yourself.</p>
            </div>

            {/* Employee Information Card */}
            <div className="bg-gradient-to-r from-[#faf5ff] via-white to-[#faf5ff] border border-purple-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#934790] to-[#7a3d7a] rounded-xl flex items-center justify-center">
                        <img src={FamilyIcons.SELF} alt="Self" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-[#4b1864]">Primary Insured (Employee)</h4>
                        <p className="text-sm text-gray-600">This is the main policy holder</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                        <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Employee Code</label>
                        <p className="text-sm font-medium text-gray-900">{employee.employees_code}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                        <p className="text-sm font-medium text-gray-900">{employee.gender || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Joining</label>
                        <p className="text-sm font-medium text-gray-900">{employee.date_of_joining || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Dependents Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">Dependents ({dependents.length})</h4>
                        <p className="text-sm text-gray-600 mt-1">Family members covered under this policy</p>
                    </div>

                    <button
                        type="button"
                        onClick={availableRelationsForAdd.length > 0 ? openAddModal : undefined}
                        className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg ${availableRelationsForAdd.length > 0 ? 'bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white hover:from-[#7a3d7a] hover:to-[#934790]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={availableRelationsForAdd.length === 0}
                        title={availableRelationsForAdd.length === 0 ? 'All relationship limits reached. You cannot add more members.' : ''}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Add Family Member
                    </button>
                </div>

                {/* Dependents Grid */}
                {dependents.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No family members added yet</h3>
                        <p className="text-gray-500 mb-6">Add family members to include them in your insurance coverage</p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center px-6 py-3 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all shadow-lg bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white hover:from-[#7a3d7a] hover:to-[#934790]"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Add Your First Family Member
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dependents.map((dependent) => (
                            <div key={dependent.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#934790]/10 to-[#7a3d7a]/10 rounded-lg flex items-center justify-center"><img src={FamilyIcons[dependent.relation] || FamilyIcons.SELF} alt={dependent.detailed_relation || 'Member'} className="w-8 h-8 object-contain" /></div>
                                        <div className="flex-1 min-w-0"><h5 className="font-semibold text-gray-900 truncate">{dependent.detailed_relation || 'Member'}</h5><p className="text-sm text-gray-500 truncate">{dependent.insured_name || 'Not specified'}</p></div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => openEditModal(dependent)} className="text-gray-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors" title="Edit dependent"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                        {!(dependent.is_self && dependent.id === 'self') && (<button type="button" onClick={() => removeDependent(dependent.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors" title="Remove dependent"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>)}
                                    </div>
                                </div>

                                {/* Card Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Gender</span><span className="text-sm font-medium text-gray-900">{dependent.gender || 'Not specified'}</span></div>
                                    <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Date of Birth</span><span className="text-sm font-medium text-gray-900">{dependent.dob || 'Not specified'}</span></div>
                                    {dependent.age && (<div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">Age</span><div className="flex items-center gap-2"><span className="text-sm font-bold text-[#934790]">{dependent.age}</span><span className="text-xs text-gray-500">years</span></div></div>)}
                                </div>

                                {/* Self Badge */}
                                {dependent.is_self && (<div className="mt-4 pt-3 border-t border-gray-100"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#934790]/10 text-[#934790]"><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>Primary Insured</span></div>)}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Message when no more relations can be added */}
                {availableRelationsForAdd.length === 0 && dependents.length > 0 && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-4"><div className="flex items-start gap-3"><div className="w-5 h-5 text-amber-600 mt-0.5"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div><div><h4 className="font-medium text-amber-800">All relationship limits reached</h4><p className="text-sm text-amber-700 mt-1">You have reached the maximum number of family members allowed for each relationship type according to your policy configuration.</p></div></div></div>)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-8 border-t border-gray-200"><div></div><button type="button" onClick={handleNext} className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#934790] to-[#7a3d7a] text-white font-semibold rounded-xl hover:from-[#7a3d7a] hover:to-[#934790] focus:outline-none focus:ring-4 focus:ring-[#934790]/20 transition-all shadow-lg">Next: Choose Plans<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button></div>

            {/* Add / Edit Dependent Modal */}
            <AddDependentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveDependent} relationOptions={relationOptions} familyDefNormalized={familyDefNormalized} dependents={dependents} initialData={editInitialData} />
        </div>
    );
}
