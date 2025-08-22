import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '../model/validation';
import { useContactFormStore } from '../model/store';
import { Button } from '@/shared/ui';
import { Box, VStack, Input, Textarea, Text } from '@chakra-ui/react';
import { Field } from '@/shared/ui/field/field';
import { Alert } from '@/shared/ui/alert/alert';

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
    <Box maxW="600px" mx="auto" p={6}>
      {submitSuccess && (
        <Alert status="success" mb={4} colorPalette="green">
          <Text role="alert" color="form.success">お問い合わせを受け付けました</Text>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <VStack gap={4} align="stretch">
          <Field
            label={<Text color="contact.label">お名前</Text>}
            required
            invalid={!!errors.name}
            errorText={errors.name?.message}
          >
            <Input
              id="name"
              type="text"
              {...register('name')}
              aria-label="お名前"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={isSubmitting}
            />
          </Field>

          <Field
            label={<Text color="contact.label">メールアドレス</Text>}
            required
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              {...register('email')}
              aria-label="メールアドレス"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
          </Field>

          <Field
            label={<Text color="contact.label">件名</Text>}
            required
            invalid={!!errors.subject}
            errorText={errors.subject?.message}
          >
            <Input
              id="subject"
              type="text"
              {...register('subject')}
              aria-label="件名"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              disabled={isSubmitting}
            />
          </Field>

          <Field
            label={<Text color="contact.label">お問い合わせ内容</Text>}
            required
            invalid={!!errors.message}
            errorText={errors.message?.message}
          >
            <Textarea
              id="message"
              rows={5}
              {...register('message')}
              aria-label="お問い合わせ内容"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              disabled={isSubmitting}
            />
          </Field>

          <Box>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                {...register('privacyPolicy')}
                aria-invalid={!!errors.privacyPolicy}
                aria-describedby={errors.privacyPolicy ? 'privacy-error' : undefined}
                disabled={isSubmitting}
                className="custom-checkbox"
              />
              <Text as="span" color="contact.label">
                <Text as="span" color="contact.required">*</Text> プライバシーポリシーに同意する
              </Text>
            </label>
            {errors.privacyPolicy && (
              <Text id="privacy-error" color="form.error" fontSize="sm" mt={1} role="alert">
                {errors.privacyPolicy.message}
              </Text>
            )}
          </Box>

          <Button 
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? '送信中...' : '送信する'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};