import { NavLink } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { SIDEBAR_LINKS } from '@/utils/constants'

function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth()
  const links = SIDEBAR_LINKS[role] || []

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-ink-900/35 backdrop-blur-sm transition lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/70 bg-ink-900 px-5 py-6 text-white shadow-2xl transition duration-300 lg:static lg:w-72 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-10">
          <p className="font-display text-2xl font-semibold">LMS Portal</p>
          <p className="mt-2 text-sm text-slate-300">Role-aware workspace and approvals hub</p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-white text-ink-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
