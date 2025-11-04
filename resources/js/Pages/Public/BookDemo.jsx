import React, { useState } from 'react';
import { FaCheck, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function BookDemo() {
    const { darkMode } = useTheme();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        date: '',
        time: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Please enter your full name';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
        if (!form.phone.trim()) e.phone = 'Please enter a phone number';
        return e;
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setLoading(true);
        try {
            const res = await fetch('/book-demo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            setSuccess(true);
            setForm({ name: '', email: '', phone: '', company: '', date: '', time: '', message: '' });
        } catch (err) {
            setErrors({ submit: 'Unable to submit. Please try again later.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Navbar
            <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img src="/assets/logo/ZoomConnect-logo.png" alt="ZoomConnect" className="h-8" />
                    </Link>
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                        Back to Home
                    </Link>
                </div>
            </nav> */}
            <div className="max-w-6xl w-full mx-auto relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-1 flex justify-center md:justify-end">
                        <div className="w-full max-w-md -mt-16 md:-mt-24 transform md:translate-x-8 z-20">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Schedule a Demo</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Pick a time and tell us a bit about your team.</p>

                                {success ? (
                                    <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-700 text-green-800 dark:text-green-200">
                                        Thanks — we’ve received your request and will contact you shortly.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Full name"
                                            className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                        />

                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="Email"
                                            className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                        />

                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="Phone"
                                            className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                        />

                                        <input
                                            type="text"
                                            value={form.company}
                                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                                            placeholder="Company name"
                                            className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                        />

                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={form.date}
                                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                            />
                                            <input
                                                type="time"
                                                value={form.time}
                                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                                className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                            />
                                        </div>

                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Anything you'd like us to know (optional)"
                                            rows={3}
                                            className="block w-full rounded-md border-gray-200 dark:border-gray-700 shadow-sm p-2"
                                        />

                                        {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

                                        <div className="flex gap-2">
                                            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-md bg-primary text-white font-semibold">{loading ? 'Sending…' : 'Schedule Demo'}</button>
                                            <button type="button" onClick={() => { /* quick call action */ }} className="px-4 py-2 rounded-md border">Call</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white py-16 px-8 md:px-16">
                        <svg className="absolute -right-24 top-8 w-72 h-72 opacity-25 pointer-events-none" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <defs>
                                <linearGradient id="heroG" x1="0%" x2="100%" y1="0%" y2="100%">
                                    <stop offset="0%" stopColor="#5B6FFF" />
                                    <stop offset="100%" stopColor="#934790" />
                                </linearGradient>
                            </defs>
                            <path d="M430,315Q395,380,332,409Q269,438,194,417Q119,396,86,323Q53,250,92,190Q131,130,198,103Q265,76,330,99Q395,122,438,180Q481,238,430,315Z" fill="url(#heroG)" />
                        </svg>

                        <svg className="absolute left-0 bottom-0 w-full h-32 opacity-20 pointer-events-none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#ffffff" fillOpacity="0.06" d="M0,192L48,176C96,160,192,128,288,106.7C384,85,480,75,576,96C672,117,768,171,864,176C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>

                        <div className="relative z-10 max-w-2xl ml-auto">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Schedule a Demo</h1>
                            <p className="text-lg mb-6 opacity-95">Get a full tour that's tailored to your business. From a 100% real human.</p>

                            <ul className="space-y-3 text-white/90">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-white/90"><FaCheck /></span>
                                    <div>See how we help improve employee experience and reduce admin overhead.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-white/90"><FaCheck /></span>
                                    <div>Walkthrough of integrations, claims flow and analytics.</div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-white/90"><FaCheck /></span>
                                    <div>Discuss rollout, support and expected ROI.</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
