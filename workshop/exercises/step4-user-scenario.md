# Step 4: ユーザーシナリオテストを自動化しよう

## 目標  
Play Functionを使って、ユーザーの操作シナリオを自動化する


---

## 課題 4-1: Play Functionの基本を理解する

### Play Functionとは？
Storybook上でユーザーの操作を自動的に実行し、結果を検証する機能です。

### 基本的な構造
```typescript
import { userEvent, within, expect } from '@storybook/test'

export const UserScenario: Story = {
  name: 'ユーザーシナリオの説明',
  args: {
    // 初期状態のprops
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 前提条件の確認
    const button = canvas.getByRole('button')
    await expect(button).toBeInTheDocument()
    
    // When: ユーザーアクション
    await userEvent.click(button)
    
    // Then: 結果の検証
    await expect(button).toHaveClass('clicked')
  },
}
```

---

## 課題 4-2: TodoItemのユーザーシナリオ

TodoItemが**非制御コンポーネント**になったので、Play Functionがとてもシンプルになりました！

### シンプルなチェックボックステスト

```typescript
export const UserTogglesTodo: Story = {
  name: 'US-1-SC-1: ユーザーがタスクの完了状態を切り替える',
  args: {
    task: '買い物に行く',
    initialCompleted: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 未完了のタスクがある
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()
    
    // When: チェックボックスをクリックする
    await userEvent.click(checkbox)
    
    // Then: チェックボックスがチェックされる（実際に動作！）
    await expect(checkbox).toBeChecked()
  },
}
```

### 逆方向のテスト

```typescript
export const UserUnchecksCompletedTodo: Story = {
  name: 'US-1-SC-2: ユーザーが完了したタスクを未完了に戻す',
  args: {
    task: '洗濯物を干す',
    initialCompleted: true,  // 初期状態が完了
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 完了したタスクがある
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).toBeChecked()
    
    // When: チェックボックスをクリックする
    await userEvent.click(checkbox)
    
    // Then: チェックボックスのチェックが外れる
    await expect(checkbox).not.toBeChecked()
  },
}
```

### 課題: 2回切り替えるテストを追加

```typescript
export const UserTogglesTodoTwice: Story = {
  name: 'US-1-SC-3: ユーザーがタスクを2回切り替える',
  args: {
    task: '重要な会議の準備',
    initialCompleted: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 未完了のタスクがある
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()
    
    // When: チェックボックスをクリック（完了にする）
    await userEvent.click(checkbox)
    
    // Then: 完了状態になる
    await expect(checkbox).toBeChecked()
    
    // When: もう一度クリック（未完了に戻す）
    await userEvent.click(checkbox)
    
    // Then: 未完了状態に戻る
    await expect(checkbox).not.toBeChecked()
  },
}
```

### 削除ボタンのテスト

