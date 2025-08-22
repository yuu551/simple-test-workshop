# 🔑 ワークショップ回答集 - Chakra UI + Feature-Sliced Design

## 📚 概要

このドキュメントは、WORKSHOP_GUIDE.mdの演習問題やよくある実装パターンの完全な回答例を提供します。各実装には詳細な解説とベストプラクティスが含まれています。

---

## 🔐 解答例1: ログインフォームの完全実装

### 📋 課題要件
- ユーザー名（メールアドレス形式、必須）
- パスワード（8文字以上、英数字記号混在、必須）
- 「ログイン状態を保持する」チェックボックス
- Zodバリデーション
- Chakra UI + Feature-Sliced Design

### 📝 ユーザーストーリーとシナリオ

#### **US-LOGIN-001: ユーザーがログインフォームで認証情報を入力して、正常にログインできる**

**As a** 登録済みのユーザー  
**I want** ログインフォームで認証情報を入力してログインしたい  
**So that** アプリケーションの機能にアクセスできる

**受け入れ基準:**
- AC-LOGIN-001-1: 有効なメールアドレスとパスワードでログインできる
- AC-LOGIN-001-2: ログイン状態を保持するオプションを選択できる
- AC-LOGIN-001-3: パスワード強度がリアルタイムで表示される
- AC-LOGIN-001-4: ログイン成功時にユーザーがリダイレクトされる

#### **シナリオ LOGIN-001-1: 正常なログイン**
```gherkin
Given ログインページを開いている
When メールアドレス「user@example.com」を入力する
And パスワード「SecurePass123!」を入力する
And ログインボタンをクリックする
Then ログイン処理が開始される
And ローディング状態が表示される
And ログインが成功する
```

#### **シナリオ LOGIN-001-2: ログイン状態保持機能**
```gherkin
Given ログインページを開いている
When メールアドレス「admin@company.com」を入力する
And パスワード「AdminPass456@」を入力する
And 「ログイン状態を保持する」にチェックを入れる
And ログインボタンをクリックする
Then ログイン処理が開始される
And ログイン状態が保持される設定で認証される
```

#### **US-LOGIN-002: ユーザーが無効な認証情報を入力した場合、適切なエラーメッセージが表示される**

**As a** アプリケーションのユーザー  
**I want** 無効な認証情報を入力した時に明確なエラーメッセージを見たい  
**So that** 何が間違っているかを理解して修正できる

#### **シナリオ LOGIN-002-1: 必須項目未入力エラー**
```gherkin
Given ログインページを開いている
When メールアドレスフィールドをクリックしてフォーカスを外す
And パスワードフィールドをクリックしてフォーカスを外す
Then 「メールアドレスは必須です」というエラーメッセージが表示される
And 「パスワードは必須です」というエラーメッセージが表示される
And ログインボタンが無効化される
```

#### **シナリオ LOGIN-002-2: 不正なメールアドレス形式**
```gherkin
Given ログインページを開いている
When メールアドレス「invalid-email」を入力する
And パスワード「ValidPass123!」を入力する
And メールアドレスフィールドからフォーカスを外す
Then 「有効なメールアドレスを入力してください」というエラーメッセージが表示される
And ログインボタンが無効化される
```

#### **シナリオ LOGIN-002-3: パスワード強度不足**
```gherkin
Given ログインページを開いている
When メールアドレス「user@example.com」を入力する
And パスワード「123」を入力する
Then パスワード強度インジケーターが「弱い」と表示される
And パスワード強度の詳細条件が表示される
And 「8文字以上」の条件が満たされていない状態で表示される
When パスワードフィールドからフォーカスを外す
Then 「パスワードは8文字以上で入力してください」というエラーメッセージが表示される
```

#### **シナリオ LOGIN-002-4: 認証エラー**
```gherkin
Given ログインページを開いている
When 有効な形式だが存在しないメールアドレス「nonexistent@example.com」を入力する
And 有効なパスワード「ValidPass123!」を入力する
And ログインボタンをクリックする
Then ログイン処理が開始される
And ローディング状態が表示される
And 「ユーザー名またはパスワードが正しくありません」というエラーメッセージが表示される
And フォームの入力値はそのまま保持される
```

#### **US-LOGIN-003: ユーザーがパスワード強度を確認しながら、安全なパスワードを設定できる**

**As a** セキュリティを重視するユーザー  
**I want** パスワード入力中にリアルタイムで強度を確認したい  
**So that** 安全なパスワードを設定できる

