import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'
import { getEmployeeById } from '@/data/mockData'

// ── Icons ─────────────────────────────────────────────────────────────────────
function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function XCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}
function CalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

const STATUS_COLORS = {
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  rejected: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
}

function StatusPill({ status }) {
  const s = STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  )
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Avatar({ initials, size = 'sm' }) {
  const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
  return (
    <div className={`${sz} flex shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] font-semibold text-[#1D4ED8]`}>
      {initials}
    </div>
  )
}

export default function HRDashboard() {
  const { leaveRequests, employees, notifications } = useAppData()
  const { user } = useAuth()

  const stats = useMemo(() => {
    const pending = leaveRequests.filter((r) => r.status === 'pending').length
    const approved = leaveRequests.filter((r) => r.status === 'approved').length
    const rejected = leaveRequests.filter((r) => r.status === 'rejected').length
    const totalEmp = employees.filter((e) => e.status === 'active').length
    return { pending, approved, rejected, totalEmp }
  }, [leaveRequests, employees])

  const recentRequests = useMemo(
    () => [...leaveRequests].sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).slice(0, 6),
    [leaveRequests],
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.recipientId === (user?.id || 'EMP004') && !n.isRead).length,
    [notifications, user],
  )

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">Organisation Leave Pulse</h1>
          <p className="mt-1 text-sm text-ink-500">Real-time overview of leave activity and workforce distribution</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Link to="/hr/notifications" className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-ink-100 bg-white transition hover:bg-ink-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-600">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-4 ring-white">{unreadCount}</span>
            </Link>
          )}
          <Link to="/hr/leave-requests" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700">
            View All Requests
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <UsersIcon />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+2 this month</span>
          </div>
          <div className="mt-5">
            <p className="text-sm font-medium text-ink-500">Active Employees</p>
            <h3 className="mt-1 text-3xl font-bold text-ink-900">{stats.totalEmp}</h3>
          </div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <ClockIcon />
            </div>
            {stats.pending > 0 && (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Action Required</span>
            )}
          </div>
          <div className="mt-5">
            <p className="text-sm font-medium text-ink-500">Pending Approvals</p>
            <h3 className="mt-1 text-3xl font-bold text-ink-900">{stats.pending}</h3>
          </div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircleIcon />
          </div>
          <div className="mt-5">
            <p className="text-sm font-medium text-ink-500">Approved (Month)</p>
            <h3 className="mt-1 text-3xl font-bold text-ink-900">{stats.approved}</h3>
          </div>
        </div>

        <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <XCircleIcon />
          </div>
          <div className="mt-5">
            <p className="text-sm font-medium text-ink-500">Rejected (Total)</p>
            <h3 className="mt-1 text-3xl font-bold text-ink-900">{stats.rejected}</h3>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Requests */}
        <div className="lg:col-span-2 rounded-[32px] border border-ink-100 bg-white shadow-panel">
          <div className="flex items-center justify-between border-b border-ink-50 px-8 py-6">
            <div>
              <h3 className="text-lg font-bold text-ink-900">Recent Leave Requests</h3>
              <p className="text-sm text-ink-500">Latest applications across all departments</p>
            </div>
            <Link to="/hr/leave-requests" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink-50 px-2">
            {recentRequests.map((req) => {
              const emp = getEmployeeById(req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-ink-25 first:mt-2 last:mb-2 rounded-2xl">
                  <Avatar initials={emp?.avatar || '??'} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{emp?.name || req.employeeId}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><CalIcon /> {req.leaveType}</span>
                      <span>•</span>
                      <span>{formatDate(req.fromDate)} – {formatDate(req.toDate)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusPill status={req.status} />
                    <span className="text-[10px] font-medium text-ink-400">{req.days} days</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Breakdown Column */}
        <div className="space-y-6">
          <div className="rounded-[32px] border border-ink-100 bg-white p-8 shadow-panel">
            <h3 className="text-lg font-bold text-ink-900">By Department</h3>
            <p className="mt-1 mb-8 text-sm text-ink-500">Employee distribution</p>
            <div className="space-y-6">
              {[...new Set(employees.map((e) => e.department))].map((dept) => {
                const count = employees.filter((e) => e.department === dept).length
                const pct = Math.round((count / employees.length) * 100)
                return (
                  <div key={dept}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="font-bold text-ink-700">{dept}</span>
                      <span className="font-medium text-ink-400">{count} members</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-ink-100">
                      <div className="h-2 rounded-full bg-brand-600 shadow-sm shadow-brand-100" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-ink-100 bg-white p-8 shadow-panel">
            <h3 className="text-lg font-bold text-ink-900">Request Summary</h3>
            <p className="mt-1 mb-6 text-sm text-ink-500">All-time status</p>
            <div className="space-y-3">
              {[
                { label: 'Approved', count: stats.approved, color: '#10B981', bg: '#F0FDF4' },
                { label: 'Pending', count: stats.pending, color: '#F59E0B', bg: '#FFFBEB' },
                { label: 'Rejected', count: stats.rejected, color: '#EF4444', bg: '#FEF2F2' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl px-4 py-3.5" style={{ backgroundColor: item.bg }}>
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-ink-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-black" style={{ color: item.color }}>{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-ink-25 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Total Processed</p>
              <p className="mt-1 text-3xl font-black text-ink-900">{leaveRequests.length}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
