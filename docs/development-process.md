# 機能追加時の開発プロセス

## 概要

本プロジェクトでは、**ユーザー体験重視**のテスト駆動開発（TDD）を採用しています。Storybook中心の振る舞いテストから始まり、段階的にテストを拡充する実践的なアプローチを推奨します。

## 基本方針

#### 「振る舞い重視」のテスト戦略

```
❌ 実装詳細をテスト
✅ ユーザーの体験をテスト

× "submitボタンのonClickイベントが呼ばれる"
○ "フォーム送信後、成功メッセージが表示される"
```

このアプローチの重要性は、実装詳細のテストでは内部の仕組みが変わるとテストも修正が必要になり、保守コストが高くなることです。一方、ユーザー体験のテストは、実装方法が変わってもユーザーが見る結果が同じなら、テストは変更不要です。例えば、ボタンクリックの処理を onClick から onSubmit に変更しても、「成功メッセージが表示される」というユーザー体験は変わりません。

#### 段階的テスト拡充

```
Phase 1: まずはここから！
├── Happy Path（正常系）
└── Critical Error（致命的エラー）

Phase 2: 品質向上
├── Validation Error（バリデーションエラー）
└── Edge Case（境界値）

Phase 3: 堅牢性
├── Integration Test（統合テスト）
└── Performance Test（パフォーマンステスト）
```

各フェーズの詳細説明：

Phase 1は基本機能の動作保証を目的としています。Happy Pathでは、ユーザーが期待通りに操作した場合の正常なフローを確認し、最も重要な基本機能が動くことを保証します。Critical Errorでは、サーバー接続エラーや必須データの欠損など、システムが動作しなくなるような致命的なエラーへの対応をテストします。

Phase 2はユーザビリティの向上に焦点を当てます。Validation Errorでは、メールアドレスの形式エラーや文字数制限など、入力値の検証エラーを適切に表示できることを確認します。Edge Caseでは、最大文字数ちょうど、空文字、特殊文字など、境界値や特殊な条件での動作確認を行います。

Phase 3ではプロダクション品質の確保を目指します。Integration Testで複数の機能やシステムが連携して動作することを確認し、Performance Testで大量データや高負荷時でも適切なパフォーマンスを維持することを確認します。

## 開発フローワー

### 1. ユーザーストーリーの作成

**ユーザーストーリー形式**
```
US-XXX: [機能名]
As a [ユーザー種別]
I want [やりたいこと]  
So that [得たい価値]
```

ユーザーストーリーの構成要素として、US-XXXはユニークな識別子で、チケット管理システムと連携しやすい番号体系を使用します。As a [ユーザー種別]では、この機能を使うユーザーのペルソナや役割を明確にします。I want [やりたいこと]ではユーザーが実現したい具体的なアクションや機能を記述し、So that [得たい価値]ではその機能を使うことで得られるビジネス価値やメリットを表現します。

**実例**
```
US-004: パスワードリセット機能
As a ログインに失敗したユーザー
I want パスワードリセットメールを受け取りたい
So that アカウントに再度アクセスできる
```

この形式のメリットは、開発チーム全体で「誰のための何の機能か」が一目でわかることです。機能の優先順位をビジネス価値で判断でき、テストシナリオの作成時にユーザー目線を保ちやすくなります。

### 2. 受け入れ基準の定義

**SMART基準で作成**
- **S**pecific (具体的)
- **M**easurable (測定可能) 
- **A**chievable (達成可能)
- **R**elevant (関連性)
- **T**ime-bound (期限)

各基準の説明として、Specific（具体的）では曖昧な表現を避け、誰が読んでも同じ理解ができるように記述します。Measurable（測定可能）では「完了」の判断が客観的にできるよう数値や明確な状態を定義します。Achievable（達成可能）では技術的、時間的に現実的に実現可能な範囲で設定します。Relevant（関連性）ではユーザーストーリーと直接関連し、価値を提供する内容であることを確認します。Time-bound（期限）ではパフォーマンス要件や処理時間の期待値を含むようにします。

**実例**
```
AC-004-1: パスワードリセットボタンをクリックできる
AC-004-2: メールアドレス入力後、確認メッセージが表示される
AC-004-3: 不正なメールアドレス入力時、エラーメッセージが表示される
AC-004-4: 3分以内にリセットメールが送信される
```

