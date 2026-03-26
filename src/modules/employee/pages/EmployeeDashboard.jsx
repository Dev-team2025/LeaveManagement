import { Link, useOutletContext } from 'react-router-dom'
import { Loader } from '@/components/common'
import useEmployeeDashboard from '@/modules/employee/hooks/useEmployeeDashboard'
import { formatDate } from '@/utils/helpers'

function CalendarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function CheckIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function DecisionPill({ status }) {
  const normalized = status?.toLowerCase()

  if (normalized === 'approved') {
    return (
      <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckIcon className="h-4 w-4" />
        Approved
      </span>
    )
  }

  if (normalized === 'rejected') {
    return (
      <span className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
        <XIcon className="h-4 w-4" />
        Rejected
      </span>
    )
  }

  // Default for pending/other statuses
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
      Pending
    </span>
  )
}

function EmployeeDashboard() {
  const { dashboard, isLoading } = useEmployeeDashboard()
  const { profile } = useOutletContext() || {}

  if (isLoading) {
    return <Loader label="Loading dashboard" />
  }

  const renderTileNumber = (tile) => {
    if (tile.leaveType === 'WFH') {
      return (
        <>
          <p className="font-display text-4xl font-semibold text-ink-900">{tile.usedDays}</p>
          <p className="mt-1 text-xs font-medium text-ink-500">days used</p>
        </>
      )
    }

    return (
      <>
        <p className="font-display text-4xl font-semibold text-ink-900">{tile.availableDays}</p>
        <p className="mt-1 text-xs font-medium text-ink-500">days available</p>
      </>
    )
  }

  const wfhBarMax = 20
  const getBarWidthPct = (tile) => {
    if (tile.leaveType === 'WFH') {
      return Math.min(100, Math.round((tile.usedDays / wfhBarMax) * 100))
    }

    // For non-WFH tiles, use used/total to size the bar.
    const total = tile.totalDays || 1
    return Math.min(100, Math.round((tile.usedDays / total) * 100))
  }

  const getBarColorClass = (tile) => {
    if (tile.leaveType === 'Sick Leave') return 'bg-red-500'
    if (tile.leaveType === 'WFH') return 'bg-brand-600' // blue
    if (tile.leaveType === 'Casual Leave') return 'bg-amber-500'
    if (tile.tone === 'success') return 'bg-emerald-500'
    if (tile.tone === 'warning') return 'bg-amber-500'
    return 'bg-brand-600'
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] bg-white/80 p-6 shadow-panel backdrop-blur-lg lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-500">Welcome back</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-900">
              {profile?.name || 'Employee'}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {profile?.department || 'Department'} Department of Computer Science
            </p>
          </div>

          <div>
            <Link
              to="/employee/apply-leave"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              + Quick Apply Leave
            </Link>
          </div>
        </div>
      </div>

      {dashboard.alerts?.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {dashboard.alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-[24px] border border-ink-100 bg-white p-4 shadow-panel"
            >
              <div className="flex items-start gap-3">
                <div
                  className={
                    alert.variant === 'warning'
                      ? 'mt-1 h-3 w-3 rounded-full bg-warning-500'
                      : 'mt-1 h-3 w-3 rounded-full bg-brand-600'
                  }
                />
                <div>
                  <p className="font-semibold text-ink-900">{alert.title}</p>
                  <p className="mt-1 text-sm text-ink-500">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {dashboard.leaveTiles
          ?.filter((tile) => tile.leaveType !== 'Earned Leave')
          .map((tile) => (
            <article
              key={tile.id}
              className="rounded-[24px] bg-white p-4 shadow-panel"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-ink-400" />
                    <p className="text-sm font-semibold text-ink-900">
                      {tile.leaveType === 'Work From Home' ? 'WFH' : tile.leaveType}
                    </p>
                  </div>
                  <div className="mt-2">{renderTileNumber(tile)}</div>
                </div>
              </div>

              {tile.leaveType === 'WFH' ? (
                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-ink-100">
                    <div
                      className={`h-2 rounded-full ${getBarColorClass(tile)}`}
                      style={{
                        width: `${getBarWidthPct(tile)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-xs font-medium text-ink-500">
                    Used: <span className="font-semibold text-ink-700">{tile.usedDays}</span> days
                  </p>
                  <p className="mt-1 text-xs font-medium text-ink-500">
                    Total: <span className="font-semibold text-ink-700">{tile.totalDays}</span> days
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-ink-100">
                    <div
                      className={`h-2 rounded-full ${getBarColorClass(tile)}`}
                      style={{
                        width: `${getBarWidthPct(tile)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">Upcoming Leaves</p>
            </div>
            <button type="button" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {dashboard.upcomingLeaves?.map((leave) => (
              <div key={leave.id} className="rounded-[20px] bg-ink-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {leave.leaveType === 'Work From Home' ? 'WFH' : leave.leaveType}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                      <CalendarIcon className="h-4 w-4 text-ink-400" />
                      {formatDate(leave.fromDate)} - {formatDate(leave.toDate)} ({leave.days} days)
                    </p>
                  </div>
                  <DecisionPill status={leave.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-ink-900">Pending Requests</p>
              <span className="rounded-2xl bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-500">
                {dashboard.pendingRequests?.length || 0}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {dashboard.pendingRequests?.length ? (
              dashboard.pendingRequests.map((req) => (
                <div key={req.id} className="rounded-[20px] bg-ink-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {req.leaveType === 'Work From Home' ? 'WFH' : req.leaveType}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                        <CalendarIcon className="h-4 w-4 text-ink-400" />
                        {formatDate(req.fromDate)} - {formatDate(req.toDate)} ({req.days} days)
                      </p>
                    </div>
                    <DecisionPill status={req.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-500">No pending requests.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmployeeDashboard
