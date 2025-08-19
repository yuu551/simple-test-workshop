/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = process.cwd();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@/app': path.resolve(dirname, './src/app'),
      '@/pages': path.resolve(dirname, './src/pages'),
      '@/widgets': path.resolve(dirname, './src/widgets'),
      '@/features': path.resolve(dirname, './src/features'),
      '@/entities': path.resolve(dirname, './src/entities'),
      '@/shared': path.resolve(dirname, './src/shared'),
    }
  },
  test: {
    projects: [
      // Unit tests project
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
          exclude: [
            'node_modules',
            'dist',
            '.idea',
            '.git',
            '.cache',
            'src/**/*.stories.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
          ],
        },
      },
      // Storybook tests project
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: '.storybook'
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium' }
            ]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
          // include は不要（.storybook/main.ts の stories 設定を利用）
        }
      }
    ]
  }
});