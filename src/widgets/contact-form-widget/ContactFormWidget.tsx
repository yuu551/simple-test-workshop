import React from 'react';
import { ContactForm } from '@/features/contact';
import './ContactFormWidget.css';

export const ContactFormWidget: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // In a real app, this would call an API
  };

  return (
    <div className="contact-form-widget">
      <div className="contact-form-widget__container">
        <ContactForm 
          onSubmit={handleSubmit}
          enableAutoSave={true}
        />
      </div>
    </div>
  );
};