import React from 'react';
import { Link } from '@inertiajs/react';
import { FaHeart, FaFamily, FaUmbrella, FaHandHoldingHeart, FaCheckCircle, FaShieldAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function GroupTermLife() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaHeart,
            title: 'Life Protection',
            description: 'Comprehensive life insurance coverage for your entire team'
        },
        {
            icon: FaFamily,
            title: 'Family Security',
            description: 'Financial protection for employees\' families and dependents'
        },
        {
            icon: FaUmbrella,
            title: 'Flexible Coverage',
            description: 'Customizable coverage amounts based on employee needs'
        },
        {
            icon: FaHandHoldingHeart,
            title: 'Compassionate Claims',
            description: 'Quick and sensitive claim processing during difficult times'
        }
    ];

    const benefits = [
        'Life Cover up to ₹1 Crore per employee',
        'Accidental Death Benefit (Double Coverage)',
        'Terminal Illness Advance Benefit',
        'No Medical Examination for Group Coverage',
        'Family Conversion Options',
        'Waiver of Premium on Disability',
        'Tax Benefits under Section 80C',
        'Quick Claim Settlement Process'
    ];

    const coverage = [
        {
            type: 'Basic Life Cover',
            amount: '₹5 Lakh - ₹50 Lakh',
            description: 'Standard life insurance coverage for all employees'
        },
        {
            type: 'Enhanced Cover',
            amount: '₹25 Lakh - ₹1 Crore',
            description: 'Higher coverage for senior management and key personnel'
        },
        {
            type: 'Family Benefit',
            amount: '₹2 Lakh - ₹25 Lakh',
            description: 'Additional coverage for spouse and dependent children'
        }
    ];

    const lifeStages = [
        {
            stage: 'Young Professionals',
            age: '22-30 years',
            coverage: '₹10-25 Lakhs',
            premium: 'Starting ₹500/month',
            benefits: ['Loan Protection', 'Future Planning', 'Tax Savings']
        },
        {
            stage: 'Growing Families',
            age: '30-45 years',
            coverage: '₹25-75 Lakhs',
            premium: 'Starting ₹1,200/month',
            benefits: ['Child Education', 'Home Loan Security', 'Retirement Planning']
        },
        {
            stage: 'Senior Management',
            age: '45-60 years',
            coverage: '₹50 Lakhs - ₹1 Crore',
            premium: 'Starting ₹2,500/month',
            benefits: ['Legacy Planning', 'Business Loans', 'Estate Protection']
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
            <div className="relative bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                                    <FaHeart className="mr-2" />
                                    Life Protection
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                                Group Term Life Insurance
                            </h1>
                            <p className="text-xl leading-8 mb-8">
                                Provide your employees and their families with the ultimate financial security. Life insurance coverage that protects what matters most when it's needed the most.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/book-demo"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blue-700 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                >
                                    Protect Your Team
                                </Link>
                                <Link
                                    href="#learn-more"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl transform rotate-6 opacity-20"></div>
                                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                                    <div className="text-center mb-6">
                                        <FaFamily className="h-20 w-20 text-white mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold mb-2">Family First</h3>
                                        <p className="text-blue-100">Protecting the ones you love</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="font-bold">₹1 Crore</div>
                                            <div className="text-blue-100">Max Coverage</div>
                                        </div>
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="font-bold">24 Hours</div>
                                            <div className="text-blue-100">Claim Process</div>
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
                            Comprehensive Life Insurance Protection
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our Group Term Life Insurance provides essential financial security for your employees' families, ensuring peace of mind and protection for life's uncertainties.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className={`relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-xl transition-all duration-300 group`}>
                                <div className="absolute -top-4 left-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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

            {/* Life Stages Coverage */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Coverage for Every Life Stage</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Tailored protection that grows with your employees' needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {lifeStages.map((stage, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500`}>
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-blue-600 mb-2">{stage.stage}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{stage.age}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Coverage:</span>
                                        <span className="text-blue-600 font-bold">{stage.coverage}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Premium:</span>
                                        <span className="text-green-600 font-bold">{stage.premium}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-2">Key Benefits:</p>
                                        <ul className="space-y-1">
                                            {stage.benefits.map((benefit, idx) => (
                                                <li key={idx} className="flex items-center text-sm">
                                                    <FaCheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coverage Options */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Flexible Coverage Options</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Choose the right level of protection for your organization
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {coverage.map((item, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500`}>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-blue-600 mb-2">{item.amount}</h3>
                                    <h4 className="text-xl font-semibold mb-4">{item.type}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">
                                Why Choose Our Life Insurance?
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
                            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} border-2 border-blue-200`}>
                                <div className="text-center">
                                    <FaHeart className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">Peace of Mind</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Give your employees the confidence that their families are financially protected, no matter what life brings.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">98%</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Claim Settlement</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-blue-600">24hr</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Simple Enrollment Process</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Get your team covered in just a few easy steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: FaFileAlt, title: 'Employee Data', description: 'Submit basic employee information' },
                            { icon: FaUmbrella, title: 'Choose Coverage', description: 'Select appropriate coverage levels' },
                            { icon: FaShieldAlt, title: 'Instant Approval', description: 'Quick approval without medical exams' },
                            { icon: FaClock, title: 'Immediate Coverage', description: 'Protection starts from day one' }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white`}>
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Secure Your Team's Future Today
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Provide the ultimate peace of mind with comprehensive life insurance coverage
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
                            Get Quote
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
                            Securing your family's financial future with comprehensive life insurance
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}