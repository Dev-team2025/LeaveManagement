import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/common'
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
  const { leaveRequests, employees, notifications, getPendingRequests } = useAppData()
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
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Organization Leave Pulse</h1>
          <p className="mt-0.5 text-sm text-[#64748B]">Overview of all leave activity across the organization</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Link to="/hr/notifications" className="relative inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#334155] hover:bg-[#F8F9FC]">
              <span>Notifications</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1D4ED8] text-xs font-bold text-white">{unreadCount}</span>
            </Link>
          )}
          <Link to="/hr/leave-requests" className="inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]">
            View All Requests
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Employees" value={stats.totalEmp} sub="Currently employed" icon={<UsersIcon />} accentColor="#1D4ED8" />
        <StatCard label="Pending Approvals" value={stats.pending} sub="Awaiting action" icon={<ClockIcon />} accentColor="#D97706" />
        <StatCard label="Approved This Month" value={stats.approved} sub="Total approved leaves" icon={<CheckCircleIcon />} accentColor="#16A34A" />
        <StatCard label="Rejected Requests" value={stats.rejected} sub="Total rejected" icon={<XCircleIcon />} accentColor="#DC2626" />
      </div>

      {/* Recent Requests */}
      <div className="rounded-[20px] border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <div>
            <p className="font-semibold text-[#0F172A]">Recent Leave Requests</p>
            <p className="mt-0.5 text-xs text-[#94A3B8]">Latest requests across the organization</p>
          </div>
          <Link to="/hr/leave-requests" className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">
            See all →
          </Link>
        </div>
        <div className="divide-y divide-[#F1F5F9]">
          {recentRequests.map((req) => {
            const emp = getEmployeeById(req.employeeId)
            return (
              <div key={req.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F9FC]">
                <Avatar initials={emp?.avatar || '??'} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{emp?.name || req.employeeId}</p>
                  <p className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <CalIcon />
                    {req.leaveType} · {formatDate(req.fromDate)} – {formatDate(req.toDate)} ({req.days}d)
                  </p>
                </div>
                <StatusPill status={req.status} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="font-semibold text-[#0F172A]">Employees by Department</p>
          <p className="mt-0.5 mb-5 text-xs text-[#94A3B8]">Headcount distribution</p>
          {[...new Set(employees.map((e) => e.department))].map((dept) => {
            const count = employees.filter((e) => e.department === dept).length
            const pct = Math.round((count / employees.length) * 100)
            return (
              <div key={dept} className="mb-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-[#334155]">{dept}</span>
                  <span className="text-[#64748B]">{count} employees</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
                  <div className="h-2 rounded-full bg-[#1D4ED8]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="font-semibold text-[#0F172A]">Leave Status Summary</p>
          <p className="mt-0.5 mb-5 text-xs text-[#94A3B8]">All-time breakdown</p>
          {[
            { label: 'Approved', count: stats.approved, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Pending', count: stats.pending, color: '#D97706', bg: '#FFFBEB' },
            { label: 'Rejected', count: stats.rejected, color: '#DC2626', bg: '#FEF2F2' },
          ].map((item) => (
            <div key={item.label} className="mb-3 flex items-center justify-between rounded-xl p-3.5" style={{ backgroundColor: item.bg }}>
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-[#334155]">{item.label}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
            </div>
          ))}
          <div className="mt-4 rounded-xl bg-[#F8F9FC] p-3.5 text-center">
            <p className="text-xs text-[#64748B]">Total Requests</p>
            <p className="text-2xl font-bold text-[#0F172A]">{leaveRequests.length}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
