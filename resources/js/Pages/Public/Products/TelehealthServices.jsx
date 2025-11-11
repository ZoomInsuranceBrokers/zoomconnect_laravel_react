import React from 'react';
import { Link } from '@inertiajs/react';
import { FaVideo, FaStethoscope, FaClock, FaGlobe, FaCheckCircle, FaMobileAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function TelehealthServices() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaVideo,
            title: '24/7 Virtual Consultations',
            description: 'Access healthcare professionals anytime, anywhere through video calls'
        },
        {
            icon: FaStethoscope,
            title: 'Multi-Specialty Care',
            description: 'Connect with general physicians, specialists, and mental health experts'
        },
        {
            icon: FaClock,
            title: 'Instant Access',
            description: 'Get medical consultation within minutes, no appointment needed'
        },
        {
            icon: FaGlobe,
            title: 'Global Coverage',
            description: 'Healthcare support available worldwide for your traveling employees'
        }
    ];

    const services = [
        {
            category: 'Primary Care',
            icon: FaUserMd,
            color: 'from-blue-500 to-cyan-500',
            services: [
                'General Health Consultations',
                'Preventive Care Guidance',
                'Chronic Disease Management',
                'Health Risk Assessments',
                'Medication Management',
                'Health Screening Advice'
            ]
        },
        {
            category: 'Specialist Care',
            icon: FaStethoscope,
            color: 'from-purple-500 to-pink-500',
            services: [
                'Cardiology Consultations',
                'Dermatology Sessions',
                'Endocrinology Care',
                'Gastroenterology Advice',
                'Orthopedic Consultations',
                'Gynecology Services'
            ]
        },
        {
            category: 'Mental Health',
            icon: FaShieldAlt,
            color: 'from-green-500 to-teal-500',
            services: [
                'Counseling Sessions',
                'Stress Management',
                'Anxiety & Depression Care',
                'Work-Life Balance Coaching',
                'Crisis Intervention',
                'Behavioral Therapy'
            ]
        }
    ];

    const benefits = [
        'Reduce healthcare costs by 30%',
        'Minimize employee downtime',
        'Improve health outcomes',
        'Enhance employee satisfaction',
        'Provide convenient access to care',
        'Support remote workforce',
        'Enable early intervention',
        'Reduce emergency room visits'
    ];

    const platforms = [
        {
            device: 'Mobile App',
            features: ['Video consultations', 'Appointment booking', 'Medical records', 'Prescription delivery'],
            available: 'iOS & Android'
        },
        {
            device: 'Web Portal',
            features: ['Desktop consultations', 'Health dashboard', 'Report downloads', 'Family management'],
            available: 'All browsers'
        },
        {
            device: 'Phone Support',
            features: ['Voice consultations', '24/7 helpline', 'Emergency support', 'Medical guidance'],
            available: 'Toll-free number'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* ...rest of the code... */}
        </div>
    );
}
