import { API_ENDPOINTS } from '@/utils/constants'

export const managerService = {
  async getDashboard(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGER.DASHBOARD)
    return data
  },
  async getTeamLeaves(axiosInstance) {
    const { data } = await axiosInstance.get(API_ENDPOINTS.MANAGER.TEAM_LEAVES)
    return data
  },
  async getPendingRequests(axiosInstance) {
    const { data } = await axiosInstance.get('/manager/requests/pending')
    return data
  },
  async getTeamMembers(axiosInstance) {
    const { data } = await axiosInstance.get('/manager/team-members')
    return data
  },
  async approveRequest(axiosInstance, requestId, reason = '') {
    const { data } = await axiosInstance.post(`/manager/requests/${requestId}/approve`, { reason })
    return data
  },
  async rejectRequest(axiosInstance, requestId, reason = '') {
    const { data } = await axiosInstance.post(`/manager/requests/${requestId}/reject`, { reason })
    return data
  },
}

export default managerService
