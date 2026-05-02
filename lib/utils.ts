export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}분`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const endH = Math.floor(total / 60) % 24
  const endM = total % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

export function formatTimeRange(start: string, end: string): string {
  const fmt = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    const period = h < 12 ? '오전' : '오후'
    const h12 = h % 12 || 12
    return `${period} ${h12}:${String(m).padStart(2, '0')}`
  }
  return `${fmt(start)} - ${fmt(end)}`
}
