/**
 * セマンティックトークン定義
 * 問い合わせフォームアプリケーション用のデザイントークン
 * 一貫性のあるデザインシステムの実現
 */

export const semanticTokens = {
  colors: {
    // ブランドカラー
    'brand.primary': { 
      default: '#0066CC', 
      _dark: '#4A9EFF' 
    },
    'brand.secondary': { 
      default: '#6B7280', 
      _dark: '#9CA3AF' 
    },

    // 基本UIカラー
    'ui.primary': { 
      default: 'blue.500', 
      _dark: 'blue.300' 
    },
    'ui.secondary': { 
      default: 'gray.500', 
      _dark: 'gray.400' 
    },
    'ui.success': { 
      default: 'green.500', 
      _dark: 'green.300' 
    },
    'ui.danger': { 
      default: 'red.500', 
      _dark: 'red.300' 
    },
    'ui.warning': { 
      default: 'orange.500', 
      _dark: 'orange.300' 
    },

    // インタラクティブ要素
    'interactive.primary': { 
      default: '{colors.brand.primary}',
      _hover: '#0052A3',
      _dark: '{colors.brand.primary._dark}'
    },
    'interactive.secondary': { 
      default: '{colors.brand.secondary}',
      _hover: '#4B5563',
      _dark: '{colors.brand.secondary._dark}'
    },
    'interactive.disabled': { 
      default: '#D1D5DB', 
      _dark: '#4B5563' 
    },

    // テキストカラー
    'text.primary': { 
      default: 'gray.800', 
      _dark: 'gray.100' 
    },
    'text.secondary': { 
      default: 'gray.600', 
      _dark: 'gray.400' 
    },
    'text.muted': { 
      default: 'gray.500', 
      _dark: 'gray.500' 
    },

    // ステータス表示
    'status.success': { 
      default: '{colors.ui.success}' 
    },
    'status.error': { 
      default: '{colors.ui.danger}' 
    },
    'status.warning': { 
      default: '{colors.ui.warning}' 
    },
    'status.info': { 
      default: '{colors.ui.primary}' 
    },

    // 問い合わせフォーム関連
    'form.success': { 
      default: '{colors.status.success}',
      bg: 'green.50',
      _dark: { default: 'green.300', bg: 'green.900' }
    },
    'form.error': { 
      default: '{colors.status.error}',
      bg: 'red.50',
      _dark: { default: 'red.300', bg: 'red.900' }
    },
    'form.processing': { 
      default: 'blue.500',
      bg: 'blue.50',
      _dark: { default: 'blue.300', bg: 'blue.900' }
    },

    // フォーム関連
    'form.border': { 
      default: 'gray.200', 
      _dark: 'gray.600' 
    },
    'form.border.focus': { 
      default: '{colors.interactive.primary}' 
    },
    'form.border.error': { 
      default: '{colors.status.error}' 
    },
    'form.bg': { 
      default: 'white', 
      _dark: 'gray.800' 
    },
    'form.bg.disabled': { 
      default: 'gray.50', 
      _dark: 'gray.700' 
    },

    // コンタクトフォーム専用
    'contact.required': { 
      default: '{colors.status.error}' 
    },
    'contact.optional': { 
      default: '{colors.text.muted}' 
    },
    'contact.label': { 
      default: '{colors.text.primary}' 
    }
  },
  
  // サイズトークン
  sizes: {
    'container.sm': { default: '640px' },
    'container.md': { default: '768px' },
    'container.lg': { default: '1024px' },
    'container.xl': { default: '1280px' },
    'table.row.height': { default: '48px' },
    'modal.width.sm': { default: '400px' },
    'modal.width.md': { default: '500px' },
    'modal.width.lg': { default: '600px' },
    'modal.width.xl': { default: '800px' }
  },

  // スペーシングトークン
  space: {
    'component.padding.sm': { default: '8px' },
    'component.padding.md': { default: '16px' },
    'component.padding.lg': { default: '24px' },
    'component.margin.sm': { default: '8px' },
    'component.margin.md': { default: '16px' },
    'component.margin.lg': { default: '24px' }
  },

  // フォントサイズトークン
  fontSizes: {
    'text.xs': { default: '12px' },
    'text.sm': { default: '14px' },
    'text.md': { default: '16px' },
    'text.lg': { default: '18px' },
    'text.xl': { default: '20px' },
    'heading.sm': { default: '18px' },
    'heading.md': { default: '24px' },
    'heading.lg': { default: '32px' },
    'heading.xl': { default: '40px' }
  }
};

export default semanticTokens;