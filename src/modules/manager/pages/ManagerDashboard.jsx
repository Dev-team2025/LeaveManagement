import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatCard, Badge } from '@/components/common'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'
import { getEmployeeById } from '@/data/mockData'

// ── Icons ─────────────────────────────────────────────────────────────────────
const ICONS = {
  Team: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Pending: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Presence: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

export default function ManagerDashboard() {
  const { leaveRequests, employees, notifications } = useAppData()
  const { user } = useAuth()
  const managerId = user?.id || 'EMP003'

  const teamEmployees = useMemo(
    () => employees.filter((e) => e.managerId === managerId),
    [employees, managerId],
  )

  const teamRequests = useMemo(
    () => leaveRequests.filter((r) => teamEmployees.some((e) => e.id === r.employeeId)),
    [leaveRequests, teamEmployees],
  )

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return {
      teamSize: teamEmployees.length,
      pending: teamRequests.filter((r) => r.status === 'pending').length,
      onLeaveToday: teamRequests.filter((r) => 
        r.status === 'approved' && 
        r.fromDate <= today && 
        r.toDate >= today
      ).length,
      upcoming: teamRequests.filter((r) => r.status === 'approved' && r.fromDate > today).length,
    }
  }, [teamEmployees, teamRequests])

  const pendingRequests = useMemo(
    () => teamRequests.filter(r => r.status === 'pending').sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).slice(0, 5),
    [teamRequests]
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.recipientId === (user?.id || 'EMP003') && !n.isRead).length,
    [notifications, user],
  )

  return (
    <section className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-ink-900 tracking-tight">Team <span className="text-brand-600 uppercase">Operational</span> Pulse</h1>
          <p className="mt-1 text-sm font-bold text-ink-400 font-medium leading-relaxed max-w-xl">
            Real-time insights and decision tools for managing your team's presence.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Link to="/manager/notifications" className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-100 bg-white transition hover:bg-ink-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-600">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-4 ring-white">{unreadCount}</span>
            </Link>
          )}
          <Link to="/manager/team-leaves" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-600 px-5 text-sm font-bold text-white shadow-lg shadow-brand-100 transition hover:bg-brand-700 hover:scale-[1.02]">
            Authorise Leaves
          </Link>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110">
              <ICONS.Team />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">Active</span>
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-400">Direct Reports</p>
            <h3 className="mt-1 text-3xl font-black text-ink-900">{stats.teamSize}</h3>
          </div>
          <div className="absolute -right-2 -bottom-2 h-16 w-16 bg-indigo-50/50 rounded-full blur-2xl"></div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:scale-110">
              <ICONS.Pending />
            </div>
            {stats.pending > 0 && <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-ping"></span>}
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-400">Pending Review</p>
            <h3 className="mt-1 text-3xl font-black text-ink-900">{stats.pending}</h3>
          </div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 transition group-hover:scale-110">
              <ICONS.Presence />
            </div>
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-400">Away Today</p>
            <h3 className="mt-1 text-3xl font-black text-ink-900">{stats.onLeaveToday}</h3>
          </div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-400">Upcoming Absences</p>
            <h3 className="mt-1 text-3xl font-black text-ink-900">{stats.upcoming}</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pending Actions Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-ink-900 uppercase tracking-tight">Authorisation Queue</h2>
            <Link to="/manager/team-leaves" className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest">Manage All</Link>
          </div>

          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-ink-100 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-lg font-black text-ink-900 uppercase tracking-tight">Queue is Clear</h3>
                <p className="mt-1 text-xs font-bold text-ink-400">No pending time-off requests at the moment.</p>
              </div>
            ) : (
              pendingRequests.map((req) => {
                const emp = getEmployeeById(req.employeeId)
                return (
                  <div key={req.id} className="group relative flex flex-col gap-6 overflow-hidden rounded-[32px] border border-ink-50 bg-white p-6 shadow-sm transition hover:shadow-xl hover:border-brand-200 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-brand-50 text-brand-600 font-black text-sm border border-brand-100 shadow-sm">
                        {emp?.avatar || initials(emp?.name) || '??'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-black text-ink-900 tracking-tight leading-tight">{emp?.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{req.leaveType}</span>
                           <span className="text-[10px] text-ink-200">•</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-ink-400">{req.days} Days Requested</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 lg:max-w-[140px]">
                       <p className="text-[10px] font-black uppercase tracking-widest text-ink-300 mb-1">Period</p>
                       <p className="text-sm font-bold text-ink-700">{formatDate(req.fromDate)} — {formatDate(req.toDate)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        to="/manager/team-leaves"
                        className="rounded-2xl border border-ink-100 bg-white px-5 py-3 text-[10px] font-black text-ink-900 transition hover:bg-ink-50 uppercase tracking-widest"
                      >
                        Details
                      </Link>
                      <button 
                        onClick={() => approveLeave(req.id, 'Manager dashboard quick approve')}
                        className="rounded-2xl bg-brand-600 px-6 py-3 text-[10px] font-black text-white shadow-lg shadow-brand-100 transition hover:bg-brand-700 hover:scale-[1.03]"
                      >
                        APPROVE
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Team Presence Side Panel */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-ink-900 uppercase tracking-tight">Team Health</h2>
          <div className="rounded-[40px] border border-ink-100 bg-white p-8 shadow-panel relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              {teamEmployees.map((emp) => {
                const today = new Date().toISOString().split('T')[0]
                const activeLeave = leaveRequests.find(
                  (r) => r.employeeId === emp.id && r.status === 'approved' &&
                    r.fromDate <= today && r.toDate >= today,
                )
                
                return (
                  <div key={emp.id} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-50 text-xs font-black text-ink-900 border border-ink-100 shadow-sm transition hover:scale-105">
                        {emp.avatar || initials(emp.name)}
                      </div>
                      <span className={`absolute -right-1.5 -bottom-1.5 h-4 w-4 rounded-full border-4 border-white ${activeLeave ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="truncate text-sm font-bold text-ink-900 leading-tight">{emp.name}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-ink-400 mt-1">{emp.designation}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-10 pt-8 border-t border-ink-50 relative z-10">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-ink-300">
                  <span>Capacity Level</span>
                  <span className="text-brand-600">{Math.round((teamEmployees.length - stats.onLeaveToday) / teamEmployees.length * 100)}% ACTIVE</span>
               </div>
               <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-50">
                  <div 
                    className="h-full bg-brand-600 rounded-full transition-all duration-1000 shadow-sm shadow-brand-100" 
                    style={{ width: `${(teamEmployees.length - stats.onLeaveToday) / teamEmployees.length * 100}%` }}
                  />
               </div>
            </div>
            
            <div className="absolute right-0 top-0 h-32 w-32 bg-brand-50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50"></div>
          </div>
          
          <div className="rounded-[40px] bg-brand-600 p-8 shadow-xl shadow-brand-100 text-white relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-tight">Need a full view?</h3>
                <p className="mt-1 text-sm font-medium text-brand-100 leading-relaxed">Access the interactive team calendar for visual planning.</p>
                <Link to="/manager/team-calendar" className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-6 text-xs font-black text-brand-600 uppercase tracking-widest transition group-hover:scale-105 active:scale-95">
                  Launch Calendar
                </Link>
             </div>
             <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-white/10 rounded-3xl rotate-12 transition group-hover:rotate-45"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function initials(name) {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
