import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import Lottie from "lottie-react";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { FaqSection } from "./Faq";


// Professional scroll-based image viewer with smooth transitions

// Stacked 3D scroll viewer (non-hijacking): each card occupies a full viewport height so normal
// vertical scrolling brings each card to the center. We transform cards using translate3d and scale
// to create a premium 3D stack effect. Uses a scroll listener + rAF to update transforms directly for performance.



gsap.registerPlugin(ScrollTrigger);

// Certification Carousel Component
const CertificationCarousel = () => {
    const certifications = [
        {
            image: "/assets/logo/iso_logo-2022.png",
            title: "ISO 27001:2022",
            subtitle: "certified",
            hasCircle: true
        },
        {
            image: "/assets/logo/BestBrokers2023.png",
            title: "Best Insurance Broker of the Year",
            // subtitle: "Certified",
            hasCircle: true
        },
        {
            image: "/assets/logo/BestCSR.png",
            title: "Best CSR Initiative Award",
            // subtitle: "Certified",
            hasCircle: true
        }
    ];

    return (
        <section className="w-full relative mt-2 pb-0 bg-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#934790] to-[#850e7f] transform -skew-y-3 origin-top-right shadow-lg"></div>
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row gap-6 items-center min-w-[250px] h-auto md:h-[400px] px-6 md:px-8 pt-16 md:pt-20 pb-8 md:pb-12">
                {/* Left: Compliance & Certification Heading */}
                <div className="flex-1 flex items-center mb-6 md:mb-0">
                    <div>
                        <div className="text-white text-xl md:text-3xl font-bold leading-tight mb-2">
                            Awarded for Innovation.<br />
                            Certified for Trust.
                        </div>
                        <div className="text-white text-lg md:text-base font-extralight max-w-xl">
                            Every accolade we receive and every certification we earn reflects our commitment to secure technology, exceptional service, and uncompromised compliance for organizations and their employees.
                        </div>
                    </div>
                </div>

                {/* Right: Scrolling Carousel */}
                <div className="flex-[1] relative overflow-hidden">
                    <style>{`
                        @keyframes scroll-left {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-33.333%); }
                        }
                        .animate-scroll { animation: scroll-left 10s linear infinite; }
                        .animate-scroll:hover { animation-play-state: paused; }
                    `}</style>

                    <div className="flex gap-4 md:gap-8 md:animate-scroll overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none px-4 md:px-0">
                        {/* Render certifications 3 times for seamless loop */}
                        {[...certifications, ...certifications, ...certifications].map((cert, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center flex-shrink-0 transform transition-all duration-300 min-w-[140px] md:min-w-[200px] snap-start px-2 md:px-0"
                            >
                                <div className="flex flex-col items-center justify-start h-full">
                                    {cert.hasCircle ? (
                                        <div className="rounded-full p-2 md:p-0 hover:shadow-xl mb-3 md:mb-4">
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-20 h-20 md:w-24 md:h-24 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-3 md:mb-4 flex items-center justify-center" style={{ height: '72px' }}>
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                                            />
                                        </div>
                                    )}
                                    <div className="text-white text-base md:text-lg font-bold mb-1 text-center">
                                        {cert.title === 'ISO 27001:2022'
                                            ? cert.title
                                            : cert.title.split(' ').length > 1
                                                ? <>{cert.title.split(' ').slice(0, Math.ceil(cert.title.split(' ').length / 2)).join(' ')}<br />{cert.title.split(' ').slice(Math.ceil(cert.title.split(' ').length / 2)).join(' ')}</>
                                                : cert.title}
                                    </div>
                                    <div className="text-white text-sm md:text-base font-medium text-center">{cert.subtitle}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function Home() {
    // FAQ accordion state
    const [openFaqIdx, setOpenFaqIdx] = useState(null);

    // Trusted Companies Logos
    const trustedCompanies = [
        { name: 'Wipro', logo: '/assets/logo/Gray logo/Wipro-01.png', height: 'h-8 md:h-16' },
        { name: 'Panasonic', logo: '/assets/logo/Gray logo/Panasonic-01.png', height: 'h-8 md:h-16' },
        { name: 'Sasken', logo: '/assets/logo/Gray logo/Sasken-01.png', height: 'h-6 md:h-12' },
        { name: 'Munjal Showa', logo: '/assets/logo/Gray logo/Munjal Showa-01.png', height: 'h-6 md:h-12' },
        { name: 'JBM Group', logo: '/assets/logo/Gray logo/JBM group-01.png', height: 'h-6 md:h-12' },
        { name: 'Orient Bell', logo: '/assets/logo/Gray logo/Orientbell-01.png', height: 'h-10 md:h-20' },
        { name: 'Sindhuja', logo: '/assets/logo/Gray logo/Sindhuja-01.png', height: 'h-8 md:h-16' },
        { name: 'Hamdard', logo: '/assets/logo/Gray logo/Hamdard-01.png', height: 'h-8 md:h-16' },
        { name: 'Vivo', logo: '/assets/logo/Gray logo/Vivo-01.png', height: 'h-6 md:h-12' },
        { name: 'Paytm', logo: '/assets/logo/Gray logo/Paytm-01.png', height: 'h-6 md:h-12' },
        { name: 'Novel Healthtech', logo: '/assets/logo/Gray logo/Novel Healthtech-01.png', height: 'h-8 md:h-16' },
        // { name: 'Lenskart', logo: '/assets/logo/Gray logo/Lenskart-01.png', height: 'h-8 md:h-16' },
        { name: 'Lava', logo: '/assets/logo/Gray logo/Lava-01.png', height: 'h-6 md:h-12' },
        { name: 'eClerx', logo: '/assets/logo/Gray logo/eClerx-01.png', height: 'h-6 md:h-12' },
        { name: 'CCspl', logo: '/assets/logo/Gray logo/CCspl-01.png', height: 'h-6 md:h-12' },
        { name: 'Apollo', logo: '/assets/logo/Gray logo/apollo logo-01.png', height: 'h-6 md:h-12' },
        { name: 'Fusion', logo: '/assets/logo/Gray logo/Fusion-01.png', height: 'h-6 md:h-12' },
    ];

    // Testimonials data
    const testimonials = [
        {
            name: 'Sneha Iyer',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png', // girl icon
            rating: '★★★★★',
            title: 'Super Convenient Claims Process',
            quote: 'Raising a claim through ZoomConnect was a breeze. The steps were clear, the documents were easy to upload, and I received regular updates on my claim status.'
        },
        {
            name: 'Deepika Verma',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png', // girl icon
            rating: '★★★★★',
            title: 'Wellness at My Fingertips',
            quote: 'I used the app to book a teleconsultation for my mother, and the experience was smooth and professional.'
        },
        {
            name: 'Priya Nambiar',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922561.png', // girl icon
            rating: '★★★★★',
            title: 'Reliable and Employee-Friendly',
            quote: 'ZoomConnect has transformed the way our employees engage with their insurance policies. From viewing coverage to accessing network hospitals, it’s reliable and easy to use.'
        },
        {
            name: 'Kunal Thakkar',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', // boy icon
            rating: '★★★★★',
            title: 'Simplifies Wellness Engagement',
            quote: 'Earlier, employees rarely took advantage of wellness benefits. With ZoomConnect, everything is visible and accessible—be it ordering medicines, health check-ups, or teleconsultations.'
        },
        {
            name: 'Amit Kulkarni',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', // boy icon
            rating: '★★★★★',
            title: 'Efficient Policy Management',
            quote: 'We’ve been able to switch TPAs and insurers smoothly without any disruption in service—thanks to ZoomConnect’s unified platform and seamless integration with our HRMS.'
        },
        {
            name: 'Vikram Chopra',
            img: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', // boy icon
            rating: '★★★★★',
            title: 'Easy E-Card Download',
            quote: 'I needed my health insurance e-card urgently during a hospital visit, and ZoomConnect saved the day. I downloaded it instantly through the app—no emails, no waiting. It’s so convenient to have everything I need right at my fingertips.'
        },
    ];

    // Animation state
    const [activeIdx, setActiveIdx] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIdx(idx => (idx + 1) % testimonials.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Scroll-triggered pinning and card reveals for the Beyond section
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const cards = gsap.utils.toArray('.card').map((card) =>
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

        const mm = ScrollTrigger.matchMedia({
            '(min-width: 1024px)': () => {
                const section = document.querySelector('.beyond-group-section');
                const left = section?.querySelector('.left-content');
                const right = section?.querySelector('.right-content');

                if (!section || !left || !right) return undefined;

                const pinTrigger = ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${Math.max(0, right.scrollHeight - window.innerHeight)}`,
                    pin: left,
                    scrub: true,
                    anticipatePin: 1,
                });

                return () => pinTrigger.kill();
            },
        });

        ScrollTrigger.refresh();

        return () => {
            cards.forEach((tween) => {
                tween.scrollTrigger?.kill();
                tween.kill();
            });
            mm.revert();
        };
    }, []);

    // Arc positions for 3 visible avatars
    const arcPositions = [
        { left: '-2px', top: '32px' }, // top
        { left: '56px', top: '170px' }, // middle
        { left: '-2px', top: '308px' }, // bottom
    ];
    // Get indices for 3 visible avatars (active in middle)
    const getArcIndices = () => {
        const prev = (activeIdx + testimonials.length - 1) % testimonials.length;
        const next = (activeIdx + 1) % testimonials.length;
        return [prev, activeIdx, next];
    };
    const arcIndices = getArcIndices();

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-hidden bg-[#ffceea78] text-gray-900">
                {/* Starry background effect (simple SVG or CSS) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* You can use a star SVG, animated canvas, or just a gradient for demo */}
                    <svg width="100%" height="100%" className="absolute inset-0" style={{ opacity: 0.2 }}>
                        <circle cx="20%" cy="30%" r="1.5" fill="white" />
                        <circle cx="60%" cy="70%" r="1" fill="white" />
                        <circle cx="80%" cy="20%" r="2" fill="white" />
                        <circle cx="40%" cy="80%" r="1.2" fill="white" />
                        {/* ...more stars... */}
                    </svg>
                </div>

                {/* Hero Section */}
                <main className="min-h-screen flex flex-col items-center justify-center w-full z-10 mt-2 md:mt-5 relative">
                    {/* Background image */}
                    {/* <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                    />
                </div> */}
                    <div className="absolute inset-0 z-0 opacity-70">
                        <img
                            src="/assets/images/wavy lines-01.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-3 md:px-0">
                        <h1 className="font-dmserif text-2xl md:text-6xl font-normal text-center leading-tight mb-3 md:mb-6 text-gray-800">
                            Redefining Employee <br className="hidden md:block" />
                            Healthcare & Insurance Experience
                            {/* <br className="hidden md:block" /> */}

                        </h1>
                        {/* <hr className="w-64 border-t-2 border-[#934790] my-4" /> */}
                        <p className="text-sm md:text-lg text-center mb-4 md:mb-8 max-w-2xl">
                            From policy access to claims support and wellness services —<br /> ZoomConnect puts everything your employees need in one smart platform.
                        </p>
                        <Link
                            href="/book-demo"
                            className="relative overflow-hidden font-bold px-4 md:px-8 py-2 rounded-lg text-xs md:text-lg shadow-lg transition flex items-center gap-2 bg-[#934790] text-white group"
                        >
                            {/* Animated ellipse background */}
                            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                            <span className="relative z-10">Book a Demo</span>
                            <span className="inline-block transform relative z-10">→</span>
                        </Link>
                    </div>
                </main>
                {/* Trusted Companies Section */}
                <section className="w-full mb-4 py-8 md:py-16 flex flex-col items-center justify-center px-4">
                    <h2 className="font-montserrat text-lg md:text-2xl text-gray-800 font-semibold text-center mb-3 md:mb-4 max-w-4xl leading-tight drop-shadow-lg">
                        Empowering Workforces of 1100+ Companies
                    </h2>
                    <p className="text-xs md:text-base text-center mb-4 md:mb-8 max-w-4xl">Our platform is trusted by industry leaders across manufacturing, IT, FMCG, automotive, healthcare, and more making employee health and insurance simpler and smarter.</p>
                    {/* Infinite Marquee for Trusted Companies */}
                    <div className="infinite-marquee-wrapper mt-2 md:mt-10 w-full">
                        <div className="infinite-marquee flex items-center gap-3 md:gap-16 whitespace-nowrap">
                            {/* Duplicate twice for smooth looping */}
                            {[...trustedCompanies, ...trustedCompanies, ...trustedCompanies].map((company, index) => (
                                <img
                                    key={index}
                                    src={company.logo}
                                    alt={company.name}
                                    className={`${company.height} w-auto object-contain scale-75 md:scale-100 origin-center`}
                                />
                            ))}
                        </div>
                    </div>

                </section>

                {/* Health Benefits Section */}
                <section className="w-full py-4 md:py-8 flex flex-col items-center justify-center">
                    <div className="w-[95%] px-4 bg-[#f2d7b3]/70 rounded-3xl backdrop-blur-lg">
                        
                        {/* Mobile View */}
                        <div className="md:hidden py-8">
                            {/* Heading First on Mobile */}
                            <div className="mb-8 px-2">
                                <h2 className="text-2xl font-dmserif font-medium text-[#2D1836] mb-4 leading-tight">Health Benefits<br />Simplified</h2>
                                <p className="text-gray-700 text-xs">
                                    Comprehensive wellness services designed for today's health challenges—<span className="font-bold">all at exclusive discounted rates</span>.
                                </p>
                            </div>

                            {/* Horizontal Scrolling Cards */}
                            <div className="relative overflow-hidden">
                                {/* Gradient Overlays for Horizontal Scroll */}
                                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f2d7b3]/70 to-transparent z-10 pointer-events-none"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f2d7b3]/70 to-transparent z-10 pointer-events-none"></div>
                                
                                {/* Row 1: Left to Right */}
                                <div className="mb-6 overflow-hidden">
                                    <div className="horizontal-marquee-right flex gap-3 whitespace-nowrap">
                                        {/* Repeat cards for seamless loop */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Full body<br />health checkups</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Group Accident<br />Cover</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Maternal<br />Wellness</h3>
                                        </div>
                                        {/* Duplicate for seamless loop */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Full body<br />health checkups</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Group Accident<br />Cover</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Maternal<br />Wellness</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Right to Left */}
                                <div className="overflow-hidden">
                                    <div className="horizontal-marquee-left flex gap-3 whitespace-nowrap">
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Vision<br />Checkups</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Surgical<br />Assistance</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Medicine</h3>
                                        </div>
                                        {/* Duplicate for seamless loop */}
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Vision<br />Checkups</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Surgical<br />Assistance</h3>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-24 h-28 flex-shrink-0" style={{ boxShadow: '6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 font-semibold font-montserrat text-center" style={{ fontSize: '10px' }}>Medicine</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop View - Original Layout */}
                        <div className="hidden md:grid md:grid-cols-2 gap-20 items-start overflow-hidden h-[600px] relative">
                            {/* Benefits Grid - Left Side */}
                            <div className="z-[1] bg-gradient-to-b from-[#f2d7b3]/60 to-transparent h-[70px] absolute top-0 left-0 right-0 rounded-tl-md rounded-tr-md"></div>
                            <div className="z-[1] bg-gradient-to-t from-[#f2d7b3]/60 to-transparent h-[70px] absolute bottom-0 left-0 right-0 rounded-bl-md rounded-br-md"></div>

                            <div className="grid grid-cols-3 gap-6">
                                {/* Column 1: Up */}
                                <div className=" h-96 flex flex-col items-center">
                                    <div className="vertical-marquee-up flex flex-col gap-6">
                                        {/* Repeat cards for seamless loop */}
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Full body<br />health checkups</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Accident<br />Cover</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternal<br />Wellness</h3>
                                        </div>
                                        {/* Duplicate for seamless loop */}
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Full body<br className="hidden md:block" />health checkups</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Accident<br className="hidden md:block" />Cover</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternal<br className="hidden md:block" />Wellness</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Down */}
                                <div className=" h-96 flex flex-col items-center">
                                    <div className="vertical-marquee-down flex flex-col gap-6">
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Vision<br className="hidden md:block" />Checkups</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg  flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Surgical <br className="hidden md:block" /> Assistance</h3>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center  hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Medicine</h3>
                                        </div>
                                        {/* Duplicate for seamless loop */}
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Vision<br className="hidden md:block" />Checkups</h3>
                                        </div>
                                        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Talk to Doctor (Specialists)</h3>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center  text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat text-left">Condition <br className="hidden md:block" /> Management Program</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Up */}
                                <div className=" h-96 flex flex-col items-center">
                                    <div className="vertical-marquee-up flex flex-col gap-6">
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Medical Cover</h3>
                                        </div>
                                        {/* Duplicate for seamless loop */}
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Lab Tests</h3>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.6px 13.3px 13.3px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Talk to Doctor (GP)</h3>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternity Care Program Comprehensive</h3>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 flex flex-col items-center  hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-gray-800 text-sm font-medium font-montserrat">Medicine</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Content - Right Side */}
                            <div className="flex flex-col items-start justify-center h-full w-full py-12 px-4 md:py-16 md:px-0">
                                <h2 className="text-xl md:text-5xl font-dmserif font-medium text-[#2D1836] mb-4 md:mb-6 leading-tight text-left">Health Benefits<br />Simplified</h2>
                                <p className="text-gray-700 text-xs md:text-base mb-8 max-w-lg text-left">
                                    At <span className="text-[#934790] font-bold">ZoomConnect</span>, we provide a curated suite of wellness and value-added services—<span className=" font-bold">at exclusive discounted rates</span>.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full pb-16 flex flex-col items-center justify-center pt-12 ">
                    <h2 className="font-dmserif text-2xl md:text-5xl font-medium text-center mb-4 md:mb-8 max-w-3xl text-gray-800">What Our Clients Say</h2>
                    <div className="w-[90%] max-w-6xl mx-auto rounded-3xl bg-white-300 flex flex-col md:flex-row items-stretch overflow-hidden" style={{ boxShadow: '0 10px 32px 0 rgba(0,0,0,0.15), 0 1.5px 6px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)' }}>
                        {/* Left: Semicircle Testimonial List */}
                        <div className="md:w-1/2 w-full relative flex items-center justify-center min-h-[420px] bg-white/30 ">
                            {/* Semicircle SVG Path */}
                            <svg width="120" height="360" viewBox="0 0 120 360" className="absolute left-8 top-8 hidden md:block" style={{ zIndex: 1 }}>
                                <path d="M10 40 Q120 180 10 320" stroke="#D1D5DB" strokeWidth="3" fill="none" />
                            </svg>
                            {/* Avatars and Info on Path */}
                            <div className="absolute left-4 top-0 w-full h-full" style={{ zIndex: 2 }}>
                                {arcIndices.map((idx, i) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-4 transition-all duration-700 ${i === 1 ? 'scale-110 z-10' : 'opacity-80 z-0'}`}
                                        style={{
                                            position: 'absolute',
                                            left: arcPositions[i].left,
                                            top: arcPositions[i].top,
                                            filter: i === 1 ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))' : 'none',
                                            transition: 'all 0.7s ease-in-out',
                                        }}
                                    >
                                        <img
                                            src={testimonials[idx].img}
                                            alt={testimonials[idx].name}
                                            className={`rounded-full border-2 bg-gray-100 border-gray-500 shadow ${i === 1 ? 'w-20 h-20' : 'w-14 h-14'}`}
                                        />
                                        <div>
                                            <div className="text-black font-semibold font-montserrat">{testimonials[idx].name}</div>
                                            <div className="mt-6 h-px w-full bg-white/20"></div>

                                            <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">

                                                {testimonials[idx].rating}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right: Large Quote */}
                        <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-10 bg-[#934790]">
                            <blockquote className="text-md md:text-lg font-montserrat italic text-white/80  text-center max-w-xl mx-auto transition-all duration-700" key={activeIdx}>
                                “<span style={{ fontWeight: 'bold', fontSize: '1.5em', lineHeight: '1', display: 'inline-block' }}>{testimonials[activeIdx].quote.charAt(0)}</span>{testimonials[activeIdx].quote.slice(1)}”
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* Beyond Group Mediclaim Section - Card Grid */}
                <section className="w-full flex flex-col items-center justify-center ">
                    <div className="w-full py-10 md:pt-20 md:pb-48 flex flex-col items-center justify-center bg-gradient-to-b from-[#f2d7b3]/70 via-[#f2d7b3]/60 to-transparent beyond-group-section relative">
                        <div className="container mx-auto px-2 md:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-16 items-start relative">
                                {/* Left column pinned via GSAP */}
                                <div className="left-content md:px-0 px-6 lg:pt-32">
                                    <h2 className="font-dmserif text-2xl md:text-5xl font-medium text-gray-800 md:mb-6 mb-2">
                                        Beyond Group <br className="hidden md:block" />
                                        Mediclaim
                                    </h2>
                                    <p className="text-gray-600 text-xs md:text-base mb-8 max-w-lg leading-tight md:leading-relaxed">
                                        Zoom Insurance Brokers offers a wide range of insurance solutions tailored to meet your diverse needs. In addition to our comprehensive group mediclaim coverage, we specialize in:
                                    </p>
                                    {/* <img src="/assets/images/Family Insurance Icons.png" alt="Beyond Group Mediclaim" className=" absolute w-40 h-auto" /> */}
                                    {/* <button className="bg-transparent border-2 border-[#934790] text-[#934790] px-8 py-3 rounded-lg font-semibold hover:bg-[#934790] hover:text-white transition-all duration-300">
                                LEARN MORE
                            </button> */}
                                </div>

                                {/* Right column cards */}
                                <div className="right-content space-y-10 pb-8 px-0 md:px-0 md:pb-8 md:p-10">
                                    {/* Row 1 - First 2 cards */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-8">
                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/ship-solid-full.svg" alt="Marine Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Marine Insurance
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Protect your marine assets with our tailored marine insurance policies, covering both hull and cargo risks.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/gears-solid-full.svg" alt="Specialty Lines" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Specialty Lines
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Explore our specialized insurance offerings, including aviation, construction, energy, and more.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 - Next 2 cards */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-8">
                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/credit-card-regular-full.svg" alt="Trade Credit Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Trade Credit Insurance
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Mitigate the risk of non-payment from your customers with our trade credit insurance solutions.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/shield-virus-solid-full.svg" alt="Cyber Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Cyber Insurance
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Safeguard your digital assets and protect against cyber threats with our comprehensive cyber insurance coverage.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3 - Last 2 cards */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-8">
                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/handshake-regular-full.svg" alt="Reinsurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Reinsurance
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Access specialized reinsurance coverage to manage your risk exposure effectively.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-4 md:p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/leaf-solid-full.svg" alt="Agriculture Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-sm md:text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-2 md:mb-4">
                                                    Agriculture Insurance
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                                                    Protect your agricultural operations against various risks with our tailored agriculture insurance solutions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>

                <div id="faq">
                    <FaqSection />
                </div>

                <CertificationCarousel />


                {/* <StackedScrollImages /> */}

                {/* Schedule a Call CTA */}
                <section className="w-full py-8 md:py-16 relative">
                    <div className="container mx-auto px-4 md:px-6 lg:px-12">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#441752] via-[#571754] to-[#934790] shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center px-6 md:px-8 lg:px-16 py-8 md:py-14">
                                <div className="space-y-4 md:space-y-6">
                                    <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                                        <span className="inline-block h-2 w-2 rounded-full bg-white/70"></span>
                                        Ready when you are
                                    </span>
                                    <h2 className="font-dmserif text-2xl md:text-5xl text-white leading-snug">
                                        Unlock bespoke Group Benefits<br className="hidden md:block" /> for your teams
                                    </h2>
                                    <p className="text-white/80 text-sm md:text-base max-w-xl">
                                        Schedule a quick conversation with our benefits specialists or jump straight into a tailored demo. We’ll craft a plan that mirrors your company culture and protects every employee.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                        <Link
                                            href="/book-demo"
                                            className="px-6 md:px-8 py-2 md:py-3 rounded-xl bg-white text-[#571754] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center inline-block text-sm md:text-base"
                                        >
                                            Book a Demo
                                        </Link>

                                    </div>
                                </div>

                                <div className="relative flex justify-center lg:justify-end mt-6 md:mt-0">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="relative w-full max-w-xs md:max-w-sm"
                                    >
                                        <div className="absolute -top-8 -left-4 h-20 w-20 md:h-24 md:w-24 rounded-full bg-white/10 blur-2xl"></div>
                                        <div className="absolute -bottom-10 -right-6 h-20 w-20 md:h-28 md:w-28 rounded-full bg-[#FF0066]/30 blur-3xl"></div>
                                        <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-4 md:p-6 shadow-xl">
                                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c3.866 0 7-1.79 7-4s-3.134-4-7-4-7 1.79-7 4 3.134 4 7 4zm0 0v6" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 14c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-xs md:text-sm">ZoomConnect Advisor</p>
                                                        <p className="text-white font-semibold text-sm md:text-base">Live support</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-wide px-2 md:px-3 py-1 rounded-full bg-white/15 text-white/80 flex-shrink-0">
                                                    Online
                                                </span>
                                            </div>
                                            <div className="space-y-3 md:space-y-4 text-white/80 text-xs md:text-sm">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FF9BD2] flex-shrink-0"></span>
                                                    <p>Customise coverage across GMC, GPA, GTL and wellness add-ons.</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD166] flex-shrink-0"></span>
                                                    <p>Compare quotes from top insurers in under 24 hours.</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#7AD9FF] flex-shrink-0"></span>
                                                    <p>Dedicated claims desk with proactive SLAs.</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true, amount: 0.6 }}
                                                transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                                                className="mt-4 md:mt-8 rounded-xl bg-white/15 px-4 md:px-5 py-3 md:py-4 text-white/90 text-xs md:text-sm"
                                            >
                                                "ZoomConnect took us from fragmented benefits to a unified employee experience in weeks."
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}