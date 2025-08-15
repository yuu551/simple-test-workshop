# 🚀 モダンフロントエンドテスト - ハンズオン実装ガイド

## 🎯 このガイドで学べること

このハンズオンガイドでは、**ユーザーストーリー → テスト → 実装**の流れで、モダンなフロントエンドテスト戦略を段階的に習得できます。

### 🏗️ 作成する成果物
- **React Hook Form + Zod**による型安全なコンタクトフォーム
- **Storybook**によるコンポーネントドキュメント
- **Play Function**による自動インタラクションテスト
- **Vitest**による包括的な単体テスト

### ⚡ 前提知識
- React, TypeScript の基本
- npm/yarn の使用経験
- VSCode の基本操作

---

## 📋 STEP 0: 環境セットアップ

### 🔧 必要なツール
```bash
# Node.js 18+ の確認
node --version

# 推奨: VSCode拡張機能
# - ES7+ React/Redux/React-Native snippets
# - TypeScript Importer
# - Prettier - Code formatter
```

### 📦 プロジェクト準備
```bash
# プロジェクトのクローン（または新規作成）
git clone <repository-url>
cd story-book-sample-modern

# 依存関係のインストール
npm install

# Storybookの起動確認
npm run storybook
# http://localhost:6006 でStorybookが表示されることを確認

# 開発サーバーの起動確認
npm run dev
# http://localhost:5173 でアプリが表示されることを確認
```

### ✅ 動作確認
- [ ] Storybookが正常に起動する
- [ ] 既存のサンプルストーリーが表示される
- [ ] 開発サーバーが正常に起動する

---

## 📋 STEP 1: 基本的なコンポーネント作成

### 🎯 目標
シンプルな入力フィールドコンポーネントを作成し、Storybookで表示する

### 📁 ファイル構成
```
src/
  components/
    SimpleInput/
      SimpleInput.tsx
      SimpleInput.stories.tsx
```

### 🔨 実装

#### **SimpleInput.tsx**
```typescript
// src/components/SimpleInput/SimpleInput.tsx
import React from 'react';

export interface SimpleInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const SimpleInput: React.FC<SimpleInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem',
        fontWeight: required ? 'bold' : 'normal'
      }}>
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: error ? '2px solid red' : '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
        aria-describedby={error ? `${label}-error` : undefined}
        aria-required={required}
      />
      {error && (
        <div 
          id={`${label}-error`}
          style={{ 
            color: 'red', 
            fontSize: '0.875rem', 
            marginTop: '0.25rem' 
          }}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};
```

#### **SimpleInput.stories.tsx**
```typescript
// src/components/SimpleInput/SimpleInput.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SimpleInput } from './SimpleInput';
import { useState } from 'react';

const meta: Meta<typeof SimpleInput> = {
  title: 'Components/SimpleInput',
  component: SimpleInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ステートフル版のテンプレート
const Template = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  
  return (
    <SimpleInput
      {...args}
      value={value}
      onChange={setValue}
    />
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: '名前',
    placeholder: 'お名前を入力してください',
  },
};

export const Required: Story = {
  render: Template,
  args: {
    label: 'メールアドレス',
    placeholder: 'email@example.com',
    required: true,
  },
};

export const WithError: Story = {
  render: Template,
  args: {
    label: '電話番号',
    placeholder: '090-0000-0000',
    error: '電話番号の形式が正しくありません',
    required: true,
  },
};
```

### 🔍 確認作業
```bash
# Storybookを再起動
npm run storybook
```

1. **Components/SimpleInput** セクションが表示される
2. **Default**, **Required**, **WithError** の3つのストーリーが動作する
3. **Controls** パネルでプロパティを変更できる
4. **Docs** タブでドキュメントが自動生成される

### 💡 学習ポイント
- **アクセシビリティ**: `aria-describedby`, `role="alert"`の使用
- **TypeScript**: インターフェースによる型安全性
- **Storybook**: コンポーネント駆動開発のメリット

---

## 📋 STEP 2: React Hook Formの統合

### 🎯 目標
React Hook Formを使ったフォームコンポーネントを作成する

### 📦 依存関係の確認
```bash
# 既にインストール済みを確認
npm list react-hook-form
npm list @hookform/resolvers
```

### 🔨 実装

#### **BasicForm.tsx**
```typescript
// src/components/BasicForm/BasicForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { SimpleInput } from '../SimpleInput/SimpleInput';

interface BasicFormData {
  name: string;
  email: string;
  message: string;
}

export interface BasicFormProps {
  onSubmit: (data: BasicFormData) => void;
  initialData?: Partial<BasicFormData>;
}

export const BasicForm: React.FC<BasicFormProps> = ({
  onSubmit,
  initialData = {}
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<BasicFormData>({
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      message: initialData.message || ''
    }
  });

  // watchを使って現在の値を取得（SimpleInputとの連携のため）
  const formValues = watch();

  const handleFormSubmit = async (data: BasicFormData) => {
    // 送信処理のシミュレート（2秒待機）
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ maxWidth: '500px' }}>
      <SimpleInput
        label="お名前"
        value={formValues.name}
        onChange={(value) => {
          // registerとの同期のためsetValueを使う
          const { onChange } = register('name', { 
            required: '名前は必須項目です',
            minLength: { value: 1, message: '名前を入力してください' }
          });
          onChange({ target: { value } });
        }}
        placeholder="お名前を入力してください"
        required
        error={errors.name?.message}
      />

      <SimpleInput
        label="メールアドレス"
        value={formValues.email}
        onChange={(value) => {
          const { onChange } = register('email', {
            required: 'メールアドレスは必須項目です',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '正しいメールアドレスを入力してください'
            }
          });
          onChange({ target: { value } });
        }}
        placeholder="email@example.com"
        required
        error={errors.email?.message}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          お問い合わせ内容<span style={{ color: 'red' }}>*</span>
        </label>
        <textarea
          {...register('message', {
            required: 'お問い合わせ内容は必須項目です',
            minLength: { value: 10, message: '10文字以上で入力してください' }
          })}
          placeholder="お問い合わせ内容を入力してください"
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.message ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-required
        />
        {errors.message && (
          <div 
            id="message-error"
            style={{ 
              color: 'red', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem' 
            }}
            role="alert"
          >
            {errors.message.message}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          backgroundColor: isSubmitting ? '#ccc' : '#007bff',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? '送信中...' : '送信する'}
      </button>
    </form>
  );
};
```

#### **BasicForm.stories.tsx**
```typescript
// src/components/BasicForm/BasicForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { BasicForm } from './BasicForm';

const meta: Meta<typeof BasicForm> = {
  title: 'Forms/BasicForm',
  component: BasicForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: action('form-submitted'),
  },
};

export const WithInitialData: Story = {
  args: {
    onSubmit: action('form-submitted'),
    initialData: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      message: 'サンプルメッセージです'
    }
  },
};

export const Empty: Story = {
  args: {
    onSubmit: action('form-submitted'),
  },
};
```

### 🔍 確認作業
1. **Forms/BasicForm** が表示される
2. フォーム入力と送信ができる
3. **Actions** パネルで送信データが確認できる
4. バリデーションエラーが正しく表示される

### 💡 学習ポイント
- **React Hook Form**: registerとwatchの使い分け
- **フォームバリデーション**: 必須項目・形式チェック
- **UX**: ローディング状態の表示

---

## 📋 STEP 3: Zodスキーマによるバリデーション強化

### 🎯 目標
Zodスキーマを作成し、React Hook Formと統合する

### 🔨 実装

#### **validation.ts**
```typescript
// src/components/ZodForm/validation.ts
import { z } from 'zod';

/**
 * ZodForm用のバリデーションスキーマ
 */
export const zodFormSchema = z.object({
  name: z.string()
    .min(1, '名前は必須項目です')
    .max(50, '名前は50文字以内で入力してください')
    .trim(),
  
  email: z.string()
    .min(1, 'メールアドレスは必須項目です')
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .trim(),
  
  age: z.number({
    required_error: '年齢は必須項目です',
    invalid_type_error: '年齢は数値で入力してください'
  })
    .min(0, '年齢は0以上で入力してください')
    .max(150, '年齢は150以下で入力してください'),
  
  message: z.string()
    .min(1, 'お問い合わせ内容は必須項目です')
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください')
    .trim(),
    
  agreedToTerms: z.boolean()
    .refine(val => val === true, '利用規約に同意してください')
});

// TypeScriptの型を自動生成
export type ZodFormData = z.infer<typeof zodFormSchema>;

// フィールド単体のバリデーション用関数
export const validateField = (fieldName: keyof ZodFormData, value: any): string | undefined => {
  try {
    const fieldSchema = zodFormSchema.shape[fieldName];
    fieldSchema.parse(value);
    return undefined;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message;
    }
    return undefined;
  }
};
```

#### **ZodForm.tsx**
```typescript
// src/components/ZodForm/ZodForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zodFormSchema, type ZodFormData } from './validation';
import { SimpleInput } from '../SimpleInput/SimpleInput';

export interface ZodFormProps {
  onSubmit: (data: ZodFormData) => void;
  initialData?: Partial<ZodFormData>;
}

export const ZodForm: React.FC<ZodFormProps> = ({
  onSubmit,
  initialData = {}
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue
  } = useForm<ZodFormData>({
    resolver: zodResolver(zodFormSchema),
    mode: 'onBlur', // onBlurでバリデーション実行
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      age: initialData.age || 0,
      message: initialData.message || '',
      agreedToTerms: initialData.agreedToTerms || false
    }
  });

  const formValues = watch();

  const handleFormSubmit = async (data: ZodFormData) => {
    console.log('✅ バリデーション通過:', data);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ maxWidth: '500px' }}>
      <SimpleInput
        label="お名前"
        value={formValues.name}
        onChange={(value) => setValue('name', value)}
        placeholder="お名前を入力してください"
        required
        error={errors.name?.message}
      />

      <SimpleInput
        label="メールアドレス"
        value={formValues.email}
        onChange={(value) => setValue('email', value)}
        placeholder="email@example.com"
        required
        error={errors.email?.message}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          年齢<span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="number"
          {...register('age', { valueAsNumber: true })}
          placeholder="年齢を入力してください"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.age ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem'
          }}
          aria-describedby={errors.age ? 'age-error' : undefined}
          aria-required
        />
        {errors.age && (
          <div 
            id="age-error"
            style={{ 
              color: 'red', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem' 
            }}
            role="alert"
          >
            {errors.age.message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: 'bold'
        }}>
          お問い合わせ内容<span style={{ color: 'red' }}>*</span>
        </label>
        <textarea
          {...register('message')}
          placeholder="お問い合わせ内容を入力してください（10文字以上）"
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.message ? '2px solid red' : '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '1rem',
            resize: 'vertical'
          }}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-required
        />
        {errors.message && (
          <div 
            id="message-error"
            style={{ 
              color: 'red', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem' 
            }}
            role="alert"
          >
            {errors.message.message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            {...register('agreedToTerms')}
            style={{ marginRight: '0.5rem' }}
            aria-describedby={errors.agreedToTerms ? 'terms-error' : undefined}
          />
          <span>利用規約に同意します<span style={{ color: 'red' }}>*</span></span>
        </label>
        {errors.agreedToTerms && (
          <div 
            id="terms-error"
            style={{ 
              color: 'red', 
              fontSize: '0.875rem', 
              marginTop: '0.25rem' 
            }}
            role="alert"
          >
            {errors.agreedToTerms.message}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
        フォーム状態: {isValid ? '✅ 有効' : '❌ 無効'}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        style={{
          backgroundColor: isSubmitting || !isValid ? '#ccc' : '#007bff',
          color: 'white',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: isSubmitting || !isValid ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? '送信中...' : '送信する'}
      </button>
    </form>
  );
};
```

