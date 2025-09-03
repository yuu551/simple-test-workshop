# Step 2: コンポーネントのテストを書こう

## 目標
Reactコンポーネントのテストの書き方を学ぶ


---

## 課題 2-1: TodoItemの新しいテストを追加

`src/components/TodoItem/TodoItem.test.tsx` を開いて、既存のテストを確認してください。

### コンポーネントテストの基本パターン
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TodoItem from './TodoItem'

test('テストの説明', () => {
  // 1. コンポーネントをレンダリング
  render(<TodoItem prop1="value1" prop2={mockFunction} />)
  
  // 2. 要素を取得
  const element = screen.getByRole('button')
  
  // 3. アクション実行（必要に応じて）
  fireEvent.click(element)
  
  // 4. 期待結果を検証
  expect(element).toHaveTextContent('期待される文字列')
})
```

### 課題: CSSクラスのテスト
完了したタスクに正しいCSSクラスが適用されるかテストしてみましょう：

```typescript
test('完了したタスクにはcompletedクラスが適用される', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  render(
    <TodoItem
      task="完了したタスク"
      completed={true}
      onToggle={mockOnToggle}
      onDelete={mockOnDelete}
    />
  )

  // todo-itemクラスを持つ要素を取得
  const todoItem = document.querySelector('.todo-item')
  
  // todo-item--completedクラスが適用されていることを確認
  expect(todoItem).toHaveClass('todo-item--completed')
})
```

---

## 課題 2-2: Counterコンポーネントのテスト追加

`src/components/Counter/Counter.test.tsx` を確認して、以下のテストを追加してみましょう：

### 課題: ボタンの無効化状態のテスト
```typescript
test('最大値に達するとインクリメントボタンが無効化される', () => {
  render(<Counter initialValue={2} max={3} />)
  
  const incrementButton = screen.getByLabelText('カウントを1増やす')
  const counterValue = screen.getByTestId('counter-value')
  
  // 最初は有効
  expect(incrementButton).not.toBeDisabled()
  
  // 1回クリック → 最大値に到達
  fireEvent.click(incrementButton)
  
  // 値が最大値になることを確認
  expect(counterValue).toHaveTextContent('3')
  
  // ボタンが無効化されることを確認
  expect(incrementButton).toBeDisabled()
})
```

### 考えてみよう
- なぜ無効化のテストが重要なのでしょうか？
- 他にどんな境界値テストが考えられますか？

---

## 課題 2-3: UserCardの条件付きレンダリング

`src/components/UserCard/UserCard.test.tsx` を確認して、条件付きレンダリングのテストを追加してみましょう：

### 課題: オプショナルな情報の表示テスト
```typescript
test('すべての情報が提供された場合にすべて表示される', () => {
  render(
    <UserCard
      name="テスト太郎"
      email="test@example.com"
      age={30}
      role="開発者"
      avatarUrl="https://example.com/avatar.jpg"
      isOnline={true}
    />
  )

  // すべての情報が表示されることを確認
  expect(screen.getByTestId('user-name')).toHaveTextContent('テスト太郎')
  expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
  expect(screen.getByTestId('user-age')).toHaveTextContent('30歳')
  expect(screen.getByTestId('user-role')).toHaveTextContent('開発者')
  expect(screen.getByAltText('テスト太郎のアバター')).toBeInTheDocument()
  expect(screen.getByTestId('online-indicator')).toBeInTheDocument()
})
```

---

## 課題 2-4: 新しいテストケースを考える

以下のテストケースを自分で実装してみましょう：

### TodoItem
1. 長いタスク名が正しく表示される
2. 削除ボタンにフォーカスが当たる

### Counter  
1. リセットボタンが正しく動作する
2. 範囲表示が正しい

### UserCard
1. アバターのプレースホルダーが正しいイニシャルを表示する
2. オフライン状態ではインジケーターが表示されない

---

## React Testing Libraryのベストプラクティス

### 1. ユーザーの視点でテストする
```typescript
// 実装詳細をテスト
const button = container.querySelector('.btn-primary')

// ユーザーが認識する方法でテスト
const button = screen.getByRole('button', { name: '送信' })
```

### 2. 適切なクエリメソッドを使う
```typescript
// 優先度の高い順
screen.getByRole('button')           // アクセシビリティ重視
screen.getByLabelText('名前')        // フォーム要素
screen.getByText('こんにちは')        // 表示テキスト
screen.getByTestId('counter-value')  // 最後の手段
```

### 3. 非同期処理には適切な待機を使う
```typescript
// setTimeout での待機
setTimeout(() => expect(element).toBeInTheDocument(), 1000)

// React Testing Libraryの非同期ユーティリティ
await screen.findByText('読み込み完了')
await waitFor(() => expect(element).toBeVisible())
```

---

## モック関数の使い方

### 基本的な使い方
```typescript
const mockFunction = vi.fn()

// 関数が呼ばれたかテスト  
expect(mockFunction).toHaveBeenCalled()

// 特定の引数で呼ばれたかテスト
expect(mockFunction).toHaveBeenCalledWith('expected-value')

// 呼び出し回数のテスト
expect(mockFunction).toHaveBeenCalledTimes(1)
```

### 戻り値を設定
```typescript
const mockFunction = vi.fn().mockReturnValue('mocked-value')

// または
mockFunction.mockImplementation((arg) => `processed-${arg}`)
```

---

## テスト実行とデバッグ

### 特定のコンポーネントのテスト実行
```bash
npm run test TodoItem
npm run test Counter  
npm run test UserCard
```

### デバッグに便利なメソッド
```typescript
// 現在のDOMの状態を表示
screen.debug()

// 特定の要素を表示
screen.debug(screen.getByRole('button'))
```

---

## まとめ

このステップで学んだこと：
- Reactコンポーネントのテストの基本パターン
- React Testing Libraryの使い方
- モック関数の使用方法
- 条件付きレンダリングのテスト
- ユーザー視点でのテストの重要性

### 次のステップ
Step 3では、Storybookでの視覚的なテストについて学びます。

### 確認事項
- [ ] TodoItemの新しいテストが通る
- [ ] Counterの境界値テストが通る
- [ ] UserCardの条件付きテストが通る
- [ ] 自分で考えたテストケースが実装できた