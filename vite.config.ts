import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Absolute base so nested routes (/matematicas, /ingles…) resolve assets correctly.
// GitHub Pages builds set BASE_PATH to '/<repo>/' (see .github/workflows/deploy.yml).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // three/fiber/drei stay in lazy chunks (hero threads, optional GLB stage).
        manualChunks: { gsap: ['gsap'] },
      },
    },
  },
});