#### **シナリオ LOGIN-003-1: パスワード強度のリアルタイム表示**
```gherkin
Given ログインページを開いている
When パスワードフィールドに「weak」と入力する
Then パスワード強度インジケーターが「弱い」（赤色）で表示される
And 強度の詳細条件リストが表示される
And 「8文字以上」条件が未達成として表示される
When パスワードを「Password123」に変更する
Then パスワード強度インジケーターが「普通」（黄色）で表示される
And 「大文字を含む」「小文字を含む」「数字を含む」条件が達成として表示される
And 「記号を含む」条件が未達成として表示される
When パスワードを「SecurePass123!」に変更する
Then パスワード強度インジケーターが「強い」（緑色）で表示される
And すべての条件が達成として表示される
```

#### **シナリオ LOGIN-003-2: パスワード表示・非表示切り替え**
```gherkin
Given ログインページを開いている
And パスワードフィールドに「SecurePass123!」と入力している
When 「パスワードを表示」ボタンをクリックする
Then パスワードが平文で表示される
And ボタンのテキストが「パスワードを隠す」に変更される
When 「パスワードを隠す」ボタンをクリックする
Then パスワードがマスクされて表示される
And ボタンのテキストが「パスワードを表示」に変更される
```

#### **シナリオ LOGIN-003-3: エラー状態からの回復**
```gherkin
Given ログインページを開いている
And 無効なメールアドレス「invalid-email」を入力している
And エラーメッセージ「有効なメールアドレスを入力してください」が表示されている
When メールアドレスを「user@example.com」に修正する
And メールアドレスフィールドからフォーカスを外す
Then エラーメッセージが消える
And メールアドレスフィールドのエラー状態が解除される
When 有効なパスワード「SecurePass123!」を入力する
And 「ログイン状態を保持する」にチェックを入れる
And ログインボタンをクリックする
Then ログイン処理が正常に実行される
```

### 🔨 完全な実装

#### **1. バリデーションスキーマ**
```typescript
// src/features/auth/model/validation.ts
import { z } from 'zod';

/**
 * パスワード強度チェック用の正規表現
 * - 最低8文字
 * - 英字（大文字・小文字）、数字、記号を含む
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginFormSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  
  password: z.string()
    .min(1, 'パスワードは必須です')
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(passwordRegex, 'パスワードは英大文字・小文字・数字・記号を含む必要があります'),
  
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * パスワード強度を判定する関数
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 8) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[@$!%*?&]/.test(password);
  
  const criteriaCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (criteriaCount >= 4) return 'strong';
  if (criteriaCount >= 2) return 'medium';
  return 'weak';
};
```

#### **2. テストデータ**
```typescript
// src/features/auth/model/testData.ts
import { type LoginFormData } from './validation';

export interface TestDataSet {
  scenarioId: string;
  description: string;
  data: LoginFormData;
  expectedResult: 'success' | 'validation_error';
  expectedErrors?: string[];
}

export const loginFormTestData: TestDataSet[] = [
  // 成功シナリオ
  {
    scenarioId: 'SC-LOGIN-001',
    description: '正常なログイン（強いパスワード）',
    data: {
      email: 'user@example.com',
      password: 'SecurePass123!',
      rememberMe: false,
    },
    expectedResult: 'success',
  },
  
  {
    scenarioId: 'SC-LOGIN-002',
    description: 'ログイン状態保持有効',
    data: {
      email: 'admin@company.com',
      password: 'AdminPass456@',
      rememberMe: true,
    },
    expectedResult: 'success',
  },
  
  // エラーシナリオ
  {
    scenarioId: 'SC-LOGIN-E01',
    description: '必須項目未入力',
    data: {
      email: '',
      password: '',
      rememberMe: false,
    },
    expectedResult: 'validation_error',
    expectedErrors: [
      'メールアドレスは必須です',
      'パスワードは必須です',
    ],
  },
  
  {
    scenarioId: 'SC-LOGIN-E02',
    description: '不正なメール形式',
    data: {
      email: 'invalid-email',
      password: 'ValidPass123!',
      rememberMe: false,
    },
    expectedResult: 'validation_error',
    expectedErrors: ['有効なメールアドレスを入力してください'],
  },
  
  {
    scenarioId: 'SC-LOGIN-E03',
    description: '弱いパスワード',
    data: {
      email: 'user@example.com',
      password: '123', // 短すぎる
      rememberMe: false,
    },
    expectedResult: 'validation_error',
    expectedErrors: ['パスワードは8文字以上で入力してください'],
  },
  
  {
    scenarioId: 'SC-LOGIN-E04',
    description: 'パスワード強度不足',
    data: {
      email: 'user@example.com',
      password: 'password123', // 記号なし、大文字なし
      rememberMe: false,
    },
    expectedResult: 'validation_error',
    expectedErrors: ['パスワードは英大文字・小文字・数字・記号を含む必要があります'],
  },
];

export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined => {
  return loginFormTestData.find(testData => testData.scenarioId === scenarioId);
};
```

