import React, { useState } from 'react';
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
                // Redirect to dashboard
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
    <div className="min-h-screen flex bg-gradient-to-b from-[#E8D4B7] via-[#f7e9d0] to-[#934790] font-montserrat">
            {/* left Side - Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8">
                <motion.div
                    className="mb-6"
                    initial={{ x: -100, opacity: 0 }}   // start off-screen left
                    animate={{ x: 0, opacity: 1 }}      // slide into place
                    transition={{ duration: 1, ease: "easeOut" }} // smooth
                >
                    <h1 className="text-5xl font-bold tracking-wide">
                        <span className="text-[#FF0066]">Zoom</span>
                        <span className="text-[#934790]">Connect</span>
                    </h1>

                </motion.div>
                <div className="w-[450px] max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-lg">

                        <div className="space-y-4">

                            {/* Social Login Buttons */}

                            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                                </svg>
                                <span>Sign in with Microsoft</span>
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
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
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
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
                                    <h3 className="text-2xl font-semibold text-gray-800">Download the app</h3>
                                    <p className="text-gray-600 mt-2">Access healthcare at your fingertips!</p>
                                </div>
                                <img
                                    src="/assets/images/zoomConnectQR.png"
                                    alt="QR Code"
                                    className="w-24 h-24 mx-auto "
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-1/2 relative overflow-hidden">
                {/* Video Background */}
                <div className="">
                    <div className="absolute inset-0 z-0 top-[10%]">
                        <img
                            src="/assets/images/loginVector.png"
                            alt="Login Page Animation"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>


            </div>

        </div>
    );
}
