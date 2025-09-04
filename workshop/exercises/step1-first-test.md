# Step 1: 最初のテストを書こう

## 目標
ユーティリティ関数のテストを通じて、Vitestでのテストの基本を学ぶ

---

## 前提: `formatDate.ts` の概要

テスト対象の関数は下記特徴です。

- **目的**: 日付をフォーマットして文字列として返す
- **シグネチャ**: `formatDate(date: Date | string | number | null | undefined, options?: { format?: 'short' | 'long' | 'full'; includeTime?: boolean }): string`
- **基本仕様**
  - `null`/`undefined` は `''`（空文字）を返す
  - 無効な日付は `'Invalid Date'` を返す
  - `format`
    - **short**: `YYYY/MM/DD`（月日ゼロ埋め）
    - **long**: `YYYY年M月D日`
    - **full**: `YYYY年M月D日（曜）`
  - `includeTime: true` の場合、末尾に `HH:MM` を追加（例: `2024/12/25 15:30`）

### 例
```typescript
formatDate(new Date('2024-12-25T15:30:00'), { format: 'long' }) // '2024年12月25日'
formatDate(new Date('2024-12-25T15:30:00'), { format: 'short', includeTime: true }) // '2024/12/25 15:30'
formatDate('') // 'Invalid Date'
```

### `formatRelativeTime` について
- **目的**: 相対時間を表示（例: `30分前`, `2時間後`, `3日前`）
- **基準**: `baseDate`（省略時は現在）との比較
- **主な仕様**
  - 1分未満: `'たった今'`
  - 60分未満: `N分前/後`
  - 24時間未満: `N時間前/後`
  - 7日未満: `N日前/後`
  - 7日以上: 通常の日付表示（`formatDate(..., { format: 'short' })`）
```typescript
formatRelativeTime('2024-03-15T11:30:00', new Date('2024-03-15T12:00:00')) // '30分前'
```

## 課題 1-1: formatDateのテストを追加

`src/utils/formatDate.test.ts` を開いて、既存のテストを確認してください。

### 新しいテストを追加
以下のテストケースを追加してみましょう。

```typescript
test('時刻なしのlongフォーマットで正しく表示される', () => {
  const date = new Date('2024-12-25T15:30:00')
  const result = formatDate(date, { format: 'long' })
  
  expect(result).toBe('2024年12月25日')
})
```

### 実行してみよう
```bash
npm run test formatDate
```

テストが通ることを確認してください。

---

## 課題 1-2: エラーケースのテスト

以下のエラーケースをテストしてみましょう。

```typescript
test('空文字列を渡すとInvalid Dateが返される', () => {
  const result = formatDate('')
  
  expect(result).toBe('Invalid Date')
})
```

### 考えてみよう
- なぜエラーケースのテストが重要なのでしょうか？
- 他にどんなエラーケースが考えられますか？

---

## 課題 1-3: パラメータ化テスト

異なる入力値で同じテストロジックを実行するパラメータ化テストを書いてみましょう。

```typescript
describe('さまざまな年の12月31日', () => {
  test.each([
    [2023, '2023年12月31日'],
    [2024, '2024年12月31日'], 
    [2025, '2025年12月31日'],
  ])('%d年の12月31日が正しく表示される', (year, expected) => {
    const date = new Date(`${year}-12-31T00:00:00`)
    const result = formatDate(date, { format: 'long' })
    
    expect(result).toBe(expected)
  })
})
```

### パラメータ化テストの利点
- 同じテストロジックを複数のデータで実行できる
- テストケースの追加が簡単
- 境界値やエッジケースを網羅的にテストできる

---

## 課題 1-4: formatRelativeTimeのテスト

相対時間表示のテストを追加してみましょう：

```typescript
test('30分前が正しく表示される', () => {
  const baseDate = new Date('2024-03-15T12:00:00')
  const date = new Date('2024-03-15T11:30:00')
  const result = formatRelativeTime(date, baseDate)
  
  expect(result).toBe('30分前')
})
```

### 追加課題
以下のケースもテストしてみましょう。
- 2時間後
- たった今（1分未満）
- 1週間以上前（通常の日付表示になる）

---

## テストの実行とカバレッジ

### 個別のテストファイル実行
```bash
npm run test formatDate
```

### カバレッジ確認
```bash
npm run test:coverage
```

カバレッジレポートで、どの部分がテストされているかを確認してみましょう。

---

## 良いテストの書き方

### 1. テスト名は具体的に
```typescript
// 悪い例
test('formatDate works', () => {})

// 良い例  
test('shortフォーマットでYYYY/MM/DD形式で表示される', () => {})
```

### 2. Given-When-Then構造
```typescript
test('初期値から2回インクリメントすると2になる', () => {
  // Given: 前提条件
  const initialValue = 0
  
  // When: 実行
  const result = initialValue + 1 + 1
  
  // Then: 期待結果
  expect(result).toBe(2)
})
```

### 3. 1つのテストで1つのことをテスト
```typescript
// 悪い例：複数のことを1つのテストで
test('formatDate works correctly', () => {
  expect(formatDate(date1, { format: 'short' })).toBe('2024/03/15')
  expect(formatDate(date2, { format: 'long' })).toBe('2024年3月15日')
  expect(formatDate(null)).toBe('')
})

// 良い例：それぞれ個別のテスト
test('shortフォーマットで正しく表示される', () => {})
test('longフォーマットで正しく表示される', () => {})
test('nullの場合は空文字が返される', () => {})
```

```typescript
// 例: 目的ごとに describe で整理する
describe('formatDate', () => {
  describe('フォーマット種別', () => {
    test('short: YYYY/MM/DD', () => {
      const date = new Date('2024-12-25T00:00:00')
      expect(formatDate(date, { format: 'short' })).toBe('2024/12/25')
    })
  })

  describe('時刻付与 includeTime', () => {
    test('short + includeTime', () => {
      const date = new Date('2024-12-25T15:30:00')
      expect(formatDate(date, { format: 'short', includeTime: true })).toBe('2024/12/25 15:30')
    })
  })

  describe('エラー・無効入力', () => {
    test('null → 空文字', () => {
      expect(formatDate(null)).toBe('')
    })
  })
})

describe('formatRelativeTime', () => {
  test('30分前', () => {
    const baseDate = new Date('2024-03-15T12:00:00')
    const date = new Date('2024-03-15T11:30:00')
    expect(formatRelativeTime(date, baseDate)).toBe('30分前')
  })
})
```

---

## まとめ

このステップで学んだこと
- Vitestでの基本的なテストの書き方
- エラーケースのテストの重要性
- パラメータ化テスト（test.each）の使い方
- テストカバレッジの確認方法
- 良いテストの書き方のコツ

### 次のステップ
Step 2では、Storybookストーリーの作成について学びます。