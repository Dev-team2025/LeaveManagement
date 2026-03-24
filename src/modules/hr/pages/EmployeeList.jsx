import { useEffect, useState } from 'react'
import { Loader } from '@/components/common'
import useAxios from '@/hooks/useAxios'
import hrService from '@/modules/hr/services/hrService'

function EmployeeList() {
  const axiosInstance = useAxios()
  const [employees, setEmployees] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadEmployees = async () => {
      const response = await hrService.getEmployees(axiosInstance)

      if (isMounted) {
        setEmployees(response)
        setLoading(false)
      }
    }

    loadEmployees()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  if (isLoading) {
    return <Loader label="Loading employee directory" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">HR workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">Employee directory</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {employees.map((employee) => (
          <article key={employee.id} className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-panel">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{employee.id}</p>
            <h2 className="mt-3 text-xl font-semibold text-ink-900">{employee.name}</h2>
            <p className="mt-2 text-sm text-ink-500">{employee.department}</p>
            <p className="mt-1 text-sm capitalize text-brand-600">{employee.role}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EmployeeList
