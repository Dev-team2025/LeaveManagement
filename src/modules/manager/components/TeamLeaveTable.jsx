import { Badge } from '@/components/common'

function TeamLeaveTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-[40px] border border-ink-100 bg-white shadow-panel">
      <table className="min-w-full divide-y divide-ink-50">
        <thead className="bg-ink-25/50">
          <tr>
            {['Employee', 'Request Info', 'Status', 'Review Date'].map((heading) => (
              <th key={heading} className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-ink-400">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-50">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-8 py-20 text-center text-sm font-bold text-ink-400 italic">No records found.</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-ink-25/50">
                <td className="px-8 py-5 font-black text-ink-900">{row.employee}</td>
                <td className="px-8 py-5">
                   <p className="text-sm font-bold text-ink-700">{row.leaveType}</p>
                   <p className="text-xs text-ink-400 font-medium">{row.period}</p>
                </td>
                <td className="px-8 py-5">
                   <Badge status={row.status} />
                </td>
                <td className="px-8 py-5 text-sm font-bold text-ink-500 uppercase italic">
                  {row.reviewDate || 'Pending'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TeamLeaveTable