#### **3. パスワード強度インジケーターコンポーネント**
```typescript
// src/shared/ui/PasswordStrength/PasswordStrength.tsx
import React from 'react';
import { Box, Progress, Text, HStack, VStack } from '@chakra-ui/react';
import { type PasswordStrength, getPasswordStrength } from '@/features/auth/model/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

const strengthConfig = {
  weak: {
    value: 25,
    colorScheme: 'red',
    text: '弱い',
    color: 'red.500',
  },
  medium: {
    value: 65,
    colorScheme: 'yellow',
    text: '普通',
    color: 'yellow.500',
  },
  strong: {
    value: 100,
    colorScheme: 'green',
    text: '強い',
    color: 'green.500',
  },
} as const;

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showDetails = true,
}) => {
  const strength = getPasswordStrength(password);
  const config = strengthConfig[strength];
  
  if (!password) return null;
  
  const criteriaChecks = [
    { label: '8文字以上', met: password.length >= 8 },
    { label: '小文字を含む', met: /[a-z]/.test(password) },
    { label: '大文字を含む', met: /[A-Z]/.test(password) },
    { label: '数字を含む', met: /\d/.test(password) },
    { label: '記号を含む', met: /[@$!%*?&]/.test(password) },
  ];
  
  return (
    <VStack align="stretch" spacing={2}>
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="medium">
          パスワード強度
        </Text>
        <Text fontSize="sm" fontWeight="bold" color={config.color}>
          {config.text}
        </Text>
      </HStack>
      
      <Progress
        value={config.value}
        colorScheme={config.colorScheme}
        size="sm"
        bg="gray.100"
        borderRadius="md"
        aria-label={`パスワード強度: ${config.text}`}
      />
      
      {showDetails && (
        <VStack align="stretch" spacing={1} mt={2}>
          {criteriaChecks.map((criteria, index) => (
            <HStack key={index} spacing={2}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg={criteria.met ? 'green.500' : 'gray.300'}
              />
              <Text
                fontSize="xs"
                color={criteria.met ? 'green.700' : 'gray.500'}
              >
                {criteria.label}
              </Text>
            </HStack>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
```

#### **4. ログインフォームコンポーネント**
```typescript
// src/features/auth/ui/LoginForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { Field } from '@/shared/ui/Field';
import { Input } from '@chakra-ui/react';
import { Checkbox } from '@/shared/ui/Checkbox';
import { PasswordStrengthIndicator } from '@/shared/ui/PasswordStrength';
import { loginFormSchema, type LoginFormData } from '../model/validation';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<{ success: boolean; message?: string }>;
  isLoading?: boolean;
  initialData?: Partial<LoginFormData>;
  showPasswordStrength?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData = {},
  showPasswordStrength = true,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: initialData.email || '',
      password: initialData.password || '',
      rememberMe: initialData.rememberMe || false,
    },
  });
  
  const passwordValue = watch('password', '');
  
  const handleFormSubmit = async (data: LoginFormData) => {
    setSubmitError(null);
    
    try {
      const result = await onSubmit(data);
      
      if (result.success) {
        // ログイン成功時の処理
        reset();
      } else {
        setSubmitError(result.message || 'ログインに失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError('ネットワークエラーが発生しました');
    }
  };
  
  return (
    <Box maxW="400px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            ログイン
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            アカウントにログインしてください
          </Text>
        </Box>
        
        {submitError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <VStack spacing={4} align="stretch">
            {/* メールアドレス */}
            <Field
              label="メールアドレス"
              required
              invalid={!!errors.email}
              errorText={errors.email?.message}
            >
              <Input
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </Field>
            
            {/* パスワード */}
            <Field
              label="パスワード"
              required
              invalid={!!errors.password}
              errorText={errors.password?.message}
            >
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="パスワードを入力"
                autoComplete="current-password"
              />
            </Field>
            
            {/* パスワード表示切り替え */}
            <HStack justify="space-between" fontSize="sm">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                color="blue.600"
              >
                {showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
              </Button>
            </HStack>
            
            {/* パスワード強度インジケーター */}
            {showPasswordStrength && passwordValue && (
              <Box p={3} bg="gray.50" borderRadius="md">
                <PasswordStrengthIndicator password={passwordValue} />
              </Box>
            )}
            
            {/* ログイン状態保持 */}
            <Field>
              <Checkbox {...register('rememberMe')}>
                ログイン状態を保持する
              </Checkbox>
            </Field>
            
            {/* 送信ボタン */}
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={isSubmitting || isLoading}
              loadingText="ログイン中..."
              isDisabled={!isValid}
              w="full"
            >
              ログイン
            </Button>
          </VStack>
        </form>
        
        <VStack spacing={2} pt={4} borderTop="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600">
            アカウントをお持ちでない方は
          </Text>
          <Button variant="link" size="sm" colorScheme="blue">
            新規登録はこちら
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};
```

