import { useMemo } from 'react'
import { useAppData } from '@/context/AppDataContext'
import useAuth from '@/hooks/useAuth'
import { getEmployeeById } from '@/data/mockData'

export default function WFHRequests() {
  const { leaveRequests, employees, approveLeave, rejectLeave } = useAppData()
  const { user } = useAuth()
  const managerId = user?.id || 'EMP003'

  const teamEmployees = useMemo(
    () => employees.filter((e) => e.managerId === managerId),
    [employees, managerId]
  )

  const wfhRequests = useMemo(
    () => leaveRequests
      .filter((r) => r.leaveType === 'WFH' && teamEmployees.some(e => e.id === r.employeeId))
      .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn)),
    [leaveRequests, teamEmployees]
  )

  return (
    <section className="space-y-8 pb-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-ink-900">WFH <span className="text-brand-600">Authorisation</span></h1>
          <p className="mt-1 text-sm font-bold text-ink-400 font-medium">Manage remote work requests and special arrangements.</p>
        </div>
      </div>

      {/* Policy Reminder Banner */}
      <div className="rounded-[32px] bg-indigo-600 p-8 shadow-xl shadow-indigo-100 text-white flex items-center gap-8 relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
           <h3 className="text-xl font-black uppercase tracking-tight">Standard WFH Policy</h3>
           <p className="text-indigo-100 text-sm font-medium leading-relaxed">
             WFH requests should only be approved for emergency circumstances or pre-approved professional needs. Ensure the team member has a stable connection and is accessible during core hours.
           </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-[-20deg] translate-x-20"></div>
        <div className="hidden lg:flex relative z-10 ml-auto h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
      </div>

       {/* WFH Request List */}
       <div className="grid gap-6">
        {wfhRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-ink-100 bg-ink-25/50 py-24 text-center">
             <h3 className="text-lg font-black text-ink-900">No Pending WFH Requests</h3>
             <p className="text-sm font-bold text-ink-400 mt-1">Your team is fully on-site or accounted for.</p>
          </div>
        ) : (
          wfhRequests.map((req) => {
            const emp = getEmployeeById(req.employeeId)
            return (
              <div key={req.id} className="group flex flex-col gap-8 rounded-[40px] border border-ink-100 bg-white p-8 shadow-panel transition hover:shadow-xl sm:flex-row sm:items-center">
                <div className="flex items-center gap-5 flex-1">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-indigo-50 text-indigo-600 font-black text-sm border border-indigo-100">
                    {emp?.avatar || '??'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-ink-900">{emp?.name}</p>
                    <p className="text-xs font-black uppercase tracking-widest text-ink-400 mt-1">{emp?.designation}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-ink-300">Requested Period</p>
                   <p className="text-base font-black text-ink-900">
                     {new Date(req.fromDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — {new Date(req.toDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                   </p>
                </div>

                <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-ink-300 mb-2">Reasoning</p>
                   <p className="text-sm font-bold text-ink-600 leading-tight line-clamp-1 italic">"{req.reason}"</p>
                </div>

                <div className="flex gap-3">
                   {req.status === 'pending' ? (
                     <>
                        <button 
                          onClick={() => rejectLeave(req.id, 'WFH rejected')}
                          className="rounded-2xl border border-red-100 px-6 py-3.5 text-[10px] font-black text-red-600 uppercase tracking-widest transition hover:bg-red-600 hover:text-white"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => approveLeave(req.id, 'WFH approved')}
                          className="rounded-2xl bg-brand-600 px-8 py-3.5 text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-brand-100 transition hover:bg-brand-700"
                        >
                          Approve WFH
                        </button>
                     </>
                   ) : (
                     <div className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest border ${
                        req.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                     }`}>
                        {req.status}
                     </div>
                   )}
                </div>
              </div>
            )
          })
        )}
       </div>
    </section>
  )
}
