import React, { useState } from 'react';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';

const BookDemo = () => {
    const [form, setForm] = useState({
        email: '',
        companyName: '',
        firstName: '',
        lastName: '',
        employeeCount: '',
        phone: '',
        country: '',
        state: '',
        zip: '',
        additionalInfo: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', form);
    };

    return (
        <>
            <Header />
            {/* Beautiful Request a Demo Section */}
            <div className="min-h-screen bg-gradient-to-br from-[#f2d7b3] via-[#feebff8c] to-[#fff4e6] relative overflow-hidden py-12 md:py-20">
                {/* Left Wave Illustration */}
                <div className="absolute left-0 top-0 w-1/3 h-full opacity-60 pointer-events-none hidden md:block">
                    <svg viewBox="0 0 300 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor: '#FF0066', stopOpacity: 0.15}} />
                                <stop offset="50%" style={{stopColor: '#934790', stopOpacity: 0.1}} />
                                <stop offset="100%" style={{stopColor: '#FF0066', stopOpacity: 0.08}} />
                            </linearGradient>
                        </defs>
                        <path d="M0,200 Q50,150 100,200 T200,200 T300,200 L300,800 L0,800 Z" fill="url(#leftGrad)" opacity="0.6"/>
                        <path d="M0,300 Q50,250 100,300 T200,300 T300,300 L300,800 L0,800 Z" fill="#934790" opacity="0.1"/>
                        <path d="M0,400 Q75,350 150,400 T300,400 L300,800 L0,800 Z" fill="#FF0066" opacity="0.06"/>
                    </svg>
                </div>

                {/* Right Wave Illustration */}
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-60 pointer-events-none hidden md:block">
                    <svg viewBox="0 0 300 800" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="rightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor: '#934790', stopOpacity: 0.15}} />
                                <stop offset="50%" style={{stopColor: '#FF0066', stopOpacity: 0.1}} />
                                <stop offset="100%" style={{stopColor: '#70306eff', stopOpacity: 0.08}} />
                            </linearGradient>
                        </defs>
                        <path d="M300,200 Q250,150 200,200 T100,200 T0,200 L0,800 L300,800 Z" fill="url(#rightGrad)" opacity="0.6"/>
                        <path d="M300,300 Q250,250 200,300 T100,300 T0,300 L0,800 L300,800 Z" fill="#FF0066" opacity="0.08"/>
                        <path d="M300,400 Q225,350 150,400 T0,400 L0,800 L300,800 Z" fill="#7c347aff" opacity="0.06"/>
                    </svg>
                </div>

                {/* Centered Illustration between waves */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex justify-center items-center pointer-events-none">
                    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="90" cy="120" rx="80" ry="16" fill="#e9d6f7" />
                        <rect x="50" y="40" width="80" height="55" rx="14" fill="#934790" />
                        <rect x="65" y="60" width="50" height="22" rx="7" fill="#fff" />
                        <circle cx="70" cy="70" r="4" fill="#FF0066" />
                        <circle cx="82" cy="70" r="4" fill="#FF0066" />
                        <rect x="105" y="67" width="20" height="7" rx="2" fill="#e9d6f7" />
                        <rect x="105" y="80" width="15" height="5" rx="2" fill="#e9d6f7" />
                    </svg>
                </div>
                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-6 relative z-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-dmserif font-bold text-gray-800 mb-4">Book a Demo</h2>
                        <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
                            Just answer a few simple questions so we can personalize the right experience for you.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto border border-white/50">
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* First Row - Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">First name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter your first name"
                                        className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter your last name"
                                        className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Second Row - Email & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your business email"
                                        className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Third Row - Company */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job title</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    placeholder="Enter your job title"
                                    className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700"
                                />
                            </div>

                            {/* Fourth Row - Message */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">How can we help your business?</label>
                                <textarea
                                    name="additionalInfo"
                                    value={form.additionalInfo}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-1.5 border border-[#934790] rounded-lg bg-[#e9d6f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-[#FF0066] transition placeholder:text-gray-700 resize-none"
                                    placeholder="Let us know your requirements, questions, or anything else..."
                                />
                            </div>

                            {/* CTA Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#FF0066]/80 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-base mt-8"
                            >
                                Submit
                            </button>
                        </form>

                    
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default BookDemo;

