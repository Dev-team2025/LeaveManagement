import useAuth from '@/hooks/useAuth'

export default function ManagerProfile() {
  const { user } = useAuth()

  return (
    <section className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="space-y-1">
        <h1 className="font-display text-4xl font-black text-ink-900 tracking-tight">Manager <span className="text-brand-600">Profile</span></h1>
        <p className="text-sm font-bold text-ink-400 uppercase tracking-widest">Account & Personal Intelligence</p>
      </div>

      <div className="rounded-[40px] border border-ink-100 bg-white p-10 shadow-panel">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
           <div className="flex h-24 w-24 items-center justify-center rounded-[32px] bg-brand-600 font-display text-3xl font-black text-white shadow-xl shadow-brand-200 uppercase">
              {user?.name?.slice(0, 2) || 'M'}
           </div>
           <div className="flex-1">
              <h2 className="text-2xl font-black text-ink-900 leading-tight">{user?.name}</h2>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-[0.2em]">{user?.role || 'Manager'}</p>
              <p className="mt-2 text-sm font-medium text-ink-400">{user?.email}</p>
           </div>
           <button className="rounded-2xl bg-ink-900 px-6 py-3 text-xs font-black text-white shadow-lg transition hover:scale-105 active:scale-95">
              EDIT ACCOUNT
           </button>
        </div>

        <div className="mt-12 grid gap-6 border-t border-ink-50 pt-10 sm:grid-cols-2">
           <div className="rounded-3xl bg-ink-25 p-6 border border-ink-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-300 mb-1">Employee ID</p>
              <p className="text-sm font-bold text-ink-900">{user?.id || '—'}</p>
           </div>
           <div className="rounded-3xl bg-ink-25 p-6 border border-ink-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-ink-300 mb-1">Department</p>
              <p className="text-sm font-bold text-ink-900">Operations & Management</p>
           </div>
        </div>
      </div>
    </section>
  )
}
