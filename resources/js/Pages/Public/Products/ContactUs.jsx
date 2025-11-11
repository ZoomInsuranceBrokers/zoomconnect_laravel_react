import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaPaperPlane, FaUser, FaBuilding, FaUsers } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

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
            subtitle: "We'll respond within 24 hours"
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
            {/* ...rest of the code... */}
        </div>
    );
}