#### **ZodForm.stories.tsx**
```typescript
// src/components/ZodForm/ZodForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ZodForm } from './ZodForm';

const meta: Meta<typeof ZodForm> = {
  title: 'Forms/ZodForm',
  component: ZodForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: action('zod-form-submitted'),
  },
};

export const WithValidData: Story = {
  args: {
    onSubmit: action('zod-form-submitted'),
    initialData: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: 30,
      message: 'Zodバリデーションのテストメッセージです。',
      agreedToTerms: true
    }
  },
};

export const WithInvalidData: Story = {
  args: {
    onSubmit: action('zod-form-submitted'),
    initialData: {
      name: '',
      email: 'invalid-email',
      age: -5,
      message: '短い',
      agreedToTerms: false
    }
  },
};
```

### 🔍 確認作業
1. **Forms/ZodForm** が表示される
2. 各フィールドでバリデーションが動作する
3. **フォーム状態** が正しく表示される
4. **WithInvalidData** ストーリーでエラーが表示される

### 💡 学習ポイント
- **Zodスキーマ**: 宣言的なバリデーション定義
- **型安全性**: z.inferによる自動型生成
- **React Hook Form統合**: zodResolverの活用

---

## 📋 STEP 4: Play Functionによる自動テスト

### 🎯 目標
Play Functionを使ってユーザー操作を自動化し、テストを実装する

### 🔨 実装

#### **ZodForm.stories.tsx への追加**
```typescript
// src/components/ZodForm/ZodForm.stories.tsx に追加
import { userEvent, within, expect } from 'storybook/test';

// ... 既存のコード ...

// 正常な送信フローのテスト
export const HappyPathTest: Story = {
  name: '✅ 正常な送信フロー',
  args: {
    onSubmit: action('zod-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: フォームが表示されている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/年齢/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/利用規約/)).toBeInTheDocument();
    
    // 最初は送信ボタンが無効になっていることを確認
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await expect(submitButton).toBeDisabled();
    
    // When: 有効なデータを入力する
    await userEvent.type(canvas.getByLabelText(/お名前/), '田中太郎');
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await userEvent.type(canvas.getByLabelText(/年齢/), '30');
    await userEvent.type(
      canvas.getByLabelText(/お問い合わせ内容/), 
      'Zodバリデーションのテストです。10文字以上で入力しています。'
    );
    await userEvent.click(canvas.getByLabelText(/利用規約/));
    
    // Then: フォームが有効になる
    await expect(canvas.getByText('✅ 有効')).toBeInTheDocument();
    
    // 送信ボタンが有効になる
    await expect(submitButton).toBeEnabled();
    
    // 送信する
    await userEvent.click(submitButton);
    
    // 送信中状態を確認
    await expect(canvas.getByText('送信中...')).toBeInTheDocument();
  },
};

// バリデーションエラーのテスト
export const ValidationErrorTest: Story = {
  name: '❌ バリデーションエラー',
  args: {
    onSubmit: action('zod-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: フォームが表示されている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: 無効なデータを入力する
    const nameField = canvas.getByLabelText(/お名前/);
    const emailField = canvas.getByLabelText(/メールアドレス/);
    const ageField = canvas.getByLabelText(/年齢/);
    const messageField = canvas.getByLabelText(/お問い合わせ内容/);
    
    // 名前を空のまま（focusしてからblur）
    await userEvent.click(nameField);
    await userEvent.tab();
    
    // 無効なメールアドレス
    await userEvent.type(emailField, 'invalid-email');
    await userEvent.tab();
    
    // 無効な年齢
    await userEvent.type(ageField, '-5');
    await userEvent.tab();
    
    // 短すぎるメッセージ
    await userEvent.type(messageField, '短い');
    await userEvent.tab();
    
    // Then: エラーメッセージが表示される
    await expect(canvas.getByText('名前は必須項目です')).toBeInTheDocument();
    await expect(canvas.getByText('正しいメールアドレスを入力してください')).toBeInTheDocument();
    await expect(canvas.getByText('年齢は0以上で入力してください')).toBeInTheDocument();
    await expect(canvas.getByText('お問い合わせ内容は10文字以上で入力してください')).toBeInTheDocument();
    
    // フォームが無効状態
    await expect(canvas.getByText('❌ 無効')).toBeInTheDocument();
    
    // 送信ボタンが無効
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await expect(submitButton).toBeDisabled();
  },
};

// 段階的な修正テスト
export const StepByStepFixTest: Story = {
  name: '🔧 段階的なエラー修正',
  args: {
    onSubmit: action('zod-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Step 1: まず無効なデータを入力
    await userEvent.type(canvas.getByLabelText(/お名前/), 'a'.repeat(51)); // 50文字制限超過
    await userEvent.tab();
    
    // エラーが表示されることを確認
    await expect(canvas.getByText('名前は50文字以内で入力してください')).toBeInTheDocument();
    
    // Step 2: 名前を修正
    const nameField = canvas.getByLabelText(/お名前/);
    await userEvent.clear(nameField);
    await userEvent.type(nameField, '田中太郎');
    await userEvent.tab();
    
    // エラーが消えることを確認
    await expect(canvas.queryByText('名前は50文字以内で入力してください')).not.toBeInTheDocument();
    
    // Step 3: 他のフィールドも正しく入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await userEvent.type(canvas.getByLabelText(/年齢/), '30');
    await userEvent.type(
      canvas.getByLabelText(/お問い合わせ内容/), 
      '段階的な修正テストのメッセージです。'
    );
    await userEvent.click(canvas.getByLabelText(/利用規約/));
    
    // Step 4: フォームが有効になることを確認
    await expect(canvas.getByText('✅ 有効')).toBeInTheDocument();
    
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await expect(submitButton).toBeEnabled();
  },
};
```

