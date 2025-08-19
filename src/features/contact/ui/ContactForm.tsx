import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '../model/validation';
import { useContactFormStore } from '../model/store';
import { Button } from '@/shared/ui';
import './ContactForm.css';

export type { ContactFormData };

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  enableAutoSave?: boolean;
}

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

  const { 
    submitSuccess, 
    setSubmitSuccess, 
    savedData, 
    setSavedData, 
    clearSavedData 
  } = useContactFormStore();
  
  const watchedValues = watch();

  // 自動保存機能
  useEffect(() => {
    if (enableAutoSave && savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key as keyof ContactFormData, value);
      });
    }
  }, [enableAutoSave, savedData, setValue]);

  // フォームデータの自動保存
  useEffect(() => {
    if (enableAutoSave && !submitSuccess) {
      const timeoutId = setTimeout(() => {
        const hasData = Object.values(watchedValues).some(value => 
          typeof value === 'string' ? value.trim() : Boolean(value)
        );
        
        if (hasData) {
          setSavedData(watchedValues);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, enableAutoSave, submitSuccess, setSavedData]);

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
        clearSavedData();
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

        <Button 
          type="submit"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </Button>
      </form>
    </div>
  );
};