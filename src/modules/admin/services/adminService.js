import { API_ENDPOINTS } from '@/utils/constants'

const dashboardFallback = {
  stats: [
    { id: 'active-users', label: 'Active users', value: 284 },
    { id: 'roles', label: 'Roles configured', value: 4 },
    { id: 'leave-types', label: 'Leave types', value: 5 },
  ],
}

const userFallback = [
  { id: 'USR-01', name: 'Yashwanth Kumar', email: 'admin@company.com', role: 'admin' },
  { id: 'USR-02', name: 'Meera Nair', email: 'hr@company.com', role: 'hr' },
]

const leaveTypeFallback = [
  { id: 'LT-01', name: 'Annual Leave', quota: '18 days' },
  { id: 'LT-02', name: 'Sick Leave', quota: '10 days' },
]

export const adminService = {
  async getDashboard(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD)
      return data
    } catch {
      return dashboardFallback
    }
  },
  async getUsers(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS)
      return data
    } catch {
      return userFallback
    }
  },
  async getLeaveTypes(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.LEAVE_TYPES)
      return data
    } catch {
      return leaveTypeFallback
    }
  },
}

export default adminService
