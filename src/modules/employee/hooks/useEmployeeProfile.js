import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import employeeService from '@/modules/employee/services/employeeService'

export function useEmployeeProfile() {
  const axiosInstance = useAxios()
  const [profile, setProfile] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const response = await employeeService.getProfile(axiosInstance)

      if (isMounted) {
        setProfile(response)
        setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  return { profile, isLoading }
}

export default useEmployeeProfile
