import React, { useEffect, useRef, useState } from 'react';
import { FaHeartbeat, FaUserShield, FaUserFriends, FaClinicMedical, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGlobe, FaChartBar, FaPuzzlePiece } from "react-icons/fa";

import { Link } from '@inertiajs/react';
import { FaUsers, FaClock, FaCheck, FaDownload } from 'react-icons/fa';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

const offerings = [
    { icon: <FaHeartbeat />, title: "Group Health Insurance", desc: "Comprehensive medical coverage with network hospitals, preventive care, and maternity benefits—keeping your team healthy and protected." },
    { icon: <FaUserShield />, title: "Group Term Life", desc: "Reliable life insurance coverage with flexible options and easy claims—securing your team's financial future." },
    { icon: <FaClinicMedical />, title: "Doctor Consultations", desc: "24/7 access to qualified doctors via teleconsultations—quality healthcare without waiting rooms." },
    { icon: <FaChartLine />, title: "Wellness Programs", desc: "Fitness tracking, mental health coaching, and wellness screenings—building a healthier, productive workforce." },
    { icon: <FaUserFriends />, title: "Effortless Onboarding", desc: "Paperless digital enrollment—add or remove employees in seconds, completely hassle-free." },
    { icon: <FaShieldAlt />, title: "Accident Protection", desc: "Complete coverage for injuries, hospitalization, and emergencies—with cashless networks and quick claims." },
];

