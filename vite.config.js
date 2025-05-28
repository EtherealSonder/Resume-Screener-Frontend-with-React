import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/analytics': 'http://localhost:5000',
            '/candidates': 'http://localhost:5000',
            '/statistics': 'http://localhost:5000',
            '/jobs': 'http://localhost:5000',
            // Add other backend endpoints as needed
        },
    },
});