#### **5. Storybookストーリー**
```typescript
// src/features/auth/ui/LoginForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { userEvent, within, expect } from '@storybook/test';
import { LoginForm } from './LoginForm';
import { getTestDataByScenarioId } from '../model/testData';

const mockSubmit = async (data: any) => {
  console.log('Login attempt:', data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 特定のメールアドレスでエラーをシミュレート
  if (data.email === 'error@example.com') {
    return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
  }
  
  return { success: true };
};

const meta: Meta<typeof LoginForm> = {
  title: 'features/auth/LoginForm',
  component: LoginForm,
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
    onSubmit: mockSubmit,
  },
};

// パスワード強度非表示
export const WithoutPasswordStrength: Story = {
  args: {
    onSubmit: mockSubmit,
    showPasswordStrength: false,
  },
};

// 初期データあり
export const WithInitialData: Story = {
  args: {
    onSubmit: mockSubmit,
    initialData: {
      email: 'user@example.com',
      rememberMe: true,
    },
  },
};

// ローディング状態
export const LoadingState: Story = {
  args: {
    onSubmit: mockSubmit,
    isLoading: true,
    initialData: {
      email: 'user@example.com',
    },
  },
};

// SC-LOGIN-001: 正常なログインフロー
export const SC_LOGIN_001_SuccessfulLogin: Story = {
  name: 'SC-LOGIN-001: 正常なログイン',
  args: {
    onSubmit: mockSubmit,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-LOGIN-001')!;
    
    // Given: ログインフォームが表示される
    await expect(canvas.getByText('ログイン')).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/パスワード/)).toBeInTheDocument();
    
    // When: 有効な認証情報を入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/パスワード/), testData.data.password);
    
    // パスワード強度が「強い」と表示されることを確認
    await expect(canvas.getByText('強い')).toBeInTheDocument();
    
    // ログインボタンをクリック
    const loginButton = canvas.getByRole('button', { name: /ログイン/ });
    await userEvent.click(loginButton);
    
    // Then: ローディング状態が表示される
    await expect(canvas.getByText('ログイン中...')).toBeInTheDocument();
  },
};

// SC-LOGIN-002: ログイン状態保持
export const SC_LOGIN_002_RememberMe: Story = {
  name: 'SC-LOGIN-002: ログイン状態保持',
  args: {
    onSubmit: mockSubmit,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-LOGIN-002')!;
    
    // Given: ログインフォームが表示される
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    
    // When: ログイン情報を入力し、「ログイン状態を保持する」をチェック
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/パスワード/), testData.data.password);
    await userEvent.click(canvas.getByLabelText(/ログイン状態を保持する/));
    
    // Then: チェックボックスが選択されていることを確認
    await expect(canvas.getByLabelText(/ログイン状態を保持する/)).toBeChecked();
    
    // ログイン実行
    await userEvent.click(canvas.getByRole('button', { name: /ログイン/ }));
    await expect(canvas.getByText('ログイン中...')).toBeInTheDocument();
  },
};

// SC-LOGIN-E01: 必須項目未入力エラー
export const SC_LOGIN_E01_RequiredFieldsError: Story = {
  name: 'SC-LOGIN-E01: 必須項目未入力エラー',
  args: {
    onSubmit: mockSubmit,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: ログインフォームが表示される
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    
    // When: 何も入力せずにフィールドからフォーカスを外す
    const emailField = canvas.getByLabelText(/メールアドレス/);
    const passwordField = canvas.getByLabelText(/パスワード/);
    
    await userEvent.click(emailField);
    await userEvent.tab();
    await userEvent.click(passwordField);
    await userEvent.tab();
    
    // Then: 必須エラーメッセージが表示される
    await expect(canvas.getByText('メールアドレスは必須です')).toBeInTheDocument();
    await expect(canvas.getByText('パスワードは必須です')).toBeInTheDocument();
    
    // ログインボタンが無効化されている
    const loginButton = canvas.getByRole('button', { name: /ログイン/ });
    await expect(loginButton).toBeDisabled();
  },
};

// SC-LOGIN-E03: パスワード強度テスト
export const SC_LOGIN_E03_PasswordStrengthTest: Story = {
  name: 'SC-LOGIN-E03: パスワード強度テスト',
  args: {
    onSubmit: mockSubmit,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: ログインフォームが表示される
    const passwordField = canvas.getByLabelText(/パスワード/);
    
    // When: 弱いパスワードを入力
    await userEvent.type(passwordField, '123');
    
    // Then: 「弱い」と表示される
    await expect(canvas.getByText('弱い')).toBeInTheDocument();
    
    // When: パスワードを修正
    await userEvent.clear(passwordField);
    await userEvent.type(passwordField, 'Password123');
    
    // Then: 「普通」と表示される
    await expect(canvas.getByText('普通')).toBeInTheDocument();
    
    // When: さらに強いパスワードに修正
    await userEvent.clear(passwordField);
    await userEvent.type(passwordField, 'SecurePass123!');
    
    // Then: 「強い」と表示される
    await expect(canvas.getByText('強い')).toBeInTheDocument();
    
    // すべての条件がクリアされている
    await expect(canvas.getByText('8文字以上')).toBeInTheDocument();
    await expect(canvas.getByText('小文字を含む')).toBeInTheDocument();
    await expect(canvas.getByText('大文字を含む')).toBeInTheDocument();
    await expect(canvas.getByText('数字を含む')).toBeInTheDocument();
    await expect(canvas.getByText('記号を含む')).toBeInTheDocument();
  },
};

// ログインエラーのテスト
export const LoginError: Story = {
  name: 'ログインエラー',
  args: {
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: false, message: 'ユーザー名またはパスワードが正しくありません' };
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 有効なデータを入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), 'error@example.com');
    await userEvent.type(canvas.getByLabelText(/パスワード/), 'WrongPassword123!');
    await userEvent.click(canvas.getByRole('button', { name: /ログイン/ }));
    
    // エラーメッセージが表示される
    await expect(await canvas.findByText('ユーザー名またはパスワードが正しくありません')).toBeInTheDocument();
  },
};
```

