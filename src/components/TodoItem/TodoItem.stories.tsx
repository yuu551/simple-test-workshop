import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { TodoItem } from './TodoItem'
import { useState } from 'react'

// 状態管理を持つラッパーコンポーネント
const TodoItemWithState = ({ task, initialCompleted = false }: { task: string; initialCompleted?: boolean }) => {
  const [completed, setCompleted] = useState(initialCompleted)
  
  return (
    <TodoItem
      task={task}
      completed={completed}
      onToggle={(newCompleted) => {
        console.log('onToggle:', newCompleted)
        setCompleted(newCompleted)
      }}
      onDelete={() => console.log('onDelete called')}
    />
  )
}

const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  parameters: {
    layout: 'padded',
  },
  args: {
    onToggle: (completed: boolean) => {
      console.log('onToggle:', completed)
    },
    onDelete: () => {
      console.log('onDelete called')
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 基本的な状態
export const Default: Story = {
  args: {
    task: '買い物に行く',
    completed: false,
  },
}

export const Completed: Story = {
  args: {
    task: '宿題をする',
    completed: true,
  },
}

export const LongTask: Story = {
  args: {
    task: '友達と一緒に映画を見に行って、その後カフェでゆっくり話をする',
    completed: false,
  },
}

// ユーザーシナリオテスト（Play Function）
export const UserTogglesTodo: Story = {
  name: 'US-1-SC-1: ユーザーがタスクの完了状態を切り替える',
  render: () => <TodoItemWithState task="買い物に行く" initialCompleted={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: 未完了のタスクがある
    const checkbox = canvas.getByRole('checkbox')
    await expect(checkbox).not.toBeChecked()
    
    // When: チェックボックスをクリックする
    await userEvent.click(checkbox)
    
    // Then: チェックボックスがチェックされる
    await expect(checkbox).toBeChecked()
  },
}

export const UserUnchecksCompletedTodo: Story = {
  name: 'US-1-SC-2: ユーザーが完了したタスクを未完了に戻す',
  render: () => <TodoItemWithState task="洗濯物を干す" initialCompleted={true} />,
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

export const UserDeletesTodo: Story = {
  name: 'US-2-SC-1: ユーザーがタスクを削除する',
  args: {
    task: 'ゴミ出し',
    completed: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: タスクがある
    await expect(canvas.getByText('ゴミ出し')).toBeInTheDocument()
    
    // When: 削除ボタンをクリックする
    const deleteButton = canvas.getByRole('button', { name: 'ゴミ出しを削除' })
    await userEvent.click(deleteButton)
    
    // Then: 削除処理が実行される（この例ではコンソールログのみ）
    // 実際のアプリでは、このタスクがリストから消える
  },
}

// エラーケース
export const EmptyTask: Story = {
  args: {
    task: '',
    completed: false,
  },
}

// アクセシビリティテスト
export const AccessibilityTest: Story = {
  name: 'アクセシビリティ確認',
  args: {
    task: 'キーボードでアクセス可能',
    completed: false,
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