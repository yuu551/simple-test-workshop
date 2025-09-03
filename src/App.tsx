import { TodoItem } from './components/TodoItem/TodoItem'
import { Counter } from './components/Counter/Counter'
import { UserCard } from './components/UserCard/UserCard'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Test Workshop</h1>
        <p>シンプルなテストの練習用アプリです</p>
      </header>

      <main className="app-main">
        <section>
          <h2>TodoItem コンポーネント</h2>
          <TodoItem 
            task="買い物に行く"
            completed={false}
            onToggle={(completed) => console.log('Todo toggled:', completed)}
            onDelete={() => console.log('Todo deleted')}
          />
          <TodoItem 
            task="宿題をする"
            completed={true}
            onToggle={(completed) => console.log('Todo toggled:', completed)}
            onDelete={() => console.log('Todo deleted')}
          />
        </section>

        <section>
          <h2>Counter コンポーネント</h2>
          <Counter />
        </section>

        <section>
          <h2>UserCard コンポーネント</h2>
          <UserCard 
            name="田中太郎"
            email="tanaka@example.com"
            age={25}
          />
        </section>
      </main>
    </div>
  )
}

export default App