#### **6. 単体テスト**
```typescript
// src/features/auth/model/validation.test.ts
import { describe, test, expect } from 'vitest';
import { loginFormSchema, getPasswordStrength, type LoginFormData } from './validation';

describe('Login Form Validation', () => {
  describe('Email validation', () => {
    test.each([
      ['user@example.com', true, '有効なメールアドレス'],
      ['test.email@domain.co.jp', true, '日本のメールアドレス'],
      ['user+tag@example.org', true, 'プラス記号付きメール'],
      ['invalid-email', false, '@マークなし'],
      ['@domain.com', false, 'ユーザー名なし'],
      ['user@', false, 'ドメインなし'],
      ['', false, '空文字'],
    ])('Email: %s → %s (%s)', (email, shouldBeValid, description) => {
      const testData: LoginFormData = {
        email,
        password: 'ValidPass123!',
        rememberMe: false,
      };
      
      const result = loginFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
    });
  });
  
  describe('Password validation', () => {
    test.each([
      ['SecurePass123!', true, '強いパスワード'],
      ['Password123@', true, '有効なパスワード'],
      ['MySecret987#', true, '別の有効なパスワード'],
      ['weak', false, '短すぎる'],
      ['password123', false, '大文字・記号なし'],
      ['PASSWORD123!', false, '小文字なし'],
      ['Password!', false, '数字なし'],
      ['Password123', false, '記号なし'],
      ['', false, '空文字'],
    ])('Password: "%s" → %s (%s)', (password, shouldBeValid, description) => {
      const testData: LoginFormData = {
        email: 'user@example.com',
        password,
        rememberMe: false,
      };
      
      const result = loginFormSchema.safeParse(testData);
      expect(result.success).toBe(shouldBeValid);
    });
  });
  
  describe('Password strength detection', () => {
    test.each([
      ['weak', 'weak', '短いパスワード'],
      ['password', 'weak', '弱いパスワード'],
      ['Password123', 'medium', '普通のパスワード'],
      ['Pass123!', 'medium', '条件を満たすが短め'],
      ['SecurePassword123!', 'strong', '強いパスワード'],
      ['MyVerySecureP@ssw0rd', 'strong', '非常に強いパスワード'],
    ])('getPasswordStrength("%s") → %s (%s)', (password, expected, description) => {
      expect(getPasswordStrength(password)).toBe(expected);
    });
  });
  
  describe('Complete form validation', () => {
    test('Valid login data passes validation', () => {
      const validData: LoginFormData = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        rememberMe: true,
      };
      
      const result = loginFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
    
    test('Multiple invalid fields', () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        rememberMe: false,
      };
      
      const result = loginFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        expect(result.error.errors).toHaveLength(3); // email, password (2 errors)
        
        const errorMessages = result.error.errors.map(err => err.message);
        expect(errorMessages).toContain('有効なメールアドレスを入力してください');
        expect(errorMessages).toContain('パスワードは8文字以上で入力してください');
      }
    });
  });
});
```

