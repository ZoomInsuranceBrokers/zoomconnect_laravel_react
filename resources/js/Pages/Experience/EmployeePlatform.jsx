import React from 'react';
import { Link } from '@inertiajs/react';
import { FaUserShield, FaMobileAlt, FaFileAlt, FaChartLine } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function EmployeePlatform() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaUserShield,
            title: 'Digital Health Cards',
            description: 'Access your health card instantly through the platform'
        },
        {
            icon: FaMobileAlt,
            title: 'Claims Tracking',
            description: 'Track your claims status in real-time with push notifications'
        },
        {
            icon: FaFileAlt,
            title: 'Policy Documents',
            description: 'View and download all your policy documents anytime'
        },
        {
            icon: FaChartLine,
            title: 'Wellness Analytics',
            description: 'Monitor your health metrics and wellness program progress'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-dark">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                                    Employee Platform
                                </h1>
                                <p className="mt-6 text-xl leading-8 text-white/90">
                                    Simplify your employee benefits experience with our intuitive digital platform.
                                    Access all your insurance and wellness benefits in one place.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Link
                                        href="/book-demo"
                                        className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100"
                                    >
                                        Request Demo
                                    </Link>
                                    <a
                                        href="#features"
                                        className="text-lg font-semibold leading-6 text-white"
                                    >
                                        Learn more <span aria-hidden="true">→</span>
                                    </a>
                                </div>
                            </div>
                            <div className="mt-16 sm:mt-24 lg:mt-0">
                                <img
                                    src="/assets/images/employee-platform-preview.png"
                                    alt="Employee Platform Interface"
                                    className="rounded-xl shadow-2xl ring-1 ring-white/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything at Your Fingertips
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            Access and manage all your benefits through a single, user-friendly platform
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* App Preview Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                                Seamless Digital Experience
                            </h2>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-primary">Easy Claims Filing</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Submit claims in minutes with our guided process. Upload documents directly from your phone.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-primary">Network Hospitals</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Find nearby network hospitals, view cashless facilities, and get directions instantly.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-primary">Virtual Health Card</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Access your health card anytime. Share it instantly with hospitals during admission.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:ml-12">
                            <img
                                src="/assets/images/app-screens.png"
                                alt="App Interface"
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
                                Ready to transform your benefits experience?
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-white/90">
                                Get a personalized demo of our employee platform and see how it can help your team.
                            </p>
                            <div className="mt-10 flex justify-center gap-x-6">
                                <Link
                                    href="/book-demo"
                                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100"
                                >
                                    Book Demo
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