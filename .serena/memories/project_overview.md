# Storybook Sample Modern - プロジェクト概要

## プロジェクトの目的
このプロジェクトは、モダンなフロントエンドテスト戦略の実装例として作成されたものです。Storybook 9.1を中心とした包括的なテストアプローチで、高品質なUIコンポーネントの開発・保守を実現することを目的としています。

## 主な特徴
- **ユーザーストーリー駆動開発**: テストケースをユーザーストーリーと1:1で対応
- **デュアルテスト戦略**: UIテストはStorybook、ロジックテストはVitest
- **Play Function**: ユーザー操作の自動化テスト
- **型安全性**: ZodとTypeScriptによる実行時・コンパイル時の型チェック

## Tech Stack

### フロントエンド基盤
- **React 18**: UIライブラリ
- **TypeScript 5.8**: 型安全性
- **Vite 7.1**: 高速ビルドツール

### フォーム・バリデーション
- **React Hook Form 7.54**: フォーム状態管理
- **Zod 3.24**: スキーマベースバリデーション
- **@hookform/resolvers**: React Hook FormとZodの統合

### テスト関連
- **Storybook 9.1**: UIコンポーネントテスト・ドキュメント
- **Vitest 3.2**: ユニット・統合テスト
- **@storybook/test**: Play Function用テストライブラリ  
- **@storybook/addon-a11y**: アクセシビリティテスト
- **Playwright**: ブラウザベースのテスト実行

### 品質管理
- **ESLint 9.33**: コード品質チェック
- **TypeScript ESLint**: TypeScript用リンター
- **eslint-plugin-storybook**: Storybook用リンター

## システム環境
- **OS**: Darwin (macOS)
- **Node.js**: 20以上（20.19+ 推奨）
- **パッケージマネージャー**: npm