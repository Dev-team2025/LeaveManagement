import { API_ENDPOINTS, LEAVE_STATUS } from '@/utils/constants'

const dashboardFallback = {
  stats: [
    { id: 'requests', label: 'Open requests', value: 18 },
    { id: 'approved', label: 'Approved this week', value: 42 },
    { id: 'employees', label: 'Employees tracked', value: 126 },
  ],
}

const requestFallback = [
  { id: 'REQ-201', employee: 'Anita Rao', type: 'Annual', days: 3, status: LEAVE_STATUS.PENDING },
  { id: 'REQ-202', employee: 'Rohit Das', type: 'Sick', days: 1, status: LEAVE_STATUS.PENDING },
]

const employeeFallback = [
  { id: 'EMP-01', name: 'Anita Rao', department: 'Engineering', role: 'employee' },
  { id: 'EMP-02', name: 'Rohit Das', department: 'Finance', role: 'manager' },
]

export const hrService = {
  async getDashboard(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.HR.DASHBOARD)
      return data
    } catch {
      return dashboardFallback
    }
  },
  async getLeaveRequests(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.HR.REQUESTS)
      return data
    } catch {
      return requestFallback
    }
  },
  async getEmployees(axiosInstance) {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.HR.EMPLOYEES)
      return data
    } catch {
      return employeeFallback
    }
  },
}

export default hrService
