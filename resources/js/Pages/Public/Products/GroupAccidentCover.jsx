import React from 'react';
import { Link } from '@inertiajs/react';
import { FaShieldAlt, FaAmbulance, FaHeartbeat, FaPhone, FaCheckCircle, FaUsers, FaClock, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../../Context/ThemeContext';

export default function GroupAccidentCover() {
    const { darkMode } = useTheme();

    const features = [
        {
            icon: FaShieldAlt,
            title: '24/7 Protection',
            description: 'Round-the-clock coverage for accidents anywhere, anytime'
        },
        {
            icon: FaAmbulance,
            title: 'Emergency Support',
            description: 'Immediate medical assistance and ambulance services'
        },
        {
            icon: FaHeartbeat,
            title: 'Disability Benefits',
            description: 'Compensation for temporary or permanent disability'
        },
        {
            icon: FaPhone,
            title: 'Instant Claims',
            description: 'Quick claim processing through mobile app'
        }
    ];

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* ...rest of the code... */}
        </div>
    );
}
