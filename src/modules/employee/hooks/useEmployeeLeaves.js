import { useEffect, useState } from 'react'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeLeaves() {
  const [leaves, setLeaves] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadLeaves = async () => {
      const response = await employeeService.getLeaves()

      if (isMounted) {
        setLeaves(response)
        setLoading(false)
      }
    }

    loadLeaves()

    return () => {
      isMounted = false
    }
  }, [])

  return { leaves, isLoading }
}

export default useEmployeeLeaves
