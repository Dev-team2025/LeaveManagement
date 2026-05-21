import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

export function useManagerDashboard() {
  const axiosInstance = useAxios()
  const [data, setData] = useState({
    cards: [],
    teamStats: {
      totalRequests: 0,
      unpaidCount: 0,
      totalDeductions: 0
    }
  })
  const [isLoading, setLoading] = useState(false)

  const loadDashboard = async () => {
    if (!axiosInstance) return
    setLoading(true)
    try {
      const response = await managerService.getDashboard(axiosInstance)
      setData(response)
    } catch (err) {
      console.error('Failed to load manager dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [axiosInstance])

  return { ...data, isLoading, refresh: loadDashboard }
}

export default useManagerDashboard
