"use client"

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { semanticTokens } from "@/shared/theme/semantic-tokens"

// セマンティックトークンを統合したカスタムシステム
const customSystem = createSystem(defaultConfig, {
  semanticTokens,
  globalCss: {
    // 全体的なテキスト色をセマンティックトークンに基づいて設定
    body: {
      color: 'text.primary',
      backgroundColor: 'form.bg',
    },
    // Chakra UIのフィールドラベル色
    '.chakra-field__label': {
      color: 'contact.label',
    },
    // Chakra UIのテキスト色
    '.chakra-text': {
      color: 'text.primary',
    },
    // 必須マーク以外のテキスト色
    'label': {
      color: 'contact.label',
    },
    // 入力フィールドの色
    '.chakra-input, .chakra-textarea': {
      color: 'text.primary',
      backgroundColor: 'form.bg',
      borderColor: 'form.border',
      '&:focus': {
        borderColor: 'form.border.focus',
      },
      '&[aria-invalid="true"]': {
        borderColor: 'form.border.error',
      },
    },
    // カスタムチェックボックス - セマンティックトークンを使用
    '.custom-checkbox': {
      width: '16px',
      height: '16px',
      backgroundColor: 'form.bg',
      border: '2px solid {colors.form.border}',
      borderRadius: '2px',
      cursor: 'pointer',
      margin: '0 8px 0 0',
      verticalAlign: 'middle',
      appearance: 'auto',
      WebkitAppearance: 'checkbox',
      accentColor: '{colors.interactive.primary}',
    }
  }
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
