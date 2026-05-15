import LeaveStatusBadge from '@/modules/employee/components/LeaveStatusBadge'
import { formatDate, openAttachment } from '@/utils/helpers'

function LeaveTable({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[28px] border border-ink-100 bg-white p-16 text-center shadow-panel">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-50 text-ink-300">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-bold text-ink-900">No leave requests found</p>
        <p className="mt-1 text-sm text-ink-500">Your applied leaves will appear here.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-panel">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-ink-50">
            <tr>
              {['Leave Type', 'Duration', 'Days', 'Applied On', 'Status', 'Attachment'].map((heading) => (
                <th key={heading} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-ink-400">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-ink-700 transition-colors hover:bg-ink-25/50">
                <td className="px-6 py-5 font-bold text-ink-900">{row.leaveType}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-ink-800">{formatDate(row.fromDate)} – {formatDate(row.toDate)}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-medium">{row.days} days</td>
                <td className="px-6 py-5 text-ink-500">{formatDate(row.createdAt)}</td>
                <td className="px-6 py-5">
                  <LeaveStatusBadge status={row.status} />
                </td>
                <td className="px-6 py-5">
                  {row.attachmentUrl ? (
                    <button
                      onClick={() => openAttachment(row.attachmentUrl, row.attachmentName)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition hover:bg-brand-600 hover:text-white"
                      title="View Attachment"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-ink-300">—</span>
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
