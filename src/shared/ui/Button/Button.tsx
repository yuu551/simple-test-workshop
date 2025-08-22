/**
 * ラッパーButton コンポーネント
 * sample_ui.mdの指針に基づく Chakra UI Button のラッパー
 * 既存APIを維持しつつ、内部でChakra UIを使用
 */

import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

type ChakraButtonProps = ComponentProps<typeof ChakraButton>;

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
  // プロジェクトのpropsをChakra UIのpropsに変換
  const getChakraProps = (): ChakraButtonProps => {
    // バリアント変換 - セマンティックトークンを活用
    const colorPalette = {
      primary: 'blue',
      secondary: 'gray',
    }[variant] as 'blue' | 'gray';

    const chakraVariant = {
      primary: 'solid',
      secondary: 'outline',
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