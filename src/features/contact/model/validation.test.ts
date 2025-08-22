import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  validateForm,
  validateContactForm,
  validateField,
  type ContactFormData
} from './validation';

// Zodスキーマのテスト
describe('contactFormSchema', () => {
  const validFormData: ContactFormData = {
    name: '田中太郎',
    email: 'tanaka@example.com',
    subject: 'テスト件名',
    message: 'これは10文字以上のテストメッセージです。',
    privacyPolicy: true
  };

  it('有効なデータをパースできる', () => {
    const result = contactFormSchema.parse(validFormData);
    expect(result).toEqual(validFormData);
  });

  it('名前が空文字の場合にエラーを返す', () => {
    const invalidData = { ...validFormData, name: '' };
    expect(() => contactFormSchema.parse(invalidData)).toThrow();
  });

  it('名前が100文字を超える場合にエラーを返す', () => {
    const longName = 'a'.repeat(101);
    const invalidData = { ...validFormData, name: longName };
    expect(() => contactFormSchema.parse(invalidData)).toThrow();
  });

  it('メールアドレスが無効な形式の場合にエラーを返す', () => {
    const invalidData = { ...validFormData, email: 'invalid-email' };
    expect(() => contactFormSchema.parse(invalidData)).toThrow();
  });

  it('メッセージが10文字未満の場合にエラーを返す', () => {
    const invalidData = { ...validFormData, message: '短い' };
    expect(() => contactFormSchema.parse(invalidData)).toThrow();
  });

  it('プライバシーポリシーがfalseの場合にエラーを返す', () => {
    const invalidData = { ...validFormData, privacyPolicy: false };
    expect(() => contactFormSchema.parse(invalidData)).toThrow();
  });
});

describe('validateForm', () => {
  const validFormData: ContactFormData = {
    name: '田中太郎',
    email: 'tanaka@example.com',
    subject: 'テスト件名',
    message: 'これは10文字以上のテストメッセージです。',
    privacyPolicy: true
  };

  it('全ての項目が正しく入力されている場合はエラーが返されない', () => {
    const errors = validateForm(validFormData);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  describe('名前のバリデーション', () => {
    it('名前が空文字の場合はエラーが返される', () => {
      const data = { ...validFormData, name: '' };
      const errors = validateForm(data);
      expect(errors.name).toBe('お名前は必須です');
    });

    it('名前が空白のみの場合はエラーが返される', () => {
      const data = { ...validFormData, name: '   ' };
      const errors = validateForm(data);
      expect(errors.name).toBe('お名前は必須です');
    });

    it('名前が正しく入力されている場合はエラーが返されない', () => {
      const data = { ...validFormData, name: '山田花子' };
      const errors = validateForm(data);
      expect(errors.name).toBeUndefined();
    });
  });

  describe('メールアドレスのバリデーション', () => {
    it('メールアドレスが空文字の場合は必須エラーが返される', () => {
      const data = { ...validFormData, email: '' };
      const errors = validateForm(data);
      expect(errors.email).toBe('メールアドレスは必須です');
    });

    it('メールアドレスが空白のみの場合は必須エラーが返される', () => {
      const data = { ...validFormData, email: '   ' };
      const errors = validateForm(data);
      expect(errors.email).toBe('メールアドレスは必須です');
    });

    it('メールアドレスの形式が不正な場合は形式エラーが返される', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test..test@example.com',
        'test@example',
        'test @example.com'
      ];

      invalidEmails.forEach(email => {
        const data = { ...validFormData, email };
        const errors = validateForm(data);
        expect(errors.email).toBe('有効なメールアドレスを入力してください');
      });
    });

    it('メールアドレスの形式が正しい場合はエラーが返されない', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.jp',
        'user123@sub.example.org'
      ];

      validEmails.forEach(email => {
        const data = { ...validFormData, email };
        const errors = validateForm(data);
        expect(errors.email).toBeUndefined();
      });
    });
  });

  describe('件名のバリデーション', () => {
    it('件名が空文字の場合はエラーが返される', () => {
      const data = { ...validFormData, subject: '' };
      const errors = validateForm(data);
      expect(errors.subject).toBe('件名は必須です');
    });

    it('件名が空白のみの場合はエラーが返される', () => {
      const data = { ...validFormData, subject: '   ' };
      const errors = validateForm(data);
      expect(errors.subject).toBe('件名は必須です');
    });

    it('件名が正しく入力されている場合はエラーが返されない', () => {
      const data = { ...validFormData, subject: 'お問い合わせ' };
      const errors = validateForm(data);
      expect(errors.subject).toBeUndefined();
    });
  });

  describe('本文のバリデーション', () => {
    it('本文が空文字の場合はエラーが返される', () => {
      const data = { ...validFormData, message: '' };
      const errors = validateForm(data);
      expect(errors.message).toBe('お問い合わせ内容は必須です');
    });

    it('本文が空白のみの場合はエラーが返される', () => {
      const data = { ...validFormData, message: '   ' };
      const errors = validateForm(data);
      expect(errors.message).toBe('お問い合わせ内容は必須です');
    });

    it('本文が10文字未満の場合はエラーが返される', () => {
      const data = { ...validFormData, message: '短すぎる' };
      const errors = validateForm(data);
      expect(errors.message).toBe('お問い合わせ内容は10文字以上で入力してください');
    });

    it('本文が10文字以上の場合はエラーが返されない', () => {
      const data = { ...validFormData, message: 'これは10文字以上のメッセージです' };
      const errors = validateForm(data);
      expect(errors.message).toBeUndefined();
    });

    it('本文が2000文字を超える場合はエラーが返される', () => {
      const longMessage = 'a'.repeat(2001);
      const data = { ...validFormData, message: longMessage };
      const errors = validateForm(data);
      expect(errors.message).toBe('お問い合わせ内容は2000文字以内で入力してください');
    });
  });

  describe('プライバシーポリシーのバリデーション', () => {
    it('プライバシーポリシーに同意していない場合はエラーが返される', () => {
      const data = { ...validFormData, privacyPolicy: false };
      const errors = validateForm(data);
      expect(errors.privacyPolicy).toBe('プライバシーポリシーへの同意が必要です');
    });

    it('プライバシーポリシーに同意している場合はエラーが返されない', () => {
      const data = { ...validFormData, privacyPolicy: true };
      const errors = validateForm(data);
      expect(errors.privacyPolicy).toBeUndefined();
    });
  });

  describe('複数項目のバリデーション', () => {
    it('複数の項目でエラーがある場合は全てのエラーが返される', () => {
      const data: ContactFormData = {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: '',
        privacyPolicy: false
      };
      
      const errors = validateForm(data);
      
      expect(errors.name).toBe('お名前は必須です');
      expect(errors.email).toBe('有効なメールアドレスを入力してください');
      expect(errors.subject).toBe('件名は必須です');
      expect(errors.message).toBe('お問い合わせ内容は必須です');
      expect(errors.privacyPolicy).toBe('プライバシーポリシーへの同意が必要です');
    });

    it('一部の項目にエラーがある場合は該当項目のみエラーが返される', () => {
      const data = {
        ...validFormData,
        name: '',
        email: 'invalid-email'
      };
      
      const errors = validateForm(data);
      
      expect(errors.name).toBe('お名前は必須です');
      expect(errors.email).toBe('有効なメールアドレスを入力してください');
      expect(errors.subject).toBeUndefined();
      expect(errors.message).toBeUndefined();
      expect(errors.privacyPolicy).toBeUndefined();
    });
  });
});

