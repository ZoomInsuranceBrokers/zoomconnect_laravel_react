import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import {
    ArrowLeftIcon,
    UserPlusIcon,
    DocumentTextIcon,
    XCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";

export default function NaturalAddition({ employee, policy }) {
    const [showModal, setShowModal] = useState(false);
    const [naturalAdditionForm, setNaturalAdditionForm] = useState({
        dependent_name: '',
        dependent_relation: '',
        dependent_gender: '',
        dependent_dob: '',
        date_of_event: '',
        document: null
    });
    const [naturalAdditionList, setNaturalAdditionList] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);

    useEffect(() => {
        fetchNaturalAdditionList();
    }, []);

    const fetchNaturalAdditionList = async () => {
        setLoadingList(true);
        try {
            const response = await fetch(`/employee/natural-addition/list/${policy.id}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                }
            });

            const result = await response.json();
            if (result.success) {
                setNaturalAdditionList(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch natural additions:', error);
        } finally {
            setLoadingList(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!naturalAdditionForm.document && !editingRequest) {
            alert('Please upload supporting document (PDF)');
            return;
        }

        setSubmitting(true);

        try {
            let documentBase64 = null;
            
            if (naturalAdditionForm.document) {
                const reader = new FileReader();
                documentBase64 = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(naturalAdditionForm.document);
                });
            }

            const payload = {
                dependent_name: naturalAdditionForm.dependent_name,
                dependent_relation: naturalAdditionForm.dependent_relation,
                dependent_gender: naturalAdditionForm.dependent_gender,
                dependent_dob: naturalAdditionForm.dependent_dob,
                date_of_event: naturalAdditionForm.date_of_event || naturalAdditionForm.dependent_dob,
                policy_id: policy.id
            };

            if (documentBase64) {
                payload.document = documentBase64;
            }

            const endpoint = editingRequest
                ? '/employee/natural-addition/update'
                : '/employee/natural-addition/store';

            if (editingRequest) {
                payload.id = editingRequest.id;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message || 'Request submitted successfully!');
                setShowModal(false);
                setNaturalAdditionForm({
                    dependent_name: '',
                    dependent_relation: '',
                    dependent_gender: '',
                    dependent_dob: '',
                    date_of_event: '',
                    document: null
                });
                setEditingRequest(null);
                fetchNaturalAdditionList();
            } else {
                alert(result.message || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Failed to submit natural addition:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (request) => {
        setEditingRequest(request);
        setNaturalAdditionForm({
            dependent_name: request.insured_name,
            dependent_relation: request.relation,
            dependent_gender: request.gender,
            dependent_dob: request.dob,
            date_of_event: request.date_of_event || '',
            document: null
        });
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            '0': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: ClockIcon },
            'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: ClockIcon },
            '1': { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircleIcon },
            'approved': { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircleIcon },
            'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircleIcon }
        };
        const statusInfo = statusMap[status] || statusMap['0'];
        const Icon = statusInfo.icon;
        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusInfo.color}`}>
                <Icon className="w-4 h-4" />
                {statusInfo.label}
            </span>
        );
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Natural Addition" />

            <div className="flex-1 overflow-y-auto px-2 sm:px-6 md:px-8 py-4 sm:py-8 scrollbar-hide rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 mt-2 sm:mt-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => window.history.back()}
                                className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white shadow flex items-center justify-center flex-shrink-0"
                            >
                                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                            </button>
                            <div>
                                <h1 className="text-base sm:text-2xl font-bold text-gray-900">
                                    Natural Addition
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Add newly married spouse or newborn child to {policy.policy_name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setEditingRequest(null);
                                setNaturalAdditionForm({
                                    dependent_name: '',
                                    dependent_relation: '',
                                    dependent_gender: '',
                                    dependent_dob: '',
                                    date_of_event: '',
                                    document: null
                                });
                                setShowModal(true);
                            }}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
                        >
                            <UserPlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            Add New Member
                        </button>
                    </div>

                    {/* Banner Card */}
                    <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                        {/* Animated background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/20 rounded-full -ml-24 -mb-24"></div>
                        
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                <ExclamationCircleIcon className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                    Natural Addition Policy
                                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">Important</span>
                                </h3>
                                <p className="text-sm text-purple-50 mb-3 leading-relaxed">
                                    You can add the following family members within <strong>30 days</strong> of the event:
                                </p>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3">
                                    <ul className="text-sm text-white space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-pink-200 font-bold">✓</span>
                                            <span>Newly married spouse (within 30 days of marriage)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-pink-200 font-bold">✓</span>
                                            <span>Newborn child (within 30 days of birth)</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex items-start gap-2 bg-purple-800/30 backdrop-blur-sm rounded-lg p-3">
                                    <DocumentTextIcon className="w-5 h-5 text-purple-200 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-purple-100">
                                        <strong>Required Documents:</strong> Marriage certificate (for spouse) or Birth certificate (for child) in PDF format
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <DocumentTextIcon className="w-5 h-5 text-purple-600" />
                            <h3 className="font-bold text-gray-900 text-lg">Your Requests</h3>
                        </div>

                        {loadingList ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3"></div>
                                <p className="text-sm text-gray-500">Loading requests...</p>
                            </div>
                        ) : naturalAdditionList.length > 0 ? (
                            <div className="space-y-4">
                                {naturalAdditionList.map((request, index) => (
                                    <div 
                                        key={request.id} 
                                        className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Decorative corner */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-bl-full opacity-50"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {request.insured_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg mb-0.5">{request.insured_name}</h4>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                                {request.relation}
                                                            </span>
                                                            <span className="text-gray-400">•</span>
                                                            <span>{request.gender}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>

                                            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 block">Date of Birth</span>
                                                            <span className="text-sm text-gray-900 font-medium">{new Date(request.dob).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 block">Event Date</span>
                                                            <span className="text-sm text-gray-900 font-medium">{new Date(request.date_of_event).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <ClockIcon className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 block">Submitted</span>
                                                            <span className="text-sm text-gray-900 font-medium">{new Date(request.created_at).toLocaleDateString('en-GB')}</span>
                                                        </div>
                                                    </div>
                                                    {request.document && (
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <DocumentTextIcon className="w-4 h-4 text-orange-600" />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-semibold text-gray-500 block">Document</span>
                                                                <span className="text-sm text-green-600 font-medium">✓ Attached</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {request.reason && request.status === 'rejected' && (
                                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg p-4 mb-3 animate-pulse">
                                                    <div className="flex items-start gap-2">
                                                        <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-red-900 mb-1">Reason for Rejection</p>
                                                            <p className="text-sm text-red-800">{request.reason}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {request.status === 'rejected' && (
                                                <button
                                                    onClick={() => handleEdit(request)}
                                                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                                                >
                                                    <DocumentTextIcon className="w-4 h-4" />
                                                    Edit & Resubmit Request
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserPlusIcon className="w-12 h-12 text-purple-600" />
                                </div>
                                <p className="text-lg font-bold text-gray-900 mb-2">No Requests Yet</p>
                                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                                    Click the "Add New Member" button above to submit your first natural addition request for your policy
                                </p>
                                <button
                                    onClick={() => {
                                        setEditingRequest(null);
                                        setNaturalAdditionForm({
                                            dependent_name: '',
                                            dependent_relation: '',
                                            dependent_gender: '',
                                            dependent_dob: '',
                                            date_of_event: '',
                                            document: null
                                        });
                                        setShowModal(true);
                                    }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <UserPlusIcon className="w-5 h-5" />
                                    Add First Member
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserPlusIcon className="w-8 h-8 text-white" />
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {editingRequest ? 'Edit Request' : 'Add New Member'}
                                        </h3>
                                        <p className="text-purple-100 text-sm">Fill in member details below</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-4 flex items-start gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-yellow-900 mb-1">Important Notice</p>
                                    <p className="text-xs text-yellow-800">
                                        Request must be submitted within 30 days of marriage (spouse) or birth (child).
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Member Name *
                                </label>
                                <input
                                    type="text"
                                    value={naturalAdditionForm.dependent_name}
                                    onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_name: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Relation *
                                    </label>
                                    <select
                                        value={naturalAdditionForm.dependent_relation}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_relation: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300 bg-white"
                                        required
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="SPOUSE">Spouse</option>
                                        <option value="CHILD">Child</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Gender *
                                    </label>
                                    <select
                                        value={naturalAdditionForm.dependent_gender}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_gender: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300 bg-white"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        value={naturalAdditionForm.dependent_dob}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_dob: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                                        required
                                    />
                                </div>

                                {naturalAdditionForm.dependent_relation === 'SPOUSE' && (
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            Date of Marriage *
                                        </label>
                                        <input
                                            type="date"
                                            value={naturalAdditionForm.date_of_event}
                                            onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, date_of_event: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                                    Supporting Document (PDF) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, document: e.target.files[0] })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-700 hover:file:to-pink-700 file:transition-all file:cursor-pointer"
                                        required={!editingRequest}
                                    />
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3 mt-2">
                                    <p className="text-xs text-blue-800 flex items-start gap-2">
                                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Upload marriage certificate (for spouse) or birth certificate (for child)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-5 h-5" />
                                            <span>{editingRequest ? 'Update Request' : 'Submit Request'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}
