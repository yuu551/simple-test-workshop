/**
 * テスト用ユーティリティ
 * Chakra UI Provider付きのレンダリング関数
 */

import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from '@/app/providers';

// カスタムレンダー関数
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };