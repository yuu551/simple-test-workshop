# Modern Frontend Testing Strategy with Storybook 9.1 + Chakra UI v3 + Feature-Sliced Design

## ドキュメント

以下の文書から仕様・設計・テストの全体像を把握できます。

| 文書 | 内容 | 対象読者 |
|------|------|----------|
| [機能設計書](./docs/functional-specification.md) | ユーザーストーリー、受入基準、UI/UX仕様、バリデーション | PO・デザイナー・開発者 |
| [テスト仕様書](./docs/test-specification.md) | テスト戦略、観点、ケース、実行方法 | QA・開発者 |
| [開発プロセス](./docs/development-process.md) | TDD/USDD、FSD実装フロー、作業手順 | 開発者 |
| [テスト戦略メモ](./docs/TEST_STRATEGY.md) | 運用上の補足、ベストプラクティス | QA・開発者 |

## プロジェクト概要

このプロジェクトは、モダンなフロントエンドテスト戦略の実装例です。以下の特徴を持つ実践的なサンプルプロジェクトです。

### 主な特徴

- Storybook 9.1中心のテスト戦略: ユーザー体験重視のテスト設計
- Feature-Sliced Design (FSD): スケーラブルで保守性の高いアーキテクチャ  
- Chakra UI v3: モダンなコンポーネントライブラリとセマンティックトークン
- テスト駆動開発 (TDD): BDD形式での段階的品質向上プロセス
- セマンティックトークン: 一貫性のあるデザインシステムの実現
- 包括的な設計文書: 開発プロセスから設計仕様まで完全文書化

### 対象読者

- フロントエンド開発者: モダンなテスト戦略を学びたい方
- QAエンジニア: Storybookを活用したテスト自動化に興味がある方  
- プロダクトマネージャー: ユーザーストーリー駆動の開発を実践したい方
- アーキテクト: FSDアーキテクチャの実装例を参考にしたい方

## クイックスタート

### 環境要件
- Node.js 20以上（20.19+ 推奨）
- npm または yarn

### セットアップ

以下のコマンドで開発環境を構築します。初回セットアップ時はPlaywrightのインストールが必要ですが、2回目以降は不要です。
Storybookとアプリケーションは別々のポートで起動するため、UIコンポーネントの開発とアプリケーション全体の動作確認を並行して行えます。
テストコマンドは目的に応じて使い分けることで、効率的な開発サイクルを実現できます。

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
```

### 主要コマンド

日常的な開発では、`npm run storybook` でコンポーネントカタログを起動し、`npm run dev` でアプリケーション全体を確認します。
テストは `npm run test` で全体を実行できますが、開発中は `test:unit` や `test:stories` で必要な部分だけを実行すると効率的です。
ビルドコマンドはデプロイ前の最終確認や、静的ファイルの生成時に使用します。

```bash
npm run storybook           # Storybook開発サーバー起動
npm run test                # unit + storybook を一括実行
npm run test:unit           # ユニットテストのみ
npm run test:stories        # Storybook インタラクションテストのみ
npm run dev                 # Vite開発サーバー起動
npm run build               # プロダクションビルド
```

## テスト戦略の概要

### 1. UI（Client Component）テスト - Storybook中心

方針: UIコンポーネントのテストはStorybookで実施
- スナップショットテスト: UI状態の変更を自動検知
- Play Function: ユーザー操作の自動化テスト
- アクセシビリティテスト: WCAG準拠の自動チェック
- ビジュアルテスト: Chromaticとの連携でUIの視覚的回帰テスト

Play FunctionはStorybookの強力な機能で、ユーザーの操作をコード化して自動実行できます。
以下の例では、フォームへの入力から送信までの一連のフローを自動化し、期待される結果を検証しています。
これにより、手動テストの工数を削減しながら、UIの動作を継続的に保証できます。

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

### 2. ロジック・スキーマテスト - Vitest

方針: ビジネスロジックとバリデーションはVitestで実施
- Zodスキーマテスト: バリデーションルールの網羅的テスト
- パラメータ化テスト: エラーパターンの列挙テスト
- ユニットテスト: 純粋関数とユーティリティのテスト

Vitestのパラメータ化テスト機能を使用することで、複数のバリデーションケースを効率的にテストできます。
以下の例では、test.each()を使って異なる入力値とそれに対応するエラーメッセージを配列で定義し、同じテストロジックで網羅的に検証しています。
このアプローチにより、エッジケースの漏れを防ぎ、バリデーションルールの品質を高く保つことができます。

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

## アーキテクチャの特徴

### Feature-Sliced Design (FSD) 構造

本プロジェクトはFSDアーキテクチャを採用し、以下の階層構造で組織化されています。

FSD（Feature-Sliced Design）は、コードベースを機能単位でスライスし、各レイヤーが明確な責務を持つことで、大規模プロジェクトでもスケーラブルな開発を実現します。
上位のレイヤーは下位のレイヤーのみを参照できるという依存関係のルールにより、循環参照を防ぎ、保守性を高めています。
この構造により、新機能追加時の影響範囲を限定でき、チーム開発での並行作業も効率的に進められます。

```
src/
├── app/        # アプリケーション初期化、グローバル設定
│   └── providers/  # Chakra UIプロバイダー設定
├── pages/      # ページコンポーネント
├── widgets/    # 複数機能を組み合わせた複雑UIブロック
├── features/   # ユーザーインタラクションとビジネス機能
├── entities/   # ビジネスエンティティとドメインロジック
└── shared/     # 再利用可能なコンポーネント、ユーティリティ
    ├── ui/     # Chakra UIラッパーコンポーネント
    └── theme/  # セマンティックトークン定義
