# Modern Frontend Testing Strategy with Storybook 9.1 

## 🎯 「こんな方針でテストできます！」

このプロジェクトは、**モダンなフロントエンドテスト戦略**の実装例です。Storybook 9.1を中心とした包括的なテストアプローチで、高品質なUIコンポーネントの開発・保守を実現します。

## 🚀 クイックスタート

### **環境要件**
- Node.js 20以上（20.19+ 推奨）
- npm または yarn

### **セットアップ**
```bash
# 1. 依存関係のインストール
npm install

# 2. Storybookの起動
npm run storybook
# → http://localhost:6006 でStorybookが開きます

# 3. 開発サーバーの起動
npm run dev
# → http://localhost:5173 でアプリケーションが開きます

# 4. テストの実行（CLI）
npm run test          # unit + storybook を一括実行
npm run test:unit     # unit のみ
npm run test:stories  # Storybook のみ（Play Function など）

# 5. 初回のみ（Browser 実行に必要な Playwright のセットアップ）
npx playwright install --with-deps
```

### **主要コマンド**
```bash
npm run storybook           # Storybook開発サーバー起動
npm run build-storybook     # Storybook静的ビルド
npm run test                # unit + storybook を一括実行
npm run test:unit           # ユニットテストのみ
npm run test:stories        # Storybook インタラクションテストのみ
npm run dev                 # Vite開発サーバー起動
npm run build               # プロダクションビルド
```

---

## 📋 テスト戦略の概要

### 🎨 **1. UI（Client Component）テスト - Storybook中心**

**方針**: UIコンポーネントのテストはStorybookで実施
- ✅ **スナップショットテスト**: UI状態の変更を自動検知
- ✅ **Play Function**: ユーザー操作の自動化テスト
- ✅ **アクセシビリティテスト**: WCAG準拠の自動チェック
- ✅ **ビジュアルテスト**: Chromaticとの連携でUIの視覚的回帰テスト

```typescript
// Play Functionの例：フォーム送信フローの自動テスト
export const HappyPath: Story = {
  args: { withAutoSave: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // フォーム入力の自動化
    await userEvent.type(canvas.getByLabelText('名前'), 'テスト太郎');
    await userEvent.type(canvas.getByLabelText('メールアドレス'), 'test@example.com');
    await userEvent.click(canvas.getByRole('checkbox'));
    await userEvent.click(canvas.getByRole('button', { name: '送信' }));
    
    // 結果の自動検証
    await expect(canvas.getByText('送信が完了しました')).toBeInTheDocument();
  }
};
```

### ⚙️ **2. ロジック・スキーマテスト - Vitest**

**方針**: ビジネスロジックとバリデーションはVitestで実施
- ✅ **Zodスキーマテスト**: バリデーションルールの網羅的テスト
- ✅ **パラメータ化テスト**: エラーパターンの列挙テスト
- ✅ **ユニットテスト**: 純粋関数とユーティリティのテスト

```typescript
// Zodスキーマのパラメータ化テスト例
describe('ContactFormValidation', () => {
  test.each([
    ['', 'Name is required'],
    ['a'.repeat(101), 'Name must be at most 100 characters'],
    ['invalid-email', 'Invalid email format']
  ])('バリデーションエラー: %s', (input, expectedError) => {
    const result = contactFormSchema.safeParse({ name: input });
    expect(result.error?.issues[0].message).toBe(expectedError);
  });
});
```

---

## 🏗️ アーキテクチャの特徴

### **Client Componentの設計思想**
```typescript
// ❌ 避けるべき：副作用の多いコンポーネント
function BadComponent() {
  useEffect(() => {
    // APIコール、外部依存、副作用
    fetchUserData();
  }, []);
  return <div>...</div>;
}

// ✅ 推奨：副作用を最小限に抑えたコンポーネント
function GoodComponent({ userData, onSubmit }: Props) {
  // 純粋な表示ロジックのみ
  return <form onSubmit={onSubmit}>...</form>;
}
```

### **テスト責任の明確な分離**

