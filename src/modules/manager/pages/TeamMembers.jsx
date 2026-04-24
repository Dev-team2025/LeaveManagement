import { useMemo } from 'react'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'

function initials(name) {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function TeamMembers() {
  const { employees, leaveRequests } = useAppData()
  const { user } = useAuth()
  const managerId = user?.id || 'EMP003'

  const team = useMemo(
    () => employees.filter((e) => e.managerId === managerId),
    [employees, managerId]
  )

  const today = new Date().toISOString().split('T')[0]

  return (
    <section className="space-y-8 pb-20">
      <div>
        <h1 className="font-display text-3xl font-black text-ink-900">Team <span className="text-brand-600">Personnel</span></h1>
        <p className="mt-1 text-sm font-bold text-ink-400 font-medium">Direct reports and their current availability status.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {team.map((emp) => {
          const activeLeave = leaveRequests.find(
            (r) => r.employeeId === emp.id && r.status === 'approved' &&
              r.fromDate <= today && r.toDate >= today,
          )

          return (
            <div key={emp.id} className="group relative overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-panel transition hover:shadow-xl hover:border-brand-200">
              <div className="flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600 font-black text-lg ring-4 ring-white shadow-sm">
                  {emp.avatar || initials(emp.name)}
                </div>
                <div className="text-right">
                  {activeLeave ? (
                    <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-600 uppercase tracking-widest italic border border-amber-100">Away</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">Online</span>
                  )}
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-ink-300">Member Since {new Date(emp.joinDate).getFullYear()}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-black text-ink-900 truncate">{emp.name}</h3>
                <p className="text-xs font-black uppercase tracking-widest text-brand-600 mt-1">{emp.designation}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-ink-50 grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Department</p>
                   <p className="mt-1 text-sm font-bold text-ink-700">{emp.department}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Role</p>
                   <p className="mt-1 text-sm font-bold text-ink-700 capitalize">{emp.role}</p>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full rounded-2xl bg-ink-50 py-3 text-xs font-black text-ink-600 uppercase tracking-widest transition hover:bg-brand-600 hover:text-white">
                  View Full Profile
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
