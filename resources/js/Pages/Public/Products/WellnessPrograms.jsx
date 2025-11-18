import React from 'react';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import ScrollProgressBar from '../../../Components/ScrollProgressBar';

const WellnessPrograms = () => {
    return (
        <>
            <ScrollProgressBar />
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-x-hidden bg-[#ffceea78] text-gray-900 py-24 ">
                {/* HERO SECTION - 60/40 split: Mobile App (60%) + Corporate Physical Wellness (40%) */}
                <section className="min-h-screen w-full  relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        {/* Unified Hero: single container with 60/40 split and a purple wavy divider */}
                        <div className="md:col-span-12">
                            <div className="bg-gradient-to-r from-[#fff0f6] to-[#ffe8f2] rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
                                {/* optional decorative blob */}
                                <svg className="absolute -left-4 -top-12 opacity-30 z-0" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="110" cy="110" r="110" fill="#FFB6D5" />
                                </svg>

                                <svg className="block md:hidden absolute -right-10 -bottom-6 opacity-90 z-0" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="150" cy="150" r="150" fill="#70256eff" />
                                </svg>
                                <svg className="hidden md:block absolute -right-24 -bottom-20 opacity-90 z-0" width="650" height="650" viewBox="0 0 650 650" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <circle cx="325" cy="325" r="325" fill="#70256eff" />
                                </svg>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    {/* Left: Mobile App Benefits (60%) */}
                                    <div className="md:col-span-7 md:pr-6 z-10">
                                        <h2 className="text-3xl md:text-4xl font-dmserif font-semibold text-[#1a2433] mb-4">Wellness on your phone</h2>
                                        <p className="text-gray-700 mb-6">Deliver holistic care to your employees wherever they are — fast, affordable, and frictionless. Our mobile app bundles everyday wellness tools in one place.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-6 h-6 text-[#FF0066]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a9 9 0 100 18 9 9 0 000-18zm1 13h-2v-2h2v2zm0-4h-2V6h2v5z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Medicine at Discount</h3>
                                                    <p className="text-sm text-gray-600">Access discounted medications through partner pharmacies and same-day delivery options.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-6 h-6 text-[#934790]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm6 2h-1.26A6.002 6.002 0 016.26 16H5a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2a1 1 0 00-1-1z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Video Doctor Consults</h3>
                                                    <p className="text-sm text-gray-600">On-demand or scheduled video calls with licensed doctors for primary care and specialist referrals.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-6 h-6 text-[#0066ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3v18h18V3zM8 19H5V8h3v11zm6 0h-3V5h3v14zm6 0h-3v-6h3v6z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Book Lab Tests</h3>
                                                    <p className="text-sm text-gray-600">Schedule diagnostics at partner labs with discounted pricing and home sample collection.</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow">
                                                    <svg className="w-6 h-6 text-[#00b37e]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">Other Wellness Services</h3>
                                                    <p className="text-sm text-gray-600">Health coaching, nutrition plans, mental health support, and tailored wellness programs.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 text-center md:text-left">
                                            <a href="#features" className="inline-block bg-[#FF0066] text-white px-5 py-2 rounded-lg shadow hover:opacity-95 transition">Get the App</a>
                                        </div>
                                    </div>

                                    {/* Right: Corporate Physical Wellness (40%) */}
                                    <div className="md:col-span-5 md:pl-6 flex justify-center z-10">
                                        <div className=" rounded-2xl p-6 md:pt-0 md:pr-4 md:pb-8 md:pl-8 w-full">
                                            <h3 className="text-xl md:text-3xl font-medium text-white mb-3 font-dmserif">Physical wellness at work</h3>
                                            <p className="text-white mb-4">Bring wellness to the office with programs that encourage movement, preventive care, and team wellbeing.</p>

                                            <ul className="space-y-4">
                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#934790] mt-1">●</span>
                                                    <div>
                                                        <h4 className="font-semibold text-white">Zumba & Group Fitness</h4>
                                                        <p className="text-sm text-white">Energetic sessions led by certified instructors — great for building team morale.</p>
                                                    </div>
                                                </li>

                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#FF0066] mt-1">●</span>
                                                    <div>
                                                        <h4 className="font-semibold text-white">Health Checkup Camps</h4>
                                                        <p className="text-sm text-white">On-site screenings and preventive checks to detect issues early and promote long-term health.</p>
                                                    </div>
                                                </li>

                                                <li className="flex items-start space-x-3">
                                                    <span className="text-[#00b37e] mt-1">●</span>
                                                    <div>
                                                        <h4 className="font-semibold text-white">Wellness Challenges</h4>
                                                        <p className="text-sm text-white">Step, hydration, and mindfulness challenges to keep employees engaged and active.</p>
                                                    </div>
                                                </li>
                                            </ul>

                                            {/* <div className="mt-6 flex items-center justify-between">
                                                <a href="#contact" className="text-sm font-semibold text-[#0066ff]">Request an on-site program</a>
                                                <img src="/assets/images/wellness_group.png" alt="group exercise" className="w-24 h-24 object-cover rounded-md shadow-sm" />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="w-full relative py-16">
                    <div className="max-w-6xl mx-auto text-center  px-6 relative">
                        <h2 className="text-xl md:text-5xl font-dmserif font-semibold text-white mb-4">
                            Features of Wellness Programs
                        </h2>
                        <p className="text-white/80 text-xs md:text-base mb-12 max-w-3xl mx-auto">
                            Comprehensive benefits designed to support physical, mental, and emotional health.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                            {/* Feature 1 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#FF0066]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Health Checkups & Lab Tests</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Routine medical checkups, blood tests, and preventive screenings available as per policy.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#934790]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#934790]/10 to-[#6a0066]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#934790]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Fitness & Exercise Programs</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Participate in Zumba, yoga, aerobics, or gym sessions to promote physical wellness.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#934790]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-10 text-[#FF0066]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Health Camps</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Periodic health camps for general wellness, vaccination drives, or specialized medical screenings.
                                </p>
                            </div>

                            {/* Feature 4 */}
                            <div className="group bg-white rounded-3xl p-6 transition-all duration-300 flex flex-col items-center text-center border-2 border-transparent hover:border-[#FF0066]/20" style={{ boxShadow: '0px 0.75rem 1.75rem #8b3786bd' }}>
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF0066]/10 to-[#d40055]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-10 h-12 text-[#934790]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#1a3a52] mb-3">Dental & Eye Care</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    On-site or covered checkups, preventive care, and consultations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default WellnessPrograms;
