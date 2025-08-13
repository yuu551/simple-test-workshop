import { z } from 'zod';

/**
 * ContactForm用のZodスキーマ定義
 * React Hook Form + Zodの統合による型安全なバリデーション
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, '名前は必須項目です')
    .max(100, '名前は100文字以内で入力してください')
    .trim(),
  
  email: z.string()
    .min(1, 'メールアドレスは必須項目です')
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .trim(),
  
  subject: z.string()
    .min(1, '件名は必須項目です')
    .max(200, '件名は200文字以内で入力してください')
    .trim(),
  
  message: z.string()
    .min(1, 'お問い合わせ内容は必須項目です')
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください')
    .trim(),
  
  privacyPolicy: z.boolean()
    .refine(val => val === true, 'プライバシーポリシーに同意してください')
    .optional()
    .default(false)
});

/**
 * Zodスキーマから型を推論
 * React Hook Formで使用するフォームデータの型
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * バリデーションエラーの型定義
 * React Hook Formのエラーハンドリングに対応
 */
export interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  privacyPolicy?: string;
}

/**
 * 従来のvalidateForm関数（後方互換性のため）
 * 新しい実装ではReact Hook FormのzodResolverを使用することを推奨
 */
export const validateForm = (data: Partial<ContactFormData>): ValidationErrors => {
  try {
    contactFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof ValidationErrors;
        if (path) {
          errors[path] = err.message;
        }
      });
      return errors;
    }
    return {};
  }
};

/**
 * ContactForm用のバリデーション関数
 * @param data バリデーション対象のデータ
 * @returns バリデーション結果とエラーメッセージ
 */
export const validateContactForm = async (data: Partial<ContactFormData>): Promise<{
  success: boolean;
  errors: ValidationErrors;
  data?: ContactFormData;
}> => {
  try {
    const validatedData = contactFormSchema.parse(data);
    return {
      success: true,
      errors: {},
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof ValidationErrors;
        if (path) {
          errors[path] = err.message;
        }
      });
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: { name: '予期しないエラーが発生しました' }
    };
  }
};

/**
 * 部分的なフィールドのバリデーション
 * リアルタイムバリデーション用
 */
export const validateField = (fieldName: keyof ContactFormData, value: any): string | undefined => {
  try {
    const fieldSchema = contactFormSchema.shape[fieldName];
    fieldSchema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return undefined;
  }
};