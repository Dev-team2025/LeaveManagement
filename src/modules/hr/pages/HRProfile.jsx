import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center py-4 first:pt-0 last:pb-0">
      <span className="w-48 shrink-0 text-sm font-bold text-ink-400 uppercase tracking-widest text-[10px]">{label}</span>
      <span className="text-sm font-bold text-ink-900">{value || '—'}</span>
    </div>
  )
}

export default function HRProfile() {
  const { user, setUser } = useAuth()
  const axiosInstance = useAxios()
  const [editing, setEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({ 
    phone: user.phone || '', 
    location: user.location || '' 
  })

  async function handleSave() {
    setIsSaving(true)
    try {
      const updatedUser = await employeeService.updateProfile(axiosInstance, form)
      setUser(updatedUser)
      setEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">My Profile</h1>
          <p className="mt-1 text-sm text-ink-500">Manage your personal and employment information</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Avatar Card */}
        <div className="flex flex-col items-center rounded-[40px] border border-ink-100 bg-white p-10 text-center shadow-panel">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-[40px] bg-brand-50 text-4xl font-black text-brand-600 shadow-inner">
              {user.name?.[0]?.toUpperCase() || 'HR'}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white">
              <div className="h-full w-full rounded-xl bg-emerald-500 shadow-sm" title="Active Status" />
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-black text-ink-900">{user.name}</h2>
            <p className="mt-1 text-sm font-bold text-brand-600 capitalize">{user.role}</p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-4 rounded-3xl bg-ink-25 p-6 border border-ink-50">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-ink-400 uppercase tracking-widest text-[10px]">Email</span>
              <span className="font-black text-ink-900 truncate ml-2">{user.email}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-ink-400 uppercase tracking-widest text-[10px]">Department</span>
              <span className="font-black text-ink-900">{user.department}</span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="rounded-[40px] border border-ink-100 bg-white p-10 shadow-panel">
          <div className="mb-10 flex items-center justify-between">
            <h3 className="text-xl font-black text-ink-900">Personal Information</h3>
            <button
              onClick={() => setEditing((e) => !e)}
              disabled={isSaving}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                editing 
                  ? 'bg-ink-100 text-ink-600 hover:bg-ink-200' 
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-100 shadow-sm'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {editing ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                )}
              </svg>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink-400">Phone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-2xl border border-ink-100 bg-ink-50 px-5 py-4 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-ink-400">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full rounded-2xl border border-ink-100 bg-ink-50 px-5 py-4 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </div>
              <div className="pt-4 sm:col-span-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-brand-600 px-10 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-ink-50">
              {[
                { label: 'Full Name', value: user.name },
                { label: 'Email Address', value: user.email },
                { label: 'Phone Number', value: user.phone },
                { label: 'Location', value: user.location },
                { label: 'Department', value: user.department },
                { label: 'Role', value: user.role.toUpperCase() },
              ].map((row) => (
                <InfoRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
