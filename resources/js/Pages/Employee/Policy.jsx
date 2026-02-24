import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { ShieldCheckIcon, ChevronRightIcon, ChevronLeftIcon, PhoneIcon, ChatBubbleLeftRightIcon, HeartIcon, DocumentTextIcon, CreditCardIcon, BuildingOfficeIcon, BoltIcon } from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';

export default function Policy({ employee, policies = [], newPolicies = [] }) {
    const allPolicies = [...(newPolicies || []), ...(policies || [])];
    const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [queryForm, setQueryForm] = useState({ name: '', email: '', phone: '', message: '' });

    const getPolicyTypeName = (type) => {
        const types = {
            'gmi': 'GMC Policy',
            'gpa': 'GPA Policy',
            'gtl': 'GTL Policy'
        };
        return types[type] || 'Policy';
    };

    const getPolicyTypeShort = (type) => {
        const types = {
            'gmi': 'GMC',
            'gpa': 'GPA',
            'gtl': 'GTL'
        };
        return types[type] || type?.toUpperCase();
    };

    const nextPolicy = () => {
        setCurrentPolicyIndex((prev) => Math.min(prev + 1, allPolicies.length - 1));
    };

    const prevPolicy = () => {
        setCurrentPolicyIndex((prev) => Math.max(prev - 1, 0));
    };

    const quickServices = [
        {
            id: 'health-checkup',
            title: 'Health Checkup',
            subtitle: 'Book annual checkup',
            bg: 'from-blue-50 to-blue-100',
            hoverBg: 'from-blue-100 to-blue-200',
            icon: HeartIcon,
            color: 'text-blue-600'
        },
        {
            id: 'file-claim',
            title: 'File a Claim',
            subtitle: 'Submit claims easily',
            bg: 'from-emerald-50 to-green-100',
            hoverBg: 'from-emerald-100 to-green-200',
            icon: DocumentTextIcon,
            color: 'text-green-600'
        },
        {
            id: 'network-hospitals',
            title: 'Network Hospitals',
            subtitle: 'Find hospitals',
            bg: 'from-purple-50 to-purple-100',
            hoverBg: 'from-purple-100 to-purple-200',
            icon: ShieldCheckIcon,
            color: 'text-purple-600'
        }
    ];

    const [showNetworkModal, setShowNetworkModal] = useState(false);

    const handleQuickServiceClick = (serviceId) => {
        if (serviceId === 'health-checkup') {
            router.visit('/employee/wellness');
            return;
        }

        if (serviceId === 'file-claim') {
            router.visit('/employee/claims');
            return;
        }

        if (serviceId === 'network-hospitals') {
            // Show instruction modal that directs user to open policy details
            setShowNetworkModal(true);
            return;
        }
    };

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Policies" />
            {/* Top Day-like Header */}
            <div className="bg-white rounded-t-xl sm:rounded-t-2xl px-3 sm:px-6 py-2 sm:py-3 mt-2 sm:mt-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[rgb(147,71,144)] rounded-full"></span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">Policy Dashboard</span>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row overflow-hidden bg-white rounded-b-xl sm:rounded-b-2xl shadow-sm mb-4">
                {/* Left Section - Policy Cards (60%) */}
                <main className="w-full xl:w-[60%] overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-hide">
                    <div className="max-w-2xl">
                        {/* Header with SVG Icon */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[rgb(147,71,144)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">Active Policy Details</h2>
                                <p className="text-[10px] sm:text-xs text-gray-600">View and manage your insurance coverage</p>
                            </div>
                        </div>

                        {/* Policies Display */}
                        {allPolicies.length === 0 ? (
                            <div className="text-center py-4 sm:py-8">
                                <div className="mb-3 sm:mb-6">
                                    <img
                                        src="/assets/images/policynotfound.png"
                                        alt="No Policy Found"
                                        className="w-40 sm:w-56 md:w-64 mx-auto"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="hidden">
                                        <ShieldCheckIcon className="w-32 h-32 text-gray-300 mx-auto" />
                                    </div>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">No Active Policies Found</h3>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 max-w-lg mx-auto border border-purple-100">
                                    <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">
                                        <span className="font-semibold text-[rgb(147,71,144)]">Your policy may be under process.</span>
                                        <br />
                                        Please wait for a few days or contact your HR administration for assistance.
                                    </p>
                                    <button className="bg-[rgb(147,71,144)] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold hover:bg-[rgb(106,0,102)] transition-all shadow-md text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 mx-auto">
                                        <ChatBubbleLeftRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Help Banner */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[rgb(147,71,144)] rounded-full flex items-center justify-center flex-shrink-0">
                                            <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800">Can't find your policy details or health card?</p>
                                            <p className="text-[10px] sm:text-xs text-gray-600">We're here to help you</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowHelpModal(true)}
                                        className="bg-[rgb(147,71,144)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-[rgb(106,0,102)] transition-all whitespace-nowrap w-full sm:w-auto"
                                    >
                                        Contact Us
                                    </button>
                                </div>

                                {/* Stacked Carousel */}
                                <div className="relative flex items-center justify-center my-6 h-auto min-h-[240px] sm:h-64">
                                    {/* Cards Stack */}
                                    <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
                                        {allPolicies.map((policy, index) => {
                                            const offset = index - currentPolicyIndex;
                                            const isActive = index === currentPolicyIndex;
                                            const isNext = index === currentPolicyIndex + 1;
                                            const isPrev = index === currentPolicyIndex - 1;

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setCurrentPolicyIndex(index)}
                                                    className={`absolute transition-all duration-500 ease-out cursor-pointer ${isActive
                                                            ? 'z-30 scale-100 opacity-100'
                                                            : isNext
                                                                ? 'z-20 scale-95 opacity-60 translate-x-12'
                                                                : isPrev
                                                                    ? 'z-20 scale-95 opacity-60 -translate-x-12'
                                                                    : 'z-10 scale-90 opacity-0'
                                                        }`}
                                                    style={{
                                                        transform: isActive ? 'translateX(0) scale(1)' :
                                                            isNext ? 'translateX(25px) scale(0.95)' :
                                                                isPrev ? 'translateX(-32px) scale(0.95)' :
                                                                    'translateX(0) scale(0.9)'
                                                    }}
                                                >
                                                    <div className="w-[78vw] sm:w-96 md:w-[28rem] lg:w-[32rem] bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 0px 10px -5px rgba(0, 0, 0, 0.1)' }}>
                                                        {/* Header */}
                                                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                                                            <span className="text-[10px] sm:text-xs font-bold text-white bg-[rgb(147,71,144)] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                                {getPolicyTypeShort(policy.policy_type)}
                                                            </span>
                                                        </div>

                                                        {/* Policy Name */}
                                                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-4">{policy.policy_name || getPolicyTypeName(policy.policy_type)}</h3>

                                                        {/* Base SI and Policy No */}
                                                        <div className="flex gap-2 sm:gap-4 mb-2 sm:mb-4">
                                                            <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase mb-0.5 sm:mb-1">Base SI</p>
                                                                <p className="text-xs sm:text-sm font-bold text-gray-800">{policy.cover_string || '—'}</p>
                                                            </div>
                                                            <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase mb-0.5 sm:mb-1">Policy No</p>
                                                                <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">{policy.policy_number}</p>
                                                            </div>
                                                        </div>

                                                        {/* Insured By */}
                                                        <div className="text-[9px] sm:text-xs text-gray-500 mb-2 sm:mb-4">
                                                            Insured by <span className="font-semibold text-gray-800">{policy.insurance_company_name}</span>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    const encodedId = btoa(policy.id.toString());
                                                                    router.visit(`/employee/policy/${encodedId}`);
                                                                }}
                                                                className="bg-[rgb(147,71,144)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-[rgb(106,0,102)] transition-all"
                                                            >
                                                                View Details
                                                            </button>
                                                            {policy.policy_type === 'gmi' && (
                                                                <div className="relative group">
                                                                    <button
                                                                        onClick={() => {
                                                                            const encodedId = btoa(policy.id.toString());
                                                                            router.visit(`/employee/policy/${encodedId}`);
                                                                        }}
                                                                        className="bg-white text-[rgb(147,71,144)] p-1.5 sm:p-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                                                                        title="View Details"
                                                                    >
                                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                                        Download your health card
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {allPolicies.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevPolicy}
                                                disabled={currentPolicyIndex === 0}
                                                className={`absolute left-1 sm:left-4 z-40 w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${currentPolicyIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[rgb(147,71,144)] hover:text-white'}`}
                                            >
                                                <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            </button>
                                            <button
                                                onClick={nextPolicy}
                                                disabled={currentPolicyIndex === allPolicies.length - 1}
                                                className={`absolute right-1 sm:right-4 z-40 w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${currentPolicyIndex === allPolicies.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[rgb(147,71,144)] hover:text-white'}`}
                                            >
                                                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Policy Count Indicator */}
                                {allPolicies.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4">
                                        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-200">
                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[rgb(147,71,144)]" />
                                                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                                                    Policy {currentPolicyIndex + 1} of {allPolicies.length}
                                                </span>
                                            </div>
                                            <span className="text-[9px] sm:text-xs text-gray-500 hidden md:inline">→ Swipe or use arrows to view more</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Services (40%) */}
                <aside className="w-full xl:w-[40%] border-t xl:border-t-0 xl:border-l border-gray-100 overflow-y-auto scrollbar-hide">
                    <div className="p-3 sm:p-5">
                        {/* Talk to Doctor Banner */}
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 md:p-7 mb-4 shadow-md relative overflow-hidden max-w-sm mx-auto">
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-1 sm:mb-2">
                                    <h3 className="text-white text-sm sm:text-base font-bold">Talk to Doctor</h3>
                                    <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <span className="text-white text-[10px] sm:text-xs font-bold">40% OFF</span>
                                    </div>
                                </div>
                                <p className="text-purple-50 text-[10px] sm:text-xs mb-2 sm:mb-3">
                                    Connect with specialists instantly
                                </p>
                                <button className="bg-white text-[rgb(147,71,144)] px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-sm text-[10px] sm:text-xs flex items-center gap-2">
                                    <PhoneIcon className="w-3 h-3" />
                                    Book Now
                                </button>
                            </div>
                            <div className="absolute -right-6 -bottom-6 opacity-10">
                                <svg className="w-28 h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                                </svg>
                            </div>
                        </div>

                        {/* Quick Services */}
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wide">Quick Services</h4>

                            <div className="space-y-2">
                                {quickServices.map((service) => {
                                    const IconComponent = service.icon;
                                    return (
                                        <div key={service.id} onClick={() => handleQuickServiceClick(service.id)} className={`relative group overflow-hidden bg-gradient-to-br ${service.bg} rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm transition transform duration-300 ease-out hover:shadow-md hover:scale-105 hover:-translate-y-1 cursor-pointer w-full flex items-center gap-3 sm:gap-4`} style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                                            {/* Hover Background Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${service.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                                            
                                            <span className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/0 dark:from-white/10 dark:to-white/0 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 pointer-events-none" />
                                            <div className="relative z-10 flex items-center gap-3 sm:gap-4 w-full">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 rounded-lg sm:rounded-xl flex items-center justify-center p-1 shadow-sm flex-shrink-0">
                                                    <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${service.color}`} strokeWidth={2} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight">{service.title}</h5>
                                                    <p className="text-[10px] sm:text-xs text-gray-600 leading-tight">{service.subtitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Network instruction modal */}
                                {showNetworkModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                        <div className="absolute inset-0 bg-black/40" onClick={() => setShowNetworkModal(false)} />
                                        <div className="relative bg-white rounded-xl shadow-lg p-4 max-w-lg w-full">
                                            <h3 className="font-bold text-lg mb-2">Find Network Hospitals</h3>
                                            <p className="text-sm text-gray-700 mb-4">To search network hospitals for a policy, open the policy details and click the "Find Network Hospitals" button.</p>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setShowNetworkModal(false)} className="px-3 py-2 rounded-lg bg-gray-100">Close</button>
                                                <button onClick={() => { setShowNetworkModal(false); router.visit('/employee/policy'); }} className="px-3 py-2 rounded-lg bg-[rgb(147,71,144)] text-white">Open Policies</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Need Help Section */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                            <h4 className="font-bold text-gray-800 mb-2 text-sm">Need Help?</h4>
                            <p className="text-xs text-gray-600 mb-3">
                                Our support team is here to assist you
                            </p>
                            <button onClick={() => router.visit('/employee/help')} className="w-auto px-4 py-2 bg-[rgb(147,71,144)] text-white rounded-xl font-semibold hover:bg-[rgb(106,0,102)] transition-all text-xs inline-flex items-center justify-center">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Help Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setShowHelpModal(false)}>
                    <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[rgb(147,71,144)] to-purple-600 p-3 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">Need Help?</h3>
                                        <p className="text-purple-100 text-xs sm:text-sm">We're here to assist you</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowHelpModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition-all"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-3 sm:p-6">
                            {/* Instructions Section */}
                            <div className="mb-3 sm:mb-6">
                                <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] sm:text-xs font-bold text-[rgb(147,71,144)]">1</span>
                                    </div>
                                    How to View Policy Details
                                </h4>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100 mb-3 sm:mb-4 overflow-hidden">
                                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Click on the <strong>"View Details"</strong> button on any policy card to see complete coverage information</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Use the arrow buttons or click on cards</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Policy details include sum insured, policy number, and insurance company information</span>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-4 flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-6">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] sm:text-xs font-bold text-[rgb(147,71,144)]">2</span>
                                    </div>
                                    Download Health Card (GMC Only)
                                </h4>
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 mb-3 sm:mb-4">
                                    <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Health card download is available only for <strong>GMC (Group Medical Coverage)</strong> policies</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Click the download icon button next to "View Details" to get your health card</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>The card will be downloaded as a PDF file that you can print or save on your device</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                           
                        </div>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}

