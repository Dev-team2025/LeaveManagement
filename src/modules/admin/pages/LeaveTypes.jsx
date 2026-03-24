import { Loader } from '@/components/common'
import useAdminData from '@/modules/admin/hooks/useAdminData'

function LeaveTypes() {
  const { leaveTypes, isLoading } = useAdminData()

  if (isLoading) {
    return <Loader label="Loading leave types" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Admin workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">Leave type configuration</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {leaveTypes.map((type) => (
          <article key={type.id} className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-panel">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{type.id}</p>
            <h2 className="mt-3 text-xl font-semibold text-ink-900">{type.name}</h2>
            <p className="mt-2 text-sm text-ink-500">Quota: {type.quota}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LeaveTypes