| テスト対象 | 使用ツール | 責任範囲 |
|-----------|-----------|---------|
| **UI動作** | Storybook | ユーザー操作、表示状態、アクセシビリティ |
| **バリデーション** | Vitest | スキーマ検証、エラーパターン、境界値テスト |
| **ビジネスロジック** | Vitest | 計算処理、データ変換、状態管理 |

---

## 📊 実装済みテスト例

### **ユーザーストーリー駆動テスト**

現在実装されているテストシナリオ：

#### 🎯 **US-001: 基本的なフォーム送信**
- ✅ 正常な送信フロー（HappyPath）
- ✅ 必須フィールドエラー（RequiredFieldError）
- ✅ メール形式エラー（InvalidEmailError）
- ✅ プライバシーポリシー同意エラー

#### 🎯 **US-002: 確認画面フロー**
- ✅ 確認画面表示と戻る操作
- ✅ 最終送信の完了フロー

#### 🎯 **US-003: 自動保存機能**
- ✅ ローカルストレージへの自動保存
- ✅ ページリロード後の復元機能

### **アクセシビリティテスト**

```typescript
// 自動a11yチェック例
export default {
  title: 'Forms/ContactForm',
  component: ContactForm,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'label', enabled: true },
          { id: 'aria-required-attr', enabled: true }
        ]
      }
    }
  }
} satisfies Meta<typeof ContactForm>;
```

---

## 🔧 実装例とコードスニペット

### **Storybook Play Function - 実際のコード例**

以下は実際のプロジェクトで実装されているPlay Functionの例です：

```typescript
// US-001-SC-001-1: 正常な問い合わせ送信
export const HappyPath: Story = {
  name: 'US-001-SC-001-1: 正常な問い合わせ送信',
  args: {
    enableAutoSave: false,
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-1')!;
    
    // Given: ユーザーが問い合わせフォームを表示している
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    
    // When: 有効な情報を入力して送信する
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: フォームが送信され、成功メッセージが表示される
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};
```

### **Zodスキーマ定義 - 型安全なバリデーション**

```typescript
// ContactForm用のZodスキーマ定義
export const contactFormSchema = z.object({
  name: z.string()
    .min(1, '名前は必須項目です')
    .max(100, '名前は100文字以内で入力してください')
    .trim(),
  
  email: z.string()
    .min(1, 'メールアドレスは必須項目です')
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください')
    .trim(),
  
  subject: z.string()
    .min(1, '件名は必須項目です')
    .max(200, '件名は200文字以内で入力してください')
    .trim(),
  
  message: z.string()
    .min(1, 'お問い合わせ内容は必須項目です')
    .min(10, 'お問い合わせ内容は10文字以上で入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください')
    .trim(),
  
  privacyPolicy: z.boolean()
    .refine(val => val === true, 'プライバシーポリシーに同意してください')
    .optional()
    .default(false)
});

// 型推論でTypeScript型を自動生成
export type ContactFormData = z.infer<typeof contactFormSchema>;
```

### **テストデータ管理システム**

```typescript
// シナリオベースのテストデータ管理
export const contactFormTestData: TestDataSet[] = [
  {
    scenarioId: 'SC-001-1',
    description: '正常な問い合わせ送信',
    data: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      subject: 'サービスについて',
      message: '詳細を教えてください',
      privacyPolicy: true
    },
    expectedResult: 'success'
  },
  {
    scenarioId: 'SC-001-2',
    description: '必須項目未入力でのエラー',
    data: {
      name: '', // 意図的な空文字
      email: 'tanaka@example.com',
      subject: 'テスト',
      message: 'テストメッセージです。',
      privacyPolicy: true
    },
    expectedResult: 'validation_error',
    expectedErrors: ['名前は必須項目です']
  }
];

// シナリオIDからテストデータを取得
export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined => {
  return contactFormTestData.find(testData => testData.scenarioId === scenarioId);
};
```

### **パラメータ化テスト（Vitest例）**

Storybookでは実現困難な網羅的エラーテストはVitestで実装：

