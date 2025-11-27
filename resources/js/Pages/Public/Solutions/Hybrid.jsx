import React from 'react';
import { Link } from '@inertiajs/react';
import { FaLaptopHouse, FaMapMarkedAlt, FaUserShield, FaStethoscope, FaCloud } from 'react-icons/fa';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default function Hybrid() {

    const perks = [
        { icon: FaLaptopHouse, title: 'Remote-first coverage', description: 'Benefits tailored for remote employees and co-working staff' },
        { icon: FaMapMarkedAlt, title: 'Geo-flex policies', description: 'Location-aware benefits and allowances' },
        { icon: FaUserShield, title: 'Compliance-ready', description: 'Policies that meet multi-state and regulatory needs' },
        { icon: FaStethoscope, title: 'Telehealth & wellness', description: 'Virtual care and wellness programs for distributed teams' },
        { icon: FaCloud, title: 'Centralised admin', description: 'Unified dashboard for hybrid workforce management' },
    ];

    return (
        <>
            <Header />
            <div className="py-24 bg-white text-gray-900">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1">
                            <h1 className="text-3xl md:text-4xl font-dmserif font-semibold mb-4">Benefits for hybrid workforces</h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Support teams across offices, cities and remote locations with policies that adapt to where your people work.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {perks.map((p, i) => {
                                    const Icon = p.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <div className="w-12 h-12 rounded-md bg-[#fff5f7] text-[#dd4b63] flex items-center justify-center">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{p.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Link href="/book-demo" className="bg-[#dd4b63] text-white px-4 py-2 rounded-lg font-semibold">Book a demo</Link>
                                <Link href="/contact" className="border border-[#dd4b63] text-[#dd4b63] px-4 py-2 rounded-lg font-semibold">Talk to us</Link>
                            </div>
                        </div>

                        <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-start">
                            <div className="w-full max-w-md relative">
                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                    <img src="/assets/images/hybrid-hero.jpg" alt="Hybrid workforce" className="w-full h-80 object-cover sm:h-96" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                </div>

                                <div className="absolute -bottom-8 left-6 right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500">Coverage across</div>
                                        <div className="text-xl font-semibold text-gray-800 dark:text-white">50+ cities</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Avg response time</div>
                                        <div className="text-xl font-semibold text-gray-800 dark:text-white"><span>24</span> hrs</div>
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
