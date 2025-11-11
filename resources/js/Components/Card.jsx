import React from 'react';
import { useTheme } from '../Context/ThemeContext';
import { useColorInversion } from '../Hooks/useColorInversion';

export function Card({ children, className = '', ...props }) {
    const { darkMode } = useTheme();
    const baseClasses = `rounded-2xl p-6 shadow-lg flex flex-col ${darkMode ? 'bg-black text-white' : 'bg-white text-[#22223b]'} transition-colors duration-200`;
    const finalClasses = `${baseClasses} ${className}`;

    return (
        <div className={finalClasses} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    const baseClasses = "font-semibold text-lg mb-4";
    const finalClasses = useColorInversion(`${baseClasses} ${className}`);

    return (
        <div className={finalClasses}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    const finalClasses = useColorInversion(className);

    return (
        <div className={finalClasses}>
            {children}
        </div>
    );
}
