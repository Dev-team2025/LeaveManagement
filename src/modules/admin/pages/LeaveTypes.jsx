import { useAppData } from '@/context/AppDataContext'

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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">Admin Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Leave Types</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">All configured leave types and their allocations. Edit via HR → Leave Policies.</p>
      </div>

      <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
        <table className="min-w-full divide-y divide-[#F1F5F9] text-sm">
          <thead>
            <tr className="bg-[#F8F9FC]">
              {['Code', 'Leave Type', 'Annual Days', 'Carry Forward', 'Encashable', 'Applicable To', 'Usage'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {leavePolicies.map((p) => {
              const colors = TYPE_COLORS[p.color] || { pill: 'bg-slate-100 text-slate-600', bar: '#94A3B8' }
              const usedPct = 50 // demo fill
              return (
                <tr key={p.id} className="transition-colors hover:bg-[#F8F9FC]">
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors.pill}`}>{p.code}</span>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#0F172A]">{p.leaveType}</td>
                  <td className="px-5 py-4 font-semibold text-[#334155]">{p.totalDays}d</td>
                  <td className="px-5 py-4">
                    {p.carryForward ? (
                      <span className="text-emerald-700">Yes (max {p.maxCarryForward}d)</span>
                    ) : (
                      <span className="text-[#94A3B8]">No</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={p.encashable ? 'text-emerald-700 font-medium' : 'text-[#94A3B8]'}>
                      {p.encashable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.applicableTo.map((r) => (
                        <span key={r} className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium capitalize text-[#334155]">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 w-32">
                    <div className="h-2 w-full rounded-full bg-[#F1F5F9]">
                      <div className="h-2 rounded-full" style={{ width: `${usedPct}%`, backgroundColor: colors.bar }} />
                    </div>
                    <p className="mt-1 text-xs text-[#94A3B8]">~50% avg used</p>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#94A3B8]">
        💡 To modify leave allocations, carry-forward limits, or encashability, go to <strong>HR → Leave Policies</strong>.
      </p>
    </section>
  )
}
