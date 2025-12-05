<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
=======
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
>>>>>>> main
import CountUp from 'react-countup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../Context/ThemeContext';
<<<<<<< HEAD
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from '@inertiajs/react';

// FAQ data for ZoomConnect Employee Dashboard
const faqs = [
    {
        question: "What are the benefits of using this app?",
        answer: (
            <>
                <ul className="list-disc pl-6 space-y-1">
                    <li><b>Convenience:</b> Manage your policy, access e-cards, file claims, and find hospitals – all from your phone.</li>
                    <li><b>Efficiency:</b> File claims on a single tap and track their status in real-time.</li>
                    <li><b>Security:</b> Enjoy a secure platform to access your health information and manage sensitive data.</li>
                    <li><b>Wellness Support:</b> Explore a variety of wellness programs and resources to enhance your well-being.</li>
                    <li><b>Time-Saving:</b> Skip paperwork and long wait times – manage everything on-the-go.</li>
                </ul>
            </>
        )
    },
    {
        question: "How much does it cost to use this app?",
        answer: `The basic features of the app are free to use if you are enrolled as an employee of our corporate client. There might be optional in-app purchases for certain premium services like advanced wellness programs or telemedicine consultations with specific specialists. We'll clearly inform you of any associated costs before you proceed.`
    },
    {
        question: "Where can I find help and support for the app?",
        answer: "We're here to help! If you have any questions or encounter issues using the app, you can drop us an email on support@zoomconnect.co.in"
    },
    {
        question: "How do I file a claim?",
        answer: `Filing a claim is quick and convenient. Go to the 'Claims' section of the app and choose 'File a New Claim.' Follow the on-screen prompts, providing necessary details and uploading any required documents. You can track the status of the filed claims under the 'Claims' sections.`
    },
    {
        question: "How does claim intimation work?",
        answer: `If you are aware of the fact that you or your family members require hospitalization in the near future, you can submit the claim intimation request using the 'Claim Intimation' menu. Not only does this ease the admission and pre-authorization process, but it also helps reduce your overall cost of treatment wherever possible. Once the TPA receives the intimation, they will help you plan everything including choosing a network hospital, opting for discounted packages, if available, and planning for cashless hospitalization.`
    },
    {
        question: "How can I view my policy details and coverage information within the app?",
        answer: "This app is a one-stop solution for all your insurance and wellness needs. It empowers you to manage your health insurance policy, access healthcare services, and improve your overall well-being."
    },
    {
        question: "What is this app for?",
        answer: "This app is a one-stop solution for all your insurance and wellness needs. It empowers you to manage your health insurance policy, access healthcare services, and improve your overall well-being."
    },
    {
        question: "Is this app secure?",
        answer: "Yes, security is our top priority. We implement industry-standard security measures to protect your personal and health information. Your data is encrypted and only authorized personnel can access it."
    }
];
=======
import { FaLinkedinIn, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import Lottie from "lottie-react";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import { FaqSection } from "./Faq";


// Auto-advancing image carousel component
// StickyDiagonalScroll replaces ScrollImageSequence
const StackedScrollImages = () => {
    const containerRef = useRef(null);

    const images = [
        "/assets/images/zoomConnectFeatures/HR overview Static-01.png",
        "/assets/images/zoomConnectFeatures/HR overview Static-02.png",
        "/assets/images/zoomConnectFeatures/HR overview Static-03.png",
        "/assets/images/zoomConnectFeatures/HR overview Static-04.png",
    ];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[300vh] bg-white overflow-hidden flex justify-center"
        >
            <div className="sticky top-0 h-screen w-full flex justify-center items-center">
                <div className="relative w-[600px] max-w-full perspective-1000">
                    {images.map((src, index) => {
                        const totalImages = images.length;
                        const peek = 50; // how much each back image peeks

                        // Start position (stacked with peek)
                        const startY = index * peek;

                        // End position (move up completely off screen)
                        const endY = -peek * (totalImages - index);

                        const y = useTransform(scrollYProgress, [0, 1], [startY, endY]);
                        const rotateX = useTransform(scrollYProgress, [0, 1], [0, -5 * (index + 1)]);
                        const scale = useTransform(scrollYProgress, [0, 1], [1 - index * 0.05, 1 - index * 0.05 + 0.05]);
                        const zIndex = totalImages - index;

                        return (
                            <motion.img
                                key={index}
                                src={src}
                                alt={`Slide ${index + 1}`}
                                style={{
                                    y,
                                    scale,
                                    rotateX,
                                    zIndex,
                                    transformOrigin: "center",
                                }}
                                className="absolute w-full object-contain rounded-xl shadow-2xl"
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

>>>>>>> main

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
<<<<<<< HEAD
            image: "/assets/logo/Best Insurance Broker of the Year.png",
            title: "Best Insurance Broker of the Year",
            subtitle: "Certified",
            hasCircle: false
        },
        {
            image: "/assets/logo/𝐁𝐞𝐬𝐭 𝐂𝐒𝐑 𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐢𝐯𝐞 𝐀𝐰𝐚𝐫𝐝.png",
            title: "𝐁𝐞𝐬𝐭 𝐂𝐒𝐑 𝐈𝐧𝐢𝐭𝐢𝐚𝐭𝐢𝐯𝐞 Award",
            subtitle: "Certified",
            hasCircle: false
=======
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
>>>>>>> main
        }
    ];

    return (
        <section className="w-full relative mt-2 pb-0 bg-transparent overflow-hidden">
<<<<<<< HEAD
            <div className="absolute inset-0 bg-gradient-to-r from-[#934790] to-[#571754] transform -skew-y-3 origin-top-right shadow-lg"></div>
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row gap-8 items-center min-w-[250px] px-8 pt-24 pb-12">
                {/* Left: Compliance & Certification Heading */}
                <div className="flex-1 flex items-center">
                    <div>
                        <h3 className="text-white text-lg md:text-xl font-semibold mb-2">Trust in our</h3>
                        <div className="text-white text-xl md:text-3xl font-bold leading-tight mb-2">
                            Compliance<br className="hidden md:block" />& Certification
                        </div>
                        <div className="text-white text-lg md:text-xl font-medium max-w-xl">
                            when it comes to managing your employee benefits.
=======
            <div className="absolute inset-0 bg-gradient-to-r from-[#934790] to-[#850e7f] transform -skew-y-3 origin-top-right shadow-lg"></div>
            <div className="relative z-10 container mx-auto flex flex-col md:flex-row gap-8 items-center min-w-[250px]h-[400px] px-8 pt-24 pb-16">
                {/* Left: Compliance & Certification Heading */}
                <div className="flex-1 flex items-center">
                    <div>
                        <div className="text-white text-xl md:text-3xl font-bold leading-tight mb-2">
                            Awarded for Innovation.<br />
                            Certified for Trust.
                        </div>
                        <div className="text-white text-lg md:text-base font-extralight max-w-xl">
                            Every accolade we receive and every certification we earn reflects our commitment to secure technology, exceptional service, and uncompromised compliance for organizations and their employees.
>>>>>>> main
                        </div>
                    </div>
                </div>

                {/* Right: Scrolling Carousel */}
<<<<<<< HEAD
                <div className="flex-[2] relative overflow-hidden">
=======
                <div className="flex-[1] relative overflow-hidden">
>>>>>>> main
                    <style>{`
                        @keyframes scroll-left {
                            0% {
                                transform: translateX(0);
                            }
                            100% {
                                transform: translateX(-33.333%);
                            }
                        }
                        .animate-scroll {
                            animation: scroll-left 10s linear infinite;
                        }
                        .animate-scroll:hover {
                            animation-play-state: paused;
                        }
                    `}</style>
<<<<<<< HEAD
                    
                    <div className="flex gap-8 animate-scroll">
                        {/* Render certifications 3 times for seamless loop */}
                        {[...certifications, ...certifications, ...certifications].map((cert, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col items-center justify-center flex-shrink-0 transform transition-all duration-300 min-w-[200px] h-[280px]"
                            >
                                <div className="flex flex-col items-center justify-start h-full">
                                    {cert.hasCircle ? (
                                        <div className="bg-white rounded-full p-4 md:p-2 shadow-lg hover:shadow-xl mb-4">
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-18 h-18 md:w-20 md:h-20 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-4 flex items-center justify-center" style={{ height: '96px' }}>
                                            <img 
                                                src={cert.image} 
                                                alt={cert.title} 
                                                className="w-16 h-16 md:w-20 md:h-20" 
                                            />
                                        </div>
                                    )}
                                    <div className="text-white text-lg md:text-xl font-bold mb-1 text-center">{cert.title}</div>
=======

                    <div className="flex gap-8 animate-scroll">
                        {/* Render certifications 3 times for seamless loop */}
                        {[...certifications, ...certifications, ...certifications].map((cert, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center flex-shrink-0 transform transition-all duration-300 min-w-[200px]"
                            >
                                <div className="flex flex-col items-center justify-start h-full">
                                    {cert.hasCircle ? (
                                        <div className=" rounded-full p-4 md:p-0 hover:shadow-xl mb-4">
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-18 h-18 md:w-24 md:h-24 object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-4 flex items-center justify-center " style={{ height: '96px' }}>
                                            <img
                                                src={cert.image}
                                                alt={cert.title}
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                                            />
                                        </div>
                                    )}
                                    <div className="text-white text-lg md:text-lg font-bold mb-1 text-center">
                                        {cert.title === 'ISO 27001:2022'
                                            ? cert.title
                                            : cert.title.split(' ').length > 1
                                                ? <>{cert.title.split(' ').slice(0, Math.ceil(cert.title.split(' ').length / 2)).join(' ')}<br />{cert.title.split(' ').slice(Math.ceil(cert.title.split(' ').length / 2)).join(' ')}</>
                                                : cert.title}
                                    </div>
>>>>>>> main
                                    <div className="text-white text-base md:text-lg font-medium text-center">{cert.subtitle}</div>
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
    const { darkMode, toggleDarkMode } = useTheme();
<<<<<<< HEAD
    
    // Trusted Companies Logos
    const trustedCompanies = [
        { name: 'Wipro', logo: '/assets/logo/Gray logo/Wipro-01.png', height: 'h-12' },
        { name: 'Panasonic', logo: '/assets/logo/Gray logo/Panasonic-01.png', height: 'h-12' },
=======

    // Trusted Companies Logos
    const trustedCompanies = [
        { name: 'Wipro', logo: '/assets/logo/Gray logo/Wipro-01.png', height: 'h-16' },
        { name: 'Panasonic', logo: '/assets/logo/Gray logo/Panasonic-01.png', height: 'h-16' },
>>>>>>> main
        { name: 'Sasken', logo: '/assets/logo/Gray logo/Sasken-01.png', height: 'h-12' },
        { name: 'Munjal Showa', logo: '/assets/logo/Gray logo/Munjal Showa-01.png', height: 'h-12' },
        { name: 'JBM Group', logo: '/assets/logo/Gray logo/JBM group-01.png', height: 'h-12' },
        { name: 'Orient Bell', logo: '/assets/logo/Gray logo/Orientbell-01.png', height: 'h-20' },
<<<<<<< HEAD
        { name: 'Sindhuja', logo: '/assets/logo/Gray logo/Sindhuja-01.png', height: 'h-12' },
        { name: 'Hamdard', logo: '/assets/logo/Gray logo/Hamdard-01.png', height: 'h-12' },
        { name: 'Vivo', logo: '/assets/logo/Gray logo/Vivo-01.png', height: 'h-12' },
        { name: 'Paytm', logo: '/assets/logo/Gray logo/Paytm-01.png', height: 'h-12' },
        { name: 'Novel Healthtech', logo: '/assets/logo/Gray logo/Novel Healthtech-01.png', height: 'h-12' },
        { name: 'Lenskart', logo: '/assets/logo/Gray logo/Lenskart-01.png', height: 'h-12' },
=======
        { name: 'Sindhuja', logo: '/assets/logo/Gray logo/Sindhuja-01.png', height: 'h-16' },
        { name: 'Hamdard', logo: '/assets/logo/Gray logo/Hamdard-01.png', height: 'h-16' },
        { name: 'Vivo', logo: '/assets/logo/Gray logo/Vivo-01.png', height: 'h-12' },
        { name: 'Paytm', logo: '/assets/logo/Gray logo/Paytm-01.png', height: 'h-12' },
        { name: 'Novel Healthtech', logo: '/assets/logo/Gray logo/Novel Healthtech-01.png', height: 'h-16' },
        // { name: 'Lenskart', logo: '/assets/logo/Gray logo/Lenskart-01.png', height: 'h-16' },
>>>>>>> main
        { name: 'Lava', logo: '/assets/logo/Gray logo/Lava-01.png', height: 'h-12' },
        { name: 'eClerx', logo: '/assets/logo/Gray logo/eClerx-01.png', height: 'h-12' },
        { name: 'CCspl', logo: '/assets/logo/Gray logo/CCspl-01.png', height: 'h-12' },
        { name: 'Apollo', logo: '/assets/logo/Gray logo/apollo logo-01.png', height: 'h-12' },
        { name: 'Fusion', logo: '/assets/logo/Gray logo/Fusion-01.png', height: 'h-12' },
    ];
<<<<<<< HEAD
    
=======

>>>>>>> main
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

<<<<<<< HEAD
    // Navigation links with dropdown items
    const navLinks = [
        { 
            label: 'Product', 
            href: '#product',
            dropdownItems: [
                { label: 'Group Medical Cover', href: '#gmc', description: 'Comprehensive health insurance for your entire team' },
                { label: 'Group Accident Cover', href: '#gpa', description: 'Protection against unforeseen accidents and injuries' },
                { label: 'Wellness Programs', href: '#wellness', description: 'Holistic wellness solutions for employee well-being' },
                { label: 'Telehealth Services', href: '#telehealth', description: 'Virtual healthcare consultations anytime, anywhere' },
            ]
        },
        { 
            label: 'Experience', 
            href: '#experience',
            dropdownItems: [
                { label: 'Employee Platform', href: '#employee', description: 'Easy-to-use dashboard for managing benefits' },
                { label: 'Employer Platform', href: '#employer', description: 'Complete control and insights for HR teams' },
                { label: 'Mobile App', href: '#mobile', description: 'Access your benefits on the go with our app' },
            ]
        },
        { 
            label: 'Solutions', 
            href: '#solutions',
            dropdownItems: [
                { label: 'Small Teams', href: '#small-teams', description: 'Flexible plans designed for startups and SMEs' },
                { label: 'Large Enterprises', href: '#large-teams', description: 'Scalable solutions for large organizations' },
                { label: 'Hybrid Workforce', href: '#hybrid', description: 'Benefits that work for remote and on-site teams' },
            ]
        },
        { 
            label: 'Explore', 
            href: '#explore',
            dropdownItems: [
                { label: 'Resources', href: '#resources', description: 'Guides, whitepapers, and helpful materials' },
                { label: 'Blog', href: '#blog', description: 'Latest insights on employee benefits and wellness' },
                { label: 'Case Studies', href: '#cases', description: 'Success stories from our clients' },
                { label: 'FAQs', href: '#faq', description: 'Find answers to common questions' },
            ]
        },
        { 
            label: 'Company', 
            href: '#company',
            dropdownItems: [
                { label: 'About Us', href: '#about', description: 'Learn about our mission and values' },
                { label: 'Careers', href: '#careers', description: 'Join our growing team of professionals' },
                { label: 'Contact', href: '#contact', description: 'Get in touch with our team' },
            ]
        },
    ];

    // Dropdown hover state
    const [hoveredNav, setHoveredNav] = useState(null);
    const [closeTimeout, setCloseTimeout] = useState(null);
    
    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle smooth dropdown closing with delay
    const handleMouseEnter = (label) => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setHoveredNav(label);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredNav(null);
        }, 150); // 150ms delay before closing
        setCloseTimeout(timeout);
    };

=======
>>>>>>> main
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

<<<<<<< HEAD


    const socialLinks = [
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/company/zoomconnect',
            Icon: FaLinkedinIn,
        },
        {
            label: 'Facebook',
            href: 'https://www.facebook.com/zoomconnect',
            Icon: FaFacebookF,
        },
        {
            label: 'Instagram',
            href: 'https://www.instagram.com/zoomconnect',
            Icon: FaInstagram,
        },
    ];

    const officeCities = ['Gurgaon', 'Bangalore', 'Kolkata', 'Pune', 'Mumbai', 'Chennai', 'Ahemdabad'];
    const currentYear = new Date().getFullYear();
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#efe4ef85] text-gray-900'}`}>
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
            {/* Header */}
            <header className={`fixed top-0 left-0 w-full flex justify-between items-center py-3 px-6 md:py-6 z-30 backdrop-blur-lg dark:border-gray-800/60 transition-all duration-500 ${
                hoveredNav 
                    ? 'bg-[#fff5e5] shadow-lg' 
                    : 'dark:bg-gray-900/40 bg-transparent'
            }`}>
                <Link href="/" className="flex items-center">
                    <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect Logo" className="h-5 w-auto md:h-8 md:w-auto" />
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    {navLinks.map(({ href, label, dropdownItems }) => (
                        <div
                            key={label}
                            className="relative"
                            onMouseLeave={handleMouseLeave}
                        >
                            <a
                                href={href}
                                className="relative inline-flex items-center pb-1 text-[0.75rem] uppercase tracking-[0.12em] text-[#432821] transition-all duration-300 before:content-['+'] before:mr-2 before:text-[#dd4b63] before:text-base before:transition-all before:duration-300 after:absolute after:left-0 after:-bottom-[0.35rem] after:h-[1px] after:w-0 after:bg-[#dd4b63] after:transition-all after:duration-300 hover:text-[#dd4b63] hover:before:content-['−'] hover:after:w-full focus-visible:outline-none"
                                onMouseEnter={() => handleMouseEnter(label)}
                            >
                                {label}
                            </a>
                            
                            {/* Full Screen Dropdown Menu */}
                            {dropdownItems && (
                                <div
                                    className={`fixed left-0 right-0 top-[72px] min-h-[70vh] bg-[#fff5e5]  transition-all duration-300 shadow-md ${
                                        hoveredNav === label
                                            ? 'opacity-100 visible translate-y-0'
                                            : 'opacity-0 invisible -translate-y-4'
                                    }`}
                                    style={{ 
                                        zIndex: 40,
                                        pointerEvents: hoveredNav === label ? 'auto' : 'none'
                                    }}
                                    onMouseEnter={() => handleMouseEnter(label)}
                                >
                                    <div className="container mx-auto px-6 py-12">
                                        <div className="max-w-7xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                                {dropdownItems.map((item, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={item.href}
                                                        className="group p-6 rounded-xl hover:bg-[#dd4b63]/5 transition-all duration-300 border border-transparent hover:border-[#dd4b63]/20"
                                                    >
                                                        <div className="flex items-start gap-4 ">
                                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#dd4b63]/10 flex items-center justify-center group-hover:bg-[#dd4b63] transition-colors duration-300">
                                                                <span className="text-[#dd4b63] group-hover:text-white font-bold text-sm transition-colors duration-300">
                                                                    {idx + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="text-base font-semibold text-gray-800 group-hover:text-[#dd4b63] transition-colors duration-300 mb-2">
                                                                    {item.label}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                                    {item.description || 'Explore our comprehensive solutions'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                            
                                            {/* Optional CTA at the bottom */}
                                            <div className="mt-10 py-8 border-t border-gray-200 absolute bottom-0 left-16 right-10 px-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-800 mb-1">Need help choosing?</h4>
                                                        <p className="text-sm text-gray-600">Talk to our experts to find the perfect solution</p>
                                                    </div>
                                                    <button className="px-6 py-3 bg-[#ff3052] text-white rounded-lg font-semibold hover:bg-[#c43a53] transition-colors duration-300">
                                                        Contact Us
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                
                {/* Desktop Actions - Hidden on Mobile */}
                <div className="hidden md:flex gap-3 items-center">
                    <button className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-transparent border border-[#934790] text-[#934790] group">
                        <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#934790] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Log In</span>
                    </button>
                    <Link 
                        href="/book-demo"
                        className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-[#934790] text-white group"
                    >
                        <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                        <span className="relative z-10">Book a Demo</span>
                    </Link>
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center gap-3 pl-4">
                        {/* <span className="text-xs font-medium font-montserrat">Dark Mode</span> */}
                        <button
                            onClick={toggleDarkMode}
                            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-[#934790]' : 'bg-gray-300'}`}
                        >
                            <span
                                className={`h-5 w-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${darkMode ? 'translate-x-6 bg-[#22223B]' : 'bg-white'}`}
                            >
                                {darkMode ? (
                                    <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </svg>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu Button - Visible only on Mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 text-[#934790] hover:bg-[#934790]/10 rounded-lg transition-colors duration-300"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
            </header>
            
            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed top-[72px] left-0 right-0 bg-white shadow-lg z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
                    <div className="px-6 py-4 space-y-4">
                        {navLinks.map(({ href, label, dropdownItems }) => (
                            <div key={label} className="border-b border-gray-100 pb-4">
                                <a
                                    href={href}
                                    className="block text-base font-semibold text-[#432821] mb-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {label}
                                </a>
                                {dropdownItems && (
                                    <div className="pl-4 space-y-2">
                                        {dropdownItems.map((item, idx) => (
                                            <a
                                                key={idx}
                                                href={item.href}
                                                className="block py-2 text-sm text-gray-600 hover:text-[#dd4b63] transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Mobile Actions */}
                        <div className="pt-4 space-y-3">
                            <button 
                                className="w-full px-4 py-2 border border-[#934790] text-[#934790] rounded font-semibold hover:bg-[#934790] hover:text-white transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log In
                            </button>
                            <Link
                                href="/book-demo"
                                className="block w-full px-4 py-2 bg-[#934790] text-white text-center rounded font-semibold hover:bg-[#7a3677] transition-colors duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Book a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Hero Section */}
            <main className="min-h-screen flex flex-col items-center justify-center  md:w-full z-10 mt-5 relative">
                {/* Background image */}
                <div className="absolute inset-0 z-0 opacity-70">
                    <img 
                        src="/assets/images/wavy lines-01.png" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center px-4 md:px-0">
                    <h1 className={`font-dmserif text-3xl md:text-6xl font-normal text-center leading-tight mb-6  ${darkMode ? ' text-white' : ' text-gray-800'}`}>
                        ZoomConnect Is The New<br className="hidden md:block" />
                        Standard of Employee<br className="hidden md:block" />
                        Health Benefits
                    </h1>
                    <hr className="w-64 border-t-2 border-[#934790] my-4" />
                    <p className="text-base md:text-lg text-center mb-8 ">
                        World class insurance and healthcare, designed to protect your teams and their families.
                    </p>
                    <Link 
                        href="/book-demo"
                        className="relative overflow-hidden font-bold px-4 md:px-8 py-2 rounded-lg text-sm md:text-lg shadow-lg transition flex items-center gap-2 bg-[#934790] text-white group"
                    >
                        {/* Animated ellipse background */}
                        <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                        <span className="relative z-10">Book a Demo</span>
                        <span className="inline-block transform  relative z-10">→</span>
                    </Link>
                </div>
            </main>
            {/* Trusted Companies Section */}
            <section className="w-full mb-4 py-16 flex flex-col items-center justify-center ">
                <h2 className="font-montserrat text-2xl md:text-xl text-gray-800 font-semibold text-center  mb-8 max-w-4xl">
                    1000+ top companies in India trust ZoomConnect for their Employee Insurance & Benefits

                </h2>
                {/* Marquee effect for trusted companies */}
                <div className="overflow-hidden w-full max-w-full mx-auto mt-10">
                    <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
                        {trustedCompanies.map((company, index) => (
                            <img 
                                key={index}
                                src={company.logo} 
                                alt={company.name} 
                                className={`${company.height} w-auto`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Health Benefits Section */}
            <section className="w-full py-16 flex flex-col items-center justify-center">
                <div className="w-[95%] px-4 bg-[#E8D4B7]/80 rounded-3xl h-[600px] backdrop-blur-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start overflow-hidden h-full relative">
                        {/* Benefits Grid - Left Side */}
                        <div className="z-[1] bg-gradient-to-b from-[#E8D4B7]/70 to-transparent h-[70px] absolute top-0 left-0 right-0 rounded-tl-md rounded-tr-md"></div>
                        <div className="z-[1] bg-gradient-to-t from-[#E8D4B7]/70 to-transparent h-[70px] absolute bottom-0 left-0 right-0 rounded-bl-md rounded-br-md"></div>

                        <div className="grid grid-cols-3 gap-6  ">
                            {/* Column 1: Up */}
                            <div className=" h-96 flex flex-col items-center">
                                <div className="vertical-marquee-up flex flex-col gap-6">
                                    {/* Repeat cards for seamless loop */}
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Full body<br />health checkups</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
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
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
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
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
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
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
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
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Medical Cover</h3>
                                    </div>
                                    {/* Duplicate for seamless loop */}
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Lab Tests</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48" style={{ boxShadow: ' 6.7px 13.4px 13.4px hsl(0deg 0% 0% / 0.29)' }}>
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
                        <div className="flex flex-col items-start justify-center h-full w-full py-16">
                            <h2 className="text-4xl md:text-5xl font-dmserif font-medium text-[#2D1836] mb-6 leading-tight text-left ">Health Benefits<br />Simplified</h2>
                            <p className="text-gray-700 text-base mb-10 max-w-lg text-left">
                                At <span className="text-[#934790] font-bold">ZoomConnect</span>, we recognize the vital importance of <span className=" font-semibold">wellness</span> for both individuals and organizations. That’s why we provide a <span className=" font-semibold">comprehensive suite</span> of wellness and value-added services, thoughtfully designed to tackle today’s global health challenges—<span className=" font-bold">all at exclusive discounted rates</span>.
                            </p>

                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="w-full pb-16 flex flex-col items-center justify-center ">
                <h2 className="font-dmserif text-2xl md:text-5xl font-medium text-center mb-8 max-w-3xl text-gray-800">What Our Clients Say</h2>
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
                <div className="w-full pt-20 pb-48 flex flex-col items-center justify-center bg-gradient-to-b from-[#E8D4B7]/70 via-[#E8D4B7]/50 to-[#E8D4B7]/20 beyond-group-section relative">
                    <div className="container mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
                            {/* Left column pinned via GSAP */}
                            <div className="left-content lg:pt-32">
                                <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-gray-800 mb-6">
                                    Beyond Group <br className="hidden md:block" />
                                    Mediclaim
                                </h2>
                                <p className="text-gray-600 text-md mb-8 max-w-lg">
                                    Zoom Insurance Brokers offers a wide range of insurance solutions tailored to meet your diverse needs. In addition to our comprehensive group mediclaim coverage, we specialize in:
                                </p>
                                {/* <img src="/assets/images/Family Insurance Icons.png" alt="Beyond Group Mediclaim" className=" absolute w-40 h-auto" /> */}
                                {/* <button className="bg-transparent border-2 border-[#934790] text-[#934790] px-8 py-3 rounded-lg font-semibold hover:bg-[#934790] hover:text-white transition-all duration-300">
                                LEARN MORE
                            </button> */}
                            </div>

                            {/* Right column cards */}
                            <div className="right-content space-y-12 pb-8">
                                {/* Row 1 - First 2 cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/ship-solid-full.svg" alt="Marine Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Marine Insurance
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Protect your marine assets with our tailored marine insurance policies, covering both hull and cargo risks.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/gears-solid-full.svg" alt="Specialty Lines" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Specialty Lines
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Explore our specialized insurance offerings, including aviation, construction, energy, and more.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2 - Next 2 cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/credit-card-regular-full.svg" alt="Trade Credit Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Trade Credit Insurance
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Mitigate the risk of non-payment from your customers with our trade credit insurance solutions.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/shield-virus-solid-full.svg" alt="Cyber Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Cyber Insurance
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Safeguard your digital assets and protect against cyber threats with our comprehensive cyber insurance coverage.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3 - Last 2 cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/handshake-regular-full.svg" alt="Reinsurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Reinsurance
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Access specialized reinsurance coverage to manage your risk exposure effectively.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                <img src="/assets/icons/leaf-solid-full.svg" alt="Agriculture Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                Agriculture Insurance
                                            </h3>
                                            <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                Protect your agricultural operations against various risks with our tailored agriculture insurance solutions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-center mb-4 ">Beyond Group Mediclaim</h2>

                    <div className="w-[95%] max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[minmax(110px,1fr)]">
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4 text-center">
                            <img src="/assets/icons/ship-solid-full.svg" alt="Marine Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter " />
                            <span className="text-gray-800 text-2xl font-semibold mb-2">Marine Insurance</span>
                            <span className="text-gray-800 text-base font-normal">Protect your marine assets with our tailored marine insurance policies, covering both hull and cargo risks.</span>
                        </div>
                        <div className="px-6 py-6 text-center text-base font-montserrat relative col-span-2 flex flex-col items-start justify-start min-h-[110px] ">
                            <p className="text-sm md:text-lg text-gray-800 font-normal text-center mb-10 max-w-3xl ">Zoom Insurance Brokers offers a wide range of insurance solutions tailored to meet your diverse needs. In addition to our comprehensive group mediclaim coverage, we specialize in</p>
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/gears-solid-full.svg" alt="Specialty Lines" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Specialty Lines</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Explore our specialized insurance offerings, including aviation, construction, energy, and more.</span>
                        </div>

                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/credit-card-regular-full.svg" alt="Trade Credit Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Trade Credit Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Mitigate the risk of non-payment from your customers with our trade credit insurance solutions.</span>
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/shield-virus-solid-full.svg" alt="Cyber Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Cyber Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Safeguard your digital assets and protect against cyber threats with our comprehensive cyber insurance coverage.</span>
                        </div>

                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/handshake-regular-full.svg" alt="Reinsurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Reinsurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Access specialized reinsurance coverage to manage your risk exposure effectively.</span>
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/leaf-solid-full.svg" alt="Agriculture Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Agriculture Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Protect your agricultural operations against various risks with our tailored agriculture insurance solutions.</span>
                        </div>
                    </div> */}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full flex flex-col items-center justify-center">
                <div className="w-[95%] max-w-5xl flex flex-col md:flex-row gap-8 px-8 items-center rounded-3xl bg-gradient-to-r from-[#b740b2] via-[#FF0066]/50 to-[#ffc03aa8] shadow-lg min-w-[280px] relative top-full -translate-y-1/2" >
                    {/* Left: Gradient Card with Heading */}
                    <div className="flex-1 flex items-center   py-12 ">
                        <div>
                            <h3 className="text-white text-lg md:text-xl font-semibold mb-2">We take</h3>
                            <div className="text-white text-3xl md:text-5xl font-bold leading-tight mb-2">customer<br className="hidden md:block" />satisfaction</div>
                            <div className="text-white text-lg md:text-xl font-medium">Very seriously</div>
                        </div>
                    </div>
                    {/* Right: Stat Cards */}
                    <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Stat 1 */}
                        <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-10 py-4 min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                            <div className="text-[#3B0270] text-4xl font-bold mb-2"><CountUp end={1100} suffix="+" enableScrollSpy scrollSpyOnce duration={2} /></div>
                            <div className="text-[#441752] text-base font-semibold mb-1 text-center leading-snug">Trusted Clients and Growing”</div>
                        </div>
                        {/* Stat 2 */}
                        <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-10 py-4 min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                            <div className="text-[#3B0270] text-4xl font-bold mb-2"><CountUp end={90000} suffix="+" enableScrollSpy scrollSpyOnce duration={2} /></div>
                            <div className="text-[#441752] text-base font-semibold mb-1 text-center leading-snug"> Claims Settled Seamlessly</div>
                        </div>
                        {/* Stat 3 */}
                        <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-10 py-4 min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                            <div className="text-[#3B0270] text-4xl font-bold mb-2"><CountUp end={500000} suffix="+" enableScrollSpy scrollSpyOnce duration={2} /></div>
                            <div className="text-[#441752] text-base font-semibold mb-1 text-center leading-snug"> Lives Protected with Trust</div>
                        </div>
                    </div>
                </div>
                <div className="w-[90%] pt-8 pb-16 max-w-6xl mx-auto flex flex-col md:flex-row items-start">
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start justify-center pr-0 md:pr-8">
                        <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-start mb-10 max-w-2xl text-gray-800 sticky top-32">Got questions?<br className="hidden md:block" />We've got answers</h2>

                        <img src="/assets/images/FAQ.png" alt="FAQ Illustration" className="w-48 h-48 md:w-72 md:h-72 object-contain mb-6" />
                    </div>
                    <div className="w-full md:w-2/3 max-w-2xl mx-auto rounded-2xl bg-white p-0 flex flex-col overflow-hidden shadow-md" style={{ boxShadow: '0 2px 25px 0 rgba(0,0,0,0.15), 0 0.5px 6px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)' }} >
                        {/* FAQ List - accordion */}
                        {faqs.map((faq, i) => {
                            const isOpen = openFaqIdx === i;
                            return (
                                <div key={i} className={
                                    `border-b last:border-b-0 border-gray-200 bg-white ` +
                                    (isOpen ? 'rounded-t-xl ' : '')
                                }>
                                    <button
                                        className={`w-full flex items-center justify-between py-4 px-6 text-left cursor-pointer transition  focus:outline-none ${isOpen ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}
                                        onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-panel-${i}`}
                                    >
                                        <span className="text-sm md:text-base ">{faq.question}</span>
                                        <span className={`ml-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900' : ''}`}>
                                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="11" stroke="#E5E7EB" strokeWidth="1" fill="#fff" />
                                                <path d="M8 10l4 4 4-4" stroke={isOpen ? '#111827' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                    </button>
                                    <div
                                        id={`faq-panel-${i}`}
                                        className={`overflow-hidden transition-all duration-400 ease-in-out px-6 bg-gray-100 border-l-4 border-[#b6c7d6]  ${isOpen && faq.answer ? 'max-h-[500px] opacity-100 py-6 mt-[-8px]' : 'max-h-0 opacity-0 py-0 mt-0'}`}
                                        style={{
                                            transitionProperty: 'max-height, opacity, padding, margin-top',
                                        }}
                                    >
                                        {isOpen && faq.answer && (
                                            <span className="block whitespace-pre-line text-sm md:text-base text-gray-500">{faq.answer}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Customer Satisfaction Section - Reference Style with Angle Effect */}
            <CertificationCarousel />

            {/* Schedule a Call CTA */}
            <section className="w-full py-16  relative">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#441752] via-[#571754] to-[#934790] shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 lg:px-16 py-14">
                            <div className="space-y-6">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                                    <span className="inline-block h-2 w-2 rounded-full bg-white/70"></span>
                                    Ready when you are
                                </span>
                                <h2 className="font-dmserif text-3xl md:text-5xl text-white leading-snug">
                                    Unlock bespoke Group Benefits<br className="hidden md:block" /> for your teams
                                </h2>
                                <p className="text-white/80 text-base md:text-md max-w-xl">
                                    Schedule a quick conversation with our benefits specialists or jump straight into a tailored demo. We’ll craft a plan that mirrors your company culture and protects every employee.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/book-demo"
                                        className="px-8 py-3 rounded-xl bg-white text-[#571754] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center inline-block"
                                    >
                                        Book a Demo
                                    </Link>

                                </div>
                            </div>

                            <div className="relative flex justify-center lg:justify-end">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="relative w-full max-w-sm"
                                >
                                    <div className="absolute -top-10 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                                    <div className="absolute -bottom-12 -right-10 h-28 w-28 rounded-full bg-[#FF0066]/30 blur-3xl"></div>
                                    <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c3.866 0 7-1.79 7-4s-3.134-4-7-4-7 1.79-7 4 3.134 4 7 4zm0 0v6" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 14c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-sm">ZoomConnect Advisor</p>
                                                    <p className="text-white font-semibold">Live support</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-white/15 text-white/80">
                                                Online
                                            </span>
                                        </div>
                                        <div className="space-y-4 text-white/80 text-sm">
                                            <div className="flex items-start gap-3">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF9BD2]"></span>
                                                <p>Customise coverage across GMC, GPA, GTL and wellness add-ons.</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD166]"></span>
                                                <p>Compare quotes from top insurers in under 24 hours.</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="mt-1 h-2 w-2 rounded-full bg-[#7AD9FF]"></span>
                                                <p>Dedicated claims desk with proactive SLAs.</p>
                                            </div>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true, amount: 0.6 }}
                                            transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                                            className="mt-8 rounded-xl bg-white/15 px-5 py-4 text-white/90 text-sm"
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


            <footer className='relative w-full mt-24 text-white bg-[#571754]'>
                <div className="absolute inset-0 overflow-hidden">
                    <span className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></span>
                    <span className="absolute top-1/3 right-[-5rem] h-72 w-72 rounded-full bg-[#FF6F91]/20 blur-[120px]"></span>
                    <span className="absolute bottom-[-6rem] left-1/4 h-72 w-72 rounded-full bg-[#7AD9FF]/15 blur-[120px]"></span>
                </div>
                <div className="relative z-10 mx-auto w-full px-6 md:pt-16 lg:px-12">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start">
                        <div className="w-[100%] md:w-[80%] max-w-2xl lg:max-w-none  flex flex-col items-center lg:items-start text-center lg:text-left">
                            <h2 className="mt-6 font-dmserif text-3xl md:text-3xl">
                                Subscribe to People First <br className="hidden md:block" /> Dispatch
                            </h2>
                            <p className="mt-4 max-w-xl text-sm text-white/70">
                                A weekly digest of fresh perspectives, product updates, and resources crafted for people-first teams.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <motion.a
                                    whileHover={{ y: -2 }}
                                    href="https://play.google.com/store/apps/details?id=com.zoomconnect"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3  px-5 py-3 text-left text-white transition "
                                >
                                    <img src="/assets/logo/logos for web/google play-01 1.png" alt="Get it on Google Play" className="h-8 w-auto object-contain" />

                                    <img src="/assets/logo/logos for web/app store-01 1.png" alt="Download on the App Store" className="h-8 w-auto object-contain " />
                                </motion.a>
                            </div>
                        </div>
                        <div className="hidden self-stretch lg:flex lg:justify-center lg:px-10" aria-hidden="true">
                            <div
                                className="h-full w-px self-stretch rounded-full"
                                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.25), rgba(255,255,255,0.05))' }}
                            ></div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:gap-40 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 ">
                            <div className="min-w-[150px]">
                                <div className="flex items-center text-sm font-semibold uppercase  text-white">
                                    {/* <span className="text-base">🛡️</span> */}
                                    <span className="">ZoomConnect </span>
                                </div>
                                <ul className="mt-4 space-y-3 text-xs">
                                    <li>
                                        <a href="#insurance" className="text-white/75  transition-colors hover:text-white">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#product" className="text-white/75 transition-colors hover:text-white">Contact Us</a>
                                    </li>
                                    <li>
                                        <a href="#solutions" className="text-white/75 transition-colors hover:text-white">Privacy Policy</a>
                                    </li>
                                    <li>
                                        <a href="#resources" className="text-white/75 transition-colors hover:text-white">Terms & Conditions</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="min-w-[150px]">
                                <div className="flex items-center text-sm font-semibold uppercase text-white">
                                    {/* <span className="text-base">✨</span> */}
                                    <span className="">Wellness</span>
                                </div>
                                <ul className="mt-4 space-y-3 text-xs">
                                    <li>
                                        <a href="#wellness" className="text-white/75 transition-colors hover:text-white">Wellness Overview</a>
                                    </li>
                                    <li>
                                        <a href="#telehealth" className="text-white/75 transition-colors hover:text-white">Telehealth</a>
                                    </li>
                                    <li>
                                        <a href="#fitness" className="text-white/75 transition-colors hover:text-white">Fitness</a>
                                    </li>
                                    <li>
                                        <a href="#mental-wellness" className="text-white/75 transition-colors hover:text-white">Mental Wellness</a>
                                    </li>
                                    <li>
                                        <a href="#maternity" className="text-white/75 transition-colors hover:text-white">Maternity Box</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="min-w-[150px]">
                                <div className="flex items-center text-sm font-semibold uppercase text-white">
                                    {/* <span className="text-base">🖥️</span> */}
                                    <span className="">Platform</span>
                                </div>
                                <ul className="mt-4 space-y-3 text-xs">
                                    <li>
                                        <a href="#employee-platform" className="text-white/75 transition-colors hover:text-white">Employee</a>
                                    </li>
                                    <li>
                                        <a href="#employer-platform" className="text-white/75 transition-colors hover:text-white">Employer</a>
                                    </li>
                                    <li>
                                        <a href="#integrations" className="text-white/75 transition-colors hover:text-white">Integrations</a>
                                    </li>
                                </ul>

                                <div className="mt-8 flex items-center text-sm font-semibold uppercase  text-white">
                                    {/* <span className="text-base">💡</span> */}
                                    <span className="">Solutions</span>
                                </div>
                                <ul className="mt-4 space-y-3 text-xs">
                                    <li>
                                        <a href="#small-teams" className="text-white/75 transition-colors hover:text-white">Small Teams</a>
                                    </li>
                                    <li>
                                        <a href="#large-teams" className="text-white/75 transition-colors hover:text-white">Large Teams</a>
                                    </li>
                                    <li>
                                        <a href="#hybrid" className="text-white/75 transition-colors hover:text-white">Hybrid Workforce</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="min-w-[150px]">
                                <div className="flex items-center text-sm font-semibold uppercase text-white">
                                    {/* <span className="text-base">📚</span> */}
                                    <span className="">Resources</span>
                                </div>
                                <ul className="mt-4 space-y-3 text-xs">
                                    <li>
                                        <a href="/careers" className="text-white/75 transition-colors hover:text-white">Careers</a>
                                    </li>
                                    <li>
                                        <a href="#company" className="text-white/75 transition-colors hover:text-white">About Us</a>
                                    </li>
                                    <li>
                                        <a href="#contact" className="text-white/75 transition-colors hover:text-white">Contact Us</a>
                                    </li>
                                    <li>
                                        <a href="#faq" className="text-white/75 transition-colors hover:text-white">FAQs</a>
                                    </li>
                                    <li>
                                        <a href="#testimonials" className="text-white/75 transition-colors hover:text-white">Testimonials</a>
                                    </li>
                                    <li>
                                        <a href="#guides" className="text-white/75 transition-colors hover:text-white">Guides & Blogs</a>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div className="mt-14 flex flex-col gap-5 pt-2 lg:flex-col lg:items-center lg:justify-between">
                        <div className="relative w-[100%] md:w-[80%] flex items-center justify-center gap-1 md:gap-6 py-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:h-px before:w-[30%] md:before:w-[35%] before:bg-white/30 after:content-[''] after:absolute after:right-0 after:top-1/2 after:h-px after:w-[30%] md:after:w-[35%] after:bg-white/30">
                            {socialLinks.map(({ label, href, Icon }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ y: -2 }}
                                    className="flex h-8 w-8 items-center justify-center text-white/60 transition hover:text-white"
                                >
                                    <span className="sr-only">{label}</span>
                                    <Icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 text-sm text-white/70 md:flex-row md:items-center md:gap-6">

                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.3em] text-white/50">
                                {officeCities.map((city) => (
                                    <span
                                        key={city}
                                        className="relative before:mr-4 before:text-[0.5rem] before:font-semibold before:text-white/30 before:content-['◆'] first:before:hidden"
                                    >
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="mt-4 w-full flex justify-center" >
                        <img src="/assets/logo/ZOOMCONNECT WITH PEOPLE-02.png" alt="ZoomConnect Logo" className="h-full mt-4" />
                    </div>

                    <div className="mt-10 border-t border-white/40 pt-2 flex flex-col items-center"></div>

                    <div className="mt-2 flex flex-col gap-6 text-xs text-white/45 md:flex-col md:justify-between md:items-center">
                        <div className="leading-relaxed space-y-1 max-w-full text-center md:text-center">
                            <p>
                                <span className="font-semibold text-white/70">Registered & Corporate Office:</span> D-104, Udyog Vihar Phase V, Sector-19, Gurugram, Haryana-122016. CIN: U66000HR2008PTC065899.
                            </p>
                            <p>
                                <span className="font-semibold text-white/70">IRDAI Licence No.: 389.</span> Licence Category: Composite. Licence Expiry: 1st January 2027.
                            </p>
                            <p>
                                Insurance is a subject matter of solicitation.Kindly read all policy related documents and take expert advice before taking any insurance or investment decisions.
                            </p>
                        </div>
                        <div className="md:text-center mb-4">
                            <p className="text-[10px]"> Developed by Novel Healthtech Solutions Pvt. Ltd. </p>
                           <p> © {currentYear} ZoomConnect Private Limited. All rights reserved. </p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
=======
    return (
        <>
            <Header />
            <div className={`min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#ffceea78] text-gray-900'}`}>
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
                <main className="min-h-screen flex flex-col items-center justify-center  md:w-full z-10 mt-5 relative">
                    {/* Background image */}
                    {/* <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                    />
                </div> */}
                    {/* <div className="absolute inset-0 z-0 opacity-70">
                        <img
                            src="/assets/images/wavy lines-01.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div> */}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-4 md:px-0">
                        <h1 className={`font-dmserif text-3xl md:text-6xl font-normal text-center leading-tight mb-6  ${darkMode ? ' text-white' : ' text-gray-800'}`}>
                            Redefining Employee <br className="hidden md:block" />
                            Healthcare & Insurance   Experience
                            {/* <br className="hidden md:block" /> */}

                        </h1>
                        {/* <hr className="w-64 border-t-2 border-[#934790] my-4" /> */}
                        <p className="text-base md:text-lg text-center mb-8 ">
                            From policy access to claims support and wellness services —<br /> ZoomConnect puts everything your employees need in one smart platform.
                        </p>
                        <Link
                            href="/book-demo"
                            className="relative overflow-hidden font-bold px-4 md:px-8 py-2 rounded-lg text-sm md:text-lg shadow-lg transition flex items-center gap-2 bg-[#934790] text-white group"
                        >
                            {/* Animated ellipse background */}
                            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                            <span className="relative z-10">Book a Demo</span>
                            <span className="inline-block transform  relative z-10">→</span>
                        </Link>
                    </div>
                </main>
                {/* Trusted Companies Section */}
                <section className="w-full mb-4 py-16 flex flex-col items-center justify-center ">
                    <h2 className="font-montserrat text-2xl md:text-xl text-gray-800 font-semibold text-center  mb-4 max-w-4xl">
                        Empowering Workforces of 1100+ Companies
                    </h2>
                    <p className="text-sm md:text-base text-center mb-8 md:mb-0 max-w-4xl">Our platform is trusted by industry leaders across manufacturing, IT, FMCG, automotive, healthcare, and more making employee health and insurance simpler and smarter.</p>
                    {/* Infinite Marquee for Trusted Companies */}
                    <div className="infinite-marquee-wrapper mt-10">
                        <div className="infinite-marquee flex items-center gap-16 whitespace-nowrap">
                            {/* Duplicate twice for smooth looping */}
                            {[...trustedCompanies, ...trustedCompanies, ...trustedCompanies].map((company, index) => (
                                <img
                                    key={index}
                                    src={company.logo}
                                    alt={company.name}
                                    className={`${company.height} w-auto object-contain`}
                                />
                            ))}
                        </div>
                    </div>

                </section>

                {/* Health Benefits Section */}
                <section className="w-full py-8 flex flex-col items-center justify-center">
                    <div className="w-[95%] px-4 bg-[#f2d7b3]/70 rounded-3xl h-[600px] backdrop-blur-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start overflow-hidden h-full relative">
                            {/* Benefits Grid - Left Side */}
                            <div className="z-[1] bg-gradient-to-b from-[#f2d7b3]/60 to-transparent h-[70px] absolute top-0 left-0 right-0 rounded-tl-md rounded-tr-md"></div>
                            <div className="z-[1] bg-gradient-to-t from-[#f2d7b3]/60 to-transparent h-[70px] absolute bottom-0 left-0 right-0 rounded-bl-md rounded-br-md"></div>

                            <div className="grid grid-cols-3 gap-6  ">
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
                            <div className="flex flex-col items-start justify-center h-full w-full py-16">
                                <h2 className="text-4xl md:text-5xl font-dmserif font-medium text-[#2D1836] mb-6 leading-tight text-left ">Health Benefits<br />Simplified</h2>
                                <p className="text-gray-700 text-base mb-10 max-w-lg text-left">
                                    At <span className="text-[#934790] font-bold">ZoomConnect</span>, we recognize the vital importance of <span className=" font-semibold">wellness</span> for both individuals and organizations. That’s why we provide a <span className=" font-semibold">comprehensive suite</span> of wellness and value-added services, thoughtfully designed to tackle today’s global health challenges—<span className=" font-bold">all at exclusive discounted rates</span>.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full pb-16 flex flex-col items-center justify-center ">
                    <h2 className="font-dmserif text-2xl md:text-5xl font-medium text-center mb-8 max-w-3xl text-gray-800">What Our Clients Say</h2>
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
                    <div className="w-full pt-20 pb-48 flex flex-col items-center justify-center bg-gradient-to-b from-[#f2d7b3]/70 via-[#f2d7b3]/60 to-transparent beyond-group-section relative">
                        <div className="container mx-auto px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative">
                                {/* Left column pinned via GSAP */}
                                <div className="left-content lg:pt-32">
                                    <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-gray-800 mb-6">
                                        Beyond Group <br className="hidden md:block" />
                                        Mediclaim
                                    </h2>
                                    <p className="text-gray-600 text-md mb-8 max-w-lg">
                                        Zoom Insurance Brokers offers a wide range of insurance solutions tailored to meet your diverse needs. In addition to our comprehensive group mediclaim coverage, we specialize in:
                                    </p>
                                    {/* <img src="/assets/images/Family Insurance Icons.png" alt="Beyond Group Mediclaim" className=" absolute w-40 h-auto" /> */}
                                    {/* <button className="bg-transparent border-2 border-[#934790] text-[#934790] px-8 py-3 rounded-lg font-semibold hover:bg-[#934790] hover:text-white transition-all duration-300">
                                LEARN MORE
                            </button> */}
                                </div>

                                {/* Right column cards */}
                                <div className="right-content space-y-12 pb-8">
                                    {/* Row 1 - First 2 cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/ship-solid-full.svg" alt="Marine Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Marine Insurance
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                    Protect your marine assets with our tailored marine insurance policies, covering both hull and cargo risks.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/gears-solid-full.svg" alt="Specialty Lines" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Specialty Lines
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                    Explore our specialized insurance offerings, including aviation, construction, energy, and more.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 - Next 2 cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 mb-6">
                                                    <img src="/assets/icons/credit-card-regular-full.svg" alt="Trade Credit Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Trade Credit Insurance
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                    Mitigate the risk of non-payment from your customers with our trade credit insurance solutions.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/shield-virus-solid-full.svg" alt="Cyber Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Cyber Insurance
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                    Safeguard your digital assets and protect against cyber threats with our comprehensive cyber insurance coverage.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3 - Last 2 cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/handshake-regular-full.svg" alt="Reinsurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Reinsurance
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                                                    Access specialized reinsurance coverage to manage your risk exposure effectively.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="card bg-white rounded-2xl p-12 shadow-lg hover:shadow-2xl hover:bg-[#934790] group cursor-pointer transition-all duration-700 ease-out transform hover:-translate-y-2">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                                    <img src="/assets/icons/leaf-solid-full.svg" alt="Agriculture Insurance" className="w-8 h-8 object-contain group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4">
                                                    Agriculture Insurance
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
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

                <FaqSection />

                <CertificationCarousel />


                <StackedScrollImages />

                {/* Schedule a Call CTA */}
                <section className="w-full py-16  relative">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#441752] via-[#571754] to-[#934790] shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8 lg:px-16 py-14">
                                <div className="space-y-6">
                                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                                        <span className="inline-block h-2 w-2 rounded-full bg-white/70"></span>
                                        Ready when you are
                                    </span>
                                    <h2 className="font-dmserif text-3xl md:text-5xl text-white leading-snug">
                                        Unlock bespoke Group Benefits<br className="hidden md:block" /> for your teams
                                    </h2>
                                    <p className="text-white/80 text-base md:text-md max-w-xl">
                                        Schedule a quick conversation with our benefits specialists or jump straight into a tailored demo. We’ll craft a plan that mirrors your company culture and protects every employee.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            href="/book-demo"
                                            className="px-8 py-3 rounded-xl bg-white text-[#571754] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center inline-block"
                                        >
                                            Book a Demo
                                        </Link>

                                    </div>
                                </div>

                                <div className="relative flex justify-center lg:justify-end">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="relative w-full max-w-sm"
                                    >
                                        <div className="absolute -top-10 -left-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                                        <div className="absolute -bottom-12 -right-10 h-28 w-28 rounded-full bg-[#FF0066]/30 blur-3xl"></div>
                                        <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c3.866 0 7-1.79 7-4s-3.134-4-7-4-7 1.79-7 4 3.134 4 7 4zm0 0v6" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 14c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c0 2.21 3.134 4 7 4s7-1.79 7-4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/70 text-sm">ZoomConnect Advisor</p>
                                                        <p className="text-white font-semibold">Live support</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-white/15 text-white/80">
                                                    Online
                                                </span>
                                            </div>
                                            <div className="space-y-4 text-white/80 text-sm">
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FF9BD2]"></span>
                                                    <p>Customise coverage across GMC, GPA, GTL and wellness add-ons.</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FFD166]"></span>
                                                    <p>Compare quotes from top insurers in under 24 hours.</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-1 h-2 w-2 rounded-full bg-[#7AD9FF]"></span>
                                                    <p>Dedicated claims desk with proactive SLAs.</p>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true, amount: 0.6 }}
                                                transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                                                className="mt-8 rounded-xl bg-white/15 px-5 py-4 text-white/90 text-sm"
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
>>>>>>> main
    );
}