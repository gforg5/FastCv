import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Safely polyfills process.env so the browser doesn't crash on load
    // Using JSON.stringify ensures it compiles into valid strings in JS
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});