import React from 'react';
import CompanyUserLayout from '@/Layouts/CompanyUserLayout';
import { 
    FiArrowUpRight, FiMoreHorizontal, FiPlay, FiPause, 
    FiMonitor, FiCheckCircle, FiCircle, FiChevronDown, FiChevronRight
} from 'react-icons/fi';

export default function Dashboard({ user, stats }) {
    
    // --- Sub-components for cleaner code ---

    const StatBig = ({ value, label, icon }) => (
        <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 text-lg">{icon}</span>
                <span className="text-5xl font-light text-[#1f1f1f]">{value}</span>
            </div>
            <span className="text-xs font-medium text-gray-500 ml-7">{label}</span>
        </div>
    );

    const AccordionItem = ({ title, subTitle, icon, isOpen = false }) => (
        <div className={`mb-4 transition-all duration-300 ${isOpen ? 'pb-2' : ''}`}>
            <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-lg">{icon}</div>}
                    <div>
                        <h4 className="text-sm font-medium text-gray-800">{title}</h4>
                        {subTitle && <p className="text-xs text-gray-500">{subTitle}</p>}
                    </div>
                </div>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="mt-3 pl-0 animate-fadeIn">
                     {/* Content for open state (like the laptop in the image) */}
                     {title === 'Devices' && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
                             <div className="w-10 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded flex items-center justify-center text-white">
                                <FiMonitor size={14} />
                             </div>
                             <div>
                                 <div className="text-sm font-semibold">MacBook Air</div>
                                 <div className="text-[10px] text-gray-500">Version M1</div>
                             </div>
                             <FiMoreHorizontal className="ml-auto text-gray-400" />
                        </div>
                     )}
                </div>
            )}
        </div>
    );

    const OnboardingTask = ({ icon, title, date, checked, isLast }) => (
        <div className="flex items-start gap-4 mb-6 relative">
            {!isLast && <div className="absolute left-[19px] top-8 bottom-[-16px] w-[1px] bg-gray-700/50"></div>}
            
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${checked ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-400'}`}>
                {icon}
            </div>
            <div className="flex-1 pt-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h5 className={`text-sm font-medium ${checked ? 'text-gray-200' : 'text-gray-400'}`}>{title}</h5>
                        <span className="text-xs text-gray-500">{date}</span>
                    </div>
                    {checked ? (
                        <div className="w-5 h-5 bg-[#fccb6f] rounded-full flex items-center justify-center text-black text-xs">✓</div>
                    ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-600"></div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <CompanyUserLayout user={user}>
            {/* Header Section: Welcome & Top Stats Widget */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-light text-[#1f1f1f] mb-8">
                        Welcome in, {user?.first_name || 'Nixtio'}
                    </h1>
                    
                    {/* The Capsule Widget */}
                    <div className="inline-flex flex-wrap items-center bg-transparent gap-4">
                        <div className="flex bg-[#2d2d2d] text-white rounded-full p-1 pl-4 pr-1 items-center gap-2">
                            <span className="text-xs font-medium">Interviews</span>
                            <span className="bg-[#3d3d3d] px-3 py-1 rounded-full text-xs">15%</span>
                        </div>
                        <div className="flex bg-[#fccb6f] text-[#2d2d2d] rounded-full p-1 pl-4 pr-1 items-center gap-2 shadow-lg shadow-yellow-200/50">
                            <span className="text-xs font-bold">Hired</span>
                            <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-bold">15%</span>
                        </div>
                        <div className="flex items-center gap-2 px-2">
                            <div className="text-xs font-medium text-gray-500">Project time</div>
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full w-[60%] bg-gray-300 repeating-linear-gradient-45"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500">60%</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 border border-gray-300 rounded-full py-1.5 px-3">
                            <span className="text-xs font-medium text-gray-500">Output</span>
                            <span className="text-xs font-bold text-gray-800">10%</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Big Stats */}
                <div className="flex gap-12 md:mr-4">
                    <StatBig value="78" label="Employe" icon="👥" />
                    <StatBig value="56" label="Hirings" icon="🤝" />
                    <StatBig value="203" label="Projects" icon="💼" />
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Column: Profile & Accordion (Span 3) */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Card */}
                    <div className="relative h-[320px] rounded-[30px] overflow-hidden group shadow-xl shadow-gray-200/50">
                        {/* Placeholder Image */}
                        <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Glass Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-white">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-xl font-medium text-white shadow-sm">Lora Piterson</h2>
                                    <p className="text-xs text-white/80">UX/UI Designer</p>
                                </div>
                                <div className="bg-[#2d2d2d]/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                    $1,200
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Menu */}
                    <div className="bg-transparent pl-2 pt-4">
                        <AccordionItem title="Pension contributions" />
                        <AccordionItem title="Devices" isOpen={true} />
                        <AccordionItem title="Compensation Summary" />
                        <AccordionItem title="Employee Benefits" />
                    </div>
                </div>

                {/* Middle Column: Charts & Calendar (Span 5) */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    
                    {/* Top Row: Progress & Time Tracker */}
                    <div className="grid grid-cols-2 gap-6">
                        
                        {/* Progress Bar Chart */}
                        <div className="bg-white rounded-[30px] p-6 shadow-sm relative">
                            <div className="absolute top-6 right-6 p-2 rounded-full border border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <FiArrowUpRight className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-1">Progress</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-light text-[#1f1f1f]">6.1 h</span>
                                <span className="text-[10px] text-gray-500 leading-tight">Work Time<br/>this week</span>
                                <span className="ml-auto bg-[#fccb6f] px-2 py-0.5 rounded text-[10px] font-bold">5h 23m</span>
                            </div>

                            {/* Custom Bars */}
                            <div className="flex items-end justify-between h-24 gap-2">
                                {[
                                    { d: 'S', h: '30%', a: false },
                                    { d: 'M', h: '60%', a: false }, 
                                    { d: 'T', h: '40%', a: false }, 
                                    { d: 'W', h: '30%', a: false }, 
                                    { d: 'T', h: '80%', a: false }, // Tallest
                                    { d: 'F', h: '55%', a: true },  // Active (Yellow)
                                    { d: 'S', h: '25%', a: false }
                                ].map((bar, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                                        <div className="w-2.5 h-full bg-transparent flex items-end rounded-full overflow-hidden relative">
                                            {/* Track */}
                                            <div className="absolute inset-0 bg-gray-100 rounded-full"></div>
                                            {/* Fill */}
                                            <div 
                                                className={`w-full rounded-full z-10 ${bar.a ? 'bg-[#fccb6f]' : 'bg-[#2d2d2d]'}`} 
                                                style={{ height: bar.h }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-medium">{bar.d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Time Tracker Circular */}
                        <div className="bg-white rounded-[30px] p-6 shadow-sm flex flex-col items-center justify-between relative">
                            <div className="absolute top-6 right-6 p-2 rounded-full border border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <FiArrowUpRight className="text-gray-400" />
                            </div>
                            <div className="w-full text-left">
                                <h3 className="text-lg font-medium text-gray-800">Time tracker</h3>
                            </div>
                            
                            {/* Circle SVG */}
                            <div className="relative w-32 h-32 mt-2">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                                    <circle 
                                        cx="64" cy="64" r="56" fill="none" stroke="#fccb6f" strokeWidth="8" 
                                        strokeDasharray="351" strokeDashoffset="100" strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-medium text-[#1f1f1f]">02:35</span>
                                    <span className="text-[10px] text-gray-400">Work Time</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50"><FiPlay size={12} fill="currentColor" /></button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:bg-gray-50"><FiPause size={12} fill="currentColor" /></button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#2d2d2d] text-white shadow-sm"><span className="text-xs font-bold">↺</span></button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Calendar */}
                    <div className="bg-white rounded-[30px] p-6 shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <button className="text-xs font-bold text-gray-400 hover:text-gray-800 bg-gray-50 px-3 py-1 rounded-full">August</button>
                            <h3 className="text-md font-semibold text-gray-800">September 2024</h3>
                            <button className="text-xs font-bold text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">October</button>
                        </div>
                        
                        {/* Calendar Grid Mockup */}
                        <div className="grid grid-cols-6 gap-2 text-center mb-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-[10px] text-gray-400 uppercase tracking-wider">{d}</div>
                            ))}
                            {[22, 23, 24, 25, 26, 27].map(d => (
                                <div key={d} className={`text-sm py-2 ${d === 24 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{d}</div>
                            ))}
                        </div>

                        {/* Events Line */}
                        <div className="relative h-20 border-t border-gray-100 pt-4">
                            {/* Time Labels */}
                            <div className="absolute left-0 top-4 space-y-4 text-[9px] text-gray-300">
                                <div>8:00 am</div>
                                <div>9:00 am</div>
                            </div>

                            {/* Event Card 1 */}
                            <div className="absolute left-[80px] top-3 bg-[#2d2d2d] text-white rounded-xl p-2 pl-3 pr-4 flex items-center gap-3 shadow-lg z-10 w-64">
                                <div>
                                    <div className="text-[10px] font-bold">Weekly Team Sync</div>
                                    <div className="text-[9px] text-gray-400">Discuss progress on projects</div>
                                </div>
                                <div className="flex -space-x-2 ml-auto">
                                    <div className="w-5 h-5 rounded-full bg-yellow-500 border border-[#2d2d2d]"></div>
                                    <div className="w-5 h-5 rounded-full bg-blue-500 border border-[#2d2d2d]"></div>
                                    <div className="w-5 h-5 rounded-full bg-pink-500 border border-[#2d2d2d]"></div>
                                </div>
                            </div>

                            {/* Event Card 2 */}
                            <div className="absolute right-4 top-12 bg-white border border-gray-100 rounded-xl p-2 pl-3 pr-4 flex items-center gap-3 shadow-sm z-0">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-800">Onboarding Session</div>
                                    <div className="text-[9px] text-gray-400">Introduction for new hires</div>
                                </div>
                                <div className="flex -space-x-2 ml-auto">
                                     <div className="w-5 h-5 rounded-full bg-gray-300 border border-white"></div>
                                     <div className="w-5 h-5 rounded-full bg-gray-400 border border-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Onboarding & Stats (Span 4) */}
                <div className="md:col-span-4 space-y-6">
                    {/* Onboarding Overview Card */}
                    <div className="bg-[#fefce8] rounded-[30px] p-6 shadow-sm border border-yellow-100">
                         <div className="flex justify-between items-center mb-2">
                             <h3 className="text-lg font-medium text-gray-800">Onboarding</h3>
                             <span className="text-3xl font-light text-gray-800">18%</span>
                         </div>
                         
                         {/* Pill Progress */}
                         <div className="flex gap-1 mb-4">
                            <div className="h-10 w-[35%] bg-[#fccb6f] rounded-l-xl flex items-center justify-center text-xs font-medium">Task</div>
                            <div className="h-10 w-[30%] bg-[#2d2d2d] rounded-r-xl"></div>
                            <div className="h-10 w-[15%] bg-gray-400 rounded-xl ml-1"></div>
                         </div>
                    </div>

                    {/* Dark Task List Card */}
                    <div className="bg-[#2d2d2d] rounded-[30px] p-8 text-white min-h-[400px]">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-light text-gray-300">Onboarding Task</span>
                            <span className="text-3xl font-light">2/8</span>
                        </div>

                        <div className="space-y-1">
                            <OnboardingTask 
                                icon={<FiMonitor size={18} />}
                                title="Interview" 
                                date="Sep 13, 08:30" 
                                checked={true}
                            />
                             <OnboardingTask 
                                icon={<div className="text-xs font-bold">⚡</div>}
                                title="Team Meeting" 
                                date="Sep 13, 10:30" 
                                checked={true}
                            />
                            <OnboardingTask 
                                icon={<FiArrowUpRight size={18} />}
                                title="Project Update" 
                                date="Sep 13, 13:00" 
                                checked={false}
                            />
                             <OnboardingTask 
                                icon={<div className="rotate-45"><FiCheckCircle size={18} /></div>}
                                title="Discuss Q3 Goals" 
                                date="Sep 13, 14:45" 
                                checked={false}
                            />
                             <OnboardingTask 
                                icon={<div className="text-xs font-bold">🔗</div>}
                                title="HR Policy Review" 
                                date="Sep 13, 16:30" 
                                checked={false}
                                isLast={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CompanyUserLayout>
    );
}