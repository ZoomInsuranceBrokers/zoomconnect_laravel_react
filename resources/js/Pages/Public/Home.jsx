import CountUp from 'react-countup';

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
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Context/ThemeContext';

export default function Home() {
    // FAQ accordion state
    const [openFaqIdx, setOpenFaqIdx] = useState(null);
    const { darkMode, toggleDarkMode } = useTheme();
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
            <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-6 z-30  dark:bg-gray-900/40  backdrop-blur-lg dark:border-gray-800/60 ">
                <div className="flex items-center">
                    <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect Logo" className="h-8 w-auto" />
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-semibold">
                    <a href="#product" className="hover:text-[#934790] transition">+ Product</a>
                    <a href="#experience" className="hover:text-[#934790] transition">+ Experience</a>
                    <a href="#solutions" className="hover:text-[#934790] transition">+ Solutions</a>
                    <a href="#explore" className="hover:text-[#934790] transition">+ Explore</a>
                    <a href="#company" className="hover:text-[#934790] transition">+ Company</a>
                </nav>
                <div className="flex gap-3 items-center">
                    <button className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-transparent border border-[#934790] text-[#934790] group">
                        <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#934790] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Log In</span>
                    </button>
                    <button className="relative overflow-hidden font-bold px-3 py-1 rounded text-sm shadow transition flex items-center bg-[#934790] text-white group">
                        <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                        <span className="relative z-10">Book a Demo</span>
                    </button>
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
            </header>
            {/* Hero Section */}
            <main className="min-h-screen flex flex-col items-center justify-center w-full z-10">
                <h1 className={`font-dmserif text-4xl md:text-6xl font-normal text-center leading-tight mb-6  ${darkMode ? ' text-white' : ' text-gray-800'}`}>
                    ZoomConnect Is The New<br />
                    Standard of Employee<br />
                    Health Benefits
                </h1>
                <hr className="w-64 border-t-2 border-[#934790] my-4" />
                <p className="text-lg md:text-lg text-center mb-8 ">
                    World class insurance and healthcare, designed to protect your teams and their families.
                </p>
                <button className="relative overflow-hidden font-bold px-8 py-2 rounded-lg text-lg shadow-lg transition flex items-center gap-2 bg-[#934790] text-white group">
                    {/* Animated ellipse background */}
                    <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#6A0066] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                    <span className="relative z-10">Book a Demo</span>
                    <span className="inline-block transform  relative z-10">→</span>
                </button>
            </main>
            {/* Trusted Companies Section */}
            <section className="w-full mb-4 py-16 flex flex-col items-center justify-center ">
                <h2 className="font-montserrat text-2xl md:text-xl text-gray-800 font-semibold text-center  mb-8 max-w-4xl">
                    1000+ top companies in India trust ZoomConnect for their Employee Insurance & Benefits

                </h2>
                {/* Marquee effect for trusted companies */}
                <div className="overflow-hidden w-full max-w-full mx-auto mt-10">
                    <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
                        <img src="/assets/logo/logos for web/Wipro Enterprises Private Limited.png" alt="Wipro Enterprises Private Limited" className="h-12 w-auto" />
                        <img src="/assets/logo/logos for web/PANASONIC ENERGY INDIA COMPANY LIMITED.png" alt="PANASONIC ENERGY INDIA COMPANY LIMITED" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/SASKEN TECHNOLOGIES LIMITED.webp" alt="SASKEN TECHNOLOGIES LIMITED" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/Munjal Showa Limited.webp" alt="Munjal Showa Limited" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/JBM INDUSTRIES LIMITED.png" alt="JBM INDUSTRIES LIMITED" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/ORIENT BELL LIMITED.png" alt="ORIENT BELL LIMITED" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/Sindhuja Microcredit Private Limited.png" alt="Sindhuja Microcredit Private Limited" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/hamdard.png" alt="hamdard" className="h-12 w-auto   brightness-200" />
                        <img src="/assets/logo/logos for web/vivo-1.png" alt="vivo" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/paytm-1.png" alt="paytm" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/noevlhealth tech-1.png" alt="noevlhealth tech" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/lenskart-1.png" alt="lenskart" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/lava-1.png" alt="lava" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/eclerk-1.png" alt="eclerk" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/ccspl-1.png" alt="ccspl" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/apollo-1.png" alt="apollo" className="h-12 w-auto  " />
                        <img src="/assets/logo/logos for web/FUSION MICRO FINANCE LIMITED.png" alt="FUSION MICRO FINANCE LIMITED" className="h-12 w-auto  " />
                    </div>
                </div>
            </section>

            {/* Health Benefits Section */}
            <section className="w-full py-16 flex flex-col items-center justify-center">
                <div className="w-[95%] px-4 bg-[#E8D4B7]/80 rounded-3xl h-[600px] backdrop-blur-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start overflow-hidden h-full">
                        {/* Benefits Grid - Left Side */}
                        <div className="grid grid-cols-3 gap-6 ">
                            {/* Column 1: Up */}
                            <div className=" h-96 flex flex-col items-center">
                                <div className="vertical-marquee-up flex flex-col gap-6">
                                    {/* Repeat cards for seamless loop */}
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Full body<br />health checkups</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Accident<br />Cover</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternal<br />Wellness</h3>
                                    </div>
                                    {/* Duplicate for seamless loop */}
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Full body<br />health checkups</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Accident<br />Cover</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternal<br />Wellness</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Down */}
                            <div className=" h-96 flex flex-col items-center">
                                <div className="vertical-marquee-down flex flex-col gap-6">
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Vision<br />Checkups</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg  flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Surgical <br /> Assistance</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center  hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Medicine</h3>
                                    </div>
                                    {/* Duplicate for seamless loop */}
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Vision<br />Checkups</h3>
                                    </div>
                                    <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Talk to Doctor (Specialists)</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center  text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat text-left">Condition <br /> Management Program</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Up */}
                            <div className=" h-96 flex flex-col items-center">
                                <div className="vertical-marquee-up flex flex-col gap-6">
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Group Medical Cover</h3>
                                    </div>
                                    {/* Duplicate for seamless loop */}
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Lab Tests</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Talk to Doctor (GP)</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-gray-800 text-sm font-medium font-montserrat">Maternity Care Program Comprehensive</h3>
                                    </div>
                                    <div className="bg-white rounded-lg p-6 flex flex-col items-center  hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-40 h-48">
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
                            <p className="text-gray-700 text-md mb-10 max-w-lg text-left">
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
                                        className={`rounded-full border-2 bg-gray-100 border-gray-500 shadow ${i === 1 ? 'w-16 h-16' : 'w-14 h-14'}`}
                                    />
                                    <div>
                                        <div className="text-black font-semibold font-montserrat">{testimonials[idx].name}</div>
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
                        <blockquote className="text-md md:text-xl font-montserrat italic text-white/80  text-center max-w-xl mx-auto transition-all duration-700" key={activeIdx}>
                            “<span style={{ fontWeight: 'bold', fontSize: '1.6em', lineHeight: '1', display: 'inline-block' }}>{testimonials[activeIdx].quote.charAt(0)}</span>{testimonials[activeIdx].quote.slice(1)}”
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Beyond Group Mediclaim Section - Card Grid */}
            <section className="w-full flex flex-col items-center justify-center ">
                <div className="w-full pt-20 pb-48 flex flex-col items-center justify-center bg-gradient-to-b from-[#E8D4B7]/70 via-[#E8D4B7]/50 to-[#E8D4B7]/20">
                    <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-center mb-4 ">Beyond Group Mediclaim</h2>

                    <div className="w-[95%] max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[minmax(110px,1fr)]">
                        {/* First row: 4 cards */}
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4 text-center">
                            {/* Marine Insurance - Ship icon */}
                            <img src="/assets/icons/ship-solid-full.svg" alt="Marine Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter " />
                            <span className="text-gray-800 text-2xl font-semibold mb-2">Marine Insurance</span>
                            <span className="text-gray-800 text-base font-normal">Protect your marine assets with our tailored marine insurance policies, covering both hull and cargo risks.</span>
                        </div>
                        {/* Second row: black card (col-span-2), 2 more cards */}
                        <div className="px-6 py-6 text-center text-base font-montserrat relative col-span-2 flex flex-col items-start justify-start min-h-[110px] ">
                            <p className="text-sm md:text-lg text-gray-800 font-normal text-center mb-10 max-w-3xl ">Zoom Insurance Brokers offers a wide range of insurance solutions tailored to meet your diverse needs. In addition to our comprehensive group mediclaim coverage, we specialize in</p>
                            {/* <div className="mt-6 border-t-2 border-cyan-400 pt-4 text-cyan-200 font-semibold tracking-wide text-base">WHY WE'RE DOING THIS</div> */}
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            {/* Specialty Lines - Settings/Gear icon */}
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/gears-solid-full.svg" alt="Specialty Lines" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Specialty Lines</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Explore our specialized insurance offerings, including aviation, construction, energy, and more.</span>
                        </div>

                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            {/* Trade Credit Insurance - Credit Card/Wallet icon */}
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/credit-card-regular-full.svg" alt="Trade Credit Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Trade Credit Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Mitigate the risk of non-payment from your customers with our trade credit insurance solutions.</span>
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            {/* Cyber Insurance - Cyber/Shield icon */}
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/shield-virus-solid-full.svg" alt="Cyber Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Cyber Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Safeguard your digital assets and protect against cyber threats with our comprehensive cyber insurance coverage.</span>
                        </div>

                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            {/* Reinsurance - Handshake/Agreement icon */}
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/handshake-regular-full.svg" alt="Reinsurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Reinsurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Access specialized reinsurance coverage to manage your risk exposure effectively.</span>
                        </div>
                        <div className="relative rounded-xl shadow-lg overflow-hidden flex flex-col items-start justify-start h-72 min-h-[80px] bg-[#FAF8F1] transition-transform duration-300 hover:scale-105 p-4">
                            {/* Agriculture Insurance - Plant/Leaf icon */}
                            <div className="w-full flex justify-center">
                                <img src="/assets/icons/leaf-solid-full.svg" alt="Agriculture Insurance" className="w-14 h-14 object-contain mb-4 text-gray-800 filter" />
                            </div>
                            <span className="text-gray-800 text-2xl font-semibold mb-2 text-center w-full">Agriculture Insurance</span>
                            <span className="text-gray-800 text-base font-normal text-center w-full">Protect your agricultural operations against various risks with our tailored agriculture insurance solutions.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full flex flex-col items-center justify-center">
                <div className="w-[95%] max-w-5xl flex flex-col md:flex-row gap-8 px-8 items-center rounded-3xl bg-gradient-to-r from-[#b740b2] via-[#FF0066]/50 to-[#ffc03aa8] shadow-lg min-w-[280px] relative top-full -translate-y-1/2" >
                    {/* Left: Gradient Card with Heading */}
                    <div className="flex-1 flex items-center   py-12 ">
                        <div>
                            <h3 className="text-white text-lg md:text-xl font-semibold mb-2">We take</h3>
                            <div className="text-white text-3xl md:text-5xl font-bold leading-tight mb-2">customer<br />satisfaction</div>
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
                        <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-start mb-10 max-w-2xl text-gray-800 sticky top-32">Got questions?<br />We've got answers</h2>

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
            <section className="w-full relative mt-2 pb-0 bg-transparent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#934790] to-[#571754] transform -skew-y-3 origin-top-right shadow-lg"></div>
                <div className="relative z-10 container mx-auto flex flex-col md:flex-row gap-8 items-center min-w-[250px] px-8 py-24">
                    {/* Left: Compliance & Certification Heading */}
                    <div className="flex-1 flex items-center">
                        <div>
                            <h3 className="text-white text-lg md:text-xl font-semibold mb-2">Trust in our</h3>
                            <div className="text-white text-xl md:text-3xl font-bold leading-tight mb-2">Compliance<br />& Certification</div>
                            <div className="text-white text-lg md:text-xl font-medium max-w-xl">when it comes to managing your employee benefits.</div>
                        </div>
                    </div>
                    {/* Right: Stat/Certification Cards */}
                    <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Stat 1: AICPA SOC 2 */}
                        <div className="flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                            <img src="/assets/icons/aicpa-soc2.svg" alt="AICPA SOC 2" className="w-16 h-16 mb-2" />
                            <div className="text-white text-lg font-bold mb-1">AICPA SOC 2</div>
                            <div className="text-white text-base font-medium text-center">certified</div>
                        </div>
                        {/* Stat 2: ISO 27001 */}
                        <div className="flex flex-col items-center justify-center transform hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl mb-2">
                                <img 
                                    src="https://firstplusweb.com/wp-content/uploads/2023/01/iso-27001.png" 
                                    alt="ISO 27001 Information Security Management" 
                                    className="w-20 h-20 object-contain" 
                                />
                            </div>
                            <div className="text-white text-lg font-bold mb-1">ISO 27001</div>
                            <div className="text-white text-base font-medium text-center">Certified</div>
                        </div>
                        {/* Stat 3: ISO 9001 Badge */}
                        <div className="flex flex-col items-center justify-center transform hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-white rounded-full p-4 shadow-lg hover:shadow-xl mb-2">
                                <img 
                                    src="https://www.arenasolutions.com/wp-content/uploads/what-is-iso-9001-compliance.png" 
                                    alt="ISO 9001:2015 Certified" 
                                    className="w-20 h-20 object-contain" 
                                />
                            </div>
                            <div className="text-white text-lg font-bold mb-1">ISO 9001:2015</div>
                            <div className="text-white text-base font-medium text-center">Certified</div>
                        </div>
                        
                        
                    </div>
                </div>
            </section>

        </div>
    );
}