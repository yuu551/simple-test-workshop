# Step 3: Storybookストーリーを作ろう

## 目標
Storybookでコンポーネントの様々な状態を可視化する方法を学ぶ


---

## 課題 3-1: Storybookの基本を理解する

### Storybookを起動
```bash
npm run storybook
```

ブラウザで http://localhost:6006 を開いて、既存のストーリーを確認してみましょう。

### ストーリーの基本構造
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import ComponentName from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'padded', // またはcentered, fullscreen
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    prop1: 'value1',
    prop2: 'value2',
  },
}
```

---

## 課題 3-2: TodoItemに新しいストーリーを追加

`src/components/TodoItem/TodoItem.stories.tsx` を開いて、以下のストーリーを追加してみましょう：

### 課題: 緊急タスクのストーリー
```typescript
export const UrgentTask: Story = {
  args: {
    task: '【緊急】重要な会議の資料準備',
    completed: false,
    onToggle: (completed: boolean) => {
      console.log('Urgent task toggled:', completed)
    },
    onDelete: () => {
      console.log('Urgent task deleted')
    },
  },
}
```

### 課題: 非常に長いタスクのストーリー
```typescript
export const VeryLongTask: Story = {
  args: {
    task: 'これは非常に長いタスクの例で、UIが長いテキストに対してどのように表示されるかを確認するためのものです。レイアウトが崩れないか、適切に改行されるかなどをチェックできます。',
    completed: false,
    onToggle: (completed: boolean) => {
      console.log('Long task toggled:', completed)
    },
    onDelete: () => {
      console.log('Long task deleted')
    },
  },
}
```

ストーリーを追加したら、Storybookで確認してみましょう。

---

## 課題 3-3: Counterに機能的なストーリーを追加

`src/components/Counter/Counter.stories.tsx` に以下のストーリーを追加：

### 課題: 制限の厳しいカウンター
```typescript
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
```

### Storybookでの確認ポイント
1. ボタンの無効化が正しく機能するか
2. 範囲表示が正しいか
3. カウンター値が見やすく表示されるか

---

## 課題 3-4: UserCardのバリエーション

`src/components/UserCard/UserCard.stories.tsx` に以下のストーリーを追加：

### 課題: 様々な職業の人々
```typescript
export const Developer: Story = {
  args: {
    name: '山田太郎',
    email: 'yamada@example.com',
    age: 28,
    role: 'フロントエンド開発者',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isOnline: true,
  },
}

export const Designer: Story = {
  args: {
    name: '佐藤花子',
    email: 'sato@example.com',
    age: 26,
    role: 'UIデザイナー',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
  },
}

export const Manager: Story = {
  args: {
    name: '田中一郎',
    email: 'tanaka@example.com',
    age: 35,
    role: 'プロダクトマネージャー',
    // avatarUrlを意図的に省略してプレースホルダーを表示
    isOnline: true,
  },
}
```

---

## 課題 3-5: ストーリーのグループ化とドキュメント

### サブグループでの整理
```typescript
const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard/Team Members', // サブグループ作成
  component: UserCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'チームメンバーの情報を表示するカードコンポーネントです。'
      }
    }
  },
}
```

### ストーリーにドキュメントを追加
```typescript
export const Developer: Story = {
  args: {
    // ... args
  },
  parameters: {
    docs: {
      description: {
        story: '開発チームのメンバー表示例。オンライン状態と役職情報を含みます。'
      }
    }
  }
}
```

---

## Storybookの便利な機能

### 1. Controls（コントロール）
Storybookの「Controls」タブで、プロップスを動的に変更できます。

```typescript
const meta: Meta<typeof TodoItem> = {
  title: 'Components/TodoItem',
  component: TodoItem,
  argTypes: {
    task: { control: 'text' },
    completed: { control: 'boolean' },
    onToggle: { action: 'toggled' },
    onDelete: { action: 'deleted' },
  },
}
```

### 2. Actions（アクション）
コンポーネントのイベントを「Actions」タブで確認できます。

### 3. Docs（ドキュメント）
自動生成されるドキュメントページを確認してみましょう。

---

## 課題 3-6: レスポンシブデザインの確認

Storybookの viewport 設定で、様々な画面サイズでの表示を確認してみましょう。

### モバイル表示の確認
1. Storybookのツールバーの viewport アイコンをクリック
2. iPhone や Android などのプリセットを選択
3. コンポーネントがモバイルでも正しく表示されるか確認

---

## ストーリー作成のベストプラクティス

### 1. 意味のある名前をつける
```typescript
// 悪い例
export const Story1: Story = {}
export const Test: Story = {}

// 良い例  
export const Default: Story = {}
export const CompletedTask: Story = {}
export const UrgentTask: Story = {}
```

### 2. 実際の使用場面を想定
```typescript
// 実際のデータを使用
export const RealWorldExample: Story = {
  args: {
    name: '田中太郎',
    email: 'tanaka@company.com',
    role: 'シニアエンジニア',
  },
}
```

### 3. エッジケースも含める
```typescript
export const EmptyState: Story = { args: { task: '' } }
export const VeryLongContent: Story = { args: { task: '非常に長いテキスト...' } }
export const SpecialCharacters: Story = { args: { task: '特殊文字を含むタスク' } }
```

---

## Visual Testing の価値

### Storybookを使う利点
1. **コンポーネントの分離**: 他の部分に影響されずに単独でテスト
2. **様々な状態の確認**: props の組み合わせを簡単に試せる
3. **デザインシステム**: 一貫したUIコンポーネントの管理
4. **コラボレーション**: デザイナーや他の開発者との共有が容易

### 実際のプロジェクトでの活用例
- コンポーネントライブラリのドキュメント
- デザインレビューでの確認
- QAでの各種状態のチェック
- 新しいメンバーへのコンポーネント紹介

---

## まとめ

このステップで学んだこと：
- Storybookストーリーの基本的な作成方法
- 様々な props の組み合わせでの表示確認
- エッジケースの可視化
- ストーリーのグループ化とドキュメント化
- レスポンシブデザインの確認方法

### 次のステップ
Step 4では、Play Functionを使った自動化されたユーザーシナリオテストについて学びます。

### 確認事項
- [ ] TodoItemの新しいストーリーが表示される
- [ ] Counterの制限付きストーリーが正しく動作する
- [ ] UserCardの職業別ストーリーが表示される
- [ ] モバイル表示での確認ができた
- [ ] Controls タブでの動的変更を試せた