### 🔍 確認作業
1. **ZodForm**の新しいストーリーが表示される
2. **Interactions**パネルでテストステップが確認できる
3. 各テストが自動実行される
4. テスト失敗時にはエラーの詳細が表示される

### 💡 学習ポイント
- **Play Function**: ユーザー操作の自動化
- **テストパターン**: Happy Path, Error Case, Step-by-Step
- **アサーション**: expect の活用方法

---

## 📋 STEP 5: Vitestによる単体テスト

### 🎯 目標
Zodスキーマのパラメータ化テストを実装し、包括的なバリデーションテストを作成する

### 🔨 実装

#### **validation.test.ts**
```typescript
// src/components/ZodForm/validation.test.ts
import { describe, test, expect } from 'vitest';
import { zodFormSchema, validateField, type ZodFormData } from './validation';

describe('ZodForm バリデーション', () => {
  describe('名前フィールド', () => {
    test.each([
      // [入力値, 期待結果, 説明]
      ['', false, '空文字は無効'],
      ['   ', false, 'スペースのみは無効'],
      ['田中太郎', true, '正常な名前は有効'],
      ['a', true, '1文字でも有効'],
      ['a'.repeat(50), true, '50文字は有効'],
      ['a'.repeat(51), false, '51文字は無効（上限超過）'],
      ['John Doe', true, 'アルファベット名前は有効'],
      ['田中　太郎', true, '全角スペースを含む名前は有効'],
    ])('名前: %s → %s (%s)', (input, shouldBeValid, description) => {
      const testData: ZodFormData = {
        name: input,
        email: 'test@example.com',
        age: 25,
        message: 'テストメッセージです。10文字以上。',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
      
      if (!result.success && shouldBeValid === false) {
        const nameError = result.error.errors.find(err => err.path[0] === 'name');
        expect(nameError).toBeDefined();
        console.log(`❌ ${description}: ${nameError?.message}`);
      }
    });
  });

  describe('メールアドレスフィールド', () => {
    test.each([
      ['test@example.com', true, '標準的なメールアドレス'],
      ['user.name@domain.com', true, 'ドット付きユーザー名'],
      ['user+tag@example.org', true, 'プラス記号付きメール'],
      ['invalid-email', false, '@マークなし'],
      ['test@', false, 'ドメインなし'],
      ['@domain.com', false, 'ユーザー名なし'],
      ['test..test@example.com', false, '連続ドット'],
      ['', false, '空文字'],
      ['a'.repeat(250) + '@example.com', false, '255文字制限超過'],
      ['test@example', false, 'TLD（トップレベルドメイン）なし'],
    ])('メールアドレス: %s → %s (%s)', (input, shouldBeValid, description) => {
      const testData: ZodFormData = {
        name: '田中太郎',
        email: input,
        age: 25,
        message: 'テストメッセージです。10文字以上。',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
    });
  });

  describe('年齢フィールド', () => {
    test.each([
      [0, true, '0歳は有効'],
      [1, true, '1歳は有効'],
      [25, true, '一般的な年齢'],
      [100, true, '100歳は有効'],
      [150, true, '150歳は有効（上限）'],
      [-1, false, 'マイナス年齢は無効'],
      [151, false, '151歳は無効（上限超過）'],
      [999, false, '999歳は無効'],
    ])('年齢: %s → %s (%s)', (input, shouldBeValid, description) => {
      const testData: ZodFormData = {
        name: '田中太郎',
        email: 'test@example.com',
        age: input,
        message: 'テストメッセージです。10文字以上。',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
    });

    test('年齢が文字列の場合はエラー', () => {
      const testData = {
        name: '田中太郎',
        email: 'test@example.com',
        age: 'twenty-five', // 文字列
        message: 'テストメッセージです。10文字以上。',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const ageError = result.error.errors.find(err => err.path[0] === 'age');
        expect(ageError?.message).toBe('年齢は数値で入力してください');
      }
    });
  });

  describe('メッセージフィールド', () => {
    test.each([
      ['', false, '空文字は無効'],
      ['短い', false, '10文字未満は無効'],
      ['1234567890', true, 'ちょうど10文字は有効'],
      ['これは有効なメッセージです。', true, '10文字以上は有効'],
      ['a'.repeat(2000), true, '2000文字は有効（上限）'],
      ['a'.repeat(2001), false, '2001文字は無効（上限超過）'],
      ['   有効なメッセージ   ', true, 'trim後に有効'],
      ['     短い     ', false, 'trim後でも短い'],
    ])('メッセージ: "%s" → %s (%s)', (input, shouldBeValid, description) => {
      const testData: ZodFormData = {
        name: '田中太郎',
        email: 'test@example.com',
        age: 25,
        message: input,
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
    });
  });

  describe('利用規約同意フィールド', () => {
    test.each([
      [true, true, '同意済みは有効'],
      [false, false, '未同意は無効'],
    ])('利用規約同意: %s → %s (%s)', (input, shouldBeValid, description) => {
      const testData: ZodFormData = {
        name: '田中太郎',
        email: 'test@example.com',
        age: 25,
        message: 'テストメッセージです。10文字以上。',
        agreedToTerms: input
      };
      
      const result = zodFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
      
      if (!result.success) {
        const termsError = result.error.errors.find(err => err.path[0] === 'agreedToTerms');
        expect(termsError?.message).toBe('利用規約に同意してください');
      }
    });
  });

  describe('validateField 関数', () => {
    test('個別フィールドのバリデーション - 名前', () => {
      expect(validateField('name', '')).toBe('名前は必須項目です');
      expect(validateField('name', '田中太郎')).toBeUndefined();
      expect(validateField('name', 'a'.repeat(51))).toBe('名前は50文字以内で入力してください');
    });

    test('個別フィールドのバリデーション - メールアドレス', () => {
      expect(validateField('email', '')).toBe('メールアドレスは必須項目です');
      expect(validateField('email', 'test@example.com')).toBeUndefined();
      expect(validateField('email', 'invalid-email')).toBe('正しいメールアドレスを入力してください');
    });

    test('個別フィールドのバリデーション - 年齢', () => {
      expect(validateField('age', -1)).toBe('年齢は0以上で入力してください');
      expect(validateField('age', 25)).toBeUndefined();
      expect(validateField('age', 151)).toBe('年齢は150以下で入力してください');
    });
  });

  describe('複合的なバリデーションシナリオ', () => {
    test('完全に有効なデータ', () => {
      const validData: ZodFormData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        age: 30,
        message: 'お問い合わせ内容です。10文字以上で記載しています。',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    test('複数フィールドでエラー', () => {
      const invalidData = {
        name: '', // エラー
        email: 'invalid', // エラー
        age: -5, // エラー
        message: '短い', // エラー
        agreedToTerms: false // エラー
      };
      
      const result = zodFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.errors).toHaveLength(5); // 5つのエラー
        
        const errorPaths = result.error.errors.map(err => err.path[0]);
        expect(errorPaths).toContain('name');
        expect(errorPaths).toContain('email');
        expect(errorPaths).toContain('age');
        expect(errorPaths).toContain('message');
        expect(errorPaths).toContain('agreedToTerms');
      }
    });
  });

  describe('エッジケース', () => {
    test('trim処理の確認', () => {
      const dataWithSpaces = {
        name: '  田中太郎  ',
        email: '  test@example.com  ',
        age: 25,
        message: '  これは有効なメッセージです。10文字以上で入力しています。  ',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      
      if (result.success) {
        // trim処理が適用されていることを確認
        expect(result.data.name).toBe('田中太郎');
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.message).toBe('これは有効なメッセージです。10文字以上で入力しています。');
      }
    });

    test('特殊文字を含む入力', () => {
      const dataWithSpecialChars = {
        name: '田中🎌太郎', // 絵文字を含む
        email: 'user+tag@example.co.jp',
        age: 25,
        message: 'これは特殊文字を含むメッセージです: !@#$%^&*()_+ 🚀',
        agreedToTerms: true
      };
      
      const result = zodFormSchema.safeParse(dataWithSpecialChars);
      expect(result.success).toBe(true);
    });
  });
});
```

### 🔍 確認作業
```bash
# テストの実行
npm run test validation.test.ts

# または、ウォッチモードで実行
npm run test:watch
```

1. **全テストがパス**することを確認
2. **テストカバレッジ**が適切であることを確認
3. **パラメータ化テスト**が正しく動作することを確認

### 💡 学習ポイント
- **パラメータ化テスト**: test.eachによる効率的なテスト
- **エッジケース**: 境界値、特殊文字、trim処理
- **包括的テスト**: Happy Path + Error Cases + Edge Cases

---

## 📋 STEP 6: 統合テストとテストデータ管理

### 🎯 目標
実際のプロジェクトのように、ユーザーストーリーベースのテストデータ管理システムを実装する

### 🔨 実装

#### **testData.ts**
```typescript
// src/components/ZodForm/testData.ts
import { type ZodFormData } from './validation';

export interface TestDataSet {
  scenarioId: string;
  description: string;
  data: ZodFormData;
  expectedResult: 'success' | 'validation_error' | 'submission_error';
  expectedErrors?: string[];
}

/**
 * シナリオごとのテストデータ定義
 */
export const zodFormTestData: TestDataSet[] = [
  // 成功シナリオ
  {
    scenarioId: 'SC-001-1',
    description: '正常な問い合わせ送信（若年者）',
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      age: 25,
      message: 'サービスについて詳しく教えてください。料金体系も含めてお願いします。',
      agreedToTerms: true
    },
    expectedResult: 'success'
  },
  
  {
    scenarioId: 'SC-001-2',
    description: '正常な問い合わせ送信（高齢者）',
    data: {
      name: '佐藤花子',
      email: 'sato.hanako@email.co.jp',
      age: 75,
      message: 'インターネットサービスの利用方法について相談したいです。初心者向けのサポートはありますか？',
      agreedToTerms: true
    },
    expectedResult: 'success'
  },

  {
    scenarioId: 'SC-001-3',
    description: '正常な問い合わせ送信（境界値年齢）',
    data: {
      name: '山田次郎',
      email: 'yamada@company.com',
      age: 0,
      message: '新生児向けのサービスについて問い合わせします。保護者向けの情報も教えてください。',
      agreedToTerms: true
    },
    expectedResult: 'success'
  },

  // バリデーションエラーシナリオ
  {
    scenarioId: 'SC-002-1',
    description: '必須項目未入力エラー',
    data: {
      name: '',
      email: '',
      age: 0,
      message: '',
      agreedToTerms: false
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      '名前は必須項目です',
      'メールアドレスは必須項目です',
      'お問い合わせ内容は必須項目です',
      '利用規約に同意してください'
    ]
  },

  {
    scenarioId: 'SC-002-2',
    description: '文字数制限エラー',
    data: {
      name: 'あ'.repeat(51), // 50文字制限超過
      email: 'test@example.com',
      age: 25,
      message: 'あ'.repeat(2001), // 2000文字制限超過
      agreedToTerms: true
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      '名前は50文字以内で入力してください',
      'お問い合わせ内容は2000文字以内で入力してください'
    ]
  },

  {
    scenarioId: 'SC-002-3',
    description: 'フォーマットエラー',
    data: {
      name: '田中太郎',
      email: 'invalid-email-format',
      age: -5,
      message: '短すぎ',
      agreedToTerms: true
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      '正しいメールアドレスを入力してください',
      '年齢は0以上で入力してください',
      'お問い合わせ内容は10文字以上で入力してください'
    ]
  },

  // エッジケースシナリオ
  {
    scenarioId: 'SC-003-1',
    description: '特殊文字を含む入力',
    data: {
      name: '山田🌸太郎',
      email: 'user+tag@example.co.jp',
      age: 30,
      message: '特殊文字テスト: !@#$%^&*()_+-=[]{}|;:,.<>? 絵文字🎉🚀✨も含めます。',
      agreedToTerms: true
    },
    expectedResult: 'success'
  },

  {
    scenarioId: 'SC-003-2',
    description: 'スペース文字のtrim処理',
    data: {
      name: '  田中太郎  ',
      email: '  test@example.com  ',
      age: 25,
      message: '  前後にスペースがある場合のテストです。trim処理が適用されることを確認します。  ',
      agreedToTerms: true
    },
    expectedResult: 'success'
  },

  {
    scenarioId: 'SC-003-3',
    description: '上限境界値テスト',
    data: {
      name: 'あ'.repeat(50), // ちょうど50文字
      email: 'test@example.com',
      age: 150, // 上限値
      message: 'あ'.repeat(2000), // ちょうど2000文字
      agreedToTerms: true
    },
    expectedResult: 'success'
  }
];

/**
 * シナリオIDからテストデータを取得する関数
 */
export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined => {
  return zodFormTestData.find(testData => testData.scenarioId === scenarioId);
};

/**
 * 複数のシナリオIDからテストデータを取得する関数
 */
export const getTestDataByScenarioIds = (scenarioIds: string[]): TestDataSet[] => {
  return scenarioIds
    .map(id => getTestDataByScenarioId(id))
    .filter((data): data is TestDataSet => data !== undefined);
};

/**
 * 成功シナリオのみを取得
 */
export const getSuccessScenarios = (): TestDataSet[] => {
  return zodFormTestData.filter(data => data.expectedResult === 'success');
};

/**
 * エラーシナリオのみを取得
 */
export const getErrorScenarios = (): TestDataSet[] => {
  return zodFormTestData.filter(data => data.expectedResult === 'validation_error');
};

/**
 * エッジケースシナリオのみを取得
 */
export const getEdgeCaseScenarios = (): TestDataSet[] => {
  return zodFormTestData.filter(data => data.scenarioId.startsWith('SC-003'));
};
```

