export function toDateOnlyISO(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

export function diffDaysInclusive(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startUtc = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate())
  const endUtc = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
  return Math.floor((endUtc - startUtc) / 86400000) + 1
}

export function countBusinessDays(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  let count = 0
  const curDate = new Date(startDate.getTime())
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getUTCDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
    curDate.setUTCDate(curDate.getUTCDate() + 1)
  }
  return count
}

export function isDateInAnyRange(date, ranges) {
  const d = new Date(date)
  const time = d.getTime()
  return ranges.some((range) => {
    const start = new Date(range.start).getTime()
    const end = new Date(range.end).getTime()
    return time >= start && time <= end
  })
}

