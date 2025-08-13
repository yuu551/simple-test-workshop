import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

describe('ContactForm', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('フォームが正しくレンダリングされる', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/お名前/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByLabelText(/件名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/お問い合わせ内容/)).toBeInTheDocument();
    expect(screen.getByLabelText(/プライバシーポリシー/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /送信/ })).toBeInTheDocument();
  });

  it('全ての必須項目に入力してフォームを送信できる', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    await user.click(screen.getByLabelText(/プライバシーポリシー/));
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true
      });
    });
  });

  it('必須項目が未入力の場合はエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('名前は必須項目です')).toBeInTheDocument();
      expect(screen.getByText('メールアドレスは必須項目です')).toBeInTheDocument();
      expect(screen.getByText('件名は必須項目です')).toBeInTheDocument();
      expect(screen.getByText('お問い合わせ内容は必須項目です')).toBeInTheDocument();
      expect(screen.getByText('プライバシーポリシーに同意してください')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('不正なメールアドレス形式の場合はエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'invalid-email');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    await user.click(screen.getByLabelText(/プライバシーポリシー/));
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('正しいメールアドレスを入力してください')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('送信成功時に成功メッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    await user.click(screen.getByLabelText(/プライバシーポリシー/));
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('お問い合わせを受け付けました')).toBeInTheDocument();
    });
  });

  it('メッセージが10文字未満の場合はエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), '短い');
    await user.click(screen.getByLabelText(/プライバシーポリシー/));
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('お問い合わせ内容は10文字以上で入力してください')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('プライバシーポリシーに同意していない場合はエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    // プライバシーポリシーのチェックボックスはクリックしない
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('プライバシーポリシーに同意してください')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('送信成功後にフォームがクリアされる', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const nameInput = screen.getByLabelText(/お名前/) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/メールアドレス/) as HTMLInputElement;
    const subjectInput = screen.getByLabelText(/件名/) as HTMLInputElement;
    const messageInput = screen.getByLabelText(/お問い合わせ内容/) as HTMLTextAreaElement;
    const privacyCheckbox = screen.getByLabelText(/プライバシーポリシー/) as HTMLInputElement;
    
    await user.type(nameInput, '田中太郎');
    await user.type(emailInput, 'tanaka@example.com');
    await user.type(subjectInput, 'テスト件名');
    await user.type(messageInput, 'これは10文字以上のテストメッセージです。');
    await user.click(privacyCheckbox);
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
      expect(privacyCheckbox.checked).toBe(false);
    });
  });

  it('入力中にエラーメッセージが消える', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(screen.getByText('名前は必須項目です')).toBeInTheDocument();
    });
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    
    // onBlurバリデーションによりエラーが消える
    await waitFor(() => {
      expect(screen.queryByText('名前は必須項目です')).not.toBeInTheDocument();
    });
  });

  describe('自動保存機能', () => {
    it('自動保存が有効な場合、入力内容がローカルストレージに保存される', async () => {
      const user = userEvent.setup();
      render(<ContactForm enableAutoSave={true} />);
      
      await user.type(screen.getByLabelText(/お名前/), '田中太郎');
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'contact-form-draft',
          expect.stringContaining('"name":"田中太郎"')
        );
      }, { timeout: 1000 });
      
      // タイムスタンプが含まれていることを確認
      const callArgs = vi.mocked(localStorage.setItem).mock.calls.find(
        call => call[0] === 'contact-form-draft'
      );
      if (callArgs) {
        const savedData = JSON.parse(callArgs[1]);
        expect(savedData).toHaveProperty('data');
        expect(savedData).toHaveProperty('timestamp');
        expect(savedData.data.name).toBe('田中太郎');
        expect(typeof savedData.timestamp).toBe('number');
      }
    });

    it('自動保存が無効な場合、ローカルストレージに保存されない', async () => {
      const user = userEvent.setup();
      render(<ContactForm enableAutoSave={false} />);
      
      await user.type(screen.getByLabelText(/お名前/), '田中太郎');
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('保存されたデータからフォームが復元される', () => {
      const savedData = {
        data: {
          name: '保存された名前',
          email: 'saved@example.com',
          subject: '保存された件名',
          message: '保存されたメッセージ',
          privacyPolicy: false
        },
        timestamp: Date.now() - 30 * 60 * 1000 // 30分前（1時間以内）
      };
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedData));
      
      render(<ContactForm enableAutoSave={true} />);
      
      expect(screen.getByDisplayValue('保存された名前')).toBeInTheDocument();
      expect(screen.getByDisplayValue('saved@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('保存された件名')).toBeInTheDocument();
      expect(screen.getByDisplayValue('保存されたメッセージ')).toBeInTheDocument();
    });

    it('1時間を超えた古い保存データは復元されない', () => {
      const oldSavedData = {
        data: {
          name: '古いデータ',
          email: 'old@example.com',
          subject: '古い件名',
          message: '古いメッセージ',
          privacyPolicy: false
        },
        timestamp: Date.now() - 2 * 60 * 60 * 1000 // 2時間前
      };
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(oldSavedData));
      
      render(<ContactForm enableAutoSave={true} />);
      
      expect(screen.queryByDisplayValue('古いデータ')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('old@example.com')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('古い件名')).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue('古いメッセージ')).not.toBeInTheDocument();
    });

    it('送信成功後に保存されたデータがクリアされる', async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} enableAutoSave={true} />);
      
      await user.type(screen.getByLabelText(/お名前/), '田中太郎');
      await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
      await user.type(screen.getByLabelText(/件名/), 'テスト件名');
      await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
      await user.click(screen.getByLabelText(/プライバシーポリシー/));
      
      await user.click(screen.getByRole('button', { name: /送信/ }));
      
      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('contact-form-draft');
      });
    });
  });

  it('送信中はボタンが無効化される', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    await user.type(screen.getByLabelText(/メールアドレス/), 'tanaka@example.com');
    await user.type(screen.getByLabelText(/件名/), 'テスト件名');
    await user.type(screen.getByLabelText(/お問い合わせ内容/), 'これは10文字以上のテストメッセージです。');
    await user.click(screen.getByLabelText(/プライバシーポリシー/));
    
    const submitButton = screen.getByRole('button', { name: /送信/ });
    await user.click(submitButton);
    
    expect(screen.getByRole('button', { name: /送信中.../ })).toBeDisabled();
  });
});