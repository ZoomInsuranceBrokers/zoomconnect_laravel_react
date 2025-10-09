import '../css/app.css';
import './bootstrap';
import "@fontsource/dm-serif-display";

import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './Context/ThemeContext';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Keep the old component mounting for backward compatibility
import SuperadminLogin from './Components/SuperAdminLogin';

if (document.getElementById('superadmin-login')) {
    createRoot(document.getElementById('superadmin-login')).render(<SuperadminLogin />);
}
