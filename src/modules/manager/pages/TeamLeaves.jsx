import { useMemo, useState, useEffect } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { Badge, Modal, Loader } from '@/components/common'
import useAuth from '@/hooks/useAuth'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

const FILTERS = [
  { id: 'all', label: 'All Requests', color: 'ink' },
  { id: 'pending', label: 'Pending Review', color: 'amber' },
  { id: 'approved', label: 'Approved', color: 'emerald' },
  { id: 'rejected', label: 'Rejected', color: 'red' },
]

export default function TeamLeaves() {
  const { approveLeave, rejectLeave } = useAppData()
  const { user } = useAuth()
  const axiosInstance = useAxios()
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null) // 'approve' or 'reject'
  const [note, setNote] = useState('')
  const [isProcessing, setProcessing] = useState(false)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await managerService.getTeamLeaves(axiosInstance)
      // Map backend fields to frontend fields
      const mapped = data.map(r => ({
        id: r.id,
        employeeId: r.userId,
        employeeName: r.employee,
        designation: r.designation,
        leaveType: r.leaveType,
        fromDate: r.fromDate,
        toDate: r.toDate,
        days: r.days,
        reason: r.reason,
        status: r.status.toLowerCase(),
        appliedOn: r.appliedOn,
        reviewedOn: r.decidedAt,
        attachmentUrl: r.attachmentUrl,
        attachmentName: r.attachmentName
      }))
      setLeaveRequests(mapped)
    } catch (err) {
      console.error('Failed to load team leaves:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [axiosInstance])

  const filteredRequests = useMemo(
    () =>
      leaveRequests
        .filter((r) => activeFilter === 'all' || r.status === activeFilter)
        .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
    [leaveRequests, activeFilter],
  )

  const counts = useMemo(() => {
    return {
      all: leaveRequests.length,
      pending: leaveRequests.filter((r) => r.status === 'pending').length,
      approved: leaveRequests.filter((r) => r.status === 'approved').length,
      rejected: leaveRequests.filter((r) => r.status === 'rejected').length,
    }
  }, [leaveRequests])

  async function handleAction() {
    if (!selectedRequest || !selectedAction || isProcessing) return
    setProcessing(true)
    try {
      if (selectedAction === 'approve') {
        await managerService.approveRequest(axiosInstance, selectedRequest.id, note)
      } else {
        await managerService.rejectRequest(axiosInstance, selectedRequest.id, note)
      }
      await loadRequests()
      setSelectedRequest(null)
      setSelectedAction(null)
      setNote('')
    } catch (err) {
      console.error('Failed to process request:', err)
      alert('Failed to process request. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  function openReview(request, action) {
    setNote('')
    setSelectedRequest(request)
    setSelectedAction(action)
  }

  function getInitials(name) {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader /></div>

  return (
    <section className="space-y-8 pb-20">
      {/* Header section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-ink-900">
            Team <span className="text-brand-600">Leaves</span> Lifecycle
          </h1>
          <p className="mt-1 text-sm font-bold text-ink-400 font-medium">Manage time-off requests across your reporting structure.</p>
        </div>

        {/* Filter Pill UI */}
        <div className="flex flex-wrap gap-1.5 rounded-[24px] bg-ink-50 p-1.5 border border-ink-100">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                activeFilter === f.id ? 'bg-white text-ink-900 shadow-sm ring-1 ring-ink-100' : 'text-ink-400 hover:text-ink-900'
              }`}
            >
              {f.label}
              <span className={`flex h-5 min-w-5 items-center justify-center rounded-lg px-1.5 text-[10px] ${activeFilter === f.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-ink-100 text-ink-500'}`}>
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modern High-Aesthetic Table */}
      <div className="overflow-hidden rounded-[40px] border border-ink-100 bg-white shadow-panel">
        <table className="min-w-full divide-y divide-ink-50">
          <thead className="bg-ink-25/50">
            <tr>
              {['Team Member', 'Category', 'Duration', 'Applied On', 'Payment', 'Status', 'Review'].map((h) => (
                <th key={h} className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-ink-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-32 text-center">
                   <div className="mx-auto flex flex-col items-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-ink-25 text-ink-200 mb-4 border-2 border-dashed border-ink-100">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      </div>
                      <h3 className="text-lg font-black text-ink-900 uppercase tracking-tight">No processing found</h3>
                      <p className="text-sm font-bold text-ink-400 mt-1">Your filters are clear and up to date.</p>
                   </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                return (
                  <tr key={req.id} className="group transition-colors hover:bg-ink-25/30">
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-brand-50 text-brand-600 font-black text-xs ring-2 ring-white shadow-sm border border-brand-100">
                          {getInitials(req.employeeName)}
                        </div>
                        <div>
                          <p className="font-black text-ink-900 leading-tight tracking-tight">{req.employeeName}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-ink-400 mt-1">{req.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                       <span className="inline-flex rounded-lg bg-ink-25 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-ink-600 border border-ink-100">{req.leaveType}</span>
                    </td>
                    <td className="px-8 py-7">
                       <p className="text-sm font-black text-ink-900 leading-tight">{req.days} Business Days</p>
                       <p className="text-[10px] font-bold text-ink-400 mt-1 uppercase tracking-wider">{new Date(req.fromDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — {new Date(req.toDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                    </td>
                    <td className="px-8 py-7 text-xs font-bold text-ink-500 italic">
                       {new Date(req.appliedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-7">
                      {req.isPaid ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Paid</span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Unpaid (LOP)</span>
                      )}
                    </td>
                    <td className="px-8 py-7">
                       <Badge status={req.status} className="!text-[10px] !px-3 !py-1 !font-black !tracking-widest !uppercase" />
                    </td>
                    <td className="px-8 py-7">
                       {req.status === 'pending' ? (
                         <div className="flex gap-3">
                           <button
                             onClick={() => openReview(req, 'approve')}
                             className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white shadow-sm border border-emerald-100/50"
                             title="Approve"
                           >
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                               <polyline points="20 6 9 17 4 12"></polyline>
                             </svg>
                           </button>
                           <button
                             onClick={() => openReview(req, 'reject')}
                             className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white shadow-sm border border-red-100/50"
                             title="Reject"
                           >
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                               <line x1="18" y1="6" x2="6" y2="18"></line>
                               <line x1="6" y1="6" x2="18" y2="18"></line>
                             </svg>
                           </button>
                         </div>
                       ) : (
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-ink-300">Reviewed On</span>
                            <span className="text-xs font-bold text-ink-700">{req.reviewedOn ? new Date(req.reviewedOn).toLocaleDateString() : '—'}</span>
                         </div>
                       )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Decision Modal */}
      {selectedRequest && (
        <Modal 
          isOpen={true} 
          onClose={() => {
            if (!isProcessing) {
              setSelectedRequest(null)
              setSelectedAction(null)
            }
          }} 
          title={selectedAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        >
          <div className="space-y-8 py-6 px-1">
            <div className="flex items-center gap-6 rounded-[32px] bg-brand-50/50 p-6 border border-brand-100 shadow-sm">
               <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-brand-600 text-xl font-black text-white shadow-xl shadow-brand-100">
                  {getInitials(selectedRequest.employeeName)}
               </div>
               <div className="min-w-0">
                  <p className="text-xl font-black text-ink-900 tracking-tight leading-tight">{selectedRequest.employeeName}</p>
                  <div className="mt-1 flex items-center gap-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-brand-600">{selectedRequest.leaveType} APPLICATION</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 px-2">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Total Duration</p>
                  <p className="text-2xl font-black text-ink-900 leading-none">{selectedRequest.days} Days</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Operational Timeline</p>
                  <p className="text-sm font-black text-ink-700 leading-none">{new Date(selectedRequest.fromDate).toLocaleDateString()} — {new Date(selectedRequest.toDate).toLocaleDateString()}</p>
               </div>
            </div>

            <div className="space-y-3 px-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Applicant Submission</p>
               <div className="rounded-[24px] bg-ink-25 p-6 text-sm font-medium text-ink-600 leading-relaxed italic border border-ink-100 relative overflow-hidden">
                  "{selectedRequest.reason || 'No specific reasoning provided.'}"
                  <div className="absolute right-4 bottom-4 text-ink-100">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.3"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017C13.4647 8 13.017 8.44772 13.017 9V15C13.017 15.5523 12.5693 16 12.017 16H11.017C10.4647 16 10.017 16.4477 10.017 17V21M10.017 21H4.017C3.46472 21 3.017 20.5523 3.017 20V14C3.017 13.4477 3.46472 13 4.017 13H9.017C9.56929 13 10.017 12.5523 10.017 12V6M10.017 6V12"></path></svg>
                  </div>
               </div>
            </div>

            <div className="space-y-3 px-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-ink-300 ml-1">Official Review Memo</label>
               <textarea 
                 rows={3} 
                 value={note} 
                 onChange={(e) => setNote(e.target.value)} 
                 disabled={isProcessing}
                 placeholder="Provide decision context or work coverage instructions..." 
                 className="w-full rounded-[24px] bg-white px-6 py-4 text-sm font-bold text-ink-900 outline-none ring-2 ring-transparent transition focus:ring-brand-500/20 shadow-sm border border-ink-100 placeholder:text-ink-300 disabled:opacity-50" 
               />
            </div>

            <div className="flex gap-4">
               {selectedAction === 'reject' ? (
                 <button 
                   onClick={handleAction}
                   disabled={isProcessing}
                   className="flex-1 rounded-2xl bg-red-600 py-4 text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-red-100 transition hover:bg-red-700 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isProcessing && <Loader size="sm" color="white" />}
                   Confirm Rejection
                 </button>
               ) : (
                 <button 
                   onClick={handleAction}
                   disabled={isProcessing}
                   className="flex-1 rounded-2xl bg-emerald-600 py-4 text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-100 transition hover:bg-emerald-700 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   {isProcessing && <Loader size="sm" color="white" />}
                   Confirm Approval
                 </button>
               )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
