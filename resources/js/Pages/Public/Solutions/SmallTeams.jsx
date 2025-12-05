import React from 'react';
import { Link } from '@inertiajs/react';
import { FaShieldAlt, FaUsers, FaChartLine, FaHeartbeat, FaClock, FaCheck, FaDownload } from 'react-icons/fa';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';

export default function SmallTeams() {

    const whyChooseUs = [
        {
            title: 'Budget-friendly flexibility',
            description: 'Healthcare Plans Designed To Adapt As You Grow.'
        },
        {
            title: 'Stress-free claims',
            description: 'Paperless Processes With 24/7 Support For You And Your Employees.'
        },
        {
            title: 'Inclusive coverage',
            description: 'Policies Covering Families, LGBTQ+ Partners, And Even Modern Treatments Like IVF And Robotic Surgeries.'
        }
    ];

    const stats = [
        { value: '6000', label: 'Companies Covered' },
        { value: '40+', label: 'Including Unicorns' }
    ];

    const trustedLogos = [
        { name: 'CRED', bgColor: 'bg-gray-800' },
        { name: 'WeWork', bgColor: 'bg-gray-800' },
        { name: 'Swiggy', bgColor: 'bg-gray-800' },
        { name: 'Growin', bgColor: 'bg-gray-800' }
    ];

    const insights = [
        '70% of startups include mental health treatments in their packages',
        'Employee healthcare budgets for startups are growing by 15% annually',
        '46% offer maternity coverage of up to ₹75,000'
    ];

    const features = [
        {
            title: '90-second onboarding',
            description: 'Simplified, paperless policy setup.'
        },
        {
            title: 'Real-time analytics',
            description: 'Monitor employee claims and wellness costs on a smart admin dashboard.'
        },
        {
            title: 'Seamless integrations',
            description: 'Sync effortlessly with HRM and payroll software.'
        }
    ];

    return (
        <>
            <Header />

            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 lg:py-28">
                <div className="absolute inset-0 opacity-70">
                    <img
                        src="/assets/images/wavy design-01.png"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-7xl z-10 mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold font-dmserif leading-tight mb-6">Employee Benefits & Solutions for <span className="text-[#FF0066]/80">Small Teams</span></h1>
                        <p className="text-sm md:text-base text-gray-600 mb-8 max-w-xl">From health, wellness, insurance, and professional development — comprehensive solutions to grow your team.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/book-demo"
                                className="bg-[#FF0066]/80 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-[#df0059cc] hover:text-white transition"
                            >
                                Schedule a Call
                            </Link>
                            <Link
                                href="/contact"
                                className="border border-[#E8D4B7] bg-[#934790] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#6a0066] hover:text-white transition"
                            >
                                Contact Us
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-sm text-gray-700">
                            <span>24×7 support</span>
                            <span className="h-6 w-px bg-gray-200" />
                            <span>Flexible team sizes</span>
                            <span className="h-6 w-px bg-gray-200" />
                            <span>Quick onboarding</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <img src="/assets/images/small-teams-hero.jpg" alt="Team meeting" className="w-full h-[500px] object-cover" />
                        </div>
                    </div>
                </div>
            </section>


            {/* Trusted By Section */}
            <div className="py-20 bg-[#3d1139] text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        {/* Left: Title */}
                        <div>
                            <h2 className="text-4xl font-dmserif font-bold leading-tight">
                                Trusted by<br />industry<br />leaders
                            </h2>
                            <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/80">Healthtech Of The Year</div>
                                    <div className="font-semibold">2023-2024</div>
                                    <div className="text-xs text-white/80">Global FinSet Fest</div>
                                </div>
                            </div>
                        </div>

                        {/* Center: Stats */}
                        <div className="text-center">
                            <div className="space-y-8">
                                {stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <div className="text-6xl font-bold mb-2">{stat.value}</div>
                                        <div className="text-lg text-white/80">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Logos */}
                        <div>
                            <div className="mb-6 text-sm text-white/80">Who trust us for their employee healthcare.</div>
                            <div className="grid grid-cols-2 gap-4">
                                {trustedLogos.map((logo, idx) => (
                                    <div key={idx} className={`${logo.bgColor} rounded-lg p-6 flex items-center justify-center`}>
                                        <span className="text-white font-semibold text-lg">{logo.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Startups Love Section */}
            <div className="py-20 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left */}
                        <div>
                            <h2 className="text-5xl font-dmserif font-bold mb-6">
                                Why<br />startups<br />love ZoomConnect
                            </h2>
                            <p className="text-lg mb-8 text-gray-600">
                                We give your healthcare plan points, so you can focus on scaling.
                            </p>
                            <Link
                                href="/learn-more"
                                className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition-all"
                            >
                                LEARN MORE
                            </Link>
                        </div>

                        {/* Right */}
                        <div className="space-y-6">
                            {whyChooseUs.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-6 rounded-xl border bg-gray-50 border-gray-200"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights Section */}
            <div className="py-20 bg-[#3d1139] text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Decorative Image */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/assets/images/office-space.jpg"
                                    alt="Office interior"
                                    className="w-full h-[500px] object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div>
                            <h2 className="text-4xl font-dmserif font-bold mb-8">
                                We know our stuff
                            </h2>
                            <p className="text-lg mb-6 text-white/90">
                                Insights from State of Employee Benefits (2024 Report)
                            </p>

                            <div className="space-y-4 mb-8">
                                {insights.map((insight, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="w-3 h-3 text-white" />
                                        </div>
                                        <p className="text-white/90">{insight}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-all border border-white/20">
                                <span>DOWNLOAD REPORT</span>
                                <FaDownload className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* What Makes Perfect Section */}
            <div className="py-20 bg-white text-gray-900">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left */}
                        <div>
                            <h2 className="text-5xl font-dmserif font-bold mb-12">
                                What makes ZoomConnect perfect for startups?
                            </h2>

                            <div className="space-y-8">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-gray-600">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/assets/images/person-plants.jpg"
                                    alt="Person with plants"
                                    className="w-full h-[600px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
