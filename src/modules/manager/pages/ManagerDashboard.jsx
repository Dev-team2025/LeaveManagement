import { useEffect, useState } from 'react'
import { Loader } from '@/components/common'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

function ManagerDashboard() {
  const axiosInstance = useAxios()
  const [cards, setCards] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      const response = await managerService.getDashboard(axiosInstance)

      if (isMounted) {
        setCards(response.cards || [])
        setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  if (isLoading) {
    return <Loader label="Loading manager dashboard" />
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Manager workspace</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink-900">Team leave calendar</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.id} className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-panel">
            <p className="text-sm text-ink-500">{card.label}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-ink-900">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ManagerDashboard
