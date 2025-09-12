import '../css/app.css';
import './bootstrap';
import { createRoot } from 'react-dom/client';
import SuperadminLogin from './Pages/SuperadminLogin';

if (document.getElementById('superadmin-login')) {
    createRoot(document.getElementById('superadmin-login')).render(<SuperadminLogin />);
}
