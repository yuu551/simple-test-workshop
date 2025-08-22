# 🚀 モダンフロントエンド開発 - Chakra UI + Feature-Sliced Design ハンズオン

## 🎯 このガイドで学べること

このハンズオンガイドでは、**ユーザーストーリー → シナリオ → テスト → 実装**の実践的な開発フローを、Chakra UIとFeature-Sliced Designを使って段階的に習得できます。

### 🏗️ 作成する成果物
- **Chakra UI v3**のラッパーコンポーネント
- **Feature-Sliced Design**による階層的アーキテクチャ
- **React Hook Form + Zod**による型安全なフォーム
- **シナリオベース**のStorybookストーリー
- **Play Function**によるBDD形式の自動テスト

### 📋 実装するユーザーストーリー
1. **US-001**: 問い合わせフォームから連絡を送信する
2. **US-003**: 入力途中の内容を保持する
3. **US-002**: 入力内容を確認してから送信する（演習）

### ⚡ 前提知識
- React, TypeScript の基本
- npm/yarn の使用経験
- VSCode の基本操作
- BDD（振る舞い駆動開発）の基礎概念

---

## 📋 STEP 0: 環境セットアップとFeature-Sliced Design理解

### 🔧 必要なツール
```bash
# Node.js 20+ の確認（20.19+ 推奨）
node --version

# 推奨: VSCode拡張機能
# - ES7+ React/Redux/React-Native snippets
# - TypeScript Importer
# - Prettier - Code formatter
# - Chakra UI Snippets
```

### 📦 プロジェクト準備
```bash
# プロジェクトのクローン（または新規作成）
git clone <repository-url>
cd story-book-sample-modern

# 依存関係のインストール
npm install

# Playwrightのセットアップ（初回のみ）
npx playwright install --with-deps

# Storybookの起動確認
npm run storybook
# http://localhost:6006 でStorybookが表示されることを確認

# 開発サーバーの起動確認
npm run dev
# http://localhost:5173 でアプリが表示されることを確認
```

### 🏗️ Feature-Sliced Design構造の理解
```
src/
├── app/           # アプリケーション層（最上位）
│   ├── App.tsx    # ルートコンポーネント
│   └── providers/ # グローバルプロバイダー
│       └── provider.tsx  # Chakra UIプロバイダー
├── pages/         # ページ層
├── widgets/       # ウィジェット層（複合UI）
├── features/      # 機能層（ユーザーアクション）
├── entities/      # エンティティ層（ビジネスエンティティ）
└── shared/        # 共有層（最下位）
    ├── ui/        # 共有UIコンポーネント
    └── theme/     # テーマ設定
        └── semantic-tokens.ts  # セマンティックトークン
```

**重要な原則:**
- **依存関係は下位層のみ**: 上位層は下位層を使用できるが、逆は禁止
- **shared層**: どこからでも使用可能な汎用コンポーネント
- **features層**: ユーザーのアクションを実装
- **widgets層**: 複数のfeatureを統合した複雑なUI

### 🎨 Chakra UIプロバイダーの確認
```typescript
// src/app/providers/provider.tsx
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"
import { semanticTokens } from "@/shared/theme/semantic-tokens"

const customSystem = createSystem(defaultConfig, {
  semanticTokens,  // セマンティックトークンの適用
  // その他のカスタマイズ
})

export function Provider(props) {
  return (
    <ChakraProvider value={customSystem}>
      {props.children}
    </ChakraProvider>
  )
}
```

### ✅ 動作確認
- [ ] Storybookが正常に起動する
- [ ] Chakra UIコンポーネントが表示される
- [ ] Feature-Sliced Design構造を理解した
- [ ] セマンティックトークンファイルを確認した

---

## 📋 STEP 1: shared/ui層 - Chakra UIラッパー作成

### 🎯 目標
Chakra UIコンポーネントのラッパーを作成し、プロジェクト独自のAPIを定義する

### 📁 ファイル構成
```
src/shared/
  ui/
    Button/
      Button.tsx
      Button.stories.tsx
      index.ts
    Field/
      Field.tsx
      Field.stories.tsx
      index.ts
  theme/
    semantic-tokens.ts
```

### 🔨 実装

