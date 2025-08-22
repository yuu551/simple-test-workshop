/**
 * Chakra UI v3 カスタムテーマ統合
 * sample_ui.mdの指針に基づくテーマ設定
 */

// import { semanticTokens } from './semantic-tokens';

// Chakra UI v3 ではsemantic tokensを単純なオブジェクトとして定義
export const customTheme = {
  semanticTokens: {
    colors: {
      // ブランド関連
      'brand.primary': { 
        _light: 'blue.500', 
        _dark: 'blue.300' 
      },
      'brand.secondary': { 
        _light: 'gray.500', 
        _dark: 'gray.400' 
      },
      
      // UI基本色
      'ui.primary': { 
        _light: 'blue.500', 
        _dark: 'blue.300' 
      },
      'ui.success': { 
        _light: 'green.500', 
        _dark: 'green.300' 
      },
      'ui.error': { 
        _light: 'red.500', 
        _dark: 'red.300' 
      },
      'ui.warning': { 
        _light: 'orange.500', 
        _dark: 'orange.300' 
      },

      // デバイスステータス
      'device.active': {
        _light: 'green.500',
        _dark: 'green.300'
      },
      'device.inactive': {
        _light: 'red.500', 
        _dark: 'red.300'
      },
      'device.maintenance': {
        _light: 'orange.500',
        _dark: 'orange.300'
      }
    }
  }
};

export default customTheme;