# Step 3: ユーザーシナリオテストを自動化しよう

## 目標  
Play Functionを使って、ユーザーの操作シナリオを自動化する

### このステップの進め方（追加要否の早見表）
- **3-2 TodoItem**: 確認のみ（追記不要）
- **3-3 Counter**: 追記が必要（新しいシナリオを追加）
- **3-4 UserCard**: 追記が必要（新しいシナリオを追加）

---

## 課題 3-1: Play Functionの基本を理解する

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

## 3-2: TodoItemのユーザーシナリオ

> 注記: この課題は既に実装済みです。以下のシナリオは `src/components/TodoItem/TodoItem.stories.tsx` に用意されています。Storybook上で再生して「確認」のみ行ってください（追記不要）。
> - `UserTogglesTodo`
> - `UserUnchecksCompletedTodo`
> - `UserTogglesTodoTwice`
> - `UserDeletesTodo`

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

### 2回切り替えるテスト

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
    
  },
}
```

### ポイント

1. **シンプルな構造**: argsにinitialCompletedを設定するだけ
2. **自然な動作**: クリックしたら実際にチェック状態が変わる
3. **初心者に優しい**: ラッパーコンポーネントやrender propが不要

---

## 課題 3-3: Counterの連続操作シナリオ

> 注記: この課題は未実装のため「追記が必要」です。`src/components/Counter/Counter.stories.tsx` に本シナリオ（`UserIncrementsAndResets`）を追加してください。類似のシナリオ（`UserIncrementsCounter`, `UserResetsCounter` など）はありますが、指定の「5回インクリメント→リセット」をまとめて検証するストーリーは未追加です。

`src/components/Counter/Counter.stories.tsx` に以下を追加します。

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
    
    const counterValue = canvas.getByRole('status', { name: '現在のカウント' })
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

---

## 課題 3-4: UserCardの情報表示確認シナリオ

> 注記: この課題は未実装のため「追記が必要」です。`src/components/UserCard/UserCard.stories.tsx` に本シナリオ（`DisplayCompleteProfile`）を追加してください。分割された確認用シナリオ（`DisplayUserInformation`, `DisplayOnlineStatus`, `DisplayCustomAvatar` など）はありますが、要求どおり「完全なプロフィール情報を一括で確認する」ストーリーは未追加です。

`src/components/UserCard/UserCard.stories.tsx` に以下を追加します。

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
    await expect(canvas.getByRole('heading', { name: 'テスト太郎' })).toBeInTheDocument()
    await expect(canvas.getByText('test.taro@company.com')).toBeInTheDocument()
    await expect(canvas.getByText('年齢:')).toBeInTheDocument()
    await expect(canvas.getByText('32歳')).toBeInTheDocument()
    await expect(canvas.getByText('シニアエンジニア')).toBeInTheDocument()
    await expect(canvas.getByAltText('テスト太郎のアバター')).toBeInTheDocument()
    await expect(canvas.getByRole('status', { name: 'オンライン' })).toBeInTheDocument()
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

このステップで学んだこと
- Play Functionの基本的な使い方
- ユーザーシナリオの自動化方法
- デバッグ