#### **Button.tsx - Chakra UIラッパー**
```typescript
// src/shared/ui/Button/Button.tsx
import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type ChakraButtonProps = ComponentProps<typeof ChakraButton>;

export interface ButtonProps {
  /** ボタンのバリアント */
  variant?: 'primary' | 'secondary' | 'danger';
  /** ボタンのサイズ */
  size?: 'small' | 'medium' | 'large';
  /** ボタンのテキスト */
  children: React.ReactNode;
  /** 無効状態 */
  disabled?: boolean;
  /** ローディング状態 */
  loading?: boolean;
  /** クリックハンドラー */
  onClick?: () => void;
  /** フルサイズ */
  fullWidth?: boolean;
  /** タイプ */
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  loading = false,
  onClick,
  fullWidth = false,
  type = 'button',
  ...props
}) => {
  // プロジェクトのpropsをChakra UIのpropsに変換
  const getChakraProps = (): ChakraButtonProps => {
    // バリアント変換（セマンティックトークンを使用）
    const colorPalette = {
      primary: 'blue',
      secondary: 'gray',
      danger: 'red',
    }[variant] as 'blue' | 'gray' | 'red';

    const chakraVariant = {
      primary: 'solid',
      secondary: 'outline',
      danger: 'solid',
    }[variant] as 'solid' | 'outline';

    // サイズ変換
    const chakraSize = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    }[size] as 'sm' | 'md' | 'lg';

    return {
      colorPalette,
      variant: chakraVariant,
      size: chakraSize,
      loading,
      disabled,
      onClick,
      type,
      width: fullWidth ? '100%' : 'auto',
      loadingText: '読み込み中...',
      ...props,
    };
  };

  return (
    <ChakraButton {...getChakraProps()}>
      {children}
    </ChakraButton>
  );
};
```

#### **Button.stories.tsx**
```typescript
// src/shared/ui/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'プライマリボタン',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'セカンダリボタン',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: '削除する',
    variant: 'danger',
  },
};

export const Loading: Story = {
  args: {
    children: '送信',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    variant: 'primary',
    disabled: true,
  },
};
```

#### **Field.tsx - フォームフィールドラッパー**
```typescript
// src/shared/ui/Field/Field.tsx
import React from 'react';
import { Field as ChakraField, Input, Textarea } from '@chakra-ui/react';
import type { FieldProps as ChakraFieldProps } from '@chakra-ui/react';

export interface FieldProps {
  /** フィールドのラベル */
  label: string;
  /** 必須フィールドかどうか */
  required?: boolean;
  /** エラー状態 */
  invalid?: boolean;
  /** エラーメッセージ */
  errorText?: string;
  /** ヘルパーテキスト */
  helperText?: string;
  /** 子要素（Input や Textarea） */
  children: React.ReactElement;
}

export const Field: React.FC<FieldProps> = ({
  label,
  required = false,
  invalid = false,
  errorText,
  helperText,
  children,
}) => {
  // 子要素に必要なpropsを追加
  const enhancedChild = React.cloneElement(children, {
    ...children.props,
    'aria-invalid': invalid,
    'aria-describedby': errorText ? `${label}-error` : undefined,
    'aria-required': required,
  });

  return (
    <ChakraField.Root invalid={invalid}>
      <ChakraField.Label>
        {label}
        {required && <ChakraField.RequiredIndicator />}
      </ChakraField.Label>
      {enhancedChild}
      {helperText && !errorText && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {errorText && (
        <ChakraField.ErrorText id={`${label}-error`}>
          {errorText}
        </ChakraField.ErrorText>
      )}
    </ChakraField.Root>
  );
};
```

#### **Field.stories.tsx**
```typescript
// src/shared/ui/Field/Field.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input, Textarea } from '@chakra-ui/react';

const meta: Meta<typeof Field> = {
  title: 'shared/ui/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  args: {
    label: 'お名前',
    required: true,
    children: <Input placeholder="山田太郎" />,
  },
};

export const WithTextarea: Story = {
  args: {
    label: 'お問い合わせ内容',
    required: true,
    helperText: '10文字以上で入力してください',
    children: <Textarea placeholder="お問い合わせ内容を入力" rows={4} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    required: true,
    invalid: true,
    errorText: '有効なメールアドレスを入力してください',
    children: <Input placeholder="email@example.com" />,
  },
};
```

