import { useEffect, useMemo, useState } from 'react'
import { Loader } from '@/components/common'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center py-3.5 border-b border-[#F1F5F9] last:border-0">
      <span className="w-40 shrink-0 text-sm text-[#94A3B8]">{label}</span>
      <span className="text-sm font-medium text-[#0F172A]">{value || '—'}</span>
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
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1D4ED8]">My Workspace</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#0F172A]">My Profile</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">Your personal and employment information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4 rounded-[20px] border border-[#E5E7EB] bg-white p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EFF6FF] text-2xl font-bold text-[#1D4ED8]">
            {avatar}
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#0F172A]">{profile?.name || '—'}</p>
            <p className="text-sm text-[#64748B] capitalize">{profile?.role || 'employee'}</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 capitalize">
            active
          </span>
          <div className="w-full border-t border-[#F1F5F9] pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Employee ID</span>
              <span className="font-medium text-[#334155]">{profile?.id || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Department</span>
              <span className="font-medium text-[#334155]">{profile?.department || '—'}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
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
                  onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#334155]">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-[#334155] outline-none focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/10"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-[#1D4ED8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF] transition disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div>
              <InfoRow label="Full Name" value={profile?.name} />
              <InfoRow label="Email Address" value={profile?.email} />
              <InfoRow label="Phone Number" value={profile?.phone} />
              <InfoRow label="Location" value={profile?.location} />
              <InfoRow label="Department" value={profile?.department} />
              <InfoRow label="Role" value={profile?.role} />
            </div>
          )}

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger-500">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
