import { useState, useMemo } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { Badge, Modal } from '@/components/common'
import { getEmployeeById } from '@/data/mockData'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Avatar({ initials, size = 'sm' }) {
  const sizeClasses = size === 'md' ? 'h-11 w-11 text-sm' : 'h-8 w-8 text-xs'
  return (
    <div className={`${sizeClasses} shrink-0 flex items-center justify-center rounded-full bg-[#EFF6FF] font-semibold text-[#1D4ED8]`}>
      {initials}
    </div>
  )
}

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function LeaveRequests() {
  const { leaveRequests, approveLeave, rejectLeave } = useAppData()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [reviewModal, setReviewModal] = useState(null) // { request, action }
  const [noteText, setNoteText] = useState('')

  const filtered = useMemo(() => {
    return leaveRequests
      .filter((r) => filter === 'all' || r.status === filter)
      .filter((r) => {
        if (!search) return true
        const emp = getEmployeeById(r.employeeId)
        return (
          emp?.name.toLowerCase().includes(search.toLowerCase()) ||
          r.leaveType.toLowerCase().includes(search.toLowerCase())
        )
      })
      .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn))
  }, [leaveRequests, filter, search])

  const counts = useMemo(() => ({
    all: leaveRequests.length,
    pending: leaveRequests.filter((r) => r.status === 'pending').length,
    approved: leaveRequests.filter((r) => r.status === 'approved').length,
    rejected: leaveRequests.filter((r) => r.status === 'rejected').length,
  }), [leaveRequests])

  function openReview(request, action) {
    setNoteText('')
    setReviewModal({ request, action })
  }

  function confirmReview() {
    if (!reviewModal) return
    if (reviewModal.action === 'approve') approveLeave(reviewModal.request.id, noteText)
    else rejectLeave(reviewModal.request.id, noteText)
    setReviewModal(null)
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">All Leave Requests</h1>
          <p className="mt-1 text-sm text-ink-500">Review and manage leave applications across the organisation</p>
        </div>
      </div>

      {/* Filters + Search Card */}
      <div className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  filter === f
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                    : 'bg-ink-50 text-ink-500 hover:bg-ink-100'
                }`}
              >
                <span className="capitalize">{f}</span>
                <span className={`flex h-6 min-w-[24px] items-center justify-center rounded-lg px-1.5 text-[10px] font-black transition ${
                  filter === f ? 'bg-white/20 text-white' : 'bg-ink-200 text-ink-600 group-hover:bg-ink-300'
                }`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-ink-100 bg-ink-50 pl-11 pr-5 py-3.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 lg:w-80"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink-50 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-50 text-sm">
              <thead>
                <tr className="bg-ink-25/50">
                  {['Employee', 'Leave Type', 'Duration', 'Applied On', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-ink-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-300">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="mt-4 text-sm font-bold text-ink-900">No requests found</p>
                        <p className="mt-1 text-xs text-ink-400">Try adjusting your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((req) => {
                    const emp = getEmployeeById(req.employeeId)
                    return (
                      <tr key={req.id} className="transition-colors hover:bg-ink-25/30">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar initials={emp?.avatar || '??'} />
                            <div>
                              <p className="font-bold text-ink-900">{emp?.name || req.employeeId}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{emp?.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                            {req.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-ink-900">
                              {formatDate(req.fromDate)} – {formatDate(req.toDate)}
                            </span>
                            <span className="mt-0.5 text-[10px] font-medium text-ink-400">{req.days} days requested</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs font-medium text-ink-500">
                          {formatDate(req.appliedOn)}
                        </td>
                        <td className="px-6 py-5">
                          <Badge status={req.status} />
                        </td>
                        <td className="px-6 py-5">
                          {req.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => openReview(req, 'approve')}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white shadow-sm"
                                title="Approve"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openReview(req, 'reject')}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white shadow-sm"
                                title="Reject"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">
                              {req.reviewedOn ? `Reviewed: ${formatDate(req.reviewedOn)}` : '—'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(reviewModal)}
        onClose={() => setReviewModal(null)}
        title={reviewModal?.action === 'approve' ? 'Approve Leave' : 'Reject Leave'}
      >
        {reviewModal && (
          <div className="space-y-6 pt-2">
            <div className="rounded-3xl bg-ink-25 p-6 border border-ink-50">
              <div className="flex items-center gap-4">
                <Avatar initials={getEmployeeById(reviewModal.request.employeeId)?.avatar || '??'} size="md" />
                <div>
                  <p className="font-bold text-ink-900">
                    {getEmployeeById(reviewModal.request.employeeId)?.name}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-ink-500">
                    {reviewModal.request.leaveType} · {reviewModal.request.days} days
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-ink-50 pt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">Duration</p>
                <p className="text-sm font-bold text-ink-700">
                  {formatDate(reviewModal.request.fromDate)} – {formatDate(reviewModal.request.toDate)}
                </p>
                {reviewModal.request.reason && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2 mt-4">Reason</p>
                    <p className="text-sm italic text-ink-600 leading-relaxed bg-white rounded-2xl p-4 border border-ink-50">
                      "{reviewModal.request.reason}"
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink-900">
                Decision Note <span className="text-ink-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={reviewModal.action === 'approve' ? "Add an encouraging note..." : "Explain the reason for rejection..."}
                className="w-full rounded-2xl border border-ink-100 bg-white px-5 py-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 shadow-sm"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 rounded-2xl border border-ink-100 bg-white px-6 py-4 text-sm font-bold text-ink-900 transition hover:bg-ink-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReview}
                className={`flex-[2] rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-lg transition ${
                  reviewModal.action === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' 
                    : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                }`}
              >
                {reviewModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