#### **index.ts - バレルエクスポート**
```typescript
// src/shared/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// src/shared/ui/Field/index.ts
export { Field } from './Field';
export type { FieldProps } from './Field';
```

### 🎨 セマンティックトークンの確認
```typescript
// src/shared/theme/semantic-tokens.ts（既存）
export const semanticTokens = {
  colors: {
    // UIステータス
    'ui.primary': { default: 'blue.500', _dark: 'blue.300' },
    'ui.secondary': { default: 'gray.500', _dark: 'gray.400' },
    'ui.danger': { default: 'red.500', _dark: 'red.300' },
    
    // フォーム関連
    'form.border': { default: 'gray.200', _dark: 'gray.600' },
    'form.border.focus': { default: '{colors.ui.primary}' },
    'form.border.error': { default: '{colors.ui.danger}' },
    // ...
  }
};
```

### 🔍 確認作業
```bash
# Storybookを再起動
npm run storybook
```

1. **shared/ui/Button** と **shared/ui/Field** が表示される
2. 各バリアントが正しく動作する
3. Chakra UIのスタイルが適用される
4. セマンティックトークンが反映される

### 💡 学習ポイント
- **ラッパーパターン**: UIライブラリの抽象化
- **Feature-Sliced Design**: shared層の責務
- **セマンティックトークン**: 一貫性のあるデザインシステム
- **TypeScript**: 型安全なprops変換

---

## 📋 STEP 2: ユーザーストーリーとテストデータ準備

### 🎯 目標
ユーザーストーリーをシナリオに分解し、テストデータを準備する

### 📋 ユーザーストーリー定義

#### **US-001: 問い合わせフォームから連絡を送信する**

```
As a Webサイトの訪問者
I want 問い合わせフォームから連絡を送信したい
So that サービスについて質問や相談ができる
```

**受け入れ基準:**
- AC-001-1: 名前、メールアドレス、件名、本文が入力できる
- AC-001-2: 必須項目が未入力の場合、エラーメッセージが表示される
- AC-001-3: メールアドレスの形式が不正な場合、エラーメッセージが表示される
- AC-001-4: 送信成功時に確認メッセージが表示される

### 📝 シナリオ詳細（BDD形式）

#### **シナリオ SC-001-1: 正常な問い合わせ送信**
```gherkin
Given 問い合わせフォームページを開いている
When 名前に「田中太郎」を入力する
And メールアドレスに「tanaka@example.com」を入力する
And 件名に「サービスについて」を入力する
And 本文に「詳細を教えてください」を入力する
And プライバシーポリシーに同意する
And 送信ボタンをクリックする
Then 「お問い合わせを受け付けました」というメッセージが表示される
And フォームがクリアされる
```

#### **シナリオ SC-001-2: 必須項目未入力でのエラー**
```gherkin
Given 問い合わせフォームページを開いている
When 名前を入力せずに送信ボタンをクリックする
Then 「お名前は必須です」というエラーメッセージが表示される
And フォームは送信されない
```

#### **シナリオ SC-001-3: 不正なメールアドレス形式**
```gherkin
Given 問い合わせフォームページを開いている
When 名前に「田中太郎」を入力する
And メールアドレスに「invalid-email」を入力する
And 件名とメッセージを正しく入力する
And プライバシーポリシーに同意する
And 送信ボタンをクリックする
Then 「有効なメールアドレスを入力してください」というエラーメッセージが表示される
And フォームは送信されない
```

### 🔨 実装

#### **testData.ts - シナリオベースのテストデータ**
```typescript
// src/features/contact/model/testData.ts
import { type ContactFormData } from './validation';

export interface TestDataSet {
  scenarioId: string;
  description: string;
  data: ContactFormData;
  expectedResult: 'success' | 'validation_error';
  expectedErrors?: string[];
}

/**
 * シナリオごとのテストデータ定義
 */
export const contactFormTestData: TestDataSet[] = [
  // 成功シナリオ
  {
    scenarioId: 'SC-001-1',
    description: '正常な問い合わせ送信',
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      subject: 'サービスについて',
      message: '詳細を教えてください',
      privacyPolicy: true
    },
    expectedResult: 'success'
  },
  
  // エラーシナリオ
  {
    scenarioId: 'SC-001-2',
    description: '必須項目未入力でのエラー',
    data: {
      name: '', // 未入力
      email: '',
      subject: '',
      message: '',
      privacyPolicy: false
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      'お名前は必須です',
      'メールアドレスは必須です',
      '件名は必須です',
      'お問い合わせ内容は必須です',
      'プライバシーポリシーに同意してください'
    ]
  },
  
  {
    scenarioId: 'SC-001-3',
    description: '不正なメールアドレス形式',
    data: {
      name: '田中太郎',
      email: 'invalid-email', // 無効な形式
      subject: 'テスト件名',
      message: 'テストメッセージです。十文字以上入力しています。',
      privacyPolicy: true
    },
    expectedResult: 'validation_error',
    expectedErrors: ['有効なメールアドレスを入力してください']
  }
];

/**
 * シナリオIDからテストデータを取得
 */
export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined => {
  return contactFormTestData.find(testData => testData.scenarioId === scenarioId);
};
```

