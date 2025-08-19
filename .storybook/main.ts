import type { StorybookConfig } from '@storybook/react-vite';
import * as path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(process.cwd(), './src'),
        '@/app': path.resolve(process.cwd(), './src/app'),
        '@/pages': path.resolve(process.cwd(), './src/pages'),
        '@/widgets': path.resolve(process.cwd(), './src/widgets'),
        '@/features': path.resolve(process.cwd(), './src/features'),
        '@/entities': path.resolve(process.cwd(), './src/entities'),
        '@/shared': path.resolve(process.cwd(), './src/shared'),
      }
    };
    return config;
  }
};
export default config;