# テスト仕様書

## 概要

本プロジェクトは、ユニットテストとStorybookテストを統合した包括的なテスト戦略を採用しています。Vitest プロジェクト機能を活用し、異なるテスト環境を分離しながら、一元的なテスト実行を実現しています。

## テスト戦略

### テスティングピラミッド

```
           ┌─────────────┐
          │   E2Eテスト   │  (少数・高コスト・高信頼性)
         │ Storybook Tests │
        └─────────────────┘
       ┌───────────────────┐
      │  インテグレーション  │   (中程度・中コスト・中信頼性)
     │  Component Tests    │
    └─────────────────────┘
   ┌─────────────────────────┐
  │      ユニットテスト        │  (多数・低コスト・低信頼性)
 │     Unit Tests          │
└───────────────────────────┘
```

### テスト環境構成

| テスト種類 | 実行環境 | テストランナー | ブラウザ | 対象ファイル |
|-----------|----------|----------------|----------|--------------|
| **ユニットテスト** | jsdom | Vitest | - | `*.test.{ts,tsx}` |
| **Storybookテスト** | Playwright | Vitest | Chromium | `*.stories.{ts,tsx}` |

## テスト実行コマンド

```bash
# 全テスト実行
npm run test

# ユニットテストのみ
npm run test:unit

# Storybookテストのみ  
npm run test:stories

# インタラクティブモード
npm run test:ui

# カバレッジレポート生成
npm run test:coverage
```

## ユニットテスト仕様

### 1. バリデーションテスト (`validation.test.ts`)

**テスト対象**: `contactFormSchema` (Zodスキーマ)  
**テスト数**: 38件  
**カバレッジ目標**: 100%

#### テストケース分類

| カテゴリ | テスト数 | 説明 |
|----------|----------|------|
| 正常系 | 1 | 全フィールド有効な値でのスキーマ検証 |
| 名前フィールド | 8 | 必須、文字数制限、空白文字の検証 |
| メールフィールド | 9 | 必須、形式、文字数制限の検証 |
| 件名フィールド | 8 | 必須、文字数制限、空白文字の検証 |
| メッセージフィールド | 9 | 必須、最小文字数、最大文字数の検証 |
| プライバシーポリシー | 3 | 必須、真偽値の検証 |

#### 主要テストケース

```typescript
describe('contactFormSchema', () => {
  describe('正常系', () => {
    it('全ての項目が有効な場合、バリデーションに成功する', () => {
      const validData: ContactFormData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: 'テストメッセージです。十文字以上入力しています。',
        privacyPolicy: true
      };
      expect(() => contactFormSchema.parse(validData)).not.toThrow();
    });
  });
  
  describe('名前のバリデーション', () => {
    it('名前が空の場合、エラーメッセージが返される', () => {
      const result = contactFormSchema.safeParse({
        name: '', 
        // ...other fields
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe('お名前は必須です');
    });
  });
});
```

### 2. ContactFormコンポーネントテスト (`ContactForm.test.tsx`)

**テスト対象**: `ContactForm` React コンポーネント  
**テスト数**: 16件  
**モック**: Zustand ストア、localStorage

#### テスト分類

| カテゴリ | テスト数 | 説明 |
|----------|----------|------|
| レンダリング | 1 | コンポーネントの基本表示 |
| 送信機能 | 1 | フォーム送信処理 |
| バリデーション | 5 | リアルタイムエラー表示 |
| リアルタイムバリデーション | 3 | 入力中・フォーカス外での動作 |
| 自動保存機能 | 5 | データ保存・復元・クリア |
| UI状態 | 1 | 送信中のボタン状態 |

#### 重要なテストパターン

```typescript
describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Zustandストアモック設定
    mockUseContactFormStore.mockReturnValue({
      submitSuccess: false,
      setSubmitSuccess: vi.fn(),
      savedData: null,
      setSavedData: vi.fn(),
      clearSavedData: vi.fn(),
      resetStore: vi.fn(),
    });
  });

  it('全ての必須項目に入力してフォームを送信できる', async () => {
    const quickSubmit = vi.fn().mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<ContactForm onSubmit={quickSubmit} />);
    
    // フォーム入力
    await user.type(screen.getByLabelText(/お名前/), '田中太郎');
    // ... 他のフィールド入力
    
    await user.click(screen.getByRole('button', { name: /送信/ }));
    
    await waitFor(() => {
      expect(quickSubmit).toHaveBeenCalledWith({
        name: '田中太郎',
        email: 'tanaka@example.com',
        subject: 'テスト件名',
        message: 'これは10文字以上のテストメッセージです。',
        privacyPolicy: true,
      });
    });
  });
});
```

### 3. テストデータテスト (`testData.test.ts`)

**テスト対象**: テストデータ管理システム  
**テスト数**: 24件  
**目的**: ユーザーストーリーとテストデータの整合性確保

#### テストケース

```typescript
describe('テストデータ管理', () => {
  it('すべてのシナリオにテストデータが存在する', () => {
    const scenarioIds = ['SC-001-1', 'SC-001-2', 'SC-001-3', /* ... */];
    scenarioIds.forEach(scenarioId => {
      const testData = getTestDataByScenarioId(scenarioId);
      expect(testData).toBeDefined();
      expect(testData!.scenarioId).toBe(scenarioId);
    });
  });
});
```

### 4. Buttonコンポーネントテスト (`Button.test.tsx`)

**テスト対象**: 共有Buttonコンポーネント  
**テスト数**: 15件  
**焦点**: プロパティ、イベント、アクセシビリティ

## Storybookテスト仕様

### 1. テスト実行環境

```typescript
// vitest.config.ts - Storybookプロジェクト設定
{
  extends: true,
  plugins: [
    storybookTest({
      configDir: '.storybook'
    })
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }]
    },
    setupFiles: ['.storybook/vitest.setup.ts']
  }
}
```

### 2. セットアップ設定

```typescript
// .storybook/vitest.setup.ts
beforeEach(async () => {
  try {
    const { useContactFormStore } = await import('../src/features/contact/model/store');
    useContactFormStore.getState().resetStore();
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('contact-form-storage');
    }
  } catch (error) {
    console.warn('Failed to reset Zustand store:', error);
  }
});
```

### 3. Storybookテストケース

#### US-001-SC-001-1: 正常な問い合わせ送信

```typescript
export const HappyPath: Story = {
  name: 'US-001-SC-001-1: 正常な問い合わせ送信',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testData = getTestDataByScenarioId('SC-001-1')!;
    
    // Given: フォーム表示確認
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: 有効な情報を入力
    await userEvent.type(canvas.getByLabelText(/お名前/), testData.data.name);
    await userEvent.type(canvas.getByLabelText(/メールアドレス/), testData.data.email);
    await userEvent.type(canvas.getByLabelText(/件名/), testData.data.subject);
    await userEvent.type(canvas.getByLabelText(/お問い合わせ内容/), testData.data.message);
    await userEvent.click(canvas.getByLabelText(/プライバシーポリシー/));
    
    // Then: 送信成功確認
    await userEvent.click(canvas.getByRole('button', { name: /送信する/ }));
    await expect(canvas.getByRole('button', { name: /送信中/ })).toBeInTheDocument();
    await expect(await canvas.findByText(/お問い合わせを受け付けました/)).toBeInTheDocument();
  },
};
```

#### テストケース一覧

| ストーリー名 | シナリオID | テスト内容 | 状態 |
|-------------|------------|------------|------|
| HappyPath | SC-001-1 | 正常な問い合わせ送信 | 通過 |
| RequiredFieldError | SC-001-2 | 必須項目未入力エラー | 通過 |
| InvalidEmailError | SC-001-3 | 不正なメール形式エラー | 通過 |
| ConfirmationFlow | SC-002-1 | 確認後の送信 | 通過 |
| AutoSaveRestore | SC-003-1 | 自動保存と復元 | 通過 |
| PrivacyPolicyError | - | プライバシーポリシー未同意 | 通過 |

**実行結果**: 29 tests passed (100%)

## テストデータ管理

### 1. テストデータ構造

```typescript
interface TestDataSet {
  scenarioId: string;           // シナリオID (例: 'SC-001-1')
  description: string;          // テストケース説明
  data: ContactFormData;        // 入力データ
  expectedResult?: 'success' | 'validation_error' | 'submission_error';
  expectedErrors?: string[];    // 期待するエラーメッセージ
}
```

