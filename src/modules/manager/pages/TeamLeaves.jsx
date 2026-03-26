import { useMemo, useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { Badge, Modal } from '@/components/common'
import useAuth from '@/hooks/useAuth'
import { getEmployeeById } from '@/data/mockData'

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function TeamLeaves() {
  const { leaveRequests, employees, approveLeave, rejectLeave } = useAppData()
  const { user } = useAuth()
  const managerId = user?.id || 'EMP003'
  const [filter, setFilter] = useState('all')
  const [reviewModal, setReviewModal] = useState(null)
  const [noteText, setNoteText] = useState('')

  const teamIds = useMemo(
    () => employees.filter((e) => e.managerId === managerId).map((e) => e.id),
    [employees, managerId],
  )

  const teamRequests = useMemo(
    () =>
      leaveRequests
        .filter((r) => teamIds.includes(r.employeeId))
        .filter((r) => filter === 'all' || r.status === filter)
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
    [leaveRequests, teamIds, filter],
  )

  const counts = useMemo(() => {
    const team = leaveRequests.filter((r) => teamIds.includes(r.employeeId))
    return {
      all: team.length,
      pending: team.filter((r) => r.status === 'pending').length,
      approved: team.filter((r) => r.status === 'approved').length,
      rejected: team.filter((r) => r.status === 'rejected').length,
    }
  }, [leaveRequests, teamIds])

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
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">Manager Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">Team Leaves</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Review and action leave requests from your direct reports</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition ${
              filter === f ? 'bg-[#1D4ED8] text-white' : 'bg-white border border-[#E5E7EB] text-[#64748B] hover:bg-[#F8F9FC]'
            }`}
          >
            {f}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === f ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
        <table className="min-w-full divide-y divide-[#F1F5F9] text-sm">
          <thead>
            <tr className="bg-[#F8F9FC]">
              {['Employee', 'Leave Type', 'Duration', 'Days', 'Applied On', 'Status', 'Action'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {teamRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#94A3B8]">No requests in this category.</td>
              </tr>
            ) : (
              teamRequests.map((req) => {
                const emp = getEmployeeById(req.employeeId)
                return (
                  <tr key={req.id} className="transition-colors hover:bg-[#F8F9FC]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-semibold text-[#1D4ED8]">
                          {emp?.avatar || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A]">{emp?.name}</p>
                          <p className="text-xs text-[#94A3B8]">{emp?.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#334155]">{req.leaveType}</td>
                    <td className="px-5 py-4 text-[#334155]">{formatDate(req.fromDate)} – {formatDate(req.toDate)}</td>
                    <td className="px-5 py-4 font-semibold text-[#0F172A]">{req.days}d</td>
                    <td className="px-5 py-4 text-[#64748B]">{formatDate(req.appliedOn)}</td>
                    <td className="px-5 py-4"><Badge status={req.status} /></td>
                    <td className="px-5 py-4">
                      {req.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => openReview(req, 'approve')} className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition">Approve</button>
                          <button onClick={() => openReview(req, 'reject')} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition">Reject</button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#94A3B8]">{req.reviewedOn ? formatDate(req.reviewedOn) : '—'}</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <Modal isOpen={Boolean(reviewModal)} onClose={() => setReviewModal(null)} title={reviewModal?.action === 'approve' ? '✅ Approve Leave' : '❌ Reject Leave'}>
        {reviewModal && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[#F8F9FC] p-4 text-sm">
              <p className="font-semibold text-[#0F172A]">{getEmployeeById(reviewModal.request.employeeId)?.name}</p>
              <p className="mt-1 text-[#64748B]">{reviewModal.request.leaveType} · {formatDate(reviewModal.request.fromDate)} – {formatDate(reviewModal.request.toDate)} ({reviewModal.request.days}d)</p>
              {reviewModal.request.reason && <p className="mt-2 text-[#64748B]"><strong>Reason:</strong> {reviewModal.request.reason}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#334155]">Note (optional)</label>
              <textarea rows={3} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note…" className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10" />
            </div>
            <div className="flex gap-3">
              <button onClick={confirmReview} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${reviewModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm {reviewModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
              <button onClick={() => setReviewModal(null)} className="flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F8F9FC]">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