良い受け入れ基準の特徴を見ていくと、AC-004-1ではボタンの存在とクリック可能性を確認しています。これは具体的で測定可能な基準です。AC-004-2ではユーザーアクションと結果が明確になっており、具体的かつ関連性があります。AC-004-3ではエラーケースの対応を定義し、達成可能で関連性のある内容にしています。AC-004-4では3分という具体的な時間制約を設けることで、期限が明確で測定可能にしています。

### 3. シナリオの詳細化（BDD形式）

```
Scenario: パスワードリセットメールの送信成功
  Given パスワードリセット画面を開いている
  When 有効なメールアドレス "user@example.com" を入力して
  And "送信" ボタンをクリックする
  Then "リセットメールを送信しました" が表示される
  And メールアドレス入力欄がクリアされる
```

BDD（振る舞い駆動開発）形式の構成要素は、Given、When、Then、Andの4つです。Given（前提条件）ではテスト開始時のシステムの状態やコンテキストを定義します。When（アクション）ではユーザーが実行する操作やイベントを記述します。Then（期待結果）ではアクションの結果として期待されるシステムの状態を検証します。And（追加条件）を使用して、各ステップで複数の条件やアクションを追加することもできます。

このシナリオ形式の意図は、テストの流れが自然言語で読めることにあります。これにより非技術者も理解できるようになります。また、実装前に振る舞いを定義することで、仕様の認識齟齬がとれます。さらに、この形式はテストコードへの変換が容易で、自動テストの基礎となります。

## 実装プロセス（TDD Cycle）

### Red → Green → Refactor サイクル

#### 🔴 Phase 1: Red（失敗するテストを書く）

**1-1. Storybookストーリーの作成**

```typescript
// PasswordReset.stories.tsx
export const HappyPath: Story = {
  name: 'US-004-SC-004-1: パスワードリセット成功',
  args: {
    onSubmit: mockFn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: パスワードリセット画面を表示
    await expect(canvas.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /送信/ })).toBeInTheDocument();
    
    // When: 有効なメールアドレスを入力して送信
    await userEvent.type(
      canvas.getByLabelText(/メールアドレス/), 
      'user@example.com'
    );
    await userEvent.click(canvas.getByRole('button', { name: /送信/ }));
    
    // Then: 成功メッセージが表示される
    await expect(
      await canvas.findByText(/リセットメールを送信しました/)
    ).toBeInTheDocument();
    
    // And: 入力欄がクリアされる
    await expect(canvas.getByLabelText(/メールアドレス/)).toHaveValue('');
  },
};
```

**1-2. コンポーネントの骨格作成**

```typescript
// PasswordReset.tsx （まだ機能は実装しない）
export const PasswordReset: React.FC<Props> = ({ onSubmit }) => {
  return (
    <div>
      <label htmlFor="email">メールアドレス</label>
      <input id="email" type="email" />
      <button type="submit">送信</button>
      {/* まだ成功メッセージは実装しない */}
    </div>
  );
};
```

**1-3. テスト実行（失敗を確認）**

```bash
npm run test:stories
# ❌ "リセットメールを送信しました" が見つからない → 期待通りの失敗
```

#### 🟢 Phase 2: Green（最小限の実装で通す）

**2-1. 最小限の機能実装**

```typescript
// PasswordReset.tsx
export const PasswordReset: React.FC<Props> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({ email });
    }
    setSubmitted(true);
    setEmail(''); // 入力欄クリア
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">メールアドレス</label>
      <input 
        id="email" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">送信</button>
      
      {submitted && (
        <div role="alert">リセットメールを送信しました</div>
      )}
    </form>
  );
};
```

**2-2. テスト実行（成功を確認）**

```bash
npm run test:stories
# ✅ HappyPath ストーリーが成功
```

#### 🔄 Phase 3: Refactor（コードの改善）

**3-1. バリデーションの追加**

```typescript
// validation.ts
export const passwordResetSchema = z.object({
  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください')
});
```

**3-2. React Hook Formとの統合**