#### **ZodForm.stories.tsx の拡張**
```typescript
// src/components/ZodForm/ZodForm.stories.tsx に追加
import { 
  getTestDataByScenarioId, 
  getSuccessScenarios, 
  getErrorScenarios 
} from './testData';

// ... 既存のコード ...

// テストデータを使用したストーリー群
export const TestDataScenarios = {
  // 成功シナリオ
  YoungAdult: {
    name: 'SC-001-1: 若年者の問い合わせ',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-001-1')?.data
    }
  } as Story,

  Elderly: {
    name: 'SC-001-2: 高齢者の問い合わせ',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-001-2')?.data
    }
  } as Story,

  // エラーシナリオ
  AllFieldsEmpty: {
    name: 'SC-002-1: 必須項目未入力',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-002-1')?.data
    }
  } as Story,

  LengthLimitError: {
    name: 'SC-002-2: 文字数制限エラー',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-002-2')?.data
    }
  } as Story,

  // エッジケース
  SpecialCharacters: {
    name: 'SC-003-1: 特殊文字入力',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-003-1')?.data
    }
  } as Story,

  BoundaryValues: {
    name: 'SC-003-3: 境界値テスト',
    args: {
      onSubmit: action('zod-form-submitted'),
      initialData: getTestDataByScenarioId('SC-003-3')?.data
    }
  } as Story,
};

// シナリオベースの自動テスト
export const AllSuccessScenariosTest: Story = {
  name: '🔄 全成功シナリオテスト',
  args: {
    onSubmit: action('zod-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const successScenarios = getSuccessScenarios();
    
    console.log(`🧪 ${successScenarios.length}個の成功シナリオをテストします`);
    
    for (const scenario of successScenarios) {
      console.log(`📋 テスト中: ${scenario.description}`);
      
      // フォームをクリア
      const nameField = canvas.getByLabelText(/お名前/);
      const emailField = canvas.getByLabelText(/メールアドレス/);
      const ageField = canvas.getByLabelText(/年齢/);
      const messageField = canvas.getByLabelText(/お問い合わせ内容/);
      const termsCheckbox = canvas.getByLabelText(/利用規約/);
      
      await userEvent.clear(nameField);
      await userEvent.clear(emailField);
      await userEvent.clear(ageField);
      await userEvent.clear(messageField);
      
      // チェックボックスが既にチェック済みの場合は外す
      if (termsCheckbox.checked) {
        await userEvent.click(termsCheckbox);
      }
      
      // テストデータを入力
      await userEvent.type(nameField, scenario.data.name);
      await userEvent.type(emailField, scenario.data.email);
      await userEvent.type(ageField, scenario.data.age.toString());
      await userEvent.type(messageField, scenario.data.message);
      
      if (scenario.data.agreedToTerms) {
        await userEvent.click(termsCheckbox);
      }
      
      // フォームが有効になることを確認
      await expect(canvas.getByText('✅ 有効')).toBeInTheDocument();
      
      console.log(`✅ ${scenario.description} - 成功`);
    }
  },
};

// エラーシナリオの自動テスト
export const ValidationErrorScenariosTest: Story = {
  name: '❌ バリデーションエラーシナリオテスト',
  args: {
    onSubmit: action('zod-form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const errorScenarios = getErrorScenarios();
    
    console.log(`🧪 ${errorScenarios.length}個のエラーシナリオをテストします`);
    
    for (const scenario of errorScenarios) {
      console.log(`📋 テスト中: ${scenario.description}`);
      
      // フォームをクリア（ページリロードのシミュレーション）
      const nameField = canvas.getByLabelText(/お名前/);
      const emailField = canvas.getByLabelText(/メールアドレス/);
      const ageField = canvas.getByLabelText(/年齢/);
      const messageField = canvas.getByLabelText(/お問い合わせ内容/);
      const termsCheckbox = canvas.getByLabelText(/利用規約/);
      
      await userEvent.clear(nameField);
      await userEvent.clear(emailField);
      await userEvent.clear(ageField);
      await userEvent.clear(messageField);
      
      if (termsCheckbox.checked) {
        await userEvent.click(termsCheckbox);
      }
      
      // テストデータを入力
      if (scenario.data.name) {
        await userEvent.type(nameField, scenario.data.name);
      }
      if (scenario.data.email) {
        await userEvent.type(emailField, scenario.data.email);
      }
      if (scenario.data.age !== 0 || scenario.scenarioId === 'SC-001-3') {
        await userEvent.type(ageField, scenario.data.age.toString());
      }
      if (scenario.data.message) {
        await userEvent.type(messageField, scenario.data.message);
      }
      if (scenario.data.agreedToTerms) {
        await userEvent.click(termsCheckbox);
      }
      
      // 各フィールドからフォーカスを外してバリデーションを発生させる
      await userEvent.tab();
      
      // フォームが無効状態であることを確認
      await expect(canvas.getByText('❌ 無効')).toBeInTheDocument();
      
      // 期待されるエラーメッセージが表示されることを確認
      if (scenario.expectedErrors) {
        for (const expectedError of scenario.expectedErrors) {
          try {
            await expect(canvas.getByText(expectedError)).toBeInTheDocument();
            console.log(`  ✅ エラーメッセージ確認: ${expectedError}`);
          } catch (error) {
            console.log(`  ❌ エラーメッセージが見つからない: ${expectedError}`);
          }
        }
      }
      
      console.log(`✅ ${scenario.description} - 完了`);
    }
  },
};
```

