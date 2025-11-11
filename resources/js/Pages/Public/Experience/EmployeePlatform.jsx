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
            {/* ...rest of the code... */}
            </div>
        </div>
    );
}
