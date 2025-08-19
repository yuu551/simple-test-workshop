import React from 'react';
import { ContactFormWidget } from '@/widgets/contact-form-widget';
import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1>Feature-Sliced Design Demo</h1>
        <p>Modern Frontend Architecture with Storybook & Vitest</p>
      </header>
      
      <main className="home-page__main">
        <section className="home-page__section">
          <h2>お問い合わせ</h2>
          <ContactFormWidget />
        </section>
      </main>
      
      <footer className="home-page__footer">
        <p>&copy; 2024 FSD Demo. Built with React + TypeScript + Storybook</p>
      </footer>
    </div>
  );
};