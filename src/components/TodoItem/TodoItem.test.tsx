import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
  test('タスクのテキストが表示される', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="買い物に行く"
        completed={false}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('買い物に行く')).toBeInTheDocument()
  })

  test('未完了のタスクはチェックされていない', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="宿題をする"
        completed={false}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('完了したタスクはチェックされている', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="洗濯物を干す"
        completed={true}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="掃除をする"
        completed={false}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledWith(true)
  })

  test('完了状態のタスクのチェックボックスをクリックするとfalseが渡される', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="読書をする"
        completed={true}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledWith(false)
  })

  test('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="ゴミ出し"
        completed={false}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: 'ゴミ出しを削除' })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  test('削除ボタンに適切なaria-labelが設定されている', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="料理を作る"
        completed={false}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: '料理を作るを削除' })
    expect(deleteButton).toBeInTheDocument()
  })
})