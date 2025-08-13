# テスト戦略ドキュメント

## 概要

このプロジェクトでは、**ユーザーストーリー駆動テスト**のアプローチを採用し、Storybookを中心としたテスト環境を構築しています。

## テストピラミッドとテスト責務

### 1. Unit Tests (Vitest)
**責務**: ビジネスロジック、バリデーション、ユーティリティ関数のテスト

```
src/components/ContactForm/
├── validation.test.ts          # バリデーションロジック
├── ContactForm.test.tsx        # コンポーネントの単体テスト
└── utils.test.ts              # ユーティリティ関数（必要に応じて）
```

**テスト観点**:
- 入力パラメータと出力の組み合わせ
- エラーハンドリング
- エッジケース
- 純粋関数の動作

### 2. Component Tests (Storybook + Play Functions)
**責務**: ユーザーストーリーベースのコンポーネント統合テスト

```
src/components/ContactForm/
├── ContactForm.stories.tsx              # 基本フォームのシナリオ
└── ContactFormWithConfirmation.stories.tsx  # 確認付きフォームのシナリオ
```

**テスト観点**:
- ユーザーインタラクション
- UI状態の変更
- フォームフロー
- エラー表示
- 成功時の動作

### 3. E2E Tests (将来拡張)
**責務**: アプリケーション全体のワークフローテスト

## ユーザーストーリーとテストの対応関係

### US-001: 問い合わせフォームから連絡を送信する

| シナリオID | テスト種別 | テストファイル | 対象ストーリー |
|-----------|----------|------------|-------------|
| SC-001-1  | Component | ContactForm.stories.tsx | HappyPath |
| SC-001-2  | Component | ContactForm.stories.tsx | RequiredFieldError |
| SC-001-3  | Component | ContactForm.stories.tsx | InvalidEmailError |

### US-002: 入力内容を確認してから送信する

| シナリオID | テスト種別 | テストファイル | 対象ストーリー |
|-----------|----------|------------|-------------|
| SC-002-1  | Component | ContactFormWithConfirmation.stories.tsx | ConfirmAndSubmit |
| SC-002-2  | Component | ContactFormWithConfirmation.stories.tsx | BackToEdit |

### US-003: 入力途中の内容を保持する

| シナリオID | テスト種別 | テストファイル | 対象ストーリー |
|-----------|----------|------------|-------------|
| SC-003-1  | Component | ContactForm.stories.tsx | AutoSaveAndRestore |

## テスト実行方法

### 開発時のテスト実行

```bash
# ユニットテスト（watch mode）
npm run test

# ユニットテスト（UI mode）
npm run test:ui

# カバレッジ付きテスト
npm run test:coverage

# Storybookの起動
npm run storybook

# Storybookのテスト実行
npm run test:storybook
```

### CI/CDでのテスト実行

```bash
# 全テストの実行
npm run test:all
```

## テスト記述ガイドライン

### 1. ユーザーストーリーとの対応を明確にする

各ストーリーのメタデータには対応するユーザーストーリーIDを記載:

```typescript
export const HappyPath: Story = {
  // US-001, SC-001-1 に対応
  play: async ({ canvasElement }) => {
    // テスト実装
  }
};
```

### 2. Given-When-Then構造を意識する

```typescript
// Given: 問い合わせフォームページを開いている
const canvas = within(canvasElement);

// When: 必要な情報を入力して送信ボタンをクリックする
await userEvent.type(nameInput, '田中太郎');
await userEvent.click(submitButton);

// Then: 成功メッセージが表示される
expect(await canvas.findByText('お問い合わせを受け付けました')).toBeInTheDocument();
```

### 3. テストの可読性を重視する

- テスト名は日本語で記述し、何をテストしているかを明確にする
- ユーザーの行動を模擬するテストコードを書く
- アサーションは期待する結果を明確に表現する

### 4. テストデータの管理

ユーザーストーリーファイル（`userStories.ts`）を参照してテストデータを統一:

```typescript
import { contactFormStories } from '../../user-stories/userStories';

const US001 = contactFormStories.find(s => s.id === 'US-001')!;
const SC001_1 = US001.scenarios.find(s => s.id === 'SC-001-1')!;
```

## テストカバレッジ目標

| テスト種別 | カバレッジ目標 | 測定対象 |
|----------|-------------|---------|
| Unit Tests | 90%以上 | ビジネスロジック、バリデーション |
| Component Tests | 100% | ユーザーストーリーのシナリオ |

## トラブルシューティング

### よくある問題と解決方法

1. **Storybookでのテストが失敗する**
   - ブラウザの自動化が正常に動作しているか確認
   - `@storybook/test`が正しくインストールされているか確認

2. **ローカルストレージのテストが不安定**
   - `beforeEach`でストレージをクリアする
   - `vi.clearAllMocks()`でモックをリセットする

3. **非同期処理のテストでタイムアウトが発生**
   - `waitFor`を適切に使用する
   - 必要に応じてタイムアウト値を調整する

## 今後の拡張計画

1. **Visual Regression Testing**
   - Chromatic連携
   - UIの意図しない変更の検出

2. **Accessibility Testing**
   - `@storybook/addon-a11y`の活用
   - アクセシビリティ要件のテスト自動化

3. **Performance Testing**
   - レンダリング時間の測定
   - フォーム操作の応答性テスト

4. **Cross-browser Testing**
   - 複数ブラウザでの動作確認
   - モバイル端末対応のテスト

## まとめ

このテスト戦略により、以下を実現します：

- **プロダクトオーナーが定義したユーザーストーリーの確実な実装**
- **回帰テストによる品質保証**
- **継続的なリファクタリングの安全性確保**
- **開発効率の向上**

テストは品質保証の手段であると同時に、仕様書としての役割も果たします。ユーザーストーリーとテストコードが密接に連携することで、より価値のあるソフトウェアを継続的に開発できます。