```typescript
// PasswordReset.tsx (Refactored)
export const PasswordReset: React.FC<Props> = ({ onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordResetData>({
    resolver: zodResolver(passwordResetSchema)
  });

  const onSubmitHandler = async (data: PasswordResetData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    setSubmitted(true);
    reset(); // フォームリセット
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="form-group">
        <label htmlFor="email">メールアドレス</label>
        <input 
          id="email" 
          type="email" 
          {...register('email')}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span role="alert" className="error">
            {errors.email.message}
          </span>
        )}
      </div>
      
      <button type="submit">送信</button>
      
      {submitted && (
        <div role="alert" className="success">
          リセットメールを送信しました
        </div>
      )}
    </form>
  );
};
```

React Hook FormとZodを組み合わせたリファクタリング例です。useFormフックにzodResolverを使用してバリデーションスキーマを接続します。register関数で入力フィールドをフォームに登録し、errorsオブジェクトからバリデーションエラーを取得して表示します。reset関数でフォームをクリアし、aria-invalid属性でエラー状態をスクリーンリーダーに伝えます。

このようにRed-Green-Refactorサイクルを繰り返すことで、テストによって保護された高品質なコードを段階的に構築できます。

### 段階的テスト拡充

#### Phase 1: コア機能（必須）

Happy Path + Critical Error

```typescript
// Critical Errorケース
export const InvalidEmail: Story = {
  name: 'US-004-SC-004-2: 不正なメールアドレス',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // When: 不正なメールアドレスを入力
    await userEvent.type(
      canvas.getByLabelText(/メールアドレス/), 
      'invalid-email'
    );
    await userEvent.click(canvas.getByRole('button', { name: /送信/ }));
    
    // Then: エラーメッセージが表示される
    await expect(
      await canvas.findByText(/有効なメールアドレスを入力してください/)
    ).toBeInTheDocument();
  },
};
```

このCritical Errorケースでは、不正なメールアドレス（invalid-email）を入力した時の動作をテストしています。ユーザーが間違った入力をした際に、適切なエラーメッセージが表示されることを確認します。findByTextを使用して非同期に表示されるエラーメッセージを待機します。

#### Phase 2: バリデーション強化

網羅的なバリデーションテスト（Vitest）

```typescript
// passwordReset.validation.test.ts
describe('passwordResetSchema', () => {
  test.each([
    ['', 'メールアドレスは必須です'],
    ['invalid', '有効なメールアドレスを入力してください'],
    ['test@', '有効なメールアドレスを入力してください'],
    ['@example.com', '有効なメールアドレスを入力してください'],
    ['a'.repeat(256) + '@example.com', 'メールアドレスは255文字以内で入力してください'],
  ])('バリデーション: %s → %s', (input, expectedError) => {
    const result = passwordResetSchema.safeParse({ email: input });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(expectedError);
    }
  });
});
```

test.eachを使用したパラメタライズドテストの例です。空文字、不正な形式、最大文字数超過など、様々なバリデーションケースを網羅的にテストします。safeParseメソッドを使用してエラーをキャッチし、期待されるエラーメッセージが返されることを検証します。

#### Phase 3: 統合・パフォーマンス

APIモック統合

```typescript
// MSW(Mock Service Worker)でのAPI応答テスト
const handlers = [
  rest.post('/api/password-reset', (req, res, ctx) => {
    const { email } = req.body as { email: string };
    
    if (email === 'notfound@example.com') {
      return res(
        ctx.status(404),
        ctx.json({ error: 'ユーザーが見つかりません' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({ message: 'リセットメールを送信しました' })
    );
  }),
];
```

MSW（Mock Service Worker）を使用したAPIモックの例です。rest.postでエンドポイントを定義し、リクエスト内容に応じて適切なレスポンスを返します。notfound@example.comのような特定のメールアドレスで404エラーを返すことで、エラーケースのテストも可能になります。

## テストデータ管理

### シナリオベースのテストデータ

```typescript
// testData.ts
export const passwordResetTestData: TestDataSet[] = [
  {
    scenarioId: 'SC-004-1',
    description: 'パスワードリセット成功',
    data: { email: 'user@example.com' },
    expectedResult: 'success'
  },
  {
    scenarioId: 'SC-004-2', 
    description: '不正なメールアドレス',
    data: { email: 'invalid-email' },
    expectedResult: 'validation_error',
    expectedErrors: ['有効なメールアドレスを入力してください']
  },
  {
    scenarioId: 'SC-004-3',
    description: '存在しないユーザー',
    data: { email: 'notfound@example.com' },
    expectedResult: 'api_error',
    expectedErrors: ['ユーザーが見つかりません']
  }
];
```

このテストデータ管理方式では、各テストシナリオをオブジェクトとして定義し、scenarioIdでシナリオを識別します。expectedResultで期待される結果のタイプを定義し、expectedErrorsで具体的なエラーメッセージを管理します。このアプローチにより、テストデータを中央集権的に管理でき、複数のテストで同じデータを再利用できます。

## 品質ゲート

### 各Phaseでの完了条件

#### Phase 1: 基本機能

Phase 1の完了条件は以下の通りです。Happy Pathのストーリーが成功し、Critical Errorのストーリーが成功し、手動テストで主要フローが動作し、aria-labelなどのアクセシビリティ基本チェックが完了していることが必要です。

```bash
# Phase 1 完了チェック
npm run test:stories -- --testPathPattern="HappyPath|CriticalError"
npm run storybook # 手動確認
```

コマンドではHappyPathとCriticalErrorのストーリーを特定してテストし、Storybookを起動して手動でも動作を確認します。

#### Phase 2: バリデーション

Phase 2では、全バリデーションパターンをカバーし、エラーメッセージの適切性を確認し、ユニットテストで境界値テストが完了していることを確認します。

```bash
# Phase 2 完了チェック  
npm run test:unit -- --testPathPattern="validation"
npm run test:stories
```

validationに関連するユニットテストと、すべてのストーリーテストを実行して品質を確保します。

#### Phase 3: 統合・パフォーマンス

Phase 3ではAPI統合テストを完了し、エラーハンドリングが網羅され、レスポンス時間要件をクリアしていることを確認します。

```bash
# Phase 3 完了チェック
npm run test
npm run test:e2e  # 将来実装
```

すべてのテストを実行し、E2Eテスト（将来実装予定）も含めて統合的な品質確認を行います。

## 実際の開発例

### 新機能「ファイルアップロード」の追加

#### Step 1: ユーザーストーリー定義

```
US-005: ファイルアップロード機能
As a 問い合わせをするユーザー
I want 画像ファイルを添付したい
So that 問題を視覚的に説明できる
```

#### Step 2: 受け入れ基準

```
AC-005-1: "ファイル選択"ボタンが表示される
AC-005-2: 画像ファイル（jpg, png, gif）を選択できる  
AC-005-3: 選択したファイル名が表示される
AC-005-4: 2MB以下のファイルのみアップロード可能
AC-005-5: アップロード中にプログレスバーが表示される
```

これらの受け入れ基準は、機能の要件を具体的かつ測定可能な形で定義しています。ファイル形式の制限、2MBというサイズ制限、UIのフィードバックなど、実装に必要な詳細が含まれています。

#### Step 3: Phase 1実装

```typescript
// FileUpload.stories.tsx
export const HappyPath: Story = {
  name: 'US-005-SC-005-1: ファイルアップロード成功',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: ファイルアップロード画面
    const fileInput = canvas.getByLabelText(/ファイルを選択/);
    await expect(fileInput).toBeInTheDocument();
    
    // When: 有効な画像ファイルを選択
    const file = new File(['image content'], 'test.jpg', { 
      type: 'image/jpeg' 
    });
    await userEvent.upload(fileInput, file);
    
    // Then: ファイル名が表示される
    await expect(canvas.getByText(/test.jpg/)).toBeInTheDocument();
    
    // And: アップロードボタンが有効になる
    const uploadButton = canvas.getByRole('button', { name: /アップロード/ });
    expect(uploadButton).not.toBeDisabled();
  },
};
```

このストーリーでは、ファイルアップロード機能のHappy Pathをテストしています。File APIを使用してテスト用の画像ファイルを作成し、userEvent.uploadでファイル選択をシミュレートします。選択後にファイル名が表示され、アップロードボタンが有効になることを検証します。

#### Step 4: 最小実装

```typescript
// FileUpload.tsx
export const FileUpload: React.FC<Props> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-input">ファイルを選択</label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {selectedFile && (
        <div>
          <p>選択ファイル: {selectedFile.name}</p>
          <button 
            type="button"
            onClick={() => onUpload?.(selectedFile)}
          >
            アップロード
          </button>
        </div>
      )}
    </div>
  );
};
```

最小限の実装では、useStateで選択されたファイルを管理し、handleFileSelectでファイル選択イベントを処理します。accept="image/*"属性で画像ファイルのみを許可し、選択されたファイル名を表示し、アップロードボタンを条件付きでレンダリングします。

## チーム開発での活用

### レビュー観点

**ストーリーレビュー時**
```
□ ユーザー視点でストーリーが書かれているか
□ 受け入れ基準が具体的かつ測定可能か  
□ シナリオがGiven-When-Then形式で書かれているか
□ 既存機能への影響が考慮されているか
```

**実装レビュー時** 
```
□ Storybookストーリーが期待通り動作するか
□ Happy Pathが確実にテストされているか
□ エラーメッセージが日本語で適切か
□ アクセシビリティが考慮されているか
```

### ペアプロ/モブプロでの活用

**役割分担例**
- **ドライバー**: コード実装
- **ナビゲーター**: ストーリー確認、テストケース指摘
- **オブザーバー**: ユーザビリティ観点での確認

```
ナビゲーター: "このエラーメッセージ、実際のユーザーは理解できますか？"
ドライバー: "「不正な値です」より「有効なメールアドレスを入力してください」の方が親切ですね"
オブザーバー: "スクリーンリーダーでも読み上げやすいようにaria-labelも追加しませんか？"
```

## トラブルシューティング

### よくある問題と対処法

#### 問題1: ストーリーが複雑になりすぎる
```typescript
// ❌ 一つのストーリーで複数機能をテスト
export const ComplexScenario: Story = {
  play: async ({ canvasElement }) => {
    // ログイン処理
    // プロフィール編集  
    // ファイルアップロード
    // 送信処理
    // ... 50行のテストコード
  }
};

// ✅ 機能ごとにストーリーを分離
export const LoginSuccess: Story = { /* ログインのみ */ };
export const ProfileEdit: Story = { /* プロフィール編集のみ */ };  
export const FileUpload: Story = { /* ファイルアップロードのみ */ };
```

#### 問題2: テストデータの管理が煩雑
```typescript
// ❌ ストーリーごとにテストデータを埋め込み
export const LoginTest: Story = {
  play: async () => {
    await userEvent.type(emailInput, 'test@example.com');
    // ...
  }
};

// ✅ 中央集権的なテストデータ管理
export const LoginTest: Story = {
  play: async () => {
    const testData = getTestDataByScenarioId('SC-001-1');
    await userEvent.type(emailInput, testData.email);
    // ...
  }
};
```

#### 問題3: 非同期処理でテストが不安定
```typescript
// ❌ 固定時間でのwait
await new Promise(resolve => setTimeout(resolve, 1000));

// ✅ 条件待ちでの安定したテスト
await waitFor(() => {
  expect(canvas.getByText(/送信完了/)).toBeInTheDocument();
}, { timeout: 5000 });
```

## まとめ

このプロセスの特徴：

### ユーザー中心

実装ではなく、ユーザー体験を重視し、Given-When-Then形式での明確なシナリオを作成します。アクセシビリティの早期組み込みも重要な要素です。

### 段階的品質向上

Phase 1で最低限の価値を提供し、Phase 2-3で段階的に品質を向上させます。各Phaseでの明確な完了条件を設定することで、進捗を可視化します。

### 持続可能な開発

テストファーストによる設計品質向上、自動化による継続的な品質保証、チーム全体でのテスト文化醸成を実現します。

結果として、バグが少なく、保守しやすく、ユーザーに価値を届けるプロダクトの継続的な開発が実現できます。

---

## FSD（Feature-Sliced Design）コンポーネント実装フロー

### 🏗️ FSD レイヤー構造の理解

```
src/
├── app/        # 🔧 アプリケーション設定（最後に実装）
├── pages/      # 📄 ページ組み立て（5番目に実装）
├── widgets/    # 🧩 複合UIブロック（4番目に実装）
├── features/   # ⚡ ビジネス機能（3番目に実装）
├── entities/   # 🏢 ドメインロジック（2番目に実装）
└── shared/     # 🔗 共通コンポーネント（1番目に実装）
```

### 📋 実装優先順位とフロー

#### Phase 1: 共通基盤の構築（shared）

**まず最初に実装する理由**
- 他の全レイヤーで使用される基盤コンポーネント
- UIデザインシステムの確立
- テスト環境の整備

**実装手順**

```bash
# 1-1. 基本UIコンポーネントの作成
src/shared/ui/Button/
├── Button.tsx           # コンポーネント本体
├── Button.stories.tsx   # Storybook ストーリー
├── Button.test.tsx      # ユニットテスト  
├── Button.css          # スタイル
└── index.ts            # Public API
```

**実装例：Button コンポーネント**

```typescript
// 1. ストーリーファーストで設計
// Button.stories.tsx
export const Default: Story = {
  args: { children: 'ボタン' }
};

export const Primary: Story = {
  args: { variant: 'primary', children: '送信する' }
};

export const Disabled: Story = {
  args: { disabled: true, children: '送信中...' }
};

// 2. 最小実装でストーリーを通す
// Button.tsx
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default',
  disabled = false,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn--${variant}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// 3. テスト追加で品質確保
// Button.test.tsx
describe('Button', () => {
  it('クリック時にonClick関数が呼ばれる', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>テスト</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Phase 1 完了チェックリスト**
- [ ] Button, Input, Label などの基本コンポーネント
- [ ] 各コンポーネントのStorybookストーリー
- [ ] アクセシビリティ基本対応
- [ ] スタイリングシステム（CSS/Styled Components）

#### Phase 2: ドメインロジックの整備（entities）

**実装する理由**
- ビジネスロジックとデータモデルの定義
- バリデーションスキーマの構築
- 型安全性の確保

**実装手順**

```bash
# 2-1. ドメインモデル定義
src/entities/contact/
├── model/
│   ├── types.ts         # 型定義
│   ├── validation.ts    # Zodスキーマ
│   └── index.ts        # Public API
└── lib/
    ├── formatters.ts    # データ変換関数
    └── index.ts        # Public API
```

**実装例：Contact Entity**

```typescript
// 1. 型定義とスキーマ（テストファースト）
// validation.test.ts
describe('contactSchema', () => {
  it('有効な問い合わせデータでバリデーションが成功する', () => {
    const validData = {
      name: '田中太郎',
      email: 'tanaka@example.com',
      // ...
    };
    expect(() => contactSchema.parse(validData)).not.toThrow();
  });
});

// 2. スキーマ実装
// validation.ts  
export const contactSchema = z.object({
  name: z.string().min(1, 'お名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  // ...
});

export type ContactData = z.infer<typeof contactSchema>;

// 3. ビジネスロジック関数
// lib/formatters.ts
export const formatContactForSubmission = (data: ContactData) => {
  return {
    ...data,
    submittedAt: new Date().toISOString(),
    id: generateContactId(),
  };
};
```

#### Phase 3: 機能実装（features）

**実装する理由**
- ユーザーインタラクションの実現
- ビジネス機能の具体化
- 状態管理の実装

**実装手順**

```bash
# 3-1. 機能単位でのディレクトリ構成
src/features/contact/
├── ui/
│   ├── ContactForm.tsx
│   ├── ContactForm.stories.tsx
│   ├── ContactForm.test.tsx
│   └── index.ts
├── model/
│   ├── store.ts         # Zustand Store
│   ├── hooks.ts         # Custom Hooks
│   └── index.ts
├── api/                 # 将来のAPI呼び出し
└── lib/                 # 機能固有のユーティリティ
```

**実装例：Contact Feature**

```typescript
// 1. ユーザーストーリーベースのストーリー作成
// ContactForm.stories.tsx
export const HappyPath: Story = {
  name: 'US-001-SC-001-1: 正常な問い合わせ送信',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Given: フォームが表示されている
    await expect(canvas.getByLabelText(/お名前/)).toBeInTheDocument();
    
    // When: 有効なデータを入力して送信
    await userEvent.type(canvas.getByLabelText(/お名前/), '田中太郎');
    await userEvent.click(canvas.getByRole('button', { name: /送信/ }));
    
    // Then: 成功メッセージが表示される
    await expect(
      await canvas.findByText(/お問い合わせを受け付けました/)
    ).toBeInTheDocument();
  }
};

// 2. 状態管理の実装
// model/store.ts
export const useContactFormStore = create<ContactFormStore>()((set) => ({
  isSubmitting: false,
  submitSuccess: false,
  setSubmitSuccess: (success) => set({ submitSuccess: success }),
  // ...
}));

// 3. コンポーネント実装（shared/ui と entities を活用）
// ui/ContactForm.tsx
import { Button } from '@/shared/ui';
import { contactSchema, type ContactData } from '@/entities/contact';
import { useContactFormStore } from '../model/store';

export const ContactForm: React.FC<Props> = ({ onSubmit }) => {
  const { submitSuccess, setSubmitSuccess } = useContactFormStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* shared/ui コンポーネントを活用 */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送信中...' : '送信する'}
      </Button>
    </form>
  );
};
```

#### Phase 4: UIブロック組み立て（widgets）

**実装する理由**
- 複数の機能を組み合わせた複合コンポーネント
- ページレベルでの再利用性
- レイアウトとビジネスロジックの分離

**実装手順**

```bash
# 4-1. ウィジェット単位での構成
src/widgets/contact-form-widget/
├── ContactFormWidget.tsx
├── ContactFormWidget.stories.tsx  
├── ContactFormWidget.css
└── index.ts
```

**実装例**

```typescript
// ContactFormWidget.tsx
import { ContactForm } from '@/features/contact';
import { useContactSubmission } from './model/hooks';

export const ContactFormWidget: React.FC = () => {
  const { submitContact, isLoading, error } = useContactSubmission();

  return (
    <div className="contact-form-widget">
      <header className="contact-form-widget__header">
        <h2>お問い合わせ</h2>
        <p>お気軽にお問い合わせください</p>
      </header>
      
      <ContactForm 
        onSubmit={submitContact}
        disabled={isLoading}
      />
      
      {error && (
        <div className="contact-form-widget__error">
          送信に失敗しました。時間をおいて再度お試しください。
        </div>
      )}
    </div>
  );
};
```

#### Phase 5: ページ組み立て（pages）

**実装する理由**
- ウィジェットとレイアウトの組み合わせ
- ルーティングとページ固有の状態管理
- SEOやメタデータの設定

**実装手順**

```bash
# 5-1. ページ単位での構成
src/pages/contact/
├── ContactPage.tsx
├── ContactPage.stories.tsx
└── index.ts
```

**実装例**

```typescript
// ContactPage.tsx
import { ContactFormWidget } from '@/widgets/contact-form-widget';
import { PageLayout } from '@/shared/ui';

export const ContactPage: React.FC = () => {
  return (
    <PageLayout
      title="お問い合わせ"
      breadcrumb={['ホーム', 'お問い合わせ']}
    >
      <div className="contact-page">
        <ContactFormWidget />
      </div>
    </PageLayout>
  );
};
```

#### Phase 6: アプリケーション統合（app）

**実装する理由**
- グローバル設定とプロバイダーの統合
- ルーティングの設定
- アプリケーション全体の初期化

**実装手順**

```bash
# 6-1. アプリケーション層の構成
src/app/
├── App.tsx              # ルートコンポーネント
├── providers/           # グローバルプロバイダー
├── router/              # ルーティング設定
└── styles/              # グローバルスタイル
```

**実装例**

```typescript
// App.tsx
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { GlobalProviders } from './providers';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalProviders>
        <AppRouter />
      </GlobalProviders>
    </BrowserRouter>
  );
};
```

### 🔄 レイヤー間の依存関係ルール

#### ✅ 許可される依存関係

```typescript
// ✅ 下位レイヤーへの依存は OK
// features → entities, shared
import { contactSchema } from '@/entities/contact';
import { Button } from '@/shared/ui';

// ✅ 同一レイヤー内での依存も OK
// features/contact → features/user (別機能)
import { useUserSession } from '@/features/user';
```

#### ❌ 禁止される依存関係

```typescript
// ❌ 上位レイヤーへの依存は NG
// shared → features (逆方向)
import { ContactForm } from '@/features/contact'; // Error!

// ❌ app レイヤーのコンポーネントを他で使用
// features → app
import { AppLayout } from '@/app/layouts'; // Error!
```

### 🧪 FSD対応テスト戦略

#### レイヤー別テスト方針

```typescript
// shared/ui: コンポーネント単体テスト
describe('Button', () => {
  it('プロパティが正しく適用される', () => {
    // 純粋なUIコンポーネントの動作確認
  });
});

// entities: ドメインロジックテスト  
describe('contactSchema', () => {
  it('バリデーションが正しく動作する', () => {
    // ビジネスルールの検証
  });
});

