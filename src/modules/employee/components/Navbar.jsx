function Navbar({ profile, onToggleSidebar }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border border-white/60 bg-white/85 px-4 py-4 shadow-panel backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-2xl bg-ink-100 p-3 text-ink-700 transition hover:bg-ink-200 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Leave Portal</p>
          <h1 className="font-display text-xl font-semibold text-ink-900">Workspace</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden rounded-2xl bg-ink-50 px-4 py-2 text-right sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">{today}</p>
          <p className="text-sm font-semibold text-ink-900">{profile?.department || 'Department'}</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-ink-50 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white">
            {profile?.avatar || (profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'ME')}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink-900">{profile?.name || 'Employee'}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-500">{profile?.role || 'Employee'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
