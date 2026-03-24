import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import hrService from '@/modules/hr/services/hrService'

export function useHRLeaves() {
  const axiosInstance = useAxios()
  const [requests, setRequests] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadRequests = async () => {
      const response = await hrService.getLeaveRequests(axiosInstance)

      if (isMounted) {
        setRequests(response)
        setLoading(false)
      }
    }

    loadRequests()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  return { requests, isLoading }
}

export default useHRLeaves