```typescript
export const UserDeletesTodo: Story = {
  name: 'US-2-SC-1: ユーザーがタスクを削除する',
  args: {
    task: 'ゴミ出し',
    initialCompleted: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: タスクがある
    await expect(canvas.getByText('ゴミ出し')).toBeInTheDocument()
    
    // When: 削除ボタンをクリックする
    const deleteButton = canvas.getByRole('button', { name: 'ゴミ出しを削除' })
    await userEvent.click(deleteButton)
    
    // Then: 削除処理が実行される（コンソールログで確認）
  },
}

### アクセシビリティテスト

```typescript
export const AccessibilityTest: Story = {
  name: 'アクセシビリティ確認',
  args: {
    task: 'キーボードでアクセス可能',
    initialCompleted: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // フォーカス移動のテスト
    const checkbox = canvas.getByRole('checkbox')
    const deleteButton = canvas.getByRole('button')
    
    // チェックボックスにフォーカス
    checkbox.focus()
    await expect(checkbox).toHaveFocus()
    
    // Tabで削除ボタンに移動
    await userEvent.tab()
    await expect(deleteButton).toHaveFocus()
    
    // 削除ボタンに適切なaria-labelがあることを確認
    await expect(deleteButton).toHaveAttribute('aria-label', 'キーボードでアクセス可能を削除')
  },
}
```

### ポイント

1. **シンプルな構造**: argsにinitialCompletedを設定するだけ
2. **自然な動作**: クリックしたら実際にチェック状態が変わる
3. **初心者に優しい**: ラッパーコンポーネントやrender propが不要

---

## 課題 4-3: Counterの連続操作シナリオ

`src/components/Counter/Counter.stories.tsx` に以下を追加：

### 課題: 5回インクリメント→リセットのシナリオ
```typescript
export const UserIncrementsAndResets: Story = {
  name: 'US-3-SC-1: ユーザーが5回カウントアップしてリセットする',
  args: {
    initialValue: 0,
    min: -5,
    max: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    const resetButton = canvas.getByLabelText('カウントをリセット')
    
    // Given: カウンターが初期値0
    await expect(counterValue).toHaveTextContent('0')
    
    // When: 5回インクリメント
    for (let i = 1; i <= 5; i++) {
      await userEvent.click(incrementButton)
      await expect(counterValue).toHaveTextContent(i.toString())
    }
    
    // Then: カウンターが5になる
    await expect(counterValue).toHaveTextContent('5')
    
    // When: リセットボタンをクリック
    await userEvent.click(resetButton)
    
    // Then: 初期値に戻る
    await expect(counterValue).toHaveTextContent('0')
  },
}
```

### 課題: 最大値到達シナリオ
```typescript
export const UserHitsMaximumLimit: Story = {
  name: 'US-3-SC-2: ユーザーが最大値に達してボタンが無効化される',
  args: {
    initialValue: 8,
    min: 0,
    max: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    
    // Given: カウンターが8
    await expect(counterValue).toHaveTextContent('8')
    await expect(incrementButton).not.toBeDisabled()
    
    // When: 2回インクリメント（最大値10に到達）
    await userEvent.click(incrementButton) // 9
    await userEvent.click(incrementButton) // 10
    
    // Then: 最大値に達し、ボタンが無効化される
    await expect(counterValue).toHaveTextContent('10')
    await expect(incrementButton).toBeDisabled()
  },
}
```

---

## 課題 4-4: UserCardの情報表示確認シナリオ

`src/components/UserCard/UserCard.stories.tsx` に以下を追加：

### 課題: 完全なプロフィール情報の確認
```typescript
export const DisplayCompleteProfile: Story = {
  name: 'US-4-SC-1: 完全なユーザー情報が正しく表示される',
  args: {
    name: 'テスト太郎',
    email: 'test.taro@company.com',
    age: 32,
    role: 'シニアエンジニア',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given & Then: すべての情報が正しく表示されている
    await expect(canvas.getByTestId('user-name')).toHaveTextContent('テスト太郎')
    await expect(canvas.getByTestId('user-email')).toHaveTextContent('test.taro@company.com')
    await expect(canvas.getByTestId('user-age')).toHaveTextContent('32歳')
    await expect(canvas.getByTestId('user-role')).toHaveTextContent('シニアエンジニア')
    await expect(canvas.getByAltText('テスト太郎のアバター')).toBeInTheDocument()
    await expect(canvas.getByTestId('online-indicator')).toBeInTheDocument()
  },
}
```

---

## 課題 4-5: 複雑なユーザーシナリオ

### 課題: エラーケースのシナリオ
長いタスク名での表示確認：

```typescript
export const LongTaskDisplayCheck: Story = {
  name: 'エッジケース: 長いタスク名の表示確認',
  args: {
    task: 'これは非常に長いタスク名の例です。UIが適切に長いテキストを処理し、レイアウトが崩れることなく、ユーザーにとって読みやすい形で表示されることを確認するためのテストケースです。',
    initialCompleted: false,
    onToggle: (completed: boolean) => console.log('toggled:', completed),
    onDelete: () => console.log('deleted'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // 長いテキストが表示されていることを確認
    const taskText = canvas.getByText(/これは非常に長いタスク名の例です/)
    await expect(taskText).toBeInTheDocument()
    
    // チェックボックスとボタンが操作可能であることを確認
    const checkbox = canvas.getByRole('checkbox')
    const deleteButton = canvas.getByRole('button')
    
    await expect(checkbox).toBeEnabled()
    await expect(deleteButton).toBeEnabled()
    
    // 実際に操作してみる
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  },
}
```

---

## Play Functionのデバッグ

### デバッグ用のコンソール出力
```typescript
play: async ({ canvasElement }) => {
  console.log('Play function started')
  
  const canvas = within(canvasElement)
  const button = canvas.getByRole('button')
  
  console.log('Button found:', button)
  
  await userEvent.click(button)
  console.log('Button clicked')
}
```

### 要素が見つからない場合
```typescript
// 要素の存在を確認してからアクション
const button = canvas.queryByRole('button')
if (button) {
  await userEvent.click(button)
} else {
  console.log('Button not found')
}
```

---

## Play Functionのベストプラクティス

### 1. 分かりやすいシナリオ名
```typescript
// 悪い例
export const Test1: Story = { name: 'test' }

// 良い例  
export const UserCompletesTask: Story = { 
  name: 'US-1-SC-1: ユーザーがタスクを完了状態にする' 
}
```

### 2. Given-When-Then構造
```typescript
play: async ({ canvasElement }) => {
  // Given: 前提条件の確認
  await expect(element).toBeInTheDocument()
  
  // When: ユーザーアクション
  await userEvent.click(element)
  
  // Then: 結果の検証  
  await expect(element).toHaveClass('active')
}
```

### 3. 適切な待機
```typescript
// 状態変更を待つ
await userEvent.click(button)
await expect(result).toBeInTheDocument()

// アニメーションを待つ場合
await new Promise(resolve => setTimeout(resolve, 300))
```

---

## 実際のプロジェクトでの活用

### Play Functionの価値
1. **回帰テストの自動化**: UI変更時の動作確認
2. **受け入れテストの実装**: ユーザーストーリーの直接的なテスト
3. **デモンストレーション**: ステークホルダーへの機能紹介
4. **ドキュメント**: 使用方法の実例提示

### CI/CDでの実行
```bash
# ヘッドレスモードでPlay Functionを実行
npm run test:storybook
```

---

## まとめ

このステップで学んだこと：
- Play Functionの基本的な使い方
- ユーザーシナリオの自動化方法
- 複雑な操作フローのテスト
- エラーケースやエッジケースの確認
- デバッグとベストプラクティス

### 全ステップを通じて学んだこと
1. ユーザーストーリー → シナリオ → テストの流れ
2. Vitestでの単体テスト
3. Storybookでの視覚的確認
4. Play Functionでのシナリオ自動化

### 確認事項
- [ ] TodoItemのPlay Functionが正常に動作する
- [ ] Counterの連続操作シナリオが実行される
- [ ] UserCardの情報確認シナリオが通る
- [ ] エラーケースのシナリオも実装できた
- [ ] Storybook上でPlay Functionが自動実行される

### 次に学ぶとよいこと
- Visual Testing（Chromatic）
- E2Eテスト（Playwright、Cypress）
- アクセシビリティテスト
- パフォーマンステスト