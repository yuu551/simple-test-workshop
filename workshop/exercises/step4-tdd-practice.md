# Step 4: Play Function TDD - ユーザーシナリオから始める開発

## このステップの目標

**Play Function**を使ったTDD（テスト駆動開発）を実践し、ユーザーシナリオから始める開発手法を学びます。

### TDDサイクル
1. **RED** 🔴 - 失敗するPlay Functionを書く
2. **GREEN** 🟢 - Play Functionを通す最小限の実装
3. **REFACTOR** 🔵 - コードを改善

### なぜPlay Function TDD？

従来のTDD vs Play Function TDD:
- **従来のTDD**: 単体テストから始める → 実装 → 統合
- **Play Function TDD**: ユーザーシナリオから始める → 実装 → 確認

**メリット**:
- ユーザー視点で開発できる
- Storybookで視覚的にフィードバックを得られる
- Given-When-Thenで要求が明確になる
- 受け入れテストが自動化される

---

## 今回追加する機能：TodoItemの編集機能

### ユーザーストーリー
```gherkin
Feature: TodoItem編集機能

As a ユーザー
I want タスク名を編集したい
So that 間違ったタスク名を修正できる

Acceptance Criteria:
- 編集ボタンをクリックすると編集モードになる
- 編集中はタスク名が入力フィールドになる
- 保存ボタンで変更を確定する
- キャンセルボタンで変更を破棄する
- Enterキーで保存、Escキーでキャンセルできる
```

### シナリオ分解
```gherkin
Scenario 1: 編集モードに入る
  Given タスク「買い物に行く」が表示されている
  When 編集ボタンをクリックする
  Then タスク名が編集可能になる
  And 保存ボタンとキャンセルボタンが表示される

Scenario 2: 編集を保存する
  Given タスク「買い物に行く」を編集中
  When タスク名を「スーパーで買い物」に変更する
  And 保存ボタンをクリックする
  Then タスク名が「スーパーで買い物」に更新される
  And 編集モードが終了する

Scenario 3: 編集をキャンセルする
  Given タスク「買い物に行く」を編集中
  When タスク名を「スーパーで買い物」に変更する
  And キャンセルボタンをクリックする
  Then タスク名は「買い物に行く」のまま
  And 編集モードが終了する
```

---

## 🔴 Step 1: 失敗するPlay Functionを書く（RED）

まず、理想のユーザー体験をPlay Functionで記述します。

### TodoItem.stories.tsx に編集機能のPlay Functionを追加

```typescript
// src/components/TodoItem/TodoItem.stories.tsx に追加

export const UserEditsTaskName: Story = {
  name: 'US-3-SC-1: ユーザーがタスク名を編集する',
  args: {
    task: '買い物に行く',
    initialCompleted: false,
    onEdit: (newTask: string) => console.log('Task edited:', newTask)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: タスク「買い物に行く」が表示されている
    await expect(canvas.getByText('買い物に行く')).toBeInTheDocument()
    
    // When: 編集ボタンをクリックする
    const editButton = canvas.getByRole('button', { name: '買い物に行くを編集' })
    await userEvent.click(editButton)
    
    // Then: タスク名が編集可能になる
    const input = canvas.getByDisplayValue('買い物に行く')
    await expect(input).toBeInTheDocument()
    
    // And: 保存・キャンセルボタンが表示される
    await expect(canvas.getByRole('button', { name: '保存' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  }
}

export const UserSavesEditedTask: Story = {
  name: 'US-3-SC-2: ユーザーが編集を保存する',
  args: {
    task: '買い物に行く',
    initialCompleted: false,
    onEdit: (newTask: string) => console.log('Task saved:', newTask)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 編集モードに入る
    const editButton = canvas.getByRole('button', { name: '買い物に行くを編集' })
    await userEvent.click(editButton)
    
    // When: タスク名を変更する
    const input = canvas.getByDisplayValue('買い物に行く')
    await userEvent.clear(input)
    await userEvent.type(input, 'スーパーで買い物')
    
    // And: 保存ボタンをクリック
    const saveButton = canvas.getByRole('button', { name: '保存' })
    await userEvent.click(saveButton)
    
    // Then: 新しいタスク名が表示される
    await expect(canvas.getByText('スーパーで買い物')).toBeInTheDocument()
    
    // And: 編集モードが終了している
    await expect(canvas.queryByDisplayValue('スーパーで買い物')).not.toBeInTheDocument()
  }
}

export const UserCancelsEdit: Story = {
  name: 'US-3-SC-3: ユーザーが編集をキャンセルする',
  args: {
    task: '買い物に行く',
    initialCompleted: false,
    onEdit: (newTask: string) => console.log('Task edited:', newTask)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 編集モードに入る
    const editButton = canvas.getByRole('button', { name: '買い物に行くを編集' })
    await userEvent.click(editButton)
    
    // When: タスク名を変更する
    const input = canvas.getByDisplayValue('買い物に行く')
    await userEvent.clear(input)
    await userEvent.type(input, 'スーパーで買い物')
    
    // And: キャンセルボタンをクリック
    const cancelButton = canvas.getByRole('button', { name: 'キャンセル' })
    await userEvent.click(cancelButton)
    
    // Then: 元のタスク名が表示される
    await expect(canvas.getByText('買い物に行く')).toBeInTheDocument()
    
    // And: 編集モードが終了している
    await expect(canvas.queryByDisplayValue('買い物に行く')).not.toBeInTheDocument()
  }
}
```

