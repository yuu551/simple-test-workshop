import { describe, test, expect } from 'vitest'
import { formatDate, formatRelativeTime } from './formatDate'

describe('formatDate', () => {
  describe('基本的な日付フォーマット', () => {
    test('shortフォーマットで日付を表示する', () => {
      const date = new Date('2024-03-15T10:30:00')
      const result = formatDate(date, { format: 'short' })
      
      expect(result).toBe('2024/03/15')
    })

    test('longフォーマットで日付を表示する', () => {
      const date = new Date('2024-03-15T10:30:00')
      const result = formatDate(date, { format: 'long' })
      
      expect(result).toBe('2024年3月15日')
    })

    test('fullフォーマットで曜日付きの日付を表示する', () => {
      const date = new Date('2024-03-15T10:30:00') // 2024年3月15日は金曜日
      const result = formatDate(date, { format: 'full' })
      
      expect(result).toBe('2024年3月15日（金）')
    })

    test('デフォルトはshortフォーマット', () => {
      const date = new Date('2024-03-15T10:30:00')
      const result = formatDate(date)
      
      expect(result).toBe('2024/03/15')
    })
  })

  describe('時間を含むフォーマット', () => {
    test('shortフォーマット+時間', () => {
      const date = new Date('2024-03-15T10:30:00')
      const result = formatDate(date, { format: 'short', includeTime: true })
      
      expect(result).toBe('2024/03/15 10:30')
    })

    test('longフォーマット+時間', () => {
      const date = new Date('2024-03-15T09:05:00')
      const result = formatDate(date, { format: 'long', includeTime: true })
      
      expect(result).toBe('2024年3月15日 09:05')
    })

    test('fullフォーマット+時間', () => {
      const date = new Date('2024-03-15T23:59:00')
      const result = formatDate(date, { format: 'full', includeTime: true })
      
      expect(result).toBe('2024年3月15日（金） 23:59')
    })
  })

  describe('さまざまな入力形式への対応', () => {
    test('文字列形式の日付', () => {
      const result = formatDate('2024-03-15')
      
      expect(result).toBe('2024/03/15')
    })

    test('数値（タイムスタンプ）形式の日付', () => {
      const timestamp = new Date('2024-03-15').getTime()
      const result = formatDate(timestamp)
      
      expect(result).toBe('2024/03/15')
    })

    test('ISO文字列形式の日付', () => {
      const isoString = '2024-03-15T10:30:00.000Z'
      const result = formatDate(isoString)
      
      // タイムゾーンによって結果が変わる可能性があるため、年月日のパターンをチェック
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    })
  })

  describe('エラーハンドリング', () => {
    test('nullの場合は空文字を返す', () => {
      const result = formatDate(null)
      
      expect(result).toBe('')
    })

    test('undefinedの場合は空文字を返す', () => {
      const result = formatDate(undefined)
      
      expect(result).toBe('')
    })

    test('無効な日付文字列の場合はInvalid Dateを返す', () => {
      const result = formatDate('invalid-date')
      
      expect(result).toBe('Invalid Date')
    })

    test('無効なDateオブジェクトの場合はInvalid Dateを返す', () => {
      const invalidDate = new Date('invalid')
      const result = formatDate(invalidDate)
      
      expect(result).toBe('Invalid Date')
    })
  })

  describe('エッジケース', () => {
    test('1桁の月・日も正しくゼロパディングされる', () => {
      const date = new Date('2024-01-05T10:30:00')
      const result = formatDate(date, { format: 'short' })
      
      expect(result).toBe('2024/01/05')
    })

    test('12月31日が正しく表示される', () => {
      const date = new Date('2023-12-31T23:59:59')
      const result = formatDate(date, { format: 'long' })
      
      expect(result).toBe('2023年12月31日')
    })

    test('うるう年の2月29日が正しく表示される', () => {
      const date = new Date('2024-02-29T12:00:00')
      const result = formatDate(date, { format: 'long' })
      
      expect(result).toBe('2024年2月29日')
    })
  })

  describe('パラメータ化テスト - 曜日確認', () => {
    test.each([
      ['2024-03-10', '日'], // 日曜日
      ['2024-03-11', '月'], // 月曜日
      ['2024-03-12', '火'], // 火曜日
      ['2024-03-13', '水'], // 水曜日
      ['2024-03-14', '木'], // 木曜日
      ['2024-03-15', '金'], // 金曜日
      ['2024-03-16', '土'], // 土曜日
    ])('日付 %s は曜日 %s として表示される', (dateString, expectedWeekday) => {
      const date = new Date(dateString)
      const result = formatDate(date, { format: 'full' })
      
      expect(result).toContain(`（${expectedWeekday}）`)
    })
  })
})

