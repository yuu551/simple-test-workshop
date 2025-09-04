import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { TodoItem } from './TodoItem'

describe('TodoItem', () => {
  test('タスクのテキストが表示される', () => {
    render(
      <TodoItem
        task="買い物に行く"
      />
    )

    expect(screen.getByText('買い物に行く')).toBeInTheDocument()
  })

  test('初期状態が未完了のタスクはチェックされていない', () => {
    render(
      <TodoItem
        task="宿題をする"
        initialCompleted={false}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('初期状態が完了のタスクはチェックされている', () => {
    render(
      <TodoItem
        task="洗濯物を干す"
        initialCompleted={true}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('チェックボックスをクリックすると状態が切り替わる', () => {
    render(
      <TodoItem
        task="掃除をする"
        initialCompleted={false}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    // クリックして完了状態にする
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    
    // もう一度クリックして未完了状態に戻す
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  test('チェックボックスをクリックするとonToggleコールバックが呼ばれる', () => {
    const mockOnToggle = vi.fn()

    render(
      <TodoItem
        task="読書をする"
        initialCompleted={false}
        onToggle={mockOnToggle}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    
    // 未完了→完了
    fireEvent.click(checkbox)
    expect(mockOnToggle).toHaveBeenCalledWith(true)
    
    // 完了→未完了
    fireEvent.click(checkbox)
    expect(mockOnToggle).toHaveBeenCalledWith(false)
  })

  test('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    const mockOnDelete = vi.fn()

    render(
      <TodoItem
        task="ゴミ出し"
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: 'ゴミ出しを削除' })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  test('削除ボタンに適切なaria-labelが設定されている', () => {
    render(
      <TodoItem
        task="料理を作る"
      />
    )

    const deleteButton = screen.getByRole('button', { name: '料理を作るを削除' })
    expect(deleteButton).toBeInTheDocument()
  })

  test('完了状態のタスクにはcompletedクラスが適用される', () => {
    render(
      <TodoItem
        task="完了したタスク"
        initialCompleted={true}
      />
    )
  
    const todoItem = document.querySelector('.todo-item')
    expect(todoItem).toHaveClass('todo-item--completed')
  })

  test('状態が切り替わるとクラスも切り替わる', () => {
    render(
      <TodoItem
        task="動的なタスク"
        initialCompleted={false}
      />
    )
  
    const todoItem = document.querySelector('.todo-item')
    const checkbox = screen.getByRole('checkbox')
    
    // 初期状態では completedクラスなし
    expect(todoItem).not.toHaveClass('todo-item--completed')
    
    // クリックして完了状態に
    fireEvent.click(checkbox)
    expect(todoItem).toHaveClass('todo-item--completed')
    
    // もう一度クリックして未完了状態に
    fireEvent.click(checkbox)
    expect(todoItem).not.toHaveClass('todo-item--completed')
  })
})