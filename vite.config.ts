import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Tailwind v4 + React plugins. Without this file Vite never processes
// `@import "tailwindcss"` and the whole UI renders unstyled.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // AI Studio / Cloud Run manage HMR themselves
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
