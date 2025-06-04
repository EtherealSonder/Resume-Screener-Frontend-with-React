import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
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
