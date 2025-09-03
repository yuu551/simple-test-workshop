# ワークショップ解答例

## Step 5: TDD実践 - TodoItem編集機能

### 完全な実装例

#### 1. テストファイル（TodoItem.test.tsx）

```typescript
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TodoItem } from './TodoItem'

describe('TodoItem 編集機能', () => {
  const defaultProps = {
    task: '買い物に行く',
    completed: false,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('編集モードの切り替え', () => {
    it('編集ボタンをクリックすると編集モードになる', () => {
      const { getByRole, getByDisplayValue } = render(
        <TodoItem {...defaultProps} />
      )
      
      const editButton = getByRole('button', { name: '編集' })
      fireEvent.click(editButton)
      
      expect(getByDisplayValue('買い物に行く')).toBeInTheDocument()
      expect(getByRole('button', { name: '保存' })).toBeInTheDocument()
      expect(getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
    })

    it('編集モード中は削除ボタンとチェックボックスが表示されない', () => {
      const { getByRole, queryByRole } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      expect(queryByRole('button', { name: /削除/ })).not.toBeInTheDocument()
      expect(queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })

  describe('編集の保存', () => {
    it('新しいタスク名で保存できる', () => {
      const { getByRole, getByDisplayValue } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      const input = getByDisplayValue('買い物に行く')
      fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
      fireEvent.click(getByRole('button', { name: '保存' }))
      
      expect(defaultProps.onEdit).toHaveBeenCalledWith('スーパーで買い物')
    })

    it('Enterキーで保存できる', () => {
      const { getByRole, getByDisplayValue } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      const input = getByDisplayValue('買い物に行く')
      fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
      fireEvent.keyDown(input, { key: 'Enter' })
      
      expect(defaultProps.onEdit).toHaveBeenCalledWith('スーパーで買い物')
    })

    it('空文字では保存できない', () => {
      const { getByRole, getByDisplayValue } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      const input = getByDisplayValue('買い物に行く')
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(getByRole('button', { name: '保存' }))
      
      expect(defaultProps.onEdit).not.toHaveBeenCalled()
      // まだ編集モードのまま
      expect(getByRole('button', { name: '保存' })).toBeInTheDocument()
    })
  })

  describe('編集のキャンセル', () => {
    it('変更を破棄して元に戻せる', () => {
      const { getByRole, getByDisplayValue, getByText } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      const input = getByDisplayValue('買い物に行く')
      fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
      fireEvent.click(getByRole('button', { name: 'キャンセル' }))
      
      expect(defaultProps.onEdit).not.toHaveBeenCalled()
      expect(getByText('買い物に行く')).toBeInTheDocument()
    })

    it('Escapeキーでキャンセルできる', () => {
      const { getByRole, getByDisplayValue, getByText } = render(
        <TodoItem {...defaultProps} />
      )
      
      fireEvent.click(getByRole('button', { name: '編集' }))
      
      const input = getByDisplayValue('買い物に行く')
      fireEvent.change(input, { target: { value: 'スーパーで買い物' } })
      fireEvent.keyDown(input, { key: 'Escape' })
      
      expect(defaultProps.onEdit).not.toHaveBeenCalled()
      expect(getByText('買い物に行く')).toBeInTheDocument()
    })
  })
})
```

#### 2. コンポーネント実装（TodoItem.tsx）

```typescript
import { useState } from 'react'
import './TodoItem.css'

interface TodoItemProps {
  task: string
  completed: boolean
  onToggle: (completed: boolean) => void
  onDelete: () => void
  onEdit: (newTask: string) => void
}

export const TodoItem = ({ 
  task, 
  completed, 
  onToggle, 
  onDelete, 
  onEdit 
}: TodoItemProps) => {
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
    const trimmedText = editText.trim()
    if (trimmedText) {
      onEdit(trimmedText)
      setIsEditing(false)
    }
  }
  
  const handleCancel = () => {
    setEditText(task)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="todo-item todo-item--editing">
        <input
          type="text"
          className="todo-item__input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="タスク名を編集"
          autoFocus
        />
        <div className="todo-item__edit-actions">
          <button
            className="todo-item__save btn btn-primary"
            onClick={handleSave}
            disabled={!editText.trim()}
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
      
      <div className="todo-item__actions">
        <button
          className="todo-item__edit btn btn-secondary"
          onClick={handleEdit}
          aria-label={`${task}を編集`}
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
    </div>
  )
}
```

#### 3. スタイル追加（TodoItem.css）

```css
/* 既存のスタイルに追加 */

.todo-item--editing {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border: 2px solid #007bff;
  border-radius: 4px;
}

.todo-item__input {
  flex: 1;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-family: inherit;
}

.todo-item__input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.todo-item__edit-actions {
  display: flex;
  gap: 8px;
}

.todo-item__actions {
  display: flex;
  gap: 8px;
}

.todo-item__save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

#### 4. Storybookストーリー（TodoItem.stories.tsx）

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import { TodoItem } from './TodoItem'

const meta = {
  title: 'Components/TodoItem',
  component: TodoItem,
  args: {
    task: '買い物に行く',
    completed: false,
    onToggle: () => {},
    onDelete: () => {},
    onEdit: () => {},
  },
} satisfies Meta<typeof TodoItem>

export default meta
type Story = StoryObj<typeof meta>

export const Editing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const editButton = canvas.getByRole('button', { name: '編集' })
    
    await userEvent.click(editButton)
    
    const input = canvas.getByLabelText('タスク名を編集')
    expect(input).toHaveValue('買い物に行く')
    expect(canvas.getByRole('button', { name: '保存' })).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  },
}

export const EditAndSave: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // 編集モードに入る
    await userEvent.click(canvas.getByRole('button', { name: '編集' }))
    
    // テキストを変更
    const input = canvas.getByLabelText('タスク名を編集')
    await userEvent.clear(input)
    await userEvent.type(input, 'スーパーで買い物')
    
    // 保存
    await userEvent.click(canvas.getByRole('button', { name: '保存' }))
    
    // onEditが呼ばれたことを確認
    expect(args.onEdit).toHaveBeenCalledWith('スーパーで買い物')
  },
}

export const EditAndCancel: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // 編集モードに入る
    await userEvent.click(canvas.getByRole('button', { name: '編集' }))
    
    // テキストを変更
    const input = canvas.getByLabelText('タスク名を編集')
    await userEvent.clear(input)
    await userEvent.type(input, 'スーパーで買い物')
    
    // キャンセル
    await userEvent.click(canvas.getByRole('button', { name: 'キャンセル' }))
    
    // 元のテキストが表示される
    expect(canvas.getByText('買い物に行く')).toBeInTheDocument()
    expect(args.onEdit).not.toHaveBeenCalled()
  },
}
```

---

## TDD実践のポイント

### 1. テストの粒度
- 1つのテストケースは1つの振る舞いをテスト
- 境界値のテストを忘れない（空文字など）
- エラーケースも必ずテスト

### 2. 実装の進め方
- 最初は最小限の実装で通す
- その後、エッジケースを追加
- 最後にリファクタリング

### 3. よくある間違い
- テストを書く前に実装してしまう
- 一度に多くの機能を追加する
- リファクタリングを忘れる

### 4. 効果的なTDD
- コミットを細かく行う
- テストが通るたびにコミット
- リファクタリング後もコミット