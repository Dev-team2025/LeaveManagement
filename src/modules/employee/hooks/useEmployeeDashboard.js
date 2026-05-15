import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeDashboard() {
  const axiosInstance = useAxios()
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
      const response = await employeeService.getDashboard(axiosInstance)

      if (isMounted) {
        setDashboard(response)
        setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  return { dashboard, isLoading }
}

export default useEmployeeDashboard
