import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Safely polyfills process.env so the browser doesn't crash on load
    // It maps Vercel's environment variables directly into the client build
    'process.env': {
      API_KEY: process.env.API_KEY || ''
    }
  }
});
