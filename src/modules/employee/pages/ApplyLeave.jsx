import LeaveForm from '@/modules/employee/components/LeaveForm'

function ApplyLeave() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-4xl font-semibold text-ink-900">Apply for Leave</h2>
        <p className="mt-2 text-base text-ink-500">Submit a new leave request for approval</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
        <LeaveForm />

        <aside className="space-y-5">
          <article className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-panel">
            <h3 className="font-display text-2xl font-semibold text-ink-900">Current Balance</h3>

            <div className="mt-5">
              <div className="flex items-end justify-between">
                <p className="text-sm font-medium text-ink-500">Available</p>
                <p className="text-3xl font-semibold text-ink-900">5 days</p>
              </div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-ink-100">
                <div className="h-2.5 w-1/2 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Total Allocation</span>
                <span className="font-semibold text-ink-900">10 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Already Used</span>
                <span className="font-semibold text-ink-900">5 days</span>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-panel">
            <h3 className="font-display text-2xl font-semibold text-ink-900">After This Request</h3>

            <div className="mt-5 rounded-2xl bg-brand-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-500">Days Requested</p>
                <p className="text-3xl font-semibold text-brand-600">3</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-ink-50 px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-500">Remaining Balance</p>
                <p className="text-3xl font-semibold text-ink-900">2</p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-brand-100 bg-brand-50/60 p-5 shadow-panel">
            <h3 className="font-display text-2xl font-semibold text-ink-900">Important Notes</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-600">
              <li>Leave requests require approval.</li>
              <li>Apply at least 3 days in advance.</li>
              <li>Emergency leaves need valid proof.</li>
              <li>Check department availability before applying.</li>
            </ul>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default ApplyLeave
