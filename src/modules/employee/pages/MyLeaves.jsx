import { Loader } from '@/components/common'
import LeaveTable from '@/modules/employee/components/LeaveTable'
import useEmployeeLeaves from '@/modules/employee/hooks/useEmployeeLeaves'

function MyLeaves() {
  const { leaves, isLoading } = useEmployeeLeaves()

  if (isLoading) {
    return <Loader label="Loading leave history" />
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">History</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">My Leaves</h2>
          <p className="mt-2 text-sm text-ink-500">
            Track approved, pending, and rejected leave requests in one view.
          </p>
        </div>
        <div className="rounded-2xl bg-ink-50 px-4 py-3 text-sm font-medium text-ink-500">
          {leaves.length} requests found
        </div>
      </div>

      <LeaveTable rows={leaves} />
    </section>
  )
}

export default MyLeaves
