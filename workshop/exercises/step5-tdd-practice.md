# Step 5: テスト駆動開発（TDD）で新機能を追加しよう

## このステップの目標

TDD（テスト駆動開発）の実践を通じて、新しい機能を追加する方法を学びます。

### TDDのサイクル
1. **RED** 🔴 - 失敗するテストを書く
2. **GREEN** 🟢 - テストを通す最小限の実装
3. **REFACTOR** 🔵 - コードを改善

---

## 今回追加する機能：TodoItemの編集機能

### シナリオ

```gherkin
Feature: TodoItem編集機能

Scenario: タスク名を編集する
  Given タスク「買い物に行く」が表示されている
  When 編集ボタンをクリックする
  Then タスク名が編集可能になる
  And 保存ボタンとキャンセルボタンが表示される

Scenario: 編集を保存する
  Given タスク「買い物に行く」を編集中
  When タスク名を「スーパーで買い物」に変更する
  And 保存ボタンをクリックする
  Then タスク名が「スーパーで買い物」に更新される
  And 編集モードが終了する

Scenario: 編集をキャンセルする
  Given タスク「買い物に行く」を編集中
  When タスク名を「スーパーで買い物」に変更する
  And キャンセルボタンをクリックする
  Then タスク名は「買い物に行く」のまま
  And 編集モードが終了する
```

---

## 🔴 Step 1: 失敗するテストを書く

まず、TodoItem.test.tsx に編集機能のテストを追加しましょう。

```typescript
// src/components/TodoItem/TodoItem.test.tsx に追加

describe('編集機能', () => {
  it('編集ボタンをクリックすると編集モードになる', () => {
    const { getByRole, getByDisplayValue } = render(
      <TodoItem
        task="買い物に行く"
        completed={false}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()} // 新しいprop
      />
    )
    
    // 編集ボタンをクリック
    const editButton = getByRole('button', { name: '編集' })
    fireEvent.click(editButton)
    
    // 入力フィールドが表示される
    expect(getByDisplayValue('買い物に行く')).toBeInTheDocument()
    
    // 保存・キャンセルボタンが表示される
    expect(getByRole('button', { name: '保存' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  })
  
  it('編集を保存できる', () => {
    const mockOnEdit = vi.fn()
    const { getByRole, getByDisplayValue } = render(
      <TodoItem
        task="買い物に行く"
        completed={false}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={mockOnEdit}
      />
    )
    
    // 編集モードに入る
    fireEvent.click(getByRole('button', { name: '編集' }))
    
    // タスク名を変更
    const input = getByDisplayValue('買い物に行く')
    fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
    
    // 保存
    fireEvent.click(getByRole('button', { name: '保存' }))
    
    // onEditが新しい値で呼ばれる
    expect(mockOnEdit).toHaveBeenCalledWith('スーパーで買い物')
  })
  
  it('編集をキャンセルできる', () => {
    const mockOnEdit = vi.fn()
    const { getByRole, getByDisplayValue, getByText } = render(
      <TodoItem
        task="買い物に行く"
        completed={false}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={mockOnEdit}
      />
    )
    
    // 編集モードに入る
    fireEvent.click(getByRole('button', { name: '編集' }))
    
    // タスク名を変更
    const input = getByDisplayValue('買い物に行く')
    fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
    
    // キャンセル
    fireEvent.click(getByRole('button', { name: 'キャンセル' }))
    
    // onEditは呼ばれない
    expect(mockOnEdit).not.toHaveBeenCalled()
    
    // 元のテキストが表示される
    expect(getByText('買い物に行く')).toBeInTheDocument()
  })
})
```

### ポイント
- テストが失敗することを確認しましょう（TypeScriptエラーも出ます）
- 必要な機能を明確にしてからコードを書き始めます

---

## 🟢 Step 2: テストを通す実装

次に、最小限の実装でテストを通しましょう。

```typescript
// src/components/TodoItem/TodoItem.tsx

interface TodoItemProps {
  task: string
  completed: boolean
  onToggle: (completed: boolean) => void
  onDelete: () => void
  onEdit: (newTask: string) => void // 新しいprop
}

export const TodoItem = ({ task, completed, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task)

  const handleToggle = () => {
    onToggle(!completed)
  }
  
  const handleEdit = () => {
    setIsEditing(true)
    setEditText(task)
  }
  
  const handleSave = () => {
    onEdit(editText)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditText(task)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="todo-item todo-item--editing">
        <input
          type="text"
          className="todo-item__input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
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

  return (
    <div className={`todo-item ${completed ? 'todo-item--completed' : ''}`}>
      <label className="todo-item__label">
        <input
          type="checkbox"
          className="todo-item__checkbox"
          checked={completed}
          onChange={handleToggle}
        />
        <span className="todo-item__text">{task}</span>
      </label>
      
      <button
        className="todo-item__edit btn btn-secondary"
        onClick={handleEdit}
      >
        編集
      </button>
      
      <button
        className="todo-item__delete btn btn-danger"
        onClick={onDelete}
        aria-label={`${task}を削除`}
      >
        削除
      </button>
    </div>
  )
}
```

---

## 🔵 Step 3: リファクタリング

テストが通ったら、コードを改善しましょう。

### 改善ポイント
1. アクセシビリティの向上（aria-label追加）
2. キーボード操作の対応（EnterとEscキー）
3. 空文字の入力を防ぐ

```typescript
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && editText.trim()) {
    handleSave()
  } else if (e.key === 'Escape') {
    handleCancel()
  }
}

// inputに追加
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

---

## 実践してみよう

1. まず、上記のテストをコピーして実行してみましょう
   ```bash
   npm test TodoItem.test
   ```

2. テストが失敗することを確認

3. 実装を追加してテストを通す

4. さらに以下の機能も追加してみましょう：
   - 編集中は削除ボタンを無効化
   - 編集中は完了チェックボックスを無効化
   - 空文字での保存を防ぐ

---

## 発展課題

### 上級者向け：新しいユーザーストーリーから始める

新しい機能のユーザーストーリーを書いて、それをテストに落とし込んでみましょう。

```
As a ユーザー
I want タスクに優先度（高・中・低）を設定したい
So that 重要なタスクから取り組める
```

1. このユーザーストーリーから受け入れ基準を考える
2. 受け入れ基準からテストシナリオを作成
3. TDDで実装

---

## まとめ

TDDのメリット：
- 設計が明確になる
- バグが少なくなる
- リファクタリングが安心してできる
- ドキュメントとしても機能する

次は、実際のプロジェクトでTDDを実践してみましょう！