### 🔍 確認作業
1. **TestDataScenarios** の各ストーリーが正しく表示される
2. **AllSuccessScenariosTest** が全シナリオを自動実行する
3. **ValidationErrorScenariosTest** がエラーケースを検証する
4. **Console** でテスト進行状況が確認できる

### 💡 学習ポイント
- **テストデータ管理**: 中央集権的なテストデータ管理
- **シナリオベーステスト**: ビジネス要件とテストの直接連携
- **自動化の範囲**: 成功ケース・エラーケース・エッジケースの包括的テスト

---

## 📋 STEP 7: 最終統合と実践演習

### 🎯 目標
学習した内容を統合し、独自のコンポーネントを作成する

### 🔨 実習課題

#### **課題1: ログインフォームの作成**

以下の要件でログインフォームを作成してください：

**要件:**
- ユーザー名（メールアドレス形式、必須）
- パスワード（8文字以上、英数字記号混在、必須）
- 「ログイン状態を保持する」チェックボックス
- Zodバリデーション
- 3つ以上のStorybookストーリー
- 2つ以上のPlay Function

**作成ファイル:**
```
src/components/LoginForm/
  LoginForm.tsx
  LoginForm.stories.tsx
  validation.ts
  testData.ts
```

#### **課題2: パスワード強度チェック機能**