```

各レイヤーの責務:
- app: ルーティング、プロバイダー、グローバル設定、Chakra UI初期化
- pages: ページの組み立て（widgets/featuresの組み合わせ）
- widgets: 複合的なUIコンポーネント（例: ContactFormWidget）
- features: ビジネス機能の実装（例: contact機能）
- entities: ドメインモデル（今後の拡張用）
- shared: 共通UIコンポーネント（Chakra UIラッパー）、テーマ、ユーティリティ

### Client Componentの設計思想

テストしやすく保守性の高いコンポーネントを実現するため、副作用を最小限に抑えた設計を推奨しています。
副作用（APIコール、外部状態の更新など）はコンポーネントの外部で管理し、コンポーネント自体は受け取ったデータの表示に専念させます。
この設計により、Storybookでの独立したテストが容易になり、予測可能な動作を保証できます。

```typescript
// 避けるべき：副作用の多いコンポーネント
function BadComponent() {
  useEffect(() => {
    // APIコール、外部依存、副作用
    fetchUserData();
  }, []);
  return <div>...</div>;
}

// 推奨：副作用を最小限に抑えたコンポーネント
function GoodComponent({ userData, onSubmit }: Props) {
  // 純粋な表示ロジックのみ
  return <form onSubmit={onSubmit}>...</form>;
}
```

### Chakra UIラッパーパターン

UIライブラリの直接的な依存を避けるため、全てのChakra UIコンポーネントはラッパーを介して使用します。

ラッパーパターンを採用することで、UIライブラリの変更時の影響を最小限に抑え、プロジェクト独自のデザインAPIを維持できます。
また、プロジェクト固有のデフォルト値や振る舞いを統一的に管理でき、デザインシステムの一貫性を保ちやすくなります。
将来的にUIライブラリを変更する場合でも、ラッパー層の実装を変更するだけで対応できるため、保守性が大幅に向上します。

```typescript
// 避けるべき：直接インポート
import { Button } from '@chakra-ui/react';

// 推奨：ラッパー経由
import { Button } from '@/shared/ui/Button';

// ラッパーの実装例（shared/ui/Button/Button.tsx）
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  const colorPalette = {
    primary: 'blue',
    secondary: 'gray',
  }[variant];

  return <ChakraButton colorPalette={colorPalette} {...props} />;
};
```

### セマンティックトークンによるデザインシステム

一貫性のあるデザインを実現するため、セマンティックトークンを活用します。

セマンティックトークンは、色やサイズなどの具体的な値ではなく、その用途や意味に基づいて名前を付けたデザイントークンです。
これにより、「brand.primary」や「text.secondary」といった意味のある名前でスタイルを定義でき、コードの可読性と保守性が向上します。
また、ダークモード対応も簡単になり、トークンの定義を変更するだけで、アプリケーション全体のデザインを一括で更新できます。

```typescript
// shared/theme/semantic-tokens.ts
export const semanticTokens = {
  colors: {
    // ブランドカラー
    'brand.primary': { default: '#0066CC', _dark: '#4A9EFF' },
    
    // UIステータス
    'ui.success': { default: 'green.500', _dark: 'green.300' },
    'ui.danger': { default: 'red.500', _dark: 'red.300' },
    
    // テキスト
    'text.primary': { default: 'gray.800', _dark: 'gray.100' },
    'text.secondary': { default: 'gray.600', _dark: 'gray.400' }
  }
};

