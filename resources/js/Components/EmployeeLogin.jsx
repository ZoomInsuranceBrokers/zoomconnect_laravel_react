import React, { useState } from 'react';
import Footer from '../Pages/Public/Layouts/Footer';
import { motion } from "framer-motion";

export default function EmployeeLogin() {
    const [loginType, setLoginType] = useState('email'); // 'email', 'mobile', 'employee_code'
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [employeeCode, setEmployeeCode] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Load companies when employee_code login type is selected
    React.useEffect(() => {
        if (loginType === 'employee_code') {
            loadCompanies();
        }
    }, [loginType]);

    const loadCompanies = async () => {
        setLoadingCompanies(true);
        try {
            const response = await fetch('/employee-companies');
            const data = await response.json();
            if (data.success) {
                setCompanies(data.companies);
            } else {
                setError('Failed to load companies');
            }
        } catch (error) {
            setError('Failed to load companies');
        } finally {
            setLoadingCompanies(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const requestBody = {
                login_type: loginType,
                ...(loginType === 'email' && { email: emailOrPhone }),
                ...(loginType === 'mobile' && { mobile: emailOrPhone }),
                ...(loginType === 'employee_code' && { 
                    employee_code: employeeCode, 
                    company_id: selectedCompany, 
                    password: password 
                })
            };

            const response = await fetch('/employee-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify(requestBody),
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
        setEmailOrPhone('');
        setEmployeeCode('');
        setPassword('');
        setSelectedCompany('');
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
            <div
                className="min-h-screen flex relative font-montserrat overflow-hidden bg-[#f2d7b3]/70"
            >
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

                                <div className="space-y-4">
                                    {!showOtpScreen ? (
                                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                                            {/* Login Tab Toggle */}
                                            <div>
                                                {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sign in with
                                                </label> */}
                                                <div className="flex items-center gap-2 bg-[#f2d7b3] rounded-2xl p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('email'); setEmailOrPhone(''); setError(''); }}
                                                        className={`flex-1 text-sm px-4 py-2 rounded-2xl transition-all font-medium ${loginType === 'email'
                                                                ? 'bg-[#934790] text-white shadow'
                                                                : 'bg-[#f2d7b3] text-gray-600'
                                                            }`}
                                                    >
                                                        Email
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setLoginType('mobile'); setEmailOrPhone(''); setError(''); }}
                                                        className={`flex-1 text-sm px-4 py-2 rounded-2xl transition-all font-medium ${loginType === 'mobile'
                                                                ? 'bg-[#934790] text-white shadow'
                                                                : 'bg-[#f2d7b3] text-gray-600'
                                                            }`}
                                                    >
                                                        Mobile
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Input Fields */}
                                            <div className="space-y-4">
                                                {(loginType === 'email' || loginType === 'mobile') && (
                                                    <div className="relative">
                                                        <input
                                                            type={getInputType()}
                                                            placeholder={loginType === 'email' ? 'example@company.com' : '10-digit mobile number'}
                                                            className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm md:placeholder:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                            value={emailOrPhone}
                                                            onChange={(e) => {
                                                                const value = loginType === 'mobile' 
                                                                    ? e.target.value.replace(/\D/g, '').slice(0, 10) 
                                                                    : e.target.value;
                                                                setEmailOrPhone(value);
                                                            }}
                                                            required
                                                            disabled={isLoading}
                                                            maxLength={loginType === 'mobile' ? 10 : undefined}
                                                            inputMode={loginType === 'mobile' ? 'numeric' : undefined}
                                                        />
                                                        <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                            {getInputPlaceholder()}
                                                        </label>
                                                    </div>
                                                )}

                                                {loginType === 'employee_code' && (
                                                    <>
                                                        {/* Company Dropdown */}
                                                        <div className="relative">
                                                            <select
                                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl text-gray-700 text-sm md:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer appearance-none"
                                                                value={selectedCompany}
                                                                onChange={(e) => setSelectedCompany(e.target.value)}
                                                                required
                                                                disabled={isLoading || loadingCompanies}
                                                            >
                                                                <option value="">
                                                                    {loadingCompanies ? 'Loading companies...' : 'Select your company'}
                                                                </option>
                                                                {companies.map((company) => (
                                                                    <option key={company.id} value={company.id}>
                                                                        {company.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                                Company
                                                            </label>
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {/* Employee Code */}
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter your employee code"
                                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm md:placeholder:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                                value={employeeCode}
                                                                onChange={(e) => setEmployeeCode(e.target.value)}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                                Employee Code
                                                            </label>
                                                        </div>

                                                        {/* Password */}
                                                        <div className="relative">
                                                            <input
                                                                type="password"
                                                                placeholder="Enter your password"
                                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm md:placeholder:text-md focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                required
                                                                disabled={isLoading}
                                                            />
                                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                                Password
                                                            </label>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {message && (
                                                <div className="flex items-start text-[10px] font-bold text-green-700 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                                className="w-full bg-[#f2d7b3] text-[#6A0066]/70 text-sm md:text-base py-2 font-semibold rounded-2xl hover:bg-[#934790] hover:text-[#f2d7b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isLoading || 
                                                    (loginType === 'mobile' && emailOrPhone.length !== 10) ||
                                                    (loginType === 'employee_code' && (!selectedCompany || !employeeCode || !password))
                                                }
                                            >
                                                {isLoading ? 
                                                    (loginType === 'employee_code' ? 'Signing In...' : 'Sending OTP...') : 
                                                    (loginType === 'employee_code' ? 'Sign In' : 'Send OTP')
                                                }
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

                                            {/* Alternative Login Options */}
                                            {loginType !== 'employee_code' ? (
                                                <div className="mt-2 flex justify-end text-xs text-gray-600">
                                                    Having trouble? 
                                                    <button
                                                        type="button"
                                                        onClick={() => { 
                                                            setLoginType('employee_code'); 
                                                            setEmailOrPhone(''); 
                                                            setEmployeeCode('');
                                                            setPassword('');
                                                            setSelectedCompany('');
                                                            setError(''); 
                                                        }}
                                                        className="text-[#6A0066] underline hover:text-[#934790] transition-colors ml-1 cursor-pointer bg-none border-none p-0 font-medium"
                                                    >
                                                        Use Employee Code
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="mt-2 flex justify-center text-xs text-gray-600">
                                                    Want to use OTP instead?
                                                    <button
                                                        type="button"
                                                        onClick={() => { 
                                                            setLoginType('email'); 
                                                            setEmailOrPhone(''); 
                                                            setEmployeeCode('');
                                                            setPassword('');
                                                            setSelectedCompany('');
                                                            setError(''); 
                                                        }}
                                                        className="text-[#6A0066] underline hover:text-[#934790] transition-colors ml-1 cursor-pointer bg-none border-none p-0 font-medium"
                                                    >
                                                        Use Email/Mobile
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    ) : (
                                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                                            <div className="text-center mb-4">
                                                <h3 className="text-base md:text-lg font-semibold text-gray-800">Verify OTP</h3>
                                                <p className="text-xs md:text-sm text-gray-600 mt-1">
                                                    We've sent a {loginType === 'mobile' ? '4' : '6'}-digit code to {emailOrPhone}
                                                </p>
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={loginType === 'mobile' ? '0000' : '000000'}
                                                    className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-center text-xl md:text-2xl font-mono tracking-widest peer"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, (loginType === 'mobile' ? 4 : 6)))}
                                                    required
                                                    disabled={isLoading}
                                                    maxLength={loginType === 'mobile' ? 4 : 6}
                                                />
                                                <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-sm font-medium text-gray-600 rounded-lg">
                                                    Enter OTP
                                                </label>
                                            </div>

                                            {message && (
                                                <div className="flex items-start text-[10px] font-bold text-green-700 mt-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                                className="w-full bg-[#6A0066] text-white py-2 md:py-2.5 text-sm md:text-lg rounded-lg hover:bg-[#934790] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                                disabled={isLoading || otp.length !== (loginType === 'mobile' ? 4 : 6)}
                                            >
                                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                                            </button>

                                            {/* <button
                                                type="button"
                                                onClick={handleBackToLogin}
                                                className="w-full bg-gray-200 text-gray-700 py-2 md:py-2.5 text-sm md:text-lg rounded-lg hover:bg-gray-300 transition-colors"
                                                disabled={isLoading}
                                            >
                                                Back to Login
                                            </button> */}
                                        </form>
                                    )}

                                    {/* Download App Section */}
                                    <div className="mt-8 flex border-t border-gray-300 pt-2">
                                        <div className="w-full text-left flex flex-col justify-center">
                                            <h3 className="text-lg md:text-2xl font-semibold text-gray-800">Download the app</h3>
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


        </>
    );
}