```typescript
// Zodスキーマのパラメータ化テスト例
describe('ContactFormValidation', () => {
  test.each([
    // [入力値, 期待されるエラーメッセージ]
    ['', '名前は必須項目です'],
    ['a'.repeat(101), '名前は100文字以内で入力してください'],
    ['   ', '名前は必須項目です'], // trimされる
  ])('名前フィールドのバリデーション: %s', (input, expectedError) => {
    const result = contactFormSchema.safeParse({ 
      name: input,
      email: 'test@example.com',
      subject: 'test',
      message: 'test message content',
      privacyPolicy: true
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.errors.find(err => err.path[0] === 'name');
      expect(nameError?.message).toBe(expectedError);
    }
  });

  test.each([
    ['invalid-email', '正しいメールアドレスを入力してください'],
    ['', 'メールアドレスは必須項目です'],
    ['a'.repeat(250) + '@example.com', 'メールアドレスは255文字以内で入力してください'],
  ])('メールアドレスのバリデーション: %s', (input, expectedError) => {
    const result = contactFormSchema.safeParse({
      name: 'テスト太郎',
      email: input,
      subject: 'test',
      message: 'test message content',
      privacyPolicy: true
    });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.errors.find(err => err.path[0] === 'email');
      expect(emailError?.message).toBe(expectedError);
    }
  });
});
```

---

## 🚀 テスト実行

### **開発中のテスト**
```bash
# Storybookの起動（開発・テスト用）
npm run storybook

# テストの実行
npm run test          # まとめて実行
npm run test:unit     # unit のみ
npm run test:stories  # Storybook のみ
```

### **CI/CDでのテスト**
```bash
# Storybookインタラクションテストの実行
npm run test:stories

# 静的Storybookのビルド
npm run build-storybook

# ビジュアルテスト（Chromatic連携）
npx chromatic --project-token=<TOKEN>
```

---

## 💡 お客様へのメリット

### **🎨 UI品質の向上**
- **自動化されたユーザー操作テスト**により、リグレッションを早期発見
- **アクセシビリティの自動チェック**で、インクルーシブなUIを保証
- **ビジュアルテスト**で、デザインの意図しない変更を防止

### **⚡ 開発効率の向上**
- **コンポーネント駆動開発**により、独立した開発・テストが可能
- **ユーザーストーリー直結**のテストで、ビジネス要件との齟齬を防止
- **自動化されたテスト実行**で、手動テストコストを削減

### **🔒 品質保証の強化**
- **バリデーションロジックの網羅的テスト**で、データ整合性を保証
- **エッジケースの自動検証**で、予期しないエラーを防止
- **継続的なテスト実行**で、コードベースの健全性を維持

---

## 📚 技術スタック

### **テスト関連**
- **Storybook 9.1**: UIコンポーネントテスト・ドキュメント
- **Vitest**: ユニット・統合テスト
- **@storybook/test**: Play Function用テストライブラリ
- **@storybook/addon-a11y**: アクセシビリティテスト

### **フォーム・バリデーション**
- **React Hook Form**: フォーム状態管理
- **Zod**: スキーマベースバリデーション
- **@hookform/resolvers**: Zodとの統合

### **開発基盤**
- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: 高速ビルドツール

---

## 🎓 ベストプラクティス

### **Client Componentの設計**
1. **副作用の最小化**: APIコールやグローバル状態変更を避ける
2. **Props駆動**: 外部データは必ずPropsとして受け取る
3. **Pure Function**: 同じ入力に対して同じ出力を保証

### **テストの優先順位**
1. **Happy Path**: まず正常フローを確実にテスト
2. **エラーケース**: 予想される失敗パターンを網羅
3. **エッジケース**: 境界値や極端な入力値をテスト

### **Story組織化**
1. **ユーザーストーリー連携**: ビジネス要件とStoryを1:1で対応
2. **命名規則**: `US-XXX-SC-XXX-X`形式でトレーサビリティを確保
3. **テストデータ管理**: 中央集権的なテストデータ管理

---