#### **validation.ts - Zodスキーマ定義**
```typescript
// src/features/contact/model/validation.ts
import { z } from 'zod';

/**
 * 問い合わせフォームのバリデーションスキーマ
 */
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'お名前は必須です')
    .max(100, '名前は100文字以内で入力してください')
    .trim(),
  
  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .trim(),
  
  subject: z.string()
    .min(1, '件名は必須です')
    .max(200, '件名は200文字以内で入力してください')
    .trim(),
  
  message: z.string()
    .min(1, 'お問い合わせ内容は必須です')
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください')
    .trim(),
  
  privacyPolicy: z.boolean()
    .refine(val => val === true, 'プライバシーポリシーに同意してください')
});

// TypeScript型を自動生成
export type ContactFormData = z.infer<typeof contactFormSchema>;
```

#### **index.ts - 機能層のエクスポート**
```typescript
// src/features/contact/model/index.ts
export { contactFormSchema, type ContactFormData } from './validation';
export { contactFormTestData, getTestDataByScenarioId, type TestDataSet } from './testData';
```

### 📁 ディレクトリ構造
```
src/features/
  contact/
    model/
      validation.ts     # Zodスキーマ
      testData.ts      # シナリオベースのテストデータ
      index.ts         # バレルエクスポート
    ui/                # コンポーネント（次のSTEP）
```

### 🔍 確認作業
1. **testData.ts** で各シナリオのデータが定義されている
2. **validation.ts** でバリデーションルールが明確
3. **シナリオID** でテストデータを取得できる

### 💡 学習ポイント
- **ユーザーストーリー**: ビジネス要件の明確化
- **BDD形式**: Given-When-Thenによるシナリオ記述
- **テストデータ管理**: シナリオとデータの紐付け
- **Zodスキーマ**: 宣言的なバリデーション定義

---

## 📋 STEP 3: features/contact層 - シナリオSC-001-1実装

### 🎯 目標
シナリオSC-001-1（正常な問い合わせ送信）を実装し、Play Functionでテストする

### 🔨 実装

#### **ContactForm.tsx - React Hook Form + Chakra UI統合**
```typescript
// src/features/contact/ui/ContactForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea, Checkbox, Stack, Box, Text } from '@chakra-ui/react';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { Alert } from '@/shared/ui/alert';
import { contactFormSchema, type ContactFormData } from '../model';

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  initialData?: Partial<ContactFormData>;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  initialData = {}
}) => {
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      subject: initialData.subject || '',
      message: initialData.message || '',
      privacyPolicy: initialData.privacyPolicy || false
    }
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      // 送信処理のシミュレート（2秒待機）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(data);
      }
      
      // 成功メッセージを表示
      setSubmitStatus('success');
      
      // フォームをクリア
      reset();
      
      // 3秒後にメッセージを消す
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <Box maxW="500px" w="100%">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap={4}>
          {/* 成功メッセージ */}
          {submitStatus === 'success' && (
            <Alert status="success" title="送信完了">
              <Text>お問い合わせを受け付けました</Text>
            </Alert>
          )}

          {/* 名前フィールド */}
          <Field
            label="お名前"
            required
            invalid={!!errors.name}
            errorText={errors.name?.message}
          >
            <Input {...register('name')} placeholder="山田太郎" />
          </Field>

          {/* メールアドレスフィールド */}
          <Field
            label="メールアドレス"
            required
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            <Input {...register('email')} placeholder="email@example.com" type="email" />
          </Field>

          {/* 件名フィールド */}
          <Field
            label="件名"
            required
            invalid={!!errors.subject}
            errorText={errors.subject?.message}
          >
            <Input {...register('subject')} placeholder="お問い合わせの件名" />
          </Field>

          {/* メッセージフィールド */}
          <Field
            label="お問い合わせ内容"
            required
            invalid={!!errors.message}
            errorText={errors.message?.message}
            helperText="10文字以上で入力してください"
          >
            <Textarea 
              {...register('message')} 
              placeholder="お問い合わせ内容を入力してください"
              rows={5}
            />
          </Field>

          {/* プライバシーポリシー同意 */}
          <Box>
            <Checkbox {...register('privacyPolicy')}>
              プライバシーポリシーに同意する
            </Checkbox>
            {errors.privacyPolicy && (
              <Text color="red.500" fontSize="sm" mt={1}>
                {errors.privacyPolicy.message}
              </Text>
            )}
          </Box>

          {/* 送信ボタン */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            送信する
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
```

