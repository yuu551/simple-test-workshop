import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { TodoItem } from './TodoItem'

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
    initialCompleted: false,
  },
}

export const Completed: Story = {
  args: {
    task: '宿題をする',
    initialCompleted: true,
  },
}

export const LongTask: Story = {
  args: {
    task: '友達と一緒に映画を見に行って、その後カフェでゆっくり話をする',
    initialCompleted: false,
  },
}

// ユーザーシナリオテスト（Play Function）
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
    
    // Then: チェックボックスがチェックされる（実際に動作する！）
    await expect(checkbox).toBeChecked()
  },
}

export const UserUnchecksCompletedTodo: Story = {
  name: 'US-1-SC-2: ユーザーが完了したタスクを未完了に戻す',
  args: {
    task: '洗濯物を干す',
    initialCompleted: true,
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

// エラーケース
export const EmptyTask: Story = {
  args: {
    task: '',
    initialCompleted: false,
  },
}

// アクセシビリティテスト
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
    const deleteButton = canvas.getByRole('button', { name: 'キーボードでアクセス可能を削除' })
    
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