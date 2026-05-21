import { API_ENDPOINTS } from '@/utils/constants'

export const hrService = {
  async getDashboard(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.HR.DASHBOARD)
    return data
  },
  async getLeaveRequests(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.HR.REQUESTS)
    return data
  },
  async approveLeaveRequest(axiosInstance, requestId, reason = '') {
    const { data } = await axiosInstance.post(`/hr/requests/${requestId}/approve`, { reason })
    return data
  },
  async rejectLeaveRequest(axiosInstance, requestId, reason = '') {
    const { data } = await axiosInstance.post(`/hr/requests/${requestId}/reject`, { reason })
    return data
  },
  async getEmployees(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.HR.EMPLOYEES)
    return data
  },
  async updateEmployee(axiosInstance, employeeId, updates) {
    const { data } = await axiosInstance.put(`/hr/employees/${employeeId}`, updates)
    return data
  },
}

export default hrService
