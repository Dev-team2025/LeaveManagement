import { useMemo, useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'

export default function TeamCalendar() {
  const { employees, leaveRequests } = useAppData()
  const { user } = useAuth()
  const managerId = user?.id || 'EMP003'

  const [currentDate, setCurrentDate] = useState(new Date())

  const team = useMemo(
    () => employees.filter((e) => e.managerId === managerId),
    [employees, managerId]
  )

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    // Padding for prev month
    for (let i = 0; i < firstDay; i++) days.push(null)
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    
    return days
  }, [currentDate])

  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const year = currentDate.getFullYear()

  function getLeavesForDay(date) {
    if (!date) return []
    const dStr = date.toISOString().split('T')[0]
    return leaveRequests.filter(r => 
      r.status === 'approved' && 
      r.fromDate <= dStr && 
      r.toDate >= dStr &&
      team.some(e => e.id === r.employeeId)
    )
  }

  return (
    <section className="space-y-8 pb-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-ink-900">Personnel <span className="text-brand-600">Availability</span></h1>
          <p className="mt-1 text-sm font-bold text-ink-400 font-medium">Visual calendar of team time-off and presence.</p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-1.5 border border-ink-100 shadow-sm">
          <button 
            onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-ink-50 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="px-4 text-sm font-black uppercase tracking-widest text-ink-900 min-w-[140px] text-center">
            {monthName} {year}
          </div>
          <button 
            onClick={() => setCurrentDate(new Date(year, currentDate.getMonth() + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-ink-50 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="rounded-[40px] border border-ink-100 bg-white p-8 shadow-panel overflow-hidden">
        <div className="grid grid-cols-7 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-ink-300 pb-4">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-ink-50 border border-ink-50 rounded-3xl overflow-hidden">
          {monthData.map((day, idx) => {
            const leaves = getLeavesForDay(day)
            const isToday = day?.toDateString() === new Date().toDateString()

            return (
              <div 
                key={idx} 
                className={`min-h-[140px] bg-white p-4 transition hover:bg-ink-25/50 ${!day ? 'bg-ink-25/30' : ''}`}
              >
                {day && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${isToday ? 'bg-brand-600 text-white shadow-lg shadow-brand-200' : 'text-ink-900'}`}>
                        {day.getDate()}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      {leaves.map(l => (
                        <div key={l.id} className="group relative flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-1 border border-emerald-100/50">
                           <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></div>
                           <span className="truncate text-[10px] font-bold text-emerald-700">
                             {employees.find(e => e.id === l.employeeId)?.name.split(' ')[0]}
                           </span>
                           
                           {/* Simple Tooltip on hover */}
                           <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-32 -translate-x-1/2 rounded-xl bg-ink-900 p-2 text-[10px] font-bold text-white opacity-0 shadow-xl transition group-hover:opacity-100 z-10">
                              {employees.find(e => e.id === l.employeeId)?.name}
                              <br /><span className="text-white/60">{l.leaveType}</span>
                           </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 pt-4">
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">Approved Leave</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">WFH Session</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">Holiday Event</span>
         </div>
      </div>
    </section>
  )
}
