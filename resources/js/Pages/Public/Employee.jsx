import React, { useState, useEffect, useRef } from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import {
    SparklesIcon,
    ShieldCheckIcon,
    ClockIcon,
    CreditCardIcon,
    HeartIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    BellAlertIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function Employee() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-on-scroll').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Testimonial carousel autoplay
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Manager",
            company: "TechCorp Inc.",
            image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=934790&color=fff&size=128",
            quote: "The employee benefits platform has transformed how we manage our healthcare and wellness programs. It's intuitive, fast, and makes enrollment a breeze!"
        },
        {
            name: "Michael Chen",
            role: "Software Engineer",
            company: "Innovation Labs",
            image: "https://ui-avatars.com/api/?name=Michael+Chen&background=6366f1&color=fff&size=128",
            quote: "I love how easy it is to track all my benefits in one place. The mobile experience is fantastic, and customer support is always responsive."
        },
        {
            name: "Emily Rodriguez",
            role: "HR Director",
            company: "HealthPlus",
            image: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff&size=128",
            quote: "Managing benefits for 500+ employees used to be overwhelming. This platform streamlined everything and our team couldn't be happier!"
        }
    ];

    const features = [
        {
            icon: ClockIcon,
            title: "2-Minute Onboarding",
            description: "Get started instantly with our paperless digital enrollment process. No complex forms or waiting periods."
        },
        {
            icon: CreditCardIcon,
            title: "Health Wallet",
            description: "Centralize all your health benefits, cards, and claims in one secure digital wallet."
        },
        {
            icon: ShieldCheckIcon,
            title: "Secure & Compliant",
            description: "Bank-level encryption and full compliance with healthcare data protection regulations."
        },
        {
            icon: HeartIcon,
            title: "Wellness Programs",
            description: "Access to fitness challenges, mental health resources, and preventive care benefits."
        },
        {
            icon: UserGroupIcon,
            title: "Family Coverage",
            description: "Easily add dependents, manage family benefits, and track everyone's healthcare needs."
        },
        {
            icon: BellAlertIcon,
            title: "Smart Alerts",
            description: "Never miss important deadlines, claim updates, or benefit enrollment windows."
        }
    ];

    const benefits = [
        "Instant access to all benefit documents",
        "Real-time claim status tracking",
        "Digital health cards on mobile",
        "24/7 chatbot support",
        "Flexible spending account management",
        "Telemedicine integration",
        "Annual enrollment reminders",
        "Dependent verification tools"
    ];

    const nextTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setIsAutoPlaying(false);
        setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left content */}
                        <div className="fade-on-scroll">
                            {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                                <SparklesIcon className="w-4 h-4 text-[rgb(147,71,144)]" />
                                <span className="text-sm font-medium text-[rgb(147,71,144)]">Modern Employee Benefits</span>
                            </div> */}

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                Your Benefits,
                                <span className="bg-gradient-to-r from-[rgb(147,71,144)] via-purple-600 to-pink-500 bg-clip-text text-transparent"> Simplified</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                                Experience the future of employee benefits management. Enroll in seconds,
                                access everything instantly, and take control of your healthcare journey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="/employee-login" className="group px-8 py-4 bg-gradient-to-r from-[rgb(147,71,144)] to-pink-500 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                                    Get Started Free
                                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-8 text-sm">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                                    <div className="text-gray-600">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                                    <div className="text-gray-600">Uptime</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                                    <div className="text-gray-600">User Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Right content - Mockup */}
                        <div className="fade-on-scroll relative">
                            <div className="relative">
                                {/* Main card mockup */}
                                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[rgb(147,71,144)] to-pink-500 rounded-full flex items-center justify-center">
                                            <HeartIcon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Health Benefits</h3>
                                            <p className="text-sm text-gray-500">Active Plan</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                                            <span className="text-sm font-medium text-gray-700">Coverage</span>
                                            <span className="text-sm font-bold text-[rgb(147,71,144)]">₹5,00,000</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                            <span className="text-sm font-medium text-gray-700">Dependents</span>
                                            <span className="text-sm font-bold text-pink-600">4 Members</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating element */}
                                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                                    <div className="text-sm font-medium mb-1">Claims Processed</div>
                                    <div className="text-3xl font-bold">100%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Benefits Section with Image Split */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image side */}
                        <div className="fade-on-scroll order-2 lg:order-1">
                            <div className="relative">
                                <div className="aspect-square bg-gradient-to-br from-[rgb(147,71,144)] to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="w-full h-full flex items-center justify-center p-12">
                                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 w-full">
                                            <DocumentCheckIcon className="w-20 h-20 text-white mb-6" />
                                            <h3 className="text-2xl font-bold text-white mb-4">Paperless Process</h3>
                                            <p className="text-purple-100">All documents digitally signed and securely stored</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 transform rotate-6">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                        <div>
                                            <div className="text-xs text-gray-600">Verified</div>
                                            <div className="text-sm font-bold text-gray-900">Secure</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content side */}
                        <div className="fade-on-scroll order-1 lg:order-2">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                                Comprehensive Benefits at Your Fingertips
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Access a complete suite of employee benefits designed to support your health,
                                wealth, and wellbeing. Everything you need, whenever you need it.
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-4 group">
                                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[rgb(147,71,144)] to-pink-500 rounded-full flex items-center justify-center mt-1">
                                            <CheckCircleIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-10 px-8 py-4 bg-gradient-to-r from-[rgb(147,71,144)] to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                Explore All Benefits
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 fade-on-scroll">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Get Started in 3 Simple Steps
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            It only takes minutes to set up your benefits and start enjoying comprehensive coverage
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection lines */}
                        <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(147,71,144)] via-purple-400 to-pink-500 opacity-20"></div>

                        {[
                            {
                                step: "01",
                                title: "Create Your Profile",
                                description: "Sign up with your company email and verify your identity in seconds",
                                icon: UserGroupIcon
                            },
                            {
                                step: "02",
                                title: "Choose Your Benefits",
                                description: "Select from available plans and customize coverage for you and your family",
                                icon: DocumentCheckIcon
                            },
                            {
                                step: "03",
                                title: "Start Using Benefits",
                                description: "Access your digital health cards and start claiming benefits immediately",
                                icon: SparklesIcon
                            }
                        ].map((item, index) => (
                            <div key={index} className="fade-on-scroll relative" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-xl relative z-10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[rgb(147,71,144)] to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <item.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-5xl font-bold text-purple-100 mb-4 text-center">{item.step}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                                    <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Showcase with Screenshots */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 fade-on-scroll">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Platform Features & Services
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our comprehensive suite of tools designed to make your benefits experience seamless
                        </p>
                    </div>

                    {/* Feature 1 - Left Image, Right Content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 fade-on-scroll">
                        <div className="order-2 lg:order-1">
                            {/* Replace this div with your screenshot */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[rgb(147,71,144)] to-purple-600 opacity-10"></div>
                                <div className="relative z-10 text-center p-8">
                                    <DocumentCheckIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Add your screenshot here</p>
                                    <p className="text-sm text-gray-400 mt-2">Recommended: 1200x900px</p>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute top-6 right-6 bg-white rounded-xl shadow-lg px-4 py-2">
                                    <span className="text-xs font-semibold text-[rgb(147,71,144)]">LIVE DEMO</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                                <span className="w-8 h-8 bg-[rgb(147,71,144)] text-white rounded-full flex items-center justify-center text-sm font-bold">01</span>
                                <span className="text-sm font-medium text-[rgb(147,71,144)]">Onboarding</span>
                            </div>

                            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                2-Minute Digital Onboarding
                            </h3>

                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Set up your profile quickly with our paperless process and instant activation.
                                Complete verification in seconds and get immediate access to all your benefits.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-[rgb(147,71,144)] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Paperless digital enrollment process</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-[rgb(147,71,144)] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Instant profile activation and verification</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-[rgb(147,71,144)] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Automated document submission and approval</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 - Right Image, Left Content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 fade-on-scroll">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                                <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">02</span>
                                <span className="text-sm font-medium text-indigo-700">Health Wallet</span>
                            </div>

                            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Flexible Enrollment with Health Wallet
                            </h3>

                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Easily add dependents, access digital health cards, and track all benefits.
                                Manage flexible spending accounts and view real-time claim status updates.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Digital health cards available on mobile</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Real-time claim tracking and status updates</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Centralized document management system</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            {/* Replace this div with your screenshot */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10"></div>
                                <div className="relative z-10 text-center p-8">
                                    <CreditCardIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Add your screenshot here</p>
                                    <p className="text-sm text-gray-400 mt-2">Recommended: 1200x900px</p>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg px-4 py-2">
                                    <span className="text-xs font-semibold text-indigo-600">MOBILE READY</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3 - Left Image, Right Content */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center fade-on-scroll">
                        <div className="order-2 lg:order-1">
                            {/* Replace this div with your screenshot */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 opacity-10"></div>
                                <div className="relative z-10 text-center p-8">
                                    <ShieldCheckIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Add your screenshot here</p>
                                    <p className="text-sm text-gray-400 mt-2">Recommended: 1200x900px</p>
                                </div>
                                {/* Floating badge */}
                                <div className="absolute top-6 left-6 bg-white rounded-xl shadow-lg px-4 py-2">
                                    <span className="text-xs font-semibold text-pink-600">SECURE</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-6">
                                <span className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">03</span>
                                <span className="text-sm font-medium text-pink-700">Coverage Guide</span>
                            </div>

                            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                                Simple Coverage Guide
                            </h3>

                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Understand your coverage with clear, visual explanations and real-life examples.
                                Access comprehensive FAQs and get instant support when you need it.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Interactive coverage calculator tools</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Visual policy explanations and examples</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">24/7 customer support and live chat</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Horizontal Scrollable Service Showcase */}
            <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                {/* Starfield background effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[10%] left-[20%] animate-pulse"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[30%] left-[60%] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[60%] left-[80%] animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[80%] left-[30%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-[20%] left-[90%] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Section - Text Content */}
                        <div className="fade-on-scroll flex flex-col justify-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                                We're Setting the Standard
                            </h2>
                            <p className="text-lg text-purple-200 mb-8 leading-relaxed">
                                We've sustained high standards. We've set new benchmarks. We're here to stay.
                            </p>
                            <p className="text-base text-purple-300 mb-8 leading-relaxed">
                                Explore our comprehensive suite of tools and services designed to make your benefits experience seamless and intuitive.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-purple-100">Comprehensive feature set for all your needs</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-purple-100">Simple and intuitive user experience</span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CheckCircleIcon className="w-6 h-6 text-pink-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-purple-100">Continuous innovation and updates</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Carousel */}
                        <div className="relative">
                            {/* Gradient overlays for scroll indication */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-indigo-900 to-transparent z-10 pointer-events-none"></div>

                            {/* Scrollable Container */}
                            <div
                                id="service-carousel"
                                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory scrollbar-hide smooth-scroll"
                                style={{ scrollBehavior: 'smooth' }}
                            >
                                {/* Screenshot Card 1 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center p-8">
                                            <HeartIcon className="w-20 h-20 text-[rgb(147,71,144)] mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Search Your Hospital</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 1</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Card 2 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col items-center justify-center p-8">
                                            <UserGroupIcon className="w-20 h-20 text-purple-600 mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Telehealth</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 2</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Card 3 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-100 flex flex-col items-center justify-center p-8">
                                            <ShieldCheckIcon className="w-20 h-20 text-indigo-600 mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Gym Membership</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 3</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Card 4 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center p-8">
                                            <CreditCardIcon className="w-20 h-20 text-blue-600 mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Claim Reimbursement</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 4</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Card 5 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex flex-col items-center justify-center p-8">
                                            <DocumentCheckIcon className="w-20 h-20 text-green-600 mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Health Records</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 5</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot Card 6 */}
                                <div className="flex-shrink-0 w-72 snap-center">
                                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 aspect-[9/16]">
                                        {/* Replace with your screenshot */}
                                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex flex-col items-center justify-center p-8">
                                            <BellAlertIcon className="w-20 h-20 text-orange-600 mb-4" />
                                            <p className="text-gray-700 font-semibold text-center">Notifications</p>
                                            <p className="text-sm text-gray-500 text-center mt-2">Screenshot 6</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add more screenshot cards as needed */}
                            </div>

                            {/* Navigation Dots */}
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: -350, behavior: 'smooth' })}
                                    className="w-2 h-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-100 transition-all"
                                ></button>
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: 0, behavior: 'smooth' })}
                                    className="w-8 h-2 rounded-full bg-white transition-all"
                                ></button>
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: 350, behavior: 'smooth' })}
                                    className="w-2 h-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-100 transition-all"
                                ></button>
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: 700, behavior: 'smooth' })}
                                    className="w-2 h-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-100 transition-all"
                                ></button>
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: 1050, behavior: 'smooth' })}
                                    className="w-2 h-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-100 transition-all"
                                ></button>
                                <button
                                    onClick={() => document.getElementById('service-carousel').scrollBy({ left: 1400, behavior: 'smooth' })}
                                    className="w-2 h-2 rounded-full bg-white bg-opacity-40 hover:bg-opacity-100 transition-all"
                                ></button>
                            </div>

                            {/* Scroll hint text (optional) */}
                            <div className="text-center mt-4">
                                <p className="text-purple-300 text-sm">← Scroll to explore more →</p>
                            </div>
                        </div>
                    </div>
                </div>


            </section>
            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 fade-on-scroll">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need, All in One Place
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to make benefit management effortless and intuitive
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="fade-on-scroll group p-8 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-7 h-7 text-[rgb(147,71,144)]" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                
                .fade-on-scroll {
                    opacity: 0;
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                /* Hide scrollbar but keep functionality */
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                /* Smooth scroll for carousel */
                .smooth-scroll {
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }

                /* Snap scroll for cards */
                .snap-x {
                    scroll-snap-type: x mandatory;
                }

                .snap-center {
                    scroll-snap-align: center;
                }
            `}</style>
        </>
    );
}