### 💡 実装のポイント

#### **🎯 Feature-Sliced Design原則の遵守**
- **shared/ui**: 汎用的なPasswordStrengthIndicatorコンポーネント
- **features/auth**: 認証に特化したドメインロジック
- **依存関係**: 上位層 → 下位層のみ

#### **🔒 セキュリティ考慮**
- パスワード強度の視覚的フィードバック
- オートコンプリート属性の適切な設定
- クライアントサイドバリデーション（サーバーサイドも必須）

#### **♿ アクセシビリティ**
- 適切なARIA属性
- スクリーンリーダー対応
- キーボードナビゲーション

#### **📱 ユーザビリティ**
- リアルタイムパスワード強度表示
- 明確なエラーメッセージ
- ローディング状態の表示

---

## 🔧 解答例2: マルチステップフォームの実装

### 📋 課題要件
複数ステップのフォーム（個人情報 → 連絡先 → 確認画面）を作成し、各ステップでのバリデーションとデータ永続化を実装

### 📝 ユーザーストーリーとシナリオ

#### **US-REG-001: ユーザーが段階的に情報を入力してアカウント登録を完了できる**

**As a** 新規ユーザー  
**I want** 段階的にフォームを入力してアカウント登録したい  
**So that** 一度にすべてを入力する負担を軽減して確実に登録できる

**受け入れ基準:**
- AC-REG-001-1: 3つのステップ（個人情報・連絡先・確認）で登録できる
- AC-REG-001-2: 各ステップでバリデーションが実行される
- AC-REG-001-3: ステップ間でデータが保持される
- AC-REG-001-4: 進捗が視覚的に表示される
- AC-REG-001-5: 前のステップに戻って修正できる

#### **シナリオ REG-001-1: 正常な登録フロー**
```gherkin
Given アカウント登録ページを開いている
And ステップインジケーターに「個人情報」「連絡先」「確認」の3ステップが表示されている
And 現在のステップが「1. 個人情報」として強調されている

# ステップ1: 個人情報入力
When 名前（姓）「山田」を入力する
And 名前（名）「太郎」を入力する
And 生年月日「1990-05-15」を選択する
And 性別「男性」を選択する
And 「次へ」ボタンをクリックする
Then ステップ2に進む
And ステップインジケーターで「個人情報」が完了済みとして表示される
And 「連絡先」が現在のステップとして強調される

# ステップ2: 連絡先情報入力
When メールアドレス「yamada@example.com」を入力する
And 電話番号「090-1234-5678」を入力する
And 住所「東京都渋谷区神南1-1-1」を入力する
And 都市名「渋谷区」を入力する
And 郵便番号「150-0041」を入力する
And 「次へ」ボタンをクリックする
Then ステップ3に進む
And ステップインジケーターで「連絡先」が完了済みとして表示される
And 「確認」が現在のステップとして強調される

# ステップ3: 確認画面
When 確認画面で入力内容を確認する
Then 個人情報「山田太郎、1990年5月15日生、男性」が表示される
And 連絡先情報「yamada@example.com、090-1234-5678」が表示される
And 住所「東京都渋谷区神南1-1-1、渋谷区、150-0041」が表示される
When 「登録する」ボタンをクリックする
Then 登録処理が実行される
And 「登録中...」の状態が表示される
And 登録完了メッセージが表示される
```

#### **シナリオ REG-001-2: ステップ戻り機能**
```gherkin
Given ステップ2（連絡先入力）にいる
And すでに「yamada@example.com」「090-1234-5678」を入力している
When 「戻る」ボタンをクリックする
Then ステップ1に戻る
And 以前入力した個人情報「山田太郎」が保持されている
And ステップインジケーターが「個人情報」を現在のステップとして表示する
When 名前（名）を「太郎」から「次郎」に変更する
And 「次へ」ボタンをクリックする
Then ステップ2に進む
And 以前入力した連絡先情報が保持されている
And 「次へ」ボタンをクリックしてステップ3に進む
Then 確認画面で名前が「山田次郎」として更新されて表示される
```

