import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { Counter } from './Counter'

describe('Counter', () => {
  test('初期値が表示される', () => {
    render(<Counter />)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0')
  })

  test('カスタム初期値が設定される', () => {
    render(<Counter initialValue={5} />)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('5')
  })

  test('プラスボタンでカウントが増える', () => {
    render(<Counter />)
    
    const incrementButton = screen.getByLabelText('カウントを1増やす')
    fireEvent.click(incrementButton)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('1')
  })

  test('マイナスボタンでカウントが減る', () => {
    render(<Counter initialValue={1} />)
    
    const decrementButton = screen.getByLabelText('カウントを1減らす')
    fireEvent.click(decrementButton)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0')
  })

  test('リセットボタンで初期値に戻る', () => {
    render(<Counter initialValue={3} />)
    
    const incrementButton = screen.getByLabelText('カウントを1増やす')
    const resetButton = screen.getByLabelText('カウントをリセット')
    
    // カウントを変更
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    expect(screen.getByTestId('counter-value')).toHaveTextContent('5')
    
    // リセット
    fireEvent.click(resetButton)
    expect(screen.getByTestId('counter-value')).toHaveTextContent('3')
  })

  test('最大値に達するとプラスボタンが無効化される', () => {
    render(<Counter initialValue={9} max={10} />)
    
    const incrementButton = screen.getByLabelText('カウントを1増やす')
    
    // 最大値の1つ前では有効
    expect(incrementButton).not.toBeDisabled()
    
    // 最大値に到達
    fireEvent.click(incrementButton)
    expect(incrementButton).toBeDisabled()
    expect(screen.getByTestId('counter-value')).toHaveTextContent('10')
  })

  test('最小値に達するとマイナスボタンが無効化される', () => {
    render(<Counter initialValue={1} min={0} />)
    
    const decrementButton = screen.getByLabelText('カウントを1減らす')
    
    // 最小値の1つ上では有効
    expect(decrementButton).not.toBeDisabled()
    
    // 最小値に到達
    fireEvent.click(decrementButton)
    expect(decrementButton).toBeDisabled()
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0')
  })

  test('範囲情報が表示される', () => {
    render(<Counter min={-5} max={15} />)
    
    expect(screen.getByText('範囲: -5 〜 15')).toBeInTheDocument()
  })

  test('複数回のインクリメントが正しく動作する', () => {
    render(<Counter />)
    
    const incrementButton = screen.getByLabelText('カウントを1増やす')
    
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    fireEvent.click(incrementButton)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('3')
  })

  test('複数回のデクリメントが正しく動作する', () => {
    render(<Counter initialValue={5} />)
    
    const decrementButton = screen.getByLabelText('カウントを1減らす')
    
    fireEvent.click(decrementButton)
    fireEvent.click(decrementButton)
    
    expect(screen.getByTestId('counter-value')).toHaveTextContent('3')
  })

  test('最大値に達するとインクリメントボタンが無効化される', () => {
    render(<Counter initialValue={2} max={3} />)
    
    const incrementButton = screen.getByLabelText('カウントを1増やす')
    const counterValue = screen.getByTestId('counter-value')
    
    // 最初は有効
    expect(incrementButton).not.toBeDisabled()
    
    // 1回クリック → 最大値に到達
    fireEvent.click(incrementButton)
    
    // 値が最大値になることを確認
    expect(counterValue).toHaveTextContent('3')
    
    // ボタンが無効化されることを確認
    expect(incrementButton).toBeDisabled()
  })
})