import React, { useState } from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { useTheme } from '../../Context/ThemeContext';
import { FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaBuilding, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import '../../../css/book-demo-responsive.css';

export default function BookDemo() {
    const { darkMode } = useTheme();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        employeeCount: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call - Replace with actual API endpoint
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            
            // Reset form after showing success
            setTimeout(() => {
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    companyName: '',
                    employeeCount: '',
                    message: ''
                });
            }, 3000);
        }, 2000);
    };

    return (
        <div className={`book-demo-page min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect Logo" className="h-8 w-auto" />
                    </Link>
                    <Link 
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-[#934790] transition-colors duration-300"
                    >
                        <FaArrowLeft />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left Side - Content */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="lg:sticky lg:top-24 book-demo-left"
                        >
                            <div className="bg-gradient-to-br from-[#934790] via-[#7a3677] to-[#5d2759] text-white rounded-3xl p-12 relative overflow-hidden shadow-2xl">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                
                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h1 className="mb-4 text-4xl font-bold leading-tight">
                                            Schedule Your
                                            <span className="block text-[#FFD700] mt-2">Personalized Demo</span>
                                        </h1>
                                        <p className="mb-12 text-xl text-white/90">
                                            Discover how ZoomConnect can transform your employee benefits management
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-start gap-5">
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <FaCheckCircle className="w-7 h-7 text-[#FFD700]" />
                                            </div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold">Simplified Management</h3>
                                                <p className="text-base text-white/80 leading-relaxed">
                                                    Manage all employee benefits from a single, intuitive platform. Streamline your HR operations effortlessly.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <FaCheckCircle className="w-7 h-7 text-[#FFD700]" />
                                            </div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold">Enhanced Employee Experience</h3>
                                                <p className="text-base text-white/80 leading-relaxed">
                                                    Easy access to claims, policies, e-cards, and wellness programs for your entire workforce.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <FaCheckCircle className="w-7 h-7 text-[#FFD700]" />
                                            </div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold">Real-time Analytics</h3>
                                                <p className="text-base text-white/80 leading-relaxed">
                                                    Track utilization, monitor claims, and make data-driven decisions with comprehensive dashboards.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <FaCheckCircle className="w-7 h-7 text-[#FFD700]" />
                                            </div>
                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold">Seamless Integration</h3>
                                                <p className="text-base text-white/80 leading-relaxed">
                                                    Connect with your existing HRMS and systems effortlessly. No disruption to your workflow.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-12 pt-8 border-t border-white/20"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div>
                                                <div className="text-4xl font-bold text-[#FFD700]">500+</div>
                                                <p className="text-sm text-white/70 mt-1">Companies Trust Us</p>
                                            </div>
                                            <div>
                                                <div className="text-4xl font-bold text-[#FFD700]">50K+</div>
                                                <p className="text-sm text-white/70 mt-1">Active Employees</p>
                                            </div>
                                            <div>
                                                <div className="text-4xl font-bold text-[#FFD700]">98%</div>
                                                <p className="text-sm text-white/70 mt-1">Satisfaction Rate</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Form */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-3xl shadow-2xl p-12 book-demo-right"
                        >
                            {!isSuccess ? (
                                <div>
                                    <h2 className="mb-3 text-3xl font-bold text-gray-800">Get Started Today</h2>
                                    <p className="mb-8 text-gray-600 text-lg">Fill in your details and we'll get back to you shortly</p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Full Name */}
                                        <div>
                                            <label htmlFor="fullName" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Full Name *
                                            </label>
                                            <div className="relative">
                                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 text-base"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 text-base"
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Phone Number *
                                            </label>
                                            <div className="relative">
                                                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 text-base"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        {/* Company Name */}
                                        <div>
                                            <label htmlFor="companyName" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Company Name *
                                            </label>
                                            <div className="relative">
                                                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 text-base"
                                                    placeholder="Your Company Ltd."
                                                />
                                            </div>
                                        </div>

                                        {/* Employee Count */}
                                        <div>
                                            <label htmlFor="employeeCount" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Number of Employees *
                                            </label>
                                            <div className="relative">
                                                <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <select
                                                    id="employeeCount"
                                                    name="employeeCount"
                                                    value={formData.employeeCount}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 appearance-none bg-white text-base"
                                                >
                                                    <option value="">Select range</option>
                                                    <option value="1-50">1-50 employees</option>
                                                    <option value="51-200">51-200 employees</option>
                                                    <option value="201-500">201-500 employees</option>
                                                    <option value="501-1000">501-1000 employees</option>
                                                    <option value="1000+">1000+ employees</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className="block mb-2 text-sm font-semibold text-gray-700">
                                                Message (Optional)
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#934790] focus:border-transparent outline-none transition-all duration-300 resize-none text-base"
                                                placeholder="Tell us about your requirements..."
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full relative overflow-hidden font-bold px-6 py-5 rounded-xl text-lg shadow-lg transition-all duration-300 bg-[#934790] text-white hover:bg-[#7a3677] disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            <span className="absolute left-1/2 bottom-0 w-0 h-0 bg-[#5d2759] rounded-full opacity-0 group-hover:w-[200%] group-hover:h-[400%] group-hover:opacity-100 transition-all duration-500 ease-out -translate-x-1/2 z-0"></span>
                                            <span className="relative z-10">
                                                {isSubmitting ? 'Submitting...' : 'Book Your Demo'}
                                            </span>
                                        </button>

                                        <p className="text-xs text-center text-gray-500 mt-4">
                                            By submitting, you agree to our Terms of Service and Privacy Policy
                                        </p>
                                    </form>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <FaCheckCircle className="w-14 h-14 text-green-500" />
                                    </div>
                                    <h3 className="mb-4 text-3xl font-bold text-gray-800">Thank You!</h3>
                                    <p className="text-gray-600 text-lg max-w-md mb-8">
                                        Your demo request has been received. Our team will contact you shortly to schedule your personalized demo.
                                    </p>
                                    <Link 
                                        href="/"
                                        className="px-8 py-3 bg-[#934790] text-white rounded-xl font-semibold hover:bg-[#7a3677] transition-colors duration-300"
                                    >
                                        Back to Home
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
=======
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
>>>>>>> main
