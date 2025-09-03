import './TodoItem.css'

interface TodoItemProps {
  task: string
  completed: boolean
  onToggle: (completed: boolean) => void
  onDelete: () => void
}

export const TodoItem = ({ task, completed, onToggle, onDelete }: TodoItemProps) => {
  const handleToggle = () => {
    onToggle(!completed)
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