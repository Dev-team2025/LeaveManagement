import { useMemo } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { getEmployeeById } from '@/data/mockData'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div>
      <p className="mb-4 font-semibold text-[#0F172A]">{label}</p>
      <div className="flex items-end gap-3 h-36">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-xs font-semibold text-[#334155]">{d.value}</span>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{ height: `${Math.max(8, Math.round((d.value / max) * 100))}%`, backgroundColor: d.color || '#1D4ED8' }}
              />
            </div>
            <span className="text-[10px] text-[#94A3B8] text-center leading-tight">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const { leaveRequests, employees, leavePolicies } = useAppData()

  const stats = useMemo(() => {
    const total = leaveRequests.length
    const approved = leaveRequests.filter((r) => r.status === 'approved').length
    const pending = leaveRequests.filter((r) => r.status === 'pending').length
    const rejected = leaveRequests.filter((r) => r.status === 'rejected').length
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0
    const totalDaysTaken = leaveRequests.filter((r) => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)
    const avgDays = approved > 0 ? (totalDaysTaken / approved).toFixed(1) : 0
    return { total, approved, pending, rejected, approvalRate, totalDaysTaken, avgDays }
  }, [leaveRequests])

  const leaveTypeData = useMemo(() => {
    const map = {}
    leaveRequests.forEach((r) => {
      if (r.status === 'approved') {
        map[r.leaveType] = (map[r.leaveType] || 0) + r.days
      }
    })
    const colors = { 'Annual Leave': '#2563EB', 'Sick Leave': '#DC2626', 'Casual Leave': '#D97706', 'Work From Home': '#7C3AED', 'Maternity Leave': '#DB2777' }
    return Object.entries(map).map(([label, value]) => ({ label: label.split(' ')[0], value, color: colors[label] || '#64748B' }))
  }, [leaveRequests])

  const departmentData = useMemo(() => {
    const map = {}
    leaveRequests.forEach((r) => {
      if (r.status === 'approved') {
        const emp = getEmployeeById(r.employeeId)
        if (emp) map[emp.department] = (map[emp.department] || 0) + r.days
      }
    })
    const deptColors = { Engineering: '#1D4ED8', Design: '#7C3AED', Marketing: '#D97706', Finance: '#059669', 'Human Resources': '#DB2777', IT: '#0891B2' }
    return Object.entries(map).map(([label, value]) => ({ label, value, color: deptColors[label] || '#64748B' }))
  }, [leaveRequests])

  const topEmployees = useMemo(() => {
    const map = {}
    leaveRequests.filter((r) => r.status === 'approved').forEach((r) => {
      map[r.employeeId] = (map[r.employeeId] || 0) + r.days
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, days]) => ({ ...getEmployeeById(id), days }))
  }, [leaveRequests])

  const recentApproved = useMemo(
    () => leaveRequests.filter((r) => r.status === 'approved').sort((a, b) => new Date(b.reviewedOn) - new Date(a.reviewedOn)).slice(0, 5),
    [leaveRequests],
  )

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Reports & Analytics</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Leave analytics and workforce insights</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Requests', value: stats.total, color: '#1D4ED8', bg: '#EFF6FF' },
          { label: 'Approval Rate', value: `${stats.approvalRate}%`, color: '#16A34A', bg: '#F0FDF4' },
          { label: 'Avg Leave Duration', value: `${stats.avgDays}d`, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Total Days Approved', value: `${stats.totalDaysTaken}d`, color: '#7C3AED', bg: '#F5F3FF' },
        ].map((k) => (
          <div key={k.label} className="rounded-[20px] border border-[#E5E7EB] bg-white p-5">
            <p className="text-sm text-[#64748B]">{k.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <BarChart data={leaveTypeData} label="Days Taken by Leave Type" />
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <BarChart data={departmentData} label="Days Taken by Department" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Employees */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="mb-4 font-semibold text-[#0F172A]">Top Leave Takers</p>
          <div className="space-y-3">
            {topEmployees.map((emp, i) => (
              <div key={emp?.id || i} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-xs font-bold text-[#94A3B8]">#{i + 1}</span>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8]">
                  {emp?.avatar || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#0F172A]">{emp?.name || 'Unknown'}</p>
                  <p className="text-xs text-[#94A3B8]">{emp?.department}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#1D4ED8]">{emp?.days}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Approved */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <p className="mb-4 font-semibold text-[#0F172A]">Recently Approved</p>
          <div className="space-y-3">
            {recentApproved.map((req) => {
              const emp = getEmployeeById(req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-3 rounded-xl bg-[#F8F9FC] p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8]">
                    {emp?.avatar || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#0F172A]">{emp?.name}</p>
                    <p className="text-xs text-[#94A3B8]">{req.leaveType} · {req.days}d</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#94A3B8]">{formatDate(req.reviewedOn)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
