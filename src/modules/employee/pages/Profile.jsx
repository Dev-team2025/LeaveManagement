import { useOutletContext } from 'react-router-dom'
import InputField from '@/modules/employee/components/InputField'
import Button from '@/modules/employee/components/Button'

function Profile() {
  const { profile } = useOutletContext()

  return (
    <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <article className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand-600 text-2xl font-semibold text-white">
            {profile.avatar}
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">{profile.name}</h2>
            <p className="mt-1 text-sm text-ink-500">{profile.role}</p>
          </div>
        </div>

        <dl className="mt-8 space-y-4">
          {[
            ['Employee ID', profile.id],
            ['Department', profile.department],
            ['Manager', profile.manager],
            ['Location', profile.location],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-ink-50 px-4 py-3">
              <dt className="text-xs uppercase tracking-[0.18em] text-ink-400">{label}</dt>
              <dd className="mt-2 text-sm font-medium text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <article className="rounded-[32px] border border-ink-100 bg-white p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">Personal Details</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900">Profile</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InputField label="Full Name" value={profile.name} readOnly />
          <InputField label="Email Address" value={profile.email} readOnly />
          <InputField label="Phone Number" value={profile.phone} readOnly />
          <InputField label="Department" value={profile.department} readOnly />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="secondary">Edit Profile</Button>
        </div>
      </article>
    </section>
  )
}

export default Profile
