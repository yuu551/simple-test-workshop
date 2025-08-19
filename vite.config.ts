/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@/app': path.resolve(process.cwd(), './src/app'),
      '@/pages': path.resolve(process.cwd(), './src/pages'),
      '@/widgets': path.resolve(process.cwd(), './src/widgets'),
      '@/features': path.resolve(process.cwd(), './src/features'),
      '@/entities': path.resolve(process.cwd(), './src/entities'),
      '@/shared': path.resolve(process.cwd(), './src/shared'),
    }
  }
});