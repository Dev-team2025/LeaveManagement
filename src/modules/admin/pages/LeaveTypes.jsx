import { useAppData } from '@/hooks/useAppData'

const TYPE_COLORS = {
  '#2563EB': { pill: 'bg-blue-100 text-blue-700',   bar: '#2563EB' },
  '#DC2626': { pill: 'bg-red-100 text-red-700',     bar: '#DC2626' },
  '#D97706': { pill: 'bg-amber-100 text-amber-700', bar: '#D97706' },
  '#7C3AED': { pill: 'bg-purple-100 text-purple-700',bar: '#7C3AED' },
  '#DB2777': { pill: 'bg-pink-100 text-pink-700',   bar: '#DB2777' },
  '#059669': { pill: 'bg-emerald-100 text-emerald-700', bar: '#059669' },
}

export default function LeaveTypes() {
  const { leavePolicies } = useAppData()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Admin Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">Leave Types</h1>
        <p className="mt-0.5 text-sm text-ink-500">All configured leave types and their allocations. Edit via HR → Leave Policies.</p>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-ink-100 bg-white">
        <table className="min-w-full divide-y divide-ink-50 text-sm">
          <thead>
            <tr className="bg-ink-50">
              {['Code', 'Leave Type', 'Annual Days', 'Carry Forward', 'Encashable', 'Applicable To', 'Usage'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {leavePolicies.map((p) => {
              const colors = TYPE_COLORS[p.color] || { pill: 'bg-slate-100 text-slate-600', bar: '#94A3B8' }
              const usedPct = 50 // demo fill
              return (
                <tr key={p.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors.pill}`}>{p.code}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-ink-900">{p.leaveType}</td>
                  <td className="px-5 py-4 font-semibold text-ink-700">{p.totalDays}d</td>
                  <td className="px-5 py-4">
                    {p.carryForward ? (
                      <span className="text-emerald-700">Yes (max {p.maxCarryForward}d)</span>
                    ) : (
                      <span className="text-ink-400">No</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={p.encashable ? 'text-emerald-700 font-medium' : 'text-ink-400'}>
                      {p.encashable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.applicableTo.map((r) => (
                        <span key={r} className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-medium capitalize text-ink-700">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 w-32">
                    <div className="h-2 w-full rounded-full bg-ink-50">
                      <div className="h-2 rounded-full" style={{ width: `${usedPct}%`, backgroundColor: colors.bar }} />
                    </div>
                    <p className="mt-1 text-xs text-ink-400">~50% avg used</p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-ink-400">
        💡 To modify leave allocations, carry-forward limits, or encashability, go to <strong>HR → Leave Policies</strong>.
      </p>
    </section>
  )
}
