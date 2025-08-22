import React from 'react';
import { Provider } from './providers';
import { App } from './App';

export const Root: React.FC = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};