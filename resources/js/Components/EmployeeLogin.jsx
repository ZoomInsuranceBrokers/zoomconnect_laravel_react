import React, { useState } from 'react';
import Footer from '../Pages/Public/Layouts/Footer';
import { motion } from "framer-motion";

export default function EmployeeLogin() {
    const [loginType, setLoginType] = useState('email'); // 'email', 'mobile', 'employee_code'
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/employee-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ 
                    login_type: loginType, 
                    email: loginType === 'email' ? emailOrPhone : null,
                    mobile: loginType === 'mobile' ? emailOrPhone : null,
                    employee_code: loginType === 'employee_code' ? emailOrPhone : null,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                if (data.require_otp) {
                    setShowOtpScreen(true);
                } else {
                    window.location.href = data.redirect || '/employee/dashboard';
                }
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
            const response = await fetch('/employee-verify-otp', {
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
                window.location.href = data.redirect || '/employee/dashboard';
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setShowOtpScreen(false);
        setOtp('');
        setError('');
        setMessage('');
    };

    const getInputPlaceholder = () => {
        switch (loginType) {
            case 'email':
                return 'Enter your email';
            case 'mobile':
                return 'Enter your mobile number';
            case 'employee_code':
                return 'Enter your employee code';
            default:
                return 'Enter your credentials';
        }
    };

    const getInputType = () => {
        return loginType === 'email' ? 'email' : 'text';
    };

    return (
        <>

            <div className="min-h-screen flex flex-col md:flex-row relative font-montserrat overflow-hidden bg-[#E8D4B7]">
                {/* SVG Wave Background */}
                <svg
                    className="absolute inset-0 w-full h-full z-0"
                    viewBox="0 0 1440 900"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="bgGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#934790" />
                            <stop offset="50%" stopColor="#b97ab0" />
                            <stop offset="100%" stopColor="#e5c6e0" />
                        </linearGradient>
                    </defs>
                    <rect width="1440" height="900" fill="url(#bgGradient)" />
                    <path
                        d="M0,900 C120,900 180,820 240,780 C300,740 360,620 480,680 C600,740 660,580 720,520 C780,460 840,380 960,420 C1080,460 1140,300 1200,260 C1260,220 1320,140 1440,100 L1440,0 L1440,900 Z"
                        fill="white"
                        opacity="0.98"
                    />
                    <path
                        d="M1440,900 C1320,840 1260,760 1200,720 C1140,680 1080,600 960,640 C840,680 780,520 720,480 C660,440 600,360 480,400 C360,440 300,280 240,240 C180,200 120,120 0,80 L0,0 L0,900 Z"
                        fill="#934790"
                        opacity="0.25"
                    />
                </svg>

                <div className="flex flex-col md:flex-row w-full relative z-10">
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
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                >
                                    <img
                                        src="/assets/logo/ZoomConnect-logo.png"
                                        alt="ZoomConnect Logo"
                                        className="h-10 w-auto"
                                    />
                                </motion.div>

                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Employee Login</h2>
                                    <p className="text-sm text-gray-600 mt-1">Access your benefits portal</p>
                                </div>

                                <div className="space-y-4">
                                    {!showOtpScreen ? (
                                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                                            {/* Login Tab Toggle */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sign in with
                                                </label>
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('email'); setEmailOrPhone(''); setError(''); }}
                                                        className={`flex-1 text-sm px-4 py-2 rounded-lg transition-all font-medium ${
                                                            loginType === 'email'
                                                                ? 'bg-[#934790] text-white shadow'
                                                                : 'bg-white text-gray-600'
                                                        }`}
                                                    >
                                                        Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('mobile'); setEmailOrPhone(''); setError(''); }}
                                                        className={`flex-1 text-sm px-4 py-2 rounded-lg transition-all font-medium ${
                                                            loginType === 'mobile'
                                                                ? 'bg-[#934790] text-white shadow'
                                                                : 'bg-white text-gray-600'
                                                        }`}
                                                        disabled
                                                        title="Mobile login coming soon"
                                                    >
                                                        Mobile
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Input Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {getInputPlaceholder()} <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type={getInputType()}
                                                    placeholder={getInputPlaceholder()}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                                                    value={emailOrPhone}
                                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                                    required
                                                    disabled={isLoading || (loginType !== 'email' && loginType !== 'mobile')}
                                                />
                                                {loginType === 'mobile' && (
                                                    <p className="text-xs text-gray-500 mt-1">Mobile login will be available soon. For now, use Email.</p>
                                                )}
                                            </div>

                                            {/* Employee Code CTA */}
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="text-sm text-gray-600">Having trouble?</div>
                                                <button
                                                    type="button"
                                                    onClick={() => { setLoginType('employee_code'); setEmailOrPhone(''); setError(''); }}
                                                    className={`text-sm bg-[#934790] text-white px-3 py-1.5 rounded-lg shadow hover:bg-[#6A0066] transition-colors`}
                                                >
                                                    Use Employee Code
                                                </button>
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
                                                disabled={isLoading || loginType !== 'email'}
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
                                                    By signing in you agree with{' '}
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
                                                onClick={handleBackToLogin}
                                                className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
                                                disabled={isLoading}
                                            >
                                                Back to Login
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
                                            className="w-20 h-20 mx-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
