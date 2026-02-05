import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { ShieldCheckIcon, ChevronRightIcon, ChevronLeftIcon, PhoneIcon, ChatBubbleLeftRightIcon, HeartIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Policies" />
            {/* Top Day-like Header */}
            <div className="bg-white rounded-t-2xl px-6 py-3 mt-4">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[rgb(147,71,144)] rounded-full"></span>
                    <span className="text-sm font-semibold text-gray-900">Policy Dashboard</span>
                </div>
            </div>

            <div className="flex flex-row overflow-hidden bg-white rounded-b-2xl shadow-sm mb-4">
                {/* Left Section - Policy Cards (60%) */}
                <main className="w-[60%] overflow-y-auto p-4 scrollbar-hide">
                    <div className="max-w-2xl">
                        {/* Header with SVG Icon */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[rgb(147,71,144)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Active Policy Details</h2>
                                <p className="text-xs text-gray-600">View and manage your insurance coverage</p>
                            </div>
                        </div>

                        {/* Policies Display */}
                        {allPolicies.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="mb-6">
                                    <img 
                                        src="/assets/images/policynotfound.png" 
                                        alt="No Policy Found" 
                                        className="w-64 mx-auto"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="hidden">
                                        <ShieldCheckIcon className="w-32 h-32 text-gray-300 mx-auto" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3">No Active Policies Found</h3>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 max-w-lg mx-auto border border-purple-100">
                                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                                        <span className="font-semibold text-[rgb(147,71,144)]">Your policy may be under process.</span>
                                        <br />
                                        Please wait for a few days or contact your HR administration for assistance.
                                    </p>
                                    <button className="bg-[rgb(147,71,144)] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[rgb(106,0,102)] transition-all shadow-md text-sm flex items-center gap-2 mx-auto">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                        Contact Support
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {/* Help Banner */}
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[rgb(147,71,144)] rounded-full flex items-center justify-center">
                                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">Can't find your policy details or health card?</p>
                                            <p className="text-xs text-gray-600">We're here to help you</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowHelpModal(true)}
                                        className="bg-[rgb(147,71,144)] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[rgb(106,0,102)] transition-all whitespace-nowrap"
                                    >
                                        Contact Us
                                    </button>
                                </div>

                                {/* Stacked Carousel */}
                                <div className="relative flex items-center justify-center mb-3 h-64">
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
                                                    className={`absolute transition-all duration-500 ease-out cursor-pointer ${
                                                        isActive 
                                                            ? 'z-30 scale-100 opacity-100' 
                                                            : isNext 
                                                                ? 'z-20 scale-95 opacity-60 translate-x-12' 
                                                                : isPrev
                                                                    ? 'z-20 scale-95 opacity-60 -translate-x-12'
                                                                    : 'z-10 scale-90 opacity-0'
                                                    }`}
                                                    style={{
                                                        transform: isActive ? 'translateX(0) scale(1)' : 
                                                                   isNext ? 'translateX(48px) scale(0.95)' :
                                                                   isPrev ? 'translateX(-48px) scale(0.95)' :
                                                                   'translateX(0) scale(0.9)'
                                                    }}
                                                >
                                                    <div className="w-96 md:w-[28rem] lg:w-[32rem] bg-white rounded-2xl p-5 shadow-lg">
                                                        {/* Header */}
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-xs font-bold text-white bg-[rgb(147,71,144)] px-3 py-1 rounded-full">
                                                                {getPolicyTypeShort(policy.policy_type)}
                                                            </span>
                                                        </div>

                                                        {/* Policy Name */}
                                                        <h3 className="text-lg font-bold text-gray-800 mb-4">{policy.policy_name || getPolicyTypeName(policy.policy_type)}</h3>

                                                        {/* Base SI and Policy No */}
                                                        <div className="flex gap-4 mb-4">
                                                            <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3">
                                                                <p className="text-[10px] text-gray-500 uppercase mb-1">Base SI</p>
                                                                <p className="text-sm font-bold text-gray-800">{policy.cover_string || '—'}</p>
                                                            </div>
                                                            <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3">
                                                                <p className="text-[10px] text-gray-500 uppercase mb-1">Policy No</p>
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{policy.policy_number}</p>
                                                            </div>
                                                        </div>

                                                        {/* Insured By */}
                                                        <div className="text-xs text-gray-500 mb-4">
                                                            Insured by <span className="font-semibold text-gray-800">{policy.insurance_company_name}</span>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => {
                                                                    const encodedId = btoa(policy.id.toString());
                                                                    router.visit(`/employee/policy/${encodedId}`);
                                                                }}
                                                                className="bg-[rgb(147,71,144)] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[rgb(106,0,102)] transition-all"
                                                            >
                                                                View Details
                                                            </button>
                                                            {policy.policy_type === 'gmi' && (
                                                                <div className="relative group">
                                                                    <button className="bg-white text-[rgb(147,71,144)] p-2 rounded-full shadow-sm hover:shadow-md transition-all">
                                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                className={`absolute left-4 z-40 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${currentPolicyIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[rgb(147,71,144)] hover:text-white'}`}
                                            >
                                                <ChevronLeftIcon className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextPolicy}
                                                disabled={currentPolicyIndex === allPolicies.length - 1}
                                                className={`absolute right-4 z-40 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all ${currentPolicyIndex === allPolicies.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[rgb(147,71,144)] hover:text-white'}`}
                                            >
                                                <ChevronRightIcon className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Policy Count Indicator */}
                                {allPolicies.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200">
                                            <ShieldCheckIcon className="w-4 h-4 text-[rgb(147,71,144)]" />
                                            <span className="text-xs font-semibold text-gray-700">
                                                Policy {currentPolicyIndex + 1} of {allPolicies.length}
                                            </span>
                                            <span className="text-xs text-gray-500">→ Swipe or use arrows to view more</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Services (40%) */}
                    <aside className="hidden xl:block w-[40%] border-l border-gray-100 overflow-y-auto scrollbar-hide">
                    <div className="p-5">
                        {/* Talk to Doctor Banner */}
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-7 mb-4 shadow-md relative overflow-hidden max-w-sm mx-auto">
                                <div className="relative z-10">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-white text-base font-bold">Talk to Doctor</h3>
                                    <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <span className="text-white text-xs font-bold">40% OFF</span>
                                    </div>
                                </div>
                                <p className="text-purple-50 text-xs mb-3">
                                    Connect with specialists instantly
                                </p>
                                    <button className="bg-white text-[rgb(147,71,144)] px-3 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-sm text-xs flex items-center gap-2">
                                    <PhoneIcon className="w-3 h-3" />
                                    Book Now
                                </button>
                            </div>
                            <div className="absolute -right-6 -bottom-6 opacity-10">
                                <svg className="w-28 h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Quick Services */}
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wide">Quick Services</h4>
                            
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all text-left">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <HeartIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-gray-800 text-xs">Health Checkup</h5>
                                        <p className="text-[10px] text-gray-500">Book annual checkup</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all text-left">
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                        <DocumentTextIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-gray-800 text-xs">File a Claim</h5>
                                        <p className="text-[10px] text-gray-500">Submit claims easily</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all text-left">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-gray-800 text-xs">Network Hospitals</h5>
                                        <p className="text-[10px] text-gray-500">Find hospitals</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Need Help Section */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                            <h4 className="font-bold text-gray-800 mb-2 text-sm">Need Help?</h4>
                            <p className="text-xs text-gray-600 mb-3">
                                Our support team is here to assist you
                            </p>
                            <button className="w-auto px-4 py-2 bg-[rgb(147,71,144)] text-white rounded-xl font-semibold hover:bg-[rgb(106,0,102)] transition-all text-xs inline-flex items-center justify-center">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Help Modal */}
            {showHelpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowHelpModal(false)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[rgb(147,71,144)] to-purple-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Need Help?</h3>
                                        <p className="text-purple-100 text-sm">We're here to assist you</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowHelpModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Instructions Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-[rgb(147,71,144)]">1</span>
                                    </div>
                                    How to View Policy Details
                                </h4>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 mb-4">
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Click on the <strong>"View Details"</strong> button on any policy card to see complete coverage information</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Use the arrow buttons or click on cards to navigate between multiple policies</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[rgb(147,71,144)] mt-1">•</span>
                                            <span>Policy details include sum insured, policy number, and insurance company information</span>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 mt-6">
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold text-[rgb(147,71,144)]">2</span>
                                    </div>
                                    Download Health Card (GMC Only)
                                </h4>
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-4">
                                    <ul className="space-y-2 text-sm text-gray-700">
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

                            {/* Query Form Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-2">Still facing issues?</h4>
                                <p className="text-sm text-gray-600 mb-4">Submit your query and our support team will get back to you within 24 hours</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                                        <input 
                                            type="text"
                                            value={queryForm.name}
                                            onChange={(e) => setQueryForm({...queryForm, name: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent outline-none text-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                                            <input 
                                                type="email"
                                                value={queryForm.email}
                                                onChange={(e) => setQueryForm({...queryForm, email: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent outline-none text-sm"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                                            <input 
                                                type="tel"
                                                value={queryForm.phone}
                                                onChange={(e) => setQueryForm({...queryForm, phone: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent outline-none text-sm"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Your Query *</label>
                                        <textarea 
                                            value={queryForm.message}
                                            onChange={(e) => setQueryForm({...queryForm, message: e.target.value})}
                                            rows="4"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent outline-none text-sm resize-none"
                                            placeholder="Describe your issue or query in detail..."
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => {
                                                // Handle form submission here
                                                console.log('Query submitted:', queryForm);
                                                alert('Your query has been submitted successfully!');
                                                setQueryForm({ name: '', email: '', phone: '', message: '' });
                                                setShowHelpModal(false);
                                            }}
                                            className="flex-1 bg-[rgb(147,71,144)] text-white py-3 rounded-lg font-semibold hover:bg-[rgb(106,0,102)] transition-all text-sm"
                                        >
                                            Submit Query
                                        </button>
                                        <button 
                                            onClick={() => setShowHelpModal(false)}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </EmployeeLayout>
    );
}

         