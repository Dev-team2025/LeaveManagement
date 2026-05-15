import { useMemo, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { StatCard, Badge, Loader } from '@/components/common'
import useAuth from '@/hooks/useAuth'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

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

function initials(name) {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function ManagerDashboard() {
  const axiosInstance = useAxios()
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    try {
      const [dashboard, teamLeaves, pending] = await Promise.all([
        managerService.getDashboard(axiosInstance),
        managerService.getTeamLeaves(axiosInstance),
        managerService.getPendingRequests(axiosInstance),
      ])
      setData({ dashboard, teamLeaves, pending })
    } catch (err) {
      console.error('Failed to load manager dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [axiosInstance])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = useMemo(() => {
    if (!data) return { teamSize: 0, pending: 0, onLeaveToday: 0, upcoming: 0 }
    
    // Extract values from dashboard cards or compute from teamLeaves
    const cards = data.dashboard.cards || []
    const pendingCount = cards.find(c => c.id === 'pending')?.value || 0
    const awayToday = cards.find(c => c.id === 'team-away')?.value || 0
    
    // For others we might need to compute or use mock-like logic for now if backend is limited
    return {
      teamSize: data.teamLeaves.reduce((acc, curr) => {
        // Unique employees in team leaves
        return acc.includes(curr.employee) ? acc : [...acc, curr.employee]
      }, []).length,
      pending: pendingCount,
      onLeaveToday: awayToday,
      upcoming: data.teamLeaves.filter(r => r.status === 'approved' && new Date(r.fromDate) > new Date()).length
    }
  }, [data])

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader /></div>

  const pendingRequests = data.pending.slice(0, 5)

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
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-400">Team Members Seen</p>
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
              pendingRequests.map((req) => (
                <div key={req.id} className="group relative flex flex-col gap-6 overflow-hidden rounded-[32px] border border-ink-50 bg-white p-6 shadow-sm transition hover:shadow-xl hover:border-brand-200 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-brand-50 text-brand-600 font-black text-sm border border-brand-100 shadow-sm">
                      {initials(req.employee)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-black text-ink-900 tracking-tight leading-tight">{req.employee}</p>
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Panel Side */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-ink-900 uppercase tracking-tight">Manager Actions</h2>
          <div className="rounded-[40px] border border-ink-100 bg-white p-8 shadow-panel relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <Link to="/manager/team-members" className="flex items-center justify-between p-4 rounded-2xl bg-ink-25 hover:bg-ink-50 transition border border-ink-50 group">
                <span className="text-sm font-black text-ink-900 uppercase tracking-widest">Team Members</span>
                <svg className="h-5 w-5 text-ink-400 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/manager/team-calendar" className="flex items-center justify-between p-4 rounded-2xl bg-ink-25 hover:bg-ink-50 transition border border-ink-50 group">
                <span className="text-sm font-black text-ink-900 uppercase tracking-widest">Team Calendar</span>
                <svg className="h-5 w-5 text-ink-400 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/manager/wfh-requests" className="flex items-center justify-between p-4 rounded-2xl bg-ink-25 hover:bg-ink-50 transition border border-ink-50 group">
                <span className="text-sm font-black text-ink-900 uppercase tracking-widest">WFH Requests</span>
                <svg className="h-5 w-5 text-ink-400 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
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