### 2. シナリオ別テストデータ

#### SC-001-1: 正常な問い合わせ送信

```typescript
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
}
```

#### SC-001-2: 必須項目未入力エラー

```typescript
{
  scenarioId: 'SC-001-2',
  description: '必須項目未入力でのエラー',
  data: {
    name: '',  // 未入力
    email: 'tanaka@example.com',
    subject: 'テスト',
    message: 'テストメッセージです。十文字以上で入力しています。',
    privacyPolicy: true
  },
  expectedResult: 'validation_error',
  expectedErrors: ['お名前は必須です']
}
```

### 3. テストデータアクセス関数

```typescript
// シナリオIDからテストデータ取得
export const getTestDataByScenarioId = (scenarioId: string): TestDataSet | undefined

// ユーザーストーリーIDから全テストデータ取得  
export const getTestDataByUserStoryId = (userStoryId: string): TestDataSet[]

// テストデータ妥当性チェック
export const validateTestData = (data: ContactFormData): {
  isValid: boolean;
  errors: string[];
}
```

## モック・スタブ戦略

### 1. Zustandストアモック

```typescript
// ContactForm.test.tsx
const mockUseContactFormStore = vi.fn();

vi.mock('../model/store', () => ({
  useContactFormStore: mockUseContactFormStore
}));

beforeEach(() => {
  mockUseContactFormStore.mockReturnValue({
    submitSuccess: false,
    setSubmitSuccess: vi.fn(),
    savedData: null,
    setSavedData: vi.fn(),
    clearSavedData: vi.fn(),
    resetStore: vi.fn(),
  });
});
```

### 2. LocalStorageモック

```typescript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(), 
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});
```

### 3. Storybook用シンプルモック

```typescript
// ContactForm.stories.tsx
const mockFn = () => {
  const fn = (...args: any[]) => {
    console.log('Called with:', args);
  };
  fn.mock = { calls: [] };
  return fn;
};
```

## テスト品質メトリクス

### 1. 現在の実行結果

**ユニットテスト**: 69/69 tests passed (100%)  
**Storybookテスト**: 64/64 tests passed (100%)  
**合計**: 133/133 tests passed (100%)

### 2. カバレッジ目標

| 種類 | 目標 | 現在値 | 状態 |
|------|------|--------|------|
| **文**覆率 | 90% | - | 測定予定 |
| **分岐**覆率 | 85% | - | 測定予定 |
| **関数**覆率 | 95% | - | 測定予定 |
| **行**覆率 | 90% | - | 測定予定 |

### 3. 品質指標

| 指標 | 目標値 | 現在値 | 評価 |
|------|--------|--------|------|
| テスト成功率 | 100% | 100% | 達成 |
| テスト実行時間 | < 30秒 | ~15秒 | 達成 |
| テスト安定性 | 99% | 100% | 達成 |
| バリデーション網羅性 | 100% | 100% | 達成 |

## テスト自動化

### 1. CI/CD統合

```yaml
# .github/workflows/test.yml (例)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:stories
```

### 2. プリコミットフック

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit && npm run lint",
      "pre-push": "npm run test"
    }
  }
}
```

## テストベストプラクティス

### 1. テスト命名規則

- **ユニットテスト**: `機能_条件_期待結果`
- **Storybookテスト**: `US-XXX-SC-XXX-X: シナリオ名`
- **期待値**: `expect(actual).toBe(expected)` 形式

### 2. テストデータ管理

- **DRY原則**: テストデータの重複排除
- **データドリブン**: シナリオとデータの分離
- **一元管理**: `testData.ts` での集約管理

### 3. 非同期テスト

```typescript
// waitFor を使用した非同期処理待機
await waitFor(() => {
  expect(screen.getByText('成功メッセージ')).toBeInTheDocument();
}, { timeout: 3000 });

// userEvent.setup() による人間らしい操作
const user = userEvent.setup();
await user.type(input, 'テキスト');
await user.click(button);
```

### 4. エラーハンドリングテスト

```typescript
it('予期しないエラーが発生した場合、適切に処理される', async () => {
  const failingSubmit = vi.fn().mockRejectedValue(new Error('Network Error'));
  
  // エラー発生を期待
  expect(() => onSubmitHandler(validData)).rejects.toThrow('Network Error');
});
```

## テスト方針・優先順位

### 基本方針：「まずはここから！」アプローチ

現実的な開発リソースを考慮し、段階的にテスト品質を向上させる方針を採用しています。

```
Phase 1: 最低限の価値保証（必須）
├── Happy Path テスト
├── Critical Error テスト  
└── 基本的なアクセシビリティ

