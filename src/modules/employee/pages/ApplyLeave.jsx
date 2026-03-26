import LeaveForm from '@/modules/employee/components/LeaveForm'

function ApplyLeave() {
  return (
    <section className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-semibold text-ink-900">Apply for Leave</h2>
        <p className="mt-1 text-sm text-ink-500">
          Submit a new leave request for approval
        </p>
      </div>

      <LeaveForm />
    </section>
  )
}

export default ApplyLeave
