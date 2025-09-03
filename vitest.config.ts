/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default defineConfig({
  plugins: [react()],
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
        }
      }
    ]
  }
});