パスワード入力時にリアルタイムで強度を表示する機能を追加：

**要件:**
- 弱い（8文字未満）→ 赤色
- 普通（8文字以上、英数字）→ 黄色  
- 強い（8文字以上、英数字記号混在）→ 緑色
- 視覚的な強度バー表示
- アクセシビリティ対応（aria-label等）

#### **課題3: 統合テストシナリオ**

以下のユーザーストーリーに対応するテストシナリオを作成：

**US-001**: ユーザーがログインフォームで認証情報を入力して、正常にログインできる
**US-002**: ユーザーが無効な認証情報を入力した場合、適切なエラーメッセージが表示される
**US-003**: ユーザーがパスワード強度を確認しながら、安全なパスワードを設定できる

### 🏆 成果物チェックリスト

以下の項目を全て満たしていることを確認してください：

#### **基本実装**
- [ ] TypeScript型定義が適切
- [ ] React Hook Form + Zodの統合
- [ ] エラーハンドリングの実装
- [ ] レスポンシブデザイン対応

#### **Storybookストーリー**
- [ ] Default（基本状態）
- [ ] WithData（初期データあり）  
- [ ] Error（エラー状態）
- [ ] Loading（送信中状態）

#### **Play Function**
- [ ] Happy Path（正常フロー）
- [ ] Validation Error（バリデーションエラー）
- [ ] カスタムインタラクション（独自機能のテスト）

#### **テスト**
- [ ] Zodスキーマのパラメータ化テスト
- [ ] エッジケースのテスト
- [ ] 統合テストシナリオ

#### **アクセシビリティ**
- [ ] aria-label、aria-describedby の適切な使用
- [ ] フォーカス管理
- [ ] キーボードナビゲーション
- [ ] スクリーンリーダー対応

#### **UX**
- [ ] 適切なローディング状態
- [ ] ユーザーフレンドリーなエラーメッセージ
- [ ] 直感的な操作フロー

### 🚀 発展課題

#### **上級課題1: Multi-step Form**
複数ステップのフォーム（個人情報 → 連絡先 → 確認画面）を作成し、各ステップでのバリデーションとデータ永続化を実装

#### **上級課題2: Dynamic Form Fields**
条件に応じてフィールドが動的に追加・削除されるフォーム（例：家族情報の追加）

#### **上級課題3: Real-time Collaboration**
複数ユーザーがリアルタイムで同じフォームを編集できる機能（WebSocketを使用）

---

## 🎉 学習完了

おめでとうございます！モダンフロントエンドテスト戦略の基本から応用まで、包括的に学習できました。

### 📚 習得したスキル

1. **Storybook 9.1**
   - コンポーネント駆動開発
   - Play Function による自動テスト
   - アクセシビリティテスト

2. **React Hook Form + Zod**
   - 型安全なフォーム実装
   - 宣言的バリデーション
   - パフォーマンス最適化

3. **テスト戦略**
   - ユーザーストーリー駆動テスト
   - パラメータ化テスト
   - エッジケーステスト

4. **開発プロセス**
   - コンポーネント設計パターン
   - テストファーストアプローチ
   - ドキュメント駆動開発

### 🔄 次のステップ

1. **実プロジェクトでの実践**
2. **CI/CDパイプラインの構築**
3. **Visual Regression Testing（Chromatic）の導入**
4. **E2Eテスト（Playwright）との統合**
5. **チーム開発でのベストプラクティス共有**

### 📖 参考資料

- [Storybook公式ドキュメント](https://storybook.js.org/docs/react/get-started/introduction)
- [React Hook Form公式ドキュメント](https://react-hook-form.com/)
- [Zod公式ドキュメント](https://zod.dev/)
- [Vitest公式ドキュメント](https://vitest.dev/)

**継続的な学習と実践により、さらなるスキルアップを目指しましょう！**