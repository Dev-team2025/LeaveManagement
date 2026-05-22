import { useMemo, useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { Modal } from '@/components/common'

const ROLE_COLORS = { employee: 'bg-blue-50 text-blue-700', manager: 'bg-purple-50 text-purple-700', hr: 'bg-emerald-50 text-emerald-700', admin: 'bg-red-50 text-red-700' }
const STATUS_COLORS = { active: 'bg-emerald-50 text-emerald-700', inactive: 'bg-slate-100 text-slate-500' }

const ROLES_LIST = ['employee', 'manager', 'hr', 'admin']

export default function UserManagement() {
  const { employees, updateEmployee } = useAppData()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})

  const filtered = useMemo(() =>
    employees
      .filter((e) => roleFilter === 'all' || e.role === roleFilter)
      .filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase())),
    [employees, search, roleFilter],
  )

  function openEdit(emp) {
    setEditForm({
      role: emp.role,
      status: emp.status || (emp.isActive ? 'active' : 'inactive'),
      designation: emp.designation,
      baseSalary: emp.baseSalary || 0,
    })
    setEditModal(emp)
  }

  function saveEdit() {
    updateEmployee(editModal.id, editForm)
    setEditModal(null)
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Admin Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink-900">User Management</h1>
        <p className="mt-0.5 text-sm text-ink-500">View and manage all employee accounts and roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['all', ...ROLES_LIST].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition ${
                roleFilter === r ? 'bg-brand-600 text-white' : 'bg-white border border-ink-100 text-ink-500 hover:bg-ink-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-700 placeholder-ink-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:w-72"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[20px] border border-ink-100 bg-white">
        <table className="min-w-full divide-y divide-ink-50 text-sm">
          <thead>

            <tr className="bg-ink-50">
              {['Employee', 'ID', 'Department', 'Designation', 'Role', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{h}</th>

              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {filtered.map((emp) => (
              <tr key={emp.id} className="transition-colors hover:bg-ink-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{emp.name}</p>
                      <p className="text-xs text-ink-400">{emp.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-xs font-mono text-ink-500">{emp.id}</td>
                <td className="px-5 py-4 text-ink-700">{emp.department}</td>
                <td className="px-5 py-4 text-ink-700">{emp.designation}</td>

                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${ROLE_COLORS[emp.role] || 'bg-slate-100 text-slate-600'}`}>
                    {emp.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[emp.status] || 'bg-slate-100 text-slate-500'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => openEdit(emp)} className="rounded-lg border border-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-500 hover:bg-ink-50 transition">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={Boolean(editModal)} onClose={() => setEditModal(null)} title={`Edit — ${editModal?.name}`}>
        {editModal && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                {ROLES_LIST.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl border border-ink-100 bg-white px-4 py-2.5 text-sm text-ink-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">Designation</label>
              <input
                value={editForm.designation}
                onChange={(e) => setEditForm((f) => ({ ...f, designation: e.target.value }))}
                className="w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#334155]">Base Salary (Monthly)</label>
              <input
                type="number"
                value={editForm.baseSalary}
                onChange={(e) => setEditForm((f) => ({ ...f, baseSalary: Number(e.target.value) }))}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition">Save Changes</button>
              <button onClick={() => setEditModal(null)} className="flex-1 rounded-xl border border-ink-100 py-2.5 text-sm font-semibold text-ink-500 hover:bg-ink-50">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
