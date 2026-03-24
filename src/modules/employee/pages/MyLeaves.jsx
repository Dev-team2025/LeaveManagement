import { useState } from 'react'
import { Loader, Modal } from '@/components/common'
import LeaveStatusBadge from '@/modules/employee/components/LeaveStatusBadge'
import useEmployeeLeaves from '@/modules/employee/hooks/useEmployeeLeaves'
import { formatDate } from '@/utils/helpers'

function calculateDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0
  const diff = new Date(toDate) - new Date(fromDate)
  return diff >= 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) + 1 : 0
}

function MyLeaves() {
  const { leaves, isLoading } = useEmployeeLeaves()
  const [selectedLeave, setSelectedLeave] = useState(null)

  if (isLoading) {
    return <Loader label="Loading leave history" />
  }

  const normalizedLeaves = leaves.map((leave) => ({
    ...leave,
    daysOfLeave: leave.daysOfLeave || calculateDays(leave.fromDate, leave.toDate),
    approvedBy: leave.approvedBy || '--',
  }))

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
          {normalizedLeaves.length} requests found
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-ink-100 bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-ink-50">
              <tr>
                {[
                  'Leave ID',
                  'Leave Type',
                  'From Date',
                  'To Date',
                  'Days of Leave',
                  'Approved By',
                  'Status',
                  'View',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {normalizedLeaves.map((leave) => (
                <tr key={leave.id} className="text-sm text-ink-700">
                  <td className="px-4 py-4 font-semibold text-ink-900">{leave.id}</td>
                  <td className="px-4 py-4 font-medium text-ink-900">{leave.leaveType}</td>
                  <td className="px-4 py-4">{formatDate(leave.fromDate)}</td>
                  <td className="px-4 py-4">{formatDate(leave.toDate)}</td>
                  <td className="px-4 py-4">{leave.daysOfLeave}</td>
                  <td className="px-4 py-4">{leave.approvedBy}</td>
                  <td className="px-4 py-4">
                    <LeaveStatusBadge status={leave.status} />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedLeave(leave)}
                      className="rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedLeave)}
        title={selectedLeave ? `Leave Details - ${selectedLeave.id}` : 'Leave Details'}
        onClose={() => setSelectedLeave(null)}
      >
        {selectedLeave ? (
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-semibold text-ink-900">Leave Type:</span> {selectedLeave.leaveType}
            </p>
            <p>
              <span className="font-semibold text-ink-900">From:</span> {formatDate(selectedLeave.fromDate)}
            </p>
            <p>
              <span className="font-semibold text-ink-900">To:</span> {formatDate(selectedLeave.toDate)}
            </p>
            <p>
              <span className="font-semibold text-ink-900">Days of Leave:</span> {selectedLeave.daysOfLeave}
            </p>
            <p>
              <span className="font-semibold text-ink-900">Approved By:</span> {selectedLeave.approvedBy}
            </p>
            <div className="pt-1">
              <LeaveStatusBadge status={selectedLeave.status} />
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

export default MyLeaves
