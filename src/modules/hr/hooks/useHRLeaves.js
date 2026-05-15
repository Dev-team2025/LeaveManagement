import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import hrService from '@/modules/hr/services/hrService'

export function useHRLeaves() {
  const axiosInstance = useAxios()
  const [requests, setRequests] = useState([])
  const [isLoading, setLoading] = useState(true)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const response = await hrService.getLeaveRequests(axiosInstance)
      setRequests(response)
    } catch (err) {
      console.error('Failed to load leave requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [axiosInstance])

  return { requests, isLoading, refresh: loadRequests }
}

export default useHRLeaves