#### **ContactForm.stories.tsx - シナリオベースのストーリー**
```typescript
// src/features/contact/ui/ContactForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { userEvent, within, expect } from '@storybook/test';
import { ContactForm } from './ContactForm';
import { getTestDataByScenarioId } from '../model';

const meta: Meta<typeof ContactForm> = {
  title: 'features/contact/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    onSubmit: action('form-submitted'),
  },
};

// SC-001-1: 正常な問い合わせ送信
export const SC_001_1_HappyPath: Story = {
  name: 'SC-001-1: 正常な問い合わせ送信',
  args: {
    onSubmit: action('form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-1')!;
    
    // Given: 問い合わせフォームページを開いている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/件名/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    
    // When: 有効な情報を入力する
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    
    // プライバシーポリシーに同意する
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシーに同意する/));
    
    // 送信ボタンをクリックする
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await userEvent.click(submitButton);
    
    // Then: フォームが送信される
    await expect(submitButton).toHaveTextContent('読み込み中...');
    
    // 成功メッセージが表示される
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};

// 初期データありのストーリー
export const WithInitialData: Story = {
  name: '初期データあり',
  args: {
    onSubmit: action('form-submitted'),
    initialData: getTestDataByScenarioId('SC-001-1')?.data,
  },
};
```

#### **index.ts - UIコンポーネントのエクスポート**
```typescript
// src/features/contact/ui/index.ts
export { ContactForm } from './ContactForm';
export type { ContactFormProps } from './ContactForm';
```

### 📁 最終的なディレクトリ構造
```
src/features/
  contact/
    model/
      validation.ts
      testData.ts
      index.ts
    ui/
      ContactForm.tsx
      ContactForm.stories.tsx
      index.ts
```

### 🔍 確認作業
```bash
# Storybookを再起動
npm run storybook
```

1. **features/contact/ContactForm** が表示される
2. **SC-001-1: 正常な問い合わせ送信** ストーリーを選択
3. **Interactions** パネルでPlay Functionが実行される
4. フォーム入力 → 送信 → 成功メッセージの流れを確認

### 💡 学習ポイント
- **React Hook Form + Chakra UI**: フォーム管理とUIの統合
- **シナリオベースのテスト**: Play Functionでシナリオを再現
- **Feature-Sliced Design**: features層での機能実装
- **BDDアプローチ**: Given-When-Thenによるテスト記述

---

## 📋 STEP 4: エラーシナリオの実装

### 🎯 目標
エラーシナリオ（SC-001-2, SC-001-3）を実装し、フォームバリデーションのテストを完成させる

### 📋 エラーシナリオの詳細

#### **シナリオ SC-001-2: 必須項目未入力でのエラー**
```gherkin
Given 問い合わせフォームページを開いている
When 名前を入力せずに送信ボタンをクリックする
Then 「お名前は必須です」というエラーメッセージが表示される
And フォームは送信されない
```

#### **シナリオ SC-001-3: 不正なメールアドレス形式**
```gherkin
Given 問い合わせフォームページを開いている
When すべての必須項目を入力する
And メールアドレスに不正な形式を入力する
Then 「有効なメールアドレスを入力してください」というエラーメッセージが表示される
And フォームは送信されない
```

### 🔨 実装

