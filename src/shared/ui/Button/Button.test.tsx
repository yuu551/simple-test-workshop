import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('レンダリング', () => {
    it('子要素を正しくレンダリングする', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('デフォルトでprimaryバリアントとしてレンダリングされる', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    it('secondaryバリアントが適用される', () => {
      render(<Button variant="secondary">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--secondary');
    });
  });

  describe('サイズ', () => {
    it('smallサイズが適用される', () => {
      render(<Button size="small">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--small');
    });

    it('mediumサイズがデフォルトで適用される', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--medium');
    });

    it('largeサイズが適用される', () => {
      render(<Button size="large">Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--large');
    });
  });

  describe('状態', () => {
    it('disabled状態が正しく適用される', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');
    });

    it('loading状態が正しく適用される', () => {
      render(<Button loading>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--loading');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });

    it('fullWidth状態が正しく適用される', () => {
      render(<Button fullWidth>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--full-width');
    });
  });

  describe('インタラクション', () => {
    it('クリックイベントが正しく発火する', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Button</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled状態の時はクリックイベントが発火しない', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Button</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('loading状態の時はクリックイベントが発火しない', () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Button</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('ボタンタイプ', () => {
    it('デフォルトでtype="button"が設定される', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('type="submit"が正しく設定される', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('type="reset"が正しく設定される', () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });
});