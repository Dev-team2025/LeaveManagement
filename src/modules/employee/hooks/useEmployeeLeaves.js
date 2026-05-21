import { useEffect, useState, useCallback } from 'react'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeLeaves() {
  const axiosInstance = useAxios()
  const [leaves, setLeaves] = useState([])
  const [isLoading, setLoading] = useState(true)

  const loadLeaves = useCallback(async () => {
    setLoading(true)
    try {
      const response = await employeeService.getLeaves(axiosInstance)
      if (Array.isArray(response)) {
        setLeaves(response)
      } else if (Array.isArray(response?.leaves)) {
        setLeaves(response.leaves)
      } else {
        setLeaves([])
      }
    } catch (err) {
      console.error('Failed to load leave history:', err)
    } finally {
      setLoading(false)
    }
  }, [axiosInstance])

  useEffect(() => {
    loadLeaves()
  }, [loadLeaves])

  return { leaves, isLoading, refresh: loadLeaves }
}

export default useEmployeeLeaves
