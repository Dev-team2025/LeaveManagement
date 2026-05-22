import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { Badge, Button, DashboardCard, EmptyState, Loader, Modal, Toast } from '@/components/common'
import useEmployeeDashboard from '@/modules/employee/hooks/useEmployeeDashboard'
import useEmployeeLeaves from '@/modules/employee/hooks/useEmployeeLeaves'
import useAuth from '@/hooks/useAuth'
import { formatDate } from '@/utils/helpers'

function StatIcon({ children }) {
  return <div className="h-5 w-5">{children}</div>
}

const ANIMATION_CLASSES = [
  'animate-fade-up',
  'animate-fade-up animate-fade-delay-1',
  'animate-fade-up animate-fade-delay-2',
  'animate-fade-up animate-fade-delay-3',
]

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { dashboard, isLoading } = useEmployeeDashboard()
  const { leaves, isLoading: isLeavesLoading } = useEmployeeLeaves()
  const { profile } = useOutletContext() || {}
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [toast, setToast] = useState(null)

  if (isLoading || isLeavesLoading) {
    return <Loader label="Loading dashboard" />
  }

  const profileName = profile?.name || 'Employee'
  const firstName = profileName.split(' ')[0] || profileName
  const initials = profileName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const approvedLeaves = leaves.filter((leave) => leave.status === 'approved')
  const rejectedLeaves = leaves.filter((leave) => leave.status === 'rejected')
  const pendingLeaves = leaves.filter((leave) => leave.status === 'pending')

  const approvedThisMonth = approvedLeaves.filter((leave) => {
    const date = new Date(leave.fromDate || leave.createdAt)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length

  const totalTaken = approvedLeaves.reduce((sum, leave) => sum + Number(leave.days || 0), 0)

  const totalBalance = (dashboard.leaveTiles || [])
    .filter((tile) => tile.leaveType !== 'WFH')
    .reduce((sum, tile) => sum + Number(tile.availableDays || 0), 0)

  const nextUpcoming = dashboard.upcomingLeaves?.[0] || null
  const upcomingLabel = nextUpcoming
    ? `${formatDate(nextUpcoming.fromDate)} to ${formatDate(nextUpcoming.toDate)}`
    : 'No upcoming leave'

  const recentRequests = [...leaves]
    .sort((a, b) => new Date(b.createdAt || b.fromDate) - new Date(a.createdAt || a.fromDate))
    .slice(0, 5)

  const summaryCards = [
    {
      id: 'balance',
      title: 'Leave Balance',
      value: `${totalBalance} days`,
      helper: 'Available across annual and casual',
      tone: 'info',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </StatIcon>
      ),
    },
    {
      id: 'pending',
      title: 'Pending Requests',
      value: `${dashboard.pendingRequests?.length ?? pendingLeaves.length} requests`,
      helper: 'Awaiting approvals',
      tone: 'warning',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </StatIcon>
      ),
    },
    {
      id: 'approved-month',
      title: 'Approved This Month',
      value: `${approvedThisMonth} leaves`,
      helper: 'Approved in the current month',
      tone: 'success',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </StatIcon>
      ),
    },
    {
      id: 'upcoming',
      title: 'Upcoming Leave',
      value: nextUpcoming ? nextUpcoming.leaveType : 'None scheduled',
      helper: upcomingLabel,
      tone: 'info',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20v-6" />
            <path d="M6 20V10" />
            <path d="M18 20V4" />
          </svg>
        </StatIcon>
      ),
    },
    {
      id: 'rejected',
      title: 'Rejected Requests',
      value: `${rejectedLeaves.length} requests`,
      helper: 'Last 12 months',
      tone: 'danger',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </StatIcon>
      ),
    },
    {
      id: 'taken',
      title: 'Total Leaves Taken',
      value: `${totalTaken} days`,
      helper: 'Approved leaves in total',
      tone: 'default',
      icon: (
        <StatIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h18v6H3z" />
            <path d="M3 21h18v-8H3z" />
          </svg>
        </StatIcon>
      ),
    },
  ]

  return (
    <section className="space-y-10">
      <Toast message={toast?.message} variant={toast?.variant} onClose={() => setToast(null)} />

      <div className="flex flex-col gap-6 rounded-[28px] border border-ink-100 bg-white/90 p-6 shadow-panel backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Employee Dashboard</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">
            Welcome back, {firstName}. Here is your leave summary.
          </h2>
          <p className="mt-2 text-sm text-ink-500">Review balances, upcoming time off, and recent requests at a glance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/employee/apply-leave">
            <Button size="lg">+ Apply Leave</Button>
          </Link>
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-left shadow-sm transition hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{profileName}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-ink-500">{profile?.role || 'Employee'}</p>
              </div>
              <svg className="ml-2 h-4 w-4 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-ink-100 bg-white p-2 shadow-panel">
              <button
                type="button"
                onClick={() => navigate('/employee/profile')}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Profile settings
              </button>
              <button
                type="button"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          </details>
        </div>
      </div>

      {dashboard.alerts?.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {dashboard.alerts.map((alert) => (
            <div key={alert.id} className="rounded-[24px] border border-ink-100 bg-white p-4 shadow-panel">
              <div className="flex items-start gap-3">
                <div className={alert.variant === 'warning' ? 'mt-1 h-3 w-3 rounded-full bg-warning-500' : 'mt-1 h-3 w-3 rounded-full bg-brand-600'} />
                <div>
                  <p className="font-semibold text-ink-900">{alert.title}</p>
                  <p className="mt-1 text-sm text-ink-500">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card, index) => (
          <div key={card.id} className={ANIMATION_CLASSES[index % ANIMATION_CLASSES.length]}>
            <DashboardCard {...card} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">Upcoming Leaves</p>
              <p className="text-xs text-ink-500">Your next scheduled time off</p>
            </div>
            <Link to="/employee/leave-history" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>

          {dashboard.upcomingLeaves?.length ? (
            <div className="space-y-4">
              {dashboard.upcomingLeaves.map((leave) => (
                <div key={leave.id} className="rounded-[22px] border border-ink-100 bg-ink-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{leave.leaveType}</p>
                      <p className="mt-1 text-xs text-ink-500">
                        {formatDate(leave.fromDate)} to {formatDate(leave.toDate)}
                      </p>
                      <p className="mt-2 text-xs text-ink-400">{leave.reason || 'Reason not provided'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge status={leave.status} />
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                        {leave.days} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming leaves"
              message="You have no planned leaves right now. Reserve your time off in a few clicks."
              actionLabel="Apply for leave"
              onAction={() => navigate('/employee/apply-leave')}
              className="bg-ink-50"
            />
          )}
        </div>

        <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">Quick Actions</p>
              <p className="text-xs text-ink-500">Jump back into your workflow</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link to="/employee/apply-leave" className="flex items-center justify-between rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-white">
              Apply Leave
              <span className="text-brand-600">→</span>
            </Link>
            <Link to="/employee/leave-history" className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-50">
              View Leave History
              <span className="text-brand-600">→</span>
            </Link>
            <Link to="/employee/profile" className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-50">
              Update Profile
              <span className="text-brand-600">→</span>
            </Link>
            <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-50">
              Contact Admin
              <span className="text-brand-600">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink-900">Recent Requests</p>
            <p className="text-xs text-ink-500">Latest leave requests and statuses</p>
          </div>
          <Link to="/employee/leave-history" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
              <tr>
                {['Leave Type', 'From', 'To', 'Days', 'Status', 'Action'].map((label) => (
                  <th key={label} className="px-4 py-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                recentRequests.map((leave) => (
                  <tr key={leave.id} className="text-ink-700">
                    <td className="px-4 py-4 font-semibold text-ink-900">{leave.leaveType}</td>
                    <td className="px-4 py-4">{formatDate(leave.fromDate)}</td>
                    <td className="px-4 py-4">{formatDate(leave.toDate)}</td>
                    <td className="px-4 py-4">{leave.days}</td>
                    <td className="px-4 py-4">
                      <Badge status={leave.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(leave)}
                          className="rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          disabled={leave.status !== 'pending'}
                          onClick={() => setToast({ variant: 'info', message: 'Cancellation requests can be sent from My Leaves.' })}
                          className="rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Request: ${selectedRequest.leaveType}` : 'Request Details'}
      >
        {selectedRequest ? (
          <div className="space-y-4 text-sm text-ink-700">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Dates</span>
              <span className="font-semibold text-ink-900">
                {formatDate(selectedRequest.fromDate)} to {formatDate(selectedRequest.toDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Days</span>
              <span className="font-semibold text-ink-900">{selectedRequest.days}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Status</span>
              <Badge status={selectedRequest.status} />
            </div>
            {selectedRequest.reason ? (
              <div>
                <p className="text-ink-500">Reason</p>
                <p className="mt-1 rounded-2xl bg-ink-50 px-3 py-2 text-ink-700">
                  {selectedRequest.reason}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
