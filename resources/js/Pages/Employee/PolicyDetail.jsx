import React, { useState, useEffect } from "react";
import { Head } from '@inertiajs/react';
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import {
    ArrowLeftIcon,
    InformationCircleIcon,
    XCircleIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    CheckBadgeIcon,
    ClockIcon,
    PhoneIcon,
    EnvelopeIcon,
    UserGroupIcon,
    ArrowDownTrayIcon,
    UserPlusIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";

export default function PolicyDetail({ employee, policyDetails }) {
    const {
        policy,
        insurance_company,
        tpa_company,
        tpa_data,
        dependents,
        cover_summary,
        policy_features,
        escalation_matrix,
    } = policyDetails;

    const [activeTab, setActiveTab] = useState("details");
    const [showExclusions, setShowExclusions] = useState(false);
    const [showEscalationDrawer, setShowEscalationDrawer] = useState(false);
    const [downloadingECard, setDownloadingECard] = useState(false);
    const [activeMember, setActiveMember] = useState(
        dependents && dependents.length ? dependents[0] : null
    );

    // Natural Addition states
    const [showNaturalAdditionModal, setShowNaturalAdditionModal] = useState(false);
    const [naturalAdditionForm, setNaturalAdditionForm] = useState({
        dependent_name: '',
        dependent_relation: '',
        dependent_gender: '',
        dependent_dob: '',
        date_of_event: '',
        document: null
    });
    const [naturalAdditionList, setNaturalAdditionList] = useState([]);
    const [loadingNaturalAdditions, setLoadingNaturalAdditions] = useState(false);
    const [submittingNaturalAddition, setSubmittingNaturalAddition] = useState(false);
    const [editingNaturalAddition, setEditingNaturalAddition] = useState(null);

    useEffect(() => {
        // Debug: log escalation data (remove in production)
        if (typeof escalation_matrix !== 'undefined') {
            console.debug('escalation_matrix', escalation_matrix);
        }

        // Fetch natural addition list
        if (policy?.natural_addition_allowed) {
            fetchNaturalAdditionList();
        }
    }, [escalation_matrix, policy]);

    const fetchNaturalAdditionList = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        setLoadingNaturalAdditions(true);
        try {
            const response = await fetch(`/api/v1/natural-addition/list?policy_id=${policy.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success && result.data) {
                setNaturalAdditionList(result.data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch natural additions:', error);
        } finally {
            setLoadingNaturalAdditions(false);
        }
    };

    const handleNaturalAdditionSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Please login to continue');
            return;
        }

        if (!naturalAdditionForm.document) {
            alert('Please upload supporting document (PDF)');
            return;
        }

        setSubmittingNaturalAddition(true);

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(naturalAdditionForm.document);
            reader.onload = async () => {
                const base64 = reader.result.split(',')[1];

                const payload = {
                    dependent_name: naturalAdditionForm.dependent_name,
                    dependent_relation: naturalAdditionForm.dependent_relation,
                    dependent_gender: naturalAdditionForm.dependent_gender,
                    dependent_dob: naturalAdditionForm.dependent_dob,
                    date_of_event: naturalAdditionForm.date_of_event || naturalAdditionForm.dependent_dob,
                    document: base64,
                    policy_id: policy.id
                };

                const endpoint = editingNaturalAddition
                    ? '/api/v1/natural-addition/edit'
                    : '/api/v1/natural-addition/';

                if (editingNaturalAddition) {
                    payload.id = editingNaturalAddition.id;
                }

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    alert(result.message || 'Request submitted successfully!');
                    setShowNaturalAdditionModal(false);
                    setNaturalAdditionForm({
                        dependent_name: '',
                        dependent_relation: '',
                        dependent_gender: '',
                        dependent_dob: '',
                        date_of_event: '',
                        document: null
                    });
                    setEditingNaturalAddition(null);
                    fetchNaturalAdditionList();
                } else {
                    alert(result.message || 'Failed to submit request');
                }
            };
        } catch (error) {
            console.error('Failed to submit natural addition:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setSubmittingNaturalAddition(false);
        }
    };

    const handleEditNaturalAddition = (request) => {
        setEditingNaturalAddition(request);
        setNaturalAdditionForm({
            dependent_name: request.insured_name,
            dependent_relation: request.relation,
            dependent_gender: request.gender,
            dependent_dob: request.dob,
            date_of_event: request.date_of_event || '',
            document: null
        });
        setShowNaturalAdditionModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            '0': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            '1': { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
            'approved': { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' },
            'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' }
        };
        const statusInfo = statusMap[status] || statusMap['0'];
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleDownloadECard = async () => {
        if (!activeMember || !policy) {
            alert('Please select a member to download the health card.');
            return;
        }

        setDownloadingECard(true);

        try {
            const response = await fetch('/employee/download-ecard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    policy_id: policy.id,
                    uhid: activeMember.uhid,
                    dob: activeMember.dob
                }),
            });

            const result = await response.json();

            if (result.success) {
                if (result.url) {
                    // Open URL in new tab
                    window.open(result.url, '_blank');
                } else if (result.s3_url) {
                    // Open S3 URL in new tab
                    window.open(result.s3_url, '_blank');
                } else if (result.pdf) {
                    // Download base64 PDF
                    const linkSource = `data:application/pdf;base64,${result.pdf}`;
                    const downloadLink = document.createElement('a');
                    downloadLink.href = linkSource;
                    downloadLink.download = `health_card_${activeMember.insured_name || 'member'}.pdf`;
                    downloadLink.click();
                } else if (result.e_card_url) {
                    // Open e-card URL in new tab
                    window.open(result.e_card_url, '_blank');
                }
            } else {
                alert(result.message || 'Failed to download health card. Please try again.');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download health card. Please try again later.');
        } finally {
            setDownloadingECard(false);
        }
    };

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }) : "N/A";

    const getRelationIcon = (relation = "") => {
        const r = relation.toLowerCase();
        if (r.includes("self")) return "👤";
        if (r.includes("father")) return "👨";
        if (r.includes("mother")) return "👩";
        if (r.includes("spouse")) return "💑";
        if (r.includes("child")) return "👶";
        return "👤";
    };

    const getCoverageIcon = (text = "") => {
        const t = text.toLowerCase();
        if (t.includes("family")) return "👨‍👩‍👧‍👦";
        if (t.includes("hospital")) return "🏥";
        if (t.includes("maternity")) return "🤰";
        if (t.includes("ambulance")) return "🚑";
        if (t.includes("day")) return "🕒";
        if (t.includes("check")) return "🩺";
        if (t.includes("medicine")) return "💊";
        return "✔️";
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Policy Details" />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    
                    {/* HEADER NAVIGATION */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
                        <button
                            onClick={() => router.visit("/employee/policy")}
                            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all w-fit"
                        >
                            <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg " />
                            <span className="font-semibold text-xs sm:text-base">Corporate Health Insurance</span>
                        </button>

                        <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row w-full sm:w-auto">
                            {/* Escalation Button */}
                            <button
                                onClick={() => setShowEscalationDrawer(true)}
                                className="relative flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto"
                            >
                                <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">Connect with claim representative</span>
                                <span className="sm:hidden">Connect</span>
                                {escalation_matrix && escalation_matrix.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{escalation_matrix.length}</span>
                                )}
                            </button>

                            {/* Network Hospitals Button */}
                            {policy.policy_type === 'gmi' && (
                                <button
                                    onClick={() => router.visit(`/employee/network-hospitals/${btoa(policy.id)}`)}
                                    className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm w-full sm:w-auto"
                                >
                                    <GlobeAltIcon className="w-4 h-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">Find Network Hospitals</span>
                                    <span className="sm:hidden">Hospitals</span>
                                </button>
                            )}

                            {/* Add Natural Addition Button */}
                           

                            {/* Tab Buttons */}
                            <div className="flex bg-white p-1 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 w-full sm:w-auto">
                                {["details", "coverages"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-xs font-bold transition-all ${
                                            activeTab === tab
                                                ? "bg-purple-600 text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {tab === "details" ? "Details" : "Coverages"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                        
                        {/* LEFT SIDE: MAIN CONTENT */}
                        <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-6">
                            
                            {/* POLICY CARD - Blue gradient style (sticky on large screens). Show only on Details tab */}
                            {activeTab === 'details' && (
                                <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-6 shadow-xl border border-blue-200  lg:z-20">
                                {/* Decorative SVG patterns */}
                                <svg className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 -mr-20 sm:-mr-32 -mt-20 sm:-mt-32 text-blue-200 opacity-30" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-89.7,-4.9C-87.6,-20,-81,-34,-71.8,-46.2C-62.6,-58.4,-50.8,-68.8,-37.4,-76.4C-24,-84,-12,-88.8,1.6,-91.5C15.2,-94.2,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                                </svg>
                                <svg className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 -ml-16 sm:-ml-24 -mb-16 sm:-mb-24 text-blue-300 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M39.5,-66.3C51.4,-58.5,61.4,-48.3,68.2,-36.2C75,-24.1,78.6,-10.1,77.8,3.5C77,17.1,71.8,30.3,63.9,41.8C56,53.3,45.4,63.1,33.1,68.6C20.8,74.1,6.8,75.3,-6.9,74.4C-20.6,73.5,-34,70.5,-46.3,64.8C-58.6,59.1,-69.8,50.7,-76.6,39.4C-83.4,28.1,-85.8,14,-84.1,0.7C-82.4,-12.6,-76.6,-25.2,-68.5,-36.2C-60.4,-47.2,-50,-56.6,-38.1,-64.4C-26.2,-72.2,-13.1,-78.4,0.3,-78.9C13.7,-79.4,27.6,-74.1,39.5,-66.3Z" transform="translate(100 100)" />
                                </svg>
                                
                                <div className="relative z-10">
                                    <div className="flex flex-col justify-between items-start gap-3 mb-4 sm:mb-6">
                                        <div className="space-y-2 sm:space-y-3 w-full">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {policy.policy_type || "Health Insurance"}
                                                </span>
                                                <span className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[9px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5">
                                                    <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                        <circle cx="10" cy="10" r="4" />
                                                    </svg>
                                                    Active
                                                </span>
                                            </div>
                                            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
                                                {policy.policy_name || policy.corporate_policy_name}
                                            </h2>
                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <p className="text-blue-700 flex items-center gap-1.5 text-xs md:text-sm font-semibold leading-tight md:leading-relaxed">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {insurance_company.name}
                                                </p>
                                                {insurance_company.logo && (
                                                    <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-lg border border-blue-200 flex-shrink-0">
                                                        <img
                                                            src={`/${insurance_company.logo}`}
                                                            className="h-5 sm:h-6 w-auto object-contain"
                                                            alt="Provider"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-blue-200">
                                        <StatBlock label="Sum Insured" value={cover_summary} isHtml />
                                        {/* <StatBlock label="Start Date" value={formatDate(policy.policy_start_date)} /> */}
                                        <StatBlock label="Expiry Date" value={formatDate(policy.policy_end_date)} />
                                        <div className="col-span-2 sm:col-span-4">
                                            <StatBlock label="Policy No." value={policy.policy_number} />
                                        </div>
                                    </div>
                                </div>
                                </div>
                            )}

                            {/* MOBILE BENEFICIARIES - Show only on mobile, after policy card */}
                            {activeTab === 'details' && (
                                <div className="lg:hidden">
                                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-200">
                                        <div className="flex items-center justify-between mb-4 pb-3 sm:mb-5 sm:pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">Beneficiaries</h3>
                                            </div>
                                            {policy.natural_addition_allowed && policy.policy_type === 'gmi' && (
                                                <div className="relative group">
                                                    <button
                                                        onClick={() => router.visit(`/employee/natural-addition/${btoa(policy.id)}`)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md text-[10px] font-semibold"
                                                    >
                                                        <UserPlusIcon className="w-3 h-3" />
                                                        Add Event
                                                    </button>
                                                    {/* Tooltip */}
                                                    <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                        <div className="font-semibold mb-1">Natural Addition</div>
                                                        <p className="text-gray-300 leading-relaxed">Add your newly married spouse or newborn child to the policy within 30 days of the event.</p>
                                                        {/* Arrow */}
                                                        <div className="absolute right-4 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 max-h-[200px] sm:max-h-none overflow-auto scrollbar-hide">
                                            {dependents?.map((member, index) => {
                                                const isActive = activeMember?.uhid === member.uhid;
                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => setActiveMember(member)}
                                                        className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                                                            isActive ? 
                                                                "bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-100/40 hover:to-pink-100/40 border border-purple-100/20" : 
                                                                "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        <div className={`w-7 sm:w-9 h-7 sm:h-9 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0 ${
                                                            isActive ? "bg-white/20" : "bg-white shadow-sm"
                                                        }`}>
                                                            {getRelationIcon(member.relation)}
                                                        </div>
                                                        <div className="flex-1 text-left min-w-0">
                                                            <p className="font-bold text-xs leading-tight line-clamp-1">{member.insured_name}</p>
                                                            <p className={`text-[8px] sm:text-[9px] uppercase font-medium tracking-wider line-clamp-1 ${
                                                                isActive ? "text-white/80" : "text-gray-500"
                                                            }`}>
                                                                {member.relation}
                                                            </p>
                                                        </div>
                                                        {isActive && <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {activeMember && (
                                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden mt-4 sm:mt-5">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                                                <div className="relative z-10">
                                                    <h4 className="font-bold text-white/80 text-[8px] sm:text-[9px] uppercase tracking-widest mb-3 sm:mb-4">Member Details</h4>
                                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                        <DetailItemDark label="Gender" value={activeMember.gender} />
                                                        <DetailItemDark label="DOB" value={formatDate(activeMember.dob)} />
                                                        <DetailItemDark label="Member ID" value={activeMember.uhid || "PENDING"} />
                                                        <DetailItemDark label="Status" value="Active" />
                                                    </div>
                                                    
                                                    {/* Download Health Card Button */}
                                                    {policy.policy_type === 'gmi' && (
                                                        <button
                                                            onClick={handleDownloadECard}
                                                            disabled={downloadingECard}
                                                            className="w-full mt-3 sm:mt-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm text-xs sm:text-sm"
                                                        >
                                                            <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            {downloadingECard ? 'Downloading...' : 'Download Health Card'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {policy.policy_type === 'gmi' && (
                                            <button
                                                onClick={() => router.visit('/employee/claims')}
                                                className="w-full mt-3 sm:mt-4 bg-white text-purple-600 hover:bg-purple-50 border border-purple-200 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm"
                                            >
                                                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Claim Insurance
                                            </button>
                                        )}


                                    </div>
                                </div>
                            )}

                            {activeTab === "details" ? (
                                <div className="space-y-4">
                                    {/* Section separator with title */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support & Timeline</span>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-4">
                                    <DetailSectionCard 
                                        title="TPA Support" 
                                        icon={<GlobeAltIcon className="w-4 h-4 text-purple-600"/>}
                                    >
                                        <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-purple-600 shadow-sm">
                                                {tpa_company?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs md:text-sm font-bold text-gray-900 leading-none mb-1">{tpa_company?.name || "N/A"}</p>
                                                <p className="text-[10px] text-gray-500">Claims Administrator</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <ContactLink icon={<PhoneIcon/>} label="Helpline" value={tpa_data?.helpline || "1800-XXX-XXXX"} />
                                            <ContactLink icon={<EnvelopeIcon/>} label="Email" value={tpa_data?.email || "support@tpa.com"} />
                                        </div>
                                    </DetailSectionCard>

                                    <DetailSectionCard 
                                        title="Timeline" 
                                        icon={<ClockIcon className="w-4 h-4 text-orange-600"/>}
                                    >
                                        <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-5 my-2 ml-2">
                                            <TimelinePoint label="Policy Created" date={formatDate(policy.policy_start_date)} color="bg-green-500" />
                                            <TimelinePoint label="Current Period" date="Active Coverage" color="bg-purple-600" active />
                                            <TimelinePoint label="Renewal Due" date={formatDate(policy.policy_end_date)} color="bg-gray-300" />
                                        </div>
                                    </DetailSectionCard>
                                </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-4 sm:p-6 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-sm sm:text-base lg:text-base font-bold text-gray-900 mb-1">
                                                    {!showExclusions ? 
                                                        `${policy_features?.inclusion?.length || 0} Coverages Included` : 
                                                        `${policy_features?.exclusion?.length || 0} Exclusions`
                                                    }
                                                </h3>
                                                <p className="text-xs text-gray-600 line-clamp-2">
                                                    {!showExclusions ? "Benefits covered under your policy" : "Conditions not covered"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowExclusions(!showExclusions)}
                                                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
                                                    showExclusions ? 
                                                        "bg-green-100 text-green-700 hover:bg-green-200" : 
                                                        "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            >
                                                {showExclusions ? "✓ Show Inclusions" : "✕ Show Exclusions"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 lg:p-6 mt-4 max-h-[300px] sm:max-h-none lg:max-h-[600px] overflow-auto lg:overflow-y-auto scrollbar-hide relative z-10">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-3">
                                            {(!showExclusions ? policy_features?.inclusion : policy_features?.exclusion)?.map((item, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`flex gap-2 sm:gap-3 lg:gap-3 p-3 sm:p-4 lg:p-4 rounded-xl sm:rounded-2xl border transition-all hover:shadow-md ${
                                                        showExclusions ? 
                                                            "bg-red-50/50 border-red-100 hover:bg-red-50" : 
                                                            "bg-green-50/50 border-green-100 hover:bg-green-50"
                                                    }`}
                                                >
                                                    <div className={`w-8 sm:w-10 lg:w-10 h-8 sm:h-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-sm ${
                                                        showExclusions ? "bg-white" : "bg-white"
                                                    }`}>
                                                        {showExclusions ? 
                                                            <XCircleIcon className="w-6 h-6 text-red-500"/> : 
                                                            <span className="text-xl">{getCoverageIcon(item.feature_title)}</span>
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 text-xs sm:text-sm lg:text-sm mb-0.5 sm:mb-1 leading-tight line-clamp-2">{item.feature_title}</p>
                                                        <p className="text-xs text-gray-600 leading-snug line-clamp-2">{item.feature_desc || "Standard policy terms apply."}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>

                        {/* RIGHT SIDE: BENEFICIARIES */}
                        <div className="lg:col-span-4 hidden lg:block">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-5 shadow-sm border border-gray-200 lg:sticky lg:top-6">
                                <div className="flex items-center justify-between mb-4 pb-3 sm:mb-5 sm:pb-4 lg:pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-base">Beneficiaries</h3>
                                    </div>
                                    {policy.natural_addition_allowed && policy.policy_type === 'gmi' && (
                                        <div className="relative group">
                                            <button
                                                onClick={() => router.visit(`/employee/natural-addition/${btoa(policy.id)}`)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md text-xs font-semibold"
                                            >
                                                <UserPlusIcon className="w-4 h-4" />
                                                Add Event
                                            </button>
                                            {/* Tooltip */}
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="font-semibold mb-1">Natural Addition</div>
                                                <p className="text-gray-300 leading-relaxed">Add your newly married spouse or newborn child to the policy within 30 days of the event.</p>
                                                {/* Arrow */}
                                                <div className="absolute right-4 -top-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5 sm:space-y-2 lg:space-y-2 mb-4 sm:mb-5 lg:mb-5 max-h-[200px] sm:max-h-none lg:max-h-[300px] overflow-auto lg:overflow-y-auto scrollbar-hide">
                                    {dependents?.map((member, index) => {
                                        const isActive = activeMember?.uhid === member.uhid;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setActiveMember(member)}
                                                className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
                                                    isActive ? 
                                                        "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : 
                                                        "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                }`}
                                            >
                                                <div className={`w-7 sm:w-9 h-7 sm:h-9 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0 ${
                                                    isActive ? "bg-white/20" : "bg-white shadow-sm"
                                                }`}>
                                                    {getRelationIcon(member.relation)}
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <p className="font-bold text-xs leading-tight line-clamp-1">{member.insured_name}</p>
                                                    <p className={`text-[8px] sm:text-[9px] uppercase font-medium tracking-wider line-clamp-1 ${
                                                        isActive ? "text-white/80" : "text-gray-500"
                                                    }`}>
                                                        {member.relation}
                                                    </p>
                                                </div>
                                                {isActive && <CheckBadgeIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {activeMember && (
                                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-5 text-white relative overflow-hidden mt-4 sm:mt-5">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                                        <div className="relative z-10">
                                            <h4 className="font-bold text-white/80 text-[8px] sm:text-[9px] uppercase tracking-widest mb-3 sm:mb-4 lg:mb-4">Member Details</h4>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-3">
                                                <DetailItemDark label="Gender" value={activeMember.gender} />
                                                <DetailItemDark label="DOB" value={formatDate(activeMember.dob)} />
                                                <DetailItemDark label="Member ID" value={activeMember.uhid || "PENDING"} />
                                                <DetailItemDark label="Status" value="Active" />
                                            </div>
                                            
                                            {/* Download Health Card Button */}
                                            {policy.policy_type === 'gmi' && (
                                                <button
                                                    onClick={handleDownloadECard}
                                                    disabled={downloadingECard}
                                                    className="w-full mt-3 sm:mt-4 lg:mt-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm text-xs sm:text-sm"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    {downloadingECard ? 'Downloading...' : 'Download Health Card'}
                                                </button>
                                            )}
                                        </div>
                                         
                                    </div>
                                )}
                                {policy.policy_type === 'gmi' && (
                                    <button
                                        onClick={() => router.visit('/employee/claims')}
                                        className="w-full mt-3 sm:mt-4 lg:mt-4 bg-white text-purple-600 hover:bg-purple-50 border border-purple-200 font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
                                    >
                                        <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Claim Insurance
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Escalation Drawer - Right Side Slide-in */}
                {showEscalationDrawer && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                            onClick={() => setShowEscalationDrawer(false)}
                        ></div>

                        {/* Drawer */}
                        <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto scrollbar-hide animate-slide-in-right max-w-[90vw] sm:max-w-96 lg:max-w-96">
                            <div className="p-4 sm:p-6 lg:p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-6 pb-3 sm:pb-4 lg:pb-4 border-b border-gray-200">
                                    <div className="flex-1 pr-3">
                                        <h3 className="text-base sm:text-lg lg:text-lg font-bold text-gray-900">Claim Representatives</h3>
                                        <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 lg:mt-1">Connect with escalation team</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEscalationDrawer(false)}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                                    >
                                        <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Escalation Cards */}
                                <div className="space-y-3 sm:space-y-4 lg:space-y-4">
                                        {escalation_matrix && escalation_matrix.length > 0 ? (
                                        escalation_matrix.map((item, index) => (
                                            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200">
                                                {/* Level 1 Contact (fallback to ID if details missing) */}
                                                {item.claim_level_1 ? (
                                                    (() => {
                                                        const u = item.claim_level_1;
                                                        const name = u.full_name || u.name || u.user_name || 'N/A';
                                                        const email = u.email_id || u.email || '';
                                                        const mobile = u.mobile || u.phone || '';
                                                        const department = u.department || u.dept || null;
                                                        const matrix = u.matrix || u.matrix_name || null;
                                                        return (
                                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                                                                        {String(name).charAt(0) || 'L'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-900">{name}</p>
                                                                        <p className="text-[10px] text-purple-600 font-medium">Level 1 Representative</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 ml-13">
                                                                    {email && (
                                                                        <div className="flex items-center gap-2">
                                                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{email}</span>
                                                                        </div>
                                                                    )}
                                                                    {mobile && (
                                                                        <div className="flex items-center gap-2">
                                                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{mobile}</span>
                                                                        </div>
                                                                    )}
                                                                    {department && (
                                                                        <div className="flex items-center gap-2">
                                                                            <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{department}</span>
                                                                        </div>
                                                                    )}
                                                                    {matrix && (
                                                                        <div className="flex items-center gap-2">
                                                                            <ClockIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{matrix}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    item.claim_level_1_id ? (
                                                        <div className="mb-4 pb-4 border-b border-gray-200">
                                                            <p className="text-xs font-semibold text-gray-500">Level 1 Representative</p>
                                                            <p className="text-sm text-gray-700">ID: {item.claim_level_1_id} — details not found</p>
                                                        </div>
                                                    ) : null
                                                )}

                                                {/* Level 2 Contact (fallback to ID if details missing) */}
                                                {item.claim_level_2 ? (
                                                    (() => {
                                                        const u = item.claim_level_2;
                                                        const name = u.full_name || u.name || u.user_name || 'N/A';
                                                        const email = u.email_id || u.email || '';
                                                        const mobile = u.mobile || u.phone || '';
                                                        const department = u.department || u.dept || null;
                                                        const matrix = u.matrix || u.matrix_name || null;
                                                        return (
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                                                                        {String(name).charAt(0) || 'L'}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-gray-900">{name}</p>
                                                                        <p className="text-[10px] text-blue-600 font-medium">Level 2 Representative</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 ml-13">
                                                                    {email && (
                                                                        <div className="flex items-center gap-2">
                                                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{email}</span>
                                                                        </div>
                                                                    )}
                                                                    {mobile && (
                                                                        <div className="flex items-center gap-2">
                                                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{mobile}</span>
                                                                        </div>
                                                                    )}
                                                                    {department && (
                                                                        <div className="flex items-center gap-2">
                                                                            <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{department}</span>
                                                                        </div>
                                                                    )}
                                                                    {matrix && (
                                                                        <div className="flex items-center gap-2">
                                                                            <ClockIcon className="w-4 h-4 text-gray-400" />
                                                                            <span className="text-xs text-gray-700">{matrix}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                ) : (
                                                    item.claim_level_2_id ? (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-500">Level 2 Representative</p>
                                                            <p className="text-sm text-gray-700">ID: {item.claim_level_2_id} — details not found</p>
                                                        </div>
                                                    ) : null
                                                )}

                                                {/* When claim_level objects missing, prefer showing these fields if present */}
                                                {(!item.claim_level_1 && !item.claim_level_2) && (
                                                    (item.full_name || item.email_id || item.mobile || item.department || item.matrix) ? (
                                                        <div className="mt-3 text-xs text-gray-700 grid grid-cols-1 gap-2">
                                                            {item.full_name && (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-4">
                                                                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[11px] font-semibold text-gray-900">{item.full_name}</p>
                                                                        <p className="text-[10px] text-gray-500">Name</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.email_id && (
                                                                <div className="flex items-center gap-2">
                                                                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-semibold text-gray-900 break-words">{item.email_id}</p>
                                                                        <p className="text-[10px] text-gray-500">Email</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.mobile && (
                                                                <div className="flex items-center gap-2">
                                                                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                                    <div>
                                                                        <p className="text-[11px] font-semibold text-gray-900">{item.mobile}</p>
                                                                        <p className="text-[10px] text-gray-500">Mobile</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.department && (
                                                                <div className="flex items-center gap-2">
                                                                    <ShieldCheckIcon className="w-4 h-4 text-gray-400" />
                                                                    <div>
                                                                        <p className="text-[11px] font-semibold text-gray-900">{item.department}</p>
                                                                        <p className="text-[10px] text-gray-500">Department</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {item.matrix && (
                                                                <div className="flex items-center gap-2">
                                                                    <ClockIcon className="w-4 h-4 text-gray-400" />
                                                                    <div>
                                                                        <p className="text-[11px] font-semibold text-gray-900">{item.matrix}</p>
                                                                        <p className="text-[10px] text-gray-500">Matrix</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <details className="mt-3 text-xs text-gray-500">
                                                            <summary className="cursor-pointer text-xs text-gray-600">Raw item data</summary>
                                                            <pre className="whitespace-pre-wrap text-[11px] mt-2 bg-white p-2 rounded border border-gray-100 text-gray-700">{JSON.stringify(item, null, 2)}</pre>
                                                        </details>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <InformationCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">No escalation contacts available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Natural Addition Modal */}
            {showNaturalAdditionModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNaturalAdditionModal(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserPlusIcon className="w-8 h-8 text-white" />
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {editingNaturalAddition ? 'Edit Natural Addition' : 'Add New Member'}
                                        </h3>
                                        <p className="text-purple-100 text-sm">Add spouse or newborn child to policy</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowNaturalAdditionModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleNaturalAdditionSubmit} className="p-6 space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-yellow-800">
                                    <strong>Important:</strong> Natural addition can be done within 30 days of marriage (for spouse) or birth (for child).
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Member Name *</label>
                                <input
                                    type="text"
                                    value={naturalAdditionForm.dependent_name}
                                    onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Relation *</label>
                                    <select
                                        value={naturalAdditionForm.dependent_relation}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_relation: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="SPOUSE">Spouse</option>
                                        <option value="CHILD">Child</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                                    <select
                                        value={naturalAdditionForm.dependent_gender}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_gender: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={naturalAdditionForm.dependent_dob}
                                        onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, dependent_dob: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                {naturalAdditionForm.dependent_relation === 'SPOUSE' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Marriage *</label>
                                        <input
                                            type="date"
                                            value={naturalAdditionForm.date_of_event}
                                            onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, date_of_event: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Supporting Document (PDF) *</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setNaturalAdditionForm({ ...naturalAdditionForm, document: e.target.files[0] })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                    required={!editingNaturalAddition}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload marriage certificate (for spouse) or birth certificate (for child)
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={submittingNaturalAddition}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingNaturalAddition ? 'Submitting...' : editingNaturalAddition ? 'Update Request' : 'Submit Request'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNaturalAdditionModal(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}

/* REFINED SUB-COMPONENTS WITH SMALLER FONTS */

function StatBlock({ label, value, isHtml }) {
    return (
        <div className="space-y-0.5 sm:space-y-1">
            <p className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label}</p>
            {isHtml ? (
                <div className="text-xs sm:text-base font-bold text-gray-900 line-clamp-2" dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
                <p className="text-xs sm:text-base font-bold text-gray-900 break-words line-clamp-2">{value || "—"}</p>
            )}
        </div>
    );
}

function DetailSectionCard({ title, icon, children }) {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 lg:mb-4 pb-2 sm:pb-3 lg:pb-3 border-b border-gray-100">
                {icon}
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm lg:text-sm">{title}</h4>
            </div>
            {children}
        </div>
    );
}

function ContactLink({ icon, label, value }) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 lg:p-2 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors">
            <div className="text-gray-400 flex-shrink-0">
                {React.cloneElement(icon, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" })}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
            </div>
        </div>
    );
}

function TimelinePoint({ label, date, color, active }) {
    return (
        <div className="relative">
            <div className={`absolute -left-[29px] top-0.5 sm:top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-sm ${color} ${active ? 'ring-2 ring-purple-200' : ''}`}></div>
            <div>
                <p className={`text-xs font-bold ${active ? "text-purple-600" : "text-gray-900"}`}>{label}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium">{date}</p>
            </div>
        </div>
    );
}

function DetailItemDark({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-[8px] sm:text-[9px] text-white/60 font-bold uppercase mb-0.5 sm:mb-1 tracking-wider">{label}</p>
            <p className="text-xs font-bold text-white truncate">{value || "N/A"}</p>
        </div>
    );
}