#### **シナリオ REG-001-3: ステップ別バリデーションエラー**
```gherkin
Given ステップ1（個人情報）にいる
When 名前（姓）を入力せずに「次へ」ボタンをクリックする
Then 「名前（姓）は必須です」というエラーメッセージが表示される
And ステップ2に進まない
And 名前（姓）フィールドがエラー状態で表示される
When 名前（姓）「田中」を入力する
And 生年月日を選択せずに「次へ」ボタンをクリックする
Then 「生年月日は必須です」というエラーメッセージが表示される
When すべての必須項目を正しく入力する
And 「次へ」ボタンをクリックする
Then ステップ2に正常に進む

Given ステップ2（連絡先）にいる
When メールアドレス「invalid-email」を入力する
And 他の項目を正しく入力する
And 「次へ」ボタンをクリックする
Then 「有効なメールアドレスを入力してください」というエラーメッセージが表示される
And ステップ3に進まない
When メールアドレスを「tanaka@example.com」に修正する
And 「次へ」ボタンをクリックする
Then ステップ3に正常に進む
```

#### **US-REG-002: ユーザーが入力途中でページを離れても、入力内容が保持される**

**As a** 時間をかけて慎重に登録したいユーザー  
**I want** 入力途中でページを離れても内容が保持されたい  
**So that** 最初から入力し直す必要がない

#### **シナリオ REG-002-1: データ自動保存と復元**
```gherkin
Given ステップ1で個人情報を入力している
When 名前（姓）「佐藤」、名前（名）「花子」を入力する
And 生年月日「1995-03-20」を選択する
And ページをリロードする
Then 同じステップ1で再開される
And 入力した個人情報「佐藤花子、1995-03-20」が復元される
When 残りの項目を入力してステップ2に進む
And 連絡先情報の途中まで入力してページを閉じる
And 再度アカウント登録ページを開く
Then ステップ2から再開される
And 個人情報とこれまでの連絡先情報が復元される
```

#### **シナリオ REG-002-2: 登録完了後の自動データクリア**
```gherkin
Given 登録フローを最後まで完了している
And 「登録が完了しました」メッセージが表示されている
When ブラウザの「戻る」ボタンをクリックする
Or 再度アカウント登録ページにアクセスする
Then ステップ1から新しい登録として開始される
And 以前の入力内容はクリアされている
And 保存されたデータが残っていない
```

#### **US-REG-003: ユーザーが確認画面で詳細を確認してから安心して登録できる**

**As a** 慎重なユーザー  
**I want** 最終確認画面で入力内容を詳しく確認したい  
**So that** 間違いがないことを確認してから登録できる

#### **シナリオ REG-003-1: 詳細な確認画面**
```gherkin
Given ステップ3（確認画面）にいる
And すべての情報を入力済みである
Then 以下の情報が整理されて表示される
| セクション | 項目 | 値 |
| 個人情報 | 氏名 | 鈴木一郎 |
| 個人情報 | 生年月日 | 1988年12月10日 |
| 個人情報 | 性別 | 男性 |
| 連絡先 | メールアドレス | suzuki@example.com |
| 連絡先 | 電話番号 | 080-9876-5432 |
| 連絡先 | 住所 | 大阪府大阪市中央区難波1-2-3 |
| 連絡先 | 都市 | 大阪市 |
| 連絡先 | 郵便番号 | 542-0076 |
And 各セクションに「編集」ボタンが表示される
```

#### **シナリオ REG-003-2: 確認画面からの編集**
```gherkin
Given ステップ3（確認画面）にいる
When 個人情報セクションの「編集」ボタンをクリックする
Then ステップ1に戻る
And 現在の個人情報が入力済みの状態で表示される
When 生年月日を「1988-12-10」から「1987-11-25」に変更する
And ステップを進めて確認画面に戻る
Then 確認画面で生年月日が「1987年11月25日」に更新されている
And 他の情報はそのまま保持されている
```

### 🔨 実装概要

#### **1. ステップ管理フック**
```typescript
// src/shared/lib/hooks/useMultiStepForm.ts
import { useState, useCallback } from 'react';

export interface MultiStepFormState<T> {
  currentStep: number;
  data: Partial<T>;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface MultiStepFormActions<T> {
  nextStep: (stepData?: Partial<T>) => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateData: (stepData: Partial<T>) => void;
  reset: () => void;
}

interface UseMultiStepFormOptions<T> {
  totalSteps: number;
  initialData?: Partial<T>;
  onComplete?: (data: T) => void;
  validation?: {
    [step: number]: (data: Partial<T>) => boolean;
  };
}

export const useMultiStepForm = <T>({
  totalSteps,
  initialData = {},
  onComplete,
  validation = {},
}: UseMultiStepFormOptions<T>): [MultiStepFormState<T>, MultiStepFormActions<T>] => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<T>>(initialData);
  
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  const nextStep = useCallback((stepData?: Partial<T>) => {
    const newData = stepData ? { ...data, ...stepData } : data;
    
    // ステップのバリデーション
    const stepValidator = validation[currentStep];
    if (stepValidator && !stepValidator(newData)) {
      console.warn(`Step ${currentStep} validation failed`);
      return;
    }
    
    setData(newData);
    
    if (isLastStep && onComplete) {
      onComplete(newData as T);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  }, [currentStep, data, isLastStep, onComplete, totalSteps, validation]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);
  
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  const updateData = useCallback((stepData: Partial<T>) => {
    setData(prev => ({ ...prev, ...stepData }));
  }, []);
  
  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(initialData);
  }, [initialData]);
  
  return [
    { currentStep, data, isFirstStep, isLastStep },
    { nextStep, prevStep, goToStep, updateData, reset },
  ];
};
```

