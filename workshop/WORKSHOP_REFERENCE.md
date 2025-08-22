# 📚 ワークショップ参考資料

## 🚀 チートシート

### React Hook Form + Zod + Chakra UI 基本パターン

#### **基本的なフォーム設定（Chakra UI統合）**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Field } from '@/shared/ui/field';
import { Button } from '@/shared/ui/Button';

// Zodスキーマ定義
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

// コンポーネント内での使用
const {
  register,
  handleSubmit,
  formState: { errors, isValid, isSubmitting },
  watch,
  setValue
} = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onBlur', // リアルタイムバリデーション
});

// フォームレンダリング（Chakra UI）
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Field 
      label="名前" 
      required
      invalid={!!errors.name}
      errorText={errors.name?.message}
    >
      <input {...register('name')} />
    </Field>
    <Button type="submit" variant="primary" loading={isSubmitting}>
      送信
    </Button>
  </form>
);
```

#### **よく使うZodバリデーション**
```typescript
const schema = z.object({
  // 文字列
  name: z.string()
    .min(1, '必須項目です')
    .max(50, '50文字以内で入力してください')
    .trim(),
  
  // メールアドレス
  email: z.string()
    .email('正しいメールアドレスを入力してください')
    .max(255, '255文字以内で入力してください'),
  
  // 数値
  age: z.number({
    required_error: '年齢は必須です',
    invalid_type_error: '数値で入力してください'
  })
    .min(0, '0以上で入力してください')
    .max(150, '150以下で入力してください'),
  
  // パスワード（複雑な条件）
  password: z.string()
    .min(8, '8文字以上で入力してください')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           '英大文字、英小文字、数字を含めてください'),
  
  // チェックボックス（同意必須）
  agreed: z.boolean()
    .refine(val => val === true, '同意が必要です'),
  
  // 選択肢
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '性別を選択してください'
  }),
  
  // 配列
  hobbies: z.array(z.string())
    .min(1, '少なくとも1つ選択してください'),
  
  // オプショナル
  bio: z.string().optional(),
  
  // 条件付きバリデーション
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword']
});
```

### Chakra UI ラッパーパターン

#### **ラッパーコンポーネントの作成**
```typescript
// shared/ui/Button/Button.tsx
import { Button as ChakraButton } from '@chakra-ui/react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  loading?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  const colorPalette = {
    primary: 'blue',
    secondary: 'gray',
  }[variant];

  const chakraSize = {
    small: 'sm',
    medium: 'md',
    large: 'lg',
  }[size];

  return (
    <ChakraButton 
      colorPalette={colorPalette} 
      size={chakraSize}
      {...props}
    />
  );
};
```

### セマンティックトークンパターン

#### **セマンティックトークンの使用**
```typescript
// 色の使用
// ❌ 避けるべき：直接的な色指定
<Box bg="blue.500" color="white">Content</Box>
<Badge colorScheme="green">Success</Badge>

// ✅ 推奨：セマンティックトークンを使用
<Box bg="brand.primary" color="text.primary">Content</Box>
<Badge colorScheme="status.success">Success</Badge>

// フォーム要素での使用
<Field
  borderColor="form.border"
  _focus={{ borderColor: "form.border.focus" }}
  _invalid={{ borderColor: "form.border.error" }}
>
  <input />
</Field>
```

#### **セマンティックトークンの定義例**
```typescript
// shared/theme/semantic-tokens.ts
export const semanticTokens = {
  colors: {
    // ブランドカラー
    'brand.primary': { default: '#0066CC', _dark: '#4A9EFF' },
    
    // ステータスカラー
    'status.success': { default: 'green.500', _dark: 'green.300' },
    'status.error': { default: 'red.500', _dark: 'red.300' },
    
    // インタラクティブ要素
    'interactive.primary': { 
      default: '{colors.brand.primary}',
      _hover: '#0052A3'
    }
  }
};
```

### Storybook パターン

#### **基本的なストーリー構造（Chakra UI対応）**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'shared/ui/MyComponent',  // Feature-Sliced Design準拠
  component: MyComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chakra UIラッパーコンポーネント'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary']
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Title'
  }
};
```

#### **Play Function の基本パターン**
```typescript
import { userEvent, within, expect } from 'storybook/test';

export const InteractionTest: Story = {
  args: {
    onSubmit: action('form-submitted')
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // 要素の存在確認
    await expect(canvas.getByLabelText(/name/i)).toBeInTheDocument();
    
    // 入力
    await userEvent.type(canvas.getByLabelText(/name/i), 'Test User');
    
    // クリック
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }));
    
    // 結果確認
    await expect(canvas.getByText(/success/i)).toBeInTheDocument();
  }
};
```

### Vitest テストパターン

#### **パラメータ化テスト**
```typescript
import { describe, test, expect } from 'vitest';

describe('Validation Tests', () => {
  test.each([
    ['', false, '空文字は無効'],
    ['valid@example.com', true, '有効なメールアドレス'],
    ['invalid-email', false, '無効なメールアドレス']
  ])('Email validation: %s → %s (%s)', (input, expected, description) => {
    const result = emailSchema.safeParse(input);
    expect(result.success).toBe(expected);
  });
});
```

#### **非同期テスト**
```typescript
import { vi } from 'vitest';

test('API call test', async () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true })
  });
  
  global.fetch = mockFetch;
  
  const result = await submitForm(formData);
  
  expect(mockFetch).toHaveBeenCalledWith('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  expect(result).toEqual({ success: true });
});
```

---

## 🔧 トラブルシューティング

### よくあるエラーと解決方法

#### **1. Chakra UIのプロバイダーエラー**

**エラー例:**
```
Error: useChakra: `chakra` context is undefined
```

**解決方法:**
```typescript
// .storybook/preview.tsx で Chakra UI プロバイダーを設定
import { Provider } from '../src/app/providers';

export const decorators = [
  (Story) => (
    <Provider>
      <Story />
    </Provider>
  )
];
```

#### **2. セマンティックトークンが適用されない**

**原因と解決方法:**
```typescript
// ❌ 間違い: トークン名の誤り
<Box bg="brand-primary">Content</Box>

// ✅ 正解: ドット記法を使用
<Box bg="brand.primary">Content</Box>

// テーマ設定の確認
const customSystem = createSystem(defaultConfig, {
  semanticTokens: semanticTokens
});
```

#### **3. Storybookが起動しない**

**エラー例:**
```
Error: Cannot resolve module '@storybook/react-vite'
```

**解決方法:**
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# Storybookの設定確認
cat .storybook/main.ts
```

**チェックポイント:**
- Node.js 18+ を使用しているか
- package.jsonのStorybookバージョンが一致しているか
- `.storybook/main.ts`の設定が正しいか

#### **2. Play Functionでテストが失敗する**

**エラー例:**
```
Error: Unable to find an element with the text: /submit/i
```

**解決方法:**
```typescript
// ❌ 間違い: 要素が存在しない可能性
await userEvent.click(canvas.getByText(/submit/i));

// ✅ 正解: まず存在確認してからクリック
await expect(canvas.getByText(/submit/i)).toBeInTheDocument();
await userEvent.click(canvas.getByText(/submit/i));

// ✅ または、より安全な方法
const submitButton = canvas.getByRole('button', { name: /submit/i });
await expect(submitButton).toBeInTheDocument();
await userEvent.click(submitButton);
```

**デバッグ方法:**
```typescript
// DOM構造を確認
console.log(canvasElement.innerHTML);

// 利用可能な要素を確認
canvas.debug();
```

#### **3. TypeScriptエラー: 型が一致しない**

**エラー例:**
```
Type 'string' is not assignable to type 'number'
```

**解決方法:**
```typescript
// ❌ 間違い: 文字列として扱われる
<input type="number" {...register('age')} />

// ✅ 正解: 数値として変換
<input type="number" {...register('age', { valueAsNumber: true })} />

// Zodスキーマでの型変換
const schema = z.object({
  age: z.coerce.number().min(0) // 文字列を数値に変換
});
```

#### **4. バリデーションが動作しない**

**原因と解決方法:**

**原因1: resolverが設定されていない**
```typescript
// ❌ 間違い
const { register } = useForm<FormData>();

// ✅ 正解
const { register } = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

**原因2: modeが適切でない**
```typescript
// リアルタイムバリデーションが必要な場合
const { register } = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: 'onBlur' // または 'onChange'
});
```

#### **5. Vitestテストで非同期処理が失敗する**

**エラー例:**
```
Error: Promise timeout exceeded
```

**解決方法:**
```typescript
// ❌ 間違い: awaitなし
test('async test', () => {
  const result = asyncFunction();
  expect(result).toBe(expected);
});

// ✅ 正解: 適切なawait
test('async test', async () => {
  const result = await asyncFunction();
  expect(result).toBe(expected);
});

// タイムアウト設定
test('slow test', async () => {
  const result = await slowFunction();
  expect(result).toBe(expected);
}, 10000); // 10秒のタイムアウト
```

---

## ❓ よくある質問 (FAQ)

### **Q1: なぜChakra UIを直接使わずラッパーを作るの？**

**A:** 以下の理由からラッパーパターンを採用しています：

1. **ライブラリ変更への耐性**: 将来的にUIライブラリを変更する際の影響を最小限に
2. **一貫したAPI**: プロジェクト独自のprops命名規則を維持
3. **破壊的変更への対応**: ライブラリのアップデートによる影響を局所化

```typescript
// ラッパーがあれば、Chakra UIの変更はラッパー内で吸収
export const Button = ({ variant, ...props }) => {
  // ここでChakra UIの破壊的変更に対応
  return <ChakraButton {...mapProps(props)} />;
};
```

### **Q2: セマンティックトークンの命名規則は？**

**A:** 以下の階層的な命名規則を使用：

```typescript
// カテゴリ.用途.状態
'brand.primary'        // ブランドカラーのプライマリ
'ui.success'          // UI要素の成功状態
'text.secondary'      // テキストのセカンダリ
'form.border.focus'   // フォームのボーダーのフォーカス状態
```

### **Q3: Storybookとテストの使い分けは？**

**A:** 以下の基準で使い分けます：

| 用途 | Storybook | Vitest |
|------|-----------|--------|
| **UI表示・操作テスト** | ✅ Play Function | ❌ |
| **ビジネスロジック** | ❌ | ✅ 単体テスト |
| **バリデーション網羅** | ❌ | ✅ パラメータ化テスト |
| **ユーザーフロー** | ✅ Story + Play | ❌ |
| **エラーケース大量テスト** | ❌ | ✅ test.each |

### **Q2: React Hook FormでuseEffectを使うべき？**

**A:** 基本的には不要です：

```typescript
// ❌ 避けるべき: 手動での同期
useEffect(() => {
  setValue('name', externalData.name);
}, [externalData, setValue]);

// ✅ 推奨: defaultValuesまたはreset
const { reset } = useForm({
  defaultValues: { name: '' }
});

// データ更新時
useEffect(() => {
  reset(externalData);
}, [externalData, reset]);
```

### **Q3: Zodスキーマはどこに定義すべき？**

**A:** コンポーネントの規模に応じて：

```
// 小規模: コンポーネント内
components/
  MyForm/
    MyForm.tsx          // スキーマも含む

// 中規模: 別ファイル
components/
  MyForm/
    MyForm.tsx
    validation.ts       // スキーマ専用

// 大規模: 共有ディレクトリ
schemas/
  userSchema.ts
  productSchema.ts
components/
  UserForm/
    UserForm.tsx       // import from schemas
```

### **Q4: テストデータの管理方法は？**

**A:** プロジェクトの規模に応じて：

```typescript
// 小規模: テストファイル内
const testData = {
  valid: { name: 'Test', email: 'test@example.com' },
  invalid: { name: '', email: 'invalid' }
};

// 中規模: コンポーネント専用
components/
  MyForm/
    testData.ts

// 大規模: 中央管理
test-utils/
  testData/
    userTestData.ts
    productTestData.ts
```

### **Q5: Play Functionが重い場合の対処法は？**

**A:** 以下の最適化を検討：

```typescript
// ❌ 重い: 毎回フルフロー
export const FullFlowTest: Story = {
  play: async ({ canvasElement }) => {
    // 10個のフィールドすべてに入力...
  }
};

// ✅ 軽い: ポイントを絞ったテスト
export const ValidationTest: Story = {
  play: async ({ canvasElement }) => {
    // 重要な1-2個のフィールドのみテスト
  }
};

export const SubmissionTest: Story = {
  args: { 
    // 初期データを設定して入力を省略
    initialData: validTestData 
  },
  play: async ({ canvasElement }) => {
    // 送信ボタンのみテスト
  }
};
```

### **Q6: アクセシビリティテストで何をチェックすべき？**

**A:** 最低限チェックすべき項目：

```typescript
// 1. ラベル関連付け
await expect(canvas.getByLabelText('Email')).toBeInTheDocument();

// 2. エラーメッセージの関連付け
const input = canvas.getByLabelText('Email');
expect(input).toHaveAttribute('aria-describedby');

// 3. 必須項目の表示
expect(input).toHaveAttribute('aria-required', 'true');

// 4. ロール属性
await expect(canvas.getByRole('button', { name: 'Submit' })).toBeInTheDocument();

// 5. フォーカス管理
await userEvent.tab();
expect(canvas.getByLabelText('Name')).toHaveFocus();
```

### **Q7: CI/CDでStorybookテストを実行するには？**

**A:** 以下のコマンドを使用：

```bash
# package.jsonに追加
{
  "scripts": {
    "test:storybook": "test-storybook",
    "test:storybook:ci": "test-storybook --ci --coverage"
  }
}

# GitHub Actions例
- name: Run Storybook tests
  run: |
    npm run build-storybook
    npm run test:storybook:ci
```

---

## 📋 開発時のチェックリスト

### **コンポーネント作成時**
- [ ] TypeScript型定義が適切
- [ ] Props インターフェースの定義
- [ ] Chakra UIラッパー経由での実装
- [ ] セマンティックトークンの使用
- [ ] アクセシビリティ属性（aria-*, role）
- [ ] エラーハンドリング
- [ ] デフォルトProps

### **Storybookストーリー作成時**
- [ ] Default ストーリー
- [ ] エラー状態のストーリー
- [ ] ローディング状態のストーリー
- [ ] エッジケースのストーリー
- [ ] Play Function でのインタラクションテスト

### **テスト作成時**
- [ ] Happy Path のテスト
- [ ] エラーケースのテスト
- [ ] 境界値テスト
- [ ] パラメータ化テスト（複数パターン）
- [ ] 非同期処理のテスト

### **バリデーション実装時**
- [ ] 必須項目チェック
- [ ] 形式チェック（メール、電話番号等）
- [ ] 文字数制限
- [ ] 数値範囲チェック
- [ ] カスタムバリデーション

### **コードレビュー観点**
- [ ] コンポーネントの責務が明確
- [ ] 再利用可能な設計
- [ ] パフォーマンスの考慮
- [ ] セキュリティの考慮
- [ ] テストの十分性

---

## 🏗️ Feature-Sliced Design パターン

### **層の責務と使い分け**

```
src/
├── shared/     # 再利用可能な要素（最下層）
│   ├── ui/     # Chakra UIラッパー
│   └── theme/  # セマンティックトークン
├── entities/   # ビジネスエンティティ
├── features/   # ユーザー機能
├── widgets/    # 複合UIブロック
└── pages/      # ページ組み立て（最上層）
```

### **インポートルール**

```typescript
// ✅ 正しい: 下位層のみをインポート
// features/contact/ui/ContactForm.tsx
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/field';

// ❌ 間違い: 上位層をインポート
// shared/ui/Button/Button.tsx
import { ContactForm } from '@/features/contact';  // 逆方向の依存
```

### **コンポーネント配置の判断基準**

| 条件 | 配置先 |
|------|--------|
| 汎用UIコンポーネント | shared/ui |
| ドメイン固有の表示 | entities/[entity]/ui |
| ユーザーアクション | features/[feature]/ui |
| 複数feature統合 | widgets/[widget]/ui |
| ページ全体 | pages/[page] |

---

## 🔗 有用なリンク集

### **公式ドキュメント**
- [Chakra UI v3 公式ドキュメント](https://www.chakra-ui.com/)
- [Storybook 公式ドキュメント](https://storybook.js.org/docs/react/get-started/introduction)
- [React Hook Form 公式ドキュメント](https://react-hook-form.com/)
- [Zod 公式ドキュメント](https://zod.dev/)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Testing Library 公式ドキュメント](https://testing-library.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)

### **チュートリアル・ガイド**
- [Storybook Tutorial](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/)
- [React Hook Form Get Started](https://react-hook-form.com/get-started)
- [Zod Basic Usage](https://zod.dev/?id=basic-usage)

### **コミュニティ・リソース**
- [Storybook Discord](https://discord.gg/storybook)
- [React Hook Form GitHub](https://github.com/react-hook-form/react-hook-form)
- [Awesome Storybook](https://github.com/lauthieb/awesome-storybook)

### **VSCode拡張機能**
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

---

## 📞 サポート・フィードバック

### **困った時の相談先**
1. **技術的な質問**: GitHub Issues または Discord
2. **バグ報告**: 該当ライブラリの GitHub Issues
3. **ベストプラクティス相談**: コミュニティフォーラム

### **継続学習のために**
- 定期的な公式ドキュメントの確認
- コミュニティでの情報交換
- 実プロジェクトでの実践
- 新機能・アップデートのキャッチアップ

**モダンフロントエンド開発の継続的な学習を応援しています！**