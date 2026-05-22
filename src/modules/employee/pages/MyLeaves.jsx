import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, EmptyState, Loader, Modal, Toast } from '@/components/common'
import useEmployeeLeaves from '@/modules/employee/hooks/useEmployeeLeaves'
import { formatDate } from '@/utils/helpers'

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected', 'cancelled']

function MyLeaves() {
  const { leaves, isLoading } = useEmployeeLeaves()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [cancelRequest, setCancelRequest] = useState(null)
  const [toast, setToast] = useState(null)

  const leaveTypes = useMemo(() => {
    const types = new Set(leaves.map((leave) => leave.leaveType))
    return ['all', ...Array.from(types)]
  }, [leaves])

  const filtered = useMemo(() => {
    return leaves
      .filter((leave) => statusFilter === 'all' || leave.status === statusFilter)
      .filter((leave) => typeFilter === 'all' || leave.leaveType === typeFilter)
      .filter((leave) => {
        if (!search) return true
        const query = search.toLowerCase()
        return (
          leave.leaveType?.toLowerCase().includes(query) ||
          leave.reason?.toLowerCase().includes(query)
        )
      })
      .filter((leave) => {
        if (!dateFrom && !dateTo) return true
        const start = new Date(leave.fromDate).getTime()
        const end = new Date(leave.toDate).getTime()
        const from = dateFrom ? new Date(dateFrom).getTime() : null
        const to = dateTo ? new Date(dateTo).getTime() : null
        if (from && end < from) return false
        if (to && start > to) return false
        return true
      })
      .sort((a, b) => new Date(b.createdAt || b.fromDate) - new Date(a.createdAt || a.fromDate))
  }, [leaves, statusFilter, typeFilter, search, dateFrom, dateTo])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader label="Loading leave history..." />
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <Toast message={toast?.message} variant={toast?.variant} onClose={() => setToast(null)} />

      <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Leave history</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">My Leaves</h2>
            <p className="mt-2 text-sm text-ink-500">Search, filter, and review every request in one place.</p>
          </div>
          <div className="rounded-2xl bg-ink-50 px-4 py-3 text-sm font-medium text-ink-500">
            {filtered.length} of {leaves.length} requests
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  statusFilter === status
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                    : 'bg-ink-50 text-ink-500 hover:bg-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-2xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="rounded-2xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="rounded-2xl border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div className="mt-4">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by leave type or reason"
            className="w-full rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No leave requests found"
          message="Try adjusting your filters or apply for a new leave to get started."
          actionLabel="Apply for leave"
          onAction={() => navigate('/employee/apply-leave')}
        />
      ) : (
        <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-ink-400">
                <tr>
                  {['Leave Type', 'From', 'To', 'Days', 'Status', 'Actions'].map((label) => (
                    <th key={label} className="px-4 py-3">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((leave) => (
                  <tr key={leave.id} className="text-ink-700">
                    <td className="px-4 py-4 font-semibold text-ink-900">{leave.leaveType}</td>
                    <td className="px-4 py-4">{formatDate(leave.fromDate)}</td>
                    <td className="px-4 py-4">{formatDate(leave.toDate)}</td>
                    <td className="px-4 py-4">{leave.days}</td>
                    <td className="px-4 py-4">
                      <Badge status={leave.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRequest(leave)}
                          className="rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelRequest(leave)}
                          disabled={leave.status !== 'pending'}
                          className="rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setToast({ variant: 'info', message: 'Download support is coming soon.' })}
                          className="rounded-xl border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-50"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest ? `Request: ${selectedRequest.leaveType}` : 'Request Details'}
      >
        {selectedRequest ? (
          <div className="space-y-4 text-sm text-ink-700">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Dates</span>
              <span className="font-semibold text-ink-900">
                {formatDate(selectedRequest.fromDate)} to {formatDate(selectedRequest.toDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Days</span>
              <span className="font-semibold text-ink-900">{selectedRequest.days}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Status</span>
              <Badge status={selectedRequest.status} />
            </div>
            {selectedRequest.reason ? (
              <div>
                <p className="text-ink-500">Reason</p>
                <p className="mt-1 rounded-2xl bg-ink-50 px-3 py-2 text-ink-700">
                  {selectedRequest.reason}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={Boolean(cancelRequest)}
        onClose={() => setCancelRequest(null)}
        title="Cancel leave request"
      >
        {cancelRequest ? (
          <div className="space-y-4 text-sm text-ink-700">
            <p>
              Cancel the request for {cancelRequest.leaveType} from {formatDate(cancelRequest.fromDate)} to {formatDate(cancelRequest.toDate)}?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setToast({ variant: 'info', message: 'Cancellation request submitted. HR will review it shortly.' })
                  setCancelRequest(null)
                }}
                className="flex-1 rounded-2xl bg-brand-600 py-2.5 text-sm font-semibold text-white"
              >
                Confirm cancellation
              </button>
              <button
                type="button"
                onClick={() => setCancelRequest(null)}
                className="flex-1 rounded-2xl border border-ink-200 py-2.5 text-sm font-semibold text-ink-600"
              >
                Keep request
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}

export default MyLeaves
