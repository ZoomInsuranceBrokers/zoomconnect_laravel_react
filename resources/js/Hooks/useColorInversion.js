import { useTheme } from '../Context/ThemeContext';

export function useColorInversion(defaultClass) {
    const { darkMode } = useTheme();

    const invertColors = (className) => {
        // Split the classes into an array
        const classes = className.split(' ');

        // Process each class
        const processedClasses = classes.map(cls => {
            // Handle text colors
            if (cls.startsWith('text-')) {
                if (darkMode) {
                    if (cls === 'text-black') return 'text-white';
                    if (cls === 'text-white') return 'text-black';
                    // Handle gray variations
                    if (cls.startsWith('text-gray-')) {
                        const num = parseInt(cls.split('-')[2]);
                        if (num) {
                            return `text-gray-${900 - num}`;
                        }
                    }
                }
            }
            // Handle background colors
            if (cls.startsWith('bg-')) {
                if (darkMode) {
                    if (cls === 'bg-black') return 'bg-white';
                    if (cls === 'bg-white') return 'bg-black';
                    // Handle gray variations
                    if (cls.startsWith('bg-gray-')) {
                        const num = parseInt(cls.split('-')[2]);
                        if (num) {
                            return `bg-gray-${900 - num}`;
                        }
                    }
                }
            }
            // Handle border colors
            if (cls.startsWith('border-')) {
                if (darkMode) {
                    if (cls === 'border-black') return 'border-white';
                    if (cls === 'border-white') return 'border-black';
                    // Handle gray variations
                    if (cls.startsWith('border-gray-')) {
                        const num = parseInt(cls.split('-')[2]);
                        if (num) {
                            return `border-gray-${900 - num}`;
                        }
                    }
                }
            }
            return cls;
        });

        return processedClasses.join(' ');
    };

    return invertColors(defaultClass);
}
