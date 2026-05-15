import { API_ENDPOINTS, LEAVE_TYPES } from '@/utils/constants'

export const employeeService = {
  async getDashboard(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.EMPLOYEE.DASHBOARD)
    return data
  },

  async getLeaves(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.EMPLOYEE.LEAVES)
    return data
  },

  async getProfile(axiosInstance) {
    const { data } = await axiosInstance.get('/employee/profile')
    return data.user
  },

  async updateProfile(axiosInstance, payload) {
    const { data } = await axiosInstance.put('/employee/profile', payload)
    return data.user
  },

  async getLeaveTypes(axiosInstance) {
    try {
      const { data } = await axiosInstance.get('/employee/leave-types')
      return data
    } catch {
      return LEAVE_TYPES
    }
  },

  async submitLeave(axiosInstance, payload) {
    const { data } = await axiosInstance.post(API_ENDPOINTS.EMPLOYEE.APPLY, payload)
    return data
  },
}

export default employeeService
