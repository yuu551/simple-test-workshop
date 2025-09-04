import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { Counter } from './Counter'

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 基本的な状態
export const Default: Story = {
  args: {},
}

export const WithInitialValue: Story = {
  args: {
    initialValue: 5,
  },
}

export const WithCustomRange: Story = {
  args: {
    initialValue: 0,
    min: -20,
    max: 20,
  },
}

export const AtMinimum: Story = {
  args: {
    initialValue: -10,
    min: -10,
    max: 10,
  },
}

export const AtMaximum: Story = {
  args: {
    initialValue: 10,
    min: -10,
    max: 10,
  },
}

// ユーザーシナリオテスト（Play Function）
export const UserIncrementsCounter: Story = {
  name: 'US-3-SC-1: ユーザーがカウンターを増やす',
  args: {
    initialValue: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: カウンターが0の状態
    const counterValue = canvas.getByTestId('counter-value')
    await expect(counterValue).toHaveTextContent('0')
    
    // When: プラスボタンをクリックする
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    await userEvent.click(incrementButton)
    
    // Then: カウンターが1になる
    await expect(counterValue).toHaveTextContent('1')
  },
}

export const UserDecrementsCounter: Story = {
  name: 'US-3-SC-2: ユーザーがカウンターを減らす',
  args: {
    initialValue: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: カウンターが5の状態
    const counterValue = canvas.getByTestId('counter-value')
    await expect(counterValue).toHaveTextContent('5')
    
    // When: マイナスボタンをクリックする
    const decrementButton = canvas.getByLabelText('カウントを1減らす')
    await userEvent.click(decrementButton)
    
    // Then: カウンターが4になる
    await expect(counterValue).toHaveTextContent('4')
  },
}

export const UserResetsCounter: Story = {
  name: 'US-3-SC-3: ユーザーがカウンターをリセットする',
  args: {
    initialValue: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    const resetButton = canvas.getByLabelText('カウントをリセット')
    
    // Given: カウンターを変更している
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await expect(counterValue).toHaveTextContent('5')
    
    // When: リセットボタンをクリックする
    await userEvent.click(resetButton)
    
    // Then: カウンターが初期値に戻る
    await expect(counterValue).toHaveTextContent('3')
  },
}

export const UserHitsMaximumLimit: Story = {
  name: 'US-3-SC-4: ユーザーが最大値に到達する',
  args: {
    initialValue: 9,
    max: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    
    // Given: カウンターが最大値の1つ前
    await expect(counterValue).toHaveTextContent('9')
    await expect(incrementButton).not.toBeDisabled()
    
    // When: プラスボタンをクリックして最大値に到達
    await userEvent.click(incrementButton)
    
    // Then: カウンターが最大値になり、プラスボタンが無効化される
    await expect(counterValue).toHaveTextContent('10')
    await expect(incrementButton).toBeDisabled()
  },
}

export const UserHitsMinimumLimit: Story = {
  name: 'US-3-SC-5: ユーザーが最小値に到達する',
  args: {
    initialValue: 1,
    min: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const decrementButton = canvas.getByLabelText('カウントを1減らす')
    
    // Given: カウンターが最小値の1つ上
    await expect(counterValue).toHaveTextContent('1')
    await expect(decrementButton).not.toBeDisabled()
    
    // When: マイナスボタンをクリックして最小値に到達
    await userEvent.click(decrementButton)
    
    // Then: カウンターが最小値になり、マイナスボタンが無効化される
    await expect(counterValue).toHaveTextContent('0')
    await expect(decrementButton).toBeDisabled()
  },
}

// エラーケース・エッジケース
export const RapidClicking: Story = {
  name: '連続クリック操作テスト',
  args: {
    initialValue: 0,
    min: -3,
    max: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const counterValue = canvas.getByTestId('counter-value')
    const incrementButton = canvas.getByLabelText('カウントを1増やす')
    const decrementButton = canvas.getByLabelText('カウントを1減らす')
    
    // 連続でインクリメント
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await userEvent.click(incrementButton)
    await expect(counterValue).toHaveTextContent('3')
    
    // 連続でデクリメント
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await userEvent.click(decrementButton)
    await expect(counterValue).toHaveTextContent('-3')
  },
}

export const StrictLimits: Story = {
  args: {
    initialValue: 0,
    min: -2,
    max: 2,
  },
}

export const AlreadyAtMaximum: Story = {
  args: {
    initialValue: 10,
    min: -10,
    max: 10,
  },
}