function LargeBizSolutions() {
    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!window.gsap || !window.ScrollTrigger) return;

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        const cards = gsap.utils.toArray('.Largebiz-card').map((card) =>
            gsap.from(card, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            })
        );

        ScrollTrigger.refresh();

        return () => {
            cards.forEach((tween) => {
                tween.scrollTrigger?.kill();
                tween.kill();
            });
        };
    }, []);

    return (
        <div className="relative w-full ">
            {/* Soft glow and overlay */}

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {offerings.map((item, idx) => (
                        <div
                            key={idx}
                            className="Largebiz-card relative group p-[2px] rounded-2xl bg-gradient-to-br from-[#FFB300]/30 via-[#934790]/20 to-transparent shadow-[0_0_40px_rgba(147,71,144,0.08)] group-hover:bg-[#934790] transition-all duration-300 h-70"
                        >
                            <div className="bg-white/70 backdrop-blur-2xl p-7 rounded-2xl h-full shadow-[0_0_25px_rgba(255,255,255,0.10)] group-hover:shadow-[0_0_40px_rgba(255,179,0,0.18)] group-hover:bg-[#934790] transform group-hover:-translate-y-2 group-hover:scale-[1.05] transition-all duration-300 ease-out flex flex-col justify-between relative">
                                <div className="absolute -top-5 -left-5 w-14 h-14 bg-[#934790] rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white group-hover:text-[#934790] transition-all duration-300 z-10">
                                    {item.icon}
                                </div>
                                <div className="pt-2">
                                    <h3 className="md:text-xl font-semibold mb-4 text-[#934790] drop-shadow-sm group-hover:text-white transition-all">{item.title}</h3>
                                </div>
                                <p className="text-gray-700 md:text-sm leading-relaxed font-medium group-hover:text-white/90 transition-all">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

function WhyStartupsLoveZoomConnect() {

    const features = [
        {
            icon: <FaGlobe />,
            title: "Global Capabilities",
            desc: "Healthcare and benefits solutions that scale across geographies, integrate compliance requirements, and support diverse enterprise workforces.",
            bgColor: '#E8F5E9',
            accentColor: '#81C784',
            borderColor: '#4CAF50'
        },
        {
            icon: <FaChartBar />,
            title: "Advanced Analytics",
            desc: "Data-driven insights into claims, utilization patterns, and cost trends to enable smarter, strategic benefits decisions.",
            bgColor: '#FFF4E6',
            accentColor: '#FFD89B',
            borderColor: '#FFB84D'
        },
        {
            icon: <FaPuzzlePiece />,
            title: "Custom-Tailored Plans",
            desc: "Flexible, enterprise-ready benefit programs designed to align with organizational scale, complexity, and workforce diversity.",
            bgColor: '#FFE6F0',
            accentColor: '#FFB3D9',
            borderColor: '#FF80BF'
        },
    ];


    return (
        <section className="w-full py-20 relative overflow-hidden">
            {/* Blob SVG Background */}
            <div className="pointer-events-none absolute inset-0 flex justify-center items-center -z-10 overflow-hidden w-full h-full">
                <svg className="w-full max-w-4xl h-auto opacity-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1305 885" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8B6F47" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#93566C" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#2D5A8C" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                    <g>
                        {/* Main Blob Shape */}
                        <path
                            fill="url(#blobGrad)"
                            d="M1194.91 807.728c-59.58 43.615-154.57 74.447-251.604 70.433-110.208-4.561-200.22-50.779-306.606-67.321-80.387-12.502-165.735-7.46-249.244-8.498-83.509-1.038-173.013-10.041-231.118-43.637-75.744-43.792-73.345-113.804-52.689-174.13 20.656-60.326 33.272-89.498 12.32-131.722-17.03-34.318-54.2-64.134-79.667-96.724C-15.64 289.674-3.416 160.931 47.212 93.75 79.462 50.957 142.63 9.596 224.868 7.421c93.534-2.472 165.88 45.138 255.614 59.815 124.891 20.43 230.038-12.669 360.327-13.684 142.17-1.11 271.461 53.674 341.191 123.21 69.73 69.537 102.74 231.726 102.74 231.726s74.84 286.016-89.83 399.24Z"
                            className="animate-pulse"
                        />

                        {/* Secondary Blob */}
                        <path
                            fill="#4A3556"
                            opacity="0.35"
                            d="M1124.13 681.727c-2.74-8.558-5-20.639-2.07-33.763 2.72-12.176 7.75-15.577 9.28-16.496 1.34-.808 6.33-3.528 10.32-1.494 4.31 2.202 4.84 8.638 5.1 11.73v.012c1.24 14.886-11.85 30.453-19.2 38.035 7.34-4.246 13.51-7.83 18.01-10.455 3.89-7.578 10.04-16.422 19.67-23.176 10.21-7.167 16.22-6.291 17.97-5.941 1.53.307 7.06 1.657 8.63 5.846 1.7 4.532-2.24 9.661-4.13 12.115-9.62 12.498-31.56 14.799-41.49 15.272-4.51 2.628-10.44 6.076-17.41 10.098 8.74-1.788 20.72-2.687 33.19 1.446 11.84 3.928 14.72 9.28 15.48 10.887.69 1.416 2.88 6.658.45 10.416-2.62 4.07-9.09 3.957-12.19 3.9-17.01-.294-33.04-19.17-38.31-25.848a5869.38 5869.38 0 0 1-29.47 16.893c8.58-1.521 19.87-1.974 31.66 2.162 11.92 4.186 14.87 9.746 15.65 11.416.69 1.47 2.96 6.913.57 10.77-2.59 4.176-9.08 3.992-12.19 3.903h-.01c-16.74-.481-32.72-19.415-38.4-26.709a4032.443 4032.443 0 0 1-34.91 19.629c8.29-1.287 18.75-1.492 29.57 2.097 11.85 3.928 14.72 9.276 15.49 10.886.67 1.417 2.88 6.659.45 10.417-2.62 4.069-9.1 3.956-12.19 3.9-16.29-.281-31.68-17.602-37.59-24.933-11.9 6.588-23.71 13.023-34.69 18.844 8.57-1.514 19.85-1.958 31.61 2.171 11.93 4.185 14.88 9.745 15.66 11.416.69 1.469 2.96 6.913.56 10.77-2.58 4.176-9.07 3.992-12.18 3.903h-.01c-16.79-.483-32.82-19.528-38.45-26.774-14.84 7.833-27.995 14.435-37.528 18.615l-1.561-3.561c9.598-4.208 22.899-10.892 37.909-18.822-3.2-8.048-6.23-19.667-4.18-32.63 1.86-11.809 6.46-15.355 7.87-16.323 1.22-.851 5.83-3.744 9.76-2.027 4.24 1.858 5.15 8 5.58 10.939 2.25 15.379-11.55 32.5-17.61 39.289 10.9-5.77 22.65-12.167 34.52-18.73-2.46-8.66-4.33-20.877-.92-33.963 3.16-12.073 8.31-15.294 9.87-16.156 1.37-.76 6.45-3.303 10.36-1.127 4.23 2.356 4.54 8.82 4.68 11.914.72 15.071-13.2 30.317-20.77 37.548a4105.784 4105.784 0 0 0 37.49-21.068c-3.21-8.049-6.26-19.687-4.21-32.675 1.87-11.809 6.47-15.355 7.87-16.323 1.23-.851 5.84-3.744 9.77-2.027 4.24 1.856 5.14 7.988 5.57 10.931l.01.008c2.25 15.379-11.55 32.498-17.61 39.289a5516.976 5516.976 0 0 0 28.7-16.446Z"
                        />
                    </g>
                </svg>
            </div>

            {/* Animated background elements */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Side - Heading & Subheading */}
                    <div className="flex flex-col justify-start sticky top-20">
                        <h2 className="text-2xl lg:text-5xl font-dmserif font-semibold text-gray-900 mb-6 leading-tight drop-shadow-lg">
                            Why large teams love ZoomConnect
                        </h2>
                        <p className="text-sm lg:text-base text-gray-700 font-medium leading-relaxed">
                            Simple, scalable healthcare & benefits — curated plans, fast onboarding, and 24/7 support so your team can focus on growth.
                        </p>
                    </div>

                    {/* Right Side - Pastel Animated Cards */}
                    <div className="space-y-6">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="group relative rounded-3xl p-6 backdrop-blur-md border-2 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                                style={{
                                    backgroundColor: item.bgColor,
                                    borderColor: item.borderColor,
                                    animation: `slideIn 0.6s ease-out ${index * 0.15}s both`
                                }}
                            >
                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="relative z-10 flex gap-5 items-start">
                                    {/* Icon Container */}
                                    <div
                                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                                        style={{ backgroundColor: item.accentColor, animation: `float 3s ease-in-out ${index}s infinite` }}
                                    >
                                        {item.icon}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1">
                                        <h3
                                            className="text-lg font-bold text-gray-900 mb-2 transition-colors duration-300"
                                            style={{
                                                color: undefined,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    transition: 'color 0.3s',
                                                    color: undefined,
                                                }}
                                                className={`group-hover:text-current card-title-hover-${index}`}
                                            >
                                                {item.title}
                                            </span>
                                        </h3>
                                        <style>{`
                                            .group:hover .card-title-hover-${index} {
                                                color: ${item.borderColor} !important;
                                            }
                                        `}</style>
                                        <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Animated dot indicator */}
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ backgroundColor: item.borderColor, animation: `pulse 2s ease-in-out infinite` }}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </section>
    );
}

export default function LargeTeams() {

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shield outline */}
                    <path d="M32 8L12 16v14c0 14.5 10.5 26 20 28 9.5-2 20-13.5 20-28V16L32 8z" fill="#FFE5F0" stroke="#FFB300" strokeWidth="2" />
                    {/* Building silhouette */}
                    <rect x="24" y="28" width="16" height="14" rx="2" fill="#FFB300" fillOpacity="0.18" />
                    <rect x="28" y="32" width="2" height="6" rx="1" fill="#FFB300" fillOpacity="0.7" />
                    <rect x="34" y="32" width="2" height="6" rx="1" fill="#FFB300" fillOpacity="0.7" />
                    <rect x="40" y="32" width="2" height="6" rx="1" fill="#FFB300" fillOpacity="0.7" />
                    {/* Checkmark */}
                    <path d="M26 40l4 4 8-8" stroke="#FFB300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Enterprise-Grade Benefits',
            description: 'Comprehensive insurance and wellness solutions designed for large teams—robust, scalable, and future-ready.',
            iconBg: '#ffbf3f',
            iconColor: '#ffbf3f'
        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Horizontal slider lines in blue */}
                    <rect x="12" y="18" width="40" height="4" rx="2" fill="#2196F3" fillOpacity="0.25" />
                    <rect x="12" y="30" width="40" height="4" rx="2" fill="#2196F3" fillOpacity="0.25" />
                    <rect x="12" y="42" width="40" height="4" rx="2" fill="#2196F3" fillOpacity="0.25" />

                    {/* Slider knobs in blue shades */}
                    <circle cx="26" cy="20" r="5" fill="#BBDEFB" stroke="#1976D2" strokeWidth="2" />
                    <circle cx="40" cy="32" r="5" fill="#90CAF9" stroke="#1976D2" strokeWidth="2" />
                    <circle cx="22" cy="44" r="5" fill="#64B5F6" stroke="#1976D2" strokeWidth="2" />
                </svg>
            ),
            title: 'Flexible, Custom Plans',
            description:
                'Benefit options that adapt to your company’s needs—choose, combine, and scale as you grow.',
            iconBg: '#E3F2FD',
            iconColor: '#1976D2'

        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Dashboard base */}
                    <rect
                        x="8"
                        y="12"
                        width="48"
                        height="40"
                        rx="8"
                        fill="#F0E6F5"
                    />

                    {/* Top bar */}
                    <rect
                        x="8"
                        y="12"
                        width="48"
                        height="8"
                        rx="8"
                        fill="#934790"
                        fillOpacity="0.25"
                    />

                    {/* Settings gear */}
                    <circle cx="26" cy="34" r="6" fill="#934790" fillOpacity="0.35" />
                    <path
                        d="M26 30v-2M26 40v-2M30 34h2M20 34h2
         M29 31l1.5-1.5M22.5 38.5L24 37
         M29 37l1.5 1.5M22.5 29.5L24 31"
                        stroke="#934790"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />

                    {/* Automation check */}
                    <path
                        d="M38 36l3 3 6-6"
                        stroke="#934790"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            title: 'Streamlined Team Administration',
            description:
                'Automated onboarding, easy benefits management, and digital tools that save time—perfect for growing, mid-sized teams.',
            iconBg: '#FFB8E0',
            iconColor: '#FFB8E0'


        },
        {
            icon: (
                <svg
                    className="w-12 h-12"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Support background */}
                    <rect x="10" y="10" width="44" height="44" rx="8" fill="#C8E6C9" />

                    {/* Head */}
                    <circle cx="32" cy="28" r="8" fill="#388E3C" fillOpacity="0.25" />

                    {/* Headset */}
                    <path
                        d="M20 30c0-8 5.5-14 12-14s12 6 12 14"
                        stroke="#388E3C"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <rect x="18" y="30" width="6" height="10" rx="3" fill="#388E3C" />
                    <rect x="40" y="30" width="6" height="10" rx="3" fill="#388E3C" />

                    {/* Mic */}
                    <path
                        d="M32 36v6c0 2-2 4-4 4"
                        stroke="#388E3C"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            ),
            title: 'Dedicated Enterprise Support',
            description:
                '24/7 expert help for HR and employees—fast answers, instant claims help, and real human support.',
            iconBg: '#C8E6C9',
            iconColor: '#388E3C'

        }
    ];


    const whyChooseUs = [
        {
            title: 'Scalable cost optimization',
            description: 'Enterprise-grade healthcare solutions designed to control costs while scaling seamlessly across large workforces.',
            icon: <FaChartLine className="text-[#b85c9e] w-7 h-7 group-hover:text-[#6a0066] transition-all duration-300" />
        },
        {
            title: 'Centralized claims management',
            description: 'Streamlined, paperless claims processing with dedicated enterprise support and real-time visibility.',
            icon: <FaClock className="text-[#b85c9e] w-7 h-7 group-hover:text-[#6a0066] transition-all duration-300" />
        },
        {
            title: 'Comprehensive enterprise coverage',
            description: 'Robust policies covering employees, dependents, diverse family structures, and advanced medical treatments.',
            icon: <FaHeartbeat className="text-[#b85c9e] w-7 h-7 group-hover:text-[#6a0066] transition-all duration-300" />
        }
    ];


    const stats = [
        { value: '6000', label: 'Companies Covered' },
        { value: '40+', label: 'Including Unicorns' }
    ];

    const trustedLogos = [
        { name: 'JAINA INDIA PRIVATE LIMITED' },
        { name: 'NIHILENT LIMITED' },
        { name: 'Konica Minolta Healthcare' },
        { name: 'Trail Blazer Tours India Pvt Ltd' },
        { name: 'GLOBALSTEP SERVICES PRIVATE LIMITED' },
        { name: 'BCH ELECTRIC LTD' }
    ];

    const insights = [
        '70% of startups include mental health treatments in their packages',
        'Employee healthcare budgets for startups are growing by 15% annually',
        '46% offer maternity coverage of up to ₹75,000'
    ];
    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-x-hidden bg-[#ffceea78] text-gray-900 ">

                <section className="w-full relative  py-20 lg:py-28">
                    <div className="absolute inset-0 opacity-70">
                        <img
                            src="/assets/images/wavy design-01.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="max-w-7xl z-10 mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold font-dmserif leading-tight mb-6">
                                Benefits & Insurance Solutions for <span className="text-[#FF0066] ">Large Enterprises</span>
                            </h1>

                            <p className="text-sm md:text-base text-gray-600 mb-8 max-w-xl">
                                Comprehensive employee benefit solutions designed for scale, efficiency, and impact.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/book-demo"
                                    className="bg-[#FF0066]/80 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-[#df0059cc] hover:text-white transition"
                                >
                                    Schedule a Call
                                </Link>
                                <Link
                                    href="/contact"
                                    className="border border-[#E8D4B7] bg-[#934790] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#6a0066] hover:text-white transition"
                                >
                                    Contact Us
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center gap-6 text-sm text-gray-700">
                                <span>24×7 support</span>
                                <span className="h-6 w-px bg-[#a0649f]" />
                                <span>Flexible team sizes</span>
                                <span className="h-6 w-px bg-[#a0649f]" />
                                <span>Quick onboarding</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="">
                                <img src="/assets/images/solutions/large_enterprises _image.png" alt="Team meeting" className="w-full h-[450px] object-contain" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-20 bg-[#3d1139] text-white">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-dmserif font-bold leading-tight mb-2">
                                Trusted by Growing Businesses
                            </h2>
                            <div className="text-base text-white/80 font-medium mb-2">Large teams making a big impact</div>
                            <div className="text-sm text-white/60">Trusted by companies for comprehensive insurance brokerage, claims support, and employee health benefit solutions.</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                            {trustedLogos.map((logo, idx) => {
                                // Capitalize first letter of every word
                                const displayName = logo.name
                                    .toLowerCase()
                                    .split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ');
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center w-full max-w-sm bg-gradient-to-br from-[#2a0d27] via-[#3d1139] to-[#2a0d27] rounded-2xl shadow-xl border-l-8 border-[#b85c9e] p-5 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                        style={{ minHeight: '90px' }}
                                    >
                                        <div className="flex items-center justify-center bg-[#fff1e6]/10 rounded-full p-3 mr-4">
                                            <FaShieldAlt className="text-[#FFB300] w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-white font-medium text-base md:text-base group-hover:text-[#FFB300] transition-colors duration-300">{displayName}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                {/* Why Startups Love Section */}
                <section className=" w-full py-20  text-gray-900">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <WhyStartupsLoveZoomConnect />
                    </div>
                </section>


                {/* Insights Section */}
                <section className="w-[95%] px-4 py-16 bg-[#f2d7b3]/70 rounded-3xl  backdrop-blur-lg text-white ">
                    {/* Soft ambient glow backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,179,0,0.12),transparent_60%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,71,144,0.18),transparent_70%)]"></div>

                    <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                        <div className="mb-12 text-center">
                            <h2 className="text-4xl md:text-5xl font-dmserif font-medium text-gray-800 drop-shadow-lg mb-4">
                                What ZoomConnect provides to Large businesses
                            </h2>
                            <p className="text-md md:text-base text-gray-800 font-medium max-w-2xl mx-auto">
                                Premium, modern insurance & wellness solutions designed for Large teams that want enterprise-quality benefits.
                            </p>
                        </div>
                        <div className="flex flex-row gap-12 items-center">

                            {/* Solutions Grid First */}
                            <div className="w-[60%]">
                                <LargeBizSolutions />
                            </div>
                            {/* Image Block Last */}
                            <div className="relative group w-[40%]">
                                <div className="rounded-3xl flex items-center justify-center ">
                                    <img
                                        src="/assets/images/products/zoomConnect_Business_Benefits.png"
                                        className="w-3/4 object-cover scale-[1.05] group-hover:scale-100 transition-all duration-700 ease-out"
                                    />
                                </div>
                                {/* Soft glowing border */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-[#FFB300]/20 to-[#934790]/20 blur-3xl rounded-3xl opacity-30"></div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* What Makes Perfect Section */}
                <section className="w-full py-24">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-xl md:text-5xl font-dmserif font-semibold mb-4 text-gray-800">
                                Why ZoomConnect Is the Right Partner for Your Large Business
                            </h2>
                            <p className="text-sm md:text-base text-gray-700 font-medium mb-6 max-w-2xl mx-auto">
                                Give your team enterprise-grade insurance and wellness benefits—designed to be affordable, flexible, and effortless for growing companies.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="gmc-card group relative bg-[#f9f6fb] rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                    style={{ ['--accent']: feature.iconBg }}
                                >
                                    {/* Icon wrapper uses per-feature subtle bg; card uses same bg on hover */}
                                    <div className="relative z-10 mb-6 w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-none"
                                        style={{ background: feature.iconBg }}>
                                        <div className="transform group-hover:rotate-6 transition-transform duration-500" style={{ color: feature.iconColor }}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <h3 className="relative z-10 font-bold text-lg text-[#2d2d2d] mb-3 group-hover:text-[#934790] transition-colors">
                                        {feature.title}
                                    </h3>
                                    {/* Description */}
                                    <p className="relative z-10 text-xs md:text-sm text-gray-800 leading-relaxed group-hover:text-gray-900 group-hover:font-medium transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* New Hero Section - Elevate Your Employee Healthcare */}
                <section className="w-full py-24 bg-white flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Decorative SVGs and emoji icons - more added for visual richness, now larger */}
                    <span className="absolute top-10 left-10 text-[#FF0066] text-7xl" style={{ transform: 'rotate(-8deg)' }}>💖</span>
                    <span className="absolute top-10 right-10 text-[#934790] text-7xl" style={{ transform: 'rotate(8deg)' }}>🎯</span>
                    <span className="absolute bottom-32 left-32 text-[#ffbf3f] text-6xl" style={{ transform: 'rotate(-6deg)' }}>🏥</span>
                    <span className="absolute bottom-20 right-40 text-[#388E3C] text-6xl" style={{ transform: 'rotate(6deg)' }}>🩺</span>
                    <span className="absolute bottom-10 right-10 text-[#6A0066] text-5xl" style={{ transform: 'rotate(-4deg)' }}>🧬</span>
                    <span className="absolute top-1/2 left-20 text-[#FFB300] text-6xl" style={{ transform: 'rotate(-12deg)' }}>🌟</span>
                    <span className="absolute top-1/3 right-32 text-[#934790] text-6xl" style={{ transform: 'rotate(10deg)' }}>🧑‍💼</span>
                    <span className="absolute bottom-[20%] left-[45%] text-[#FF0066] text-5xl" style={{ transform: 'rotate(-7deg)' }}>📈</span>
                    <span className="absolute bottom-1/3 right-1/4 text-[#388E3C] text-6xl" style={{ transform: 'rotate(7deg)' }}>💡</span>
                    <span className="absolute top-1/4 right-1/2 text-[#FFB8E0] text-5xl" style={{ transform: 'rotate(-5deg)' }}>🛡️</span>

                    <div className="max-w-3xl mx-auto text-center py-24 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-dmserif font-semibold text-gray-800 mb-6">
                            Elevate Your Employee Healthcare <span className="italic font-dmserif text-[#934790]">with</span> ZoomConnect
                        </h1>
                        <p className="text-md md:text-base text-gray-700 mb-8 font-medium">
                            ZoomConnect is designed for larger business or enterprise that value their people and want benefits that grow with them. Let us help you build a healthier, happier workforce.
                        </p>
                        <a href="/contact" className="inline-block bg-[#FF0066] text-white px-8 py-2 rounded-lg font-semibold md:text-base shadow hover:bg-[#d40055] transition-all">
                            TALK TO SALES
                        </a>
                    </div>
                </section>

            </div>
            <Footer />

        </>
    );
}

