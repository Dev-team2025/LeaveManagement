import { useEffect, useState } from 'react'
import { Loader } from '@/components/common'
import useAxios from '@/hooks/useAxios'
import adminService from '@/modules/admin/services/adminService'

function AdminDashboard() {
  const axiosInstance = useAxios()
  const [stats, setStats] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      const response = await adminService.getDashboard(axiosInstance)

      if (isMounted) {
        setStats(response.stats || [])
        setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  if (isLoading) {
    return <Loader label="Loading admin controls" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Admin workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">System overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.id} className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-panel">
            <p className="text-sm text-ink-500">{stat.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-ink-900">{stat.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminDashboard
