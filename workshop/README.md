# Simple Test Workshop - ワークショップガイド

## ワークショップの目標

このワークショップでは、ユーザー視点でのテスト作成を実践的に学びます。

### 学習内容
1. ユーザーストーリーからシナリオを考える思考法
2. Vitestでのシンプルなテスト作成
3. Storybookでのコンポーネント確認・テスト
4. Play Functionでの自動化されたユーザーシナリオテスト
5. TDD（テスト駆動開発）での新機能追加

---

## Phase 1: セットアップ

### 環境確認
```bash
# Node.js 18以上が必要
node --version

# プロジェクトのクローン
git clone <repository-url>
cd simple-test-workshop

# 依存関係のインストール
npm install

# 動作確認
npm run dev        # http://localhost:5173
npm run storybook  # http://localhost:6006  
npm run test       # テスト実行
```

すべて正常に起動・実行できれば準備完了です。

---

## Phase 2: ユーザーストーリーを考える

### お題: 「簡単なTodoアプリを作ろう」

まず、以下のユーザーストーリーを読んで、どんな機能が必要かを考えてみましょう。

**US-1: タスクの完了状態を切り替えたい**
- As a ユーザー
- I want タスクのチェックボックスをクリックして完了状態を切り替えたい
- So that 完了したタスクと未完了のタスクを区別できる

**US-2: 不要なタスクを削除したい**
- As a ユーザー  
- I want 不要になったタスクを削除したい
- So that タスクリストをきれいに保てる

**US-3: 数をカウントしたい**
- As a ユーザー
- I want ボタンを押して数字を増減させたい
- So that 何らかのカウントを管理できる

### 演習 2-1: シナリオを書く
それぞれのユーザーストーリーについて、具体的なシナリオを書いてみましょう。

例：
```gherkin
# US-1のシナリオ例
Given 未完了のタスク「買い物に行く」がある
When タスクのチェックボックスをクリックする  
Then タスクが完了状態になる
And チェックマークが表示される
And タスクのテキストに取り消し線が付く
```

**練習**: US-2とUS-3のシナリオも同様に書いてみましょう。

---

## Phase 3: Vitestでテストを書く

### まずは簡単なユーティリティ関数から

`src/utils/formatDate.test.ts` を見て、シンプルなテストの構造を確認しましょう。

```typescript
test('基本的な動作をテスト', () => {
  // Given: 前提条件
  const input = '何らかの入力'
  
  // When: 実行
  const result = targetFunction(input)
  
  // Then: 期待結果
  expect(result).toBe('期待される出力')
})
```

### コンポーネントのテスト

`src/components/TodoItem/TodoItem.test.tsx` を確認しながら、以下の点を理解しましょう。

1. コンポーネントのレンダリング
2. ユーザーイベント（クリック）のテスト
3. モック関数の使用
4. アクセシビリティ（aria-label）のテスト

### 演習 3-1: 新しいテストを追加
TodoItemコンポーネントに以下のテストを追加してみましょう：

```typescript
test('完了したタスクには取り消し線のスタイルが適用される', () => {
  // ここを実装してみましょう
})
```

ヒント: `toHaveClass` マッチャーを使用します。

---

## Phase 4: Storybookストーリーを作る

### Storybookでコンポーネントを確認

```bash
npm run storybook
```

ブラウザで http://localhost:6006 を開き、作成されたストーリーを確認してみましょう。

- Components/TodoItem の様々な状態
- Components/Counter の操作
- Components/UserCard の表示パターン

### ストーリーの基本構造

```typescript
export const Default: Story = {
  args: {
    // コンポーネントのプロパティ
    task: '買い物に行く',
    completed: false,
  },
}
```

### 演習 4-1: 新しいストーリーを作る
TodoItemに「緊急タスク」のストーリーを追加してみましょう。

```typescript
export const UrgentTask: Story = {
  args: {
    task: '緊急: 重要な会議の準備',
    completed: false,
    // 他に必要なプロパティがあれば追加
  },
}
```

---

## Phase 5: Play Functionで自動テスト

### Play Functionとは
ユーザーの操作を自動化してテストするStorybookの機能です。

```typescript
export const UserScenario: Story = {
  name: 'ユーザーがタスクを完了する',
  args: { task: '買い物に行く', completed: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: チェックボックスが未チェック
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()
    
    // When: チェックボックスをクリック
    await userEvent.click(checkbox)
    
    // Then: チェックされる
    await expect(checkbox).toBeChecked()
  },
}
```

### 演習 5-1: Counterのシナリオを作る
Counter コンポーネントに以下のシナリオを実装してみましょう：

```typescript
export const UserIncrements5Times: Story = {
  name: 'ユーザーが5回カウントアップする',
  args: {},
  play: async ({ canvasElement }) => {
    // ここを実装してみましょう
    // ヒント: 5回ボタンをクリックして、値が5になることを確認
  },
}
```

---

## Phase 6: TDDで新機能を追加

### TDD（テスト駆動開発）とは？

1. **RED** 🔴 - まず失敗するテストを書く
2. **GREEN** 🟢 - テストを通す最小限の実装をする
3. **REFACTOR** 🔵 - コードを改善する

### 実践：TodoItemに編集機能を追加

既存のTodoItemコンポーネントに、タスク名を編集できる機能を追加します。

#### シナリオ
```gherkin
Given タスク「買い物に行く」が表示されている
When 編集ボタンをクリックする
Then タスク名が編集可能になる
And 保存ボタンとキャンセルボタンが表示される
```

### 演習 6-1: TDDサイクルを体験

1. まず失敗するテストを書く（exercises/step5-tdd-practice.mdを参照）
2. テストを実行して失敗することを確認
3. 最小限の実装でテストを通す
4. コードをリファクタリング

### TDDのメリット
- 設計が明確になる
- バグが少なくなる
- リファクタリングが安心してできる
- テストがドキュメントの役割を果たす

---

## Phase 7: シナリオから考えよう

### 振り返り
これまでの作業を通じて、以下の点を話し合ってみましょう：

1. ユーザーストーリー → シナリオ → テストの流れは分かりやすかったか？
2. VitestのテストとStorybookのテスト、それぞれの良さは何か？  
3. 実際のプロジェクトでどう活用できそうか？

### 次に作るとしたら？
もし時間があれば、以下のような新しいコンポーネントを考えてみましょう：

- **SearchBox**: 検索機能付きの入力フィールド
- **ModalDialog**: 確認ダイアログ
- **ProgressBar**: 進捗表示

それぞれのユーザーストーリーとテストシナリオを考えてみてください。

---

## まとめ

### 今日学んだこと
- ユーザー視点でテストを考える方法
- Vitestでの基本的なテスト作成
- Storybookでのコンポーネント確認・テスト
- Play Functionでのシナリオ自動化
- TDD（テスト駆動開発）の実践方法

### 持ち帰れること
- このプロジェクトのコードはそのまま参考資料として使える
- テスト駆動の考え方で品質を向上できる
- ユーザーストーリーベースの開発手法

### 参考資料
- `exercises/` フォルダに段階的な練習問題（step5-tdd-practice.mdを含む）
- `solutions/` フォルダに解答例
- `scenarios/` フォルダにユーザーストーリー集とTDDシナリオ（02-tdd-scenarios.md）
- `WORKSHOP_SOLUTIONS.md` に完全な実装例

お疲れ様でした！