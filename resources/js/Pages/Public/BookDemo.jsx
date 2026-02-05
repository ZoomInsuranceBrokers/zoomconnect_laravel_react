import React, { useState } from 'react';
import Header from './Layouts/Header';
import Footer from './Layouts/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiPhoneCall, FiCalendar, FiArrowRight } from 'react-icons/fi';

const BookDemo = () => {
    const [form, setForm] = useState({
        email: '',
        companyName: '',
        jobTitle: '',
        service: [],
        fullName: '',
        employeeCount: '',
        phone: '',
        country: '',
        state: '',
        zip: '',
        additionalInfo: '',
        demoDateTime: '',
    });

    // Animation state for steps (looping)
    const [activeStep, setActiveStep] = useState(1);
    React.useEffect(() => {
        let step = 1;
        let interval = setInterval(() => {
            step = step === 3 ? 1 : step + 1;
            setActiveStep(step);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleDateTimeChange = (e) => {
        const { value } = e.target;
        const selectedDate = new Date(value);
        const dayOfWeek = selectedDate.getDay();
        
        // Check if it's weekend (0 = Sunday, 6 = Saturday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Clear the input and show alert
            e.target.value = '';
            alert('Weekend dates are not available for demos. Please select a weekday.');
            return;
        }
        
        setForm({ ...form, demoDateTime: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            ...form,
            jobTitle: form.jobTitle === 'others' ? customDesignation : form.jobTitle
        };
        console.log('Form submitted:', formData);
    };

    // Service options for the searchable dropdown
    const serviceOptions = [
        { value: 'group_mediclaim', label: 'Group Mediclaim' },
        { value: 'group_accident', label: 'Group Accident' },
        { value: 'group_term_life', label: 'Group Term Life' },
        { value: 'wellness', label: 'Wellness' },
        { value: 'survey', label: 'Survey' },
    ];

    // Designation options for the searchable dropdown
    const designationOptions = [
        { value: 'hr_manager', label: 'HR Manager' },
        { value: 'hr_executive', label: 'HR Executive' },
        { value: 'hr_director', label: 'HR Director' },
        { value: 'ceo', label: 'CEO' },
        { value: 'coo', label: 'COO' },
        { value: 'cfo', label: 'CFO' },
        { value: 'managing_director', label: 'Managing Director' },
        { value: 'operations_manager', label: 'Operations Manager' },
        { value: 'admin_manager', label: 'Admin Manager' },
        { value: 'others', label: 'Others' },
    ];

    // State for service search and dropdown
    const [serviceSearch, setServiceSearch] = React.useState('');
    const [showServiceDropdown, setShowServiceDropdown] = React.useState(false);

    // State for designation search and dropdown
    const [designationSearch, setDesignationSearch] = React.useState('');
    const [showDesignationDropdown, setShowDesignationDropdown] = React.useState(false);
    const [customDesignation, setCustomDesignation] = React.useState('');

    // Hide dropdown on click outside
    React.useEffect(() => {
        function handleClick(e) {
            if (!e.target.closest('.service-search-dropdown')) {
                setShowServiceDropdown(false);
            }
            if (!e.target.closest('.designation-search-dropdown')) {
                setShowDesignationDropdown(false);
            }
        }
        if (showServiceDropdown || showDesignationDropdown) {
            document.addEventListener('mousedown', handleClick);
        } else {
            document.removeEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showServiceDropdown, showDesignationDropdown]);

    return (
        <>
            <Header />
            {/* Beautiful Request a Demo Section */}
            <div className="min-h-screen bg-[#fafafa] relative overflow-hidden py-8 sm:py-12 md:py-24">
                {/* Modern Mesh Gradient Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 100, 0],
                            y: [0, 50, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-gradient-to-br from-[#FF0066]/10 to-transparent rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, -80, 0],
                            y: [0, 100, 0]
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-bl from-[#934790]/10 to-transparent rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 50, 0],
                            y: [0, -70, 0]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[20%] left-[10%] w-[80%] h-[80%] bg-gradient-to-tr from-[#FF0066]/5 to-transparent rounded-full blur-[150px]"
                    />
                </div>

                {/* Subtle Interactive Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                ></div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-0 relative z-20">
                    <div className="flex flex-col lg:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
                        {/* Left Column: Content & Steps */}
                        <div className="w-full lg:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="mb-12"
                            >
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-dmserif font-bold text-gray-900 mb-4 md:mb-6 leading-tight drop-shadow-lg">
                                    Book a <span className="text-[#FF0066] relative">
                                        Demo
                                        <motion.svg
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" preserveAspectRatio="none"
                                        >
                                            <path d="M0 5 Q 50 0 100 5" stroke="#FF0066" strokeWidth="4" fill="none" strokeLinecap="round" />
                                        </motion.svg>
                                    </span>
                                </h2>
                                {/* <p className="text-gray-600 text-sm md:text-base max-w-xl leading-tight">
                                    Experience how ZoomConnect can transform your business. Just a few details and we'll get you started.
                                </p> */}
                            </motion.div>

                            {/* Vertical Steps Timeline */}
                            <div className="relative z-30">
                                {/* Step 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="relative flex items-start gap-8 group h-24 md:h-32"
                                >
                                    <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${activeStep >= 1 ? 'bg-[#FF0066] scale-110 ring-4 ring-[#FF0066]/20' : 'bg-white'}`}>
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 z-30">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">1</span>
                                        </div>

                                        {/* Icon */}
                                        <FiCheckCircle className={`text-lg sm:text-2xl transition-colors duration-500 ${activeStep >= 1 ? 'text-white' : 'text-gray-300'}`} />
                                    </div>

                                    {/* Line Segment 1: Step 1 to 2 */}
                                    <div className="absolute left-[20px] sm:left-[26px] top-7 w-1 h-24 sm:h-32 bg-gray-200/50 rounded-full overflow-hidden z-10">
                                        <motion.div
                                            className="w-full bg-gradient-to-b from-[#FF0066] to-[#FF0066]/60 shadow-[0_0_15px_rgba(255,0,102,0.4)]"
                                            initial={{ height: 0 }}
                                            animate={{ height: activeStep >= 2 ? "100%" : "0%" }}
                                            transition={{
                                                duration: activeStep === 1 ? 0 : 0.4,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 pt-2">
                                        <h3 className={`text-sm sm:text-xl font-bold mb-1 transition-colors duration-500 ${activeStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Fill the Form</h3>
                                        <p className={`text-xs sm:text-base transition-colors duration-500 ${activeStep >= 1 ? 'text-gray-600' : 'text-gray-400'}`}>Tell us a bit about your business needs.</p>
                                    </div>
                                </motion.div>

                                {/* Step 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="relative flex items-start gap-6 sm:gap-8 group h-24 sm:h-32"
                                >
                                    <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${activeStep >= 2 ? 'bg-[#FF0066] scale-110 ring-4 ring-[#FF0066]/20' : 'bg-white'}`} style={{ transitionDelay: activeStep === 2 ? '0.7s' : '0s' }}>
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 z-30">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">2</span>
                                        </div>

                                        {/* Icon */}
                                        <FiPhoneCall className={`text-lg sm:text-2xl transition-colors duration-500 ${activeStep >= 2 ? 'text-white' : 'text-gray-300'}`} style={{ transitionDelay: activeStep === 2 ? '0.7s' : '0s' }} />
                                    </div>

                                    {/* Line Segment 2: Step 2 to 3 */}
                                    <div className="absolute left-[20px] sm:left-[26px] top-7 w-1 h-24 sm:h-32 bg-gray-200/50 rounded-full overflow-hidden z-10">
                                        <motion.div
                                            className="w-full bg-gradient-to-b from-[#FF0066] to-[#FF0066]/60 shadow-[0_0_15px_rgba(255,0,102,0.4)]"
                                            initial={{ height: 0 }}
                                            animate={{ height: activeStep >= 3 ? "100%" : "0%" }}
                                            transition={{
                                                duration: activeStep === 1 ? 0 : 0.8,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 pt-2">
                                        <h3 className={`text-sm sm:text-xl font-bold mb-1 transition-colors duration-500 ${activeStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`} style={{ transitionDelay: activeStep === 2 ? '0.7s' : '0s' }}>Expert Consultation</h3>
                                        <p className={`text-xs sm:text-base transition-colors duration-500 ${activeStep >= 2 ? 'text-gray-600' : 'text-gray-400'}`} style={{ transitionDelay: activeStep === 2 ? '0.7s' : '0s' }}>Our team will reach out to schedule a personalized walkthrough.</p>
                                    </div>
                                </motion.div>

                                {/* Step 3 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="relative flex items-start gap-6 sm:gap-8 group h-12 sm:h-14"
                                >
                                    <div className={`relative z-20 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${activeStep === 3 ? 'bg-[#FF0066] scale-110 ring-4 ring-[#FF0066]/20' : 'bg-white'}`} style={{ transitionDelay: activeStep === 3 ? '0.7s' : '0s' }}>
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 z-30">
                                            <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">3</span>
                                        </div>

                                        {/* Icon */}
                                        <FiCalendar className={`text-lg sm:text-2xl transition-colors duration-500 ${activeStep === 3 ? 'text-white' : 'text-gray-300'}`} style={{ transitionDelay: activeStep === 3 ? '0.7s' : '0s' }} />
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h3 className={`text-sm sm:text-xl font-bold mb-1 transition-colors duration-500 ${activeStep === 3 ? 'text-gray-900' : 'text-gray-400'}`} style={{ transitionDelay: activeStep === 3 ? '0.7s' : '0s' }}>Live Demo</h3>
                                        <p className={`text-xs sm:text-base transition-colors duration-500 ${activeStep === 3 ? 'text-gray-600' : 'text-gray-400'}`} style={{ transitionDelay: activeStep === 3 ? '0.7s' : '0s' }}>See the platform in action and get all your questions answered.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-2xl p-4 sm:p-6 md:p-8 border border-white/50 hover:shadow-[#FF0066]/10 transition-shadow duration-500">
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">


                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Business Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="john@company.com"
                                                className="w-full px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">

                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={form.companyName}
                                                onChange={handleChange}
                                                placeholder="Your Company LLC"
                                                className="w-full px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm"
                                            />
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                        <div className="space-y-2 relative designation-search-dropdown">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Designation</label>
                                            
                                            <input
                                                type="text"
                                                name="designationSearch"
                                                autoComplete="off"
                                                value={
                                                    form.jobTitle === 'others' ? customDesignation :
                                                    form.jobTitle ? designationOptions.find(opt => opt.value === form.jobTitle)?.label || '' : 
                                                    designationSearch
                                                }
                                                onChange={e => {
                                                    if (form.jobTitle === 'others') {
                                                        setCustomDesignation(e.target.value);
                                                    } else {
                                                        setDesignationSearch(e.target.value);
                                                        setForm({ ...form, jobTitle: '' });
                                                        setShowDesignationDropdown(true);
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (form.jobTitle !== 'others') {
                                                        setShowDesignationDropdown(true);
                                                    }
                                                }}
                                                placeholder={form.jobTitle === 'others' ? "Enter your designation" : "Search or select designation"}
                                                className={`w-full px-3 sm:px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm ${
                                                    form.jobTitle === 'others' ? 'border-[#FF0066] bg-white' : ''
                                                }`}
                                            />
                                            
                                            {showDesignationDropdown && form.jobTitle !== 'others' && (
                                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-40 sm:max-h-48 overflow-auto">
                                                    {designationOptions.filter(opt =>
                                                        opt.label.toLowerCase().includes(designationSearch.toLowerCase())
                                                    ).length === 0 ? (
                                                        <div className="px-4 py-2 text-gray-400 text-xs sm:text-sm">No results</div>
                                                    ) : (
                                                        designationOptions.filter(opt =>
                                                            opt.label.toLowerCase().includes(designationSearch.toLowerCase())
                                                        ).map(opt => (
                                                            <div
                                                                key={opt.value}
                                                                className={`px-4 py-2 cursor-pointer text-gray-700 text-xs sm:text-sm hover:bg-[#FF0066]/10 ${
                                                                    opt.value === 'others' ? 'border-t border-gray-100 font-medium text-[#FF0066]' : ''
                                                                } ${form.jobTitle === opt.value ? 'bg-[#FF0066]/10 font-semibold' : ''}`}
                                                                onClick={() => {
                                                                    setForm({ ...form, jobTitle: opt.value });
                                                                    if (opt.value === 'others') {
                                                                        setCustomDesignation('');
                                                                        setDesignationSearch('');
                                                                    } else {
                                                                        setDesignationSearch(opt.label);
                                                                    }
                                                                    setShowDesignationDropdown(false);
                                                                }}
                                                            >
                                                                {opt.label}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2 relative service-search-dropdown">
                                            <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Interested Services</label>
                                            
                                            {/* Selected Services Tags */}
                                            {form.service.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {form.service.map(serviceValue => {
                                                        const serviceLabel = serviceOptions.find(opt => opt.value === serviceValue)?.label;
                                                        return (
                                                            <div key={serviceValue} className="flex items-center gap-1 bg-[#FF0066]/10 text-[#FF0066] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                                                {serviceLabel}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setForm({ 
                                                                            ...form, 
                                                                            service: form.service.filter(s => s !== serviceValue)
                                                                        });
                                                                    }}
                                                                    className="ml-1 hover:bg-[#FF0066]/20 rounded-full w-4 h-4 flex items-center justify-center text-[#FF0066] hover:text-[#e6005c]"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            
                                            <input
                                                type="text"
                                                name="serviceSearch"
                                                autoComplete="off"
                                                value={serviceSearch}
                                                onChange={e => {
                                                    setServiceSearch(e.target.value);
                                                    setShowServiceDropdown(true);
                                                }}
                                                onFocus={() => setShowServiceDropdown(true)}
                                                placeholder="Search and select services"
                                                className="w-full px-3 sm:px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 text-gray-700 placeholder:text-xs sm:placeholder:text-sm"
                                            />
                                            {showServiceDropdown && (
                                                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-40 max-h-40 sm:max-h-48 overflow-auto">
                                                    {serviceOptions.filter(opt =>
                                                        opt.label.toLowerCase().includes(serviceSearch.toLowerCase()) &&
                                                        !form.service.includes(opt.value)
                                                    ).length === 0 ? (
                                                        <div className="px-4 py-2 text-gray-400 text-xs sm:text-sm">
                                                            {form.service.length === serviceOptions.length ? 'All services selected' : 'No results'}
                                                        </div>
                                                    ) : (
                                                        serviceOptions.filter(opt =>
                                                            opt.label.toLowerCase().includes(serviceSearch.toLowerCase()) &&
                                                            !form.service.includes(opt.value)
                                                        ).map(opt => (
                                                            <div
                                                                key={opt.value}
                                                                className="px-4 py-2 cursor-pointer text-sm hover:bg-[#FF0066]/10 flex items-center justify-between"
                                                                onClick={() => {
                                                                    setForm({ 
                                                                        ...form, 
                                                                        service: [...form.service, opt.value]
                                                                    });
                                                                    setServiceSearch('');
                                                                }}
                                                            >
                                                                {opt.label}
                                                                <span className="text-[#FF0066] text-lg">+</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs sm:text-sm font-bold text-gray-700 ml-1">Preferred Demo Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            name="demoDateTime"
                                            value={form.demoDateTime}
                                            onChange={handleDateTimeChange}
                                            min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                                            className="w-full px-3 sm:px-5 py-2 bg-blue-50/70 border border-gray-200 rounded-2xl focus:bg-blue-100/50 focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 text-gray-700 placeholder:text-gray-400 text-sm"
                                        />
                                        <p className="text-[10px] sm:text-xs text-gray-500 ml-1">Note: Weekends are not available for demos</p>
                                    </div>

                                    {/* <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">How can we help?</label>
                                        <textarea
                                            name="additionalInfo"
                                            value={form.additionalInfo}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full px-5 py-2 bg-[#e3edff80] border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FF0066]/10 focus:border-[#FF0066] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm resize-none"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div> */}

                                    <div className="flex justify-center pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            className="bg-[#FF0066] text-white font-semibold py-2 sm:py-3 px-6 sm:px-10 rounded-xl hover:bg-[#e6005c] shadow-lg shadow-[#FF0066]/20 transition-all duration-300 text-sm sm:text-base flex items-center gap-2 group"
                                        >
                                            Request Free Demo
                                            <FiArrowRight className="group-hover:translate-x-1 transition-transform text-sm sm:text-base" />
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>


            <Footer />
        </>
    );
};

export default BookDemo;

