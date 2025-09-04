import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/main.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    options: {
      storySort: {
        order: ['Components'],
      },
    },
  },
};

export default preview;