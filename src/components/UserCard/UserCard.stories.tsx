import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'
import { UserCard } from './UserCard'

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 基本的な状態
export const Default: Story = {
  args: {
    name: '田中太郎',
    email: 'tanaka@example.com',
  },
}

export const WithAge: Story = {
  args: {
    name: '佐藤花子',
    email: 'sato@example.com',
    age: 28,
  },
}

export const WithRole: Story = {
  args: {
    name: '山田次郎',
    email: 'yamada@example.com',
    role: 'フロントエンド開発者',
  },
}

export const WithAvatar: Story = {
  args: {
    name: '鈴木三郎',
    email: 'suzuki@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
}

export const OnlineUser: Story = {
  args: {
    name: '高橋四郎',
    email: 'takahashi@example.com',
    isOnline: true,
  },
}

export const CompleteProfile: Story = {
  args: {
    name: '渡辺五郎',
    email: 'watanabe@example.com',
    age: 32,
    role: 'プロダクトマネージャー',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
}

// エッジケース
export const LongName: Story = {
  args: {
    name: '非常に長い名前の人物名前が長すぎる場合のテスト',
    email: 'verylongname@example.com',
  },
}

export const LongEmail: Story = {
  args: {
    name: '伊藤六郎',
    email: 'very.long.email.address.that.might.overflow@very-long-domain-name.example.com',
  },
}

export const ShortName: Story = {
  args: {
    name: '加',
    email: 'ka@example.com',
  },
}

// ユーザーシナリオテスト（Play Function）
export const DisplayUserInformation: Story = {
  name: 'US-4-SC-1: ユーザー情報が正しく表示される',
  args: {
    name: '小林八郎',
    email: 'kobayashi@example.com',
    age: 29,
    role: 'デザイナー',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: ユーザーカードが表示されている
    // Then: すべての情報が正しく表示される
    await expect(canvas.getByRole('heading', { name: '小林八郎' })).toBeInTheDocument()
    await expect(canvas.getByText('kobayashi@example.com')).toBeInTheDocument()
    await expect(canvas.getByText('年齢:')).toBeInTheDocument()
    await expect(canvas.getByText('29歳')).toBeInTheDocument()
    await expect(canvas.getByText('デザイナー')).toBeInTheDocument()
  },
}

export const DisplayOnlineStatus: Story = {
  name: 'US-4-SC-2: オンライン状態が表示される',
  args: {
    name: '吉田九郎',
    email: 'yoshida@example.com',
    isOnline: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: オンラインユーザーのカードが表示されている
    // Then: オンラインインジケーターが表示される
    await expect(canvas.getByRole('status', { name: 'オンライン' })).toBeInTheDocument()
  },
}

export const DisplayOfflineStatus: Story = {
  name: 'US-4-SC-3: オフライン状態では指標が表示されない',
  args: {
    name: '中村十郎',
    email: 'nakamura@example.com',
    isOnline: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: オフラインユーザーのカードが表示されている
    // Then: オンラインインジケーターが表示されない
    await expect(canvas.queryByRole('status', { name: 'オンライン' })).not.toBeInTheDocument()
  },
}

export const DisplayAvatarPlaceholder: Story = {
  name: 'US-4-SC-4: アバター画像がない場合はプレースホルダーが表示される',
  args: {
    name: '森田太郎',
    email: 'morita@example.com',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: アバター画像のないユーザーカードが表示されている
    // Then: 名前の頭文字がプレースホルダーとして表示される
    await expect(canvas.getByRole('img', { name: 'アバターのプレースホルダー' })).toHaveTextContent('森')
    // And: 実際の画像は表示されない
    await expect(canvas.queryByAltText('森田太郎のアバター')).not.toBeInTheDocument()
  },
}

export const DisplayCustomAvatar: Story = {
  name: 'US-4-SC-5: カスタムアバターが表示される',
  args: {
    name: '清水花子',
    email: 'shimizu@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Given: アバター画像付きのユーザーカードが表示されている  
    // Then: カスタムアバター画像が表示される
    await expect(canvas.getByAltText('清水花子のアバター')).toBeInTheDocument()
    // And: プレースホルダーは表示されない
    await expect(canvas.queryByRole('img', { name: 'アバターのプレースホルダー' })).not.toBeInTheDocument()
  },
}

// 条件付きレンダリングのテスト
export const ConditionalRendering: Story = {
  name: '条件付き表示の確認',
  args: {
    name: '条件テスト',
    email: 'test@example.com',
    // age と role を意図的に未定義にする
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // 必須項目は表示される
    await expect(canvas.getByRole('heading')).toBeInTheDocument()
    await expect(canvas.getByText('test@example.com')).toBeInTheDocument()
    
    // オプション項目は表示されない
    await expect(canvas.queryByText(/歳$/)).not.toBeInTheDocument()
    await expect(canvas.queryByText('ユーザーの役割')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('status', { name: 'オンライン' })).not.toBeInTheDocument()
  },
}