#### **1. ContactForm.stories.tsx にエラーシナリオ追加**
```typescript
// src/features/contact/ui/ContactForm.stories.tsx に追加

export const SC_001_2_RequiredFieldError: Story = {
  name: 'SC-001-2: 必須項目未入力でのエラー',
  args: {
    onSubmit: action('form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-2')!;
    
    // Given: 問い合わせフォームページを開いている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    
    // When: 名前を空のまま他の項目を入力
    // 名前フィールドはからのまま
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシーに同意する/));
    
    // 名前フィールドにフォーカスを当てて外す（バリデーション発火）
    const nameField = canvas.getByLabelText(/お名前/);
    await userEvent.click(nameField);
    await userEvent.tab();
    
    // Then: エラーメッセージが表示される
    await expect(canvas.getByText('お名前は必須です')).toBeInTheDocument();
    
    // And: 送信ボタンをクリックしてもフォームは送信されない
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await userEvent.click(submitButton);
    
    // 送信処理が実行されず、ボタンが「送信する」のまま
    await expect(submitButton).toHaveTextContent('送信する');
    
    // フォームリセットされていないことを確認
    await expect(canvas.getByLabelText(/メールアドレス/)).toHaveValue(testData.data.email);
  },
};

export const SC_001_3_InvalidEmailError: Story = {
  name: 'SC-001-3: 不正なメールアドレス形式',
  args: {
    onSubmit: action('form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-3')!;
    
    // Given: 問い合わせフォームページを開いている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: すべての必須項目を入力（メールアドレスのみ不正な形式）
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email); // 不正な形式
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシーに同意する/));
    
    // メールアドレスフィールドからフォーカスを外してバリデーション発火
    const emailField = canvas.getByLabelText(/メールアドレス/);
    await userEvent.tab(); // フォーカスを外す
    
    // Then: エラーメッセージが表示される
    await expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    
    // And: 送信ボタンをクリックしてもフォームは送信されない
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await userEvent.click(submitButton);
    
    // 送信処理が実行されない
    await expect(submitButton).toHaveTextContent('送信する');
    
    // 他の入力値は保持されている
    await expect(canvas.getByLabelText(/お名前/)).toHaveValue(testData.data.name);
    await expect(canvas.getByLabelText(/件名/)).toHaveValue(testData.data.subject);
  },
};

// すべてのバリデーションエラーを一度に確認するシナリオ
export const MultipleValidationErrors: Story = {
  name: '複数のバリデーションエラー確認',
  args: {
    onSubmit: action('form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: フォームが表示される
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: 各フィールドに不正な値を入力
    
    // 名前: 空のまま
    const nameField = canvas.getByLabelText(/お名前/);
    await userEvent.click(nameField);
    await userEvent.tab();
    
    // メールアドレス: 不正な形式
    const emailField = canvas.getByLabelText(/メールアドレス/);
    await userEvent.type(emailField, 'invalid-email-format');
    await userEvent.tab();
    
    // 件名: 空のまま
    const subjectField = canvas.getByLabelText(/件名/);
    await userEvent.click(subjectField);
    await userEvent.tab();
    
    // メッセージ: 短すぎる（10文字未満）
    const messageField = canvas.getByLabelText(/お問い合わせ内容/);
    await userEvent.type(messageField, '短い文');
    await userEvent.tab();
    
    // プライバシーポリシー: チェックしないまま送信を試みる
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await userEvent.click(submitButton);
    
    // Then: 各フィールドにエラーメッセージが表示される
    await expect(canvas.getByText('お名前は必須です')).toBeInTheDocument();
    await expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    await expect(canvas.getByText('件名は必須です')).toBeInTheDocument();
    await expect(canvas.getByText('お問い合わせ内容は10文字以上で入力してください')).toBeInTheDocument();
    await expect(canvas.getByText('プライバシーポリシーへの同意が必要です')).toBeInTheDocument();
    
    // フォームは送信されない
    await expect(submitButton).toHaveTextContent('送信する');
  },
};

// エラー状態からの回復テスト
export const ErrorRecovery: Story = {
  name: 'エラー状態からの回復',
  args: {
    onSubmit: action('form-submitted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: 最初に不正な値を入力してエラーを発生させる
    const nameField = canvas.getByLabelText(/お名前/);
    const emailField = canvas.getByLabelText(/メールアドレス/);
    
    // 不正なメールアドレスを入力
    await userEvent.type(emailField, 'invalid-email');
    await userEvent.tab();
    
    // Then: エラーメッセージが表示される
    await expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    
    // When: 正しい値に修正する
    await userEvent.clear(emailField);
    await userEvent.type(emailField, 'valid@example.com');
    await userEvent.tab();
    
    // Then: エラーメッセージが消える
    await expect(canvas.queryByText('有効なメールアドレスを入力してください')).not.toBeInTheDocument();
    
    // 他の必要な項目を入力
    await userEvent.type(nameField, '田中太郎');
    await userEvent.type(canvas.getByLabelText(/件名/), 'テスト件名');
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシーに同意する/));
    
    // 送信ボタンをクリック
    const submitButton = canvas.getByRole('button', { name: /送信する/ });
    await userEvent.click(submitButton);
    
    // 送信処理が実行される（ローディング状態）
    await expect(submitButton).toHaveTextContent('読み込み中...');
    
    // 成功メッセージが表示される
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};
```

