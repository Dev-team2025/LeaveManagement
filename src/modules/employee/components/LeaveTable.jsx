import { Badge } from '@/components/common'
import { formatDate } from '@/utils/helpers'

function LeaveTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-ink-50">
            <tr>

              {['Leave Type', 'From Date', 'To Date', 'Days', 'Status'].map((heading) => (

                <th key={heading} className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-ink-700">
                <td className="px-6 py-4 font-medium text-ink-900">{row.leaveType}</td>
                <td className="px-6 py-4">{formatDate(row.fromDate)}</td>
                <td className="px-6 py-4">{formatDate(row.toDate)}</td>
                <td className="px-6 py-4">{row.days}</td>
                <td className="px-6 py-4">
                  <Badge status={row.status} />
                </td>
                <td className="px-6 py-4">
                  {row.isPaid ? (
                    <span className="text-emerald-600 font-medium">Paid</span>
                  ) : (
                    <span className="text-rose-600 font-medium">Unpaid (LOP)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeaveTable
