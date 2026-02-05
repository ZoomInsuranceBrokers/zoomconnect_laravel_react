"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
// Utility function for classnames (simple version)
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// StickyScroll component
export const StickyScroll = ({
    content,
    contentClassName,
}) => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
    });

    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const breakpoints = content.map((_, index) => index / cardLength);
        const closest = breakpoints.reduce((acc, point, index) => {
            const distance = Math.abs(latest - point);
            return distance < Math.abs(latest - breakpoints[acc]) ? index : acc;
        }, 0);
        setActiveCard(closest);
    });

    const bgColors = [
        "#6e1e6cff", // deep purple (keep)
        "#4b2066ff", // slightly deeper plum, harmonious
        // "#3a1e4fff"  // deep violet, rich and modern
    ];
    const gradients = [
        "linear-gradient(to bottom right, rgb(6 182 212), rgb(16 185 129))",
        "linear-gradient(to bottom right, rgb(236 72 153), rgb(99 102 241))",
        "linear-gradient(to bottom right, rgb(249 115 22), rgb(234 179 8))",
    ];

    const [bgGradient, setBgGradient] = useState(gradients[0]);

    useEffect(() => {
        setBgGradient(gradients[activeCard % gradients.length]);
    }, [activeCard]);

    return (
        <motion.div
            animate={{
                backgroundColor: bgColors[activeCard % bgColors.length],
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="h-[25rem] md:h-[29rem] overflow-y-auto flex justify-center relative rounded-3xl p-6 md:p-10 bg-slate-900"
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
            }}
            ref={ref}
        >
            <div className="w-full space-y-16 md:space-y-20 lg:space-y-28">
                <style>{`
                    .h-\\[32rem\\]::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {content.map((item, index) => {
                    // Alternate order: even index - text left, odd index - text right
                    const isEven = index % 2 === 0;
                    return (
                        <div
                            key={item.title + index}
                            className={cn(
                                "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-center",
                                isEven ? "" : "lg:flex-row-reverse"
                            )}
                        >
                            {isEven ? (
                                <>
                                    {/* TEXT BLOCK */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: activeCard === index ? 1 : 0.3, x: activeCard === index ? 0 : -40 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    >
                                        <h2 className="text-xl md:text-2xl lg:text-3xl leading-tight md:leading-relaxed font-bold text-slate-100">{item.title}</h2>
                                        <p className="text-sm md:text-base text-slate-300 max-w-md mt-3 md:mt-4">{item.description}</p>
                                    </motion.div>
                                    {/* IMAGE / CONTENT BLOCK */}
                                    <motion.div
                                        style={{ background: '#ffffff30' }}
                                        className={cn("rounded-lg h-48 md:h-56 lg:h-64 w-full overflow-hidden shadow-xl", contentClassName)}
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: activeCard === index ? 1 : 0.3, x: activeCard === index ? 0 : 40 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    >
                                        {item.content}
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    {/* IMAGE / CONTENT BLOCK */}
                                    <motion.div
                                        style={{ background: "#ffffff30" }}
                                        className={cn("rounded-lg h-48 md:h-56 lg:h-64 w-full overflow-hidden shadow-xl", contentClassName)}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: activeCard === index ? 1 : 0.3, x: activeCard === index ? 0 : -40 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    >
                                        {item.content}
                                    </motion.div>
                                    {/* TEXT BLOCK */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 40 }}
                                        animate={{ opacity: activeCard === index ? 1 : 0.3, x: activeCard === index ? 0 : 40 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    >
                                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-100">{item.title}</h2>
                                        <p className="text-sm md:text-base text-slate-300 max-w-md mt-3 md:mt-4">{item.description}</p>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    );
                })}
                <div className="h-8" />
            </div>
        </motion.div>
    );
};
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import ScrollProgressBar from '../../../Components/ScrollProgressBar';

const WellnessPrograms = () => {
    // Features array for cards
    const features = [
        {
            title: 'Talk to a Doctor (GP)',
            desc: 'On-demand GP consultations by video or chat for everyday concerns and quick advice.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 8V7a3 3 0 00-3-3h-1V3a1 1 0 00-1-1h-6a1 1 0 00-1 1v1H6a3 3 0 00-3 3v1a3 3 0 003 3v4a4 4 0 004 4h4a4 4 0 004-4v-4a3 3 0 003-3V11a3 3 0 00-3-3zM9 4h6v2H9V4z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#E9F8FF,#ECF6FF)',
            iconColor: '#3B82F6',
            link: { href: '/login', text: 'Start a consultation →', color: '#3B82F6' },
        },
        {
            title: 'Health Checkups & Lab Tests',
            desc: 'Book routine checkups, diagnostics and screening packages with partner labs and on-site camps.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v7H3zM7 8h2v12H7zM11 4h2v16h-2zM15 10h2v10h-2zM19 1h2v19h-2z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#FFF5F8,#FFF0F6)',
            iconColor: '#EC4899',
            link: { href: '/login', text: 'Book a test →', color: '#EC4899' },
        },
        {
            title: 'Medicine & Pharmacy',
            desc: 'Easy access to medicines, prescription delivery and discounts through trusted pharmacy partners.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2h18zM3 9v10a2 2 0 002 2h14a2 2 0 002-2V9H3z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#E9FFF6,#E8FFFA)',
            iconColor: '#14B8A6',
            link: { href: '/login', text: 'Order medicines →', color: '#14B8A6' },
        },
        {
            title: 'Health Risk Assessment',
            desc: 'Personalised risk scoring and recommendations based on medical history, lifestyle and screenings.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 6h2v6h-2V6zm0 8h2v2h-2v-2z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#FFFBEA,#FFF6D6)',
            iconColor: '#FACC15',
            link: { href: '/login', text: 'Get your assessment →', color: '#FACC15' },
        },
        {
            title: 'Surgical Assistance',
            desc: 'Pre-surgical guidance, network hospital access and postoperative care coordination.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 7h-2V6a3 3 0 00-3-3h-2v2h2a1 1 0 011 1v1h-8V7a1 1 0 011-1h2V4H8a3 3 0 00-3 3v1H3v2h18V9zM6 12v7a2 2 0 002 2h8a2 2 0 002-2v-7H6z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#FFF0F6,#FFEAF3)',
            iconColor: '#EF4444',
            link: { href: '/login', text: 'Learn more →', color: '#EF4444' },
        },
        {
            title: 'Maternity Care Program',
            desc: 'Comprehensive prenatal, delivery and postnatal support programs for employees and families.',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a5 5 0 00-5 5c0 4.418 5 9 5 9s5-4.582 5-9a5 5 0 00-5-5z" />
                </svg>
            ),
            iconBg: 'linear-gradient(135deg,#FFF0F0,#FFF6F6)',
            iconColor: '#EC4899',
            link: { href: '/login', text: 'Explore program →', color: '#EC4899' },
        },
    ];
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    return (
        <>
            <ScrollProgressBar />
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-x-hidden bg-[#ffceea78] text-gray-900 ">

                {/* PREMIUM HERO SECTION - Modern Corporate Wellness */}
                <section className="min-h-screen w-full relative overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 animate-gradient-xy"></div>

                    {/* Floating abstract shapes and blobs */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Floating geometric shapes - hidden on mobile */}
                        <svg className="hidden md:block absolute top-1/4 right-1/4 w-16 h-16 text-blue-400/20 animate-spin-slow" viewBox="0 0 100 100">
                            <polygon points="50,10 90,90 10,90" fill="currentColor" />
                        </svg>

                        <svg className="hidden md:block absolute bottom-1/3 left-1/4 w-12 h-12 text-purple-400/20 animate-bounce-slow" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="currentColor" />
                        </svg>

                        <svg className="hidden md:block absolute top-1/2 right-1/3 w-20 h-16 text-pink-400/15 animate-pulse-slow" viewBox="0 0 100 100">
                            <rect x="20" y="20" width="60" height="60" fill="currentColor" transform="rotate(45 50 50)" />
                        </svg>
                    </div>

                    {/* Main content container */}
                    <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8  md:pt-12 pt-20 md:py-8 lg:py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">

                            {/* Left side - Content */}
                            <div className="space-y-3 md:space-y-4">
                                {/* Main headline */}
                                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold leading-tight font-dmserif">
                                    <span className="text-gray-800 ">
                                        Empowering Employee
                                    </span>
                                    <br />
                                    <span className="text-[#FF0066]/80">
                                        Wellness
                                    </span>
                                </h1>

                                {/* Subheading */}
                                <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl">
                                    Comprehensive health solutions designed for modern teams.
                                </p>

                                {/* CTA Button with glow effect */}
                                <div className="flex items-center gap-6 pt-4">
                                    <button className="group relative px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-[#b740b2] to-[#FF0066]/50 rounded-lg md:rounded-xl text-white font-semibold text-xs md:text-base shadow-md md:shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105">
                                        {/* Glow effect */}
                                        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div> */}

                                        {/* Animated shine */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                        <span className="relative z-10 flex items-center gap-2 ">
                                            Book a Demo
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex items-center gap-4 md:gap-6 lg:gap-8 pt-4 md:pt-6 lg:pt-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm md:text-2xl font-bold text-gray-800">200+</p>
                                            <p className="text-xs md:text-sm text-gray-600">Companies Trust Us</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm md:text-2xl font-bold text-gray-800">100K+</p>
                                            <p className="text-xs md:text-sm text-gray-600">Active Users</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - 3D Illustrations and Icons */}
                            <div className="relative h-[300px] md:h-[450px] lg:h-[600px] pt-6 md:pt-10">
                                {/* Central glassmorphism card */}
                                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 h-96  md:backdrop-blur-xl rounded-3xl p-4 transform hover:scale-105 transition-all duration-500">
                                    {/* Enhanced hero image clarity - larger image */}
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 relative">
                                        <img
                                            src="/assets/images/products/Workspace_Wellness_Harmony_simple.png"
                                            alt="Wellness Dashboard Hero"
                                            className="w-[280px] h-[280px] md:w-[340px] md:h-[340px] lg:w-[420px] lg:h-[420px] object-contain rounded-xl drop-shadow-lg z-10"
                                        />
                                    </div>
                                    {/* Elliptical shadow below image (hidden on mobile) */}
                                    <div
                                        className="hidden md:block absolute left-1/2 -translate-x-1/2 w-[60%] h-4 md:h-8 bg-black/20 rounded-full blur-md z-0"
                                        style={{ filter: 'blur(8px)', bottom: '-2.25rem' }}
                                    />
                                </div>

                                {/* Floating icon cards */}
                                {/* Health Shield - Top Left */}
                                <div className="absolute top-16 left-2 w-8 h-8 md:top-20 md:left-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl flex items-center justify-center animate-float transform hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {/* Heart Rate - Top Right */}
                                <div className="absolute top-20 right-2 w-8 h-8 md:top-24 md:right-24 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl flex items-center justify-center animate-float-delayed transform hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {/* Team Collaboration - Bottom Left */}
                                <div className="absolute bottom-14 left-2 w-8 h-8 md:bottom-40 md:left-14 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl flex items-center justify-center animate-pulse-slow transform hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                </div>

                                {/* Medical Kit - Bottom Right */}
                                <div className="absolute bottom-16 right-2 w-8 h-8 md:bottom-20 md:right-16 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl flex items-center justify-center animate-bounce-slow transform hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5 md:w-10 md:h-10 lg:w-12 lg:h-12 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z" />
                                    </svg>
                                </div>

                                {/* Wellness Badge - Middle Right */}
                                <div className="absolute top-1/2 right-1 w-10 h-10 md:w-20 md:h-20 bg-white/50 backdrop-blur-md rounded-full border border-white/80 shadow-xl flex items-center justify-center animate-float">
                                    <svg className="w-6 h-6 md:w-10 md:h-10 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom wave decoration */}
                    {/* <div className="absolute bottom-0 left-0 right-0 h-20">
                        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M0,0 C300,60 600,60 900,30 C1050,15 1200,0 1200,0 L1200,120 L0,120 Z" fill="white" opacity="0.3"></path>
                            <path d="M0,20 C300,80 600,80 900,50 C1050,35 1200,20 1200,20 L1200,120 L0,120 Z" fill="white" opacity="0.5"></path>
                        </svg>
                    </div> */}
                </section>


                {/* FEATURES SECTION */}
                <section className="w-full relative py-8 md:py-12 lg:py-16">
                    <div className="max-w-6xl mx-auto text-center px-4 md:px-6 relative">
                        <h2 className="text-lg md:text-3xl lg:text-5xl font-dmserif font-semibold text-gray-800 mb-3 md:mb-4">
                            Features of Wellness Programs
                        </h2>
                        <p className="text-gray-800 text-xs md:text-base mb-6 md:mb-8 lg:mb-12 max-w-3xl mx-auto">
                            Comprehensive benefits designed to support physical, mental, and emotional health.
                        </p>

                        <style>{`
                .gmc-card{position:relative;--accent:transparent}
                .gmc-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--accent);transform:scale(0.01);opacity:0;transition:transform 700ms cubic-bezier(.2,.9,.2,1),opacity 700ms ease;z-index:0;pointer-events:none}
                .gmc-card :where(.z-10){position:relative;z-index:10}
                .gmc-card:hover::before,.gmc-card.group:hover::before{transform:scale(1);opacity:1}
            `}</style>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {/* Feature: Talk to Doctor (GP) */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(99,102,241,0.08), rgba(16,185,129,0.08))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(99,102,241,0.03), rgba(16,185,129,0.03))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#E9F8FF,#ECF6FF)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 8V7a3 3 0 00-3-3h-1V3a1 1 0 00-1-1h-6a1 1 0 00-1 1v1H6a3 3 0 00-3 3v1a3 3 0 003 3v4a4 4 0 004 4h4a4 4 0 004-4v-4a3 3 0 003-3V11a3 3 0 00-3-3zM9 4h6v2H9V4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600">Talk to a Doctor (GP)</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">On-demand GP consultations by video or chat for everyday concerns and quick advice.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-blue-600">Start a consultation →</a>
                                </div>
                            </div>

                            {/* Feature: Health Checkups & Lab Tests */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(236,72,153,0.03), rgba(139,92,246,0.03))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#FFF5F8,#FFF0F6)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 13h2v7H3zM7 8h2v12H7zM11 4h2v16h-2zM15 10h2v10h-2zM19 1h2v19h-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600">Health Checkups & Lab Tests</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Book routine checkups, diagnostics and screening packages with partner labs and on-site camps.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-pink-500">Book a test →</a>
                                </div>
                            </div>

                            {/* Feature: Medicine & Pharmacy */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(16,185,129,0.03), rgba(6,182,212,0.03))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#E9FFF6,#E8FFFA)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2h18zM3 9v10a2 2 0 002 2h14a2 2 0 002-2V9H3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-teal-600">Medicine & Pharmacy</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Easy access to medicines, prescription delivery and discounts through trusted pharmacy partners.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-teal-600">Order medicines →</a>
                                </div>
                            </div>

                            {/* Feature: Health Risk Assessment */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(250,204,21,0.08), rgba(249,115,22,0.06))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(250,204,21,0.03), rgba(249,115,22,0.02))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#FFFBEA,#FFF6D6)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 6h2v6h-2V6zm0 8h2v2h-2v-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-yellow-600">Health Risk Assessment</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Personalised risk scoring and recommendations based on medical history, lifestyle and screenings.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-yellow-600">Get your assessment →</a>
                                </div>
                            </div>

                            {/* Feature: Surgical Assistance */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(239,68,68,0.08), rgba(236,72,153,0.06))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(239,68,68,0.03), rgba(236,72,153,0.02))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#FFF0F6,#FFEAF3)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M21 7h-2V6a3 3 0 00-3-3h-2v2h2a1 1 0 011 1v1h-8V7a1 1 0 011-1h2V4H8a3 3 0 00-3 3v1H3v2h18V9zM6 12v7a2 2 0 002 2h8a2 2 0 002-2v-7H6z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-600">Surgical Assistance</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Pre-surgical guidance, network hospital access and postoperative care coordination.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-red-600">Learn more →</a>
                                </div>
                            </div>

                            {/* Feature: Maternity Care Program */}
                            <div className="gmc-card group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 text-center border border-transparent transition-transform duration-300 hover:scale-105" style={{ boxShadow: '0 10px 30px rgba(139,56,134,0.06)', '--accent': 'linear-gradient(120deg, rgba(236,72,153,0.06), rgba(249,115,22,0.06))' }}>
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(120deg, rgba(236,72,153,0.02), rgba(249,115,22,0.02))' }}></div>
                                <div className="relative z-10">
                                    <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg,#FFF0F0,#FFF6F6)' }}>
                                        <svg className="w-5 h-5 md:w-6 md:h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a5 5 0 00-5 5c0 4.418 5 9 5 9s5-4.582 5-9a5 5 0 00-5-5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600">Maternity Care Program</h3>
                                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">Comprehensive prenatal, delivery and postnatal support programs for employees and families.</p>
                                    <a href="/login" className="text-xs md:text-sm font-semibold text-pink-600">Explore program →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* STICKY SCROLL SECTION */}
                <section className="w-full py-6 md:py-8 min-h-screen relative">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="sticky top-0 h-screen flex items-center">
                            <StickyScroll
                                content={[
                                    {
                                        title: "Instant Doctor Consultations – MediBuddy",
                                        description: "Connect instantly with top-rated doctors via video or voice calls. Get expert medical advice anytime, anywhere, directly from the ZoomConnect app.",
                                        content: (
                                            <img
                                                src="/assets/images/products/instant-doc-consultations.png"
                                                alt="MediBuddy Doctor Consultation"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        ),
                                    },
                                    {
                                        title: "General Physician Care – Novel Healthcare",
                                        description: "Access certified general physicians for real-time voice and video consultations. Personalized care, quick diagnoses, and seamless follow-ups at your fingertips.",
                                        content: (
                                            <img
                                                src="/assets/images/products/General-physician.png"
                                                alt="General Physician Consultation"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        ),
                                    },
                                    {
                                        title: "Discounted Lab Tests & Health Checkups",
                                        description: "Book comprehensive health checkups and lab tests at exclusive rates. Receive detailed reports, schedule reminders, and track your wellness progress—all in one app.",
                                        content: (
                                            <img
                                                src="/assets/images/products/Discounted Lab Tests & Health Checkups-Photoroom.png"
                                                alt="Lab Tests & Checkups"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        ),
                                    },
                                    {
                                        title: "Medicine & Pharmacy Services",
                                        description: "Order medicines from trusted pharmacies with doorstep delivery. Enjoy digital prescriptions, discounts, and hassle-free refills through ZoomConnect.",
                                        content: (
                                            <img
                                                src="/assets/images/products/Medicine Services.png"
                                                alt="Medicine & Pharmacy"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        ),
                                    },
                                    {
                                        title: "Corporate Gym Membership Benefit",
                                        description: "Enjoy discounted rates at leading gyms in your city with your corporate wellness plan. Access modern equipment, group classes, and a motivating fitness environment—exclusively for ZoomConnect members.",
                                        content: (
                                            <img
                                                src="/assets/images/products/Gym 1.png"
                                                alt="Corporate Gym Membership"
                                                className="h-full w-full object-contain rounded-lg"
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* MOBILE APP BENEFITS SECTION */}
                <section className=" w-full py-8 md:py-12 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                        {/* Unified Hero: single container with 60/40 split and a purple wavy divider */}
                        <div className="md:col-span-12">
                            <div className="bg-gradient-to-r from-[#fff0f6] to-[#ffe8f2] rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg relative overflow-hidden">
                                {/* optional decorative blob */}
                                <svg className="absolute -left-4 -top-12 opacity-30 z-0" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="110" cy="110" r="110" fill="#ff88ba" />
                                </svg>

                                <svg className="block md:hidden absolute -right-10 -bottom-6 opacity-90 z-0" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="150" cy="150" r="150" fill="#70256eff" />
                                </svg>
                                <svg className="hidden md:block absolute -right-24 -bottom-20 opacity-90 z-0" width="650" height="650" viewBox="0 0 650 650" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="325" cy="325" r="325" fill="#70256eff" />
                                </svg>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    {/* Left: Mobile App Benefits (60%) */}
                                    <div className="md:col-span-7 pr-0 md:pr-4 lg:pr-6 z-10">
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-dmserif font-semibold text-[#1a2433] mb-3 md:mb-4">Wellness on your phone</h2>
                                        <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6">Deliver holistic care to your employees wherever they are — fast, affordable, and frictionless. Our mobile app bundles everyday wellness tools in one place.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FF0066]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <g>
                                                            <rect x="7" y="8" width="10" height="10" rx="3" fill="currentColor" fillOpacity="0.15" />
                                                            <rect x="7" y="8" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                                            <rect x="10" y="4" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.15" />
                                                            <rect x="10" y="4" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                                            <path d="M9 13h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Medicine at Discount</h3>
                                                    <p className="text-xs md:text-sm text-gray-600">Access discounted medications through partner pharmacies and same-day delivery options.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#934790]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm6 2h-1.26A6.002 6.002 0 016.26 16H5a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2a1 1 0 00-1-1z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Video Doctor Consults</h3>
                                                    <p className="text-xs md:text-sm text-gray-600">On-demand or scheduled video calls with licensed doctors for primary care and specialist referrals.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#0066ff]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path d="M7 3v2a2 2 0 0 1-.59 1.41l-2.7 2.7A2 2 0 0 0 3 10.17V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8.83a2 2 0 0 0-.59-1.41l-2.7-2.7A2 2 0 0 1 17 5V3" />
                                                        <rect x="9" y="13" width="6" height="5" rx="1" />
                                                        <path d="M9 13V7a3 3 0 0 1 6 0v6" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Book Lab Tests</h3>
                                                    <p className="text-xs md:text-sm text-gray-600">Schedule diagnostics at partner labs with discounted pricing and home sample collection.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#00b37e]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <circle cx="18" cy="18" r="2" fill="currentColor" fillOpacity="0.15" />
                                                        <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M6 4v6a6 6 0 0 0 12 0V4" stroke="currentColor" strokeWidth="1.5" />
                                                        <path d="M6 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M16 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                        <path d="M12 16v2a4 4 0 0 0 8 0v-2" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm md:text-base font-semibold text-gray-800">Other Wellness Services</h3>
                                                    <p className="text-xs md:text-sm text-gray-600">Health coaching, nutrition plans, mental health support, and tailored wellness programs.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-center md:text-left">
                                            <a href="#features" className="inline-block bg-[#FF0066] text-white font-semibold px-5 py-2 rounded-lg shadow hover:opacity-95 transition">Get the App</a>
                                        </div>
                                    </div>

                                    {/* Right: Corporate Physical Wellness (40%) */}
                                    <div className="md:col-span-5 pl-0 md:pl-4 lg:pl-6 flex justify-center z-10">
                                        <div className=" rounded-2xl p-4 md:p-6 pt-6 md:pt-0 md:pr-4 md:pb-8 md:pl-8 w-full">
                                            <h3 className="text-2xl md:text-xl lg:text-3xl font-semibold text-gray-800 md:text-white mb-2 md:mb-3 font-dmserif">Physical wellness at work</h3>
                                            <p className="text-sm md:text-base text-gray-900 md:text-white mb-3 md:mb-4 leading-tight">Bring wellness to the office with programs that encourage movement, preventive care, and team wellbeing.</p>

                                            <ul className="space-y-3 md:space-y-4">
                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#934790] mt-1">●</span>
                                                    <div>
                                                        <h4 className="text-sm md:text-base font-semibold text-gray-800 md:text-white">Zumba & Group Fitness</h4>
                                                        <p className="text-xs md:text-sm text-gray-800 md:text-white">Energetic sessions led by certified instructors — great for building team morale.</p>
                                                    </div>
                                                </li>

                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#FF0066] mt-1">●</span>
                                                    <div>
                                                        <h4 className="text-sm md:text-base font-semibold text-gray-800 md:text-white">Health Checkup Camps</h4>
                                                        <p className="text-xs md:text-sm text-gray-800 md:text-white">On-site screenings and preventive checks to detect issues early and promote long-term health.</p>
                                                    </div>
                                                </li>

                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#00b37e] mt-1">●</span>
                                                    <div>
                                                        <h4 className="text-sm md:text-base font-semibold text-gray-800 md:text-white">Wellness Challenges</h4>
                                                        <p className="text-xs md:text-sm text-gray-800 md:text-white">Step, hydration, and mindfulness challenges to keep employees engaged and active.</p>
                                                    </div>
                                                </li>
                                            </ul>

                                            {/* <div className="mt-6 flex items-center justify-between">
                                                <a href="#contact" className="text-sm font-semibold text-[#0066ff]">Request an on-site program</a>
                                                <img src="/assets/images/wellness_group.png" alt="group exercise" className="w-24 h-24 object-cover rounded-md shadow-sm" />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            <Footer />
        </>
    );
};

export default WellnessPrograms;
