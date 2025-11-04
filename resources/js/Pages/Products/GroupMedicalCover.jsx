import React from 'react';
import { Link } from '@inertiajs/react';
import { FaCheckCircle, FaHospital, FaUserMd, FaMobile } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function GroupMedicalCover() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaHospital,
            title: 'Wide Hospital Network',
            description: 'Access to 10,000+ cashless hospitals across India'
        },
        {
            icon: FaUserMd,
            title: 'Comprehensive Coverage',
            description: 'Pre and post hospitalization, day care procedures, maternity benefits'
        },
        {
            icon: FaMobile,
            title: 'Digital Claims',
            description: 'Paperless claims processing with real-time status updates'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Group Medical Cover
                            </h1>
                            <p className="mt-6 text-xl leading-8">
                                Comprehensive health insurance solution designed to protect your entire team with seamless digital experience.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6">
                                <Link
                                    href="/book-demo"
                                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Book Demo
                                </Link>
                                <Link
                                    href="#learn-more"
                                    className="text-lg font-semibold leading-6 text-white"
                                >
                                    Learn more <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5">
                            {/* Hero Image */}
                            <div className="relative">
                                <img
                                    src="/assets/images/gmc-hero.png"
                                    alt="Group Medical Cover"
                                    className="rounded-lg shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Key Features
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            Everything you need to provide comprehensive health coverage for your employees
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div key={index} className="relative">
                                <div className="absolute left-0 top-0 -z-10 h-24 w-24 rounded-full bg-primary/10"></div>
                                <feature.icon className="h-8 w-8 text-primary" />
                                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                                Why Choose Our GMC?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    'Customizable policy design to meet your team\'s needs',
                                    'Dedicated support team for claims assistance',
                                    'Digital health cards and policy documents',
                                    'Integrated wellness programs',
                                    'Family coverage options',
                                    'No paperwork claims process'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <FaCheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                                        <p className="text-lg">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:ml-12">
                            <img
                                src="/assets/images/gmc-benefits.png"
                                alt="Benefits"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary rounded-2xl px-6 py-16 sm:p-16">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to protect your team?
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-white/90">
                                Get in touch with our experts to design the perfect group medical cover for your organization.
                            </p>
                            <div className="mt-10 flex justify-center gap-x-6">
                                <Link
                                    href="/book-demo"
                                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100"
                                >
                                    Schedule Demo
                                </Link>
                                <Link
                                    href="/contact"
                                    className="rounded-md border border-white px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-white/10"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}