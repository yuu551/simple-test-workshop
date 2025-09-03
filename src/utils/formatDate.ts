export type DateFormat = 'short' | 'long' | 'full'

export interface FormatDateOptions {
  format?: DateFormat
  includeTime?: boolean
}

/**
 * 日付をフォーマットして文字列として返す
 * @param date - フォーマットする日付
 * @param options - フォーマットオプション
 * @returns フォーマットされた日付文字列
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options: FormatDateOptions = {}
): string {
  // nullやundefinedの場合は空文字を返す
  if (date === null || date === undefined) {
    return ''
  }

  let dateObj: Date

  try {
    dateObj = new Date(date)
  } catch {
    return 'Invalid Date'
  }

  // 無効な日付の場合
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }

  const { format = 'short', includeTime = false } = options

  // 基本の日付フォーマット
  let formattedDate: string

  switch (format) {
    case 'short':
      formattedDate = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`
      break

    case 'long':
      formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
      break

    case 'full':
      const weekdays = ['日', '月', '火', '水', '木', '金', '土']
      const weekday = weekdays[dateObj.getDay()]
      formattedDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${weekday}）`
      break

    default:
      formattedDate = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`
  }

  // 時間を含める場合
  if (includeTime) {
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    formattedDate += ` ${hours}:${minutes}`
  }

  return formattedDate
}

/**
 * 相対的な時間を表示する（例：「2日前」「1時間後」）
 * @param date - 比較する日付
 * @param baseDate - 基準となる日付（省略時は現在時刻）
 * @returns 相対時間の文字列
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
  baseDate: Date = new Date()
): string {
  if (date === null || date === undefined) {
    return ''
  }

  let dateObj: Date
  try {
    dateObj = new Date(date)
  } catch {
    return 'Invalid Date'
  }

  if (isNaN(dateObj.getTime()) || isNaN(baseDate.getTime())) {
    return 'Invalid Date'
  }

  const diffMs = dateObj.getTime() - baseDate.getTime()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  const isPast = diffMs < 0
  const absMinutes = Math.abs(diffMinutes)
  const absHours = Math.abs(diffHours)
  const absDays = Math.abs(diffDays)

  // 1分未満
  if (absMinutes < 1) {
    return 'たった今'
  }

  // 1時間未満
  if (absMinutes < 60) {
    return isPast ? `${absMinutes}分前` : `${absMinutes}分後`
  }

  // 24時間未満
  if (absHours < 24) {
    return isPast ? `${absHours}時間前` : `${absHours}時間後`
  }

  // 7日未満
  if (absDays < 7) {
    return isPast ? `${absDays}日前` : `${absDays}日後`
  }

  // それ以上は通常の日付表示
  return formatDate(date, { format: 'short' })
}