#### **2. testData.ts にエラーシナリオのデータ追加**
```typescript
// src/features/contact/model/testData.ts に追加

export const contactFormTestData: TestDataSet[] = [
  // 既存の SC-001-1 データ...
  
  // SC-001-2: 必須項目未入力でのエラー
  {
    scenarioId: 'SC-001-2',
    description: '必須項目未入力でのエラー',
    data: {
      name: '', // 未入力でエラーを発生させる
      email: 'test@example.com',
      subject: 'テスト件名',
      message: 'テストメッセージです。十文字以上で入力しています。',
      privacyPolicy: true,
    },
    expectedResult: 'validation_error',
    expectedErrors: ['お名前は必須です'],
  },
  
  // SC-001-3: 不正なメールアドレス形式
  {
    scenarioId: 'SC-001-3',
    description: '不正なメールアドレス形式でのエラー',
    data: {
      name: '田中太郎',
      email: 'invalid-email-format', // 不正な形式でエラーを発生させる
      subject: 'テスト件名',
      message: 'テストメッセージです。十文字以上で入力しています。',
      privacyPolicy: true,
    },
    expectedResult: 'validation_error',
    expectedErrors: ['有効なメールアドレスを入力してください'],
  },
  
  // 複数エラーのテストデータ
  {
    scenarioId: 'SC-001-4',
    description: '複数フィールドでのバリデーションエラー',
    data: {
      name: '',
      email: 'invalid-email',
      subject: '',
      message: '短い',
      privacyPolicy: false,
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      'お名前は必須です',
      '有効なメールアドレスを入力してください',
      '件名は必須です',
      'お問い合わせ内容は10文字以上で入力してください',
      'プライバシーポリシーへの同意が必要です',
    ],
  },
];
```

### 🧪 テストの実行と確認

```bash
# Storybookでビジュアル確認
npm run storybook
# → 「features/contact/ContactForm」の新しいエラーシナリオを確認

# Play Functionの実行確認
npm run test:stories
# → エラーシナリオのテストが通ることを確認
```

### 📊 エラーハンドリングのベストプラクティス

#### **1. ユーザビリティの向上**
- **onBlurモード**: 入力中にエラーを表示しない
- **明確なエラーメッセージ**: 何が間違っているか、どう修正するか明示
- **視覚的フィードバック**: Chakra UIのinvalid状態でフィールドを強調

#### **2. アクセシビリティ対応**
```typescript
// Fieldコンポーネントでの適切なaria属性
'aria-invalid': invalid,
'aria-describedby': errorText ? `${label}-error` : undefined,
'aria-required': required,

// エラーメッセージの適切な関連付け
<ChakraField.ErrorText role="alert" id={`${label}-error`}>
  {errorText}
</ChakraField.ErrorText>
```

#### **3. エラー状態の管理**
- **一貫性**: 全フィールドで同じバリデーションタイミング
- **回復可能**: エラー状態から簡単に正常状態に戻れる
- **フィードバック**: 修正後すぐにエラーが消える

### 💡 学習ポイント
- **シナリオベーステスト**: BDD形式でユーザー視点のテスト
- **エラーハンドリング**: ユーザビリティとアクセシビリティの両立
- **Play Function**: インタラクティブなテストの自動化
- **Chakra UI統合**: エラー状態の視覚的表現

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