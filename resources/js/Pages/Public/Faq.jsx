import React, { useState } from 'react';
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";

// Named export: reusable FAQ section (accordion) for embedding in other pages
export function FaqSection() {
    const [openFaqIdx, setOpenFaqIdx] = useState(null);

    const faqs = [
        {
            question: "What are the benefits of using this app?",
            answer: (
                <>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><b>Convenience:</b> Manage your policy, access e-cards, file claims, and find hospitals – all from your phone.</li>
                        <li><b>Efficiency:</b> File claims on a single tap and track their status in real-time.</li>
                        <li><b>Security:</b> Enjoy a secure platform to access your health information and manage sensitive data.</li>
                        <li><b>Wellness Support:</b> Explore a variety of wellness programs and resources to enhance your well-being.</li>
                        <li><b>Time-Saving:</b> Skip paperwork and long wait times – manage everything on-the-go.</li>
                    </ul>
                </>
            )
        },
        {
            question: "How much does it cost to use this app?",
            answer: `The basic features of the app are free to use if you are enrolled as an employee of our corporate client. There might be optional in-app purchases for certain premium services like advanced wellness programs or telemedicine consultations with specific specialists. We'll clearly inform you of any associated costs before you proceed.`
        },
        {
            question: "Where can I find help and support for the app?",
            answer: "We're here to help! If you have any questions or encounter issues using the app, you can drop us an email on support@zoomconnect.co.in"
        },
        {
            question: "How do I file a claim?",
            answer: `Filing a claim is quick and convenient. Go to the 'Claims' section of the app and choose 'File a New Claim.' Follow the on-screen prompts, providing necessary details and uploading any required documents. You can track the status of the filed claims under the 'Claims' sections.`
        },
        {
            question: "How does claim intimation work?",
            answer: `If you are aware of the fact that you or your family members require hospitalization in the near future, you can submit the claim intimation request using the 'Claim Intimation' menu. Not only does this ease the admission and pre-authorization process, but it also helps reduce your overall cost of treatment wherever possible. Once the TPA receives the intimation, they will help you plan everything including choosing a network hospital, opting for discounted packages, if available, and planning for cashless hospitalization.`
        },
        {
            question: "How can I view my policy details and coverage information within the app?",
            answer: "This app is a one-stop solution for all your insurance and wellness needs. It empowers you to manage your health insurance policy, access healthcare services, and improve your overall well-being."
        },
        {
            question: "What is this app for?",
            answer: "This app is a one-stop solution for all your insurance and wellness needs. It empowers you to manage your health insurance policy, access healthcare services, and improve your overall well-being."
        },
        {
            question: "Is this app secure?",
            answer: "Yes, security is our top priority. We implement industry-standard security measures to protect your personal and health information. Your data is encrypted and only authorized personnel can access it."
        }
    ];

    return (
        <section id="faq" className="w-full flex flex-col items-center justify-center">
            <div className="w-[95%] max-w-5xl flex flex-col md:flex-row gap-4 px-4 md:px-8 items-center rounded-3xl bg-gradient-to-r from-[#b740b2] via-[#FF0066]/50 to-[#ffc03aa8] shadow-lg min-w-[280px] relative top-full md:-translate-y-1/2" >
                <div className="flex-1 flex items-center py-6">
                    <div>
                        <h3 className="text-white text-sm md:text-xl font-semibold mb-1">We take</h3>
                        <div className="text-white text-2xl md:text-5xl font-bold leading-tight mb-1">customer<br className="hidden md:block" />satisfaction</div>
                        <div className="text-white text-sm md:text-xl font-medium">Very seriously</div>
                    </div>
                </div>
                <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-6 py-3 min-w-[140px] md:min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                        <div className="text-[#3B0270] text-lg md:text-4xl font-bold mb-1">1100+</div>
                        <div className="text-[#441752] text-xs md:text-base font-semibold mb-1 text-center leading-snug">Trusted Clients and Growing</div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-6 py-3 min-w-[140px] md:min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                        <div className="text-[#3B0270] text-lg md:text-4xl font-bold mb-1">90,000+</div>
                        <div className="text-[#441752] text-xs md:text-base font-semibold mb-1 text-center leading-snug">Claims Settled Seamlessly</div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center px-6 py-3 min-w-[140px] md:min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
                        <div className="text-[#3B0270] text-lg md:text-4xl font-bold mb-1">500,000+</div>
                        <div className="text-[#441752] text-xs md:text-base font-semibold mb-1 text-center leading-snug">Lives Protected with Trust</div>
                    </div>
                </div>
            </div>
            <div className="w-[90%] pt-8 pb-16 max-w-6xl mx-auto flex flex-col md:flex-row items-start">
                <div className="w-full md:w-1/3 flex flex-col items-center md:items-start justify-center pr-0 md:pr-8">
                    <h2 className="font-dmserif text-3xl md:text-5xl font-medium text-start mb-10 max-w-2xl text-gray-800  top-32">Got questions?<br className="hidden md:block" />We've got answers</h2>

                    <img src="/assets/images/FAQ.png" alt="FAQ Illustration" className="w-48 h-48 md:w-72 md:h-72 object-contain mb-6" />
                </div>
                <div className="w-full md:w-2/3 max-w-2xl mx-auto rounded-2xl bg-white p-0 flex flex-col overflow-hidden shadow-md" style={{ boxShadow: '0 2px 25px 0 rgba(0,0,0,0.15), 0 0.5px 6px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)' }} >
                    {faqs.map((faq, i) => {
                        const isOpen = openFaqIdx === i;
                        return (
                            <div key={i} className={
                                `border-b last:border-b-0 border-gray-200 bg-white ` +
                                (isOpen ? 'rounded-t-xl ' : '')
                            }>
                                <button
                                    className={`w-full flex items-center justify-between py-4 px-6 text-left cursor-pointer transition  focus:outline-none ${isOpen ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}
                                    onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-panel-${i}`}
                                >
                                    <span className="text-sm md:text-base ">{faq.question}</span>
                                    <span className={`ml-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900' : ''}`}>
                                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="11" stroke="#E5E7EB" strokeWidth="1" fill="#fff" />
                                            <path d="M8 10l4 4 4-4" stroke={isOpen ? '#111827' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={`faq-panel-${i}`}
                                    className={`overflow-hidden transition-all duration-400 ease-in-out px-6 bg-gray-100 border-l-4 border-[#b6c7d6]  ${isOpen && faq.answer ? 'max-h-[500px] opacity-100 py-6 mt-[-8px]' : 'max-h-0 opacity-0 py-0 mt-0'}`}
                                    style={{
                                        transitionProperty: 'max-height, opacity, padding, margin-top',
                                    }}
                                >
                                    {isOpen && faq.answer && (
                                        <div className="block whitespace-pre-line text-xs md:text-sm text-gray-500 font-medium">{faq.answer}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default function Faq() {
    return (
        <>
            <Header />
            <FaqSection />
            <Footer />
        </>
    );
}
