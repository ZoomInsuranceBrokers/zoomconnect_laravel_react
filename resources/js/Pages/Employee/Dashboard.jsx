import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import {
    PlayIcon,
    PauseIcon,
    Bars3Icon,
    CheckCircleIcon,
    UserGroupIcon,
    PhoneIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    ShieldCheckIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function EmployeeDashboard({ employee, policies = [], newPolicies = [] }) {

    const [activeDay, setActiveDay] = useState(1);
    const [currentExercise, setCurrentExercise] = useState(1);
    const [isPaused, setIsPaused] = useState(false);
    const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);

    const greeting = `Hey, ${employee?.full_name || 'User'}`;
    const allPolicies = [...(newPolicies || []), ...(policies || [])];

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

    const exercises = [
        {
            id: 1,
            name: 'Abdominal muscles',
            duration: '10 min',
            calories: '100kcal',
            color: 'bg-blue-100',
            textColor: 'text-blue-600',
            status: 'current',
            image: '💪'
        },
        {
            id: 2,
            name: 'Jumping on ball',
            duration: '15 min',
            calories: '150kcal',
            color: 'bg-purple-100',
            textColor: 'text-purple-600',
            status: 'completed',
            image: '🏃‍♀️'
        },
        {
            id: 3,
            name: 'With dumbbells',
            duration: '12 min',
            calories: '90kcal',
            color: 'bg-teal-100',
            textColor: 'text-teal-600',
            status: 'completed',
            image: '🏋️‍♀️'
        },
        {
            id: 4,
            name: 'Jumping',
            duration: '30 min',
            calories: '180kcal',
            color: 'bg-pink-100',
            textColor: 'text-pink-600',
            status: 'pending',
            image: '🤸‍♀️'
        },
    ];

    const currentExerciseData = exercises[currentExercise - 1];

    // Carousel banners for the top area
    const [currentBanner, setCurrentBanner] = useState(0);
    const banners = [
        {
            id: 0,
            title: '24/7 Doctor Consultations — Free',
            subtitle: 'Talk to certified doctors on-demand',
            content: "Connect instantly with qualified physicians for non-emergency advice, prescriptions, and follow-ups — completely free for employees.",
            image: '/assets/images/gmc_groupmedical.png',
            cta: 'Consult Now',
            gradient: 'from-indigo-500 to-blue-400'
        },
        {
            id: 1,
            title: 'Save on Medicines — Family Discounts',
            subtitle: 'Low-cost prescriptions & doorstep delivery',
            content: 'Get family-wide discounts on medicines and order essentials from trusted pharmacies. Save time and money.',
            image: '/assets/images/heroSectionimg.png',
            cta: 'Order Medicines',
            gradient: 'from-emerald-400 to-green-400'
        },
        {
            id: 2,
            title: 'AI Health Risk Assessment',
            subtitle: 'Quick screening in minutes',
            content: 'Take a short, private health check to get personalized insights and preventive tips.',
            image: '/assets/images/products/Workspace_Wellness_Harmony_simple.png',
            cta: 'Start Assessment',
            gradient: 'from-purple-500 to-pink-400'
        }
    ];

    // autoplay banners
    useEffect(() => {
        const t = setInterval(() => setCurrentBanner((s) => (s + 1) % banners.length), 6000);
        return () => clearInterval(t);
    }, []);

    const rightFeatures = [
        {
            id: 'health-card',
            title: 'Health Card',
            subtitle: 'Download your e-card',
            bg: 'from-purple-50 to-pink-50',
            svg: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="4" width="22" height="14" rx="2" stroke="#7C3AED" strokeWidth="1.5" fill="white" opacity="0.9" />
                    <rect x="4" y="7" width="6" height="3" rx="0.5" fill="#7C3AED" />
                    <path d="M16 12v4M18 14h-4" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            id: 'cashless-1',
            title: 'Cashless Hospital',
            subtitle: 'Find nearby cashless hospitals',
            bg: 'from-blue-50 to-blue-100',
            svg: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21v-8l9-4 9 4v8" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="white" />
                    <path d="M9 21V12h6v9" stroke="#0369A1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="10" y="6" width="4" height="3" rx="0.5" fill="#0369A1" />
                </svg>
            )
        },
        {
            id: 'offer',
            title: '50% Off',
            subtitle: 'Medicines & checkups',
            bg: 'from-emerald-50 to-green-100',
            svg: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12l9-9 9 9-9 9L3 12z" stroke="#059669" strokeWidth="1.2" fill="#ECFDF5" />
                    <text x="12" y="14" fontSize="8" fontWeight="700" textAnchor="middle" fill="#059669">50%</text>
                </svg>
            )
        },
        {
            id: 'checkup',
            title: 'Health Check Up',
            subtitle: 'Book preventive checkup',
            bg: 'from-yellow-50 to-orange-50',
            svg: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="6" stroke="#D97706" strokeWidth="1.2" fill="#FFFBEB" />
                    <path d="M15 15l5 5" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M10 8v6" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
            )
        }
    ];

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Dashboard" />
            {/* Top Day Tabs */}
            <div className="bg-white rounded-t-2xl px-6 py-3 mt-4">
                <div className="flex items-center gap-3">
                    {/* Yellow Hey / Wave Hand Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                    >
                        <path
                            d="M8.5 11.5V6.75a1.25 1.25 0 012.5 0v4.75"
                            fill="#FACC15"
                        />
                        <path
                            d="M11 11.5V5.75a1.25 1.25 0 012.5 0v5.75"
                            fill="#FACC15"
                        />
                        <path
                            d="M13.5 12V7.25a1.25 1.25 0 012.5 0V12"
                            fill="#FACC15"
                        />
                        <path
                            d="M16 12.75a3.75 3.75 0 01-7.5 0V11.5h7.5v1.25z"
                            fill="#FACC15"
                        />
                    </svg>

                    {/* Greeting Text */}
                    <div className="text-lg font-bold not-italic tracking-normal text-gray-900">
                        {greeting}
                    </div>
                </div>

            </div>

            <div className="flex-1 flex overflow-hidden bg-white rounded-b-2xl shadow-sm mb-4">
                {/* Main Exercise Content */}
                <main className="flex overflow-y-auto p-6 scrollbar-hide">
                    {/* Exercise Card */}
                    <div className="max-w-4xl">
                        <div className="rounded-3xl p-0 shadow-sm mb-6 relative overflow-hidden">
                            {/* Banner carousel */}
                            <div className="flex items-stretch w-full">
                                <div className={`flex-1 p-8 bg-gradient-to-r ${banners[currentBanner].gradient}`}>
                                    {/* dynamic gradient via tailwind classes below */}
                                    <div className={`rounded-2xl p-8 h-full text-white min-h-[220px]`}>
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-extrabold leading-tight mb-2">{banners[currentBanner].title}</h3>
                                                <p className="text-sm opacity-95 mb-3">{banners[currentBanner].subtitle}</p>
                                                {banners[currentBanner].content && (
                                                    <p className="text-sm opacity-90 mb-6 max-w-prose">{banners[currentBanner].content}</p>
                                                )}
                                                <button className="px-6 py-3 rounded-xl bg-white text-gray-800 font-semibold shadow-md hover:shadow-lg transition">{banners[currentBanner].cta}</button>
                                            </div>
                                            <div className="hidden md:flex items-center justify-center w-56 h-56">
                                                {banners[currentBanner].image ? (
                                                    <img src={banners[currentBanner].image} alt="banner" className="w-56 h-56 object-contain rounded-xl shadow-lg bg-white/10 p-2" />
                                                ) : (
                                                    <svg width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="rounded-xl">
                                                        <defs>
                                                            <linearGradient id={`g-${currentBanner}`} x1="0%" x2="100%">
                                                                <stop offset="0%" stopColor="#d946ef" stopOpacity="0.9" />
                                                                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.9" />
                                                            </linearGradient>
                                                        </defs>
                                                        <rect width="200" height="200" rx="16" fill={`url(#g-${currentBanner})`} />
                                                        <g transform="translate(30,40)">
                                                            <circle cx="40" cy="20" r="18" fill="#fff" opacity="0.08" />
                                                            <rect x="10" y="60" width="100" height="60" rx="8" fill="#fff" opacity="0.06" />
                                                            <text x="12" y="95" fill="#fff" fontSize="12" fontWeight="700">Health Risk</text>
                                                        </g>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls removed per request (no left/right arrows) */}

                            {/* Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {banners.map((b, i) => (
                                    <button key={b.id} onClick={() => setCurrentBanner(i)} className={`h-2 rounded-full transition-all ${currentBanner === i ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                                ))}
                            </div>
                        </div>

                        {/* Active Policies Section */}
                        <div className="mt-10 mb-8">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-[rgb(147,71,144)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Active Policies</h2>
                                        <p className="text-xs text-gray-600">View and manage your insurance coverage</p>
                                    </div>
                                </div>

                                {/* Divider line between header and cards */}
                                <div className="border-t border-gray-200 mb-6" />

                                {allPolicies.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="mb-6">
                                            <ShieldCheckIcon className="w-32 h-32 text-gray-300 mx-auto" />
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


                                        {/* Stacked Carousel */}
                                        <div className="relative flex items-center justify-center mb-6 h-64">
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
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
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

                        {/* Healthcare Benefits Section */}
                        <div className="mt-8 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Healthcare benefits</h2>
                            
                            <div className="bg-gray-50 rounded-3xl p-6 relative">
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                                    {/* Maternity Care Program */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Maternity Care Program</h3>
                                        <p className="text-xs text-gray-600">Comprehensive maternity care, ensuring a smooth and joyful journey into parenthood.</p>
                                    </div>

                                    {/* Plan your Hospitalization */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Plan your Hospitalization</h3>
                                        <p className="text-xs text-gray-600">Surgical excellence for transformative outcomes.</p>
                                    </div>

                                    {/* Condition Management Program */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Condition Management Program</h3>
                                        <p className="text-xs text-gray-600">Personalized support through our Condition Management Program.</p>
                                    </div>

                                    {/* Health Risk Assessment */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Health Risk Assessment</h3>
                                        <p className="text-xs text-gray-600">Discover your health risks with a simple online assessment.</p>
                                    </div>

                                    {/* Health Checks */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Health Checks</h3>
                                        <p className="text-xs text-gray-600">Choose from a wide range of discounted health check packages & get online reports in 24-48 Hours.</p>
                                    </div>

                                    {/* Lab Tests */}
                                    <div className="flex-shrink-0 w-72 h-56 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 mb-2">Lab Tests</h3>
                                        <p className="text-xs text-gray-600">Book lab tests from safe & trusted diagnostic centres.</p>
                                    </div>

                                    {/* View All Benefits */}
                                    <div 
                                        onClick={() => router.visit('/employee/wellness')}
                                        className="flex-shrink-0 w-72 h-56 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <h3 className="text-base font-bold text-gray-800 mb-2">View all benefits</h3>
                                            <svg className="w-6 h-6 text-[rgb(147,71,144)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Scroll Arrows Below */}
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <button 
                                        onClick={() => document.querySelector('.overflow-x-auto').scrollBy({ left: -320, behavior: 'smooth' })}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                    >
                                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div className="flex gap-2">
                                        <span className="w-8 h-1 bg-gray-400 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    </div>
                                    <button 
                                        onClick={() => document.querySelector('.overflow-x-auto').scrollBy({ left: 320, behavior: 'smooth' })}
                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                    >
                                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </main>

                {/* Right Sidebar - Exercises List */}
                <aside className="hidden xl:block w-96 border-l border-gray-100 overflow-y-auto scrollbar-hide">
                    <div className="p-5">
                        {/* Exercises List Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Quick Services</h3>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Bars3Icon className="w-4 h-4" />
                            </button>
                        </div>

                     

                        {/* Right-side Feature Cards */}
                        <div className="space-y-4 mb-6">
                            {rightFeatures.map((f) => (
                                <div key={f.id} className={`bg-gradient-to-br ${f.bg} rounded-2xl p-4 shadow-sm`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center p-1">
                                            {f.svg}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">{f.title}</h4>
                                            <p className="text-xs text-gray-600">{f.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Full Book Dr. Appointment Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center p-1">
                                        <PhoneIcon className="w-5 h-5 text-[rgb(147,71,144)]" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm">Book Dr. Appointment</div>
                                        <p className="text-xs text-gray-500">At best Prices</p>
                                    </div>
                                </div>
                                <button className="text-purple-600 hover:text-purple-700 p-1 rounded-md" aria-label="settings">
                                    <span className="text-lg">⚙️</span>
                                </button>
                            </div>

                            <h4 className="text-lg font-semibold text-gray-800 mb-1">Book Doctors Near You</h4>
                            <p className="text-xs text-gray-600 mb-3">Expert consultations available offline for your convenience</p>

                            <div className="flex items-center gap-3 mb-3">
                                <button onClick={() => router.visit('/employee/appointments')} className="flex-1 bg-[rgb(147,71,144)] text-white px-3 py-2 rounded-md text-sm font-semibold shadow-sm hover:bg-[rgb(106,0,102)] transition">
                                    Book Dr. Appointment
                                </button>
                            </div>


                            
                        </div>

                        {/* My Friends Section */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <UserGroupIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">My Friends</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">+10</span>
                            </div>
                            <div className="flex items-center -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full border-3 border-white overflow-hidden"
                                    >
                                        <img
                                            src={`https://i.pravatar.cc/150?img=${i}`}
                                            alt={`Friend ${i}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                <button className="w-10 h-10 rounded-full border-3 border-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white font-bold transition-all text-sm">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </EmployeeLayout>
    );
}
