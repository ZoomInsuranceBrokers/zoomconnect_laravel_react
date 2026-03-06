import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FirstLogin({ employee }) {
    const [step, setStep] = useState(1); // 1: Verify Details, 2: Mobile Verify, 3: Reset Password
    const [mobile, setMobile] = useState(employee.mobile || '');
    const [originalMobile] = useState(employee.mobile || '');
    const [mobileOtp, setMobileOtp] = useState('');
    const [showMobileOtp, setShowMobileOtp] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const loginMethod = employee.login_method || 'email'; // 'email', 'mobile', or 'employee_code'
    const skipMobileVerification = loginMethod === 'mobile'; // Skip mobile verification for mobile login

    const handleVerifyDetails = () => {
        if (!mobile || mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        // If logged in via mobile, skip mobile verification step
        if (skipMobileVerification) {
            setStep(3); // Go directly to password reset
        } else {
            setStep(2); // Go to mobile verification
        }
        setError('');
    };

    const handleSendMobileOtp = async () => {
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/employee/first-login/send-mobile-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ mobile }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setShowMobileOtp(true);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyMobileOtp = async () => {
        if (!mobileOtp || mobileOtp.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch('/employee/first-login/verify-mobile-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ mobile, otp: mobileOtp }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setStep(3);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // If mobile login, update mobile first
            if (skipMobileVerification && mobile !== originalMobile) {
                const mobileResponse = await fetch('/employee/first-login/update-mobile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    },
                    body: JSON.stringify({ mobile }),
                });

                const mobileData = await mobileResponse.json();
                if (!mobileData.success) {
                    setError(mobileData.message);
                    setIsLoading(false);
                    return;
                }
            }

            const response = await fetch('/employee/first-login/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({ password, confirm_password: confirmPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setTimeout(() => {
                    window.location.href = data.redirect || '/employee/dashboard';
                }, 1500);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Complete Your Profile - ZoomConnect" />
            <div className="min-h-screen flex items-center justify-center bg-[#f2d7b3]/70 font-montserrat p-4">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl overflow-hidden"
                    >
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <motion.img
                                src="/assets/logo/ZoomConnect-logo.png"
                                alt="ZoomConnect"
                                className="h-10 w-auto"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>

                        {/* Main Card */}
                        <div className="rounded-3xl p-6 md:px-10 md:py-8 max-w-md mx-auto">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#6A0066] mb-2">Welcome!</h1>
                                <p className="text-sm md:text-base text-gray-600">
                                    {step === 1 && 'Step 1 of ' + (skipMobileVerification ? '2' : '3') + ' - Verify Your Details'}
                                    {step === 2 && 'Step 2 of 3 - Verify Mobile Number'}
                                    {step === 3 && 'Step ' + (skipMobileVerification ? '2' : '3') + ' of ' + (skipMobileVerification ? '2' : '3') + ' - Set Your Password'}
                                </p>
                                
                                {/* Progress Bar */}
                                <div className="mt-4 flex justify-center gap-2">
                                    {(skipMobileVerification ? [1, 2] : [1, 2, 3]).map((s) => (
                                        <div
                                            key={s}
                                            className={`h-2 rounded-full transition-all ${
                                                s === (skipMobileVerification && step === 3 ? 2 : step)
                                                    ? 'w-8 bg-[#934790]'
                                                    : s < (skipMobileVerification && step === 3 ? 2 : step)
                                                    ? 'w-6 bg-[#6A0066]/40'
                                                    : 'w-2 bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Error/Success Messages */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-4 flex items-start text-[10px] font-bold text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                        </svg>
                                        {error}
                                    </motion.div>
                                )}
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mb-4 flex items-start text-[10px] font-bold text-green-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Step 1: Verify Details */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-[#f2d7b3]/40 rounded-2xl p-4 space-y-4">
                                        <div className="border-b border-gray-200 pb-2">
                                            <label className="text-xs font-semibold text-gray-600">Name</label>
                                            <p className="text-gray-800 font-medium text-sm">{employee.full_name}</p>
                                        </div>
                                        <div className="border-b border-gray-200 pb-2">
                                            <label className="text-xs font-semibold text-gray-600">Email</label>
                                            <p className="text-gray-800 font-medium text-sm">{employee.email}</p>
                                        </div>
                                        <div className="border-b border-gray-200 pb-2">
                                            <label className="text-xs font-semibold text-gray-600">Employee Code</label>
                                            <p className="text-gray-800 font-medium text-sm">{employee.employee_code}</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={mobile}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setMobile(value);
                                                }}
                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                placeholder="10-digit mobile number"
                                                maxLength={10}
                                                inputMode="numeric"
                                                required
                                            />
                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                Mobile Number
                                            </label>
                                        </div>
                                        {originalMobile !== mobile && mobile.length === 10 && (
                                            <p className="text-xs text-[#6A0066] font-medium">
                                                ℹ️ You've updated your mobile number{skipMobileVerification ? ' - No verification needed' : ''}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleVerifyDetails}
                                        disabled={!mobile || mobile.length !== 10}
                                        className="w-full bg-[#f2d7b3] text-[#6A0066]/70 text-sm md:text-base py-2.5 font-semibold rounded-2xl hover:bg-[#934790] hover:text-[#f2d7b3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next →
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Mobile Verification */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="text-center mb-4">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f2d7b3] rounded-full mb-3">
                                            <svg className="w-8 h-8 text-[#934790]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            We'll send a 4-digit OTP to
                                        </p>
                                        <p className="text-[#6A0066] font-semibold text-lg mt-1">{mobile}</p>
                                    </div>

                                    {!showMobileOtp ? (
                                        <button
                                            onClick={handleSendMobileOtp}
                                            disabled={isLoading}
                                            className="w-full bg-[#f2d7b3] text-[#6A0066]/70 text-sm md:text-base py-2.5 font-semibold rounded-2xl hover:bg-[#934790] hover:text-[#f2d7b3] transition-colors disabled:opacity-70"
                                        >
                                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={mobileOtp}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                                        setMobileOtp(value);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-center text-xl md:text-2xl font-mono tracking-widest focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                    placeholder="0000"
                                                    maxLength={4}
                                                    inputMode="numeric"
                                                />
                                                <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-sm font-medium text-gray-600 rounded-lg">
                                                    Enter OTP
                                                </label>
                                            </div>
                                            <button
                                                onClick={handleVerifyMobileOtp}
                                                disabled={isLoading || mobileOtp.length !== 4}
                                                className="w-full bg-[#6A0066] text-white py-2.5 text-sm md:text-base rounded-2xl hover:bg-[#934790] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                                            </button>
                                            <button
                                                onClick={handleSendMobileOtp}
                                                disabled={isLoading}
                                                className="w-full text-[#6A0066] py-2 text-sm font-medium hover:text-[#934790] underline transition-colors"
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full text-gray-600 py-2 text-sm font-medium hover:text-gray-700 transition-colors"
                                    >
                                        ← Back to Details
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 3: Reset Password */}
                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <form onSubmit={handleResetPassword} className="space-y-4">
                                        <div className="text-center mb-4">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 text-sm font-medium">
                                                {skipMobileVerification ? 'Details verified! Now set your password' : 'Mobile verified successfully!'}
                                            </p>
                                            <p className="text-gray-600 text-sm">Now create a secure password</p>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                placeholder="Minimum 6 characters"
                                                required
                                                minLength={6}
                                                disabled={isLoading}
                                            />
                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                New Password
                                            </label>
                                        </div>

                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-2 border bg-transparent border-gray-500 rounded-2xl placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all peer"
                                                placeholder="Re-enter password"
                                                required
                                                minLength={6}
                                                disabled={isLoading}
                                            />
                                            <label className="absolute left-3 -top-2.5 bg-[#f2d7b3] px-2 text-xs md:text-sm font-semibold text-gray-600 rounded-xl">
                                                Confirm Password
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading || !password || !confirmPassword}
                                            className="w-full bg-[#6A0066] text-white py-2.5 text-sm md:text-base rounded-2xl hover:bg-[#934790] transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-semibold"
                                        >
                                            {isLoading ? 'Setting Password...' : 'Complete Setup & Continue →'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
