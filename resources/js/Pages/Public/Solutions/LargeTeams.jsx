import React from 'react';
import { Link } from '@inertiajs/react';
import { FaUsers, FaCogs, FaShieldAlt, FaPhoneAlt, FaChartLine } from 'react-icons/fa';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default function LargeTeams() {

    const features = [
        { icon: FaCogs, title: 'Scalable Architecture', description: 'Flexible plans that scale with thousands of employees' },
        { icon: FaShieldAlt, title: 'Advanced Risk Cover', description: 'Tailored insurance, underwriting and policy structures' },
        { icon: FaUsers, title: 'Dedicated Support', description: 'Account management and rapid SLA support for HR teams' },
        { icon: FaChartLine, title: 'Advanced Analytics', description: 'Dashboards and exports for benefits optimisation' },
        { icon: FaPhoneAlt, title: 'Integration Ready', description: 'SSO, HRIS and payroll integrations' },
    ];

    return (
        <>
            <Header />
            <div className="py-24 bg-white text-gray-900">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <h1 className="text-3xl md:text-4xl font-dmserif font-semibold mb-4">Solutions for Large Enterprises</h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Enterprise-grade benefits that give large organisations control, compliance and insight — with a partner that can deliver at scale.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {features.map((f, i) => {
                                    const Icon = f.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="w-12 h-12 rounded-md bg-[#f3f0fb] text-[#6a0066] flex items-center justify-center">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{f.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{f.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link href="/book-demo" className="bg-[#934790] text-white px-4 py-2 rounded-lg font-semibold">Book a demo</Link>
                                <Link href="/contact" className="border border-[#934790] text-[#934790] px-4 py-2 rounded-lg font-semibold">Contact Sales</Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6 flex justify-center lg:justify-end">
                            <div className="w-full max-w-md relative">
                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                    <img src="/assets/images/large-teams-hero.jpg" alt="Large teams" className="w-full h-80 object-cover sm:h-96" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                </div>

                                <div className="absolute -bottom-8 left-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500">Organisations supported</div>
                                        <div className="text-xl font-semibold text-gray-800 dark:text-white">1200+</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Avg time to onboard</div>
                                        <div className="text-xl font-semibold text-gray-800 dark:text-white">2–4 weeks</div>
                                    </div>
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