// features: 機能統合テスト（Storybook中心）
export const ContactFormHappyPath: Story = {
  play: async ({ canvasElement }) => {
    // ユーザーインタラクションのテスト
  }
};

// widgets: 複合機能テスト
export const ContactFormWidgetIntegration: Story = {
  play: async ({ canvasElement }) => {
    // 複数機能が組み合わさった動作のテスト
  }
};

// pages: ページ全体のテスト（E2E寄り）
export const ContactPageE2E: Story = {
  play: async ({ canvasElement }) => {
    // ページ全体のユーザーフローテスト
  }
};
```

### 📦 実装時のベストプラクティス

#### 1. 段階的な機能実装

```typescript
// Step 1: 最小限のインターフェース
export interface ContactFormProps {
  onSubmit?: (data: ContactData) => void;
}

// Step 2: 状態管理の追加
export interface ContactFormProps {
  onSubmit?: (data: ContactData) => void;
  loading?: boolean;
  error?: string;
}

// Step 3: カスタマイズ性の向上
export interface ContactFormProps {
  onSubmit?: (data: ContactData) => void;
  loading?: boolean;
  error?: string;
  enableAutoSave?: boolean;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}
```

#### 2. Public API の明確化

```typescript
// features/contact/index.ts - Public API
export { ContactForm } from './ui/ContactForm';
export { useContactFormStore } from './model/store';
export type { ContactFormProps } from './ui/ContactForm';

// 内部実装は外部に公開しない
// export { ContactFormInternal } from './ui/ContactFormInternal'; // ❌
```

#### 3. 型安全性の確保

```typescript
// entities層で定義した型を features層で活用
import type { ContactData } from '@/entities/contact';

// features層で定義した型を widgets層で活用  
import type { ContactFormProps } from '@/features/contact';

// 型の再利用と一貫性を保つ
```

### 🚀 新機能追加の具体例

#### 例：「ファイルアップロード機能」の追加

**Phase 1: shared層の拡張**
```bash
# 新しい共通コンポーネント
src/shared/ui/FileInput/
├── FileInput.tsx
├── FileInput.stories.tsx
└── FileInput.test.tsx
```

**Phase 2: entities層の拡張**  
```bash
# ドメインモデルの拡張
src/entities/contact/model/
├── validation.ts  # スキーマにファイル項目追加
└── types.ts      # 型定義の拡張
```

**Phase 3: features層の更新**
```bash
# 既存機能の拡張
src/features/contact/ui/
├── ContactForm.tsx        # ファイル入力フィールド追加
├── ContactForm.stories.tsx # 新ストーリー追加
└── FileUploadSection.tsx   # 新コンポーネント追加
```

**Phase 4-6: 上位レイヤーの連携更新**

このように、下位レイヤーから順次実装することで：
- **依存関係の整理**: 各レイヤーが適切に分離される
- **テスト効率**: 各レイヤーで独立したテストが可能
- **保守性向上**: 変更の影響範囲が明確
- **チーム開発**: レイヤー単位での並行開発が可能

### 💡 実装時のTips

#### レイヤー実装の判断基準

```
機能を実装する時の自問自答：

1. "これは他の機能でも使う汎用的なUIか？"
   → Yes: shared/ui に実装

2. "これはビジネスルールやデータ変換か？"  
   → Yes: entities に実装

3. "これは特定の機能のユーザーインタラクションか？"
   → Yes: features に実装

4. "これは複数機能を組み合わせた複合UIか？"
   → Yes: widgets に実装

5. "これはページ固有のレイアウトや設定か？"
   → Yes: pages に実装
```

#### よくある間違いとその対処

```typescript
// ❌ features層にUIを大量に詰め込む
// features/contact/ui/ContactForm.tsx (300行)

// ✅ shared層のコンポーネントを活用
// features/contact/ui/ContactForm.tsx (100行)
import { Button, Input, TextArea } from '@/shared/ui';

// ❌ entities層に画面固有のロジック
// entities/contact/model/ui-state.ts  

// ✅ features層で画面状態を管理
// features/contact/model/form-state.ts
```

FSDアーキテクチャを正しく理解し、レイヤー毎の責務を明確にすることで、拡張性と保守性の高いコードベースを実現できます。