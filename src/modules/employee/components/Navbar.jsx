function Navbar({ profile, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/80 px-4 py-4 shadow-panel backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-2xl bg-ink-100 p-3 text-ink-700 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-600">Leave Management System</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">Employee Workspace</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="relative rounded-2xl bg-ink-100 p-3 text-ink-600">
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-sm font-bold">!</span>
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink-900">{profile?.name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{profile?.role}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 font-semibold text-white">
          {profile?.avatar}
        </div>
      </div>
    </header>
  )
}

export default Navbar
