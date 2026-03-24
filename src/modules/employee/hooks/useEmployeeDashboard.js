import { useEffect, useState } from 'react'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeDashboard() {
  const [dashboard, setDashboard] = useState({
    alerts: [],
    leaveTiles: [],
    upcomingLeaves: [],
    pendingRequests: [],
  })
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      const response = await employeeService.getDashboard()

      if (isMounted) {
        setDashboard(response)
        setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  return { dashboard, isLoading }
}

export default useEmployeeDashboard
