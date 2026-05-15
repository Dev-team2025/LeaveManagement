import { useState, useMemo } from 'react'
import { Loader } from '@/components/common'
import LeaveTable from '@/modules/employee/components/LeaveTable'
import useEmployeeLeaves from '@/modules/employee/hooks/useEmployeeLeaves'

function MyLeaves() {
  const { leaves, isLoading } = useEmployeeLeaves()
  const [search, setSearch] = useState('')

  const filteredLeaves = useMemo(() => {
    if (!search) return leaves
    const term = search.toLowerCase()
    return leaves.filter((l) => 
      l.leaveType.toLowerCase().includes(term) || 
      l.status.toLowerCase().includes(term) ||
      l.fromDate.includes(term) ||
      l.toDate.includes(term)
    )
  }, [leaves, search])

  if (isLoading) {
    return <Loader label="Loading leave history" />
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink-900">My Leaves</h2>
          <p className="mt-1 text-sm text-ink-500 font-medium">
            Track and manage your personal leave history and current requests.
          </p>
        </div>
        
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search leaves…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-ink-100 bg-white pl-11 pr-5 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 lg:w-80 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase tracking-widest text-ink-400">
            {filteredLeaves.length} {filteredLeaves.length === 1 ? 'Request' : 'Requests'} Found
          </span>
        </div>
        <LeaveTable rows={filteredLeaves} />
      </div>
    </section>
  )
}

export default MyLeaves
