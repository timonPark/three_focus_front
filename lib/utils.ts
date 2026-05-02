export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
}
