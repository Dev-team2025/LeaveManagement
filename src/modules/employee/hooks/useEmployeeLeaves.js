import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeLeaves() {
  const axiosInstance = useAxios()
  const [leaves, setLeaves] = useState([])
  const [isLoading, setLoading] = useState(true)

  const loadLeaves = async () => {
    setLoading(true)
    try {
      const response = await employeeService.getLeaves(axiosInstance)
      setLeaves(response)
    } catch (err) {
      console.error('Failed to load leave history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaves()
  }, [axiosInstance])

  return { leaves, isLoading, refresh: loadLeaves }
}

export default useEmployeeLeaves
