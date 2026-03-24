import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import useEmployeeProfile from '@/modules/employee/hooks/useEmployeeProfile'

function DashboardIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
    </svg>
  )
}

function ApplyIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6l2 2v16H9z" />
      <path d="M9 3v5h5" />
      <path d="M12 12v6" />
      <path d="M9 15h6" />
    </svg>
  )
}

function LeavesIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7h13" />
      <path d="M8 12h13" />
      <path d="M8 17h13" />
      <path d="M3 7h.01" />
      <path d="M3 12h.01" />
      <path d="M3 17h.01" />
    </svg>
  )
}

function ProfileIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  )
}

function LogoutIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : ''
  return `${first}${last}`.toUpperCase()
}

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { profile } = useEmployeeProfile()

  const links = useMemo(
    () => [
      { label: 'Dashboard', to: '/employee/dashboard', icon: DashboardIcon },
      { label: 'Apply Leave', to: '/employee/apply-leave', icon: ApplyIcon },
      { label: 'My Leaves', to: '/employee/my-leaves', icon: LeavesIcon },
      { label: 'Profile', to: '/employee/profile', icon: ProfileIcon },
    ],
    [],
  )

  const initials = getInitials(profile?.name)

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        className={`fixed inset-0 z-20 bg-ink-900/15 transition lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-ink-50 px-5 py-6 text-ink-900 shadow-sm ring-1 ring-ink-100 transition duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8">
          <p className="text-lg font-display font-semibold text-brand-600">Leave Portal</p>
          <p className="mt-1 text-sm text-ink-500">Employee Management</p>
        </div>

        <nav className="space-y-3">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-white hover:text-ink-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-8">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">{profile?.name || 'Employee'}</p>
              <p className="truncate text-xs text-ink-500">{profile?.role || 'Employee'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-ink-600 transition hover:bg-white hover:text-ink-900"
          >
            <LogoutIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
