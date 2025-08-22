/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@/app': path.resolve('./src/app'),
      '@/pages': path.resolve('./src/pages'),
      '@/widgets': path.resolve('./src/widgets'),
      '@/features': path.resolve('./src/features'),
      '@/entities': path.resolve('./src/entities'),
      '@/shared': path.resolve('./src/shared'),
    }
  }
});