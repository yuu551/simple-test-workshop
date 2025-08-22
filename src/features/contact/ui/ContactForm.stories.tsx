import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, expect, within } from 'storybook/test';
import { ContactForm } from './ContactForm';
import { getTestDataByScenarioId } from '../model/testData';

// Simple mock function for Storybook
const mockFn = () => {
  const fn = (...args: unknown[]) => {
    console.log('Called with:', args);
  };
  fn.mock = { calls: [] };
  return fn;
};

const meta = {
  title: 'features/contact/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    enableAutoSave: true,
    onSubmit: mockFn(),
  },
};

export const WithoutAutoSave: Story = {
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
};

// US-001-SC-001-1: 正常な問い合わせ送信
export const HappyPath: Story = {
  name: 'US-001-SC-001-1: 正常な問い合わせ送信',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-1')!;
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/件名/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/プライバシーポリシー/)).toBeInTheDocument();
    
    // When: 有効な情報を入力して送信する
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: フォームが送信され、成功メッセージが表示される
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    
    // 送信中の状態を確認（Chakra UIのloading状態）
    const submitButton = canvas.getByRole('button');
    await expect(submitButton).toHaveAttribute('data-loading');
    
    // 成功メッセージの表示を確認
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};

// US-001-SC-001-2: 必須項目未入力でのエラー  
export const RequiredFieldError: Story = {
  name: 'US-001-SC-001-2: 必須項目未入力でのエラー',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-2')!;
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/件名/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/プライバシーポリシー/)).toBeInTheDocument();
    
    // When: 必須項目（名前）を空のままで送信する
    // 名前フィールドにフォーカスしてからblurでバリデーションを発生させる
    const nameField = canvas.getByLabelText(/お名前/);
    await userEvent.click(nameField);
    await userEvent.tab(); // フォーカスを外してonBlurバリデーションを発生
    
    // 他のフィールドに有効な値を入力
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: 名前のバリデーションエラーが表示される
    await expect(canvas.getByText('お名前は必須です')).toBeInTheDocument();
    
    // 送信ボタンをクリックしてもフォームは送信されない
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    
    // 成功メッセージは表示されない
    await expect(canvas.queryByText(/お問い合わせを受け付けました/)).not.toBeInTheDocument();
  },
};

// US-001-SC-001-3: 不正なメールアドレス形式
export const InvalidEmailError: Story = {
  name: 'US-001-SC-001-3: 不正なメールアドレス形式',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-3')!;
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/件名/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/プライバシーポリシー/)).toBeInTheDocument();
    
    // When: 不正な形式のメールアドレスを入力して送信する
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    
    const emailField = canvas.getByLabelText(/メールアドレス/);
    await userEvent.type(emailField, testData.data.email); // 'invalid-email'
    await userEvent.tab(); // フォーカスを外してonBlurバリデーションを発生
    
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: メールアドレスのバリデーションエラーが表示される
    await expect(canvas.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument();
    
    // 送信ボタンをクリックしてもフォームは送信されない
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    
    // 成功メッセージは表示されない
    await expect(canvas.queryByText(/お問い合わせを受け付けました/)).not.toBeInTheDocument();
  },
};

// US-002-SC-002-1: 確認後の送信（基本フロー）
export const ConfirmationFlow: Story = {
  name: 'US-002-SC-002-1: 確認後の送信（基本フロー）',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-002-1')!;
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: 有効な情報を入力して送信する
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: フォームが正常に送信される
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};

// US-003-SC-003-1: 入力内容の自動保存と復元
export const AutoSaveRestore: Story = {
  name: 'US-003-SC-003-1: 入力内容の自動保存と復元',
  args: {
    enableAutoSave: true,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-003-1')!;
    
    // Given: 自動保存が有効になっている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: フォームに入力する（自動保存がトリガーされる）
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    
    // 短時間待機（自動保存の遅延を待つ）
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Then: 入力データが保存されていることを確認
    await expect(canvas.getByDisplayValue(testData.data.name)).toBeInTheDocument();
    await expect(canvas.getByDisplayValue(testData.data.email)).toBeInTheDocument();
    await expect(canvas.getByDisplayValue(testData.data.subject)).toBeInTheDocument();
  },
};

// プライバシーポリシー未同意エラー
export const PrivacyPolicyError: Story = {
  name: 'プライバシーポリシー未同意エラー',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/件名/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/プライバシーポリシー/)).toBeInTheDocument();
    
    // When: 有効な情報を入力するがプライバシーポリシーに同意せずに送信する
    await userEvent.type(canvas.getByLabelText(/お名前/), '田中太郎');
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await userEvent.type(canvas.getByLabelText(/件名/), 'テスト件名');
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), 'テストメッセージです。十文字以上入力しています。');
    
    // プライバシーポリシーのチェックボックスはクリックしない（uncheckedのまま）
    
    // Then: プライバシーポリシーのバリデーションエラーが表示される
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    
    // バリデーションエラーメッセージが表示されることを確認
    await expect(await canvas.findByText('プライバシーポリシーへの同意が必要です')).toBeInTheDocument();
    
    // 成功メッセージは表示されない
    await expect(canvas.queryByText(/お問い合わせを受け付けました/)).not.toBeInTheDocument();
  },
};