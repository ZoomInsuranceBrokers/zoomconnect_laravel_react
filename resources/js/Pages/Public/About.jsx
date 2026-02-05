import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

export default function About() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    
    const serviceCards = [
        {
            icon: '🔍',
            title: 'Policy Design & Selection',
            description: 'We analyze your workforce demographics, budget, and goals to design customized benefit packages. Compare quotes from 25+ insurers to find optimal coverage at competitive premiums.',
            color: '#934790'
        },
        {
            icon: '⚙️',
            title: 'Seamless Implementation',
            description: 'Quick onboarding with data migration, employee enrollment, and platform training. Integrate with your HRMS for automated updates and policy management.',
            color: '#FF0066'
        },
        {
            icon: '🎯',
            title: 'Claims Management',
            description: 'End-to-end claims support from intimation to settlement. Dedicated claims desk ensures faster processing with regular updates and proactive follow-ups with insurers.',
            color: '#934790'
        },
        {
            icon: '📊',
            title: 'Analytics & Renewal',
            description: 'Real-time dashboards tracking utilization, claims trends, and wellness metrics. Data-driven renewal strategies to optimize costs and improve coverage year-over-year.',
            color: '#FF0066'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % serviceCards.length);
        }, 4000); // Auto-play every 4 seconds

        return () => clearInterval(interval);
    }, [serviceCards.length]);

    return (
        <>
            <Header />
            <div className="bg-[#ffceea78]">

                {/* Hero Section */}
                <div className="relative pt-20 pb-10 md:py-24 overflow-hidden min-h-screen flex items-center">
                    <div className="absolute inset-0 opacity-70">
                        <img src="/assets/images/ribbon design-01.png" alt="Background" className="w-full h-full object-cover" />
                    </div>
                    {/* Floating background elements */}
                    <div className="absolute top-10 md:top-20 left-5 md:left-10 w-20 md:w-32 h-20 md:h-32 bg-[#934790]/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-24 md:w-40 h-24 md:h-40 bg-[#FF0066]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">

                            <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 text-[#FF0066]/80  animate-gradient drop-shadow-lg">
                                About ZoomConnect
                            </h1>
                            <p className="text-xs md:text-base text-gray-700 mb-6 md:mb-12 leading-relaxed max-w-3xl mx-auto px-2 md:px-0">
                                🚀 An innovative employee benefits platform by Zoom Insurance Brokers Pvt Ltd.
                                Transforming how organizations manage healthcare, insurance, and wellness programs.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto px-2 md:px-0">
                                <div className="group bg-white rounded-2xl shadow-lg p-3 md:p-4 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-blue-400/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="text-xl md:text-2xl mb-2">👥</div>
                                        <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#934790] to-[#FF0066] bg-clip-text text-transparent mb-1">500K+</div>
                                        <div className="text-gray-600 text-xs md:text-sm font-medium">Lives Covered</div>
                                    </div>
                                </div>
                                <div className="group bg-white rounded-2xl shadow-lg p-3 md:p-4 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-pink-400/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="text-xl md:text-2xl mb-2">🏢</div>
                                        <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FF0066] to-[#934790] bg-clip-text text-transparent mb-1">1100+</div>
                                        <div className="text-gray-600 text-xs md:text-sm font-medium">Corporate Clients</div>
                                    </div>
                                </div>
                                <div className="group bg-white rounded-2xl shadow-lg p-3 md:p-4 text-center transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-yellow-400/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="text-xl md:text-2xl mb-2">🎧</div>
                                        <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#934790] to-[#FF0066] bg-clip-text text-transparent mb-1">24/7</div>
                                        <div className="text-gray-600 text-xs md:text-sm font-medium">Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What is ZoomConnect Section */}
                <div className="py-8 md:py-16 relative overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className=" mx-auto">
                            <div className=" max-w-5xl text-center mb-6 md:mb-8 mx-auto">
                                <div className="inline-block mb-3 md:mb-4">
                                    <span className="text-4xl md:text-5xl animate-bounce inline-block">🚀</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 drop-shadow-lg px-2 md:px-0">
                                    What is ZoomConnect?
                                </h2>

                                <p className="text-gray-600 text-sm md:text-lg max-w-5xl px-3 md:px-0">ZoomConnect is an innovative employee benefits platform by Zoom Insurance Brokers Pvt Ltd, designed to simplify and enhance the way organizations manage healthcare, insurance, and wellness programs.</p>
                            </div>

                            <div className="bg-[#f2d7b3]/70 rounded-2xl p-4 md:p-8 lg:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1  mx-auto">

                                <div className="flex items-start mb-6 md:mb-8 gap-3 md:gap-4">
                                    <span className="text-3xl md:text-4xl flex-shrink-0">🎯</span>
                                    <p className="text-xs md:text-base text-gray-800 leading-tight">
                                        Our platform makes policy management, claims, wellness, and support simple for HR teams and employees. We blend smart technology and expert advice to deliver reliable, complete solutions for every organization.
                                    </p>
                                </div>

                                <div className="bg-white rounded-xl p-4 md:p-8 shadow-md mb-6 md:mb-8 border-l-4 border-[#FF0066]/80">
                                    <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-[#FF0066]/80 flex items-center gap-2 md:gap-3">
                                        <span className="text-2xl md:text-3xl flex-shrink-0">✨</span>
                                        <span>With ZoomConnect, organizations can:</span>
                                    </h3>
                                    <ul className="space-y-2 md:space-y-1">
                                        <li className="flex items-start gap-2 md:gap-3 group hover:bg-[#f2d7b3]/50 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                                            <div className="w-7 md:w-8 h-7 md:h-8 bg-[#FF0066]/80 rounded-full flex items-center justify-center mr-1 md:mr-4  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-sm md:text-lg">🏥</span>
                                            </div>
                                            <p className="text-xs md:text-gray-700 text-gray-700">Access and manage group health, term life, and accident insurance policies in one place</p>
                                        </li>
                                        <li className="flex items-start gap-2 md:gap-3 group hover:bg-[#f2d7b3]/50 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                                            <div className="w-7 md:w-8 h-7 md:h-8 bg-[#FF0066]/80 rounded-full flex items-center justify-center mr-1 md:mr-4  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-sm md:text-lg">📱</span>
                                            </div>
                                            <p className="text-xs md:text-gray-700 text-gray-700">Enable employees to view benefits, download e-cards, and track claims easily</p>
                                        </li>
                                        <li className="flex items-start gap-2 md:gap-3 group hover:bg-[#f2d7b3]/50 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                                            <div className="w-7 md:w-8 h-7 md:h-8 bg-[#FF0066]/80 rounded-full flex items-center justify-center mr-1 md:mr-4  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-sm md:text-lg">💪</span>
                                            </div>
                                            <p className="text-xs md:text-gray-700 text-gray-700">Promote employee wellness with curated health programs and resources</p>
                                        </li>
                                        <li className="flex items-start gap-2 md:gap-3 group hover:bg-[#f2d7b3]/50 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                                            <div className="w-7 md:w-8 h-7 md:h-8 bg-[#FF0066]/80 rounded-full flex items-center justify-center mr-1 md:mr-4  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-sm md:text-lg">🎧</span>
                                            </div>
                                            <p className="text-xs md:text-gray-700 text-gray-700">Get 24/7 support from a dedicated insurance and wellness team</p>
                                        </li>
                                        <li className="flex items-start gap-2 md:gap-3 group hover:bg-[#f2d7b3]/50 px-2 md:px-3 py-2 rounded-lg transition-all duration-300 transform hover:translate-x-2">
                                            <div className="w-7 md:w-8 h-7 md:h-8 bg-[#FF0066]/80 rounded-full flex items-center justify-center mr-1 md:mr-4  flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-sm md:text-lg">📊</span>
                                            </div>
                                            <p className="text-xs md:text-gray-700 text-gray-700">Leverage analytics and reporting for smarter HR decisions</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-r from-[#FF0066]/80 to-[#FF0066]/80 rounded-xl p-4 md:p-6 text-white text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                                        <span className="text-2xl md:text-3xl animate-pulse flex-shrink-0">🏆</span>
                                        <p className="text-xs md:text-base font-medium leading-tight">
                                            Trusted by 150+ corporates and serving over 500,000 lives, ZoomConnect is committed to
                                            making employee benefits simple, transparent, and impactful for every organization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="py-10 md:py-20 bg-gradient-to-br from-white via-[#f2d7b3]/10 to-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
                            <div className="px-2 md:px-0">
                                <div className="flex items-center gap-2 md:gap-1 mb-4 md:mb-6">
                                    <span className="text-3xl md:text-4xl flex-shrink-0">🎯</span>
                                    <h2 className="text-xl md:text-3xl font-bold text-gray-900">Our Mission</h2>
                                </div>
                                <p className="text-xs md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                                    To revolutionize employee benefits management by providing comprehensive,
                                    technology-driven solutions that enhance healthcare access, financial security,
                                    and wellness for every employee and their families.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 md:w-6 h-5 md:h-6 bg-[#934790] rounded-full flex items-center justify-center mt-0.5 md:mt-1 flex-shrink-0">
                                            <svg className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base text-gray-900">Comprehensive Coverage</h3>
                                            <p className="text-xs md:text-sm text-gray-600">Complete healthcare and insurance solutions for all employees</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 md:w-6 h-5 md:h-6 bg-[#934790] rounded-full flex items-center justify-center mt-0.5 md:mt-1 flex-shrink-0">
                                            <svg className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base text-gray-900">Expert Guidance</h3>
                                            <p className="text-xs md:text-sm text-gray-600">Professional insurance advisory from certified experts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 md:w-6 h-5 md:h-6 bg-[#934790] rounded-full flex items-center justify-center mt-0.5 md:mt-1 flex-shrink-0">
                                            <svg className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base text-gray-900">Digital Innovation</h3>
                                            <p className="text-xs md:text-sm text-gray-600">Modern platform for seamless benefits management</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative group px-2 md:px-0 mt-6 md:mt-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#934790] to-[#FF0066] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-[#934790] via-[#a855a8] to-[#FF0066] rounded-3xl p-6 md:p-8 lg:p-10 text-white shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <span className="text-3xl md:text-4xl flex-shrink-0">🔮</span>
                                        <h3 className="text-2xl md:text-3xl font-bold">Our Vision</h3>
                                    </div>
                                    <p className="text-xs md:text-base leading-relaxed text-white/95">
                                        To be India's leading digital insurance platform, making quality healthcare
                                        and financial protection accessible to every employee, fostering a healthier
                                        and more secure workforce nationwide.
                                    </p>
                                    <div className="absolute top-4 right-4 text-6xl opacity-10">✨</div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                                <div className="absolute -top-6 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How We Serve You Section */}
                <div className="py-8 md:py-12 bg-gradient-to-br from-[#f2d7b3]/20 to-white relative overflow-hidden">
                    <div className="absolute top-5 md:top-10 right-5 md:right-10 w-32 md:w-64 h-32 md:h-64 bg-[#934790]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 w-32 md:w-64 h-32 md:h-64 bg-[#FF0066]/5 rounded-full blur-3xl"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-6 md:mb-8">
                            <div className="inline-block mb-3 md:mb-4">
                                <span className="text-4xl md:text-5xl">🤝</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 drop-shadow-lg">How We Serve You</h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto px-3 md:px-0">
                                Our comprehensive approach to employee benefits management
                            </p>
                        </div>

                        {/* Mobile Carousel - Hidden on desktop */}
                        <div className="md:hidden relative">
                            <div className="overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-300 ease-out"
                                    style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                                >
                                    {serviceCards.map((card, index) => (
                                        <div key={index} className="w-full flex-shrink-0 px-2">
                                            <div className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500" style={{ borderLeft: `4px solid ${card.color}` }}>
                                                <div className="flex items-start gap-3">
                                                    <div className="text-2xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-bold mb-2 text-gray-900">{card.title}</h3>
                                                        <p className="text-gray-600 text-xs leading-relaxed">
                                                            {card.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carousel Indicators */}
                            <div className="flex gap-2 justify-center mt-4">
                                {serviceCards.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCarouselIndex(index)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                            index === carouselIndex 
                                                ? 'bg-[#934790] w-8' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Desktop Grid - Hidden on mobile */}
                        <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto px-2 md:px-0">
                            {serviceCards.map((card, index) => (
                                <div key={index} className="group bg-white rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-500" style={{ borderLeft: `4px solid ${card.color}` }}>
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl md:text-3xl flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                                        <div className="min-w-0">
                                            <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{card.title}</h3>
                                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Our Story Section */}
                <div className="py-8 md:py-16 bg-[#f2d7b3]/20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-10 md:top-20 left-5 md:left-10 text-6xl md:text-9xl">📖</div>
                        <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 text-6xl md:text-9xl">🌟</div>
                    </div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-8 md:mb-12">

                            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 drop-shadow-lg">Our Story</h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto px-3 md:px-0">
                                🌱 From a small team with a big dream to a platform trusted by millions
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 md:gap-8 px-2 md:px-0">
                            <div className="group bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#934790]/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#934790]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="text-4xl md:text-5xl mb-4 md:mb-6">🏛️</div>
                                    <div className="inline-block px-3 py-1 bg-[#934790]/10 rounded-full text-[#934790] text-xs md:text-sm font-semibold mb-3 md:mb-4">2008</div>
                                    <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Foundation</h3>
                                    <p className="text-gray-600 text-xs md:text-base leading-normal">
                                        Zoom Insurance Brokers was established with a mission to provide comprehensive
                                        insurance solutions to corporate clients across India.
                                    </p>
                                </div>
                            </div>

                            <div className="group bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#FF0066]/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0066]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="text-4xl md:text-5xl mb-4 md:mb-6">⚡</div>
                                    <div className="inline-block px-3 py-1 bg-[#FF0066]/10 rounded-full text-[#FF0066] text-xs md:text-sm font-semibold mb-3 md:mb-4">2021</div>
                                    <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Digital Innovation</h3>
                                    <p className="text-gray-600 text-xs md:text-base leading-normal">
                                        Launched ZoomConnect platform, revolutionizing employee benefits management
                                        with cutting-edge technology and seamless digital experience.
                                    </p>
                                </div>
                            </div>

                            <div className="group bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#934790]/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#934790]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className="text-4xl md:text-5xl mb-4 md:mb-6">🏆</div>
                                    <div className="inline-block px-3 py-1 bg-[#934790]/10 rounded-full text-[#934790] text-xs md:text-sm font-semibold mb-3 md:mb-4">Since 2021</div>
                                    <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">Market Leader</h3>
                                    <p className="text-gray-600 text-xs md:text-base leading-normal">
                                        Serving 500K+ lives across 1100+ corporates, establishing ourselves as India's
                                        trusted partner for comprehensive employee benefits and wellness programs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Impact Section */}
                <div className="py-10 md:py-20 bg-[#f2d7b3]/70 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-[#934790]/5 to-[#FF0066]/5 rounded-full blur-3xl"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-6 md:mb-8">
                            {/* <div className="inline-block mb-2">
                                <span className="text-5xl">📊</span>
                            </div> */}
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900 drop-shadow-lg">Our Impact in Numbers</h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto px-3 md:px-0">
                                Real results that demonstrate our commitment to excellence
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 md:gap-8 px-2 md:px-0">
                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#934790]/10 hover:to-[#934790]/5 rounded-2xl p-5 md:p-8 shadow-lg border border-gray-100 hover:border-[#934790]/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                    <div className="text-4xl md:text-5xl flex-shrink-0">🏆</div>
                                    <div className="min-w-0">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900">Award Winning</h3>
                                        <p className="text-xs md:text-sm text-gray-600">Best Insurance Broker 2023</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                    Recognized for outstanding service excellence and innovation in employee benefits management.
                                </p>
                                <div className="mt-3 md:mt-4 max-h-0 group-hover:max-h-96 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                    <div className="pt-3 md:pt-4 border-t border-gray-200 space-y-2 md:space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">🌟</span>
                                            <span className="text-xs md:text-sm text-gray-700">Excellence in Innovation 2022</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">⭐</span>
                                            <span className="text-xs md:text-sm text-gray-700">Customer Service Award 2021</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">🏅</span>
                                            <span className="text-xs md:text-sm text-gray-700">Digital Excellence 2020</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#FF0066]/10 hover:to-[#FF0066]/5 rounded-2xl p-5 md:p-8 shadow-lg border border-gray-100 hover:border-[#FF0066]/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                    <div className="text-4xl md:text-5xl flex-shrink-0">🔒</div>
                                    <div className="min-w-0">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900">ISO Certified</h3>
                                        <p className="text-xs md:text-sm text-gray-600">ISO 27001:2022</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                    International certification ensuring highest standards of information security and data protection.
                                </p>
                                <div className="mt-3 md:mt-4 max-h-0 group-hover:max-h-96 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                    <div className="pt-3 md:pt-4 border-t border-gray-200 space-y-2 md:space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">✅</span>
                                            <span className="text-xs md:text-sm text-gray-700">ISO 9001:2015 Quality Management</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">🛡️</span>
                                            <span className="text-xs md:text-sm text-gray-700">Data Privacy Compliance</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">🔐</span>
                                            <span className="text-xs md:text-sm text-gray-700">Security Best Practices</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="group bg-white hover:bg-gradient-to-br hover:from-[#934790]/10 hover:to-[#934790]/5 rounded-2xl p-5 md:p-8 shadow-lg border border-gray-100 hover:border-[#934790]/50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                                    <div className="text-4xl md:text-5xl flex-shrink-0">🎯</div>
                                    <div className="min-w-0">
                                        <h3 className="text-base md:text-lg font-bold text-gray-900">IRDA Licensed</h3>
                                        <p className="text-xs md:text-sm text-gray-600">Direct Broker License</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                                    Authorized and regulated by Insurance Regulatory and Development Authority of India.
                                </p>
                                <div className="mt-3 md:mt-4 max-h-0 group-hover:max-h-96 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                    <div className="pt-3 md:pt-4 border-t border-gray-200 space-y-2 md:space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">📜</span>
                                            <span className="text-xs md:text-sm text-gray-700">Composite Broker License</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">💼</span>
                                            <span className="text-xs md:text-sm text-gray-700">Corporate Agent Certification</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl md:text-2xl">📋</span>
                                            <span className="text-xs md:text-sm text-gray-700">Compliance Certified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="py-8 md:py-16  relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-5 md:top-10 left-10 md:left-20 text-6xl md:text-9xl">💎</div>
                        <div className="absolute bottom-5 md:bottom-10 right-10 md:right-20 text-6xl md:text-9xl">✨</div>
                    </div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-8 md:mb-12">
                            <div className="inline-block mb-3 md:mb-4">
                                <span className="text-4xl md:text-5xl">💎</span>
                            </div>
                            <h2 className="text-xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900">Our Core Values</h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto px-3 md:px-0">
                                The principles that guide our commitment to excellence in employee benefits
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            <div className="group text-center bg-white rounded-2xl md:rounded-[50%] px-4 md:px-6 py-6 md:py-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#934790]/30">
                                <div className="text-4xl md:text-5xl mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">💖</div>
                                <h3 className="text-base md:text-xl font-bold mb-2 text-gray-900">Care</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Genuinely caring for every employee's health, security, and wellbeing.</p>
                            </div>

                            <div className="group text-center bg-white rounded-2xl md:rounded-[50%] px-4 md:px-6 py-6 md:py-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#FF0066]/30">
                                <div className="text-4xl md:text-5xl mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">💡</div>
                                <h3 className="text-base md:text-xl font-bold mb-2 text-gray-900">Innovation</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Leveraging technology to simplify complex insurance processes.</p>
                            </div>

                            <div className="group text-center bg-white rounded-2xl md:rounded-[50%] px-4 md:px-6 py-6 md:py-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#934790]/30">
                                <div className="text-4xl md:text-5xl mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">🤝</div>
                                <h3 className="text-base md:text-xl font-bold mb-2 text-gray-900">Trust</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Building lasting partnerships through transparency and reliability.</p>
                            </div>

                            <div className="group text-center bg-white rounded-2xl md:rounded-[50%] px-4 md:px-6 py-6 md:py-12 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-transparent hover:border-[#FF0066]/30">
                                <div className="text-4xl md:text-5xl mb-3 md:mb-6 transform group-hover:scale-110 transition-transform duration-500">🎓</div>
                                <h3 className="text-base md:text-xl font-bold mb-2 text-gray-900">Expertise</h3>
                                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Deep insurance knowledge and professional guidance you can depend on.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile App Section */}
                <div className="py-8 md:py-16 bg-[#f2f2f2] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-5 md:top-10 right-10 md:right-20 text-6xl md:text-9xl">📱</div>
                        <div className="absolute bottom-5 md:bottom-10 left-10 md:left-20 text-6xl md:text-9xl">📲</div>
                    </div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-6 md:mb-8">
                            <h2 className="text-xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 drop-shadow-lg">Download Our Mobile App</h2>
                            <p className="text-xs md:text-base text-gray-600 max-w-3xl mx-auto px-3 md:px-0">
                                Access your benefits anytime, anywhere. Scan the QR code to download ZoomConnect mobile app.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-4xl mx-auto justify-center items-center">
                            {/* iOS App */}
                            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#934790]/50 relative overflow-hidden w-full md:w-80">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#934790]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                                    <div className="mb-2">
                                        <img src="/assets/logo/apple-logo.png" alt="App Logo" className="w-10 md:w-14 h-10 md:h-14 object-contain mx-auto" />
                                    </div>
                                    <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 text-gray-900">iOS App</h3>
                                    <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-base">Available on App Store</p>
                                    <div className="bg-black p-2 rounded-2xl shadow-md mb-3 md:mb-4 border-4 border-gray-100 flex items-center justify-center">
                                        {/* QR Code Placeholder - Replace with actual QR code */}
                                        <div className="w-16 md:w-20 h-16 md:h-20 rounded-xl flex items-center justify-center">
                                            <img src="/assets/logo/QR zoom connect-01.png" alt="ZoomConnect QR Code" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <a href="#" className="inline-flex items-center gap-2 bg-black text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                        </svg>
                                        App Store
                                    </a>
                                </div>
                            </div>

                            {/* Android App */}
                            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-5 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#FF0066]/50 relative overflow-hidden w-full md:w-80">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0066]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10 flex flex-col items-center justify-center  text-center">
                                    <div className="mb-2">
                                        <img src="/assets/logo/android-logo.png" alt="App Logo" className="w-10 md:w-14 h-10 md:h-14 object-contain mx-auto" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-900">Android App</h3>
                                    <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-base">Available on Google Play</p>
                                    <div className="bg-black  p-2 rounded-2xl shadow-md inline-block mb-3 md:mb-4 border-4 border-gray-100">
                                        {/* QR Code Placeholder - Replace with actual QR code */}
                                        <div className="w-16 md:w-20 h-16 md:h-20  rounded-xl flex items-center justify-center">
                                            <img src="/assets/logo/QR zoom connect-01.png" alt="ZoomConnect QR Code" className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <a href="#" className="inline-flex items-center gap-2 bg-black text-xs md:text-sm text-white px-3 md:px-4 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                        </svg>
                                        Google Play
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="py-10 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="bg-gradient-to-r from-[#934790]/80 via-[#a855a8]/70 to-[#FF0066]/80 rounded-3xl relative overflow-hidden py-8 md:py-12">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-5 md:top-10 left-5 md:left-10 text-6xl md:text-9xl">🚀</div>
                                <div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 text-6xl md:text-9xl">💼</div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[200px] opacity-5">✨</div>
                            </div>
                            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                                <div className="inline-block mb-2">
                                    <span className="text-4xl md:text-5xl animate-bounce inline-block">🎯</span>
                                </div>
                                <h2 className="text-lg md:text-4xl font-semibold mb-2 text-white drop-shadow-lg">Ready to Transform Your Benefits?</h2>
                                <p className="text-xs md:text-base text-white/90 mb-4 md:mb-5 max-w-2xl mx-auto leading-tight">
                                    Trusted by 1100+ companies and 500,000+ employees.
                                    Experience the difference with Zoom Insurance Brokers.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                                    <Link href="/contact" className="group relative overflow-hidden bg-white text-[#934790] px-4 md:px-6 py-2 rounded-xl font-semibold text-xs md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Book a Demo
                                        </span>
                                    </Link>
                                    <Link href="/contact" className="group relative overflow-hidden border-2 border-white text-white px-4 md:px-6 py-2 rounded-xl font-semibold text-xs md:text-base hover:bg-white hover:text-[#934790] transition-all duration-300 transform hover:scale-105">
                                        <span className="flex items-center justify-center gap-2">
                                            Contact Us
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