// 新しい関数のテスト
describe('validateContactForm', () => {
  const validFormData: ContactFormData = {
    name: '田中太郎',
    email: 'tanaka@example.com',
    subject: 'テスト件名',
    message: 'これは10文字以上のテストメッセージです。',
    privacyPolicy: true
  };

  it('有効なデータの場合にsuccess: trueを返す', async () => {
    const result = await validateContactForm(validFormData);
    expect(result.success).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.data).toEqual(validFormData);
  });

  it('無効なデータの場合にsuccess: falseとエラーを返す', async () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: '短い',
      privacyPolicy: false
    };

    const result = await validateContactForm(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('subject');
    expect(result.errors).toHaveProperty('message');
    expect(result.errors).toHaveProperty('privacyPolicy');
    expect(result.data).toBeUndefined();
  });
});

describe('validateField', () => {
  describe('name field', () => {
    it('有効な名前を検証する', () => {
      const result = validateField('name', '田中太郎');
      expect(result).toBeUndefined();
    });

    it('空の名前でエラーメッセージを返す', () => {
      const result = validateField('name', '');
      expect(result).toBe('お名前は必須です');
    });

    it('長すぎる名前でエラーメッセージを返す', () => {
      const longName = 'a'.repeat(101);
      const result = validateField('name', longName);
      expect(result).toBe('名前は100文字以内で入力してください');
    });
  });

  describe('email field', () => {
    it('有効なメールアドレスを検証する', () => {
      const result = validateField('email', 'test@example.com');
      expect(result).toBeUndefined();
    });

    it('空のメールアドレスでエラーメッセージを返す', () => {
      const result = validateField('email', '');
      expect(result).toBe('メールアドレスは必須です');
    });

    it('無効な形式のメールアドレスでエラーメッセージを返す', () => {
      const result = validateField('email', 'invalid-email');
      expect(result).toBe('有効なメールアドレスを入力してください');
    });
  });

  describe('message field', () => {
    it('有効なメッセージを検証する', () => {
      const result = validateField('message', 'これは10文字以上のメッセージです');
      expect(result).toBeUndefined();
    });

    it('短すぎるメッセージでエラーメッセージを返す', () => {
      const result = validateField('message', '短い');
      expect(result).toBe('お問い合わせ内容は10文字以上で入力してください');
    });
  });

  describe('privacyPolicy field', () => {
    it('有効なプライバシーポリシー同意を検証する', () => {
      const result = validateField('privacyPolicy', true);
      expect(result).toBeUndefined();
    });

    it('プライバシーポリシー未同意でエラーメッセージを返す', () => {
      const result = validateField('privacyPolicy', false);
      expect(result).toBe('プライバシーポリシーへの同意が必要です');
    });
  });
});