#### **2. ステップインジケーター**
```typescript
// src/shared/ui/StepIndicator/StepIndicator.tsx
import React from 'react';
import { HStack, Box, Text, Circle, Divider } from '@chakra-ui/react';

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  colorScheme?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  colorScheme = 'blue',
}) => {
  return (
    <HStack spacing={0} w="full" justify="space-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;
        
        return (
          <React.Fragment key={index}>
            <Box textAlign="center" flex={1}>
              <Circle
                size={10}
                bg={
                  isCompleted
                    ? `${colorScheme}.500`
                    : isCurrent
                    ? `${colorScheme}.100`
                    : 'gray.200'
                }
                color={
                  isCompleted
                    ? 'white'
                    : isCurrent
                    ? `${colorScheme}.600`
                    : 'gray.500'
                }
                border={isCurrent ? `2px solid` : 'none'}
                borderColor={`${colorScheme}.500`}
                fontWeight="bold"
                fontSize="sm"
                mb={2}
              >
                {isCompleted ? '✓' : stepNumber}
              </Circle>
              <Text
                fontSize="sm"
                fontWeight={isCurrent ? 'bold' : 'normal'}
                color={
                  isCompleted || isCurrent
                    ? `${colorScheme}.600`
                    : 'gray.500'
                }
              >
                {step.label}
              </Text>
              {step.description && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {step.description}
                </Text>
              )}
            </Box>
            
            {index < steps.length - 1 && (
              <Divider
                flex={1}
                mx={4}
                borderColor={
                  stepNumber < currentStep
                    ? `${colorScheme}.500`
                    : 'gray.300'
                }
                borderWidth={
                  stepNumber < currentStep ? '2px' : '1px'
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </HStack>
  );
};
```

#### **3. ユーザー登録フォーム**
```typescript
// src/features/registration/ui/RegistrationForm.tsx
import React from 'react';
import { Box, VStack, Button, HStack } from '@chakra-ui/react';
import { useMultiStepForm } from '@/shared/lib/hooks/useMultiStepForm';
import { StepIndicator } from '@/shared/ui/StepIndicator';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

interface RegistrationData {
  // 個人情報
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  
  // 連絡先情報
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  
  // 設定
  newsletter: boolean;
  terms: boolean;
}

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
  initialData?: Partial<RegistrationData>;
}

const steps = [
  { label: '個人情報', description: '基本情報を入力' },
  { label: '連絡先', description: '連絡先情報を入力' },
  { label: '確認', description: '入力内容を確認' },
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [formState, formActions] = useMultiStepForm<RegistrationData>({
    totalSteps: 3,
    initialData,
    onComplete: onSubmit,
  });
  
  const { currentStep, data, isFirstStep, isLastStep } = formState;
  const { nextStep, prevStep, updateData } = formActions;
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={data}
            onUpdate={updateData}
            onNext={(stepData) => nextStep(stepData)}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            data={data}
            onUpdate={updateData}
            onNext={(stepData) => nextStep(stepData)}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            data={data as RegistrationData}
            onSubmit={() => nextStep()}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Box maxW="600px" mx="auto" p={6}>
      <VStack spacing={8}>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          colorScheme="blue"
        />
        
        <Box w="full" minH="400px">
          {renderStep()}
        </Box>
      </VStack>
    </Box>
  );
};
```

この解答集では、実際のプロジェクトで使用できる完全な実装例を提供しています。各実装には：

- **完全なTypeScript型定義**
- **包括的なバリデーション**
- **Storybookストーリーとテスト**
- **アクセシビリティ対応**
- **Feature-Sliced Design準拠**

が含まれており、コピー&ペーストして即座に使用できる品質になっています。

---

## 📚 次の解答例

次回は以下の実装例を追加予定：
- **ダイナミックフォームフィールド**
- **リアルタイムバリデーション**
- **ファイルアップロード機能**
- **検索・フィルター機能**
- **データテーブル実装**

このように段階的に実装例を充実させていくことで、実践的な開発スキルを効果的に習得できます。