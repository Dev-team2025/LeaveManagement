import { Button } from '@/components/common'

function TeamLeaveTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-panel">
      <table className="min-w-full divide-y divide-ink-100">
        <thead className="bg-ink-50">
          <tr>
            {['Request', 'Employee', 'Period', 'Action'].map((heading) => (
              <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 text-sm text-ink-700">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4 font-medium text-ink-900">{row.id}</td>
              <td className="px-5 py-4">{row.employee}</td>
              <td className="px-5 py-4">{row.period}</td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <Button size="sm">Approve</Button>
                  <Button size="sm" variant="secondary">
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TeamLeaveTable
