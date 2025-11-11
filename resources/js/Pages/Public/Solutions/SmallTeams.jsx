import React from 'react';
import { Link } from '@inertiajs/react';
import { FaShieldAlt, FaUsers, FaChartLine, FaHeartbeat, FaClock } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function SmallTeams() {
    const { darkMode } = useTheme();

    const benefits = [
        {
            icon: FaShieldAlt,
            title: 'Flexible Coverage',
            description: 'Customizable insurance plans that grow with your team'
        },
        {
            icon: FaUsers,
            title: 'Easy Administration',
            description: 'Simple dashboard to manage all employee benefits'
        },
        {
            icon: FaChartLine,
            title: 'Cost-Effective',
            description: 'Competitive rates designed for small businesses'
        },
        {
            icon: FaHeartbeat,
            title: 'Wellness Programs',
            description: 'Integrated wellness solutions for team health'
        },
        {
            icon: FaClock,
            title: 'Quick Setup',
            description: 'Get started in days, not weeks or months'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* ...rest of the code... */}
        </div>
    );
}
