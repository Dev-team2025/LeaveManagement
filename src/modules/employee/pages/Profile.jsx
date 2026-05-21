import { useEffect, useMemo, useState } from 'react'
import { Button, Loader } from '@/components/common'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-50 py-3 last:border-0 sm:flex-row sm:items-center">
      <span className="w-40 shrink-0 text-sm text-ink-400">{label}</span>
      <span className="text-sm font-medium text-ink-900">{value || '—'}</span>
    </div>
  )
}

export default function Profile() {
  const axiosInstance = useAxios()
  const [profile, setProfile] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const user = await employeeService.getProfile(axiosInstance)
        if (!mounted) return
        setProfile(user)
      } catch (err) {
        if (!mounted) return
        setError(err.response?.data?.message || 'Unable to load profile.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [axiosInstance])

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ phone: '', location: '' })
  const [isSaving, setSaving] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      phone: profile.phone || '',
      location: profile.location || '',
    })
  }, [profile])

  const avatar = useMemo(() => {
    const name = profile?.name || ''
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
    return letters || 'ME'
  }, [profile?.name])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await employeeService.updateProfile(axiosInstance, form)
      setProfile(updated)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save profile changes.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <Loader label="Loading profile" />
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[28px] border border-ink-100 bg-white p-6 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Profile</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Your employee profile</h1>
        <p className="mt-2 text-sm text-ink-500">Keep contact details current and review your department details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-[24px] border border-ink-100 bg-white p-6 shadow-panel">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-600 text-2xl font-semibold text-white">
              {avatar}
            </div>
            <p className="mt-4 text-lg font-semibold text-ink-900">{profile?.name || '—'}</p>
            <p className="text-sm text-ink-500 capitalize">{profile?.role || 'employee'}</p>
            <span className="mt-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 capitalize">
              active
            </span>
          </div>
          <div className="mt-6 border-t border-ink-50 pt-4 text-sm text-ink-600">
            <div className="flex items-center justify-between">
              <span className="text-ink-400">Employee ID</span>
              <span className="font-semibold text-ink-900">{profile?.id || '—'}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-ink-400">Department</span>
              <span className="font-semibold text-ink-900">{profile?.department || '—'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] border border-ink-100 bg-white p-6 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-900">Personal Information</p>
              <Button variant="outline" size="sm" onClick={() => setEditing((value) => !value)}>
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-700">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    className="w-full rounded-2xl border border-ink-200 px-4 py-2.5 text-sm text-ink-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
                <Button onClick={handleSave} loading={isSaving} className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            ) : (
              <div>
                <InfoRow label="Full Name" value={profile?.name} />
                <InfoRow label="Email Address" value={profile?.email} />
                <InfoRow label="Phone Number" value={profile?.phone} />
                <InfoRow label="Location" value={profile?.location} />
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-ink-100 bg-white p-6 shadow-panel">
              <p className="text-sm font-semibold text-ink-900">Department Details</p>
              <div className="mt-3">
                <InfoRow label="Department" value={profile?.department} />
                <InfoRow label="Role" value={profile?.role} />
              </div>
            </div>
            <div className="rounded-[24px] border border-ink-100 bg-white p-6 shadow-panel">
              <p className="text-sm font-semibold text-ink-900">Account Settings</p>
              <div className="mt-3">
                <InfoRow label="Employee ID" value={profile?.id} />
                <InfoRow label="Status" value="Active" />
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger-500">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
