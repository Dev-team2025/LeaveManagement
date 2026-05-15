import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import managerService from '@/modules/manager/services/managerService'

export function useManagerLeaves() {
  const axiosInstance = useAxios()
  const [teamLeaves, setTeamLeaves] = useState([])
  const [isLoading, setLoading] = useState(true)

  const loadTeamLeaves = async () => {
    setLoading(true)
    try {
      const response = await managerService.getTeamLeaves(axiosInstance)
      setTeamLeaves(response)
    } catch (err) {
      console.error('Failed to load team leaves:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeamLeaves()
  }, [axiosInstance])

  return { teamLeaves, isLoading, refresh: loadTeamLeaves }
}

export default useManagerLeaves
