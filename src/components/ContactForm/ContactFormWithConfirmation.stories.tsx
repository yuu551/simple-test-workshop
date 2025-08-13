import type { Meta, StoryObj } from '@storybook/react';
import { ContactFormWithConfirmation } from './ContactFormWithConfirmation';

const meta = {
  title: 'Forms/ContactFormWithConfirmation',
  component: ContactFormWithConfirmation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContactFormWithConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    enableAutoSave: true,
  },
};

const US002 = contactFormStories.find(s => s.id === 'US-002')!;
const SC002_1 = US002.scenarios.find(s => s.id === 'SC-002-1')!;

export const ConfirmAndSubmit: Story = {
  args: {
    enableAutoSave: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const nameInput = canvas.getByLabelText(/名前/);
    const emailInput = canvas.getByLabelText(/メールアドレス/);
    const subjectInput = canvas.getByLabelText(/件名/);
    const messageInput = canvas.getByLabelText(/本文/);
    const confirmButton = canvas.getByRole('button', { name: /確認/ });

    await userEvent.type(nameInput, '佐藤次郎');
    await userEvent.type(emailInput, 'sato@example.com');
    await userEvent.type(subjectInput, 'お見積もりについて');
    await userEvent.type(messageInput, '見積もりをお願いします');

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(canvas.getByText('入力内容の確認')).toBeInTheDocument();
    });

    expect(canvas.getByText('佐藤次郎')).toBeInTheDocument();
    expect(canvas.getByText('sato@example.com')).toBeInTheDocument();
    expect(canvas.getByText('お見積もりについて')).toBeInTheDocument();
    expect(canvas.getByText('見積もりをお願いします')).toBeInTheDocument();

    const submitButton = canvas.getByRole('button', { name: /送信/ });
    await userEvent.click(submitButton);

    await waitFor(async () => {
      const successMessage = await canvas.findByText('お問い合わせを受け付けました');
      expect(successMessage).toBeInTheDocument();
    });
  },
};

const SC002_2 = US002.scenarios.find(s => s.id === 'SC-002-2')!;

export const BackToEdit: Story = {
  args: {
    enableAutoSave: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const nameInput = canvas.getByLabelText(/名前/);
    const emailInput = canvas.getByLabelText(/メールアドレス/);
    const subjectInput = canvas.getByLabelText(/件名/);
    const messageInput = canvas.getByLabelText(/本文/);
    const confirmButton = canvas.getByRole('button', { name: /確認/ });

    const testData = {
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      subject: 'サービスの詳細',
      message: '詳細情報を教えてください'
    };

    await userEvent.type(nameInput, testData.name);
    await userEvent.type(emailInput, testData.email);
    await userEvent.type(subjectInput, testData.subject);
    await userEvent.type(messageInput, testData.message);

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(canvas.getByText('入力内容の確認')).toBeInTheDocument();
    });

    const backButton = canvas.getByRole('button', { name: /戻る/ });
    await userEvent.click(backButton);

    await waitFor(() => {
      const editNameInput = canvas.getByLabelText(/名前/);
      expect(editNameInput).toHaveValue(testData.name);
      
      const editEmailInput = canvas.getByLabelText(/メールアドレス/);
      expect(editEmailInput).toHaveValue(testData.email);
      
      const editSubjectInput = canvas.getByLabelText(/件名/);
      expect(editSubjectInput).toHaveValue(testData.subject);
      
      const editMessageInput = canvas.getByLabelText(/本文/);
      expect(editMessageInput).toHaveValue(testData.message);
    });
  },
};

export const ValidationOnConfirm: Story = {
  args: {
    enableAutoSave: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const emailInput = canvas.getByLabelText(/メールアドレス/);
    const confirmButton = canvas.getByRole('button', { name: /確認/ });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(canvas.getByText('名前は必須項目です')).toBeInTheDocument();
      expect(canvas.getByText('正しいメールアドレスを入力してください')).toBeInTheDocument();
      expect(canvas.getByText('件名は必須項目です')).toBeInTheDocument();
      expect(canvas.getByText('本文は必須項目です')).toBeInTheDocument();
    });

    const confirmationTitle = canvas.queryByText('入力内容の確認');
    expect(confirmationTitle).not.toBeInTheDocument();
  },
};

export const CompleteFlow: Story = {
  args: {
    enableAutoSave: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const testData = {
      name: '高橋太郎',
      email: 'takahashi@example.com',
      subject: '製品デモのリクエスト',
      message: '製品のデモンストレーションを希望します。\n可能な日時を教えてください。'
    };

    const nameInput = canvas.getByLabelText(/名前/);
    const emailInput = canvas.getByLabelText(/メールアドレス/);
    const subjectInput = canvas.getByLabelText(/件名/);
    const messageInput = canvas.getByLabelText(/本文/);
    const confirmButton = canvas.getByRole('button', { name: /確認/ });

    await userEvent.type(nameInput, testData.name);
    await userEvent.type(emailInput, testData.email);
    await userEvent.type(subjectInput, testData.subject);
    await userEvent.type(messageInput, testData.message);

    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(canvas.getByText('入力内容の確認')).toBeInTheDocument();
    });

    expect(canvas.getByText(testData.name)).toBeInTheDocument();
    expect(canvas.getByText(testData.email)).toBeInTheDocument();
    expect(canvas.getByText(testData.subject)).toBeInTheDocument();

    const backButton = canvas.getByRole('button', { name: /戻る/ });
    await userEvent.click(backButton);

    await waitFor(() => {
      const editConfirmButton = canvas.getByRole('button', { name: /確認/ });
      expect(editConfirmButton).toBeInTheDocument();
    });

    const editNameInput = canvas.getByLabelText(/名前/);
    await userEvent.clear(editNameInput);
    await userEvent.type(editNameInput, '高橋花子');

    const editConfirmButton = canvas.getByRole('button', { name: /確認/ });
    await userEvent.click(editConfirmButton);

    await waitFor(() => {
      expect(canvas.getByText('入力内容の確認')).toBeInTheDocument();
      expect(canvas.getByText('高橋花子')).toBeInTheDocument();
    });

    const submitButton = canvas.getByRole('button', { name: /送信/ });
    await userEvent.click(submitButton);

    await waitFor(async () => {
      const successMessage = await canvas.findByText('お問い合わせを受け付けました');
      expect(successMessage).toBeInTheDocument();
    });
  },
};