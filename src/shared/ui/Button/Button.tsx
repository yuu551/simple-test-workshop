import React from 'react';
import './Button.css';

export interface ButtonProps {
  /** ボタンのバリアント */
  variant?: 'primary' | 'secondary';
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
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    loading && 'button--loading',
    disabled && 'button--disabled'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="button__spinner" aria-hidden="true" />
          <span className="button__text">読み込み中...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};