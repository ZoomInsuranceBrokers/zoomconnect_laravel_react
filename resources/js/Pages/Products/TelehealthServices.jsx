import React from 'react';
import { Link } from '@inertiajs/react';
import { FaVideo, FaStethoscope, FaClock, FaGlobe, FaCheckCircle, FaMobileAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function TelehealthServices() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaVideo,
            title: '24/7 Virtual Consultations',
            description: 'Access healthcare professionals anytime, anywhere through video calls'
        },
        {
            icon: FaStethoscope,
            title: 'Multi-Specialty Care',
            description: 'Connect with general physicians, specialists, and mental health experts'
        },
        {
            icon: FaClock,
            title: 'Instant Access',
            description: 'Get medical consultation within minutes, no appointment needed'
        },
        {
            icon: FaGlobe,
            title: 'Global Coverage',
            description: 'Healthcare support available worldwide for your traveling employees'
        }
    ];

    const services = [
        {
            category: 'Primary Care',
            icon: FaUserMd,
            color: 'from-blue-500 to-cyan-500',
            services: [
                'General Health Consultations',
                'Preventive Care Guidance',
                'Chronic Disease Management',
                'Health Risk Assessments',
                'Medication Management',
                'Health Screening Advice'
            ]
        },
        {
            category: 'Specialist Care',
            icon: FaStethoscope,
            color: 'from-purple-500 to-pink-500',
            services: [
                'Cardiology Consultations',
                'Dermatology Sessions',
                'Endocrinology Care',
                'Gastroenterology Advice',
                'Orthopedic Consultations',
                'Gynecology Services'
            ]
        },
        {
            category: 'Mental Health',
            icon: FaShieldAlt,
            color: 'from-green-500 to-teal-500',
            services: [
                'Counseling Sessions',
                'Stress Management',
                'Anxiety & Depression Care',
                'Work-Life Balance Coaching',
                'Crisis Intervention',
                'Behavioral Therapy'
            ]
        }
    ];

    const benefits = [
        'Reduce healthcare costs by 30%',
        'Minimize employee downtime',
        'Improve health outcomes',
        'Enhance employee satisfaction',
        'Provide convenient access to care',
        'Support remote workforce',
        'Enable early intervention',
        'Reduce emergency room visits'
    ];

    const platforms = [
        {
            device: 'Mobile App',
            features: ['Video consultations', 'Appointment booking', 'Medical records', 'Prescription delivery'],
            available: 'iOS & Android'
        },
        {
            device: 'Web Portal',
            features: ['Desktop consultations', 'Health dashboard', 'Report downloads', 'Family management'],
            available: 'All browsers'
        },
        {
            device: 'Phone Support',
            features: ['Voice consultations', '24/7 helpline', 'Emergency support', 'Medical guidance'],
            available: 'Toll-free number'
        }
    ];

    const statistics = [
        { value: '2M+', label: 'Consultations Completed', description: 'Successful virtual healthcare sessions' },
        { value: '15 min', label: 'Average Wait Time', description: 'Quick access to healthcare professionals' },
        { value: '98%', label: 'Patient Satisfaction', description: 'Highly rated telehealth experience' },
        { value: '24/7', label: 'Availability', description: 'Round-the-clock healthcare support' }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Navigation */}
            <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <img className="h-8 w-auto" src="/assets/logo/zoomconnect-logo.png" alt="ZoomConnect" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/book-demo"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                            >
                                Book Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                                    <FaVideo className="mr-2" />
                                    Virtual Healthcare
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                                Telehealth Services
                            </h1>
                            <p className="text-xl leading-8 mb-8">
                                Revolutionary virtual healthcare solutions providing instant access to medical professionals. Your employees can receive quality healthcare consultations anytime, anywhere.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/book-demo"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                >
                                    Start Virtual Care
                                </Link>
                                <Link
                                    href="#learn-more"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                                >
                                    Explore Services
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl transform rotate-6 opacity-20"></div>
                                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                                    <div className="text-center mb-6">
                                        <FaMobileAlt className="h-20 w-20 text-white mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Healthcare in Your Hands</h3>
                                        <p className="text-blue-100">Virtual consultations made simple</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="font-bold">24/7</div>
                                            <div className="text-blue-100">Available</div>
                                        </div>
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="font-bold">15 min</div>
                                            <div className="text-blue-100">Wait Time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="learn-more" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Revolutionary Virtual Healthcare
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our telehealth platform provides comprehensive healthcare services through cutting-edge technology, ensuring your employees have access to quality medical care whenever they need it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className={`relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-xl transition-all duration-300 group`}>
                                <div className="absolute -top-4 left-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="pt-8">
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Comprehensive Care Services</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Access a wide range of medical specialties through our virtual platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className={`w-full h-2 bg-gradient-to-r ${service.color} rounded-full mb-6`}></div>
                                <div className="flex items-center mb-6">
                                    <service.icon className="h-8 w-8 text-blue-600 mr-3" />
                                    <h3 className="text-2xl font-bold">{service.category}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {service.services.map((item, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <FaCheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Proven Track Record</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Numbers that demonstrate our commitment to quality telehealth services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {statistics.map((stat, index) => (
                            <div key={index} className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Platforms Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Multiple Access Platforms</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Choose the platform that works best for your employees
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {platforms.map((platform, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 text-center`}>
                                <h3 className="text-2xl font-bold mb-4 text-blue-600">{platform.device}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{platform.available}</p>
                                <ul className="space-y-3 text-left">
                                    {platform.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <FaCheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">
                                Why Choose Telehealth?
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-0">
                            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} border-2 border-blue-200`}>
                                <div className="text-center">
                                    <FaVideo className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Virtual First Healthcare</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Transform your employee healthcare experience with our comprehensive telehealth platform. Reduce costs while improving access and satisfaction.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">30%</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Cost Savings</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">95%</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Simple steps to access virtual healthcare
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: FaMobileAlt, title: 'Download App', description: 'Install our telehealth app or access web portal' },
                            { icon: FaUserMd, title: 'Choose Doctor', description: 'Select from available healthcare professionals' },
                            { icon: FaVideo, title: 'Start Consultation', description: 'Connect via video, voice, or chat' },
                            { icon: FaStethoscope, title: 'Receive Care', description: 'Get diagnosis, treatment, and prescriptions' }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white`}>
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Transform Healthcare Access?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Provide your employees with instant access to quality healthcare professionals
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book-demo"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
                        >
                            Book Demo
                        </Link>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <img className="h-8 w-auto mx-auto mb-4" src="/assets/logo/zoomconnect-logo-white.png" alt="ZoomConnect" />
                        <p className="text-gray-400">
                            Revolutionizing healthcare access through virtual consultations
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}