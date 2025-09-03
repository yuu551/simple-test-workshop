import { useState } from 'react'
import './Counter.css'

interface CounterProps {
  initialValue?: number
  min?: number
  max?: number
}

export const Counter = ({ initialValue = 0, min = -10, max = 10 }: CounterProps) => {
  const [count, setCount] = useState(initialValue)

  const increment = () => {
    if (count < max) {
      setCount(count + 1)
    }
  }

  const decrement = () => {
    if (count > min) {
      setCount(count - 1)
    }
  }

  const reset = () => {
    setCount(initialValue)
  }

  return (
    <div className="counter">
      <div className="counter__display">
        <span className="counter__value" data-testid="counter-value">
          {count}
        </span>
      </div>

      <div className="counter__controls">
        <button
          className="counter__button btn btn-secondary"
          onClick={decrement}
          disabled={count <= min}
          aria-label="カウントを1減らす"
        >
          -
        </button>

        <button
          className="counter__button btn btn-primary"
          onClick={reset}
          aria-label="カウントをリセット"
        >
          リセット
        </button>

        <button
          className="counter__button btn btn-secondary"
          onClick={increment}
          disabled={count >= max}
          aria-label="カウントを1増やす"
        >
          +
        </button>
      </div>

      <div className="counter__info">
        <span className="counter__range">
          範囲: {min} 〜 {max}
        </span>
      </div>
    </div>
  )
}