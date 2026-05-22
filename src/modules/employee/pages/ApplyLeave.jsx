import { DashboardCard, Loader } from '@/components/common'
import LeaveForm from '@/modules/employee/components/LeaveForm'
import useEmployeeDashboard from '@/modules/employee/hooks/useEmployeeDashboard'

function ApplyLeave() {
  const { dashboard, isLoading } = useEmployeeDashboard()

  if (isLoading) {
    return <Loader label="Loading leave balances" />
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Apply Leave</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Submit a new request</h2>
        <p className="mt-2 text-sm text-ink-500">
          Provide dates, reason, and attachments. Your manager will be notified instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <LeaveForm balances={dashboard.leaveTiles || []} />

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-panel">
            <p className="text-sm font-semibold text-ink-900">Available Balance</p>
            <p className="mt-1 text-xs text-ink-500">Updated in real time from your dashboard</p>
            <div className="mt-4 space-y-3">
              {(dashboard.leaveTiles || []).map((tile) => (
                <DashboardCard
                  key={tile.id}
                  title={tile.leaveType === 'Work From Home' ? 'WFH' : tile.leaveType}
                  value={tile.leaveType === 'WFH' ? `${tile.usedDays} used` : `${tile.availableDays} days`}
                  helper={tile.leaveType === 'WFH' ? 'Emergency only' : `${tile.usedDays} used this year`}
                  tone={tile.tone || 'default'}
                />
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-panel">
            <p className="text-sm font-semibold text-ink-900">Policy reminders</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>Requests longer than 5 days need early approval.</li>
              <li>WFH is restricted during semester periods unless emergency.</li>
              <li>Attach medical documents for sick leave beyond 2 days.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default ApplyLeave
