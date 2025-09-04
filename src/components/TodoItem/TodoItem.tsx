import { useState } from 'react'
import './TodoItem.css'

interface TodoItemProps {
  task: string
  initialCompleted?: boolean
  onToggle?: (completed: boolean) => void
  onDelete?: () => void
}

export const TodoItem = ({ task, initialCompleted = false, onToggle, onDelete }: TodoItemProps) => {
  const [completed, setCompleted] = useState(initialCompleted)
  
  const handleToggle = () => {
    const newCompleted = !completed
    setCompleted(newCompleted)
    onToggle?.(newCompleted)
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
        className="todo-item__delete btn btn-danger"
        onClick={onDelete}
        aria-label={`${task}を削除`}
      >
        削除
      </button>
    </div>
  )
}