### 確認ポイント
1. Storybookを起動: `npm run storybook`
2. TodoItemのストーリーを開く
3. 新しいPlay Functionがエラーで失敗することを確認

**期待される失敗**:
- "編集"ボタンが見つからない
- TypeScriptエラー: onEditプロパティが存在しない

これで🔴**RED**フェーズ完了！

---

## 🟢 Step 2: Play Functionを通す最小限の実装（GREEN）

Play Functionが通るように、必要最小限の機能を実装します。

### TodoItemコンポーネントに編集機能を追加

```typescript
// src/components/TodoItem/TodoItem.tsx

import { useState } from 'react'

interface TodoItemProps {
  task: string
  initialCompleted?: boolean
  onToggle?: (completed: boolean) => void
  onDelete?: () => void
  onEdit?: (newTask: string) => void // 新しいprop
}

export const TodoItem = ({ 
  task, 
  initialCompleted = false, 
  onToggle, 
  onDelete, 
  onEdit 
}: TodoItemProps) => {
  const [completed, setCompleted] = useState(initialCompleted)
  const [currentTask, setCurrentTask] = useState(task)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task)

  const handleToggle = () => {
    const newCompleted = !completed
    setCompleted(newCompleted)
    onToggle?.(newCompleted)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(currentTask) // 現在のタスク名で初期化
  }

  const handleSave = () => {
    setCurrentTask(editText) // 内部状態を更新
    onEdit?.(editText)       // 親にも通知
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(currentTask) // 元の値に戻す
    setIsEditing(false)
  }

  // 編集モードの場合
  if (isEditing) {
    return (
      <div className="todo-item todo-item--editing">
        <input
          type="text"
          className="todo-item__input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
        />
        <button
          className="todo-item__save btn btn-primary"
          onClick={handleSave}
        >
          保存
        </button>
        <button
          className="todo-item__cancel btn btn-secondary"
          onClick={handleCancel}
        >
          キャンセル
        </button>
      </div>
    )
  }

  // 通常表示モード
  return (
    <div className={`todo-item ${completed ? 'todo-item--completed' : ''}`}>
      <label className="todo-item__label">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={completed}
          onChange={handleToggle}
        />
        <span className="todo-item__text">{currentTask}</span>
      </label>
      
      <button
        className="todo-item__edit btn btn-secondary"
        onClick={handleEdit}
        aria-label={`${currentTask}を編集`}
      >
        編集
      </button>
      
      <button
        className="todo-item__delete btn btn-danger"
        onClick={onDelete}
        aria-label={`${currentTask}を削除`}
      >
        削除
      </button>
    </div>
  )
}
```

### 確認ポイント
1. Storybookで新しいPlay Functionを実行
2. 全てのシナリオが通ることを確認
3. アクションタブでonEditコールバックが呼ばれることを確認

これで🟢**GREEN**フェーズ完了！

---

## 🔵 Step 3: コードを改善する（REFACTOR）

Play Functionが通ったので、コードを改善しましょう。



