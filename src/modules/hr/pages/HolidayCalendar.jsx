import { useMemo, useState } from 'react'
import { useAppData } from '@/context/AppDataContext'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const HOLIDAY_COLORS = {
  national: { bg: 'bg-blue-50', text: 'text-blue-700', pill: 'bg-blue-100 text-blue-700' },
  festival: { bg: 'bg-purple-50', text: 'text-purple-700', pill: 'bg-purple-100 text-purple-700' },
}

export default function HolidayCalendar() {
  const { holidays } = useAppData()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Build a set of holiday dates for this month
  const holidayMap = useMemo(() => {
    const map = {}
    holidays.forEach((h) => {
      const d = new Date(h.date)
      if (d.getFullYear() === year && d.getMonth() === month) {
        map[d.getDate()] = h
      }
    })
    return map
  }, [holidays, year, month])

  const monthHolidays = useMemo(
    () => holidays.filter((h) => {
      const d = new Date(h.date)
      return d.getFullYear() === year && d.getMonth() === month
    }),
    [holidays, year, month],
  )

  const allYearHolidays = useMemo(
    () => holidays.filter((h) => new Date(h.date).getFullYear() === year).sort((a, b) => new Date(a.date) - new Date(b.date)),
    [holidays, year],
  )

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayDay = today.getMonth() === month && today.getFullYear() === year ? today.getDate() : null

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Holiday Calendar</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Public holidays and festival days for {year}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Calendar */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0F172A]">{MONTHS[month]} {year}</h2>
              {monthHolidays.length > 0 && (
                <p className="mt-0.5 text-xs text-[#64748B]">{monthHolidays.length} holiday{monthHolidays.length > 1 ? 's' : ''} this month</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8F9FC] transition">
                ‹
              </button>
              <button onClick={nextMonth} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8F9FC] transition">
                ›
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 text-center">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="py-1.5 text-xs font-semibold text-[#94A3B8]">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const holiday = day ? holidayMap[day] : null
              const isToday = day === todayDay
              const isWeekend = day ? new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6 : false
              return (
                <div
                  key={i}
                  className={`group relative flex flex-col items-center justify-start rounded-xl p-1.5 min-h-[52px] transition ${
                    holiday
                      ? holiday.type === 'national'
                        ? 'bg-blue-50'
                        : 'bg-purple-50'
                      : isWeekend && day
                      ? 'bg-[#FAFAFA]'
                      : ''
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                          isToday
                            ? 'bg-[#1D4ED8] text-white font-semibold'
                            : holiday
                            ? holiday.type === 'national'
                              ? 'text-blue-700 font-semibold'
                              : 'text-purple-700 font-semibold'
                            : isWeekend
                            ? 'text-[#94A3B8]'
                            : 'text-[#334155]'
                        }`}
                      >
                        {day}
                      </span>
                      {holiday && (
                        <span className="mt-0.5 w-full truncate text-center text-[9px] font-medium leading-tight text-[#64748B]">
                          {holiday.name}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-4 border-t border-[#F1F5F9] pt-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#1D4ED8]" /> Today</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" /> National Holiday</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Festival</span>
          </div>
        </div>

        {/* Sidebar: All holidays this year */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
          <p className="mb-4 font-semibold text-[#0F172A]">All Holidays {year}</p>
          <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
            {allYearHolidays.map((h) => {
              const d = new Date(h.date)
              const colors = HOLIDAY_COLORS[h.type] || HOLIDAY_COLORS.national
              return (
                <div key={h.id} className={`flex items-start gap-3 rounded-xl p-3 ${colors.bg}`}>
                  <div className="shrink-0 rounded-lg bg-white px-2 py-1 text-center shadow-sm">
                    <p className="text-[10px] font-semibold uppercase text-[#94A3B8]">
                      {MONTHS[d.getMonth()].slice(0, 3)}
                    </p>
                    <p className="text-base font-bold text-[#0F172A]">{d.getDate()}</p>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${colors.text}`}>{h.name}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${colors.pill}`}>
                      {h.type}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
