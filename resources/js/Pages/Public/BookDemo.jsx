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
            <div className="min-h-screen bg-[#ffceea78] text-gray-900 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className=" overflow-hidden grid grid-cols-1 md:grid-cols-5 items-center relative min-h-[80vh]">
                        {/* Left: Intro / copy - themed */}
                        <div className="p-8 md:p-12 relative overflow-hidden z-0 flex flex-col justify-center md:col-span-3">
                            {/* Decorative SVG blob behind hero (non-interactive) */}
                            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
                                <svg
                                    className="w-[140%] md:w-[120%] max-w-none opacity-60 md:opacity-80 -translate-x-6 md:-translate-x-0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1305 885"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <g className="blob-big-green-2">
                                        <path
                                            fill="#934790"
                                            d="M1194.91 807.728c-59.58 43.615-154.57 74.447-251.604 70.433-110.208-4.561-200.22-50.779-306.606-67.321-80.387-12.502-165.735-7.46-249.244-8.498-83.509-1.038-173.013-10.041-231.118-43.637-75.744-43.792-73.345-113.804-52.689-174.13 20.656-60.326 33.272-89.498 12.32-131.722-17.03-34.318-54.2-64.134-79.667-96.724C-15.64 289.674-3.416 160.931 47.212 93.75 79.462 50.957 142.63 9.596 224.868 7.421c93.534-2.472 165.88 45.138 255.614 59.815 124.891 20.43 230.038-12.669 360.327-13.684 142.17-1.11 271.461 53.674 341.191 123.21 69.73 69.537 102.74 231.726 102.74 231.726s74.84 286.016-89.83 399.24Z"
                                        />
                                    </g>
                                </svg>
                            </div>

                            <div className="relative z-10">                               
                                 <div className="relative z-10 w-full md:w-[80%]">
                                    <h1 className="text-3xl md:text-5xl font-dmserif font-semibold text-gray-800 leading-tight mb-4">Request a personalized demo of ZoomConnect</h1>
                                    <p className="text-gray-700 mb-4">Seeing is believing — schedule a live walk-through with our product specialists. We'll learn about your goals and show how ZoomConnect helps you engage audiences, measure impact, and grow.</p>
                                    <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-md text-[#FF0066]">✓</span>
                                        <span>A short conversation to align goals</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-md text-[#934790]">✓</span>
                                        <span>Live demo tailored to your use case</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-md text-[#0066ff]">✓</span>
                                        <span>No obligation — just useful insights</span>
                                    </li>
                                </ul>
                                   
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="p-6 md:p-10 md:col-span-2 flex items-center rounded-lg shadow-xl ">
                            <div className="w-full max-w-md mx-auto">
                                {/* <h2 className="text-2xl font-semibold text-gray-800 mb-4">Request a demo</h2> */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            placeholder="First Name"
                                            className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            placeholder="Last Name"
                                            className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                        />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Business Email"
                                        className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                    />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={form.companyName}
                                            onChange={handleChange}
                                            placeholder="Company Name"
                                            className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                        />
                                        <input
                                            type="text"
                                            name="employeeCount"
                                            value={form.employeeCount}
                                            onChange={handleChange}
                                            placeholder="Company Size"
                                            className="w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-[#FF0066]"
                                        />
                                    </div>
                                    <select
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-md p-2 bg-white"
                                    >
                                        <option value="">Select Country</option>
                                        <option value="USA">USA</option>
                                        <option value="Canada">Canada</option>
                                        <option value="UK">UK</option>
                                    </select>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="marketingAgency" value="Yes" onChange={handleChange} className="form-radio text-[#FF0066]" />
                                            Yes
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="radio" name="marketingAgency" value="No" onChange={handleChange} className="form-radio text-[#FF0066]" />
                                            No
                                        </label>
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        placeholder="Notes"
                                        className="w-full border border-gray-200 rounded-md p-2 h-28"
                                    ></textarea>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#FF0066] text-white rounded-xl p-3 hover:bg-[#001f44] transition"
                                    >
                                        Proceed to Book a Demo
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BookDemo;
