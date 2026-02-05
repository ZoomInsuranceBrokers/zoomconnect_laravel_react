import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Wellness({
    employee,
    wellnessServices = [],
    categories = [],
}) {
    const [activeTab, setActiveTab] = useState('all');

    /* ---------- HANDLE SERVICE CLICK ---------- */
    const handleServiceClick = (serviceId) => {
        // Open wellness service in new tab
        window.open(route('employee.wellness.service', serviceId), '_blank');
    };

    /* ---------- FILTER SERVICES ---------- */
    const filteredServices =
        activeTab === 'all'
            ? wellnessServices
            : wellnessServices.filter(
                  s => String(s.category?.id) === String(activeTab)
              );

    /* ---------- TELECONSULTATION BANNER ---------- */
    const teleConsultationService = wellnessServices.find(
        s =>
            s.category?.slug === 'teleconsultation' ||
            s.category?.category_name?.toLowerCase().includes('tele')
    );

    return (
        <EmployeeLayout employee={employee}>
            <Head title="Wellness & Care" />

            {/* ================= GRADIENT PAGE WITH WAVES ================= */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 relative overflow-hidden">
                {/* Wave SVG Background */}
                <div className="absolute inset-0 opacity-30">
                    <svg
                        className="absolute bottom-0 left-0 w-full h-64"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                            opacity=".25"
                            className="fill-blue-100"
                        ></path>
                        <path
                            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                            opacity=".5"
                            className="fill-purple-100"
                        ></path>
                        <path
                            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                            className="fill-pink-100"
                        ></path>
                    </svg>
                </div>

                {/* ================= GREY 80% CONTAINER ================= */}
                <div className="max-w-[80%] mx-auto bg-gray-100 rounded-3xl px-8 py-6 relative z-10">

                    {/* ================= HEADER ================= */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
                        </button>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Wellness & Care
                            </h1>
                            <p className="text-sm text-gray-500">
                                What services do you need?
                            </p>
                        </div>
                    </div>

                    {/* ================= BANNER ================= */}
                    {teleConsultationService && (
                        <div className="mb-8">
                            <div 
                                onClick={() => handleServiceClick(teleConsultationService.id)}
                                className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl p-6 flex items-center justify-between text-white cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Free Tele-Consultation
                                    </h2>
                                    <p className="text-sm opacity-90 mt-1">
                                        Talk to expert doctors anytime
                                    </p>

                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleServiceClick(teleConsultationService.id);
                                        }}
                                        className="mt-4 bg-white text-orange-500 font-semibold text-sm px-5 py-2 rounded-full hover:bg-gray-100 transition"
                                    >
                                        Get Started
                                    </button>
                                </div>

                                <img
                                    src={
                                        teleConsultationService.banner_url ||
                                        teleConsultationService.icon_url ||
                                        '/images/teleconsult.png'
                                    }
                                    alt="Teleconsultation"
                                    className="w-40 hidden md:block"
                                />
                            </div>
                        </div>
                    )}

                    {/* ================= CATEGORY ================= */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                            Category
                        </h3>
                    </div>

                    <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                activeTab === 'all'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600'
                            }`}
                        >
                            All
                        </button>

                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap ${
                                    String(activeTab) === String(cat.id)
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-white text-gray-600'
                                }`}
                            >
                                {cat.category_name}
                            </button>
                        ))}
                    </div>

                    {/* ================= RECOMMENDED ================= */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">
                            Recommended
                        </h3>
                    </div>

                    {/* ================= SERVICES ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredServices.map(service => (
                            <div
                                key={service.id}
                                onClick={() => handleServiceClick(service.id)}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 p-4 group"
                            >
                                {/* IMAGE LEFT */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <img
                                        src={
                                            service.icon_url ||
                                            service.banner_url ||
                                            '/images/default.png'
                                        }
                                        alt={service.wellness_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {service.wellness_name}
                                    </h4>

                                    {service.vendor && (
                                        <p className="text-xs text-gray-500">
                                            by {service.vendor.vendor_name}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <span>⭐⭐⭐⭐⭐ </span>
                                        <span>Verified Partner</span>
                                    </div>
                                </div>

                                {/* OFFER */}
                                {service.description && (
                                    <span className="text-xs font-semibold text-orange-500 group-hover:scale-110 transition-transform">
                                        {service.description}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </EmployeeLayout>
    );
}
