import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AiChatbot from '@/Pages/Employee/AiChatbot';
import {
    HomeIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    HeartIcon,
    QuestionMarkCircleIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
} from '@heroicons/react/24/outline';

export default function EmployeeLayout({ children, employee }) {
    const { url } = usePage();
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsOpenMobile, setSettingsOpenMobile] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const gender = (employee?.gender || '').toLowerCase();

    // Avatar handling: prefer project-provided images placed under
    // `/assets/images/avatars/male.png` and `/assets/images/avatars/female.png`.
    // If those are not provided, fall back to an initials avatar service.
    const assetMale = '/assets/images/employee_image/man-for-profile.png';
    const assetFemale = '/assets/images/employee_image/woman-for-profile.png';
    const avatarSrc = gender.startsWith('m')
        ? assetMale
        : gender.startsWith('f')
        ? assetFemale
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.full_name || 'User')}&background=934790&color=fff&bold=true`;

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, route: '/employee/dashboard' },
        { id: 'wellness', label: 'Wellness', icon: HeartIcon, route: '/employee/wellness' },
        { id: 'claims', label: 'Claims', icon: DocumentTextIcon, route: '/employee/claims' },
        { id: 'policy', label: 'Policy', icon: ShieldCheckIcon, route: '/employee/policy' },
        { id: 'help', label: 'Help', icon: QuestionMarkCircleIcon, route: '/employee/help' },
    ];

    const handleLogout = async () => {
        try {
            const response = await fetch('/employee/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
            });

            if (response.ok) {
                window.location.href = '/employee-login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('All fields are required');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New password and confirm password do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch('/employee/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                },
                body: JSON.stringify({
                    new_password: passwordForm.newPassword,
                    new_password_confirmation: passwordForm.confirmPassword,
                }),
            });

            if (response.ok) {
                setPasswordForm({ newPassword: '', confirmPassword: '' });
                setChangePasswordOpen(false);
                alert('Password changed successfully!');
            } else {
                const data = await response.json();
                setPasswordError(data.message || 'Failed to change password');
            }
        } catch (error) {
            setPasswordError('Error changing password. Please try again.');
            console.error('Password change error:', error);
        }
    };

    const isActive = (route) => {
        return url === route || url.startsWith(route);
    };

    const fmtDate = (val) => {
        if (!val) return null;
        // handles "YYYY-MM-DD HH:mm:ss", "YYYY-MM-DDTHH:mm:ss", or plain "YYYY-MM-DD"
        const date = new Date(val);
        if (isNaN(date)) return String(val).split(/[T ]/)[0];
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    };

    return (
        <>
            {/* Global scrollbar-hide styles and animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
                
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
                
                @keyframes rotate-360 {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-rotate {
                    animation: rotate-90 0.6s ease-in-out forwards;
                }
            `}} />
            
            <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
                {/* Mobile Header - Shows on small screens */}
                <header className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between z-10">
                    <Link href="/employee/dashboard" className="flex items-center">
                        <img
                            src="/assets/images/Purple%20New%20ZoomConnect%20Logo-01.png"
                            alt="ZoomConnect"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-3 relative">
                        {/* <div className="text-right">
                            <p className="text-xs font-semibold text-gray-800 leading-tight">
                                {employee?.full_name || 'User'}
                            </p>
                            <p className="text-[10px] text-gray-500">
                                {employee?.email || ''}
                            </p>
                        </div> */}

                        {/* Settings Button - Mobile */}
                        <div>
                            <button
                                onClick={() => setSettingsOpen(true)}
                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 shadow-sm flex items-center justify-center transition-all flex-shrink-0"
                                title="Settings"
                            >
                                <Cog6ToothIcon className={`w-5 h-5 text-gray-600 ${settingsOpen ? 'animate-rotate' : ''}`} />
                            </button>
                        </div>
                        
                        <button
                            onClick={() => setProfileModalOpen(true)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center overflow-hidden transition-all flex-shrink-0"
                            title="Profile"
                        >
                            <img
                                src={avatarSrc}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </header>

                {/* Left margin spacing - Desktop only */}
                <div className="hidden lg:block w-6"></div>

                {/* Left Sidebar - Desktop Only */}
                <aside className="hidden lg:flex flex-col items-center w-16 bg-white rounded-2xl shadow-sm py-6 my-4 relative">
                    <div className="mb-6">
                        <Link href="/employee/dashboard" className="block">
                            <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                                <img
                                    src="/assets/images/Purple%20New%20ZoomConnect%20Logo-01.png"
                                    alt="ZoomConnect"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                        </Link>
                    </div>
                    <nav className="flex-1 flex flex-col items-center gap-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.route);
                            return (
                                <div key={item.id} className="relative">
                                    <Link
                                        href={item.route}
                                        onMouseEnter={() => setHoveredIcon(item.id)}
                                        onMouseLeave={() => setHoveredIcon(null)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            active
                                                ? 'bg-[rgb(147,71,144)] text-white shadow-md'
                                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                    {/* Tooltip */}
                                    {hoveredIcon === item.id && (
                                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg">
                                            {item.label}
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <div className="mt-auto flex flex-col items-center gap-3">
                        {/* Settings/Gear Button */}
                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all"
                            title="Settings"
                        >
                            <Cog6ToothIcon className={`w-5 h-5 ${settingsOpen ? 'animate-rotate' : ''}`} />
                        </button>

                        {/* Profile Avatar Button */}
                        <button
                            onClick={() => setProfileModalOpen(true)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center overflow-hidden transition-all"
                            title="Profile"
                        >
                            <img
                                src={avatarSrc}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </button>
                    </div>
                </aside>

                {/* Spacing between left sidebar and main content - Desktop only */}
                <div className="hidden lg:block w-4"></div>

                {/* Main Content Area - Scrollable without scrollbar */}
                <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide lg:mr-6 pb-20 lg:pb-0">
                    <div className="w-full max-w-full px-3 sm:px-6 lg:px-0">
                        {children}
                    </div>
                </div>

                {/* Bottom Navigation Bar - Mobile Only */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
                    <div className="flex items-center justify-around px-2 py-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.route);
                            return (
                                <Link
                                    key={item.id}
                                    href={item.route}
                                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all min-w-0 flex-1 ${
                                        active
                                            ? 'text-[rgb(147,71,144)]'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 mb-1 ${active ? 'text-[rgb(147,71,144)]' : ''}`} />
                                    <span className={`text-[9px] font-medium truncate ${
                                        active ? 'text-[rgb(147,71,144)]' : 'text-gray-600'
                                    }`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Profile Modal */}
            {profileModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                        {/* Gradient header band */}
                        <div className="relative bg-gradient-to-br from-[rgb(147,71,144)] to-pink-400 px-4 pt-6 pb-14">
                            <button
                                onClick={() => setProfileModalOpen(false)}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-white/70 text-xs md:text-base font-semibold uppercase tracking-widest text-center">My Profile</p>
                        </div>

                        {/* Avatar - overlapping header */}
                        <div className="flex flex-col items-center -mt-10 px-4">
                            <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white z-10">
                                <img
                                    src={avatarSrc}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="mt-3 text-base font-bold text-gray-900 text-center line-clamp-2 leading-tight">
                                {employee?.full_name || 'User'}
                            </h3>
                            {employee?.designation && (
                                <span className="mt-1 px-3 py-0.5 bg-purple-50 text-[rgb(147,71,144)] text-[11px] font-semibold rounded-full">
                                    {employee.designation}
                                </span>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="px-4 mt-4 mb-4">
                            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                {[
                                    { label: 'Employee Code', value: employee?.employees_code, icon: '🪪' },
                                    { label: 'Email', value: employee?.email, icon: '✉️' },
                                    { label: 'Mobile', value: employee?.mobile, icon: '📱' },
                                ].map(({ label, value, icon }) =>
                                    value ? (
                                        <div key={label} className="flex items-center gap-3 px-3 py-2.5">
                                            <span className="text-base flex-shrink-0">{icon}</span>
                                            <div className="min-w-0">
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none">{label}</p>
                                                <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                                {/* Date of Birth + Date of Joining: column on mobile, row on desktop */}
                                {(fmtDate(employee?.dob) || fmtDate(employee?.date_of_joining)) && (
                                    <div className="flex flex-col lg:flex-row lg:divide-x divide-y lg:divide-y-0 divide-gray-100">
                                        {fmtDate(employee?.dob) && (
                                            <div className="flex items-center gap-2 px-3 py-2.5 lg:flex-1 min-w-0">
                                                <span className="text-base flex-shrink-0">🎂</span>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none">Date of Birth</p>
                                                    <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{fmtDate(employee.dob)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {fmtDate(employee?.date_of_joining) && (
                                            <div className="flex items-center gap-2 px-3 py-2.5 lg:flex-1 min-w-0">
                                                <span className="text-base flex-shrink-0">📅</span>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-none">Date of Joining</p>
                                                    <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate">{fmtDate(employee.date_of_joining)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-4 pb-4 flex gap-2">
                            <button
                                onClick={() => { setProfileModalOpen(false); setChangePasswordOpen(true); }}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-[rgb(147,71,144)] bg-purple-50 hover:bg-purple-100 active:bg-purple-200 rounded-xl transition-all border border-purple-100"
                            >
                                Change Password
                            </button>
                            <button
                                onClick={async () => {
                                    setProfileModalOpen(false);
                                    await handleLogout();
                                }}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl transition-all border border-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {settingsOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                        {/* Gradient header band */}
                        <div className="relative bg-gradient-to-br from-[rgb(147,71,144)] to-pink-400 px-4 pt-6 pb-14">
                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest text-center">Settings</p>
                        </div>

                        {/* Gear Icon - overlapping header */}
                        <div className="flex flex-col items-center -mt-10 px-4">
                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center z-10">
                                <Cog6ToothIcon className="w-10 h-10 text-[rgb(147,71,144)]" />
                            </div>
                            <h3 className="mt-3 text-base font-bold text-gray-900 text-center">Account Settings</h3>
                            <p className="text-xs text-gray-500 text-center mt-1">{employee?.full_name || 'User'}</p>
                        </div>

                        {/* Settings Options */}
                        <div className="px-4 mt-4 mb-4">
                            <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 overflow-hidden">
                                <button
                                    onClick={() => { setSettingsOpen(false); setChangePasswordOpen(true); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
                                >
                                    <UserCircleIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold">Change Password</p>
                                        <p className="text-[10px] text-gray-400">Update your password</p>
                                    </div>
                                </button>
                                <button
                                    onClick={async () => {
                                        setSettingsOpen(false);
                                        await handleLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold">Logout</p>
                                        <p className="text-[10px] text-gray-400">Sign out of your account</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {changePasswordOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

                        {/* Gradient header band */}
                        <div className="relative bg-gradient-to-br from-[rgb(147,71,144)] to-pink-400 px-6 pt-7 pb-12 flex-shrink-0">
                            <button
                                onClick={() => { setChangePasswordOpen(false); setPasswordError(''); }}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest text-center">Change Password</p>
                        </div>

                        {/* Lock Icon - overlapping header */}
                        <div className="flex flex-col items-center -mt-8 px-6 pb-1 flex-shrink-0">
                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center z-10">
                                <LockClosedIcon className="w-8 h-8 text-[rgb(147,71,144)]" />
                            </div>
                            <h2 className="mt-3 text-lg font-bold text-gray-900 text-center">Secure Your Account</h2>
                            <p className="text-xs text-gray-500 text-center mt-0.5">Create a strong password</p>
                        </div>

                        {/* Divider line */}
                        <div className="mx-6 mt-3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-shrink-0"></div>

                        {/* Form - scrollable content */}
                        <form onSubmit={handlePasswordChange} className="px-6 pt-4 pb-6">
                            {/* Error message */}
                            {passwordError && (
                                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-xs text-red-600 font-semibold">{passwordError}</p>
                                </div>
                            )}

                            {/* New Password */}
                            <div className="mb-3">
                                <label className="block text-[11px] font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        placeholder="Min 8 characters"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        placeholder="Re-enter password"
                                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(147,71,144)] focus:border-transparent transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password strength hint */}
                            <div className="mb-4 p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                                    💡 Mix uppercase, lowercase, numbers & symbols for strength
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="mb-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                            {/* Buttons */}
                            <div className="flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => { setChangePasswordOpen(false); setPasswordError(''); setPasswordForm({ newPassword: '', confirmPassword: '' }); }}
                                    className="flex-1 py-2.5 text-center text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 text-center text-xs font-semibold text-white bg-gradient-to-r from-[rgb(147,71,144)] to-pink-500 hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 rounded-lg transition-all shadow-lg"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <AiChatbot />
        </>
    );
}
