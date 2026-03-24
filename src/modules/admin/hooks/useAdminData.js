import { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import adminService from '@/modules/admin/services/adminService'

export function useAdminData() {
  const axiosInstance = useAxios()
  const [users, setUsers] = useState([])
  const [leaveTypes, setLeaveTypes] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadAdminData = async () => {
      const [userResponse, leaveTypeResponse] = await Promise.all([
        adminService.getUsers(axiosInstance),
        adminService.getLeaveTypes(axiosInstance),
      ])

      if (isMounted) {
        setUsers(userResponse)
        setLeaveTypes(leaveTypeResponse)
        setLoading(false)
      }
    }

    loadAdminData()

    return () => {
      isMounted = false
    }
  }, [axiosInstance])

  return { users, leaveTypes, isLoading }
}

export default useAdminData