// 使用例
<Box color="text.primary" bg="brand.primary">
  コンテンツ
</Box>
```

### テスト責任の明確な分離

| テスト対象 | 使用ツール | 責任範囲 |
|-----------|-----------|---------|
| UI動作 | Storybook | ユーザー操作、表示状態、アクセシビリティ |
| バリデーション | Vitest | スキーマ検証、エラーパターン、境界値テスト |
| ビジネスロジック | Vitest | 計算処理、データ変換、状態管理 |

## 実装済みテスト例

### ユーザーストーリー駆動テスト

現在実装されているテストシナリオ

#### US-001: 基本的なフォーム送信
- 正常な送信フロー（HappyPath）
- 必須フィールドエラー（RequiredFieldError）
- メール形式エラー（InvalidEmailError）
- プライバシーポリシー同意エラー

#### US-002: 確認画面フロー
- 最終送信の完了フロー

#### US-003: 自動保存機能
- ローカルストレージへの自動保存
- ページリロード後の復元機能

---

## 実装例とコードスニペット

### Storybook Play Function - 実際のコード例

以下は実際のプロジェクトで実装されているPlay Functionの例です。

このPlay FunctionはBDD（振る舞い駆動開発）のGiven-When-Then形式で構成されており、ユーザーストーリーとの明確な対応関係を保っています。
テストデータは集中管理されており、シナリオIDで取得することで、テストの保守性と再利用性を高めています。
各ステップには日本語のコメントが含まれており、テストの意図が明確に伝わるよう工夫されています。

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

### Zodスキーマ定義 - 型安全なバリデーション

Zodスキーマは実行時のバリデーションとTypeScriptの型推論を統合し、フォームの入力検証を型安全に実装できます。
各フィールドに対して連鎖的にバリデーションルールを定義でき、エラーメッセージも日本語でカスタマイズしています。
スキーマからTypeScript型を自動生成することで、型定義の重複を避け、バリデーションルールと型定義の一貫性を保証します。

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

### Chakra UIとの統合例

React Hook FormとZodを組み合わせることで、フォームの状態管理とバリデーションを統合的に扱えます。
Chakra UIのFieldコンポーネントはラッパー経由で使用し、エラー状態の表示も自動化されています。
zodResolverを使用することで、Zodスキーマとreact-hook-formがシームレスに連携し、型安全なフォーム実装を実現します。

```typescript
// ContactForm.tsx - Chakra UIのFieldコンポーネントを使用
import { Field } from '@/shared/ui/field';
import { Button } from '@/shared/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        label="お名前"
        required
        invalid={!!errors.name}
        errorText={errors.name?.message}
      >
        <input {...register('name')} />
      </Field>
      
      <Button type="submit" variant="primary">
        送信する
      </Button>
    </form>
  );
};
```

### テストデータ管理システム

テストデータをシナリオID付きで集中管理することで、テストの保守性と追跡可能性を向上させています。
各テストデータには説明文と期待される結果が含まれており、テストの意図が明確に文書化されています。
シナリオIDはユーザーストーリーとの対応関係を保持しており、要件からテストまでの完全なトレーサビリティを実現します。

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

### パラメータ化テスト（Vitest例）

Storybookでは実現困難な網羅的エラーテストはVitestで実装します。

このパラメータ化テストでは、各フィールドの境界値や異常値を体系的にテストし、バリデーションの完全性を保証します。
test.each()を使用することで、同じテストロジックで複数のケースを効率的に検証でき、新しいエッジケースの追加も容易です。
テスト名に入力値を含めることで、失敗時にどのケースで問題が発生したかが即座に判断できます。

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

## テスト実行

### 開発中のテスト

開発時はStorybookを常時起動してコンポーネントの動作を確認しながら、必要に応じてテストを実行します。
部分的なテスト実行により開発サイクルを高速化し、変更の影響を素早く検証できます。
Storybookのホットリロード機能により、コードの変更が即座に反映され、効率的な開発が可能です。

```bash
# Storybookの起動（開発・テスト用）
npm run storybook

# テストの実行
npm run test          # まとめて実行
npm run test:unit     # unit のみ
npm run test:stories  # Storybook のみ
```

### CI/CDでのテスト

CI/CD環境では、全てのテストを自動実行し、品質ゲートとして機能させます。
Storybookの静的ビルドにより、レビュー環境でのコンポーネント確認も可能になります。
Chromaticとの連携により、UIの視覚的な変更を自動検出し、意図しないデザイン変更を防ぎます。

```bash
# Storybookインタラクションテストの実行
npm run test:stories

