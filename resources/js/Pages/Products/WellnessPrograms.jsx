import React from 'react';
import { Link } from '@inertiajs/react';
import { FaLeaf, FaHeartbeat, FaBrain, FaUsers, FaCheckCircle, FaMobile, FaChartLine, FaStar } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function WellnessPrograms() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaHeartbeat,
            title: 'Physical Wellness',
            description: 'Fitness programs, health screenings, and preventive care initiatives'
        },
        {
            icon: FaBrain,
            title: 'Mental Health',
            description: 'Stress management, counseling services, and mindfulness programs'
        },
        {
            icon: FaLeaf,
            title: 'Holistic Approach',
            description: 'Nutrition guidance, work-life balance, and lifestyle coaching'
        },
        {
            icon: FaUsers,
            title: 'Team Engagement',
            description: 'Group challenges, team building, and wellness competitions'
        }
    ];

    const programs = [
        {
            category: 'Physical Health',
            color: 'from-green-500 to-teal-500',
            items: [
                'Annual Health Check-ups',
                'Fitness Center Memberships',
                'Corporate Yoga Sessions',
                'Ergonomic Assessments',
                'Nutrition Consultations',
                'Weight Management Programs'
            ]
        },
        {
            category: 'Mental Wellness',
            color: 'from-blue-500 to-purple-500',
            items: [
                'Stress Management Workshops',
                'Mental Health Counseling',
                'Mindfulness & Meditation',
                'Work-Life Balance Coaching',
                'Employee Assistance Programs',
                'Resilience Training'
            ]
        },
        {
            category: 'Lifestyle & Habits',
            color: 'from-orange-500 to-red-500',
            items: [
                'Smoking Cessation Programs',
                'Sleep Hygiene Education',
                'Digital Detox Initiatives',
                'Healthy Cooking Classes',
                'Financial Wellness Training',
                'Time Management Skills'
            ]
        }
    ];

    const benefits = [
        'Reduced Healthcare Costs by 25%',
        'Improved Employee Productivity',
        'Lower Absenteeism Rates',
        'Enhanced Employee Retention',
        'Stronger Team Morale',
        'Better Work-Life Balance',
        'Increased Job Satisfaction',
        'Preventive Health Focus'
    ];

    const metrics = [
        { value: '78%', label: 'Employee Participation', icon: FaUsers },
        { value: '35%', label: 'Stress Reduction', icon: FaBrain },
        { value: '42%', label: 'Productivity Increase', icon: FaChartLine },
        { value: '4.8', label: 'Program Rating', icon: FaStar }
    ];

    const testimonials = [
        {
            quote: "The wellness program transformed our workplace culture. Employees are happier, healthier, and more engaged than ever before.",
            author: "Sarah Johnson",
            position: "HR Director, TechCorp"
        },
        {
            quote: "We've seen a significant reduction in stress-related leaves since implementing the mental health initiatives.",
            author: "Dr. Michael Chen",
            position: "Chief Medical Officer, HealthFirst"
        },
        {
            quote: "The holistic approach to wellness has improved our team's overall quality of life and work performance.",
            author: "Priya Sharma",
            position: "CEO, InnovateIndia"
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Navigation */}
            <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <img className="h-8 w-auto" src="/assets/logo/zoomconnect-logo.png" alt="ZoomConnect" />
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/book-demo"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                            >
                                Book Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                                    <FaLeaf className="mr-2" />
                                    Holistic Wellness
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                                Wellness Programs
                            </h1>
                            <p className="text-xl leading-8 mb-8">
                                Comprehensive wellness solutions designed to enhance your employees' physical, mental, and emotional well-being. Create a healthier, happier, and more productive workplace.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/book-demo"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-green-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                                >
                                    Start Wellness Journey
                                </Link>
                                <Link
                                    href="#learn-more"
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                                >
                                    Explore Programs
                                </Link>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl transform rotate-6 opacity-20"></div>
                                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <FaHeartbeat className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Physical Health</p>
                                        </div>
                                        <div className="text-center">
                                            <FaBrain className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Mental Wellness</p>
                                        </div>
                                        <div className="text-center">
                                            <FaLeaf className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Lifestyle Balance</p>
                                        </div>
                                        <div className="text-center">
                                            <FaUsers className="h-12 w-12 text-white mx-auto mb-3" />
                                            <p className="text-sm">Team Building</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 text-center">
                                        <div className="text-2xl font-bold">360° Wellness</div>
                                        <div className="text-green-100">Complete Care</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="learn-more" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Comprehensive Wellness Solutions
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Our wellness programs address all aspects of employee well-being, creating a culture of health and happiness in your organization.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className={`relative p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-xl transition-all duration-300 group`}>
                                <div className="absolute -top-4 left-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="pt-8">
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Programs Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Wellness Programs</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Diverse programs targeting every aspect of employee wellness
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className={`w-full h-2 bg-gradient-to-r ${program.color} rounded-full mb-6`}></div>
                                <h3 className="text-2xl font-bold mb-6">{program.category}</h3>
                                <ul className="space-y-3">
                                    {program.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center">
                                            <FaCheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Our wellness programs deliver measurable improvements
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {metrics.map((metric, index) => (
                            <div key={index} className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <metric.icon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <div className="text-4xl font-bold text-green-600 mb-2">{metric.value}</div>
                                <div className="text-gray-600 dark:text-gray-400 font-semibold">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">
                                Why Invest in Wellness?
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center">
                                        <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-lg">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-12 lg:mt-0">
                            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-teal-50'} border-2 border-green-200`}>
                                <div className="text-center">
                                    <FaLeaf className="h-16 w-16 text-green-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-4">ROI on Wellness</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        For every ₹1 invested in wellness programs, companies see an average return of ₹3.27 in reduced healthcare costs and improved productivity.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-3xl font-bold text-green-600">₹3.27</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">ROI Return</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-green-600">25%</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Cost Reduction</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Client Success Stories</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Hear from organizations that transformed their workplace with our wellness programs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                                <div className="mb-6">
                                    <FaStar className="h-8 w-8 text-yellow-400 mx-auto" />
                                </div>
                                <blockquote className="text-lg italic mb-6">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="text-center">
                                    <div className="font-semibold text-green-600">{testimonial.author}</div>
                                    <div className="text-gray-600 dark:text-gray-400">{testimonial.position}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Implementation Process</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Simple steps to launch your comprehensive wellness program
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { icon: FaUsers, title: 'Assessment', description: 'Evaluate current employee wellness needs' },
                            { icon: FaLeaf, title: 'Customize', description: 'Design programs based on your culture' },
                            { icon: FaMobile, title: 'Launch', description: 'Deploy digital platform and initiatives' },
                            { icon: FaChartLine, title: 'Monitor', description: 'Track engagement and measure results' }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white`}>
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Transform Your Workplace Wellness Today
                    </h2>
                    <p className="text-xl text-green-100 mb-8">
                        Create a healthier, happier, and more productive work environment
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book-demo"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-green-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
                        >
                            Book Demo
                        </Link>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <img className="h-8 w-auto mx-auto mb-4" src="/assets/logo/zoomconnect-logo-white.png" alt="ZoomConnect" />
                        <p className="text-gray-400">
                            Empowering healthier workplaces through comprehensive wellness solutions
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}