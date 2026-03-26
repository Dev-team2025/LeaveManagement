import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { useAppData } from '@/context/AppDataContext'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-sm text-[#94A3B8]">{label}</span>
      <span className="text-sm font-medium text-[#0F172A]">{value || '—'}</span>
    </div>
  )
}

export default function HRProfile() {
  const { user } = useAuth()
  const { employees } = useAppData()
  const myId = user?.id || 'EMP004'
  const emp = employees.find((e) => e.id === myId) || employees.find((e) => e.role === 'hr') || {}

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ phone: emp.phone || '', designation: emp.designation || '' })

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">HR Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">My Profile</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Your personal and employment details</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Avatar Card */}
        <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[#E5E7EB] bg-white p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF] text-2xl font-bold text-[#1D4ED8]">
            {emp.avatar || 'SK'}
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#0F172A]">{emp.name}</p>
            <p className="text-sm text-[#64748B]">{emp.designation}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 capitalize">
            {emp.status || 'active'}
          </span>
          <div className="w-full border-t border-[#F1F5F9] pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Employee ID</span>
              <span className="font-medium text-[#334155]">{emp.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Role</span>
              <span className="font-medium capitalize text-[#334155]">{emp.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Department</span>
              <span className="font-medium text-[#334155]">{emp.department}</span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-semibold text-[#0F172A]">Personal Information</p>
            <button
              onClick={() => setEditing((e) => !e)}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F8F9FC] transition"
            >
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#334155]">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#334155]">Designation</label>
                <input
                  value={form.designation}
                  onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
                />
              </div>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {[
                { label: 'Full Name', value: emp.name },
                { label: 'Email Address', value: emp.email },
                { label: 'Phone Number', value: emp.phone },
                { label: 'Designation', value: emp.designation },
                { label: 'Department', value: emp.department },
                { label: 'Join Date', value: emp.joinDate ? new Date(emp.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
              ].map((row) => (
                <div key={row.label} className="py-3.5">
                  <InfoRow label={row.label} value={row.value} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
