import React, { useState } from 'react';
import { motion } from "framer-motion";

export default function CompanyUserLogin() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/company-user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setShowOtpScreen(true);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/company-user-verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ otp }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                window.location.href = data.redirect || '/company-user/dashboard';
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setShowOtpScreen(false);
        setOtp('');
        setError('');
        setMessage('');
    };

    return (
        <div className="min-h-screen flex relative font-montserrat overflow-hidden bg-[#f2d7b3]/70">
            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">

                {/* Left Side - Login Form */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-start md:justify-center md:px-16 py-0 md:py-12">
                    
                    {/* Mobile Illustration Section - Above Form */}
                    <div className="md:hidden w-full mb-6 relative">
                        {/* Semicircle Background */}
                        <div className="absolute top-0 left-0 right-0 h-[240px] overflow-hidden">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[320px] h-[240px] bg-[#f2d7b3] rounded-b-full"></div>
                        </div>
                        
                        {/* Character Image on Top of Semicircle */}
                        <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-4">
                            {/* ZoomConnect Logo Behind Character - Peeking Out */}
                            <motion.img
                                src="/assets/logo/ZoomConnect-logo.png"
                                alt="ZoomConnect Logo Background"
                                className="absolute top-6 left-[15%] w-[220px]"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                            
                            <motion.img
                                src="/assets/images/girl-with-laptop.png"
                                alt="Login Illustration"
                                className="relative w-[180px] top-4 drop-shadow-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-md">
                        
                        <div className="rounded-3xl p-6 md:px-10 md:py-8 w-full max-w-md">
                            {/* Logo - Hidden on Mobile, Shown on Desktop */}
                            <motion.div
                                className="mb-6 hidden md:flex justify-center"
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <img
                                    src="/assets/logo/ZoomConnect-logo.png"
                                    alt="ZoomConnect Logo"
                                    className="h-10 w-auto z-10"
                                />
                            </motion.div>

                            {/* Title */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Company User Login</h2>
                                <p className="text-sm text-gray-600 mt-1">Access your company dashboard</p>
                            </div>

                            <div className="space-y-4">

                                {/* Email Input */}
                                {!showOtpScreen ? (
                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="example@company.com"
                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-lg md:placeholder:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                Enter your email
                                            </label>
                                        </div>

                                        {message && (
                                            <div className="flex items-start text-[10px] font-bold text-green-700 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {message}
                                            </div>
                                        )}

                                        {error && (
                                            <div className="flex items-start text-[10px] font-bold text-red-700 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                                </svg>
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="w-full bg-[#6A0066] text-white text-sm md:text-base py-2 font-semibold rounded-2xl hover:bg-[#934790] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                        </button>

                                        {/* Terms and Privacy */}
                                        <div className="flex items-start gap-2 mt-4">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                className="mt-1 rounded outline-none transition-all"
                                                required
                                                checked
                                                readOnly
                                            />
                                            <label htmlFor="terms" className="text-xs text-gray-600">
                                                By signing in to Zoom Connect you agree with{' '}
                                                <a href="#" className="text-[#6A0066]">
                                                    Privacy policy
                                                </a>{' '}
                                                and{' '}
                                                <a href="#" className="text-[#6A0066]">
                                                    Terms of use
                                                </a>
                                            </label>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                                        <div className="text-center mb-4">
                                            <h3 className="text-base md:text-lg font-semibold text-gray-800">Verify OTP</h3>
                                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                                                We've sent a 6-digit code to {email}
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="000000"
                                                className="w-full px-4 py-1 md:py-1 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-lg md:placeholder:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-center text-xl md:text-xl font-mono tracking-widest peer"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                required
                                                disabled={isLoading}
                                                maxLength={6}
                                            />
                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                Enter OTP
                                            </label>
                                        </div>

                                        {message && (
                                            <div className="flex items-start text-[10px] font-bold text-green-700 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {message}
                                            </div>
                                        )}

                                        {error && (
                                            <div className="flex items-center text-[10px] font-bold text-red-700 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                                </svg>
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="w-full bg-[#6A0066] text-white py-2 md:py-2.5 text-sm md:text-base rounded-2xl hover:bg-[#934790] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                            disabled={isLoading || otp.length !== 6}
                                        >
                                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleBackToEmail}
                                            className="w-full text-[#6A0066] text-sm underline hover:text-[#934790] transition-colors"
                                        >
                                            Back to email
                                        </button>
                                    </form>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Illustration */}
                <div className="hidden md:flex w-full md:w-1/2 items-center justify-center relative px-8 py-12">
                    {/* Circular Background */}
                    <motion.div 
                        className="absolute bottom-0 right-34 w-[350px] h-[520px] rounded-tl-[250px] rounded-tr-[250px] bg-[#f2d7b3] pointer-events-none z-0"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    ></motion.div>

                    {/* Animated Character */}
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.img
                            src="/assets/images/girl-with-laptop.png"
                            alt="Login Illustration"
                            className="w-[320px] max-w-full drop-shadow-2xl"
                            initial={{ scale: 1, y: 0 }}
                            animate={{ scale: 1, y: [0, -15, 0, 15, 0] }}
                        />
                        <motion.img
                            src="/assets/images/Shadow.png"
                            alt="shadow"
                            className="w-[200px] -mt-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
