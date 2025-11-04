import React from 'react';
import { Link } from '@inertiajs/react';
import { FaShieldAlt, FaAmbulance, FaHeartbeat, FaPhone, FaCheckCircle, FaUsers, FaClock, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function GroupAccidentCover() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaShieldAlt,
            title: '24/7 Protection',
            description: 'Round-the-clock coverage for accidents anywhere, anytime'
        },
        {
            icon: FaAmbulance,
            title: 'Emergency Support',
            description: 'Immediate medical assistance and ambulance services'
        },
        {
            icon: FaHeartbeat,
            title: 'Disability Benefits',
            description: 'Compensation for temporary or permanent disability'
        },
        {
            icon: FaPhone,
            title: 'Instant Claims',
            description: 'Quick claim processing through mobile app'
        }
    ];

    const benefits = [
        'Accidental Death Benefit up to ₹25 Lakh',
        'Permanent Total Disability Cover',
        'Temporary Total Disability Benefits',
        'Medical Expenses Reimbursement',
        'Ambulance and Emergency Services',
        'Worldwide Coverage for Travel',
        'No Medical Examination Required',
        'Family Floater Options Available'
    ];

    const coverage = [
        {
            type: 'Death Benefit',
            amount: '₹5 Lakh - ₹25 Lakh',
            description: 'Lump sum payment to nominee in case of accidental death'
        },
        {
            type: 'Disability Cover',
            amount: '₹2 Lakh - ₹15 Lakh',
            description: 'Monthly payments for permanent disability'
        },
        {
            type: 'Medical Expenses',
            amount: '₹50,000 - ₹5 Lakh',
            description: 'Hospitalization and treatment costs coverage'
        }
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
            <div className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                                    <FaShieldAlt className="mr-2" />
                                    Accident Protection
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                                Group Accident Cover
                            </h1>
                            <p className="text-xl leading-8 mb-8">
                                Comprehensive protection against unforeseen accidents and injuries. Safeguard your team with instant support and financial security when they need it most.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/book-demo"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-red-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                >
                                    Get Protected Now
                                </Link>
                                <Link
                                    href="#learn-more"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-3xl transform rotate-6 opacity-20"></div>
                                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <FaShieldAlt className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">24/7 Protection</p>
                                        </div>
                                        <div className="text-center">
                                            <FaAmbulance className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Emergency Support</p>
                                        </div>
                                        <div className="text-center">
                                            <FaHeartbeat className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Instant Claims</p>
                                        </div>
                                        <div className="text-center">
                                            <FaUsers className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Team Coverage</p>
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
                            Comprehensive Accident Protection
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our Group Accident Cover provides extensive protection for your employees against unexpected accidents, ensuring their financial security and peace of mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className={`relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-xl transition-all duration-300 group`}>
                                <div className="absolute -top-4 left-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white">
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

            {/* Coverage Details Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Coverage Options</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Flexible coverage amounts to suit your organization's needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coverage.map((item, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-red-600 mb-2">{item.amount}</h3>
                                    <h4 className="text-xl font-semibold mb-4">{item.type}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
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
                                Why Choose Our Accident Cover?
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
                            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-red-50 to-orange-50'} border-2 border-red-200`}>
                                <div className="text-center">
                                    <FaShieldAlt className="h-16 w-16 text-red-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Instant Protection</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Get your team covered in minutes with our streamlined enrollment process. No medical examinations required.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-red-600">5 min</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Setup Time</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-red-600">24/7</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Coverage</div>
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
                            Simple steps to get your team protected
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: FaUsers, title: 'Enroll Team', description: 'Quick employee enrollment process' },
                            { icon: FaFileAlt, title: 'Choose Plan', description: 'Select coverage amount and benefits' },
                            { icon: FaClock, title: 'Instant Activation', description: 'Coverage starts immediately' },
                            { icon: FaPhone, title: 'Claim Support', description: '24/7 claim assistance available' }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white`}>
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
            <div className="bg-gradient-to-r from-red-600 to-orange-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Protect Your Team?
                    </h2>
                    <p className="text-xl text-red-100 mb-8">
                        Get comprehensive accident coverage for your employees today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book-demo"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-red-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
                        >
                            Book Demo
                        </Link>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
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
                            Protecting your team with comprehensive accident coverage
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}