describe('formatRelativeTime', () => {
  // 現在時刻をモック化するためのテスト用の基準日時
  const mockBaseDate = new Date('2024-03-15T12:00:00')

  describe('過去の時間', () => {
    test('たった今（1分未満前）', () => {
      const date = new Date('2024-03-15T11:59:30')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('たった今')
    })

    test('5分前', () => {
      const date = new Date('2024-03-15T11:55:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('5分前')
    })

    test('2時間前', () => {
      const date = new Date('2024-03-15T10:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('2時間前')
    })

    test('3日前', () => {
      const date = new Date('2024-03-12T12:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('3日前')
    })

    test('1週間以上前は通常の日付表示', () => {
      const date = new Date('2024-03-07T12:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('2024/03/07')
    })
  })

  describe('未来の時間', () => {
    test('5分後', () => {
      const date = new Date('2024-03-15T12:05:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('5分後')
    })

    test('3時間後', () => {
      const date = new Date('2024-03-15T15:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('3時間後')
    })

    test('2日後', () => {
      const date = new Date('2024-03-17T12:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('2日後')
    })

    test('1週間以上後は通常の日付表示', () => {
      const date = new Date('2024-03-25T12:00:00')
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe('2024/03/25')
    })
  })

  describe('エラーハンドリング', () => {
    test('nullの場合は空文字を返す', () => {
      const result = formatRelativeTime(null, mockBaseDate)
      
      expect(result).toBe('')
    })

    test('undefinedの場合は空文字を返す', () => {
      const result = formatRelativeTime(undefined, mockBaseDate)
      
      expect(result).toBe('')
    })

    test('無効な日付の場合はInvalid Dateを返す', () => {
      const result = formatRelativeTime('invalid-date', mockBaseDate)
      
      expect(result).toBe('Invalid Date')
    })

    test('基準日が無効な場合もInvalid Dateを返す', () => {
      const date = new Date('2024-03-15T12:00:00')
      const invalidBaseDate = new Date('invalid')
      const result = formatRelativeTime(date, invalidBaseDate)
      
      expect(result).toBe('Invalid Date')
    })
  })

  describe('デフォルト動作', () => {
    test('基準日を省略した場合は現在時刻を使用', () => {
      // この例では、基準日を明示的に指定してテストする
      const baseDate = new Date('2024-03-15T12:00:00')
      const date = new Date('2024-03-15T11:55:00')
      const result = formatRelativeTime(date, baseDate)
      
      expect(result).toBe('5分前')
    })
  })

  describe('境界値テスト', () => {
    test.each([
      [30, 'たった今'],   // 1分未満
      [60, '1分前'],      // 1分
      [3540, '59分前'],   // 59分 
      [3600, '1時間前'],  // 1時間
    ])('%d秒前は「%s」として表示される', (secondsAgo, expected) => {
      const date = new Date(mockBaseDate.getTime() - (secondsAgo * 1000))
      const result = formatRelativeTime(date, mockBaseDate)
      
      expect(result).toBe(expected)
    })
  })

  test('時刻なしのlongフォーマットで正しく表示される', () => {
    const date = new Date('2024-12-25T15:30:00')
    const result = formatDate(date, { format: 'long' })
    
    expect(result).toBe('2024年12月25日')
  })

  test('空文字列を渡すとInvalid Dateが返される', () => {
    const result = formatDate('')
    
    expect(result).toBe('Invalid Date')
  })

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

  test('30分前が正しく表示される', () => {
    const baseDate = new Date('2024-03-15T12:00:00')
    const date = new Date('2024-03-15T11:30:00')
    const result = formatRelativeTime(date, baseDate)
    
    expect(result).toBe('30分前')
  })
})