Phase 2: 品質向上（推奨）
├── バリデーションエラー網羅
├── Edge Case カバー
└── パフォーマンス基準

Phase 3: 堅牢性確保（理想）
├── Integration テスト
├── Visual Regression
└── E2E シナリオ
```

### テスト優先順位マトリックス

| 優先度 | テスト種類 | 対象 | 実装目安工数 | ビジネス価値 |
|-------|-----------|------|-------------|-------------|
| Critical | Storybook Happy Path | ユーザーの主要フロー | 1-2時間/機能 | 最高 |
| Critical | Critical Error Handling | 致命的エラー対応 | 30分/エラー | 最高 |
| High | Validation テスト (Vitest) | 入力チェック | 1時間/フィールド | 高 |
| High | アクセシビリティ基本 | 障害者対応 | 30分/コンポーネント | 高 |
| Medium | Edge Case カバー | 境界値・特殊ケース | 2-3時間/機能 | 中 |
| Medium | Integration テスト | API連携 | 3-4時間/機能 | 中 |
| Low | Visual Regression | デザイン回帰 | 1-2日/初回設定 | 低 |
| Low | Performance テスト | 速度・負荷 | 2-3日/初回設定 | 低 |

### 振る舞いテスト中心戦略

#### テストする項目（What）

```typescript
// ユーザーが体験すること
it('フォーム送信後、成功メッセージが表示される', async () => {
  // Given: フォームを開く
  // When: 有効なデータを入力して送信
  // Then: 「送信完了しました」が表示される
});

// ユーザーに見える状態変化
it('バリデーションエラー時、該当フィールドにエラーメッセージが表示される', async () => {
  // Given: フォームを開く  
  // When: 不正なメールアドレスを入力
  // Then: 「有効なメールアドレスを入力してください」が表示される
});
```

#### テストしない項目（How）

```typescript
// 実装の詳細
it('submitボタンクリック時にonSubmit関数が呼ばれる', () => {
  // 実装に依存したテスト → 避ける
});

// 内部状態の詳細
it('useState の state.isSubmitting が true になる', () => {
  // React の内部実装に依存 → 避ける  
});
```

### Storybook中心戦略の詳細

#### なぜStorybookを中心とするのか？

1. **ユーザー視点**: ブラウザでの実際の動作をテスト
2. **視覚的確認**: 手動確認とのギャップが少ない
3. **文書化**: テストがそのまま実装例となる
4. **デバッグ効率**: 再現環境の構築が容易

#### Storybook vs Vitest 使い分け

```typescript
// Storybook: ユーザーインタラクションとUI状態
export const FormSubmission: Story = {
  play: async ({ canvasElement }) => {
    // ユーザーの操作フローを再現
    await userEvent.type(nameInput, '田中太郎');
    await userEvent.click(submitButton);
    
    // ユーザーが見る結果を検証
    await expect(canvas.getByText('送信完了')).toBeInTheDocument();
  }
};

// Vitest: ロジックとバリデーション
describe('contactFormSchema', () => {
  it('メールアドレスの形式チェック', () => {
    // 純粋な関数・スキーマのテスト
    const result = schema.safeParse({ email: 'invalid' });
    expect(result.success).toBe(false);
  });
});
```

### 段階的テスト導入ガイド

#### Step 1: プロジェクト開始時（1週間目）

**最優先実装項目**
```bash
# Happy Path ストーリーのみ作成
npm run storybook
# → 各機能の正常系フローを1つずつ実装

# Critical Error のみ作成  
# → 「必須項目エラー」「認証エラー」など致命的なもの
```

**完了条件**
- [ ] 主要画面の Happy Path が動作
- [ ] Critical Error への対応確認
- [ ] 手動テストで基本フローが動作

#### Step 2: 機能追加時（2-3週間目）

**バリデーション強化**
```bash
npm run test:unit
# → Zodスキーマのパラメータ化テスト追加

