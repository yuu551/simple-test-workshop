import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from './validation';
import './ContactForm.css';

export type { ContactFormData };

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  enableAutoSave?: boolean;
}

const STORAGE_KEY = 'contact-form-draft';

export const ContactForm: React.FC<ContactFormProps> = ({ 
  onSubmit,
  enableAutoSave = true 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      privacyPolicy: false
    }
  });

  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const watchedValues = watch();

  // 自動保存機能
  useEffect(() => {
    if (enableAutoSave) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // 1時間以内のデータのみ復元
          if (parsed.timestamp && Date.now() - parsed.timestamp < 60 * 60 * 1000) {
            Object.entries(parsed.data).forEach(([key, value]) => {
              setValue(key as keyof ContactFormData, value);
            });
          }
        } catch (e) {
          console.error('Failed to load saved form data:', e);
        }
      }
    }
  }, [enableAutoSave, setValue]);

  // フォームデータの自動保存
  useEffect(() => {
    if (enableAutoSave && !submitSuccess) {
      const timeoutId = setTimeout(() => {
        const hasData = Object.values(watchedValues).some(value => 
          typeof value === 'string' ? value.trim() : Boolean(value)
        );
        
        if (hasData) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            data: watchedValues,
            timestamp: Date.now()
          }));
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, enableAutoSave, submitSuccess]);

  const onSubmitHandler = async (data: ContactFormData) => {
    try {
      // 送信処理のシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      setSubmitSuccess(true);
      reset();
      
      // 自動保存されたデータをクリア
      if (enableAutoSave) {
        localStorage.removeItem(STORAGE_KEY);
      }
      
      // 3秒後に成功メッセージを非表示
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <div className="contact-form-container">
      {submitSuccess && (
        <div className="success-message" role="alert">
          お問い合わせを受け付けました
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmitHandler)} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">
            お名前 <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span id="name-error" className="error-message" role="alert">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            メールアドレス <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            件名 <span className="required">*</span>
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <span id="subject-error" className="error-message" role="alert">
              {errors.subject.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">
            お問い合わせ内容 <span className="required">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.message && (
            <span id="message-error" className="error-message" role="alert">
              {errors.message.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              {...register('privacyPolicy')}
              aria-invalid={!!errors.privacyPolicy}
              aria-describedby={errors.privacyPolicy ? 'privacy-error' : undefined}
              disabled={isSubmitting}
            />
            <span className="required">*</span> プライバシーポリシーに同意する
          </label>
          {errors.privacyPolicy && (
            <span id="privacy-error" className="error-message" role="alert">
              {errors.privacyPolicy.message}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </form>
    </div>
  );
};