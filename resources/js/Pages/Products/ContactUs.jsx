import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaPaperPlane, FaUser, FaBuilding, FaUsers } from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';

export default function ContactUs() {
    const { darkMode } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        employees: '',
        interest: '',
        message: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const contactInfo = [
        {
            icon: FaPhone,
            title: 'Phone',
            details: '+91 9999 123 456',
            subtitle: 'Mon-Fri from 8am to 6pm'
        },
        {
            icon: FaEnvelope,
            title: 'Email',
            details: 'info@zoomconnect.co.in',
            subtitle: 'We\'ll respond within 24 hours'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Office',
            details: 'Mumbai, Maharashtra',
            subtitle: 'Visit our headquarters'
        },
        {
            icon: FaClock,
            title: 'Business Hours',
            details: 'Mon-Fri: 9am-6pm',
            subtitle: 'Saturday: 9am-2pm'
        }
    ];

    const experts = [
        {
            name: 'Dr. Rajesh Kumar',
            role: 'Chief Medical Officer',
            specialization: 'Group Health Insurance',
            experience: '15+ years',
            image: '/assets/images/expert-1.jpg'
        },
        {
            name: 'Priya Sharma',
            role: 'Wellness Program Director',
            specialization: 'Employee Wellness',
            experience: '12+ years',
            image: '/assets/images/expert-2.jpg'
        },
        {
            name: 'Amit Patel',
            role: 'Insurance Consultant',
            specialization: 'Risk Assessment',
            experience: '18+ years',
            image: '/assets/images/expert-3.jpg'
        }
    ];

    const faqs = [
        {
            question: 'What is the minimum number of employees required for group insurance?',
            answer: 'We can provide group insurance coverage for companies with as few as 5 employees, with customized plans based on your specific needs.'
        },
        {
            question: 'How quickly can we get coverage for our employees?',
            answer: 'Once all documentation is complete, we can activate coverage within 24-48 hours for most group insurance plans.'
        },
        {
            question: 'Do you provide coverage for remote employees?',
            answer: 'Yes, our insurance plans cover employees regardless of their work location, including remote workers and those working from different cities.'
        },
        {
            question: 'What wellness programs are included?',
            answer: 'Our wellness programs include health screenings, fitness programs, mental health support, nutrition counseling, and preventive care initiatives.'
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
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                            Get in Touch with Our Experts
                        </h1>
                        <p className="text-xl leading-8 mb-8 max-w-3xl mx-auto">
                            Ready to transform your employee benefits? Our insurance experts are here to help you find the perfect solution for your organization.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#contact-form"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-purple-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                            >
                                Start Conversation
                            </a>
                            <a
                                href="tel:+919999123456"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                            >
                                <FaPhone className="mr-2" />
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Multiple Ways to Connect</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Choose the communication method that works best for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-xl transition-all duration-300 text-center`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-6">
                                    <info.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                                <p className="text-lg font-medium text-purple-600 mb-2">{info.details}</p>
                                <p className="text-gray-600 dark:text-gray-400">{info.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form and Map */}
            <div id="contact-form" className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Company Name *</label>
                                        <div className="relative">
                                            <FaBuilding className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                required
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Number of Employees</label>
                                        <div className="relative">
                                            <FaUsers className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <select
                                                name="employees"
                                                value={formData.employees}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                            >
                                                <option value="">Select range</option>
                                                <option value="5-25">5-25 employees</option>
                                                <option value="26-100">26-100 employees</option>
                                                <option value="101-500">101-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Interested Product</label>
                                        <select
                                            name="interest"
                                            value={formData.interest}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                        >
                                            <option value="">Select product</option>
                                            <option value="group-medical">Group Medical Cover</option>
                                            <option value="group-accident">Group Accident Cover</option>
                                            <option value="group-life">Group Term Life</option>
                                            <option value="wellness">Wellness Programs</option>
                                            <option value="telehealth">Telehealth Services</option>
                                            <option value="all">All Products</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                                        placeholder="Tell us about your requirements..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                                >
                                    <FaPaperPlane className="mr-2" />
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Map and Additional Info */}
                        <div className="mt-12 lg:mt-0">
                            <h2 className="text-3xl font-bold mb-8">Visit Our Office</h2>
                            <div className={`h-64 rounded-2xl overflow-hidden mb-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                {/* Placeholder for map */}
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <FaMapMarkerAlt className="h-12 w-12 mx-auto mb-4" />
                                        <p>Interactive Map</p>
                                        <p className="text-sm">Mumbai, Maharashtra</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                                        <FaLinkedin className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                                        <FaTwitter className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors">
                                        <FaFacebook className="h-6 w-6" />
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                                        <FaInstagram className="h-6 w-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meet Our Experts */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Meet Our Experts</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Talk to our experienced professionals who understand your business needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {experts.map((expert, index) => (
                            <div key={index} className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 text-center`}>
                                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                                    {expert.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{expert.name}</h3>
                                <p className="text-purple-600 font-medium mb-2">{expert.role}</p>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">{expert.specialization}</p>
                                <p className="text-sm text-gray-500">{expert.experience}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Quick answers to common questions about our services
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
                                <h3 className="text-lg font-semibold mb-3 text-purple-600">{faq.question}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-purple-100 mb-8">
                        Let's discuss how we can help transform your employee benefits program
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book-demo"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-purple-600 font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
                        >
                            Schedule Demo
                        </Link>
                        <a
                            href="tel:+919999123456"
                            className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
                        >
                            <FaPhone className="mr-2" />
                            Call Now
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <img className="h-8 w-auto mx-auto mb-4" src="/assets/logo/zoomconnect-logo-white.png" alt="ZoomConnect" />
                        <p className="text-gray-400">
                            Your trusted partner for comprehensive employee benefits and insurance solutions
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}