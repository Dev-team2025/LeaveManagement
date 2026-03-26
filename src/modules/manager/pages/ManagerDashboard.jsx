import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/common'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'
import { getEmployeeById } from '@/data/mockData'
import Badge from '@/components/common/Badge'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
}

function UsersIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}
function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}

export default function ManagerDashboard() {
  const { leaveRequests, employees } = useAppData()
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

  const stats = useMemo(() => ({
    teamSize: teamEmployees.length,
    pending: teamRequests.filter((r) => r.status === 'pending').length,
    approved: teamRequests.filter((r) => r.status === 'approved').length,
  }), [teamEmployees, teamRequests])

  const recentRequests = useMemo(
    () => [...teamRequests].sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)).slice(0, 5),
    [teamRequests],
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">Manager Workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Team Leave Overview</h1>
          <p className="mt-0.5 text-sm text-[#64748B]">Monitor and manage leave requests for your team</p>
        </div>
        <Link to="/manager/team-leaves" className="inline-flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]">
          Manage Team Leaves
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Team Size" value={stats.teamSize} sub="Direct reports" icon={<UsersIcon />} accentColor="#1D4ED8" />
        <StatCard label="Pending Approvals" value={stats.pending} sub="Awaiting your action" icon={<ClockIcon />} accentColor="#D97706" />
        <StatCard label="Approved Leaves" value={stats.approved} sub="Total this year" icon={<CheckIcon />} accentColor="#16A34A" />
      </div>

      {/* Team Roster */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
          <p className="mb-4 font-semibold text-[#0F172A]">My Team</p>
          <div className="space-y-3">
            {teamEmployees.map((emp) => {
              const onLeave = leaveRequests.some(
                (r) => r.employeeId === emp.id && r.status === 'approved' &&
                  new Date(r.fromDate) <= new Date() && new Date(r.toDate) >= new Date(),
              )
              const pending = leaveRequests.filter((r) => r.employeeId === emp.id && r.status === 'pending').length
              return (
                <div key={emp.id} className="flex items-center gap-3 rounded-xl bg-[#F8F9FC] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-semibold text-[#1D4ED8]">
                    {emp.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#0F172A]">{emp.name}</p>
                    <p className="text-xs text-[#94A3B8]">{emp.designation}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    {onLeave && <span className="text-[10px] font-semibold text-amber-600">On Leave</span>}
                    {pending > 0 && <span className="text-[10px] font-semibold text-[#1D4ED8]">{pending} pending</span>}
                    {!onLeave && pending === 0 && <span className="text-[10px] text-[#94A3B8]">Available</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Requests */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-[#0F172A]">Recent Requests</p>
            <Link to="/manager/team-leaves" className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF]">See all →</Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map((req) => {
              const emp = getEmployeeById(req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8]">
                    {emp?.avatar || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#0F172A]">{emp?.name}</p>
                    <p className="text-xs text-[#94A3B8]">{req.leaveType} · {formatDate(req.fromDate)}–{formatDate(req.toDate)}</p>
                  </div>
                  <Badge status={req.status} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
