import React from 'react';
import { Link } from '@inertiajs/react';
import { FaShieldAlt, FaUsers, FaChartLine, FaHeartbeat, FaClock } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function SmallTeams() {
    const { darkMode } = useTheme();

    const benefits = [
        {
            icon: FaShieldAlt,
            title: 'Flexible Coverage',
            description: 'Customizable insurance plans that grow with your team'
        },
        {
            icon: FaUsers,
            title: 'Easy Administration',
            description: 'Simple dashboard to manage all employee benefits'
        },
        {
            icon: FaChartLine,
            title: 'Cost-Effective',
            description: 'Competitive rates designed for small businesses'
        },
        {
            icon: FaHeartbeat,
            title: 'Wellness Programs',
            description: 'Integrated wellness solutions for team health'
        },
        {
            icon: FaClock,
            title: 'Quick Setup',
            description: 'Get started in days, not weeks or months'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                                Benefits Solutions for Small Teams
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-white/90">
                                Comprehensive employee benefits tailored for startups and growing businesses.
                                Get enterprise-level coverage at SME-friendly prices.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6">
                                <Link
                                    href="/book-demo"
                                    className="rounded-md bg-white px-6 py-3 text-lg font-semibold text-primary shadow-sm hover:bg-gray-100"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="#plans"
                                    className="text-lg font-semibold leading-6 text-white"
                                >
                                    View Plans <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5">
                            <div className="relative mx-auto w-full max-w-lg">
                                <img
                                    src="/assets/images/small-teams.png"
                                    alt="Small Teams Solutions"
                                    className="rounded-lg shadow-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Why Choose Our Small Team Solutions?
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            Designed specifically for teams of 5-100 employees
                        </p>
                    </div>

                    <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="relative">
                                <div className="absolute left-0 top-0 -z-10 h-24 w-24 rounded-full bg-primary/10"></div>
                                <benefit.icon className="h-8 w-8 text-primary" />
                                <h3 className="mt-6 text-xl font-semibold">{benefit.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plans Section */}
            <div id="plans" className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Flexible Plans for Growing Teams
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                            Choose the right coverage level for your team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Starter',
                                price: '999',
                                description: 'Essential coverage for small teams',
                                features: [
                                    'Group Health Insurance',
                                    'Digital Health Cards',
                                    'Basic Wellness Program',
                                    '24/7 Support',
                                    'Mobile App Access'
                                ]
                            },
                            {
                                name: 'Growth',
                                price: '1,999',
                                description: 'Complete coverage for growing teams',
                                features: [
                                    'Everything in Starter',
                                    'Group Personal Accident',
                                    'Term Life Insurance',
                                    'Advanced Wellness Program',
                                    'Priority Support'
                                ],
                                popular: true
                            },
                            {
                                name: 'Scale',
                                price: '2,999',
                                description: 'Premium benefits for established teams',
                                features: [
                                    'Everything in Growth',
                                    'Enhanced Coverage Limits',
                                    'Executive Health Checkups',
                                    'Custom Wellness Programs',
                                    'Dedicated Account Manager'
                                ]
                            }
                        ].map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-2xl p-8 ${
                                    plan.popular
                                        ? 'bg-primary text-white shadow-xl scale-105'
                                        : 'bg-white dark:bg-gray-800 shadow-lg'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 right-4 rounded-full bg-white px-4 py-1 text-sm font-semibold text-primary">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className={`mt-4 ${plan.popular ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {plan.description}
                                </p>
                                <p className="mt-8">
                                    <span className="text-4xl font-bold">₹{plan.price}</span>
                                    <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                        /employee/year
                                    </span>
                                </p>
                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <FaShieldAlt className={`h-5 w-5 ${plan.popular ? 'text-white' : 'text-primary'} mr-2`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/book-demo"
                                    className={`mt-8 block w-full rounded-lg px-4 py-3 text-center font-semibold ${
                                        plan.popular
                                            ? 'bg-white text-primary hover:bg-gray-100'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
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
                                Get started with our small team solutions today. Our experts will help you choose the right plan.
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