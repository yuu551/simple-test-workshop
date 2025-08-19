import React from 'react';
import { HomePage } from '@/pages/home';
import './styles/global.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <HomePage />
    </div>
  );
};