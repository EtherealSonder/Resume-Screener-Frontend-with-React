import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/TEMP_ROUTER'; // temporary
import { AuthProvider } from './context/AuthContext';
import "@fontsource/dm-sans";
import './index.css';

document.body.className = "font-sans";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);
