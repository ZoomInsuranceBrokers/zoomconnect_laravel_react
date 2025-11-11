import React from 'react';
import { Link } from '@inertiajs/react';
import { FaLeaf, FaHeartbeat, FaBrain, FaUsers, FaCheckCircle, FaMobile, FaChartLine, FaStar } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

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

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* ...rest of the code... */}
        </div>
    );
}
