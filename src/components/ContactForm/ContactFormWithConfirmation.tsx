import React, { useState } from 'react';
import { ContactForm, ContactFormData } from './ContactForm';
import './ContactForm.css';

interface ContactFormWithConfirmationProps {
  onSubmit?: (data: ContactFormData) => void;
  enableAutoSave?: boolean;
}

export const ContactFormWithConfirmation: React.FC<ContactFormWithConfirmationProps> = ({
  onSubmit,
  enableAutoSave = true
}) => {
  const [mode, setMode] = useState<'edit' | 'confirm' | 'complete'>('edit');
  const [formData, setFormData] = useState<ContactFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (data: ContactFormData) => {
    setFormData(data);
    setMode('confirm');
  };

  const handleBack = () => {
    setMode('edit');
  };

  const handleConfirm = async () => {
    if (!formData) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      setMode('complete');
      
      setTimeout(() => {
        setMode('edit');
        setFormData(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === 'complete') {
    return (
      <div className="confirmation-container">
        <div className="success-message" role="alert">
          お問い合わせを受け付けました
        </div>
      </div>
    );
  }

  if (mode === 'confirm' && formData) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-content">
          <h2>入力内容の確認</h2>
          <div className="confirmation-item">
            <span className="confirmation-label">名前</span>
            <span className="confirmation-value">{formData.name}</span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">メールアドレス</span>
            <span className="confirmation-value">{formData.email}</span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">件名</span>
            <span className="confirmation-value">{formData.subject}</span>
          </div>
          <div className="confirmation-item">
            <span className="confirmation-label">本文</span>
            <span className="confirmation-value">{formData.message}</span>
          </div>
        </div>
        <div className="confirmation-buttons">
          <button 
            className="back-button" 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            戻る
          </button>
          <button 
            className="confirm-button" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : '送信'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ContactFormWithEdit
      onSubmit={handleFormSubmit}
      enableAutoSave={enableAutoSave}
      initialData={formData}
    />
  );
};

interface ContactFormWithEditProps {
  onSubmit: (data: ContactFormData) => void;
  enableAutoSave?: boolean;
  initialData: ContactFormData | null;
}

const ContactFormWithEdit: React.FC<ContactFormWithEditProps> = ({
  onSubmit,
  enableAutoSave,
  initialData
}) => {
  const [formData, setFormData] = useState<ContactFormData>(
    initialData || {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '名前は必須項目です';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須項目です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須項目です';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = '本文は必須項目です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="contact-form-container">
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name-confirm">
            名前 <span className="required">*</span>
          </label>
          <input
            id="name-confirm"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-confirm-error' : undefined}
          />
          {errors.name && (
            <span id="name-confirm-error" className="error-message" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email-confirm">
            メールアドレス <span className="required">*</span>
          </label>
          <input
            id="email-confirm"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-confirm-error' : undefined}
          />
          {errors.email && (
            <span id="email-confirm-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject-confirm">
            件名 <span className="required">*</span>
          </label>
          <input
            id="subject-confirm"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-confirm-error' : undefined}
          />
          {errors.subject && (
            <span id="subject-confirm-error" className="error-message" role="alert">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message-confirm">
            本文 <span className="required">*</span>
          </label>
          <textarea
            id="message-confirm"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-confirm-error' : undefined}
          />
          {errors.message && (
            <span id="message-confirm-error" className="error-message" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        <button type="submit" className="submit-button">
          確認
        </button>
      </form>
    </div>
  );
};