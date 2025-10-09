import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'Figtree', ...defaultTheme.fontFamily.sans],
                montserrat: ['Montserrat', 'sans-serif'],
                dmserif: ['"DM Serif Display"', 'serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#934790',
                    dark: '#6A0066',
                },
                accent: {
                    DEFAULT: '#5B6FFF', // FinSet blue
                },
                gray: {
                    50: '#F8F9FB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                green: {
                    500: '#4ADE80',
                },
                red: {
                    500: '#F87171',
                },
            },
        },
    },

    plugins: [forms],
};
