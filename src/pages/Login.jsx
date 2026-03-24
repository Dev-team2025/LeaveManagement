import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components/common'
import useAuth from '@/hooks/useAuth'
import authService from '@/services/authService'
import { getRoleHome } from '@/utils/helpers'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role, login } = useAuth()
  const [formData, setFormData] = useState({
    email: 'employee@demo.local',
    password: 'Password@123',
  })
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to={getRoleHome(role)} replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const data = await authService.login(formData)
      login(data)

      const redirectTo = location.state?.from?.pathname || getRoleHome(data.role || data.user?.role)
      navigate(redirectTo, { replace: true })
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-panel backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-ink-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200">
              Workforce operations
            </span>
            <h1 className="mt-6 max-w-md font-display text-5xl font-semibold leading-tight">
              Leave workflows for employees, managers, HR, and admins.
            </h1>
            <p className="mt-4 max-w-lg text-slate-300">
              Centralize requests, approvals, policies, and headcount visibility in one shared portal.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              ['24h', 'Average approval SLA'],
              ['4', 'Role-specific workspaces'],
              ['100%', 'Policy visibility'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl bg-white/10 p-4">
                <p className="font-display text-3xl font-semibold">{value}</p>
                <p className="mt-2 text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              Sign in
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Use a demo email like `employee@demo.local`, `hr@demo.local`, `manager@demo.local`, or `admin@demo.local`.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger-500">
                  {error}
                </div>
              ) : null}
              <Button type="submit" className="w-full" loading={isSubmitting}>
                Sign in
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
