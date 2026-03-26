import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/common'
import { useAppData } from '@/context/AppDataContext'

function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function PolicyIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
}
function CalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}
function AlertIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
}

const ROLE_COLORS = { employee: 'bg-blue-50 text-blue-700', manager: 'bg-purple-50 text-purple-700', hr: 'bg-emerald-50 text-emerald-700', admin: 'bg-red-50 text-red-700' }

export default function AdminDashboard() {
  const { employees, leaveRequests, leavePolicies, holidays } = useAppData()

  const stats = useMemo(() => ({
    totalUsers: employees.length,
    activeUsers: employees.filter((e) => e.status === 'active').length,
    totalPolicies: leavePolicies.length,
    totalHolidays: holidays.length,
    pendingRequests: leaveRequests.filter((r) => r.status === 'pending').length,
  }), [employees, leaveRequests, leavePolicies, holidays])

  const roleBreakdown = useMemo(() => {
    const map = {}
    employees.forEach((e) => { map[e.role] = (map[e.role] || 0) + 1 })
    return Object.entries(map).map(([role, count]) => ({ role, count }))
  }, [employees])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">Admin Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">System Overview</h1>
          <p className="mt-0.5 text-sm text-[#64748B]">Platform-wide stats and quick access to admin tools</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} sub={`${stats.activeUsers} active`} icon={<UsersIcon />} accentColor="#1D4ED8" />
        <StatCard label="Leave Policies" value={stats.totalPolicies} sub="Configured types" icon={<PolicyIcon />} accentColor="#7C3AED" />
        <StatCard label="Public Holidays" value={stats.totalHolidays} sub="This fiscal year" icon={<CalIcon />} accentColor="#059669" />
        <StatCard label="Pending Requests" value={stats.pendingRequests} sub="Across all teams" icon={<AlertIcon />} accentColor="#D97706" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Role Breakdown */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="mb-5 font-semibold text-[#0F172A]">Users by Role</p>
          <div className="space-y-3">
            {roleBreakdown.map(({ role, count }) => {
              const pct = Math.round((count / employees.length) * 100)
              const color = ROLE_COLORS[role] || 'bg-slate-100 text-slate-600'
              return (
                <div key={role} className="flex items-center gap-4">
                  <span className={`w-24 shrink-0 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold capitalize ${color}`}>{role}</span>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
                      <div className="h-2 rounded-full bg-[#1D4ED8]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-[#334155]">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="mb-5 font-semibold text-[#0F172A]">Quick Actions</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { label: 'Manage Users', desc: 'Add, update or deactivate user accounts', to: '/admin/users', color: '#1D4ED8', bg: '#EFF6FF' },
              { label: 'Leave Types', desc: 'Configure leave types and allocations', to: '/admin/leave-types', color: '#7C3AED', bg: '#F5F3FF' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="flex items-start gap-3 rounded-xl p-4 transition hover:opacity-90" style={{ backgroundColor: item.bg }}>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold" style={{ color: item.color }}>{item.label}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">{item.desc}</p>
                </div>
                <span style={{ color: item.color }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