### 改善課題
1. キーボード操作対応（Enter/Escape）
2. 空文字入力の防止
3. アクセシビリティの向上
4. エラーハンドリング

### リファクタリングの検証用Play Function

```typescript
export const UserUsesKeyboardShortcuts: Story = {
  name: 'US-3-SC-4: ユーザーがキーボードショートカットを使う',
  args: {
    task: '買い物に行く',
    initialCompleted: false,
    onEdit: (newTask: string) => console.log('Task edited with keyboard:', newTask)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 編集モードに入る
    const editButton = canvas.getByRole('button', { name: '買い物に行くを編集' })
    await userEvent.click(editButton)
    
    // When: タスク名を変更してEnterキーを押す
    const input = canvas.getByDisplayValue('買い物に行く')
    await userEvent.clear(input)
    await userEvent.type(input, 'スーパーで買い物{enter}')
    
    // Then: 編集が保存される
    await expect(canvas.getByText('スーパーで買い物')).toBeInTheDocument()
  }
}
```

### リファクタリング実装

```typescript
// 改善されたhandleSave
const handleSave = () => {
  const trimmedText = editText.trim()
  if (trimmedText && trimmedText !== currentTask) {
    setCurrentTask(trimmedText) // 内部状態を更新
    onEdit?.(trimmedText)       // 親にも通知
  }
  setIsEditing(false)
}

// キーボードイベントハンドラーを追加
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleSave()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}

// inputにキーボードイベントを追加
<input
  type="text"
  className="todo-item__input"
  value={editText}
  onChange={(e) => setEditText(e.target.value)}
  onKeyDown={handleKeyDown}
  aria-label="タスク名を編集"
  autoFocus
/>
```

これで🔵**REFACTOR**フェーズを体験しました！

---

## 実践課題

### 課題1: 基本のTDDサイクル
上記の手順を実際に実行してみましょう：

1. 🔴 失敗するPlay Functionを追加
2. 🟢 最小限の実装でPlay Functionを通す
3. 🔵 コードを改善

### 課題2: 追加シナリオのTDD
以下のシナリオもPlay Function TDDで実装してみましょう。

```gherkin
Scenario: 空文字での保存を防ぐ
  Given タスク「買い物に行く」を編集中
  When タスク名を空文字に変更する
  And 保存ボタンをクリックする
  Then タスク名は「買い物に行く」のまま
  And 編集モードが終了する

Scenario: 編集中は他の操作を無効化
  Given タスク「買い物に行く」を編集中
  Then チェックボックスが無効化されている
  And 削除ボタンが無効化されている
```

### 課題3: 新機能のTDD（上級者向け）
新しいユーザーストーリーから始めてみましょう。

```gherkin
Feature: タスクの優先度設定

As a ユーザー
I want タスクに優先度（高・中・低）を設定したい
So that 重要なタスクを見分けられる

Scenario: 優先度を設定する
  Given タスクが表示されている
  When 優先度ボタンをクリックする
  Then 優先度選択メニューが表示される
  When 「高」を選択する
  Then タスクに高優先度の表示が追加される
```

---

## Play Function TDD vs 従来のTDD

### メリット
| 従来のTDD | Play Function TDD |
|-----------|-------------------|
| 単体テスト中心 | ユーザーシナリオ中心 |
| モック多用 | 実際の操作をテスト |
| 実装詳細に依存 | ユーザー体験を重視 |
| テキストベース | 視覚的フィードバック |

### ベストプラクティス
1. **シナリオファースト**: 実装前にユーザーシナリオを明確にする
2. **Given-When-Then**: 3段階で条件・操作・結果を明確にする  
3. **視覚的確認**: Storybookで実際の動作を確認しながら開発
4. **段階的実装**: RED → GREEN → REFACTORのサイクルを守る

---

## まとめ

Play Function TDDで学んだこと
- ユーザーシナリオから始める開発手法
- Given-When-Thenでの要求整理
- 視覚的フィードバックを活用した開発
- TDDサイクルによる安全なリファクタリング

### 次のステップ
色々なケースでPlay Function TDDを実践してみましょう！

1. ユーザーストーリーの作成
2. シナリオの細分化
3. Play Functionでの失敗テスト作成
4. 最小実装
5. リファクタリング