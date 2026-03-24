import { Button } from '@/components/common'
import useAuth from '@/hooks/useAuth'
import { ROLE_LABELS } from '@/utils/constants'

function Navbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/70 bg-white/75 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-2xl bg-ink-100 p-3 text-ink-700 transition hover:bg-ink-200 lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">Leave Management</p>
          <p className="text-sm text-ink-500">Track approvals, balances, and role workflows</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl bg-ink-50 px-4 py-2 text-right sm:block">
          <p className="text-sm font-semibold text-ink-900">{user?.name || 'Authenticated User'}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-500">
            {ROLE_LABELS[role] || 'Member'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

export default Navbar
