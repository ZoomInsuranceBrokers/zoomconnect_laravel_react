import React from 'react';
import Header from '../Layouts/Header';
import Footer from '../Layouts/Footer';
import { Link } from '@inertiajs/react';
import ScrollProgressBar from '../../../Components/ScrollProgressBar';

export default function Surveys() {

    return (
        <>
            <Header />
            <style>{`html,body{overflow-x:hidden !important;}
@keyframes spin-slow { 100% { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 2s linear infinite; }
@keyframes pulse-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.7); }
}
.animate-pulse-scale { animation: pulse-scale 1.2s cubic-bezier(0.4,0,0.6,1) infinite; }
@keyframes flip-front-back {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}
.animate-flip-front-back { animation: flip-front-back 1.2s cubic-bezier(0.4,0,0.6,1) infinite; transform-style: preserve-3d; }
`}</style>

            <div className="min-h-screen flex flex-col items-center justify-center font-montserrat relative overflow-x-hidden bg-[#ffceea78] text-gray-900">

                <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0  opacity-70">
                        <img
                            src="/assets/images/wavy design-01.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="max-w-7xl mx-auto px-6 py-20 z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[500px]">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-4xl md:text-5xl font-dmserif font-semibold leading-tight text-gray-800 mb-4">
                                    Customisable <span className="text-[#FF0066]/80">Surveys</span>
                                </h1>
                                <p className="text-sm md:text-base text-gray-800 mb-6">
                                    Gather insights and feedback from your team with flexible, configurable surveys that help you understand wellbeing, satisfaction and engagement.
                                </p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF0066]/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-[#FF0066]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        <p className="text-sm text-gray-700">Drag-and-drop builder with 4+ question types</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF0066]/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-[#FF0066]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        <p className="text-sm text-gray-700">Anonymity, conditional logic & smart targeting</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF0066]/10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-4 h-4 text-[#FF0066]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        <p className="text-sm text-gray-700">Real-time analytics & exportable reports</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href="/book-demo"
                                        className="bg-[#FF0066]/80 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md hover:bg-[#df0059cc] hover:shadow-lg transition"
                                    >
                                        Schedule a Call
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="border-2 border-[#934790] bg-transparent text-[#934790] px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#934790] hover:text-white transition"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>

                            <div className="flex justify-center items-center h-full">
                                <div className="w-full max-w-xl relative h-[32rem] md:h-[36rem]">
                                    {/* Soft background gradient blobs - larger */}
                                    <div className="absolute -top-32 left-1/5 w-[28rem] h-[28rem] bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-3xl"></div>
                                    <div className="absolute -bottom-32 right-1/5 w-[28rem] h-[28rem] bg-gradient-to-tl from-[#FF0066]/20 to-transparent rounded-full blur-3xl"></div>
                                    {/* Hero Image - larger */}
                                    <img
                                        src="/assets/images/products/interactive_survey_scene.png"
                                        alt="Surveys Illustration"
                                        className="w-full h-full object-contain drop-shadow-2xl scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-24 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF0066]/5 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#934790]/5 to-transparent rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-md md:text-4xl font-dmserif font-bold text-gray-900 mb-5">Survey Process Overview</h2>
                            <p className="text-gray-700 max-w-3xl mx-auto text-base leading-relaxed">Create, distribute, and analyze surveys in three beautifully simple steps</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Decorative connecting line */}
                            <div className="hidden md:block absolute top-16 left-20 right-20 h-1.5 bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-200 rounded-full z-0"></div>

                            {/* Step 1: Build - Pastel Pink */}
                            <div className="relative group">
                                {/* Glow effect on hover */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-pink-200/40 via-pink-100/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                <div className="relative bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl shadow-xl border-2 border-pink-100 hover:border-pink-200 hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Large step number on left */}
                                    <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10">
                                        <span className="text-2xl font-black text-white">1</span>
                                    </div>

                                    {/* Header with title on left and icon on right */}
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Build</h3>

                                        {/* Icon container with number badge */}
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>

                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">Design custom surveys with our intuitive drag-and-drop builder, featuring multiple question types and smart templates.</p>

                                    {/* Features list */}
                                    <div className="space-y-2 pt-3 border-t border-pink-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Multiple formats</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Pre-built templates</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Smart branching</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Assign - Pastel Blue */}
                            <div className="relative group">
                                {/* Glow effect on hover */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-blue-200/40 via-blue-100/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                <div className="relative bg-gradient-to-br from-blue-50 to-white p-6 rounded-3xl shadow-xl border-2 border-blue-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Large step number on left */}
                                    <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10">
                                        <span className="text-2xl font-black text-white">2</span>
                                    </div>

                                    {/* Header with title on left and icon on right */}
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Assign</h3>

                                        {/* Icon container with number badge */}
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>

                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">Deploy surveys to targeted audiences with precision targeting and custom segments based on employee data.</p>

                                    {/* Features list */}
                                    <div className="space-y-2 pt-3 border-t border-blue-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Team targeting</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Custom segments</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Scheduled deploy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Report - Pastel Yellow */}
                            <div className="relative group">
                                {/* Glow effect on hover */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-yellow-200/40 via-yellow-100/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                <div className="relative bg-gradient-to-br from-yellow-50 to-white p-6 rounded-3xl shadow-xl border-2 border-yellow-100 hover:border-yellow-200 hover:shadow-2xl transition-all duration-300 h-full">
                                    {/* Large step number on left */}
                                    <div className="absolute -top-5 -left-5 w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 z-10">
                                        <span className="text-2xl font-black text-white">3</span>
                                    </div>

                                    {/* Header with title on left and icon on right */}
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Report</h3>

                                        {/* Icon container with number badge */}
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 012 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>

                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-600 mb-4 leading-relaxed text-sm">Gain instant insights with real-time dashboards and comprehensive analytics for deeper analysis and action planning.</p>

                                    {/* Features list */}
                                    <div className="space-y-2 pt-3 border-t border-yellow-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Real-time analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Export formats</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">Detailed insights</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Question types section */}
                <section className="w-full py-16 bg-gradient-to-r from-[#441752] via-[#571754] to-[#934790]">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-dmserif font-bold text-white mb-3">Explore Our Versatile Question Types</h2>
                            <p className="text-white max-w-2xl mx-auto text-xs md:text-base">Select from a variety of question formats to capture meaningful feedback and actionable insights.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Text (Open-ended) - Top Left */}
                            <div className="flex md:justify-end">
                                <div className="relative bg-white rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-none rounded-bl-none shadow-2xl p-8 pr-16 flex flex-col items-center md:items-start text-center md:text-left min-h-[260px] overflow-hidden group max-w-[340px] w-full transition-all duration-300 border border-transparent hover:shadow-3xl hover:scale-[1.04] hover:border-[#934790]/40 hover:bg-[#f8f0fa]">
                                    {/* Quarter circle accent */}
                                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#934790] rounded-br-[2rem] rounded-tl-[4rem] rounded-bl-none rounded-tr-none z-0"></div>
                                    <div className="relative z-10 flex flex-col gap-2 items-center md:items-start w-full">
                                        <div className="w-14 h-14 flex items-center justify-center mb-2 md:mb-0 mx-auto md:mx-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#934790] animate-flip-front-back" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <h4 className="font-bold text-xl md:text-2xl text-gray-900 mb-0">Text</h4>
                                        <p className="text-xs md:text-sm text-gray-500 font-semibold mb-1">Open-ended</p>
                                        <p className="text-sm md:text-sm text-gray-600 leading-tight md:leading-tight">Collect detailed feedback, comments, and qualitative insights from respondents with unlimited flexibility.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Single-select - Top Right */}
                            <div className="flex md:justify-start">
                                <div className="relative bg-white rounded-tr-[3rem] rounded-bl-[3rem] shadow-2xl p-8 pl-16 flex flex-col items-center md:items-end text-center md:text-right min-h-[260px] overflow-hidden group max-w-[340px] w-full transition-all duration-300 border border-transparent hover:shadow-3xl hover:scale-[1.04] hover:border-pink-400/50 hover:bg-[#ffdced]">
                                    {/* Quarter circle accent - darker pink */}
                                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-500 rounded-bl-[2rem] rounded-tr-[4rem] rounded-br-none  z-0"></div>
                                    <div className="relative z-10 flex flex-col gap-2 items-center md:items-end w-full">
                                        <div className="w-14 h-14 flex items-center justify-center mb-2 md:mb-0 mx-auto md:mx-0 md:mr-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#ec4899] animate-pulse-scale" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth="2" /></svg>
                                        </div>
                                        <h4 className="font-bold text-xl md:text-2xl text-gray-900 mb-0">Single-select</h4>
                                        <p className="text-xs md:text-sm text-gray-500 font-semibold mb-1">Radio buttons</p>
                                        <p className="text-sm md:text-sm text-gray-600 leading-tight md:leading-tight">Allow respondents to choose one answer from multiple options using radio buttons.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Multi-select - Bottom Left */}
                            <div className="flex md:justify-end">
                                <div className="relative bg-white rounded-tr-[3rem] rounded-bl-[3rem]  shadow-2xl p-8 flex flex-col items-center md:items-start text-center md:text-left min-h-[260px] overflow-hidden group max-w-[340px] w-full transition-all duration-300 border border-transparent hover:shadow-3xl hover:scale-[1.04] hover:border-[#0ea5a4]/40 hover:bg-[#e6faf9]">
                                    {/* Quarter circle accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#0ea5a4] rounded-tr-[2rem] rounded-bl-[4rem] rounded-br-none  z-0"></div>
                                    <div className="relative z-10 flex flex-col gap-2 items-center md:items-start w-full">
                                        <div className="w-14 h-14 flex items-center justify-center mb-2 md:mb-0 mx-auto md:mx-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#0ea5a4] animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="7" height="7" strokeWidth="2" /><rect x="13" y="4" width="7" height="7" strokeWidth="2" /><rect x="4" y="13" width="7" height="7" strokeWidth="2" /></svg>
                                        </div>
                                        <h4 className="font-bold text-xl md:text-2xl text-gray-900 mb-0">Multi-select</h4>
                                        <p className="text-xs md:text-sm text-gray-500 font-semibold mb-1">Checkboxes</p>
                                        <p className="text-sm md:text-sm text-gray-600 leading-tight md:leading-tight">Enable respondents to select multiple answers using checkboxes for comprehensive feedback.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Scale - Bottom Right */}
                            <div className="flex md:justify-start">
                                <div className="relative bg-white rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-none rounded-bl-none shadow-2xl p-8 flex flex-col items-center md:items-end text-center md:text-right min-h-[260px] overflow-hidden group max-w-[340px] w-full transition-all duration-300 border border-transparent hover:shadow-3xl hover:scale-[1.04] hover:border-[#FFD966]/40 hover:bg-[#fffbe6]">
                                    {/* Quarter circle accent */}
                                    <div className="absolute top-0 left-0 w-20 h-20 bg-[#FFD966] rounded-tl-none rounded-br-[4rem]  rounded-bl-none z-0"></div>
                                    <div className="relative z-10 flex flex-col gap-2 items-center md:items-end w-full">
                                        <div className="w-14 h-14 flex items-center justify-center mb-2 md:mb-0 mx-auto md:mx-0 md:mr-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#FFD966] animate-spin-slow" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                        </div>
                                        <h4 className="font-bold text-xl md:text-2xl text-gray-900 mb-0">Rating Scale</h4>
                                        <p className="text-xs md:text-sm text-gray-500 font-semibold mb-1">Stars & numbers</p>
                                        <p className="text-sm md:text-sm text-gray-600 leading-tight md:leading-tight">Collect satisfaction ratings with intuitive star or numeric scales for easy evaluation.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Surveys section */}
                <section className="w-full py-16 bg-transparent">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-dmserif font-bold text-gray-800 mb-2">Core Surveys</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Explore our comprehensive survey solutions designed for organizational insights.</p>
                        </div>
                        <div className="bg-gradient-to-br from-white to-[#f8f9ff] rounded-3xl p-8 shadow-lg border border-[#934790]/10">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Employee Satisfaction Survey */}
                                <div className="group p-6 rounded-xl border-2 border-[#FF0066]/20 hover:border-[#FF0066] bg-gradient-to-br from-[#fff5f8] to-white hover:shadow-lg transition duration-300 cursor-pointer">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg group-hover:text-[#FF0066] transition">Employee Satisfaction Survey</h4>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Survey Details</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-2xl font-bold text-[#FF0066]">21</div>
                                            <p className="text-xs text-gray-500">Questions</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 border-t border-gray-200 pt-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Survey Name</p>
                                            <p className="text-sm text-gray-800 font-medium">Employee Satisfaction Survey</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Description</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">Employee Experience Survey a comprehensive survey designed to gauge the overall health and synergy of our organization's work environment. By capturing feedback from employees across various departments and levels, this survey aims to assess factors such as communication effectiveness, leadership quality, teamwork dynamics, and employee satisfaction. Through insightful analysis of the survey results, we seek to foster a culture of collaboration, respect, and fulfillment, ultimately enhancing organizational performance and employee well-being.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Questions</p>
                                            <p className="text-sm text-gray-800 font-medium">21</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Equity Pulse Survey */}
                                <div className="group p-6 rounded-xl border-2 border-[#934790]/20 hover:border-[#934790] bg-gradient-to-br from-[#fbf8ff] to-white hover:shadow-lg transition duration-300 cursor-pointer">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg group-hover:text-[#934790] transition">Equity Pulse Survey</h4>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Survey Details</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-2xl font-bold text-[#934790]">29</div>
                                            <p className="text-xs text-gray-500">Questions</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 border-t border-gray-200 pt-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Survey Name</p>
                                            <p className="text-sm text-gray-800 font-medium">Equity Pulse Survey</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Description</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">The Equity Pulse Survey is a strategic initiative designed to gauge the inclusivity and fairness of our organization's practices, policies, and culture. This survey delves deep into various aspects of equity, diversity, and inclusion (EDI), aiming to capture valuable insights from employees across all levels and backgrounds. Through thoughtful analysis of survey responses, we aspire to identify areas of strength and opportunities for improvement, fostering a workplace environment where every individual feels valued, respected, and empowered to thrive. The Equity Pulse Survey serves as a crucial tool in our ongoing commitment to promoting equity, advancing diversity, and fostering an inclusive culture of belonging within our organization.</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Questions</p>
                                            <p className="text-sm text-gray-800 font-medium">29</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
