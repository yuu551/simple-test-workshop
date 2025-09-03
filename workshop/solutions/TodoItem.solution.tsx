// このファイルは、ワークショップの解答例です
// 実際のコンポーネントと同じ内容ですが、参考用として配置しています

import './TodoItem.css'

interface TodoItemProps {
  task: string
  completed: boolean
  onToggle: (completed: boolean) => void
  onDelete: () => void
}

function TodoItem({ task, completed, onToggle, onDelete }: TodoItemProps) {
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

export default TodoItem

/* 
解答例のポイント:

1. TypeScriptの型定義
   - Props の interface を明確に定義
   - 関数の引数と戻り値の型を指定

2. アクセシビリティ
   - aria-label でタスク名を含む削除ボタンのラベル
   - label要素でチェックボックスとテキストを関連付け

3. CSS クラスの条件付き適用
   - completed の状態に応じてクラスを動的に追加

4. イベントハンドリング
   - onChange イベントで状態を適切に更新
   - コールバック関数で親コンポーネントに状態変更を通知

5. セマンティックHTML
   - button要素で削除機能
   - input[type="checkbox"]で完了状態
   - labelで関連付け
*/