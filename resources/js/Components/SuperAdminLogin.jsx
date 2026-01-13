import React, { useState } from 'react';
import Header from '../Pages/Public/Layouts/Header';
import Footer from '../Pages/Public/Layouts/Footer';
import { motion } from "framer-motion";
import { router } from '@inertiajs/react';

// Animation keyframes
const revealText = {
    '@keyframes revealText': {
        '0%': { width: '0%', opacity: '0' },
        '100%': { width: '100%', opacity: '1' }
    }
};

export default function SuperAdminLogin() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
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
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ email: emailOrPhone }),
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
            const response = await fetch('/verify-otp', {
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
                window.location.href = data.redirect || '/superadmin/dashboard';
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
        <>
            {/* Custom Header */}
            <Header />

            <div className="min-h-screen flex flex-col md:flex-row relative font-montserrat overflow-hidden bg-[#E8D4B7]">
                {/* SVG Wave Background - More wavy, from below */}
                <svg
                    className="absolute inset-0 w-full h-full z-0"
                    viewBox="0 0 1440 900"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    {/* Main gradient background */}
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#934790" />
                            <stop offset="50%" stopColor="#b97ab0" />
                            <stop offset="100%" stopColor="#e5c6e0" />
                        </linearGradient>
                    </defs>
                    <rect width="1440" height="900" fill="url(#bgGradient)" />
                    {/* Wavy curved waves with undulating pattern */}
                    <path
                        d="M0,900 C120,900 180,820 240,780 C300,740 360,620 480,680 C600,740 660,580 720,520 C780,460 840,380 960,420 C1080,460 1140,300 1200,260 C1260,220 1320,140 1440,100 L1440,0 L1440,900 Z"
                        fill="white"
                        opacity="0.98"
                    />
                    {/* Secondary wavy pattern from opposite side */}
                    <path
                        d="M1440,900 C1320,840 1260,760 1200,720 C1140,680 1080,600 960,640 C840,680 780,520 720,480 C660,440 600,360 480,400 C360,440 300,280 240,240 C180,200 120,120 0,80 L0,0 L0,900 Z"
                        fill="#934790"
                        opacity="0.25"
                    />
                </svg>

                <div className="flex flex-col md:flex-row w-full relative z-10 ">
                    {/* Left Side - Branding & Illustration */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:p-12">
                        <motion.h1
                            className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                        </motion.h1>
                        <motion.img
                            src="/assets/images/loginVector.png"
                            alt="Login Illustration"
                            className="w-full max-w-sm drop-shadow-xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8 sm:px-4 md:p-20">
                        <div className="w-full max-w-md">
                            <div className="bg-white rounded-3xl p-8 md:px-10 md:py-6 shadow-2xl">
                                <motion.div
                                    className="mb-6 flex justify-center"
                                    initial={{ x: -100, opacity: 0 }}   // start off-screen left
                                    animate={{ x: 0, opacity: 1 }}      // slide into place
                                    transition={{ duration: 1, ease: "easeOut" }} // smooth
                                >
                                    <img
                                        src="/assets/logo/ZoomConnect-logo.png"
                                        alt="ZoomConnect Logo"
                                        className="h-10 w-auto"
                                    />

                                </motion.div>

                                <div className="space-y-4">

                                    {/* Google Login Button */}
                                    <motion.button
                                        className="w-full flex items-center justify-center gap-2 text-[14px] bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                                            <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                                            <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                                            <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                                        </svg>
                                        <span>Sign in with Microsoft</span>
                                    </motion.button>

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
                                        </div>
                                    </div>

                                    {/* Email/Phone Input */}
                                    {!showOtpScreen ? (
                                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Enter your email <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="example@zoominsurancebrokers.com"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                                                    value={emailOrPhone}
                                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            {message && (
                                                <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                                                    {message}
                                                </div>
                                            )}

                                            {error && (
                                                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="w-full bg-[#934790] text-white py-2.5 rounded-lg hover:bg-[#6A0066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                <label htmlFor="terms" className="text-sm text-gray-600">
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
                                                <h3 className="text-lg font-semibold text-gray-800">Verify OTP</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    We've sent a 6-digit code to {emailOrPhone}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Enter OTP <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="000000"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all text-center text-2xl font-mono tracking-widest"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    required
                                                    disabled={isLoading}
                                                    maxLength={6}
                                                />
                                            </div>

                                            {message && (
                                                <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                                                    {message}
                                                </div>
                                            )}

                                            {error && (
                                                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className="w-full bg-[#934790] text-white py-2.5 rounded-lg hover:bg-[#6A0066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isLoading || otp.length !== 6}
                                            >
                                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleBackToEmail}
                                                className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                                                disabled={isLoading}
                                            >
                                                Back to Email
                                            </button>
                                        </form>
                                    )}

                                    {/* Download App Section */}
                                    <div className="mt-8 flex border-t border-gray-200 pt-2">
                                        <div className="w-full text-left flex flex-col justify-center">
                                            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Download the app</h3>
                                            <p className="text-xs md:text-sm text-gray-600 mt-1 leading-tight">Access healthcare at your fingertips!</p>
                                        </div>
                                        <img
                                            src="/assets/images/zoomConnectQR.png"
                                            alt="QR Code"
                                            className="w-20 h-20 mx-auto "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            {/* Custom Footer */}
            <Footer />
        </>
    );
}

