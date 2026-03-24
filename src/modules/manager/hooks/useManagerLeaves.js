import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

export function useManagerLeaves() {
  const axiosInstance = useAxios()
  const [teamLeaves, setTeamLeaves] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadTeamLeaves = async () => {
      const response = await managerService.getTeamLeaves(axiosInstance)

      if (isMounted) {
        setTeamLeaves(response)
        setLoading(false)
      }
    }

    loadTeamLeaves()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  return { teamLeaves, isLoading }
}

export default useManagerLeaves
