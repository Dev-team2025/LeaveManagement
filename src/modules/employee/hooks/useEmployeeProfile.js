import { useEffect, useState } from 'react'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeProfile() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const response = await employeeService.getProfile()

      if (isMounted) {
        setProfile(response)
        setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  return { profile, isLoading }
}

export default useEmployeeProfile
