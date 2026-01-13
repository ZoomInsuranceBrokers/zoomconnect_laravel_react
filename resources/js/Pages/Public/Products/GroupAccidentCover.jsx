import React from 'react';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import ScrollProgressBar from '../../../Components/ScrollProgressBar';

export default function GroupAccidentCover() {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="16" width="48" height="40" rx="4" fill="#FFE5F0" />
                    <rect x="8" y="16" width="48" height="12" rx="4" fill="#FF0066" fillOpacity="0.3" />
                    <rect x="16" y="32" width="8" height="16" rx="2" fill="#FF0066" fillOpacity="0.4" />
                    <rect x="28" y="36" width="8" height="12" rx="2" fill="#FF0066" fillOpacity="0.5" />
                    <rect x="40" y="28" width="8" height="20" rx="2" fill="#FF0066" fillOpacity="0.6" />
                    <circle cx="20" cy="20" r="2" fill="currentColor" />
                    <circle cx="28" cy="20" r="2" fill="currentColor" />
                    <circle cx="36" cy="20" r="2" fill="currentColor" />
                </svg>
            ),
            title: '24/7 Accident Coverage',
            desc: 'Comprehensive protection for accidental injuries and emergencies.',
            iconBg: '#ffbf3f',
            iconColor: '#ffbf3f'
        },
        {
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 8L12 16v12c0 12.5 8.5 24 20 28 11.5-4 20-15.5 20-28V16L32 8z" fill="#F3E5F5" />
                    <path d="M32 12L16 18v10c0 10 7 19 16 22 9-3 16-12 16-22V18L32 12z" fill="#6A0066" fillOpacity="0.15" />
                    <path d="M28 32l4 4 8-8" stroke="#6A0066" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="32" cy="32" r="12" stroke="#6A0066" strokeWidth="2" fill="none" opacity="0.3" />
                </svg>
            ),
            title: 'Emergency Assistance',
            desc: '24/7 support for medical emergencies and ambulance services.',
            iconBg: '#d8fbe9',
            iconColor: '#d8fbe9'
        },
        {
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="8" width="28" height="48" rx="6" fill="#F0E6F5" />
                    <rect x="18" y="8" width="28" height="8" rx="4" fill="#934790" fillOpacity="0.3" />
                    <rect x="24" y="20" width="16" height="2" rx="1" fill="#934790" fillOpacity="0.4" />
                    <rect x="24" y="26" width="16" height="2" rx="1" fill="#934790" fillOpacity="0.3" />
                    <rect x="24" y="32" width="12" height="2" rx="1" fill="#934790" fillOpacity="0.3" />
                    <circle cx="32" cy="44" r="6" fill="currentColor" fillOpacity="0.2" />
                    <path d="M29 44l2 2 4-4" stroke="#934790" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: 'Disability Benefits',
            desc: 'Financial support for temporary or permanent disabilities.',
            iconBg: '#FFB8E0',
            iconColor: '#FFB8E0'
        }
    ];

    return (
        <>
            <ScrollProgressBar />
            <Header />
            {/* Prevent any page-level horizontal overflow (safety fallback) */}
            <style>{`html,body{overflow-x:hidden !important;}`}</style>
            {/*
                gmc-card pseudo-element fills the card with the feature's pastel color (set via --accent).
                Uses transform scale for a smooth fill animation and keeps content above the color using z-index.
            */}
            <style>{`.
                .gmc-card{position:relative;--accent:transparent}
                .gmc-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--accent);transform:scale(0.01);opacity:0;transition:transform 700ms cubic-bezier(.2,.9,.2,1),opacity 700ms ease;z-index:0;pointer-events:none}
                .gmc-card :where(.z-10){position:relative;z-index:10}
                .gmc-card:hover::before,.gmc-card.group:hover::before{transform:scale(1);opacity:1}
            `}</style>
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-x-hidden bg-[#ffceea78] text-gray-900">

                {/* HERO SECTION */}
                <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0  opacity-70">
                        <img
                            src="/assets/images/wavy design-01.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="max-w-7xl z-10 px-8 pt-12 pb-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-5">
                            <h1 className="text-4xl md:text-5xl font-dmserif font-semibold leading-tight text-gray-800">
                                Comprehensive <span className="text-[#FF0066]/80">Group Accident Cover</span>
                            </h1>
                            <p className="text-sm md:text-base opacity-90">
                                Accident insurance that gives your employees reliable protection and fast emergency assistance.                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="/book-demo" className="bg-[#FF0066]/80 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-[#df0059cc] transition">Schedule a Call</a>
                                <a href="/contact" className="border border-[#E8D4B7] bg-[#934790] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#6a0066] transition">Contact Us</a>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="relative overflow-hidden w-80 md:w-[750px] p-6">
                                <img className="w-full h-full object-cover" src="/assets/images/products/Group_Accident_Cover.png" alt="Group Accident Cover" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full relative  py-32">
                    {/* Decorative SVG blob behind hero (non-interactive) */}
                    <div className="pointer-events-none absolute inset-0 flex justify-center items-center -z-10 overflow-hidden w-full h-full">
                        <svg className="img-blob-image w-full max-w-[1150px] h-auto md:h-[780px] opacity-80" xmlns="http://www.w3.org/2000/svg" width="1305" height="885" fill="none" viewBox="0 0 1305 885" preserveAspectRatio="xMidYMid slice">
                            <g className="blob-big-green-2">
                                <path fill="#934790" d="M1194.91 807.728c-59.58 43.615-154.57 74.447-251.604 70.433-110.208-4.561-200.22-50.779-306.606-67.321-80.387-12.502-165.735-7.46-249.244-8.498-83.509-1.038-173.013-10.041-231.118-43.637-75.744-43.792-73.345-113.804-52.689-174.13 20.656-60.326 33.272-89.498 12.32-131.722-17.03-34.318-54.2-64.134-79.667-96.724C-15.64 289.674-3.416 160.931 47.212 93.75 79.462 50.957 142.63 9.596 224.868 7.421c93.534-2.472 165.88 45.138 255.614 59.815 124.891 20.43 230.038-12.669 360.327-13.684 142.17-1.11 271.461 53.674 341.191 123.21 69.73 69.537 102.74 231.726 102.74 231.726s74.84 286.016-89.83 399.24Z" className="blob"></path>
                                <path fill="#934790" d="M1124.13 681.727c-2.74-8.558-5-20.639-2.07-33.763 2.72-12.176 7.75-15.577 9.28-16.496 1.34-.808 6.33-3.528 10.32-1.494 4.31 2.202 4.84 8.638 5.1 11.73v.012c1.24 14.886-11.85 30.453-19.2 38.035 7.34-4.246 13.51-7.83 18.01-10.455 3.89-7.578 10.04-16.422 19.67-23.176 10.21-7.167 16.22-6.291 17.97-5.941 1.53.307 7.06 1.657 8.63 5.846 1.7 4.532-2.24 9.661-4.13 12.115-9.62 12.498-31.56 14.799-41.49 15.272-4.51 2.628-10.44 6.076-17.41 10.098 8.74-1.788 20.72-2.687 33.19 1.446 11.84 3.928 14.72 9.28 15.48 10.887.69 1.416 2.88 6.658.45 10.416-2.62 4.07-9.09 3.957-12.19 3.9-17.01-.294-33.04-19.17-38.31-25.848a5869.38 5869.38 0 0 1-29.47 16.893c8.58-1.521 19.87-1.974 31.66 2.162 11.92 4.186 14.87 9.746 15.65 11.416.69 1.47 2.96 6.913.57 10.77-2.59 4.176-9.08 3.992-12.19 3.903h-.01c-16.74-.481-32.72-19.415-38.4-26.709a4032.443 4032.443 0 0 1-34.91 19.629c8.29-1.287 18.75-1.492 29.57 2.097 11.85 3.928 14.72 9.276 15.49 10.886.67 1.417 2.88 6.659.45 10.417-2.62 4.069-9.1 3.956-12.19 3.9-16.29-.281-31.68-17.602-37.59-24.933-11.9 6.588-23.71 13.023-34.69 18.844 8.57-1.514 19.85-1.958 31.61 2.171 11.93 4.185 14.88 9.745 15.66 11.416.69 1.469 2.96 6.913.56 10.77-2.58 4.176-9.07 3.992-12.18 3.903h-.01c-16.79-.483-32.82-19.528-38.45-26.774-14.84 7.833-27.995 14.435-37.528 18.615l-1.561-3.561c9.598-4.208 22.899-10.892 37.909-18.822-3.2-8.048-6.23-19.667-4.18-32.63 1.86-11.809 6.46-15.355 7.87-16.323 1.22-.851 5.83-3.744 9.76-2.027 4.24 1.858 5.15 8 5.58 10.939 2.25 15.379-11.55 32.5-17.61 39.289 10.9-5.77 22.65-12.167 34.52-18.73-2.46-8.66-4.33-20.877-.92-33.963 3.16-12.073 8.31-15.294 9.87-16.156 1.37-.76 6.45-3.303 10.36-1.127 4.23 2.356 4.54 8.82 4.68 11.914.72 15.071-13.2 30.317-20.77 37.548a4105.784 4105.784 0 0 0 37.49-21.068c-3.21-8.049-6.26-19.687-4.21-32.675 1.87-11.809 6.47-15.355 7.87-16.323 1.23-.851 5.84-3.744 9.77-2.027 4.24 1.856 5.14 7.988 5.57 10.931l.01.008c2.25 15.379-11.55 32.498-17.61 39.289a5516.976 5516.976 0 0 0 28.7-16.446Z" className="leaf"></path>
                                <path fill="#ffffffff" d="M163.673 683.978c-.614 2.053.474 4.187 2.43 4.766 1.955.58 4.039-.615 4.653-2.668.614-2.053-.474-4.187-2.429-4.766-1.956-.579-4.039.616-4.654 2.668Zm20.183 12.634c-1.955-.58-3.043-2.713-2.429-4.766.615-2.053 2.698-3.248 4.654-2.669 1.955.58 3.043 2.713 2.429 4.766-.614 2.053-2.698 3.248-4.654 2.669Zm111.329 44.238c-1.956-.579-3.044-2.713-2.43-4.766.615-2.053 2.698-3.248 4.654-2.668 1.955.579 3.043 2.713 2.429 4.766-.614 2.053-2.698 3.247-4.653 2.668Zm-107.262-31.075c-.614 2.053.474 4.187 2.43 4.766 1.955.58 4.039-.615 4.653-2.668.614-2.053-.474-4.187-2.429-4.766-1.956-.579-4.039.615-4.654 2.668Zm-18.344-6.249c-1.956-.58-3.043-2.713-2.429-4.766.614-2.053 2.697-3.248 4.653-2.669 1.956.58 3.044 2.714 2.429 4.766-.614 2.053-2.697 3.248-4.653 2.669Zm38.852 9.039c-1.956-.58-3.044-2.713-2.429-4.766.614-2.053 2.697-3.248 4.653-2.669 1.956.58 3.043 2.714 2.429 4.766-.614 2.053-2.698 3.248-4.653 2.669Zm35.336 28.453c-.614 2.052.474 4.186 2.429 4.765 1.956.58 4.039-.615 4.654-2.668.614-2.053-.474-4.186-2.43-4.766-1.955-.579-4.039.616-4.653 2.669Zm32.464 11.543c-1.955-.579-3.043-2.713-2.429-4.766.615-2.053 2.698-3.248 4.654-2.668 1.955.579 3.043 2.713 2.429 4.766-.614 2.052-2.698 3.247-4.654 2.668Zm-43.183-28.575c-.614 2.053.474 4.187 2.43 4.766 1.955.579 4.039-.615 4.653-2.668.614-2.053-.474-4.187-2.429-4.766-1.956-.579-4.039.615-4.654 2.668Zm33.137 12.196c-1.956-.579-3.044-2.713-2.43-4.766.615-2.053 2.698-3.248 4.654-2.668 1.955.579 3.043 2.713 2.429 4.766-.614 2.053-2.698 3.247-4.653 2.668Zm-51.711-10.375c-.614 2.052.474 4.186 2.429 4.766 1.956.579 4.039-.616 4.654-2.669.614-2.053-.474-4.186-2.43-4.766-1.955-.579-4.039.616-4.653 2.669Zm95.27 17.588c-1.66-.268-2.629-1.854-2.163-3.543.465-1.688 2.188-2.84 3.848-2.572 1.66.268 2.628 1.854 2.163 3.543-.466 1.689-2.188 2.84-3.848 2.572Z" className="bubbles-left-top"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="max-w-6xl mx-auto text-center py-16 px-6 relative">
                        <h2 className="text-xl md:text-5xl font-dmserif font-semibold text-white mb-4">
                            Features of Group Accident Insurance
                        </h2>
                        <p className="text-white/80 text-xs md:text-base mb-12 max-w-3xl mx-auto">
                            Strong protection and benefits designed to safeguard your workforce
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">

                            {/* Feature 1 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#FF0066]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Accidental Protection from Day One</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Covers accidental injuries, disabilities, and medical emergencies immediately from policy start.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#934790]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#934790]/10 to-[#6a0066]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#934790]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Emergency Medical Assistance</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Includes accidental hospitalization, ambulance support, and emergency medical care.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#934790]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#FF0066]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Financial Safety for Families</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Provides compensation for accidental death or disability, ensuring long-term financial security.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-12 text-[#934790]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Hassle-Free Claims</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Fast and simple claim approvals with full digital processing and guided assistance.
                                </p>
                            </div>

                        </div>

                    </div>
                </section>


                {/* WHY BUY GROUP ACCIDENT COVER SECTION */}
                <section className="w-full flex flex-col items-center justify-center py-12 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-xl md:text-4xl font-dmserif font-bold text-[#2d2d2d] mb-4">
                                Why Choose Group Accident Cover?
                            </h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto">
                                Comprehensive protection for your employees, simplified management for your HR.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="gmc-card group relative bg-[#f9f6fb] rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                                    style={{ ['--accent']: feature.iconBg }}
                                >
                                    <div className="relative z-10 mb-6 w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-none"
                                        style={{ background: feature.iconBg }}>
                                        <div className="transform group-hover:rotate-6 transition-transform duration-500" style={{ color: feature.iconColor }}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="relative z-10 font-bold text-xl text-[#2d2d2d] mb-3 group-hover:text-[#934790] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="relative z-10 text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-900 group-hover:font-medium transition-colors">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full mt-8 flex flex-col items-center justify-center ">
                    <div className="w-[95%] py-16 px-4 bg-[#f2d7b3]/70 rounded-3xl backdrop-blur-lg">
                        {/* Decorative Background Shapes */}
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF0066]/10 opacity-20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#934790]/10 opacity-20 rounded-full blur-3xl"></div>

                        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
                            <div className="relative max-w-6xl mx-auto text-center">
                                {/* Heading */}
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-dmserif">
                                    Why Group Accident Cover is Essential for Employees
                                </h2>
                                <p className="text-gray-700 mb-8 max-w-3xl mx-auto text-xs md:text-base leading-snug">
                                    Offering group accident cover ensures employee well-being, financial security during emergencies, and strengthens loyalty and morale.
                                </p>

                                {/* Grid of benefit cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {/* Card 1 */}
                                    <div className="group relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#934790]/30 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-[#FFB300] text-3xl">🦺</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Accident Protection</h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Covers accidental injuries, disabilities, and emergencies—on or off the job.
                                        </p>
                                        <div className="pt-4 border-t border-gray-100">
                                            <span className="text-[#FFB300] font-bold text-xl">24/7 Cover</span>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="group relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#934790]/30 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-[#FF0066] text-3xl">🚑</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Emergency Assistance</h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Immediate help for medical emergencies, including ambulance and hospital admission.
                                        </p>
                                        <div className="pt-4 border-t border-gray-100">
                                            <span className="text-[#FF0066] font-bold text-xl">Fast Response</span>
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="group relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#934790]/30 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-amber-600 text-3xl">💰</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Financial Security</h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Lump sum payout for accidental death or disability, supporting families when it matters most.
                                        </p>
                                        <div className="pt-4 border-t border-gray-100">
                                            <span className="text-amber-600 font-bold text-xl">₹5L+ Benefit</span>
                                        </div>
                                    </div>

                                    {/* Card 4 */}
                                    <div className="group relative bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#934790]/30 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-emerald-600 text-3xl">📄</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Simple Claims</h3>
                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                            Hassle-free digital claims process with dedicated support for quick settlements.
                                        </p>
                                        <div className="pt-4 border-t border-gray-100">
                                            <span className="text-emerald-600 font-bold text-xl">Quick Approval</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 ">
                    <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#441752] via-[#571754] to-[#934790]  rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center">

                        {/* Right Image */}
                        <div className="md:w-1/2 flex justify-center items-center p-10">
                            <img
                                src="/assets/images/products/accident_protection.png"
                                alt="Accident Protection"
                                className="w-full max-w-sm object-cover"
                            />
                        </div>

                        {/* Left Content */}
                        <div className="md:w-1/2 px-8 py-8">
                            <h2 className="text-3xl md:text-4xl font-normal text-white mb-6 leading-tight font-dmserif">
                                Comprehensive Accident Protection for Your Team
                            </h2>
                            <p className="text-white/90 mb-4 text-sm md:text-base md:leading-tight">
                                Ensure your employees' safety with tailored accident insurance plans that provide 24/7 coverage and peace of mind.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-white text-sm md:text-lg flex items-center gap-2 tracking-tight">
                                        <span className="text-xl">🚑</span> Emergency Medical Assistance
                                    </h3>
                                    <p className="text-white/80 ml-8 text-xs md:text-sm">
                                        Immediate support for medical emergencies, including ambulance services and hospital admissions.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white text-sm md:text-lg flex items-center gap-2 tracking-tight">
                                        <span className="text-xl">💰</span> Financial Security
                                    </h3>
                                    <p className="text-white/80 ml-8 text-xs md:text-sm">
                                        Comprehensive coverage for accidental death, disability, and medical expenses.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white text-lg md:text-lg flex items-center gap-2 tracking-tight">
                                        <span className="text-xl">📄</span> Simplified Claims Process
                                    </h3>
                                    <p className="text-white/80 ml-8 text-xs md:text-sm">
                                        Hassle-free claims with dedicated support for quick settlements.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white text-lg md:text-lg flex items-center gap-2 tracking-tight">
                                        <span className="text-xl">🔒</span> Reliable Coverage
                                    </h3>
                                    <p className="text-white/80 ml-8 text-xs md:text-sm">
                                        Trusted by organizations nationwide for dependable accident protection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION */}
                <section className="w-full py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#934790] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF0066] rounded-full blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-xl md:text-5xl font-dmserif font-semibold text-gray-800 mb-6 drop-shadow-lg">
                                How Our Accident Cover Works
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                                Secure your team with ease—just four simple steps to total accident protection!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#934790]/20 to-transparent"></div>

                            {/* Step 1 - Easy Enrollment */}
                            <div className="group relative h-full">
                                <div className="relative bg-white rounded-3xl p-8 border-2 border-[#934790]/10 hover:border-[#934790]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#934790] to-[#6a0066] rounded-full flex items-center justify-center shadow-xl shadow-[#934790]/30 group-hover:shadow-2xl group-hover:shadow-[#934790]/50 transition-all duration-300">
                                            <span className="text-white font-bold text-lg">1</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 mb-6 flex justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#934790]/10 to-[#6a0066]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1a3a52] mb-4 text-center">
                                        Effortless Enrollment
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                                        Add employees quickly with digital forms and HR integration. Get your team protected in minutes.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 - Instant Accident Cover */}
                            <div className="group relative h-full">
                                <div className="relative bg-white rounded-3xl p-8 border-2 border-[#FF0066]/10 hover:border-[#FF0066]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF0066] to-[#d40055] rounded-full flex items-center justify-center shadow-xl shadow-[#FF0066]/30 group-hover:shadow-2xl group-hover:shadow-[#FF0066]/50 transition-all duration-300">
                                            <span className="text-white font-bold text-lg">2</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 mb-6 flex justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-[#FF0066]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1a3a52] mb-4 text-center">
                                        Immediate Accident Protection
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                                        Employees are covered for accidental injuries and emergencies from day one—no waiting period.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 - Emergency Assistance */}
                            <div className="group relative h-full">
                                <div className="relative bg-white rounded-3xl p-8 border-2 border-[#934790]/10 hover:border-[#934790]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#934790] to-[#6a0066] rounded-full flex items-center justify-center shadow-xl shadow-[#934790]/30 group-hover:shadow-2xl group-hover:shadow-[#934790]/50 transition-all duration-300">
                                            <span className="text-white font-bold text-lg">3</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 mb-6 flex justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#934790]/10 to-[#6a0066]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16h10" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1a3a52] mb-4 text-center">
                                        24/7 Emergency Assistance
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                                        Access to ambulance, hospitalization, and support services whenever accidents happen.
                                    </p>
                                </div>
                            </div>

                            {/* Step 4 - Hassle-Free Claims */}
                            <div className="group relative h-full">
                                <div className="relative bg-white rounded-3xl p-8 border-2 border-[#FF0066]/10 hover:border-[#FF0066]/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF0066] to-[#d40055] rounded-full flex items-center justify-center shadow-xl shadow-[#FF0066]/30 group-hover:shadow-2xl group-hover:shadow-[#FF0066]/50 transition-all duration-300">
                                            <span className="text-white font-bold text-lg">4</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 mb-6 flex justify-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-[#FF0066]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1a3a52] mb-4 text-center">
                                        Hassle-Free Claims
                                    </h3>
                                    <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                                        Fast, simple claims with dedicated support for quick settlements and peace of mind.
                                    </p>
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
