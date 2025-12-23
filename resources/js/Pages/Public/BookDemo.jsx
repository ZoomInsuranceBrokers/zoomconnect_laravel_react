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

    // Animation state for steps (looping)
    const [activeStep, setActiveStep] = useState(1);
    React.useEffect(() => {
        let step = 1;
        let interval = setInterval(() => {
            step = step === 3 ? 1 : step + 1;
            setActiveStep(step);
        }, 900);
        return () => clearInterval(interval);
    }, []);

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
                {/* Combined Wave Illustrations */}
                <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-none hidden md:block z-0">
                    {/* Unified Wave - spans full width */}
                    <svg viewBox="0 0 1200 800" className="absolute left-0 top-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="mainWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF0066" stopOpacity="0.15" />
                                <stop offset="50%" stopColor="#934790" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#FF0066" stopOpacity="0.08" />
                            </linearGradient>
                        </defs>
                        <path d="M0,200 Q200,100 400,200 T800,200 T1200,200 L1200,800 L0,800 Z" fill="url(#mainWaveGrad)" opacity="0.6" />
                        <path d="M0,300 Q200,200 400,300 T800,300 T1200,300 L1200,800 L0,800 Z" fill="#934790" opacity="0.1" />
                        <path d="M0,400 Q300,350 600,400 T1200,400 L1200,800 L0,800 Z" fill="#FF0066" opacity="0.06" />
                    </svg>
                </div>

                {/* Main Content */}
                <div className="w-full mx-auto px-6 relative z-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-dmserif font-bold text-gray-800 mb-4">Book a Demo</h2>
                        <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
                            Just answer a few simple questions so we can personalize the right experience for you.
                        </p>
                    </div>

                    {/* Form Container */}
                    <div className="flex md:flex-row space-y-16">
                        <div className="w-full md:w-1/2 max-w-4xl px-6">
                            {/* <h2 className="text-4xl md:text-base font-bold text-[#1a237e] text-center mb-10">Book A Free Demo in 3 Simple Steps</h2> */}
                            <div className="relative flex flex-col items-center justify-center gap-16">
                                {/* Step 1 - Left */}
                                <div className="flex w-full items-center z-10 min-h-[120px]">
                                    <div className="w-1/2 flex justify-end">
                                        <div className={`rounded-full p-4 flex items-center justify-center border-4 border-white shadow-2xl z-20 transition-all duration-500 ${activeStep === 1 ? 'bg-gradient-to-tr from-[#1976d2] to-[#42a5f5] scale-125 ring-4 ring-[#90caf9]/60' : 'bg-[#e3f2fd] opacity-70'} `}>
                                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                                                <rect width="24" height="24" rx="12" fill="#1976d2" />
                                                <path d="M7 7h10v10H7V7zm2 2v6h6V9H9z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Diagonal line to right - now between circles */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <svg width="100%" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6">
                                            <path d="M0 12 Q60 0 120 12" stroke="#bbdefb" strokeWidth="4" fill="none" />
                                        </svg>
                                    </div>
                                    <div className="w-1/2 flex flex-col items-start text-left pl-8">
                                        <div className={`text-lg transition-all duration-500 ${activeStep === 1 ? 'font-extrabold text-[#1976d2]' : 'font-bold text-gray-400'}`}>Step 1</div>
                                        <div className={`transition-all duration-500 text-base ${activeStep === 1 ? 'text-[#1976d2] font-semibold' : 'text-gray-500'}`}>Fill up the form with your details.</div>
                                    </div>
                                </div>
                                {/* Step 2 - Right */}
                                <div className="flex w-full items-center flex-row-reverse z-10 min-h-[120px]">
                                    <div className="w-1/2 flex justify-start">
                                        <div className={`rounded-full p-4 flex items-center justify-center border-4 border-white shadow-2xl z-20 transition-all duration-500 ${activeStep === 2 ? 'bg-gradient-to-tr from-[#1976d2] to-[#42a5f5] scale-125 ring-4 ring-[#90caf9]/60' : 'bg-[#e3f2fd] opacity-70'} `}>
                                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                                                <rect width="24" height="24" rx="12" fill="#1976d2" />
                                                <path d="M17 10.5V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15 12l2 2 2-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* Diagonal line to left - now between circles */}
                                    <div className="flex-1 flex items-center justify-center">
                                        <svg width="100%" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-6">
                                            <path d="M120 12 Q60 24 0 12" stroke="#bbdefb" strokeWidth="4" fill="none" />
                                        </svg>
                                    </div>
                                    <div className="w-1/2 flex flex-col items-end text-right pr-8">
                                        <div className={`text-lg transition-all duration-500 ${activeStep === 2 ? 'font-extrabold text-[#1976d2]' : 'font-bold text-gray-400'}`}>Step 2</div>
                                        <div className={`transition-all duration-500 text-base ${activeStep === 2 ? 'text-[#1976d2] font-semibold' : 'text-gray-500'}`}>Our expert will connect with you over call</div>
                                    </div>
                                </div>
                                {/* Step 3 - Left */}
                                <div className="flex w-full items-center relative z-10 min-h-[120px]">
                                    <div className="w-1/2 flex justify-end">
                                        <div className={`rounded-full p-4 flex items-center justify-center border-4 border-white shadow-2xl z-20 transition-all duration-500 ${activeStep === 3 ? 'bg-gradient-to-tr from-[#1976d2] to-[#42a5f5] scale-125 ring-4 ring-[#90caf9]/60' : 'bg-[#e3f2fd] opacity-70'} `}>
                                            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                                                <rect width="24" height="24" rx="12" fill="#1976d2" />
                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* No line after last step */}
                                    <div className="w-1/2 flex flex-col items-start text-left pl-8">
                                        <div className={`text-lg transition-all duration-500 ${activeStep === 3 ? 'font-extrabold text-[#1976d2]' : 'font-bold text-gray-400'}`}>Step 3</div>
                                        <div className={`transition-all duration-500 text-base ${activeStep === 3 ? 'text-[#1976d2] font-semibold' : 'text-gray-500'}`}>Demo the product in the comfort of your home!</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[80%] md:w-1/2 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto border border-white/50">

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
            </div>
            {/* New Section: Book a Free Home Demo in 3 Simple Steps */}
            <section className="w-full bg-[#f5f8ff] py-16">

            </section>

            <Footer />
        </>
    );
};

export default BookDemo;

