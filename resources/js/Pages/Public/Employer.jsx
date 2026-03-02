import React, { useState } from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

const features = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        color: "from-[#934790] to-[#850e7f]",
        border: "border-[#934790]/30",
        light: "bg-[#f5ecf5]",
        dot: "#934790",
        title: "HR Dashboard",
        subtitle: "Real-time Overview",
        desc: "Get a bird's-eye view of your entire workforce — active employees, pending enrollments, live policy stats, and endorsement summaries, all on one intelligent dashboard.",
        points: ["Workforce analytics at a glance", "Pending action alerts", "Policy & enrollment KPIs", "Quick access to all modules"],
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        color: "from-[#FF0066] to-[#c2004e]",
        border: "border-[#FF0066]/30",
        light: "bg-[#fff0f5]",
        dot: "#FF0066",
        title: "Employee Management",
        subtitle: "Complete Workforce Control",
        desc: "Maintain a comprehensive, searchable employee directory. Track employment history, status, location, grade, and designation with powerful filtering and export capabilities.",
        points: ["Advanced search & filters", "Active / Inactive tracking", "CSV export in one click", "Branch & grade segmentation"],
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: "from-[#FFB300] to-[#e09800]",
        border: "border-[#FFB300]/30",
        light: "bg-[#fff8e1]",
        dot: "#FFB300",
        title: "Policy Management",
        subtitle: "Insurance Policy Hub",
        desc: "View, track, and manage all group insurance policies in one place. Drill into policy details, coverage limits, insurer information, and premium breakdowns.",
        points: ["Policy status & validity", "Coverage & sum insured details", "Insurer & broker info", "Member count per policy"],
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        color: "from-[#934790] to-[#FF0066]",
        border: "border-[#934790]/30",
        light: "bg-[#fdf0f9]",
        dot: "#934790",
        title: "Enrollments",
        subtitle: "Member Enrollment Portal",
        desc: "Streamline new member enrollments for your group insurance policies. Manage employee and dependent additions with real-time status tracking and confirmation workflows.",
        points: ["Self-service enrollment portal", "Dependent management", "Enrollment status tracking", "Automated confirmation emails"],
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        color: "from-[#FFB300] to-[#934790]",
        border: "border-[#FFB300]/30",
        light: "bg-[#fff8ec]",
        dot: "#FFB300",
        title: "Endorsements",
        subtitle: "Policy Change Requests",
        desc: "Handle mid-term policy changes with ease. Submit, track, and manage member additions, deletions, and corrections — all with full audit trails and insurer communication.",
        points: ["Natural additions & deletions", "Bulk endorsement uploads", "Real-time approval status", "Detailed member change logs"],
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        color: "from-[#850e7f] to-[#FF0066]",
        border: "border-[#850e7f]/30",
        light: "bg-[#fce8fb]",
        dot: "#850e7f",
        title: "Surveys",
        subtitle: "Employee Feedback",
        desc: "Collect and analyze employee feedback on insurance benefits and HR services. Run targeted surveys, gather insights, and improve employee satisfaction across your organization.",
        points: ["Custom survey builder", "Auto-assigned surveys", "Response tracking", "Analytics & reporting"],
    },
];

const stats = [
    { value: "10,000+", label: "Employees Managed", icon: "👥" },
    { value: "500+", label: "Policies Tracked", icon: "📋" },
    { value: "98%", label: "Enrollment Accuracy", icon: "✅" },
    { value: "24/7", label: "Portal Availability", icon: "🔒" },
];

const workflow = [
    { step: "01", title: "Onboard Your Company", desc: "Set up your organization profile, add locations, and configure your insurance policies in minutes." },
    { step: "02", title: "Import Employees", desc: "Bulk import your employee data or add employees individually with all relevant details." },
    { step: "03", title: "Manage Enrollments", desc: "Enroll employees and their dependents into group insurance policies with built-in validation." },
    { step: "04", title: "Track & Endorse", desc: "Handle mid-term changes, new joiners, exits, and corrections through the endorsement module." },
    { step: "05", title: "Monitor & Report", desc: "Use the dashboard to monitor all activities and export detailed reports for compliance." },
];

export default function Employer() {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: 'linear-gradient(135deg, #1a0a1e 0%, #2d0a3a 40%, #4a0a50 100%)' }}>
                {/* Background orbs using brand colors */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" style={{ background: 'rgba(147,71,144,0.35)' }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" style={{ background: 'rgba(255,0,102,0.20)' }} />
                <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'rgba(255,179,0,0.12)' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 border border-white/20" style={{ background: 'rgba(147,71,144,0.25)' }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FFB300' }}></span>
                            <span className="text-white/80 text-xs font-medium tracking-wide">HR Portal — Built for Modern Teams</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Your Complete
                            <span className="block" style={{ background: 'linear-gradient(90deg, #FFB300, #FF0066, #934790)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HR & Benefits</span>
                            Management Hub
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
                            Manage employees, track insurance policies, handle endorsements, and streamline enrollments — all from one powerful portal designed for HR teams.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/company-user/login" className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg" style={{ background: 'linear-gradient(135deg, #934790, #FF0066)', boxShadow: '0 8px 32px rgba(147,71,144,0.4)' }}>
                                Access HR Portal
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                            <a href="#features" className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/10 transition-all" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                Explore Features
                            </a>
                        </div>
                    </div>

                    {/* Right — dashboard preview cards */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {[
                            { icon: "👥", title: "Employees", value: "178", sub: "Active Members", from: 'rgba(147,71,144,0.25)', border: 'rgba(147,71,144,0.4)' },
                            { icon: "📋", title: "Policies", value: "12", sub: "Active Policies", from: 'rgba(255,179,0,0.18)', border: 'rgba(255,179,0,0.4)' },
                            { icon: "✍️", title: "Endorsements", value: "34", sub: "Pending Review", from: 'rgba(255,0,102,0.18)', border: 'rgba(255,0,102,0.4)' },
                            { icon: "📝", title: "Enrollments", value: "56", sub: "This Month", from: 'rgba(133,14,127,0.25)', border: 'rgba(133,14,127,0.4)' },
                        ].map((card, i) => (
                            <div key={i} className="backdrop-blur-sm rounded-2xl p-5 hover:scale-105 transition-all duration-300" style={{ background: card.from, border: `1px solid ${card.border}` }}>
                                <div className="text-2xl mb-3">{card.icon}</div>
                                <div className="text-white/60 text-xs uppercase tracking-wider mb-1">{card.title}</div>
                                <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                                <div className="text-white/40 text-xs">{card.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-10" style={{ background: 'linear-gradient(90deg, #934790, #850e7f, #FF0066)' }}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl mb-1">{s.icon}</div>
                            <div className="text-3xl font-bold text-white">{s.value}</div>
                            <div className="text-white/70 text-sm mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24" style={{ background: '#ffceea20' }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: '#f5ecf5', color: '#934790' }}>Platform Features</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything HR Needs, <br className="hidden sm:block" />In One Place</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">From onboarding to endorsements, our HR portal covers the entire employee benefits lifecycle.</p>
                    </div>

                    {/* Feature tabs navigation */}
                    <div className="flex flex-wrap justify-center gap-3 mb-14">
                        {features.map((f, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveFeature(i)}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                                style={activeFeature === i
                                    ? { background: `linear-gradient(135deg, ${f.dot}, #850e7f)`, color: '#fff', boxShadow: `0 4px 20px ${f.dot}55` }
                                    : { background: '#fff', border: '1px solid #e5e7eb', color: '#6b7280' }}
                            >
                                {f.title}
                            </button>
                        ))}
                    </div>

                    {/* Active feature detail */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="grid lg:grid-cols-2">
                            <div className="p-10 lg:p-14 flex flex-col justify-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white mb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${features[activeFeature].dot}, #850e7f)` }}>
                                    {features[activeFeature].icon}
                                </div>
                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{features[activeFeature].subtitle}</div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{features[activeFeature].title}</h3>
                                <p className="text-gray-500 text-base leading-relaxed mb-8">{features[activeFeature].desc}</p>
                                <ul className="space-y-3">
                                    {features[activeFeature].points.map((pt, j) => (
                                        <li key={j} className="flex items-center gap-3 text-gray-700 text-sm">
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white flex-shrink-0" style={{ background: features[activeFeature].dot }}>
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </span>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={`${features[activeFeature].light} p-10 lg:p-14 flex items-center justify-center`}>
                                <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                                    <div className="px-5 py-4 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${features[activeFeature].dot}, #850e7f)` }}>
                                        <div className="text-white opacity-90">{features[activeFeature].icon}</div>
                                        <span className="text-white font-semibold text-sm">{features[activeFeature].title}</span>
                                        <div className="ml-auto flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-white/40"></span>
                                            <span className="w-2 h-2 rounded-full bg-white/40"></span>
                                            <span className="w-2 h-2 rounded-full bg-white/40"></span>
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        {features[activeFeature].points.map((pt, j) => (
                                            <div key={j} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl border ${features[activeFeature].light}`} style={{ borderColor: `${features[activeFeature].dot}22` }}>
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: features[activeFeature].dot }}></div>
                                                <span className="text-gray-700 text-xs font-medium">{pt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Features Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: '#fce8fb', color: '#850e7f' }}>All Modules</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">A Complete Suite for HR Teams</h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">Every module is designed to reduce manual effort and improve accuracy across your HR operations.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                                style={{ borderColor: activeFeature === i ? f.dot : undefined }}
                                onClick={() => { setActiveFeature(i); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" style={{ background: `linear-gradient(135deg, ${f.dot}08, transparent)` }} />
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white mb-5 shadow-md" style={{ background: `linear-gradient(135deg, ${f.dot}, #850e7f)` }}>
                                    {f.icon}
                                </div>
                                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{f.subtitle}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.desc.substring(0, 100)}...</p>
                                <div className="flex flex-wrap gap-2">
                                    {f.points.slice(0, 2).map((pt, j) => (
                                        <span key={j} className="text-[11px] font-semibold px-2.5 py-1 rounded-full text-gray-700" style={{ background: `${f.dot}15` }}>{pt}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a0a1e 0%, #2d0a3a 60%, #4a0a50 100%)' }}>
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(147,71,144,0.15)' }} />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: 'rgba(255,0,102,0.12)' }} />
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="inline-block text-white/70 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-white/10" style={{ background: 'rgba(147,71,144,0.2)' }}>How It Works</span>
                        <h2 className="text-4xl font-bold text-white mb-4">Get Started in Minutes</h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto">A simple onboarding journey that gets your HR team fully operational fast.</p>
                    </div>
                    <div className="relative">
                        <div className="hidden lg:block absolute top-8 left-[calc(10%+32px)] right-[calc(10%+32px)] h-0.5 opacity-30" style={{ background: 'linear-gradient(90deg, #934790, #FF0066, #FFB300)' }} />
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
                            {workflow.map((w, i) => (
                                <div key={i} className="flex flex-col items-center text-center">
                                    <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-5 flex-shrink-0 z-10" style={{ background: 'linear-gradient(135deg, #934790, #FF0066)', boxShadow: '0 8px 24px rgba(147,71,144,0.4)' }}>
                                        {w.step}
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-2">{w.title}</h3>
                                    <p className="text-white/40 text-xs leading-relaxed">{w.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits section */}
            <section className="py-24" style={{ background: '#ffceea20' }}>
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ background: '#fff8e1', color: '#e09800' }}>Why Our HR Portal</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Built for Scale, <br />Designed for People</h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            Our HR portal eliminates manual paperwork, reduces errors, and gives your team instant access to accurate, real-time information — so you can focus on your people, not processes.
                        </p>
                        <div className="space-y-4">
                            {[
                                { title: "Centralized Data", desc: "All employee, policy, and enrollment data in one secure place.", icon: "🗂️", color: '#934790' },
                                { title: "Role-Based Access", desc: "HR managers and employees see only what they need.", icon: "🔐", color: '#FF0066' },
                                { title: "Audit Trails", desc: "Every change is logged for compliance and accountability.", icon: "📌", color: '#FFB300' },
                                { title: "Automated Workflows", desc: "From enrollment confirmations to endorsement notifications.", icon: "⚡", color: '#850e7f' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: `${b.color}25` }}>
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: `${b.color}15` }}>{b.icon}</div>
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm mb-0.5" style={{ color: b.color }}>{b.title}</div>
                                        <div className="text-gray-500 text-xs">{b.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 rounded-3xl transform rotate-3" style={{ background: 'linear-gradient(135deg, #f5ecf5, #fce8fb)' }} />
                        <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">HR Dashboard</div>
                                    <div className="text-xl font-bold text-gray-900">Company Overview</div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: "Total Employees", val: "178", color: "#934790", bg: "#f5ecf5" },
                                    { label: "Active Policies", val: "12", color: "#FFB300", bg: "#fff8e1" },
                                    { label: "Endorsements", val: "8 Pending", color: "#FF0066", bg: "#fff0f5" },
                                    { label: "Enrollments", val: "56 Done", color: "#850e7f", bg: "#fce8fb" },
                                ].map((item, i) => (
                                    <div key={i} className="rounded-xl p-4" style={{ background: item.bg }}>
                                        <div className="text-xl font-bold mb-1" style={{ color: item.color }}>{item.val}</div>
                                        <div className="text-xs text-gray-500">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-xl p-4" style={{ background: '#f9f9f9' }}>
                                <div className="text-xs text-gray-500 mb-3 font-semibold">Recent Activity</div>
                                {[
                                    { action: "New employee added", time: "2 min ago", dot: "#934790" },
                                    { action: "Policy #GMC-2024 renewed", time: "1 hr ago", dot: "#FFB300" },
                                    { action: "Endorsement submitted", time: "3 hrs ago", dot: "#FF0066" },
                                ].map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: a.dot }} />
                                        <span className="text-xs text-gray-700 flex-1">{a.action}</span>
                                        <span className="text-[10px] text-gray-400">{a.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #934790, #850e7f, #FF0066)' }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[80px]" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[60px]" style={{ background: 'rgba(255,179,0,0.15)' }} />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Modernize<br />Your HR Operations?
                    </h2>
                    <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join hundreds of HR teams who manage their workforce, policies, and benefits on one unified portal — saving hours every week.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a href="/company-user/login" className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl text-sm" style={{ background: '#FFB300', color: '#1a0a1e' }}>
                            Login to HR Portal
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                        <a href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-sm" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
