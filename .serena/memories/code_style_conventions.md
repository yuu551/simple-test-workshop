# Storybook Sample Modern - コードスタイルと規約

## 命名規則

### ファイル・ディレクトリ
- **コンポーネント**: PascalCase (例: `ContactForm.tsx`)
- **テストファイル**: `*.test.tsx` または `*.test.ts`
- **Storybookファイル**: `*.stories.tsx`
- **スタイルファイル**: コンポーネント名と同じ (例: `ContactForm.css`)
- **ユーティリティ**: camelCase (例: `validation.ts`)

### 変数・関数
- **変数**: camelCase (例: `submitSuccess`, `watchedValues`)
- **定数**: UPPER_SNAKE_CASE (例: `STORAGE_KEY`)
- **関数**: camelCase (例: `onSubmitHandler`, `getTestDataByScenarioId`)
- **型・インターフェース**: PascalCase (例: `ContactFormProps`, `ContactFormData`)

## TypeScript規約

### 型定義
- Zodスキーマから型を推論 (`z.infer<typeof schema>`)
- Props interfaceは明示的に定義
- exportする型は明示的に `export type` を使用

```typescript
// Good
export type ContactFormData = z.infer<typeof contactFormSchema>;
interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  enableAutoSave?: boolean;
}

// Bad
type ContactFormData = any;
const props = { onSubmit, enableAutoSave };
```

### 型注釈
- React.FCを使用してコンポーネントの型を明示
- イベントハンドラは型を明示的に指定

## React規約

### コンポーネント構造
1. インポート文
2. 型定義・インターフェース
3. 定数定義
4. コンポーネント本体
5. エクスポート

### Hooks使用規則
- カスタムフックは `use` プレフィックス
- useEffectは依存関係を明示的に指定
- useFormはzodResolverと組み合わせて使用

## Storybook規約

### Story命名
- ユーザーストーリーID形式: `US-XXX-SC-XXX-X: 説明`
- 例: `US-001-SC-001-1: 正常な問い合わせ送信`

### Story構造
```typescript
export default {
  title: 'カテゴリ/コンポーネント名',
  component: Component,
  parameters: {
    // a11y設定など
  }
} satisfies Meta<typeof Component>;

export const StoryName: Story = {
  name: 'US-XXX-SC-XXX-X: 説明',
  args: {
    // props
  },
  play: async ({ canvasElement }) => {
    // Play Function
  }
};
```

## CSS規約

### クラス命名
- BEM記法のシンプル版を採用
- コンポーネント名をプレフィックスに使用
- 例: `contact-form-container`, `error-message`, `submit-button`

### スタイル構造
- コンポーネント単位でCSSファイルを作成
- グローバルスタイルは最小限に

## テスト規約

### テスト命名
- 日本語での説明を推奨
- `describe`と`test`/`it`で構造化
- パラメータ化テストは`test.each`を使用

```typescript
describe('ContactFormValidation', () => {
  test('名前フィールドが必須であること', () => {
    // テスト内容
  });
  
  test.each([
    ['', '名前は必須項目です'],
    ['a'.repeat(101), '名前は100文字以内で入力してください']
  ])('バリデーションエラー: %s', (input, expectedError) => {
    // テスト内容
  });
});
```

## コメント規約

- コメントは最小限に（コードで意図を表現）
- 必要な場合は日本語でコメント
- TODOコメントは避ける（Issueで管理）

## エラーハンドリング

- try-catchでエラーを適切にキャッチ
- console.errorでエラーログを出力
- ユーザー向けメッセージは日本語で表示

## アクセシビリティ

- 全てのフォーム要素にラベルを設定
- aria属性を適切に使用
- エラーメッセージは`role="alert"`を付与