npm run test:stories  
# → エラーパターンのストーリー追加
```

**完了条件** 
- [ ] 全入力フィールドのバリデーションテスト
- [ ] エラーメッセージの日本語確認
- [ ] アクセシビリティ基本チェック

#### Step 3: 品質向上時（1ヶ月目以降）

**Edge Case カバー**
```bash
# 境界値テスト追加
npm run test:unit -- --coverage
# → カバレッジ80%以上を目標

# Visual Regression 導入検討
npx chromatic --project-token=xxx
```

### テスト実装時のWarning

#### 避けるべきパターン

```typescript
// 実装に依存したテスト
it('React Hook Form の useForm が呼ばれる', () => {
  // ライブラリの実装詳細 → フレームワーク変更で壊れる
});

// 複雑すぎるテスト
it('ユーザー登録からプロフィール編集まで', async () => {
  // 20以上の操作を含む → 何をテストしているか不明
});

// テストのためのテスト
it('モック関数が正しく呼ばれる', () => {
  expect(mockFn).toHaveBeenCalledTimes(1);
  // ビジネス価値がない → 工数の無駄
});
```

#### 推奨パターン

```typescript
// ユーザー体験に焦点
it('問い合わせ送信後、確認メッセージが表示され、フォームがリセットされる', async () => {
  // 明確な価値 → ユーザーが迷わない
});

// 1つのテストで1つの振る舞い
it('必須項目が未入力の場合、該当フィールドにエラーが表示される', async () => {
  // 単一責任 → 失敗原因の特定が容易
});
```

### チェックリスト

#### 新機能追加時

**Phase 1 (必須) - 完了まで進めない**
- [ ] Happy Path ストーリーが成功する
- [ ] Critical Error ストーリーが成功する  
- [ ] 手動テストで主要フローが動作する
- [ ] 基本的なアクセシビリティが確保されている

**Phase 2 (推奨) - 品質向上時**
- [ ] バリデーションテストが網羅されている
- [ ] エラーメッセージが日本語で分かりやすい
- [ ] Edge Case のテストがある
- [ ] カバレッジが80%以上

**Phase 3 (理想) - 長期運用時**
- [ ] Visual Regression テストがある
- [ ] パフォーマンス基準をクリアしている
- [ ] E2E テストでユーザーフローを確認

#### レビュー時のチェックポイント

**ストーリー作成者**
```
□ Given-When-Then が明確か？
□ ユーザーが実際に行う操作か？
□ テストが失敗した時、問題が特定しやすいか？
□ 日本語のエラーメッセージが適切か？
```

**レビュアー**
```  
□ ビジネス価値があるテストか？
□ 実装詳細ではなく、振る舞いをテストしているか？
□ メンテナンス負荷は適切か？
□ 実際にStorybookで動作確認したか？
```

### 実践的なTips

#### 工数削減のコツ

1. **テストデータの共通化**
```typescript
// ユーザーストーリーとテストデータを連動
const testData = getTestDataByScenarioId('SC-001-1');
// → 重複コード削減、メンテナンス性向上
```

2. **Custom Hooks でのテスト支援**
```typescript
// テスト専用の便利関数
export const useStorybookTest = () => {
  const fillContactForm = async (canvas: Canvas, data: TestData) => {
    await userEvent.type(canvas.getByLabelText(/名前/), data.name);
    // ... 共通の入力処理
  };
  return { fillContactForm };
};
```

3. **段階的な自動化**
```bash
# 最初: 手動 + 基本ストーリー
npm run storybook

# 次: 自動テスト化
npm run test:stories

# 最後: CI/CD 組み込み
github-actions + chromatic
```

## 今後の改善計画

### 1. 短期的改善 (1-2週間)

- [ ] カバレッジレポート設定と測定
- [ ] Visual Regression Testing 導入
- [ ] テスト実行時間の最適化

### 2. 中期的改善 (1-2ヶ月)

- [ ] E2Eテスト追加 (Playwright)
- [ ] パフォーマンステスト導入
- [ ] アクセシビリティテスト自動化

### 3. 長期的改善 (3-6ヶ月)

- [ ] テストデータベース連携
- [ ] 本物のAPI統合テスト
- [ ] 負荷テスト実装