# 静的Storybookのビルド
npm run build-storybook

# ビジュアルテスト（Chromatic連携）
npx chromatic --project-token=<TOKEN>
```

## お客様へのメリット

### UI品質の向上
- 自動化されたユーザー操作テストにより、リグレッションを早期発見
- アクセシビリティの自動チェックで、インクルーシブなUIを保証
- ビジュアルテストで、デザインの意図しない変更を防止

### 開発効率の向上
- コンポーネント駆動開発により、独立した開発・テストが可能
- ユーザーストーリー直結のテストで、ビジネス要件との齟齬を防止
- 自動化されたテスト実行で、手動テストコストを削減

### 品質保証の強化
- バリデーションロジックの網羅的テストで、データ整合性を保証
- エッジケースの自動検証で、予期しないエラーを防止
- 継続的なテスト実行で、コードベースの健全性を維持

---

## ディレクトリ構造

以下の構造は、FSD（Feature-Sliced Design）の原則に従って組織化されています。
各層は明確な責務を持ち、上位層は下位層のみを参照する依存関係ルールにより、循環参照を防いでいます。
各ディレクトリには必ずindex.tsが配置され、Public APIを明確に定義することで、内部実装の詳細を隠蔽しています。

```
src/
├── app/                    # アプリケーション層
│   ├── App.tsx             # アプリケーションルート
│   ├── index.tsx           # エントリーポイント
│   └── providers/          # プロバイダー設定
│       ├── provider.tsx    # Chakra UIプロバイダー
│       └── color-mode.tsx  # カラーモード設定
├── pages/                  # ページ層
│   └── home/               # ホームページ
├── widgets/                # ウィジェット層
│   └── contact-form-widget/ # 問い合わせフォームウィジェット
├── features/               # 機能層
│   └── contact/            # 問い合わせ機能
│       ├── ui/             # UIコンポーネント
│       ├── model/          # 状態管理・ビジネスロジック
│       ├── api/            # API呼び出し（将来の拡張用）
│       └── lib/            # ユーティリティ関数
├── entities/               # エンティティ層（将来の拡張用）
└── shared/                 # 共有層
    ├── ui/                 # Chakra UIラッパーコンポーネント
    │   ├── Button/         # ボタンラッパー
    │   ├── field/          # フィールドラッパー
    │   ├── checkbox/       # チェックボックスラッパー
    │   ├── alert/          # アラートラッパー
    │   └── toaster/        # トースターラッパー
    └── theme/              # テーマ設定
        └── semantic-tokens.ts # セマンティックトークン定義
```

各ディレクトリには`index.ts`ファイルがあり、Public APIを定義しています。

## 技術スタック

### アーキテクチャ
- Feature-Sliced Design: スケーラブルなフロントエンドアーキテクチャ
- Zustand: 軽量な状態管理ライブラリ

### UIフレームワーク
- Chakra UI v3: モダンなコンポーネントライブラリ
- Emotion: CSS-in-JSライブラリ（Chakra UIの依存関係）
- セマンティックトークン: 一貫性のあるデザインシステム

### テスト関連
- Storybook 9.1: UIコンポーネントテスト・ドキュメント
- Vitest: ユニット・統合テスト
- @storybook/test: Play Function用テストライブラリ
- @storybook/addon-a11y: アクセシビリティテスト

### フォーム・バリデーション
- React Hook Form: フォーム状態管理
- Zod: スキーマベースバリデーション
- @hookform/resolvers: Zodとの統合

### 開発基盤
- React 19: UIライブラリ
- TypeScript: 型安全性
- Vite: 高速ビルドツール

## ベストプラクティス

### Client Componentの設計
1. 副作用の最小化: APIコールやグローバル状態変更を避ける
2. Props駆動: 外部データは必ずPropsとして受け取る
3. Pure Function: 同じ入力に対して同じ出力を保証

### Chakra UI使用規則
1. ラッパー経由の使用: 直接インポートを避け、`@/shared/ui`から使用
2. セマンティックトークン優先: 直接的な色指定ではなくトークンを使用
3. 一貫性のあるprops命名: プロジェクト独自のAPIを維持

### テストの優先順位
1. Happy Path: まず正常フローを確実にテスト
2. エラーケース: 予想される失敗パターンを網羅
3. エッジケース: 境界値や極端な入力値をテスト

### Story組織化
1. ユーザーストーリー連携: ビジネス要件とStoryを1:1で対応
2. 命名規則: `US-XXX-SC-XXX-X`形式でトレーサビリティを確保
3. テストデータ管理: 中央集権的なテストデータ管理
