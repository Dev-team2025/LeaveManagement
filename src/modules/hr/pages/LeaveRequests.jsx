import { Loader } from '@/components/common'
import LeaveRequestTable from '@/modules/hr/components/LeaveRequestTable'
import useHRLeaves from '@/modules/hr/hooks/useHRLeaves'

function LeaveRequests() {
  const { requests, isLoading } = useHRLeaves()

  if (isLoading) {
    return <Loader label="Loading leave requests" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">HR workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">Pending leave requests</h1>
      </div>
      <LeaveRequestTable requests={requests} />
    </section>
  )
}

export default LeaveRequests
