import React from 'react';
import { Link } from '@inertiajs/react';
import { FaHeart, FaUsers, FaUmbrella, FaHandHoldingHeart, FaCheckCircle, FaShieldAlt, FaClock, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function GroupTermLife() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaHeart,
            title: 'Life Protection',
            description: 'Comprehensive life insurance coverage for your entire team'
        },
        {
            icon: FaUsers,
            title: 'Family Security',
            description: "Financial protection for employees' families and dependents"
        },
        {
            icon: FaUmbrella,
            title: 'Flexible Coverage',
            description: 'Customizable coverage amounts based on employee needs'
        },
        {
            icon: FaHandHoldingHeart,
            title: 'Compassionate Claims',
            description: 'Quick and sensitive claim processing during difficult times'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* ...rest of the code... */}
        </div>
    );
}
